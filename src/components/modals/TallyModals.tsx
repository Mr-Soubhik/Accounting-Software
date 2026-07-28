import React, { useState } from 'react';

export type ActiveModalType = 'none' | 'F2_Date' | 'F3_Company' | 'F11_Features' | 'F12_Configure';

interface TallyModalsProps {
  activeModal: ActiveModalType;
  onClose: () => void;
  currentDate: string;
  onDateChange: (d: string) => void;
  currentCompany: string;
  onCompanyChange: (c: string) => void;
}

export const TallyModals: React.FC<TallyModalsProps> = ({
  activeModal,
  onClose,
  currentDate,
  onDateChange,
  currentCompany,
  onCompanyChange,
}) => {
  // F2 Date state
  const [inputDate, setInputDate] = useState(currentDate);

  // F3 Company state
  const [compName, setCompName] = useState(currentCompany);
  const [selectedCompOption, setSelectedCompOption] = useState<'select' | 'alter' | 'create'>('select');

  // F11 Features state
  const [features, setFeatures] = useState({
    enableGst: true,
    enableEInvoice: true,
    enableEWayBill: true,
    maintainBillWise: true,
    enableMultiCurrency: false,
    enableInventory: true,
    enableGodowns: true,
    enableBatchWise: false,
    enableDiscountColumns: true,
  });

  // F12 Configure state
  const [configs, setConfigs] = useState({
    showLedgerBalances: true,
    warnNegativeCash: true,
    allowZeroAmount: false,
    useDrCrInVoucher: true,
    showInventoryDetails: true,
    defaultCreditPeriodDays: 30,
  });

  if (activeModal === 'none') return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      {/* -------------------- F2: DATE / PERIOD MODAL -------------------- */}
      {activeModal === 'F2_Date' && (
        <div style={{
          width: '380px',
          backgroundColor: 'var(--tally-card-bg)',
          border: '2px solid var(--tally-yellow)',
          padding: '1.25rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.9)'
        }}>
          <div style={{ backgroundColor: 'var(--tally-teal-header)', color: 'var(--tally-yellow)', padding: '0.4rem 0.6rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Change Current Date (F2)</span>
            <span className="f-key">F2</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                Current Voucher Date:
              </label>
              <input
                type="text"
                className="tally-input"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                placeholder="e.g. 15-Apr-2026"
                style={{ width: '100%', fontSize: '0.95rem', fontWeight: 700 }}
              />
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--tally-text-dim)', backgroundColor: '#051318', padding: '0.5rem', border: '1px solid var(--tally-border)' }}>
              Period: 01-Apr-2025 to 31-Mar-2026 (FY2025-26)
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => { onDateChange(inputDate); onClose(); }}
                className="tally-btn-yellow"
                style={{ padding: '0.35rem 1rem' }}
              >
                Accept (Enter)
              </button>
              <button onClick={onClose} className="tally-btn" style={{ padding: '0.35rem 1rem' }}>
                Cancel (Esc)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- F3: COMPANY MODAL -------------------- */}
      {activeModal === 'F3_Company' && (
        <div style={{
          width: '520px',
          backgroundColor: 'var(--tally-card-bg)',
          border: '2px solid var(--tally-yellow)',
          padding: '1.25rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.9)'
        }}>
          <div style={{ backgroundColor: 'var(--tally-teal-header)', color: 'var(--tally-yellow)', padding: '0.4rem 0.6rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Company Information & Selection (F3)</span>
            <span className="f-key">F3</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setSelectedCompOption('select')}
                className={selectedCompOption === 'select' ? 'tally-btn-yellow' : 'tally-btn'}
                style={{ flex: 1, padding: '0.35rem' }}
              >
                Select Company
              </button>
              <button
                onClick={() => setSelectedCompOption('alter')}
                className={selectedCompOption === 'alter' ? 'tally-btn-yellow' : 'tally-btn'}
                style={{ flex: 1, padding: '0.35rem' }}
              >
                Alter Info
              </button>
              <button
                onClick={() => setSelectedCompOption('create')}
                className={selectedCompOption === 'create' ? 'tally-btn-yellow' : 'tally-btn'}
                style={{ flex: 1, padding: '0.35rem' }}
              >
                Create Company
              </button>
            </div>

            {selectedCompOption === 'select' && (
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  List of Open Companies:
                </label>
                <select
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="tally-input"
                  style={{ width: '100%', fontSize: '0.9rem' }}
                >
                  <option value="Soubhik Global Enterprise Pvt Ltd">Soubhik Global Enterprise Pvt Ltd (Delhi - GSTIN 07AAAAA0000A1Z5)</option>
                  <option value="Vortex Technologies Ltd">Vortex Technologies Ltd (Mumbai - GSTIN 27BBBCC1111B2Z9)</option>
                  <option value="Acme Trading Company">Acme Trading Company (Kolkata - GSTIN 19CCCDD2222C3Z2)</option>
                </select>
              </div>
            )}

            {selectedCompOption === 'alter' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="tally-input"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  placeholder="Company Name"
                />
                <input
                  type="text"
                  className="tally-input"
                  value="07AAAAA0000A1Z5"
                  onChange={() => {}}
                  placeholder="GSTIN Number"
                />
              </div>
            )}

            {selectedCompOption === 'create' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="tally-input"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  placeholder="New Company Name"
                />
                <input
                  type="text"
                  className="tally-input"
                  placeholder="GSTIN (e.g. 07AAAAA0000A1Z5)"
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => { onCompanyChange(compName); onClose(); }}
                className="tally-btn-yellow"
                style={{ padding: '0.35rem 1rem' }}
              >
                Save & Select (Enter)
              </button>
              <button onClick={onClose} className="tally-btn" style={{ padding: '0.35rem 1rem' }}>
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- F11: FEATURES CONFIGURATION MODAL -------------------- */}
      {activeModal === 'F11_Features' && (
        <div style={{
          width: '640px',
          backgroundColor: 'var(--tally-card-bg)',
          border: '2px solid var(--tally-yellow)',
          padding: '1.25rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.9)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <div style={{ backgroundColor: 'var(--tally-teal-header)', color: 'var(--tally-yellow)', padding: '0.4rem 0.6rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Company Features Configuration (F11)</span>
            <span className="f-key">F11</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Accounting Features */}
            <div style={{ backgroundColor: '#051b22', padding: '0.75rem', border: '1px solid var(--tally-border)' }}>
              <h4 style={{ color: 'var(--tally-yellow)', fontSize: '0.85rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--tally-border)', paddingBottom: '0.2rem' }}>
                Accounting Features
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Maintain Bill-wise Entry:</span>
                  <input type="checkbox" checked={features.maintainBillWise} onChange={e => setFeatures({ ...features, maintainBillWise: e.target.checked })} />
                </label>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Enable Multi-Currency:</span>
                  <input type="checkbox" checked={features.enableMultiCurrency} onChange={e => setFeatures({ ...features, enableMultiCurrency: e.target.checked })} />
                </label>
              </div>
            </div>

            {/* Inventory Features */}
            <div style={{ backgroundColor: '#051b22', padding: '0.75rem', border: '1px solid var(--tally-border)' }}>
              <h4 style={{ color: '#38bdf8', fontSize: '0.85rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--tally-border)', paddingBottom: '0.2rem' }}>
                Inventory Features
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Integrate Accounts & Inventory:</span>
                  <input type="checkbox" checked={features.enableInventory} onChange={e => setFeatures({ ...features, enableInventory: e.target.checked })} />
                </label>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Multiple Godowns / Warehouses:</span>
                  <input type="checkbox" checked={features.enableGodowns} onChange={e => setFeatures({ ...features, enableGodowns: e.target.checked })} />
                </label>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Use Discount Column in Invoices:</span>
                  <input type="checkbox" checked={features.enableDiscountColumns} onChange={e => setFeatures({ ...features, enableDiscountColumns: e.target.checked })} />
                </label>
              </div>
            </div>

            {/* Statutory & GST Features */}
            <div style={{ gridColumn: 'span 2', backgroundColor: '#051b22', padding: '0.75rem', border: '1px solid var(--tally-border)' }}>
              <h4 style={{ color: '#4ade80', fontSize: '0.85rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--tally-border)', paddingBottom: '0.2rem' }}>
                Statutory & GST Compliance Features
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Enable Goods and Services Tax (GST):</span>
                  <input type="checkbox" checked={features.enableGst} onChange={e => setFeatures({ ...features, enableGst: e.target.checked })} />
                </label>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Enable e-Invoicing (IRN & QR):</span>
                  <input type="checkbox" checked={features.enableEInvoice} onChange={e => setFeatures({ ...features, enableEInvoice: e.target.checked })} />
                </label>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Enable e-Way Bill Details:</span>
                  <input type="checkbox" checked={features.enableEWayBill} onChange={e => setFeatures({ ...features, enableEWayBill: e.target.checked })} />
                </label>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button
              onClick={() => { alert('F11 Features updated successfully!'); onClose(); }}
              className="tally-btn-yellow"
              style={{ padding: '0.35rem 1rem' }}
            >
              Accept Features (Enter)
            </button>
            <button onClick={onClose} className="tally-btn" style={{ padding: '0.35rem 1rem' }}>
              Cancel (Esc)
            </button>
          </div>
        </div>
      )}

      {/* -------------------- F12: CONFIGURE MODAL -------------------- */}
      {activeModal === 'F12_Configure' && (
        <div style={{
          width: '580px',
          backgroundColor: 'var(--tally-card-bg)',
          border: '2px solid var(--tally-yellow)',
          padding: '1.25rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.9)'
        }}>
          <div style={{ backgroundColor: 'var(--tally-teal-header)', color: 'var(--tally-yellow)', padding: '0.4rem 0.6rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Voucher & Master Configuration (F12)</span>
            <span className="f-key">F12</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#051b22', padding: '0.5rem', border: '1px solid var(--tally-border)' }}>
              <span>Show Ledger Current Balances during Voucher Entry:</span>
              <input type="checkbox" checked={configs.showLedgerBalances} onChange={e => setConfigs({ ...configs, showLedgerBalances: e.target.checked })} />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#051b22', padding: '0.5rem', border: '1px solid var(--tally-border)' }}>
              <span>Warn on Negative Cash Balance:</span>
              <input type="checkbox" checked={configs.warnNegativeCash} onChange={e => setConfigs({ ...configs, warnNegativeCash: e.target.checked })} />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#051b22', padding: '0.5rem', border: '1px solid var(--tally-border)' }}>
              <span>Allow Zero-Amount Voucher Entries:</span>
              <input type="checkbox" checked={configs.allowZeroAmount} onChange={e => setConfigs({ ...configs, allowZeroAmount: e.target.checked })} />
            </label>

            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#051b22', padding: '0.5rem', border: '1px solid var(--tally-border)' }}>
              <span>Use 'By/To' instead of 'Dr/Cr' during Entry:</span>
              <input type="checkbox" checked={configs.useDrCrInVoucher} onChange={e => setConfigs({ ...configs, useDrCrInVoucher: e.target.checked })} />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
            <button
              onClick={() => { alert('F12 Configurations saved!'); onClose(); }}
              className="tally-btn-yellow"
              style={{ padding: '0.35rem 1rem' }}
            >
              Save Configuration (Enter)
            </button>
            <button onClick={onClose} className="tally-btn" style={{ padding: '0.35rem 1rem' }}>
              Close (Esc)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
