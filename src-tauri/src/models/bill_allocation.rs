use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BillAllocation {
    pub allocation_id: Option<i64>,
    pub voucher_id: i64,
    pub bill_id: Option<i64>,
    pub allocation_type: String, // "AgainstRef", "OnAccount", "AdvanceRef"
    pub amount: f64,
}
