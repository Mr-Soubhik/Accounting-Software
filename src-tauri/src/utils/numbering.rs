pub fn generate_voucher_number(prefix: &str, fy_code: &str, sequence: u32) -> String {
    format!("{}/{}/{:04}", prefix, fy_code, sequence)
}
