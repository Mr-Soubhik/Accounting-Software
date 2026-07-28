import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { DashboardPage } from './pages/Dashboard';
import { TransactionEntryPage } from './pages/TransactionEntry';
import { LedgersPage } from './pages/Ledgers';
import { InvoicingPage } from './pages/Invoicing';
import { ReportsPage } from './pages/Reports';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [currentFy, setCurrentFy] = useState('FY2025-26');

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
          {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
          {activeTab === 'vouchers' && <TransactionEntryPage />}
          {activeTab === 'ledgers' && <LedgersPage />}
          {activeTab === 'invoicing' && <InvoicingPage />}
          {activeTab === 'reports' && <ReportsPage />}
          {activeTab === 'inventory' && <DashboardPage onNavigate={setActiveTab} />}
          {activeTab === 'settings' && <DashboardPage onNavigate={setActiveTab} />}
        </main>

        {/* Tally Right Function Key Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
