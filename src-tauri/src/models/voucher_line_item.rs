use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct VoucherLineItem {
    pub line_id: Option<i64>,
    pub voucher_id: i64,
    pub item_id: Option<i64>,
    pub description: Option<String>,
    pub quantity: f64,
    pub rate: f64,
    pub line_amount: f64,
    pub gst_rate: f64,
    pub cess_rate: f64,
    pub cgst_amount: f64,
    pub sgst_amount: f64,
    pub igst_amount: f64,
    pub cess_amount: f64,
}
