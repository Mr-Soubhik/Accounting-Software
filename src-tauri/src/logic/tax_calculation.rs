use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub struct LineTaxBreakdown {
    pub line_amount: f64,
    pub cgst_amount: f64,
    pub sgst_amount: f64,
    pub igst_amount: f64,
    pub cess_amount: f64,
    pub total_tax: f64,
    pub unrounded_total: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub struct InvoiceTaxSummary {
    pub total_line_amount: f64,
    pub total_cgst: f64,
    pub total_sgst: f64,
    pub total_igst: f64,
    pub total_cess: f64,
    pub unrounded_grand_total: f64,
    pub rounded_grand_total: f64,
    pub round_off_adjustment: f64,
}

/// Calculates line-item GST and Cess by comparing transaction place_of_supply to company_state_code (Tally rule).
pub fn calculate_line_tax(
    quantity: f64,
    rate: f64,
    gst_rate: f64,
    cess_rate: f64,
    place_of_supply: &str,
    company_state_code: &str,
) -> LineTaxBreakdown {
    let line_amount = (quantity * rate * 100.0).round() / 100.0;
    let is_interstate = place_of_supply != company_state_code;

    let (cgst, sgst, igst) = if is_interstate {
        let igst_val = (line_amount * (gst_rate / 100.0) * 100.0).round() / 100.0;
        (0.0, 0.0, igst_val)
    } else {
        let half_tax = (line_amount * (gst_rate / 2.0 / 100.0) * 100.0).round() / 100.0;
        (half_tax, half_tax, 0.0)
    };

    let cess_val = (line_amount * (cess_rate / 100.0) * 100.0).round() / 100.0;
    let total_tax = cgst + sgst + igst + cess_val;
    let unrounded_total = line_amount + total_tax;

    LineTaxBreakdown {
        line_amount,
        cgst_amount: cgst,
        sgst_amount: sgst,
        igst_amount: igst,
        cess_amount: cess_val,
        total_tax,
        unrounded_total,
    }
}

/// Computes grand totals across all lines and calculates Tally's "Round Off" ledger adjustment.
pub fn calculate_invoice_summary(lines: &[LineTaxBreakdown]) -> InvoiceTaxSummary {
    let mut total_line_amount = 0.0;
    let mut total_cgst = 0.0;
    let mut total_sgst = 0.0;
    let mut total_igst = 0.0;
    let mut total_cess = 0.0;

    for line in lines {
        total_line_amount += line.line_amount;
        total_cgst += line.cgst_amount;
        total_sgst += line.sgst_amount;
        total_igst += line.igst_amount;
        total_cess += line.cess_amount;
    }

    let unrounded_grand_total = total_line_amount + total_cgst + total_sgst + total_igst + total_cess;
    let rounded_grand_total = unrounded_grand_total.round();
    let round_off_adjustment = (rounded_grand_total - unrounded_grand_total * 100.0).round() / 100.0;

    InvoiceTaxSummary {
        total_line_amount,
        total_cgst,
        total_sgst,
        total_igst,
        total_cess,
        unrounded_grand_total,
        rounded_grand_total,
        round_off_adjustment,
    }
}
