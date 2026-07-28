# 🏢 Free Desktop Accounting Software (TallyPrimeMOD Edition)

> **100% Free, Offline-First, Simple & Powerful Accounting & GST Software for Small Businesses, Freelancers, and Startups.**

Built with **Tauri v1.5**, **Rust**, **React 18**, **TypeScript**, and **SQLite**. Designed for ultra-fast, keyboard-driven accounting without monthly subscriptions, cloud lock-in, or internet requirements.

---

## 🌟 Why Choose This Software?

- **💰 100% Free & Open-Source**: No hidden monthly fees, no feature paywalls.
- **🔒 Privacy & Security First**: All financial data is stored locally on your machine in a fast SQLite database. No data is sent to external servers.
- **⚡ Super-Fast Tally Prime Keyboard Workflow**: Full support for physical Tally function keys (`F2` through `F12`, `Alt+F6`, `Alt+F9`, `Alt+G`).
- **🇮🇳 GST & Tax Compliant**: Automatic CGST, SGST, and IGST tax splitting based on Intra-State vs. Inter-State Place of Supply.
- **📊 Real-Time Financial Reports**: Instant Balance Sheet, Profit & Loss A/c, Trial Balance, Day Book, Sundry Debtors/Creditors Ledger Statements, and Ageing Reports.

---

## 🚀 Key Modules & Features

### 1. 📝 Complete Voucher Entry System (`F4` to `F9`, `Alt+F6`, `Alt+F9`)

| Voucher Type | Hotkey | Description & Functionality |
|---|---|---|
| **Sales Invoice** | `F8` | Issue Tax Invoices to Customers. Calculates GST (CGST/SGST or IGST), Round-off, and updates Customer Ledger (Sundry Debtors). |
| **Purchase Voucher** | `F9` | Record Vendor Purchase Bills. Tracks Supplier Bill Ref No., Input Tax Credit (ITC) CGST/SGST/IGST, and Supplier Ledger (Sundry Creditors). |
| **Payment Voucher** | `F5` | Record Vendor Payments or Expense Payouts from Bank/Cash A/c (HDFC, ICICI, Cash in Hand). Supports Cheque, NEFT/RTGS, UPI, Cash. |
| **Receipt Voucher** | `F6` | Record Customer Collections or Income Receipts deposited into Bank/Cash A/c. Tracks Payment Instrument & Reference Numbers. |
| **Journal Voucher** | `F7` | Adjustment & Depreciation Entries. Double-entry grid (`By/To` or `Dr/Cr`) with real-time **Total Debit = Total Credit** balance checking. |
| **Contra Voucher** | `F4` | **Internal Cash & Bank Transfers** (Cash Deposit to Bank, Cash Withdrawal from ATM, Bank-to-Bank transfers). Includes ATM/Slip Ref. |
| **Credit Note** | `Alt+F6` | Sales Return & Customer Credit Adjustments with Output Tax Reversal. |
| **Debit Note** | `Alt+F9` | Purchase Return & Supplier Debit Adjustments with Input Tax Reversal. |

---

### 2. ⌨️ Interactive Tally Configuration Keys (`F2` to `F12`)

- **`F2` (Date & Period)**: Change current voucher date or active financial period (e.g., `01-Apr-2025` to `31-Mar-2026`).
- **`F3` (Company Info)**: Select Company, Alter Company Details (GSTIN, State), or Create New Company.
- **`F11` (Company Features)**: Toggle Accounting, Inventory, and Statutory Features (GST, e-Invoicing, e-Way Bill, Bill-wise Entry, Multi-Currency, Godowns, Discount columns).
- **`F12` (Configurations)**: Customize Voucher Options (Show Ledger Balances, Warn on Negative Cash, Allow Zero Amount Entries, `By/To` vs `Dr/Cr`).

---

## 📖 Detailed User Guide

### Step 1: Company Setup & Configuration
1. Launch the application.
2. Press **`F3`** (or click **Company** on the right sidebar) to select or create your business profile.
3. Set your company's **State Code** (e.g., `DL` for Delhi, `MH` for Maharashtra) and **GSTIN** so the GST tax engine can automatically determine intra-state vs. inter-state taxes.

