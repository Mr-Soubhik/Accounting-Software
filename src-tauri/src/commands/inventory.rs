use crate::models::inventory_item::InventoryItem;

#[tauri::command]
pub fn get_inventory_items() -> Result<Vec<InventoryItem>, String> {
    Ok(vec![])
}
