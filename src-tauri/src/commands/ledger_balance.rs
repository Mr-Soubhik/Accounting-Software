#[tauri::command]
pub fn get_ledger_balance(ledger_id: i64) -> Result<f64, String> {
    Ok(0.0)
}
