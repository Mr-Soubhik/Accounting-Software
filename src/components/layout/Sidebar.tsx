import React from 'react';

export type NavTab = 
  | 'dashboard'
  | 'vouchers'
  | 'ledgers'
  | 'reports'
  | 'invoicing'
  | 'inventory'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const fKeys = [
    { key: 'F2', label: 'Date', tab: 'dashboard' as NavTab },
    { key: 'F3', label: 'Company', tab: 'settings' as NavTab },
    { key: 'F4', label: 'Contra', tab: 'vouchers' as NavTab },
    { key: 'F5', label: 'Payment', tab: 'vouchers' as NavTab },
    { key: 'F6', label: 'Receipt', tab: 'vouchers' as NavTab },
    { key: 'F7', label: 'Journal', tab: 'vouchers' as NavTab },
    { key: 'F8', label: 'Sales', tab: 'vouchers' as NavTab },
    { key: 'F9', label: 'Purchase', tab: 'vouchers' as NavTab },
    { key: 'Alt+F6', label: 'Credit Note', tab: 'invoicing' as NavTab },
    { key: 'Alt+F9', label: 'Debit Note', tab: 'invoicing' as NavTab },
    { key: 'F10', label: 'Other Vouchers', tab: 'vouchers' as NavTab },
    { key: 'F11', label: 'Features', tab: 'settings' as NavTab },
    { key: 'F12', label: 'Configure', tab: 'settings' as NavTab },
  ];

  return (
    <aside style={{
      width: '180px',
      backgroundColor: 'var(--tally-teal-header)',
      borderLeft: '2px solid var(--tally-border-highlight)',
      height: 'calc(100vh - 48px)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0.4rem 0.25rem',
      position: 'fixed',
      right: 0,
      top: '48px',
      gap: '0.2rem'
    }}>
      <div style={{
        fontSize: '0.65rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--tally-yellow)',
        fontWeight: 700,
        textAlign: 'center',
        padding: '0.2rem 0 0.4rem',
        borderBottom: '1px solid var(--tally-border)'
      }}>
        Tally Function Keys
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.2rem' }}>
        {fKeys.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onTabChange(item.tab)}
            style={{
              width: '100%',
              padding: '0.4rem 0.5rem',
              backgroundColor: '#00252b',
              border: '1px solid var(--tally-border-highlight)',
              color: 'var(--tally-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontWeight: 500 }}>{item.label}</span>
            <span className="f-key">{item.key}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};
