#[tauri::command]
pub fn get_balance_sheet() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({ "assets": [], "liabilities": [], "equity": [] }))
}