### Step 2: Creating Ledgers & Account Masters
1. Navigate to **Masters ➔ Ledgers** from the Gateway of Tally menu.
2. Create key ledger accounts:
   - **Customers**: Under *Sundry Debtors* (e.g. *Acme Traders Pvt Ltd*).
   - **Suppliers/Vendors**: Under *Sundry Creditors* (e.g. *Vortex Raw Materials*).
   - **Bank Accounts**: Under *Bank Accounts* (e.g. *HDFC Bank Account*).
   - **Expenses**: Under *Indirect Expenses* (e.g. *Office Rent Expense*, *Electricity Expenses*).

### Step 3: Entering Daily Transactions
1. Press **`F8`** for Sales, **`F9`** for Purchase, **`F5`** for Payment, **`F6`** for Receipt, **`F7`** for Journal, or **`F4`** for Contra.
2. Fill in the Party Name, Date, Particulars/Items, Quantity, Rate, and GST %.
3. Verify the Tax Breakdown (CGST+SGST for local state, IGST for outside state).
4. Click **Post Voucher (Enter)** and confirm **Yes (Y)** to commit the transaction to the database.
5. Click **`+ Create New (Reset)`** at the top to clear the form and start the next entry immediately.

### Step 4: Viewing Day Book & Ledger Statements
1. Click **`📋 Day Book`** at the top of the voucher screen to view all saved transactions. Filter by voucher type or delete test entries.
2. Navigate to **Ledgers** from the top menu to select any customer, vendor, or bank account and inspect its real-time running balance (`Total Dr - Total Cr`).

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: React 18, TypeScript 5, Vite 5, Vanilla CSS Design System.
- **Desktop Core / Backend**: Tauri v1.5, Rust (Edition 2021).
- **Database Engine**: Embedded SQLite (`rusqlite` bundled).
- **Serialization**: Serde JSON.

```text
Accounting-Software/
├── src-tauri/             # Rust desktop backend & Tauri configuration
│   ├── src/
│   │   ├── commands/      # Tauri API handlers (ledgers, vouchers, trial balance, etc.)
│   │   ├── db/            # SQLite database schema & migrations
│   │   └── main.rs        # Core Tauri setup & command registry
│   ├── icons/             # Multi-resolution icon resources (Windows .ico, macOS .icns, PNGs)
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri application configuration
├── src/                   # React + TypeScript frontend
│   ├── components/        # Modals, Navbar, Sidebar, Layouts
│   ├── pages/             # Dashboard, TransactionEntry, Ledgers, Invoicing, Reports
│   ├── types/             # TypeScript interfaces & VoucherType definitions
│   └── App.tsx            # Main Application entry point
├── dist/                  # Production Vite web build output
└── package.json           # Frontend dependencies & scripts
```

---

## 💻 Building & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust & Cargo](https://rustup.rs/) (for desktop builds)

### Development Setup

```bash
# 1. Clone repository
git clone https://github.com/Mr-Soubhik/Accounting-Software.git
cd Accounting-Software

# 2. Install dependencies
npm install

# 3. Start web development server
npm run dev

# 4. Start full Tauri Desktop Application in dev mode
npm run tauri dev
```

### Production Build

```bash
# Build production desktop installer (.exe on Windows, .AppImage on Linux)
npm run tauri build
```

---

## 📥 How to Download Pre-Built Executables (.exe)

You can download ready-to-run `.exe` installers directly from GitHub without building from source:

1. Visit the repository on GitHub: **[Mr-Soubhik/Accounting-Software](https://github.com/Mr-Soubhik/Accounting-Software)**
2. Click on the **Actions** tab at the top.
3. Click on the latest successful workflow run (**Build Desktop Binaries**).
4. Scroll down to the **Artifacts** section at the bottom.
5. Click **`TallyPrimeMOD-Windows-Executable`** to download the ZIP file containing the Windows installer/executable.

---

## 📜 License

Distributed under the **MIT License**. Free for personal, commercial, and enterprise use.
