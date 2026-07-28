import React from 'react';
import { VoucherType } from '../../types';

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
  activeVoucherType?: VoucherType;
  onTabChange: (tab: NavTab, voucherType?: VoucherType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, activeVoucherType, onTabChange }) => {
  const fKeys: { key: string; label: string; tab: NavTab; voucherType?: VoucherType }[] = [
    { key: 'F2', label: 'Date', tab: 'dashboard' },
    { key: 'F3', label: 'Company', tab: 'settings' },
    { key: 'F4', label: 'Contra', tab: 'vouchers', voucherType: 'Contra' },
    { key: 'F5', label: 'Payment', tab: 'vouchers', voucherType: 'Payment' },
    { key: 'F6', label: 'Receipt', tab: 'vouchers', voucherType: 'Receipt' },
    { key: 'F7', label: 'Journal', tab: 'vouchers', voucherType: 'Journal' },
    { key: 'F8', label: 'Sales', tab: 'vouchers', voucherType: 'Sales' },
    { key: 'F9', label: 'Purchase', tab: 'vouchers', voucherType: 'Purchase' },
    { key: 'Alt+F6', label: 'Credit Note', tab: 'vouchers', voucherType: 'CreditNote' },
    { key: 'Alt+F9', label: 'Debit Note', tab: 'vouchers', voucherType: 'DebitNote' },
    { key: 'F10', label: 'Other Vouchers', tab: 'vouchers', voucherType: 'Sales' },
    { key: 'F11', label: 'Features', tab: 'settings' },
    { key: 'F12', label: 'Configure', tab: 'settings' },
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
      gap: '0.2rem',
      zIndex: 100
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
        {fKeys.map((item, idx) => {
          const isTabActive = activeTab === item.tab;
          const isVoucherMatch = item.voucherType ? activeVoucherType === item.voucherType : true;
          const isActive = isTabActive && isVoucherMatch;
          
          return (
            <button
              key={idx}
              onClick={() => onTabChange(item.tab, item.voucherType)}
              style={{
                width: '100%',
                padding: '0.4rem 0.5rem',
                backgroundColor: isActive ? '#004d5a' : '#00252b',
                border: isActive ? '1px solid var(--tally-yellow)' : '1px solid var(--tally-border-highlight)',
                color: isActive ? 'var(--tally-yellow)' : 'var(--tally-text)',
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
          );
        })}
      </div>
    </aside>
  );
};

