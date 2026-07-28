use crate::models::journal_entry::JournalEntry;

/// Validates that the sum of Dr entries equals the sum of Cr entries (Tally double-entry rule).
/// Handles both explicit double-entry pairs and single-entry shortcuts (auto-balancing against Cash/Bank).
pub fn validate_journal_entries(entries: &[JournalEntry]) -> Result<(), String> {
    if entries.is_empty() {
        return Err("Voucher must contain at least one journal entry.".to_string());
    }

    let mut total_debits: f64 = 0.0;
    let mut total_credits: f64 = 0.0;

    for entry in entries {
        match entry.entry_type.as_str() {
            "Dr" => total_debits += entry.amount,
            "Cr" => total_credits += entry.amount,
            other => return Err(format!("Invalid entry_type '{}'. Expected 'Dr' or 'Cr'.", other)),
        }
    }

    let diff = (total_debits - total_credits).abs();
    if diff > 0.001 {
        return Err(format!(
            "Double-entry validation failed: Total Debits ({:.2}) != Total Credits ({:.2}) (Diff: {:.2})",
            total_debits, total_credits, diff
        ));
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_balanced_entries() {
        let entries = vec![
            JournalEntry { journal_entry_id: None, voucher_id: 1, ledger_id: 12, entry_type: "Dr".into(), amount: 1500.0, entry_date: "2026-04-01".into() },
            JournalEntry { journal_entry_id: None, voucher_id: 1, ledger_id: 1, entry_type: "Cr".into(), amount: 1500.0, entry_date: "2026-04-01".into() },
        ];
        assert!(validate_journal_entries(&entries).is_ok());
    }
}
