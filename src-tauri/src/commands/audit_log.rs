use crate::models::audit_log::AuditLog;

#[tauri::command]
pub fn get_audit_logs() -> Result<Vec<AuditLog>, String> {
    Ok(vec![])
}
