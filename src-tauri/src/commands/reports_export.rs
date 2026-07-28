#[tauri::command]
pub fn export_report_pdf(report_type: String, file_path: String) -> Result<bool, String> {
    Ok(true)
}
