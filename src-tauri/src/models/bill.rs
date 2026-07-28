use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Bill {
    pub bill_id: Option<i64>,
    pub voucher_id: i64,
    pub bill_reference: String,
    pub party_ledger_id: i64,
    pub bill_amount: f64,
    pub bill_date: String,
    pub due_date: Option<String>,
    pub is_settled: bool,
}
