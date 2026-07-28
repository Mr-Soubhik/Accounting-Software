use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub struct LineTaxBreakdown {
    pub line_amount: f64,
    pub cgst_amount: f64,
    pub sgst_amount: f64,
    pub igst_amount: f64,
    pub cess_amount: f64,
    pub total_tax: f64,
    pub grand_total: f64,
}

/// Calculates line-item GST and Cess based on place of supply rules.
pub fn calculate_line_tax(
    quantity: f64,
    rate: f64,
    gst_rate: f64,
    cess_rate: f64,
    is_interstate: bool,
) -> LineTaxBreakdown {
    let line_amount = (quantity * rate * 100.0).round() / 100.0;
    let (cgst, sgst, igst) = if is_interstate {
        let igst_val = (line_amount * (gst_rate / 100.0) * 100.0).round() / 100.0;
        (0.0, 0.0, igst_val)
    } else {
        let half_tax = (line_amount * (gst_rate / 2.0 / 100.0) * 100.0).round() / 100.0;
        (half_tax, half_tax, 0.0)
    };

    let cess_val = (line_amount * (cess_rate / 100.0) * 100.0).round() / 100.0;
    let total_tax = cgst + sgst + igst + cess_val;
    let grand_total = line_amount + total_tax;

    LineTaxBreakdown {
        line_amount,
        cgst_amount: cgst,
        sgst_amount: sgst,
        igst_amount: igst,
        cess_amount: cess_val,
        total_tax,
        grand_total,
    }
}
