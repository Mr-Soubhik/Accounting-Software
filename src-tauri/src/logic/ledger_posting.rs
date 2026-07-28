use rusqlite::{Transaction, Result, params};

/// Recalculates and updates LedgerRunningBalance for a given ledger_id using Tally's exact formula:
/// signed_balance = opening_signed + total_Dr - total_Cr.
/// Displays as Dr if signed_balance >= 0, or Cr if signed_balance < 0.
pub fn sync_ledger_running_balance(tx: &Transaction, ledger_id: i64) -> Result<()> {
    // 1. Fetch opening balance details from Ledgers
    let (opening_bal, opening_type): (f64, String) = tx.query_row(
        "SELECT opening_balance, opening_balance_type FROM Ledgers WHERE ledger_id = ?",
        params![ledger_id],
        |row| Ok((row.get(0)?, row.get(1)?)),
    )?;

    let opening_signed = match opening_type.as_str() {
        "Dr" => opening_bal,
        "Cr" => -opening_bal,
        _ => opening_bal,
    };

    // 2. Sum total Dr and Cr from JournalEntries for this ledger
    let sum_dr: f64 = tx.query_row(
        "SELECT COALESCE(SUM(amount), 0.0) FROM JournalEntries WHERE ledger_id = ? AND entry_type = 'Dr'",
        params![ledger_id],
        |row| row.get(0),
    )?;

    let sum_cr: f64 = tx.query_row(
        "SELECT COALESCE(SUM(amount), 0.0) FROM JournalEntries WHERE ledger_id = ? AND entry_type = 'Cr'",
        params![ledger_id],
        |row| row.get(0),
    )?;

    // 3. Tally running balance formula: total Dr - total Cr
    let net = opening_signed + sum_dr - sum_cr;

    let (final_balance, final_type) = if net >= 0.0 {
        (net, "Dr".to_string())
    } else {
        (-net, "Cr".to_string())
    };

    // 4. Update LedgerRunningBalance table atomically
    tx.execute(
        "INSERT INTO LedgerRunningBalance (ledger_id, balance, balance_type, last_updated)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(ledger_id) DO UPDATE SET
            balance = excluded.balance,
            balance_type = excluded.balance_type,
            last_updated = CURRENT_TIMESTAMP",
        params![ledger_id, final_balance, final_type],
    )?;

    Ok(())
}
