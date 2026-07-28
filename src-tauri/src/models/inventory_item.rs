use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct InventoryItem {
    pub id: Option<i64>,
    pub sku: String,
    pub name: String,
    pub hsn_sac_code: Option<String>,
    pub unit_price: f64,
    pub gst_rate: f64,
    pub stock_quantity: f64,
}
