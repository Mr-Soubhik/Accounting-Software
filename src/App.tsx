import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { DashboardPage } from './pages/Dashboard';
import { TransactionEntryPage } from './pages/TransactionEntry';
import { LedgersPage } from './pages/Ledgers';
import { InvoicingPage } from './pages/Invoicing';
import { ReportsPage } from './pages/Reports';
import { VoucherType } from './types';
import { TallyModals, ActiveModalType } from './components/modals/TallyModals';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [voucherType, setVoucherType] = useState<VoucherType>('Sales');
  const [currentFy, setCurrentFy] = useState('FY2025-26');
  const [currentDate, setCurrentDate] = useState('15-Apr-2026');
  const [currentCompany, setCurrentCompany] = useState('Soubhik Global Enterprise Pvt Ltd');
  const [activeModal, setActiveModal] = useState<ActiveModalType>('none');

  const handleTabChange = (tab: NavTab, vType?: VoucherType) => {
    setActiveTab(tab);
    if (vType) {
      setVoucherType(vType);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--tally-teal-dark)', color: 'var(--tally-text)' }}>
      {/* Tally Prime Top Bar */}
      <Navbar currentFy={currentFy} onFyChange={setCurrentFy} />

      {/* Main Screen Content with Tally Right Function Key Bar */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 48px)' }}>
        {/* Main Content Area */}
        <main style={{
          flex: 1,
          marginRight: '180px', // Space for fixed Tally right function key bar
          padding: '1.25rem 1.5rem',
          maxWidth: 'calc(100vw - 180px)'
        }}>
          {activeTab === 'dashboard' && <DashboardPage onNavigate={handleTabChange} />}
          {activeTab === 'vouchers' && (
            <TransactionEntryPage
              initialVoucherType={voucherType}
              onVoucherTypeChange={setVoucherType}
            />
          )}
          {activeTab === 'ledgers' && <LedgersPage />}
          {activeTab === 'invoicing' && <InvoicingPage />}
          {activeTab === 'reports' && <ReportsPage />}
          {activeTab === 'inventory' && <DashboardPage onNavigate={handleTabChange} />}
          {activeTab === 'settings' && <DashboardPage onNavigate={handleTabChange} />}
        </main>

        {/* Tally Right Function Key Sidebar */}
        <Sidebar
          activeTab={activeTab}
          activeVoucherType={voucherType}
          onTabChange={handleTabChange}
          onOpenModal={setActiveModal}
        />
      </div>

      {/* Interactive Tally Modals (F2 Date, F3 Company, F11 Features, F12 Configure) */}
      <TallyModals
        activeModal={activeModal}
        onClose={() => setActiveModal('none')}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        currentCompany={currentCompany}
        onCompanyChange={setCurrentCompany}
      />
    </div>
  );
}


