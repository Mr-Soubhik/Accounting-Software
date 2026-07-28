#[tauri::command]
pub fn calculate_financial_ratios() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "current_ratio": 1.5,
        "quick_ratio": 1.2,
        "debt_to_equity": 0.5
    }))
}
