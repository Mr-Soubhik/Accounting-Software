use crate::models::financial_year::FinancialYear;

#[tauri::command]
pub fn get_financial_years() -> Result<Vec<FinancialYear>, String> {
    Ok(vec![])
}
