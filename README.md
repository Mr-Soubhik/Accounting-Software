# Offline Desktop Accounting System (Tauri + React + SQLite)

An offline desktop accounting application built with **Tauri**, **Rust**, **React**, **TypeScript**, and **SQLite**.

## Architecture Overview

- **`src-tauri/`**: Rust core engine handling SQLite database operations, double-entry validation logic, GST tax calculations, financial year closing, and PDF export generation.
- **`src/`**: React + TypeScript desktop frontend UI providing dashboards, transaction forms, ledger viewers, trial balance, and financial reports.
- **`templates/`**: HTML document templates for PDF generation (invoices, POs, trial balance, balance sheets).
- **`exports/`**: Default output folder for generated PDFs and Excel exports.
- **`docs/`**: Project documentation, DB schemas, and workflow guides.

## Setup & Running

```bash
# Install frontend dependencies
npm install

# Run application in desktop development mode
npm run tauri dev
```
