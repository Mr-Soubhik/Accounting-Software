use serde::Serialize;

#[derive(Serialize)]
pub fn get_trial_balance() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({ "debit_total": 0.0, "credit_total": 0.0 }))
}
