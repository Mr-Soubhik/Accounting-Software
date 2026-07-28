-- Full Production SQLite Database Schema
-- Offline Desktop Accounting System

PRAGMA foreign_keys = ON;

-- ============================================================================
-- 1. MASTER DATA TABLES
-- ============================================================================

-- 1.1 AccountGroups
CREATE TABLE IF NOT EXISTS AccountGroups (
    group_id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_name TEXT NOT NULL,
    parent_group_id INTEGER REFERENCES AccountGroups(group_id),
    nature TEXT NOT NULL CHECK (nature IN ('Asset', 'Liability', 'Income', 'Expense')),
    is_current BOOLEAN NOT NULL DEFAULT 0
);

-- 1.2 Ledgers
CREATE TABLE IF NOT EXISTS Ledgers (
    ledger_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ledger_name TEXT NOT NULL,
    group_id INTEGER NOT NULL REFERENCES AccountGroups(group_id),
    opening_balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    opening_balance_type TEXT NOT NULL DEFAULT 'Dr' CHECK (opening_balance_type IN ('Dr', 'Cr')),
    gstin TEXT,
    state_code TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    is_active BOOLEAN NOT NULL DEFAULT 1
);

-- 1.3 InventoryItems
CREATE TABLE IF NOT EXISTS InventoryItems (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    unit TEXT DEFAULT 'pcs',
    hsn_sac_code TEXT,
    gst_rate DECIMAL(5,2) DEFAULT 0.00,
    cess_rate DECIMAL(5,2) DEFAULT 0.00,
    opening_stock_qty DECIMAL(15,3) DEFAULT 0.000,
    opening_stock_value DECIMAL(15,2) DEFAULT 0.00
);

-- 1.4 FinancialYears
CREATE TABLE IF NOT EXISTS FinancialYears (
    fy_id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_closed BOOLEAN NOT NULL DEFAULT 0
);

-- ============================================================================
-- 2. TRANSACTION & VOUCHER TABLES
-- ============================================================================

-- 2.1 Vouchers
CREATE TABLE IF NOT EXISTS Vouchers (
    voucher_id INTEGER PRIMARY KEY AUTOINCREMENT,
    voucher_number TEXT NOT NULL,
    voucher_type TEXT NOT NULL CHECK (
        voucher_type IN ('Sales', 'Purchase', 'Payment', 'Receipt', 'Journal', 'Contra', 'CreditNote', 'DebitNote', 'Proforma', 'PurchaseOrder')
    ),
    voucher_date DATE NOT NULL,
    fy_id INTEGER NOT NULL REFERENCES FinancialYears(fy_id),
    party_ledger_id INTEGER REFERENCES Ledgers(ledger_id),
    original_voucher_id INTEGER REFERENCES Vouchers(voucher_id),
    place_of_supply TEXT,
    narration TEXT,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Draft', 'Confirmed', 'Cancelled')),
    irn TEXT,
    qr_code TEXT
);

