pub fn validate_hsn_sac(code: &str) -> bool {
    !code.is_empty() && code.chars().all(|c| c.is_numeric())
}
