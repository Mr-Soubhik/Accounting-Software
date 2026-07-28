use rusqlite::{Transaction, Result, params};
use crate::models::journal_entry::JournalEntry;

/// Structure representing tax reversal entries generated for a Credit/Debit Note.
pub struct TaxReversalResult {
    pub reversing_entries: Vec<JournalEntry>,
}

/// Generates proportional tax reversal journal entries when a Credit or Debit Note is linked to an original voucher.
pub fn generate_tax_reversals(
    tx: &Transaction,
    credit_debit_voucher_id: i64,
    original_voucher_id: i64,
    note_total_amount: f64,
    entry_date: &str,
) -> Result<Vec<JournalEntry>, String> {
    // 1. Fetch original voucher total amount
    let orig_total: f64 = tx
        .query_row(
            "SELECT total_amount FROM Vouchers WHERE voucher_id = ?",
            params![original_voucher_id],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to find original voucher {}: {}", original_voucher_id, e))?;

    if orig_total <= 0.0 {
        return Err(format!("Original voucher {} total amount must be > 0", original_voucher_id));
    }

    let ratio = (note_total_amount / orig_total).min(1.0);

    // 2. Fetch tax journal entries associated with the original voucher.
    // Tax ledgers belong to group 'Duties & Taxes' (group_id = 14) or system tax ledgers (CGST/SGST/IGST/Cess)
    let mut stmt = tx
        .prepare(
            "SELECT j.ledger_id, j.entry_type, j.amount
             FROM JournalEntries j
             JOIN Ledgers l ON j.ledger_id = l.ledger_id
             WHERE j.voucher_id = ? AND (l.group_id = 14 OR l.ledger_name LIKE '%GST%' OR l.ledger_name LIKE '%Cess%')",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(params![original_voucher_id], |row| {
            Ok((
                row.get::<_, i64>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, f64>(2)?,
            ))
        })
        .map_err(|e| e.to_string())?;

    let mut reversing_entries = Vec::new();

    for row in rows {
        let (ledger_id, orig_entry_type, orig_amount) = row.map_err(|e| e.to_string())?;
        let reversed_amount = (orig_amount * ratio * 100.0).round() / 100.0;

        if reversed_amount > 0.0 {
            // Reverse Dr to Cr and Cr to Dr
            let reversed_type = match orig_entry_type.as_str() {
                "Dr" => "Cr",
                "Cr" => "Dr",
                _ => "Cr",
            };

            reversing_entries.push(JournalEntry {
                journal_entry_id: None,
                voucher_id: credit_debit_voucher_id,
                ledger_id,
                entry_type: reversed_type.to_string(),
                amount: reversed_amount,
                entry_date: entry_date.to_string(),
            });
        }
    }

    Ok(reversing_entries)
}
