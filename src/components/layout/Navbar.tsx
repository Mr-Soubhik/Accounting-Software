import React from 'react';

interface NavbarProps {
  currentFy: string;
  onFyChange: (fy: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentFy, onFyChange }) => {
  return (
    <header style={{
      height: '48px',
      backgroundColor: 'var(--tally-teal-header)',
      borderBottom: '2px solid var(--tally-border-highlight)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Left: Tally Prime MOD APK by Soubhik Brand & Universal Go To */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            backgroundColor: 'var(--tally-yellow)',
            color: '#002229',
            fontWeight: 900,
            fontSize: '0.85rem',
            padding: '0.15rem 0.5rem',
            borderRadius: '2px',
            letterSpacing: '0.05em'
          }}>
            TALLY PRIME MOD APK
          </span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
            by Soubhik <span style={{ fontSize: '0.7rem', color: 'var(--tally-yellow)' }}>v4.0 (Offline Desktop Edition)</span>
          </span>
        </div>

        {/* Alt+G: Go To Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#051318',
          border: '1px solid var(--tally-border-highlight)',
          borderRadius: '2px',
          padding: '0.25rem 0.6rem',
          gap: '0.5rem',
          width: '280px'
        }}>
          <span className="f-key">Alt+G</span>
          <input
            type="text"
            placeholder="Go To... (Search Reports / Masters)"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '0.8rem',
              color: 'var(--tally-text)',
              width: '100%',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Center: Company Name & Current Period */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem' }}>
        <div>
          <span style={{ color: 'var(--tally-text-muted)' }}>Company: </span>
          <span style={{ color: 'var(--tally-yellow)', fontWeight: 700 }}>Soubhik Global Enterprise Pvt Ltd</span>
        </div>

        <div>
          <span style={{ color: 'var(--tally-text-muted)' }}>Current Period: </span>
          <select
            value={currentFy}
            onChange={(e) => onFyChange(e.target.value)}
            className="tally-input"
            style={{ padding: '0.1rem 0.3rem', fontSize: '0.75rem' }}
          >
            <option value="FY2025-26">1-Apr-2025 to 31-Mar-2026</option>
            <option value="FY2024-25">1-Apr-2024 to 31-Mar-2025</option>
          </select>
        </div>

        <div>
          <span style={{ color: 'var(--tally-text-muted)' }}>Current Date: </span>
          <span style={{ color: '#fff', fontWeight: 600 }}>15-Apr-2026</span>
        </div>
      </div>

      {/* Right: Top Action Menu Shortcuts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button className="tally-btn"><span className="f-key">K</span> Company</button>
        <button className="tally-btn"><span className="f-key">Y</span> Data</button>
        <button className="tally-btn"><span className="f-key">Z</span> Exchange</button>
        <button className="tally-btn"><span className="f-key">F1</span> Help</button>
      </div>
    </header>
  );
};
