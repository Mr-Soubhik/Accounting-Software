use rusqlite::{Transaction, Result, params};

/// Recalculates and updates the LedgerRunningBalance for a given ledger_id within an active transaction.
pub fn sync_ledger_running_balance(tx: &Transaction, ledger_id: i64) -> Result<()> {
    // 1. Fetch opening balance details from Ledgers
    let (opening_bal, opening_type): (f64, String) = tx.query_row(
        "SELECT opening_balance, opening_balance_type FROM Ledgers WHERE ledger_id = ?",
        params![ledger_id],
        |row| Ok((row.get(0)?, row.get(1)?)),
    )?;

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

    // 3. Compute net balance relative to opening balance type
    let net = match opening_type.as_str() {
        "Dr" => opening_bal + sum_dr - sum_cr,
        "Cr" => opening_bal + sum_cr - sum_dr,
        _ => opening_bal + sum_dr - sum_cr,
    };

    let (final_balance, final_type) = if net >= 0.0 {
        (net, opening_type)
    } else {
        let opp_type = match opening_type.as_str() {
            "Dr" => "Cr",
            _ => "Dr",
        };
        (-net, opp_type.to_string())
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
