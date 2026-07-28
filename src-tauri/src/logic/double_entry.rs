pub fn validate_double_entry(total_debits: f64, total_credits: f64) -> Result<(), String> {
    const EPSILON: f64 = 0.001;
    if (total_debits - total_credits).abs() > EPSILON {
        return Err(format!(
            "Double-entry validation failed: Total Debits ({:.2}) != Total Credits ({:.2})",
            total_debits, total_credits
        ));
    }
    Ok(())
}
