export type Nature = 'Asset' | 'Liability' | 'Income' | 'Expense';
export type BalanceType = 'Dr' | 'Cr';
export type VoucherType = 
  | 'Sales' 
  | 'Purchase' 
  | 'Payment' 
  | 'Receipt' 
  | 'Journal' 
  | 'Contra' 
  | 'CreditNote' 
  | 'DebitNote' 
  | 'Proforma' 
  | 'PurchaseOrder';

export type VoucherStatus = 'Draft' | 'Confirmed' | 'Cancelled';

export interface AccountGroup {
  group_id: number;
  group_name: string;
  parent_group_id?: number | null;
  nature: Nature;
  is_current: boolean;
}

export interface Ledger {
  ledger_id: number;
  ledger_name: string;
  group_id: number;
  opening_balance: number;
  opening_balance_type: BalanceType;
  gstin?: string | null;
  state_code?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  is_active: boolean;
}

export interface InventoryItem {
  item_id: number;
  item_name: string;
  unit: string;
  hsn_sac_code?: string | null;
  gst_rate: number;
  cess_rate: number;
  opening_stock_qty: number;
  opening_stock_value: number;
}

export interface FinancialYear {
  fy_id: number;
  start_date: string;
  end_date: string;
  is_closed: boolean;
}

export interface Voucher {
  voucher_id: number;
  voucher_number: string;
  voucher_type: VoucherType;
  voucher_date: string;
  fy_id: number;
  party_ledger_id?: number | null;
  original_voucher_id?: number | null;
  place_of_supply?: string | null;
  narration?: string | null;
  total_amount: number;
  status: VoucherStatus;
  irn?: string | null;
  qr_code?: string | null;
}

export interface VoucherLineItem {
  line_id: number;
  voucher_id: number;
  item_id?: number | null;
  description?: string | null;
  quantity: number;
  rate: number;
  line_amount: number;
  gst_rate: number;
  cess_rate: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  cess_amount: number;
}

export interface JournalEntry {
  journal_entry_id: number;
  voucher_id: number;
  ledger_id: number;
  entry_type: BalanceType;
  amount: number;
  entry_date: string;
}

export interface LedgerRunningBalance {
  ledger_id: number;
  balance: number;
  balance_type: BalanceType;
  last_updated: string;
}

export interface VoucherAuditLog {
  audit_id: number;
  voucher_id: number;
  altered_at: string;
  altered_by: string;
  old_snapshot?: string | null;
  new_snapshot?: string | null;
  action: 'ALTER' | 'CANCEL';
}
