#[cfg(test)]
mod tests {
    use rusqlite::Connection;
    use crate::logic::tax_calculation::{calculate_line_tax, calculate_invoice_summary};
    use crate::logic::credit_debit_note::generate_credit_debit_note_entries;
    use crate::logic::double_entry::validate_journal_entries;
    use crate::logic::fy_closing::close_financial_year;
    use crate::logic::bill_tracking::create_bill_new_ref;
    use crate::models::voucher_line_item::VoucherLineItem;

    // Helper function to set up in-memory database with schema
    fn setup_test_db() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        let schema_sql = include_str!("../db/schema.sql");
        conn.execute_batch(schema_sql).unwrap();
        conn
    }

    /// Scenario 1: Inter-state Sales Voucher (checks IGST calculation)
    #[test]
    fn test_interstate_sales_tax() {
        let line = calculate_line_tax(
            10.0,     // quantity
            100.0,    // rate
            18.0,     // gst_rate
            0.0,      // cess_rate
            "MH",     // place_of_supply (Maharashtra)
            "DL",     // company_state_code (Delhi)
        );

        assert_eq!(line.line_amount, 1000.0);
        assert_eq!(line.cgst_amount, 0.0);
        assert_eq!(line.sgst_amount, 0.0);
        assert_eq!(line.igst_amount, 180.0);
        assert_eq!(line.total_tax, 180.0);
        assert_eq!(line.unrounded_total, 1180.0);
    }

    /// Scenario 2: Intra-state Sales Voucher with rounding difference (checks CGST+SGST & Round Off)
    #[test]
    fn test_intrastate_sales_tax_with_rounding() {
        let line = calculate_line_tax(
            3.0,      // quantity
            33.33,    // rate -> 99.99
            18.0,     // gst_rate -> 17.9982 (CGST: 9.00, SGST: 9.00)
            0.0,      // cess_rate
            "DL",     // place_of_supply
            "DL",     // company_state_code
        );

        assert_eq!(line.line_amount, 99.99);
        assert_eq!(line.cgst_amount, 9.00);
        assert_eq!(line.sgst_amount, 9.00);

        let summary = calculate_invoice_summary(&[line]);
        assert_eq!(summary.total_line_amount, 99.99);
        assert_eq!(summary.unrounded_grand_total, 117.99);
        assert_eq!(summary.rounded_grand_total, 118.00);
        assert_eq!(summary.round_off_adjustment, 0.01);
    }

    /// Scenario 3: Credit Note against Sales Voucher (independent taxation & double-entry validation)
    #[test]
    fn test_credit_note_independent_taxation() {
        let line_item = VoucherLineItem {
            line_id: None,
            voucher_id: 2,
            item_id: Some(1),
            description: Some("Returned goods".into()),
            quantity: 1.0,
            rate: 100.0,
            line_amount: 100.0,
            gst_rate: 18.0,
            cess_rate: 0.0,
            cgst_amount: 9.0,
            sgst_amount: 9.0,
            igst_amount: 0.0,
            cess_amount: 0.0,
        };

        let entries = generate_credit_debit_note_entries(
            2,            // voucher_id
            "CreditNote", // voucher_type
            12,           // party_ledger_id (Sundry Debtors)
            2,            // cgst_ledger_id
            3,            // sgst_ledger_id
            4,            // igst_ledger_id
            1,            // round_off_ledger_id
            &[line_item],
            "DL",         // place_of_supply
            "DL",         // company_state_code
            "2026-04-01",
        ).unwrap();

        // 1. Party ledger should be credited with 118.0
        let party_entry = entries.iter().find(|e| e.ledger_id == 12).unwrap();
        assert_eq!(party_entry.entry_type, "Cr");
        assert_eq!(party_entry.amount, 118.0);

        // 2. Tax ledgers should be debited with 9.0 each
        let cgst_entry = entries.iter().find(|e| e.ledger_id == 2).unwrap();
        assert_eq!(cgst_entry.entry_type, "Dr");
        assert_eq!(cgst_entry.amount, 9.0);

        // 3. Double-entry validation on the CN entries + sales return entry
        let mut full_entries = entries.clone();
        full_entries.push(crate::models::journal_entry::JournalEntry {
            journal_entry_id: None,
            voucher_id: 2,
            ledger_id: 10, // Sales Returns (Expense/Direct)
            entry_type: "Dr".into(),
            amount: 100.0,
            entry_date: "2026-04-01".into(),
        });

        assert!(validate_journal_entries(&full_entries).is_ok());
    }

    /// Scenario 4: FY Closing (Asset/Liability carry-forward, Income/Expense reset, Unsettled Bill survival)
    #[test]
    fn test_fy_closing_and_unsettled_bill_survival() {
        let mut conn = setup_test_db();
        let tx = conn.transaction().unwrap();

        // Setup test Financial Year (FY2025-26)
        tx.execute(
            "INSERT INTO FinancialYears (fy_id, start_date, end_date, is_closed) VALUES (1, '2025-04-01', '2026-03-31', 0)",
            [],
        ).unwrap();

        // Create Sales Voucher with FY ID 1
        tx.execute(
            "INSERT INTO Vouchers (voucher_id, voucher_number, voucher_type, voucher_date, fy_id, party_ledger_id, total_amount, status)
             VALUES (10, 'INV-2025-001', 'Sales', '2025-05-10', 1, 12, 1180.0, 'Confirmed')",
            [],
        ).unwrap();

        // Create an unsettled Bill ("New Ref")
        create_bill_new_ref(&tx, 10, "INV-2025-001", 12, 1180.0, "2025-05-10", Some("2025-06-10")).unwrap();

        // Update opening balances for test ledgers:
        // Cash (Asset: group_id 5) -> Opening 5000.0 Dr
        tx.execute("UPDATE Ledgers SET opening_balance = 5000.0, opening_balance_type = 'Dr' WHERE ledger_id = 6", []).unwrap();

        // Sales Income (Income: group_id 8) -> Opening 10000.0 Cr
        tx.execute("INSERT INTO Ledgers (ledger_id, ledger_name, group_id, opening_balance, opening_balance_type) VALUES (20, 'Sales Revenue', 8, 10000.0, 'Cr')", []).unwrap();

        // Rent Expense (Expense: group_id 11) -> Opening 2000.0 Dr
        tx.execute("INSERT INTO Ledgers (ledger_id, ledger_name, group_id, opening_balance, opening_balance_type) VALUES (21, 'Rent Expense', 11, 2000.0, 'Dr')", []).unwrap();

        // Execute Financial Year Closing
        close_financial_year(&tx, 1).unwrap();

        // Assertions:
        // 1. Asset ledger (Cash) carried forward
        let cash_bal: f64 = tx.query_row("SELECT opening_balance FROM Ledgers WHERE ledger_id = 6", [], |r| r.get(0)).unwrap();
        assert_eq!(cash_bal, 5000.0);

        // 2. Income ledger (Sales Revenue) reset to 0.0
        let sales_bal: f64 = tx.query_row("SELECT opening_balance FROM Ledgers WHERE ledger_id = 20", [], |r| r.get(0)).unwrap();
        assert_eq!(sales_bal, 0.0);

        // 3. Expense ledger (Rent Expense) reset to 0.0
        let rent_bal: f64 = tx.query_row("SELECT opening_balance FROM Ledgers WHERE ledger_id = 21", [], |r| r.get(0)).unwrap();
        assert_eq!(rent_bal, 0.0);

        // 4. Unsettled Bill MUST STILL EXIST and remain open (is_settled = 0)
        let (bill_ref, bill_amt, is_settled): (String, f64, bool) = tx.query_row(
            "SELECT bill_reference, bill_amount, is_settled FROM Bills WHERE voucher_id = 10",
            [],
            |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?)),
        ).unwrap();

        assert_eq!(bill_ref, "INV-2025-001");
        assert_eq!(bill_amt, 1180.0);
        assert_eq!(is_settled, false);

        tx.commit().unwrap();
    }
}
