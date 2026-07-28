pub struct TaxBreakdown {
    pub cgst: f64,
    pub sgst: f64,
    pub igst: f64,
    pub total_tax: f64,
}

pub fn calculate_gst(amount: f64, gst_rate: f64, is_interstate: bool) -> TaxBreakdown {
    let total_tax = amount * (gst_rate / 100.0);
    if is_interstate {
        TaxBreakdown { cgst: 0.0, sgst: 0.0, igst: total_tax, total_tax }
    } else {
        let half_tax = total_tax / 2.0;
        TaxBreakdown { cgst: half_tax, sgst: half_tax, igst: 0.0, total_tax }
    }
}
