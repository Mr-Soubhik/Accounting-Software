import React, { useState } from 'react';

export const LedgersPage: React.FC = () => {
  const [selectedLedger, setSelectedLedger] = useState('Acme Traders Pvt Ltd');

  const ledgerDetails: Record<string, { group: string; nature: string; opening: string; totalDr: string; totalCr: string; closing: string; closingType: 'Dr' | 'Cr' }> = {
    'Acme Traders Pvt Ltd': { group: 'Sundry Debtors', nature: 'Asset', opening: '₹ 50,000.00 Dr', totalDr: '₹ 2,68,000.00', totalCr: '₹ 1,02,600.00', closing: '₹ 2,15,400.00', closingType: 'Dr' },
    'Sales Revenue Account': { group: 'Direct Income', nature: 'Income', opening: '₹ 0.00', totalDr: '₹ 0.00', totalCr: '₹ 12,45,000.00', closing: '₹ 12,45,000.00', closingType: 'Cr' },
    'HDFC Bank Account': { group: 'Bank Accounts', nature: 'Asset', opening: '₹ 1,20,000.00 Dr', totalDr: '₹ 4,50,000.00', totalCr: '₹ 2,10,000.00', closing: '₹ 3,60,000.00', closingType: 'Dr' },
  };

  const currentDetails = ledgerDetails[selectedLedger] || ledgerDetails['Acme Traders Pvt Ltd'];

  const transactions = [
    { date: '2026-04-01', voucherNo: 'OP-BAL', type: 'Opening', particulars: 'Opening Balance Carry Forward', dr: '-', cr: '-', balance: '₹ 50,000.00 Dr' },
    { date: '2026-04-05', voucherNo: 'INV-2025-001', type: 'Sales', particulars: 'Sales against PO #8891', dr: '₹ 1,18,000.00', cr: '-', balance: '₹ 1,68,000.00 Dr' },
    { date: '2026-04-10', voucherNo: 'REC-2025-002', type: 'Receipt', particulars: 'Payment received via HDFC NetBanking', dr: '-', cr: '₹ 50,000.00', balance: '₹ 1,18,000.00 Dr' },
    { date: '2026-04-12', voucherNo: 'INV-2025-004', type: 'Sales', particulars: 'Sales of Enterprise Licenses', dr: '₹ 1,50,000.00', cr: '-', balance: '₹ 2,68,000.00 Dr' },
    { date: '2026-04-14', voucherNo: 'CN-2025-001', type: 'Credit Note', particulars: 'Return of defective license keys', dr: '-', cr: '₹ 52,600.00', balance: '₹ 2,15,400.00 Dr' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Ledger Picker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', color: '#f8fafc' }}>Ledger Account Statement</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Real-time running balance calculator (total Dr − total Cr)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Select Ledger:</span>
          <select
            value={selectedLedger}
            onChange={(e) => setSelectedLedger(e.target.value)}
            style={{ minWidth: '240px' }}
          >
            <option value="Acme Traders Pvt Ltd">Acme Traders Pvt Ltd (Debtor)</option>
            <option value="Sales Revenue Account">Sales Revenue Account (Income)</option>
            <option value="HDFC Bank Account">HDFC Bank Account (Asset)</option>
          </select>
        </div>
      </div>

      {/* Ledger Summary Overview */}
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Account Group</span>
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>{currentDetails.group}</span>
          <span style={{ fontSize: '0.75rem', color: '#6366f1', display: 'block', marginTop: '0.2rem' }}>Nature: {currentDetails.nature}</span>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Opening Balance</span>
          <span style={{ fontWeight: 600, color: '#f8fafc' }}>{currentDetails.opening}</span>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Total Debits (Dr)</span>
          <span style={{ fontWeight: 600, color: '#10b981' }}>{currentDetails.totalDr}</span>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Total Credits (Cr)</span>
          <span style={{ fontWeight: 600, color: '#f43f5e' }}>{currentDetails.totalCr}</span>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Closing Running Balance</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{currentDetails.closing}</span>
            <span className={`badge ${currentDetails.closingType === 'Dr' ? 'badge-dr' : 'badge-cr'}`}>
              {currentDetails.closingType}
            </span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '0.75rem' }}>Transaction Ledger Entries</h3>
        
        <table className="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Voucher #</th>
              <th>Type</th>
              <th>Particulars</th>
              <th style={{ textAlign: 'right' }}>Debit (Dr)</th>
              <th style={{ textAlign: 'right' }}>Credit (Cr)</th>
              <th style={{ textAlign: 'right' }}>Running Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx}>
                <td style={{ color: '#94a3b8' }}>{tx.date}</td>
                <td style={{ fontWeight: 600, color: '#6366f1' }}>{tx.voucherNo}</td>
                <td><span className="badge badge-dr">{tx.type}</span></td>
                <td>{tx.particulars}</td>
                <td style={{ textAlign: 'right', color: tx.dr !== '-' ? '#10b981' : '#64748b', fontWeight: tx.dr !== '-' ? 600 : 400 }}>{tx.dr}</td>
                <td style={{ textAlign: 'right', color: tx.cr !== '-' ? '#f43f5e' : '#64748b', fontWeight: tx.cr !== '-' ? 600 : 400 }}>{tx.cr}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{tx.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
