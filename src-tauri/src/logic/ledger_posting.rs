pub fn update_running_balance(previous_balance: f64, debit: f64, credit: f64) -> f64 {
    previous_balance + debit - credit
}
