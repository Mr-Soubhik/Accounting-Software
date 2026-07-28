#[tauri::command]
pub fn create_invoice(invoice_data: serde_json::Value) -> Result<String, String> {
    Ok("INV-0001".to_string())
}
