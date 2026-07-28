import React, { useState, useMemo } from 'react';
import { VoucherType } from '../../types';

export const TransactionEntryPage: React.FC = () => {
  const [voucherType, setVoucherType] = useState<VoucherType>('Sales');
  const [voucherNumber, setVoucherNumber] = useState('INV-2025-006');
  const [voucherDate, setVoucherDate] = useState('15-Apr-2026');
  const [partyLedger, setPartyLedger] = useState('Acme Traders Pvt Ltd');
  const [placeOfSupply, setPlaceOfSupply] = useState('DL');
  const [narration, setNarration] = useState('Sales against PO #99812');
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  const companyStateCode = 'DL';

  // Dynamic Voucher Particulars Rows
  const [items, setItems] = useState([
    { id: 1, particulars: 'Web Application Services', qty: 1, rate: 50000, gstRate: 18 },
    { id: 2, name: 'Cloud Infrastructure Hosting', qty: 2, rate: 15000, gstRate: 18 },
  ]);

  const addItemRow = () => {
    setItems([
      ...items,
      { id: Date.now(), particulars: 'New Particulars Line', qty: 1, rate: 1000, gstRate: 18 }
    ]);
  };

  const removeItemRow = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Real-time Tally Tax Breakdown Engine
  const summary = useMemo(() => {
    let subtotal = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    const isInterstate = placeOfSupply !== companyStateCode;

    items.forEach(item => {
      const lineAmt = item.qty * item.rate;
      subtotal += lineAmt;

      if (isInterstate) {
        igst += lineAmt * (item.gstRate / 100);
      } else {
        cgst += lineAmt * (item.gstRate / 2 / 100);
        sgst += lineAmt * (item.gstRate / 2 / 100);
      }
    });

    const unroundedTotal = subtotal + cgst + sgst + igst;
    const grandTotal = Math.round(unroundedTotal);
    const roundOff = Math.round((grandTotal - unroundedTotal) * 100) / 100;

    return { subtotal, cgst, sgst, igst, unroundedTotal, grandTotal, roundOff, isInterstate };
  }, [items, placeOfSupply]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
      {/* Tally Voucher Top Header Bar */}
      <div style={{
        backgroundColor: 'var(--tally-teal-header)',
        border: '1px solid var(--tally-border-highlight)',
        padding: '0.4rem 0.85rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ color: 'var(--tally-yellow)', fontWeight: 700, fontSize: '0.95rem' }}>
          Accounting Voucher Creation ({voucherType})
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['Sales', 'Purchase', 'Payment', 'Receipt', 'Journal', 'CreditNote', 'DebitNote'] as VoucherType[]).map(type => (
            <button
              key={type}
              onClick={() => setVoucherType(type)}
              style={{
                padding: '0.2rem 0.6rem',
                fontSize: '0.75rem',
                backgroundColor: voucherType === type ? 'var(--tally-yellow)' : '#00252b',
                color: voucherType === type ? '#002229' : '#fff',
                fontWeight: voucherType === type ? 700 : 400,
                border: '1px solid var(--tally-border-highlight)'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Header Fields Grid */}
      <div style={{
        backgroundColor: 'var(--tally-card-bg)',
        border: '1px solid var(--tally-border)',
        padding: '0.75rem 1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block' }}>Voucher No.</span>
          <input className="tally-input" type="text" value={voucherNumber} onChange={e => setVoucherNumber(e.target.value)} style={{ width: '100%' }} />
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block' }}>Date</span>
          <input className="tally-input" type="text" value={voucherDate} onChange={e => setVoucherDate(e.target.value)} style={{ width: '100%' }} />
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block' }}>Party A/c Name</span>
          <select className="tally-input" value={partyLedger} onChange={e => setPartyLedger(e.target.value)} style={{ width: '100%' }}>
            <option value="Acme Traders Pvt Ltd">Acme Traders Pvt Ltd (Cur Bal: ₹ 2,15,400.00 Dr)</option>
            <option value="Vortex Raw Materials">Vortex Raw Materials (Cur Bal: ₹ 85,400.00 Cr)</option>
            <option value="Cash Account">Cash Account (Cur Bal: ₹ 45,000.00 Dr)</option>
            <option value="HDFC Bank Account">HDFC Bank Account (Cur Bal: ₹ 3,60,000.00 Dr)</option>
          </select>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block' }}>Place of Supply</span>
          <select className="tally-input" value={placeOfSupply} onChange={e => setPlaceOfSupply(e.target.value)} style={{ width: '100%' }}>
            <option value="DL">Delhi (Intra-State: CGST+SGST)</option>
            <option value="MH">Maharashtra (Inter-State: IGST)</option>
          </select>
        </div>
      </div>

      {/* Tally Particulars Grid */}
      <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)' }}>
        <table className="tally-table">
          <thead>
            <tr>
              <th style={{ width: '45%' }}>Particulars</th>
              <th style={{ width: '12%' }}>Quantity</th>
              <th style={{ width: '15%' }}>Rate (₹)</th>
              <th style={{ width: '10%' }}>GST %</th>
              <th style={{ width: '15%', textAlign: 'right' }}>Amount (₹)</th>
              <th style={{ width: '3%', textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id}>
                <td>
                  <input
                    className="tally-input"
                    type="text"
                    value={item.particulars || item.name}
                    onChange={e => updateItem(item.id, 'particulars', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </td>
                <td>
                  <input
                    className="tally-input"
                    type="number"
                    value={item.qty}
                    onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%' }}
                  />
                </td>
                <td>
                  <input
                    className="tally-input"
                    type="number"
                    value={item.rate}
                    onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%' }}
                  />
                </td>
                <td>
                  <select
                    className="tally-input"
                    value={item.gstRate}
                    onChange={e => updateItem(item.id, 'gstRate', parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </td>
                <td className="tally-mono" style={{ textAlign: 'right', fontWeight: 700 }}>
                  {(item.qty * item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => removeItemRow(item.id)} style={{ background: 'none', border: 'none', color: 'var(--tally-red)', cursor: 'pointer' }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ padding: '0.4rem 0.75rem', backgroundColor: '#051318', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={addItemRow} className="tally-btn">+ Add Item / Ledger Line</button>
          <span style={{ fontSize: '0.8rem', color: 'var(--tally-text-muted)' }}>Subtotal: ₹ {summary.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Tax Ledger Calculation & Narration Footer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '0.75rem' }}>
        {/* Narration Box */}
        <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--tally-yellow)', fontWeight: 700 }}>Narration:</span>
          <textarea
            className="tally-input"
            value={narration}
            onChange={e => setNarration(e.target.value)}
            rows={3}
            style={{ width: '100%', resize: 'none' }}
          />
        </div>

        {/* Tax Ledger Summary */}
        <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--tally-text-muted)' }}>
            <span>Subtotal Taxable:</span>
            <span className="tally-mono">₹ {summary.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          {!summary.isInterstate ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--tally-text-muted)' }}>
                <span>CGST Output Tax (9%):</span>
                <span className="tally-mono">₹ {summary.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--tally-text-muted)' }}>
                <span>SGST Output Tax (9%):</span>
                <span className="tally-mono">₹ {summary.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--tally-text-muted)' }}>
              <span>IGST Output Tax (18%):</span>
              <span className="tally-mono">₹ {summary.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--tally-text-muted)' }}>
            <span>Round Off Ledger:</span>
            <span className="tally-mono">₹ {summary.roundOff > 0 ? `+${summary.roundOff}` : summary.roundOff}</span>
          </div>

          <div style={{
            display: 'flex',
            justify: 'space-between',
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--tally-yellow)',
            borderTop: '1px solid var(--tally-border)',
            paddingTop: '0.4rem',
            marginTop: '0.3rem'
          }}>
            <span>Total Voucher Amount:</span>
            <span className="tally-mono">₹ {summary.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <button
            onClick={() => setShowAcceptModal(true)}
            className="tally-btn-yellow"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', textAlign: 'center', justifyContent: 'center' }}
          >
            Post Voucher (Enter)
          </button>
        </div>
      </div>

      {/* Tally "Accept? Yes or No" Overlay Modal */}
      {showAcceptModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            width: '260px',
            backgroundColor: 'var(--tally-card-bg)',
            border: '2px solid var(--tally-yellow)',
            padding: '1.25rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}>
            <h3 style={{ color: 'var(--tally-yellow)', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              Accept?
            </h3>
            <p style={{ color: '#fff', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Confirm & Commit Voucher to SQLite DB?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => { setShowAcceptModal(false); alert('Voucher saved successfully!'); }}
                className="tally-btn-yellow"
                style={{ padding: '0.4rem 1.25rem' }}
              >
                Yes (Y)
              </button>

              <button
                onClick={() => setShowAcceptModal(false)}
                className="tally-btn"
                style={{ padding: '0.4rem 1.25rem' }}
              >
                No (N)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
