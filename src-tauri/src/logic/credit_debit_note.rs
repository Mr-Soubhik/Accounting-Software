use crate::models::journal_entry::JournalEntry;
use crate::models::voucher_line_item::VoucherLineItem;
use crate::logic::tax_calculation::{calculate_line_tax, calculate_invoice_summary};

/// Generates journal entries for an independent Credit/Debit Note based on its own line items (Tally rule).
/// Links to original_voucher_id purely for reference/audit trail.
pub fn generate_credit_debit_note_entries(
    voucher_id: i64,
    voucher_type: &str, // "CreditNote" or "DebitNote"
    party_ledger_id: i64,
    cgst_ledger_id: i64,
    sgst_ledger_id: i64,
    igst_ledger_id: i64,
    round_off_ledger_id: i64,
    line_items: &[VoucherLineItem],
    place_of_supply: &str,
    company_state_code: &str,
    entry_date: &str,
) -> Result<Vec<JournalEntry>, String> {
    let mut line_breakdowns = Vec::new();

    for item in line_items {
        let breakdown = calculate_line_tax(
            item.quantity,
            item.rate,
            item.gst_rate,
            item.cess_rate,
            place_of_supply,
            company_state_code,
        );
        line_breakdowns.push(breakdown);
    }

    let summary = calculate_invoice_summary(&line_breakdowns);
    let mut journal_entries = Vec::new();

    // Determine Dr vs Cr orientation based on voucher_type
    // CreditNote: Credits Party, Debits Sales/Tax Returns
    // DebitNote: Debits Party, Credits Purchase/Tax Returns
    let (party_type, tax_type) = match voucher_type {
        "CreditNote" => ("Cr", "Dr"),
        "DebitNote" => ("Dr", "Cr"),
        other => return Err(format!("Unsupported voucher_type '{}' for Credit/Debit Note engine", other)),
    };

    // 1. Party ledger entry for grand total
    journal_entries.push(JournalEntry {
        journal_entry_id: None,
        voucher_id,
        ledger_id: party_ledger_id,
        entry_type: party_type.to_string(),
        amount: summary.rounded_grand_total,
        entry_date: entry_date.to_string(),
    });

    // 2. Tax entries (CGST / SGST / IGST)
    if summary.total_cgst > 0.0 {
        journal_entries.push(JournalEntry {
            journal_entry_id: None,
            voucher_id,
            ledger_id: cgst_ledger_id,
            entry_type: tax_type.to_string(),
            amount: summary.total_cgst,
            entry_date: entry_date.to_string(),
        });
    }

    if summary.total_sgst > 0.0 {
        journal_entries.push(JournalEntry {
            journal_entry_id: None,
            voucher_id,
            ledger_id: sgst_ledger_id,
            entry_type: tax_type.to_string(),
            amount: summary.total_sgst,
            entry_date: entry_date.to_string(),
        });
    }

    if summary.total_igst > 0.0 {
        journal_entries.push(JournalEntry {
            journal_entry_id: None,
            voucher_id,
            ledger_id: igst_ledger_id,
            entry_type: tax_type.to_string(),
            amount: summary.total_igst,
            entry_date: entry_date.to_string(),
        });
    }

    // 3. Round off entry if needed
    if summary.round_off_adjustment.abs() > 0.001 {
        let round_type = if summary.round_off_adjustment > 0.0 { tax_type } else { party_type };
        journal_entries.push(JournalEntry {
            journal_entry_id: None,
            voucher_id,
            ledger_id: round_off_ledger_id,
            entry_type: round_type.to_string(),
            amount: summary.round_off_adjustment.abs(),
            entry_date: entry_date.to_string(),
        });
    }

    Ok(journal_entries)
}
