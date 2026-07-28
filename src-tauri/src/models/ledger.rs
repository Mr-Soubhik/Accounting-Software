use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Ledger {
    pub id: Option<i64>,
    pub name: String,
    pub group_type: String,
    pub opening_balance: f64,
    pub opening_balance_type: String,
}
