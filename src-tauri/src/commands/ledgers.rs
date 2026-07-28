use crate::models::ledger::Ledger;

#[tauri::command]
pub fn get_ledgers() -> Result<Vec<Ledger>, String> {
    Ok(vec![])
}
