use crate::logic::bill_tracking::{get_party_ageing_summary, AgeingBucketSummary};

#[tauri::command]
pub fn get_ageing_report(party_ledger_id: i64, as_of_date: String) -> Result<serde_json::Value, String> {
    // In full implementation, acquires DB connection pool and calls get_party_ageing_summary
    Ok(serde_json::json!({
        "party_ledger_id": party_ledger_id,
        "as_of_date": as_of_date,
        "total_outstanding": 0.0,
        "range_0_30": 0.0,
        "range_31_60": 0.0,
        "range_61_90": 0.0,
        "range_90_plus": 0.0
    }))
}
