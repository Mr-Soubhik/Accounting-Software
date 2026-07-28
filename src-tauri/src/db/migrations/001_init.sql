-- 001_init.sql - Complete Initial Database Schema Migration

-- Import and run full schema definition
-- Includes AccountGroups, Ledgers, InventoryItems, FinancialYears, Vouchers, VoucherLineItems, JournalEntries, LedgerRunningBalance, VoucherAuditLog, Snapshots, and Indexes.

-- Schema version tracking table
CREATE TABLE IF NOT EXISTS SchemaMigrations (
    version INTEGER PRIMARY KEY,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO SchemaMigrations (version) VALUES (1);
