use crate::models::voucher::Voucher;

#[tauri::command]
pub fn create_voucher(voucher: Voucher) -> Result<i64, String> {
    Ok(1)
}
