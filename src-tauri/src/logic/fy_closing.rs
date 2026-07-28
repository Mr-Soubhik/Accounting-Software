use rusqlite::{Transaction, Connection, Result, params};

/// Verifies that a financial year is not closed before allowing voucher entry/modification.
pub fn check_fy_open(conn: &Connection, fy_id: i64) -> Result<(), String> {
    let is_closed: bool = conn
        .query_row(
            "SELECT is_closed FROM FinancialYears WHERE fy_id = ?",
            params![fy_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Financial Year ID {} not found: {}", fy_id, e))?;

    if is_closed {
        return Err(format!(
            "Financial Year ID {} is CLOSED. New entries and modifications are blocked.",
            fy_id
        ));
    }

    Ok(())
}

/// Executes the one-time routine to close a Financial Year and carry forward ledger closing balances.
pub fn close_financial_year(
    tx: &Transaction,
    closing_fy_id: i64,
) -> Result<(), String> {
    // 1. Mark Financial Year as closed
    tx.execute(
        "UPDATE FinancialYears SET is_closed = 1 WHERE fy_id = ?",
        params![closing_fy_id],
    )
    .map_err(|e| format!("Failed to close Financial Year {}: {}", closing_fy_id, e))?;

    // 2. Query all active ledgers
    let mut stmt = tx
        .prepare("SELECT ledger_id, opening_balance, opening_balance_type FROM Ledgers WHERE is_active = 1")
        .map_err(|e| e.to_string())?;

    let ledger_rows = stmt
        .query_map([], |row| {
            Ok((
                row.get::<_, i64>(0)?,
                row.get::<_, f64>(1)?,
                row.get::<_, String>(2)?,
            ))
        })
        .map_err(|e| e.to_string())?;

    for ledger in ledger_rows {
        let (ledger_id, opening_bal, opening_type) = ledger.map_err(|e| e.to_string())?;

        // Sum Dr and Cr for this ledger in the closing FY
        let sum_dr: f64 = tx
            .query_row(
                "SELECT COALESCE(SUM(j.amount), 0.0) 
                 FROM JournalEntries j
                 JOIN Vouchers v ON j.voucher_id = v.voucher_id
                 WHERE j.ledger_id = ? AND v.fy_id = ? AND j.entry_type = 'Dr'",
                params![ledger_id, closing_fy_id],
                |row| row.get(0),
            )
            .unwrap_or(0.0);

        let sum_cr: f64 = tx
            .query_row(
                "SELECT COALESCE(SUM(j.amount), 0.0) 
                 FROM JournalEntries j
                 JOIN Vouchers v ON j.voucher_id = v.voucher_id
                 WHERE j.ledger_id = ? AND v.fy_id = ? AND j.entry_type = 'Cr'",
                params![ledger_id, closing_fy_id],
                |row| row.get(0),
            )
            .unwrap_or(0.0);

        let net = match opening_type.as_str() {
            "Dr" => opening_bal + sum_dr - sum_cr,
            "Cr" => opening_bal + sum_cr - sum_dr,
            _ => opening_bal + sum_dr - sum_cr,
        };

        let (closing_bal, closing_type) = if net >= 0.0 {
            (net, opening_type)
        } else {
            let opp_type = if opening_type == "Dr" { "Cr" } else { "Dr" };
            (-net, opp_type.to_string())
        };

        // Update ledger's opening balance for the upcoming year
        tx.execute(
            "UPDATE Ledgers SET opening_balance = ?, opening_balance_type = ? WHERE ledger_id = ?",
            params![closing_bal, closing_type, ledger_id],
        )
        .map_err(|e| format!("Failed to update closing balance for ledger {}: {}", ledger_id, e))?;
    }

    Ok(())
}
