use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct JournalEntry {
    pub journal_entry_id: Option<i64>,
    pub voucher_id: i64,
    pub ledger_id: i64,
    pub entry_type: String, // "Dr" or "Cr"
    pub amount: f64,
    pub entry_date: String,
}
