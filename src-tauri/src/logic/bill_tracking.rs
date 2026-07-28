use rusqlite::{Transaction, Result, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AllocationInput {
    pub bill_id: Option<i64>,
    pub allocation_type: String, // "AgainstRef", "OnAccount", "AdvanceRef"
    pub amount: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AgeingBucketSummary {
    pub party_ledger_id: i64,
    pub party_name: String,
    pub total_outstanding: f64,
    pub range_0_30: f64,
    pub range_31_60: f64,
    pub range_61_90: f64,
    pub range_90_plus: f64,
}

/// Automatically inserts a "New Ref" bill when a Sales or Purchase voucher is confirmed.
pub fn create_bill_new_ref(
    tx: &Transaction,
    voucher_id: i64,
    bill_reference: &str,
    party_ledger_id: i64,
    bill_amount: f64,
    bill_date: &str,
    due_date: Option<&str>,
) -> Result<i64> {
    tx.execute(
        "INSERT INTO Bills (voucher_id, bill_reference, party_ledger_id, bill_amount, bill_date, due_date, is_settled)
         VALUES (?, ?, ?, ?, ?, ?, 0)",
        params![voucher_id, bill_reference, party_ledger_id, bill_amount, bill_date, due_date],
    )?;

    Ok(tx.last_insert_rowid())
}

/// Matches payments/receipts/CN/DN against existing bills ("Against Ref") or records as "On Account".
pub fn allocate_bill_payment(
    tx: &Transaction,
    voucher_id: i64,
    allocations: &[AllocationInput],
) -> Result<()> {
    for alloc in allocations {
        tx.execute(
            "INSERT INTO BillAllocations (voucher_id, bill_id, allocation_type, amount)
             VALUES (?, ?, ?, ?)",
            params![voucher_id, alloc.bill_id, alloc.allocation_type, alloc.amount],
        )?;

        // If allocated against a specific bill, recalculate its settlement status
        if let Some(bill_id) = alloc.bill_id {
            recalculate_bill_settlement(tx, bill_id)?;
        }
    }

    Ok(())
}

/// Recalculates outstanding balance and updates is_settled flag for a bill.
pub fn recalculate_bill_settlement(tx: &Transaction, bill_id: i64) -> Result<()> {
    let (bill_amount,): (f64,) = tx.query_row(
        "SELECT bill_amount FROM Bills WHERE bill_id = ?",
        params![bill_id],
        |row| Ok((row.get(0)?,)),
    )?;

    let allocated_sum: f64 = tx.query_row(
        "SELECT COALESCE(SUM(amount), 0.0) FROM BillAllocations WHERE bill_id = ?",
        params![bill_id],
        |row| row.get(0),
    )?;

    let outstanding = bill_amount - allocated_sum;
    let is_settled = outstanding <= 0.001;

    tx.execute(
        "UPDATE Bills SET is_settled = ? WHERE bill_id = ?",
        params![is_settled, bill_id],
    )?;

    Ok(())
}

/// Computes debtor/creditor ageing analysis for outstanding bills grouped by age buckets (0-30, 31-60, 61-90, 90+ days).
pub fn get_party_ageing_summary(
    tx: &Transaction,
    party_ledger_id: i64,
    as_of_date: &str, // "YYYY-MM-DD"
) -> Result<AgeingBucketSummary> {
    let party_name: String = tx.query_row(
        "SELECT ledger_name FROM Ledgers WHERE ledger_id = ?",
        params![party_ledger_id],
        |row| row.get(0),
    )?;

    let mut stmt = tx.prepare(
        "SELECT bill_id, bill_amount, bill_date, COALESCE(due_date, bill_date),
                (julianday(?) - julianday(COALESCE(due_date, bill_date))) AS age_days
         FROM Bills
         WHERE party_ledger_id = ? AND is_settled = 0",
    )?;

    let rows = stmt.query_map(params![as_of_date, party_ledger_id], |row| {
        Ok((
            row.get::<_, i64>(0)?,
            row.get::<_, f64>(1)?,
            row.get::<_, String>(2)?,
            row.get::<_, String>(3)?,
            row.get::<_, f64>(4)?,
        ))
    })?;

    let mut total_outstanding = 0.0;
    let mut range_0_30 = 0.0;
    let mut range_31_60 = 0.0;
    let mut range_61_90 = 0.0;
    let mut range_90_plus = 0.0;

    for r in rows {
        let (bill_id, bill_amount, _, _, age_days) = r?;

        let allocated_sum: f64 = tx.query_row(
            "SELECT COALESCE(SUM(amount), 0.0) FROM BillAllocations WHERE bill_id = ?",
            params![bill_id],
            |row| row.get(0),
        )?;

        let outstanding = bill_amount - allocated_sum;
        if outstanding > 0.0 {
            total_outstanding += outstanding;

            if age_days <= 30.0 {
                range_0_30 += outstanding;
            } else if age_days <= 60.0 {
                range_31_60 += outstanding;
            } else if age_days <= 90.0 {
                range_61_90 += outstanding;
            } else {
                range_90_plus += outstanding;
            }
        }
    }

    Ok(AgeingBucketSummary {
        party_ledger_id,
        party_name,
        total_outstanding,
        range_0_30,
        range_31_60,
        range_61_90,
        range_90_plus,
    })
}
