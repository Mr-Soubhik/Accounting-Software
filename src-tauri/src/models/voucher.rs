use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Voucher {
    pub id: Option<i64>,
    pub voucher_number: String,
    pub voucher_type: String,
    pub date: String,
    pub financial_year_id: i64,
    pub narration: Option<String>,
}
