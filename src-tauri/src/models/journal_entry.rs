use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct JournalEntry {
    pub id: Option<i64>,
    pub voucher_id: i64,
    pub ledger_id: i64,
    pub debit_amount: f64,
    pub credit_amount: f64,
}
