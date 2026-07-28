import React from 'react';
import { NavTab } from '../../components/layout/Sidebar';

interface DashboardProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 400px',
      gap: '2rem',
      alignItems: 'start',
      padding: '1.5rem 0'
    }}>
      {/* Left: Company Data & Summary Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Company Header Box */}
        <div style={{
          backgroundColor: 'var(--tally-card-bg)',
          border: '1px solid var(--tally-border-highlight)',
          padding: '1rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block' }}>Current Company</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--tally-yellow)' }}>Soubhik Global Enterprise Pvt Ltd</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-dim)', display: 'block', marginTop: '0.25rem' }}>GSTIN: 07AAAAA0000A1Z5 (Delhi)</span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block' }}>Date of Last Entry</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>15-Apr-2026</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--tally-green)', display: 'block', marginTop: '0.25rem' }}>✓ Tally Engine Balanced (Dr = Cr)</span>
          </div>
        </div>

        {/* Accounting Summary Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div style={{ backgroundColor: '#091a21', border: '1px solid var(--tally-border)', padding: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)' }}>Total Sales Revenue</span>
            <div className="tally-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--tally-green)', marginTop: '0.3rem' }}>
              ₹ 12,45,000.00
            </div>
          </div>

          <div style={{ backgroundColor: '#091a21', border: '1px solid var(--tally-border)', padding: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)' }}>Sundry Debtors (Receivables)</span>
            <div className="tally-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--tally-yellow)', marginTop: '0.3rem' }}>
              ₹ 2,15,400.00
            </div>
          </div>

          <div style={{ backgroundColor: '#091a21', border: '1px solid var(--tally-border)', padding: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)' }}>Sundry Creditors (Payables)</span>
            <div className="tally-mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--tally-red)', marginTop: '0.3rem' }}>
              ₹ 85,400.00
            </div>
          </div>
        </div>

        {/* Recent Day Book Entries */}
        <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)' }}>
          <div style={{
            backgroundColor: 'var(--tally-teal-header)',
            color: 'var(--tally-yellow)',
            padding: '0.5rem 0.85rem',
            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '0.05em'
          }}>
            Day Book (Recent Vouchers)
          </div>

          <table className="tally-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Particulars</th>
                <th>Voucher Type</th>
                <th>Voucher No.</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '15-Apr-2026', party: 'Acme Traders Pvt Ltd', type: 'Sales', no: 'INV-2025-005', amt: '₹ 1,18,000.00 Dr' },
                { date: '12-Apr-2026', party: 'Global Tech Solutions', type: 'Receipt', no: 'REC-2025-002', amt: '₹ 50,000.00 Cr' },
                { date: '10-Apr-2026', party: 'Vortex Raw Materials', type: 'Purchase', no: 'PUR-2025-001', amt: '₹ 85,400.00 Cr' },
                { date: '05-Apr-2026', party: 'HDFC Bank Account', type: 'Payment', no: 'PAY-2025-003', amt: '₹ 25,000.00 Dr' },
              ].map((row, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--tally-text-muted)' }}>{row.date}</td>
                  <td style={{ fontWeight: 600 }}>{row.party}</td>
                  <td style={{ color: 'var(--tally-yellow)' }}>{row.type}</td>
                  <td className="tally-mono" style={{ color: 'var(--tally-blue)' }}>{row.no}</td>
                  <td className="tally-mono" style={{ textAlign: 'right', fontWeight: 700 }}>{row.amt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Gateway of Tally Prime MOD APK by Soubhik Menu Box */}
      <div className="gateway-box" style={{ justifySelf: 'center' }}>
        <div className="gateway-header" style={{ fontSize: '0.85rem', lineHeight: '1.3' }}>
          GATEWAY OF TALLY<br/>
          <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 400 }}>MOD APK BY SOUBHIK</span>
        </div>

        {/* MASTERS */}
        <div className="gateway-section">
          <div className="gateway-section-title">MASTERS</div>
          <div className="gateway-item" onClick={() => onNavigate('ledgers')}>
            <span><span className="gateway-hotkey">C</span>reate</span>
          </div>
          <div className="gateway-item" onClick={() => onNavigate('ledgers')}>
            <span><span className="gateway-hotkey">A</span>lter</span>
          </div>
          <div className="gateway-item" onClick={() => onNavigate('ledgers')}>
            <span>C<span className="gateway-hotkey">h</span>art of Accounts</span>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="gateway-section">
          <div className="gateway-section-title">TRANSACTIONS</div>
          <div className="gateway-item" onClick={() => onNavigate('vouchers')}>
            <span><span className="gateway-hotkey">V</span>ouchers (Accounting)</span>
          </div>
          <div className="gateway-item" onClick={() => onNavigate('invoicing')}>
            <span><span className="gateway-hotkey">D</span>ay Book</span>
          </div>
        </div>

        {/* UTILITIES */}
        <div className="gateway-section">
          <div className="gateway-section-title">UTILITIES</div>
          <div className="gateway-item" onClick={() => onNavigate('invoicing')}>
            <span><span className="gateway-hotkey">B</span>ill Allocations & Ageing</span>
          </div>
        </div>

        {/* REPORTS */}
        <div className="gateway-section">
          <div className="gateway-section-title">REPORTS</div>
          <div className="gateway-item" onClick={() => onNavigate('reports')}>
            <span><span className="gateway-hotkey">B</span>alance Sheet</span>
          </div>
          <div className="gateway-item" onClick={() => onNavigate('reports')}>
            <span><span className="gateway-hotkey">P</span>rofit & Loss A/c</span>
          </div>
          <div className="gateway-item" onClick={() => onNavigate('inventory')}>
            <span><span className="gateway-hotkey">S</span>tock Summary</span>
          </div>
          <div className="gateway-item" onClick={() => onNavigate('reports')}>
            <span><span className="gateway-hotkey">R</span>atio Analysis</span>
          </div>
          <div className="gateway-item" onClick={() => onNavigate('reports')}>
            <span>Display More Reports (<span className="gateway-hotkey">D</span>)</span>
          </div>
          <div className="gateway-item" onClick={() => onNavigate('settings')}>
            <span><span className="gateway-hotkey">Q</span>uit / Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
};
