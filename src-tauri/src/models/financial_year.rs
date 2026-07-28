use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct FinancialYear {
    pub id: Option<i64>,
    pub code: String,
    pub start_date: String,
    pub end_date: String,
    pub is_closed: bool,
}
