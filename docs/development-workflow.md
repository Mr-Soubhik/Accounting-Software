# Development Workflow Guide

## Overview
This offline desktop accounting system uses Tauri (Rust) as its backend engine and React (TypeScript) for the user interface.

## Key Rules & Guidelines

1. **Security & Integrity**: All ledger postings, GST calculations, and double-entry balance checks MUST take place inside Rust `src-tauri/src/logic/`.
2. **Commands Layer**: Expose functions to React exclusively via Tauri `commands/`. React calls these commands using wrapper functions located in `src/api/`.
3. **Database Rules**: SQLite is managed locally. Schema initialization and migrations are located in `src-tauri/src/db/`.
4. **Testing Workflow**:
   - Rust unit tests in `tests/backend/` test double-entry validity and tax calculations.
   - Frontend tests in `tests/frontend/` test UI form inputs and render validity.
