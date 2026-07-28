use crate::models::journal_entry::JournalEntry;

#[tauri::command]
pub fn get_journal_entries() -> Result<Vec<JournalEntry>, String> {
    Ok(vec![])
}