-- 2.2 VoucherLineItems
CREATE TABLE IF NOT EXISTS VoucherLineItems (
    line_id INTEGER PRIMARY KEY AUTOINCREMENT,
    voucher_id INTEGER NOT NULL REFERENCES Vouchers(voucher_id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES InventoryItems(item_id),
    description TEXT,
    quantity DECIMAL(15,3) DEFAULT 0.000,
    rate DECIMAL(15,2) DEFAULT 0.00,
    line_amount DECIMAL(15,2) DEFAULT 0.00,
    gst_rate DECIMAL(5,2) DEFAULT 0.00,
    cess_rate DECIMAL(5,2) DEFAULT 0.00,
    cgst_amount DECIMAL(15,2) DEFAULT 0.00,
    sgst_amount DECIMAL(15,2) DEFAULT 0.00,
    igst_amount DECIMAL(15,2) DEFAULT 0.00,
    cess_amount DECIMAL(15,2) DEFAULT 0.00
);

-- 2.3 JournalEntries
CREATE TABLE IF NOT EXISTS JournalEntries (
    journal_entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
    voucher_id INTEGER NOT NULL REFERENCES Vouchers(voucher_id) ON DELETE CASCADE,
    ledger_id INTEGER NOT NULL REFERENCES Ledgers(ledger_id),
    entry_type TEXT NOT NULL CHECK (entry_type IN ('Dr', 'Cr')),
    amount DECIMAL(15,2) NOT NULL,
    entry_date DATE NOT NULL
);

-- 2.4 LedgerRunningBalance
CREATE TABLE IF NOT EXISTS LedgerRunningBalance (
    ledger_id INTEGER PRIMARY KEY REFERENCES Ledgers(ledger_id),
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    balance_type TEXT NOT NULL DEFAULT 'Dr' CHECK (balance_type IN ('Dr', 'Cr')),
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2.5 VoucherAuditLog
CREATE TABLE IF NOT EXISTS VoucherAuditLog (
    audit_id INTEGER PRIMARY KEY AUTOINCREMENT,
    voucher_id INTEGER NOT NULL REFERENCES Vouchers(voucher_id),
    altered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    altered_by TEXT DEFAULT 'System',
    old_snapshot TEXT,
    new_snapshot TEXT,
    action TEXT NOT NULL CHECK (action IN ('ALTER', 'CANCEL'))
);

-- ============================================================================
-- 3. REPORTING SNAPSHOT TABLES (OPTIONAL CACHE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS TrialBalanceSnapshot (
    snapshot_id INTEGER PRIMARY KEY AUTOINCREMENT,
    fy_id INTEGER NOT NULL REFERENCES FinancialYears(fy_id),
    ledger_id INTEGER NOT NULL REFERENCES Ledgers(ledger_id),
    debit_total DECIMAL(15,2) DEFAULT 0.00,
    credit_total DECIMAL(15,2) DEFAULT 0.00,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS BalanceSheetSnapshot (
    snapshot_id INTEGER PRIMARY KEY AUTOINCREMENT,
    fy_id INTEGER NOT NULL REFERENCES FinancialYears(fy_id),
    group_id INTEGER NOT NULL REFERENCES AccountGroups(group_id),
    total_amount DECIMAL(15,2) DEFAULT 0.00,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_vouchers_date ON Vouchers(voucher_date);
CREATE INDEX IF NOT EXISTS idx_vouchers_type ON Vouchers(voucher_type);
CREATE INDEX IF NOT EXISTS idx_vouchers_fy ON Vouchers(fy_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_type_fy ON Vouchers(voucher_type, fy_id);

CREATE INDEX IF NOT EXISTS idx_journal_entries_ledger ON JournalEntries(ledger_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON JournalEntries(entry_date);

CREATE INDEX IF NOT EXISTS idx_line_items_voucher ON VoucherLineItems(voucher_id);

-- ============================================================================
-- 5. SEED DATA (DEFAULT SYSTEM GROUPS & LEDGERS)
-- ============================================================================

-- Primary Groups
INSERT OR IGNORE INTO AccountGroups (group_id, group_name, parent_group_id, nature, is_current) VALUES
(1, 'Assets', NULL, 'Asset', 0),
(2, 'Liabilities', NULL, 'Liability', 0),
(3, 'Income', NULL, 'Income', 0),
(4, 'Expenses', NULL, 'Expense', 0),
(5, 'Current Assets', 1, 'Asset', 1),
(6, 'Fixed Assets', 1, 'Asset', 0),
(7, 'Current Liabilities', 2, 'Liability', 1),
(8, 'Direct Income', 3, 'Income', 0),
(9, 'Indirect Income', 3, 'Income', 0),
(10, 'Direct Expenses', 4, 'Expense', 0),
(11, 'Indirect Expenses', 4, 'Expense', 0),
(12, 'Sundry Debtors', 5, 'Asset', 1),
(13, 'Sundry Creditors', 7, 'Liability', 1),
(14, 'Duties & Taxes', 7, 'Liability', 1);

-- System Default Ledgers
INSERT OR IGNORE INTO Ledgers (ledger_id, ledger_name, group_id, opening_balance, opening_balance_type, is_active) VALUES
(1, 'Round Off', 11, 0.00, 'Dr', 1),
(2, 'CGST Payable', 14, 0.00, 'Cr', 1),
(3, 'SGST Payable', 14, 0.00, 'Cr', 1),
(4, 'IGST Payable', 14, 0.00, 'Cr', 1),
(5, 'Cess Payable', 14, 0.00, 'Cr', 1),
(6, 'CGST Input Tax Credit', 5, 0.00, 'Dr', 1),
(7, 'SGST Input Tax Credit', 5, 0.00, 'Dr', 1),
(8, 'IGST Input Tax Credit', 5, 0.00, 'Dr', 1),
(9, 'Cess Input Tax Credit', 5, 0.00, 'Dr', 1);
