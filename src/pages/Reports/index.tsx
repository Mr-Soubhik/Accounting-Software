import React, { useState } from 'react';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<'balance' | 'pnl' | 'trial'>('balance');

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
          {reportType === 'balance' ? 'Balance Sheet' : reportType === 'pnl' ? 'Profit & Loss A/c' : 'Trial Balance'}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setReportType('balance')}
            style={{
              padding: '0.2rem 0.6rem',
              fontSize: '0.75rem',
              backgroundColor: reportType === 'balance' ? 'var(--tally-yellow)' : '#00252b',
              color: reportType === 'balance' ? '#002229' : '#fff',
              fontWeight: reportType === 'balance' ? 700 : 400,
              border: '1px solid var(--tally-border-highlight)'
            }}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setReportType('pnl')}
            style={{
              padding: '0.2rem 0.6rem',
              fontSize: '0.75rem',
              backgroundColor: reportType === 'pnl' ? 'var(--tally-yellow)' : '#00252b',
              color: reportType === 'pnl' ? '#002229' : '#fff',
              fontWeight: reportType === 'pnl' ? 700 : 400,
              border: '1px solid var(--tally-border-highlight)'
            }}
          >
            Profit & Loss A/c
          </button>
          <button
            onClick={() => setReportType('trial')}
            style={{
              padding: '0.2rem 0.6rem',
              fontSize: '0.75rem',
              backgroundColor: reportType === 'trial' ? 'var(--tally-yellow)' : '#00252b',
              color: reportType === 'trial' ? '#002229' : '#fff',
              fontWeight: reportType === 'trial' ? 700 : 400,
              border: '1px solid var(--tally-border-highlight)'
            }}
          >
            Trial Balance
          </button>
        </div>
      </div>

      {/* Tally T-Account Dual Column Balance Sheet */}
      {reportType === 'balance' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: 'var(--tally-card-bg)',
          border: '1px solid var(--tally-border)'
        }}>
          {/* Left Column: Liabilities */}
          <div style={{ borderRight: '1px solid var(--tally-border)' }}>
            <div style={{ backgroundColor: 'var(--tally-teal-header)', color: 'var(--tally-yellow)', padding: '0.4rem 0.75rem', fontWeight: 700, fontSize: '0.8rem' }}>
              LIABILITIES & CAPITAL
            </div>
            <table className="tally-table">
              <tbody>
                <tr>
                  <td style={{ fontWeight: 700 }}>Capital Account</td>
                  <td className="tally-mono" style={{ textAlign: 'right', fontWeight: 700 }}>₹ 5,00,000.00</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '1.5rem', color: 'var(--tally-text-muted)' }}>Owner Capital (Retained)</td>
                  <td className="tally-mono" style={{ textAlign: 'right' }}>₹ 5,00,000.00</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Current Liabilities</td>
                  <td className="tally-mono" style={{ textAlign: 'right', fontWeight: 700 }}>₹ 1,03,400.00</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '1.5rem', color: 'var(--tally-text-muted)' }}>Sundry Creditors</td>
                  <td className="tally-mono" style={{ textAlign: 'right' }}>₹ 85,400.00</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '1.5rem', color: 'var(--tally-text-muted)' }}>Duties & Taxes (Output GST)</td>
                  <td className="tally-mono" style={{ textAlign: 'right' }}>₹ 18,000.00</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700, color: 'var(--tally-green)' }}>Profit & Loss A/c (Net Profit)</td>
                  <td className="tally-mono" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--tally-green)' }}>₹ 2,93,500.01</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#051318', fontWeight: 700 }}>
                  <td style={{ color: 'var(--tally-yellow)' }}>Total Liabilities</td>
                  <td className="tally-mono" style={{ textAlign: 'right', color: 'var(--tally-yellow)' }}>₹ 8,96,900.01</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Right Column: Assets */}
          <div>
            <div style={{ backgroundColor: 'var(--tally-teal-header)', color: 'var(--tally-yellow)', padding: '0.4rem 0.75rem', fontWeight: 700, fontSize: '0.8rem' }}>
              ASSETS & PROPERTIES
            </div>
            <table className="tally-table">
              <tbody>
                <tr>
                  <td style={{ fontWeight: 700 }}>Fixed Assets</td>
                  <td className="tally-mono" style={{ textAlign: 'right', fontWeight: 700 }}>₹ 2,85,000.00</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '1.5rem', color: 'var(--tally-text-muted)' }}>Computers & Office Equipment</td>
                  <td className="tally-mono" style={{ textAlign: 'right' }}>₹ 2,85,000.00</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 700 }}>Current Assets</td>
                  <td className="tally-mono" style={{ textAlign: 'right', fontWeight: 700 }}>₹ 6,11,900.01</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '1.5rem', color: 'var(--tally-text-muted)' }}>Cash-in-hand</td>
                  <td className="tally-mono" style={{ textAlign: 'right' }}>₹ 45,000.00</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '1.5rem', color: 'var(--tally-text-muted)' }}>HDFC Bank Account</td>
                  <td className="tally-mono" style={{ textAlign: 'right' }}>₹ 3,15,500.00</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '1.5rem', color: 'var(--tally-text-muted)' }}>Sundry Debtors</td>
                  <td className="tally-mono" style={{ textAlign: 'right' }}>₹ 2,15,400.00</td>
                </tr>
                <tr>
                  <td style={{ paddingLeft: '1.5rem', color: 'var(--tally-text-muted)' }}>GST Input Tax Credit</td>
                  <td className="tally-mono" style={{ textAlign: 'right' }}>₹ 36,000.01</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#051318', fontWeight: 700 }}>
                  <td style={{ color: 'var(--tally-yellow)' }}>Total Assets</td>
                  <td className="tally-mono" style={{ textAlign: 'right', color: 'var(--tally-yellow)' }}>₹ 8,96,900.01</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Trial Balance Statement */}
      {reportType === 'trial' && (
        <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)' }}>
          <table className="tally-table">
            <thead>
              <tr>
                <th>Particulars</th>
                <th style={{ textAlign: 'right' }}>Debit (Dr)</th>
                <th style={{ textAlign: 'right' }}>Credit (Cr)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Current Assets (Cash & Bank)', dr: '₹ 3,60,000.00', cr: '-' },
                { name: 'Sundry Debtors (Acme Traders)', dr: '₹ 2,15,400.00', cr: '-' },
                { name: 'Duties & Taxes (Input GST)', dr: '₹ 36,000.00', cr: '-' },
                { name: 'Sales Revenue Account', dr: '-', cr: '₹ 12,45,000.00' },
                { name: 'Indirect Expenses (Rent & Cloud)', dr: '₹ 4,12,500.00', cr: '-' },
                { name: 'Sundry Creditors (Vortex Raw)', dr: '-', cr: '₹ 85,400.00' },
                { name: 'Round Off Ledger', dr: '₹ 0.01', cr: '-' },
                { name: 'Capital Account', dr: '-', cr: '₹ 2,93,500.01' },
              ].map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td className="tally-mono" style={{ textAlign: 'right', color: r.dr !== '-' ? 'var(--tally-green)' : '#64748b' }}>{r.dr}</td>
                  <td className="tally-mono" style={{ textAlign: 'right', color: r.cr !== '-' ? 'var(--tally-red)' : '#64748b' }}>{r.cr}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#051318', fontWeight: 700 }}>
                <td style={{ color: 'var(--tally-yellow)' }}>Grand Total (Balanced)</td>
                <td className="tally-mono" style={{ textAlign: 'right', color: 'var(--tally-yellow)' }}>₹ 10,23,900.01</td>
                <td className="tally-mono" style={{ textAlign: 'right', color: 'var(--tally-yellow)' }}>₹ 10,23,900.01</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
