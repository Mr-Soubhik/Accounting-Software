use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AuditLog {
    pub id: Option<i64>,
    pub timestamp: String,
    pub action: String,
    pub entity: String,
    pub details: Option<String>,
}
