use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Voucher {
    pub voucher_id: Option<i64>,
    pub voucher_number: String,
    pub voucher_type: String,
    pub voucher_date: String,
    pub fy_id: i64,
    pub party_ledger_id: Option<i64>,
    pub original_voucher_id: Option<i64>,
    pub place_of_supply: Option<String>,
    pub narration: Option<String>,
    pub total_amount: f64,
    pub status: String,
    pub irn: Option<String>,
    pub qr_code: Option<String>,
}
