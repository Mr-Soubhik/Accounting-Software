// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod commands;
mod models;
mod logic;
mod utils;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::ledgers::get_ledgers,
            commands::vouchers::create_voucher,
            commands::journals::get_journal_entries,
            commands::ledger_balance::get_ledger_balance,
            commands::trial_balance::get_trial_balance,
            commands::balance_sheet::get_balance_sheet,
            commands::inventory::get_inventory_items,
            commands::invoicing::create_invoice,
            commands::financial_years::get_financial_years,
            commands::audit_log::get_audit_logs,
            commands::reports_export::export_report_pdf,
            commands::analysis::calculate_financial_ratios
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
