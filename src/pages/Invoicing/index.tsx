import React, { useState } from 'react';

export const InvoicingPage: React.FC = () => {
  const [selectedSubTab, setSelectedSubTab] = useState<'bills' | 'ageing' | 'settlement'>('bills');

  const bills = [
    { billId: 101, ref: 'INV-2025-001', party: 'Acme Traders Pvt Ltd', date: '10-Mar-2026', dueDate: '10-Apr-2026', amount: 118000, allocated: 50000, outstanding: 68000, status: 'Partially Settled', daysOverdue: 5 },
    { billId: 102, ref: 'INV-2025-004', party: 'Acme Traders Pvt Ltd', date: '12-Apr-2026', dueDate: '12-May-2026', amount: 150000, allocated: 0, outstanding: 150000, status: 'Unsettled', daysOverdue: 0 },
    { billId: 103, ref: 'PUR-2025-001', party: 'Vortex Raw Materials', date: '15-Feb-2026', dueDate: '15-Mar-2026', amount: 85400, allocated: 0, outstanding: 85400, status: 'Overdue', daysOverdue: 30 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Header Bar */}
      <div style={{
        backgroundColor: 'var(--tally-teal-header)',
        border: '1px solid var(--tally-border-highlight)',
        padding: '0.4rem 0.85rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ color: 'var(--tally-yellow)', fontWeight: 700, fontSize: '0.95rem' }}>
          Bill-Wise Outstanding & Ageing Analysis (New Ref / Against Ref)
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['bills', 'ageing', 'settlement'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedSubTab(tab)}
              style={{
                padding: '0.2rem 0.6rem',
                fontSize: '0.75rem',
                backgroundColor: selectedSubTab === tab ? 'var(--tally-yellow)' : '#00252b',
                color: selectedSubTab === tab ? '#002229' : '#fff',
                fontWeight: selectedSubTab === tab ? 700 : 400,
                border: '1px solid var(--tally-border-highlight)'
              }}
            >
              {tab === 'bills' ? 'Outstanding Bills' : tab === 'ageing' ? 'Debtor Ageing Report' : 'Against Ref Settlement'}
            </button>
          ))}
        </div>
      </div>

      {/* Ageing Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
        <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)', borderLeft: '4px solid var(--tally-green)', padding: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)' }}>0 - 30 Days (Current)</span>
          <div className="tally-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--tally-yellow)', marginTop: '0.2rem' }}>₹ 1,50,000.00</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--tally-green)' }}>1 Bill Pending</span>
        </div>
        <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)', borderLeft: '4px solid var(--tally-yellow)', padding: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)' }}>31 - 60 Days</span>
          <div className="tally-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--tally-yellow)', marginTop: '0.2rem' }}>₹ 68,000.00</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--tally-yellow)' }}>1 Bill Overdue</span>
        </div>
        <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)', borderLeft: '4px solid var(--tally-red)', padding: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)' }}>61 - 90 Days</span>
          <div className="tally-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--tally-red)', marginTop: '0.2rem' }}>₹ 85,400.00</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--tally-red)' }}>1 Bill Action Required</span>
        </div>
        <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)', borderLeft: '4px solid var(--tally-text-dim)', padding: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)' }}>90+ Days</span>
          <div className="tally-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--tally-text)', marginTop: '0.2rem' }}>₹ 0.00</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--tally-text-dim)' }}>0 Critical Bills</span>
        </div>
      </div>

      {/* Outstanding Bills Table */}
      <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)' }}>
        <table className="tally-table">
          <thead>
            <tr>
              <th>Bill Ref</th>
              <th>Party Ledger</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th style={{ textAlign: 'right' }}>Bill Amount</th>
              <th style={{ textAlign: 'right' }}>Allocated</th>
              <th style={{ textAlign: 'right' }}>Outstanding</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(b => (
              <tr key={b.billId}>
                <td className="tally-mono" style={{ fontWeight: 600, color: 'var(--tally-yellow)' }}>{b.ref}</td>
                <td style={{ fontWeight: 600 }}>{b.party}</td>
                <td style={{ color: 'var(--tally-text-muted)' }}>{b.date}</td>
                <td style={{ color: b.daysOverdue > 0 ? 'var(--tally-red)' : 'var(--tally-text-muted)' }}>{b.dueDate}</td>
                <td className="tally-mono" style={{ textAlign: 'right', fontWeight: 600 }}>₹ {b.amount.toLocaleString('en-IN')}</td>
                <td className="tally-mono" style={{ textAlign: 'right', color: 'var(--tally-green)' }}>₹ {b.allocated.toLocaleString('en-IN')}</td>
                <td className="tally-mono" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--tally-text)' }}>₹ {b.outstanding.toLocaleString('en-IN')}</td>
                <td>
                  <span className="badge badge-dr" style={{ fontSize: '0.7rem' }}>
                    {b.status}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="tally-btn" style={{ fontSize: '0.7rem' }}>
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
