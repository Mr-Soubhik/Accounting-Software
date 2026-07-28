# Database Schema — Full Specification
## Offline Desktop Accounting System (SQLite)

This document describes every table, its columns, data types, relationships, and indexes needed to build the complete schema in SQLite.

---

## 1. Master Data Tables

### 1.1 `AccountGroups`
Defines the chart-of-accounts hierarchy (e.g., Current Assets, Fixed Assets, Direct Income).

| Column | Type | Notes |
|---|---|---|
| group_id | INTEGER, PK | Auto-increment primary key |
| group_name | TEXT | e.g. "Sundry Debtors" |
| parent_group_id | INTEGER, FK → AccountGroups.group_id | nullable, self-reference for nesting |
| nature | ENUM(Asset, Liability, Income, Expense) | determines which financial statement it appears on |
| is_current | BOOLEAN | current vs non-current classification for balance sheet |

### 1.2 `Ledgers`
Individual accounts under a group (e.g., "Cash", "ABC Traders", "CGST Payable").

| Column | Type | Notes |
|---|---|---|
| ledger_id | INTEGER, PK | Auto-increment primary key |
| ledger_name | TEXT | |
| group_id | INTEGER, FK → AccountGroups.group_id | |
| opening_balance | DECIMAL | set per financial year |
| opening_balance_type | ENUM(Dr, Cr) | |
| gstin | TEXT | nullable, only for party ledgers |
| state_code | TEXT | party's registered state, used for CGST/SGST vs IGST |
| address, phone, email | TEXT | party contact details |
| is_active | BOOLEAN | |

- Default system ledger: **"Round Off"** under Indirect Expenses.
- Default tax ledgers: CGST Payable/Input, SGST Payable/Input, IGST Payable/Input, Cess Payable/Input.

### 1.3 `InventoryItems`
Products/services sold or purchased.

| Column | Type | Notes |
|---|---|---|
| item_id | INTEGER, PK | |
| item_name | TEXT | |
| unit | TEXT | e.g. pcs, kg |
| hsn_sac_code | TEXT | required for GST-compliant invoices |
| gst_rate | DECIMAL | applicable GST % |
| cess_rate | DECIMAL | nullable, extra cess on top of GST for select items |
| opening_stock_qty | DECIMAL | nullable, for inventory-tracked businesses |
| opening_stock_value | DECIMAL | |

### 1.4 `FinancialYears`
Defines each accounting year and controls opening-balance carry-forward.

| Column | Type | Notes |
|---|---|---|
| fy_id | INTEGER, PK | |
| start_date | DATE | |
| end_date | DATE | |
| is_closed | BOOLEAN | once closed, no new entries allowed in that year |

---

## 2. Transaction & Voucher Tables

### 2.1 `Vouchers`
The header record for every transaction type.

| Column | Type | Notes |
|---|---|---|
| voucher_id | INTEGER, PK | |
| voucher_number | TEXT | sequential, unique per voucher_type per fy |
| voucher_type | ENUM(Sales, Purchase, Payment, Receipt, Journal, Contra, CreditNote, DebitNote, Proforma, PurchaseOrder) | |
| voucher_date | DATE | |
| fy_id | INTEGER, FK → FinancialYears.fy_id | |
| party_ledger_id | INTEGER, FK → Ledgers.ledger_id | customer/supplier |
| original_voucher_id | INTEGER, FK → Vouchers.voucher_id | links Credit/Debit Note to original Sales/Purchase |
| place_of_supply | TEXT (state code) | determines CGST+SGST vs IGST |
| narration | TEXT | |
| total_amount | DECIMAL | |
| status | ENUM(Draft, Confirmed, Cancelled) | |
| irn | TEXT | reserved for future e-invoicing |
| qr_code | TEXT/BLOB | reserved for future e-invoicing |

### 2.2 `VoucherLineItems`
Line-level detail for each voucher.

