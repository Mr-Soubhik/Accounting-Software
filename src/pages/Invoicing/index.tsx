import React, { useState } from 'react';

export const InvoicingPage: React.FC = () => {
  const [selectedSubTab, setSelectedSubTab] = useState<'bills' | 'ageing' | 'settlement'>('bills');

  const bills = [
    { billId: 101, ref: 'INV-2025-001', party: 'Acme Traders Pvt Ltd', date: '2026-03-10', dueDate: '2026-04-10', amount: 118000, allocated: 50000, outstanding: 68000, status: 'Partially Settled', daysOverdue: 5 },
    { billId: 102, ref: 'INV-2025-004', party: 'Acme Traders Pvt Ltd', date: '2026-04-12', dueDate: '2026-05-12', amount: 150000, allocated: 0, outstanding: 150000, status: 'Unsettled', daysOverdue: 0 },
    { billId: 103, ref: 'PUR-2025-001', party: 'Vortex Raw Materials', date: '2026-02-15', dueDate: '2026-03-15', amount: 85400, allocated: 0, outstanding: 85400, status: 'Overdue', daysOverdue: 30 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', color: '#f8fafc' }}>Bill-Wise Tracking & Ageing Analysis</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Tally-style New Ref, Against Ref, On Account bill allocations & debtor/creditor ageing
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['bills', 'ageing', 'settlement'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedSubTab(tab)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                backgroundColor: selectedSubTab === tab ? '#6366f1' : '#151c2c',
                color: '#fff',
                fontWeight: selectedSubTab === tab ? 600 : 400,
                fontSize: '0.85rem',
                border: '1px solid #26334d'
              }}
            >
              {tab === 'bills' ? 'Outstanding Bills' : tab === 'ageing' ? 'Debtor Ageing Report' : 'Against Ref Settlement'}
            </button>
          ))}
        </div>
      </div>

      {/* Ageing Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>0 - 30 Days (Current)</span>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.3rem' }}>₹ 1,50,000.00</div>
          <span style={{ fontSize: '0.75rem', color: '#10b981' }}>1 Bill Pending</span>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>31 - 60 Days</span>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.3rem' }}>₹ 68,000.00</div>
          <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>1 Bill Overdue</span>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #f43f5e' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>61 - 90 Days</span>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.3rem' }}>₹ 85,400.00</div>
          <span style={{ fontSize: '0.75rem', color: '#f43f5e' }}>1 Bill Action Required</span>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #64748b' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>90+ Days</span>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.3rem' }}>₹ 0.00</div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>0 Critical Bills</span>
        </div>
      </div>

      {/* Outstanding Bills Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '0.75rem' }}>
          Outstanding Invoices & Bills (New Ref)
        </h3>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Bill Ref</th>
              <th>Party Ledger</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th>Bill Amount</th>
              <th>Allocated</th>
              <th>Outstanding</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(b => (
              <tr key={b.billId}>
                <td style={{ fontWeight: 600, color: '#6366f1' }}>{b.ref}</td>
                <td>{b.party}</td>
                <td style={{ color: '#94a3b8' }}>{b.date}</td>
                <td style={{ color: b.daysOverdue > 0 ? '#f43f5e' : '#94a3b8' }}>{b.dueDate}</td>
                <td style={{ fontWeight: 600 }}>₹ {b.amount.toLocaleString('en-IN')}</td>
                <td style={{ color: '#10b981' }}>₹ {b.allocated.toLocaleString('en-IN')}</td>
                <td style={{ fontWeight: 700, color: '#f8fafc' }}>₹ {b.outstanding.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`badge ${b.status === 'Partially Settled' ? 'badge-confirmed' : 'badge-cr'}`}>
                    {b.status}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                    Settle Against Ref
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