| Column | Type | Notes |
|---|---|---|
| line_id | INTEGER, PK | |
| voucher_id | INTEGER, FK → Vouchers.voucher_id | |
| item_id | INTEGER, FK → InventoryItems.item_id | nullable for service/ledger entries |
| description | TEXT | |
| quantity | DECIMAL | |
| rate | DECIMAL | |
| line_amount | DECIMAL | quantity × rate |
| gst_rate | DECIMAL | copied from item at time of entry |
| cess_rate | DECIMAL | copied from item at time of entry |
| cgst_amount, sgst_amount, igst_amount, cess_amount | DECIMAL | calculated per line item |

### 2.3 `JournalEntries`
The double-entry debit/credit lines auto-generated from each voucher.

| Column | Type | Notes |
|---|---|---|
| journal_entry_id | INTEGER, PK | |
| voucher_id | INTEGER, FK → Vouchers.voucher_id | |
| ledger_id | INTEGER, FK → Ledgers.ledger_id | |
| entry_type | ENUM(Dr, Cr) | |
| amount | DECIMAL | |
| entry_date | DATE | copied from voucher |

### 2.4 `LedgerRunningBalance`
Fast-lookup running balance per ledger.

| Column | Type | Notes |
|---|---|---|
| ledger_id | INTEGER, FK → Ledgers.ledger_id, PK | |
| balance | DECIMAL | |
| balance_type | ENUM(Dr, Cr) | |
| last_updated | DATETIME | |

### 2.5 `VoucherAuditLog`
Tracks every alteration or cancellation for audit-trail integrity.

| Column | Type | Notes |
|---|---|---|
| audit_id | INTEGER, PK | |
| voucher_id | INTEGER, FK → Vouchers.voucher_id | |
| altered_at | DATETIME | |
| altered_by | TEXT | user name |
| old_snapshot | JSON/TEXT | voucher state before change |
| new_snapshot | JSON/TEXT | voucher state after change |
| action | ENUM(ALTER, CANCEL) | |

---

## 3. Bill Tracking & Allocation Tables (Tally "New Ref" / "Against Ref")

### 3.1 `Bills`
Represents each individual outstanding invoice (created automatically the moment a Sales/Purchase voucher is confirmed — Tally's "New Ref").

| Column | Type | Notes |
|---|---|---|
| bill_id | INTEGER, PK | |
| voucher_id | INTEGER, FK → Vouchers.voucher_id | Sales/Purchase invoice this bill represents |
| bill_reference | TEXT | usually voucher_number, but editable |
| party_ledger_id | INTEGER, FK → Ledgers.ledger_id | debtor/creditor ledger |
| bill_amount | DECIMAL | original invoice total |
| bill_date | DATE | date of invoice |
| due_date | DATE | nullable, for ageing/reminders |
| is_settled | BOOLEAN | true once fully allocated |

### 3.2 `BillAllocations`
Represents each payment/receipt/CN/DN matched against a specific bill (Tally's "Against Ref" / "On Account").

| Column | Type | Notes |
|---|---|---|
| allocation_id | INTEGER, PK | |
| voucher_id | INTEGER, FK → Vouchers.voucher_id | Payment/Receipt/CreditNote/DebitNote settling the bill |
| bill_id | INTEGER, FK → Bills.bill_id | nullable — null means "On Account" (unallocated advance) |
| allocation_type | ENUM(AgainstRef, OnAccount, AdvanceRef) | |
| amount | DECIMAL | allocated settlement amount |

---

## 4. Indexes & Performance Optimizations

- `Vouchers(voucher_date)`
- `Vouchers(voucher_type)`
- `Vouchers(fy_id)`
- `JournalEntries(ledger_id)`
- `JournalEntries(entry_date)`
- `VoucherLineItems(voucher_id)`
- `Bills(party_ledger_id)`
- `Bills(voucher_id)`
- `BillAllocations(bill_id)`
- `BillAllocations(voucher_id)`
- Composite index on `Vouchers(voucher_type, fy_id)`
