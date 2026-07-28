import React, { useState, useEffect, useMemo } from 'react';
import { VoucherType } from '../../types';

interface SavedVoucher {
  id: string;
  number: string;
  type: VoucherType;
  date: string;
  party: string;
  amount: number;
  narration: string;
}

interface TransactionEntryPageProps {
  initialVoucherType?: VoucherType;
  onVoucherTypeChange?: (type: VoucherType) => void;
}

export const TransactionEntryPage: React.FC<TransactionEntryPageProps> = ({
  initialVoucherType = 'Sales',
  onVoucherTypeChange
}) => {
  const [voucherType, setVoucherType] = useState<VoucherType>(initialVoucherType);
  const [showSavedVouchers, setShowSavedVouchers] = useState(false);

  // Load / Store Saved Vouchers
  const [savedVouchers, setSavedVouchers] = useState<SavedVoucher[]>(() => {
    const local = localStorage.getItem('tally_saved_vouchers');
    if (local) {
      try { return JSON.parse(local); } catch (e) {}
    }
    return [
      { id: '1', number: 'INV-2025-005', type: 'Sales', date: '15-Apr-2026', party: 'Acme Traders Pvt Ltd', amount: 118000, narration: 'Sales against PO #99812' },
      { id: '2', number: 'PUR-2025-001', type: 'Purchase', date: '10-Apr-2026', party: 'Vortex Raw Materials', amount: 85400, narration: 'Raw materials purchase' },
      { id: '3', number: 'REC-2025-002', type: 'Receipt', date: '12-Apr-2026', party: 'Acme Traders Pvt Ltd', amount: 50000, narration: 'Payment received via HDFC' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('tally_saved_vouchers', JSON.stringify(savedVouchers));
  }, [savedVouchers]);

  // Sync internal state with prop changes
  useEffect(() => {
    if (initialVoucherType) {
      setVoucherType(initialVoucherType);
    }
  }, [initialVoucherType]);

  const handleTypeSelect = (type: VoucherType) => {
    setVoucherType(type);
    if (onVoucherTypeChange) {
      onVoucherTypeChange(type);
    }
  };

  // Keyboard Shortcuts for Tally F-Keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F4') {
        e.preventDefault();
        handleTypeSelect('Contra');
      } else if (e.key === 'F5') {
        e.preventDefault();
        handleTypeSelect('Payment');
      } else if (e.key === 'F6') {
        if (e.altKey) {
          e.preventDefault();
          handleTypeSelect('CreditNote');
        } else {
          e.preventDefault();
          handleTypeSelect('Receipt');
        }
      } else if (e.key === 'F7') {
        e.preventDefault();
        handleTypeSelect('Journal');
      } else if (e.key === 'F8') {
        e.preventDefault();
        handleTypeSelect('Sales');
      } else if (e.key === 'F9') {
        if (e.altKey) {
          e.preventDefault();
          handleTypeSelect('DebitNote');
        } else {
          e.preventDefault();
          handleTypeSelect('Purchase');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Common Header State
  const [voucherNumber, setVoucherNumber] = useState('');
  const [voucherDate, setVoucherDate] = useState('15-Apr-2026');
  const [supplierRefNo, setSupplierRefNo] = useState('');
  const [partyLedger, setPartyLedger] = useState('Acme Traders Pvt Ltd');
  const [accountLedger, setAccountLedger] = useState('HDFC Bank Account');
  const [placeOfSupply, setPlaceOfSupply] = useState('DL');
  const [narration, setNarration] = useState('');
  const [paymentMode, setPaymentMode] = useState('NEFT/RTGS');
  const [instrumentNo, setInstrumentNo] = useState('UTR99281034');
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  const companyStateCode = 'DL';

  // Dynamic Item Rows for Sales / Purchase / Credit Note / Debit Note
  const [itemRows, setItemRows] = useState([
    { id: 1, particulars: 'Web Application Services', qty: 1, rate: 50000, gstRate: 18 },
  ]);

  // Payment / Receipt Entries
  const [payEntries, setPayEntries] = useState([
    { id: 1, ledger: 'Vortex Raw Materials', amount: 85400, refNo: 'Against Ref: PUR-2025-001' }
  ]);

  // Journal Entries (Dr / Cr double entry)
  const [journalRows, setJournalRows] = useState([
    { id: 1, type: 'Dr' as 'Dr' | 'Cr', ledger: 'Office Rent Expense', debit: 45000, credit: 0 },
    { id: 2, type: 'Cr' as 'Dr' | 'Cr', ledger: 'HDFC Bank Account', debit: 0, credit: 45000 },
  ]);

  // Contra State
  const [contraFromAcc, setContraFromAcc] = useState('Cash Account');
  const [contraToAcc, setContraToAcc] = useState('HDFC Bank Account');
  const [contraAmount, setContraAmount] = useState(25000);

  // Set default voucher numbers & narrations whenever voucherType changes
  useEffect(() => {
    resetFormForType(voucherType);
  }, [voucherType]);

  const resetFormForType = (type: VoucherType) => {
    const nextSeq = savedVouchers.filter(v => v.type === type).length + 6;
    switch (type) {
      case 'Sales':
        setVoucherNumber(`INV-2025-00${nextSeq}`);
        setNarration('Being sales of goods/services');
        setPartyLedger('Acme Traders Pvt Ltd');
        setItemRows([{ id: 1, particulars: 'Consultancy & Development Services', qty: 1, rate: 25000, gstRate: 18 }]);
        break;
      case 'Purchase':
        setVoucherNumber(`PUR-2025-00${nextSeq}`);
        setSupplierRefNo(`BILL-880${nextSeq}`);
        setNarration('Being raw materials purchased');
        setPartyLedger('Vortex Raw Materials');
        setItemRows([{ id: 1, particulars: 'Raw Materials Grade-A', qty: 10, rate: 5000, gstRate: 18 }]);
        break;
      case 'Payment':
        setVoucherNumber(`PAY-2025-00${nextSeq}`);
        setAccountLedger('HDFC Bank Account');
        setNarration('Being vendor payment remitted');
        setPartyLedger('Vortex Raw Materials');
        setPayEntries([{ id: 1, ledger: 'Vortex Raw Materials', amount: 25000, refNo: 'Against Ref: PUR-2025-001' }]);
        break;
      case 'Receipt':
        setVoucherNumber(`REC-2025-00${nextSeq}`);
        setAccountLedger('HDFC Bank Account');
        setNarration('Being payment received from customer');
        setPartyLedger('Acme Traders Pvt Ltd');
        setPayEntries([{ id: 1, ledger: 'Acme Traders Pvt Ltd', amount: 50000, refNo: 'Against Ref: INV-2025-005' }]);
        break;
      case 'Journal':
        setVoucherNumber(`JRN-2025-00${nextSeq}`);
        setNarration('Being adjustment entry passed');
        setJournalRows([
          { id: 1, type: 'Dr', ledger: 'Office Rent Expense', debit: 30000, credit: 0 },
          { id: 2, type: 'Cr', ledger: 'HDFC Bank Account', debit: 0, credit: 30000 },
        ]);
        break;
      case 'Contra':
        setVoucherNumber(`CTR-2025-00${nextSeq}`);
        setNarration('Being cash deposited into bank');
        setContraFromAcc('Cash Account');
        setContraToAcc('HDFC Bank Account');
        setContraAmount(10000);
        break;
      case 'CreditNote':
        setVoucherNumber(`CN-2025-00${nextSeq}`);
        setSupplierRefNo('INV-2025-005');
        setNarration('Being credit note issued for goods returned');
        setPartyLedger('Acme Traders Pvt Ltd');
        setItemRows([{ id: 1, particulars: 'Returned License Key', qty: 1, rate: 10000, gstRate: 18 }]);
        break;
      case 'DebitNote':
        setVoucherNumber(`DN-2025-00${nextSeq}`);
        setSupplierRefNo('PUR-2025-001');
        setNarration('Being debit note issued for defective material');
        setPartyLedger('Vortex Raw Materials');
        setItemRows([{ id: 1, particulars: 'Defective Material Return', qty: 2, rate: 5000, gstRate: 18 }]);
        break;
    }
  };

  // Handlers for Item Rows
  const addItemRow = () => {
    setItemRows([
      ...itemRows,
      { id: Date.now(), particulars: '', qty: 1, rate: 0, gstRate: 18 }
    ]);
  };
  const removeItemRow = (id: number) => {
    if (itemRows.length > 1) setItemRows(itemRows.filter(r => r.id !== id));
  };
  const updateItemRow = (id: number, field: string, value: any) => {
    setItemRows(itemRows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Handlers for Pay/Rec Entries
  const addPayRow = () => {
    setPayEntries([...payEntries, { id: Date.now(), ledger: 'General Expense Account', amount: 0, refNo: 'On Account' }]);
  };
  const removePayRow = (id: number) => {
    if (payEntries.length > 1) setPayEntries(payEntries.filter(r => r.id !== id));
  };
  const updatePayRow = (id: number, field: string, value: any) => {
    setPayEntries(payEntries.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Handlers for Journal Rows
  const addJournalRow = () => {
    setJournalRows([...journalRows, { id: Date.now(), type: 'Dr', ledger: 'Office Rent Expense', debit: 0, credit: 0 }]);
  };
  const removeJournalRow = (id: number) => {
    if (journalRows.length > 1) setJournalRows(journalRows.filter(r => r.id !== id));
  };
  const updateJournalRow = (id: number, field: string, value: any) => {
    setJournalRows(journalRows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Calculations for Sales / Purchase / Notes
  const taxSummary = useMemo(() => {
    let subtotal = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    const isInterstate = placeOfSupply !== companyStateCode;

    itemRows.forEach(item => {
      const lineAmt = (item.qty || 0) * (item.rate || 0);
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
  }, [itemRows, placeOfSupply]);

  // Calculations for Journal Balance Check
  const journalSummary = useMemo(() => {
    const totalDebit = journalRows.reduce((sum, r) => sum + (parseFloat(r.debit as any) || 0), 0);
    const totalCredit = journalRows.reduce((sum, r) => sum + (parseFloat(r.credit as any) || 0), 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;
    const diff = Math.abs(totalDebit - totalCredit);
    return { totalDebit, totalCredit, isBalanced, diff };
  }, [journalRows]);

  // Calculation for Payment / Receipt Total
  const paySummary = useMemo(() => {
    return payEntries.reduce((sum, r) => sum + (parseFloat(r.amount as any) || 0), 0);
  }, [payEntries]);

  // Current calculated total amount for active voucher
  const currentTotalAmount = useMemo(() => {
    if (voucherType === 'Sales' || voucherType === 'Purchase' || voucherType === 'CreditNote' || voucherType === 'DebitNote') {
      return taxSummary.grandTotal;
    } else if (voucherType === 'Payment' || voucherType === 'Receipt') {
      return paySummary;
    } else if (voucherType === 'Journal') {
      return journalSummary.totalDebit;
    } else {
      return contraAmount;
    }
  }, [voucherType, taxSummary, paySummary, journalSummary, contraAmount]);

  // Commit & Save Voucher to Local Storage
  const handleCommitVoucher = () => {
    let party = partyLedger;
    if (voucherType === 'Payment' || voucherType === 'Receipt') {
      party = `${accountLedger} ➔ ${payEntries.map(e => e.ledger).join(', ')}`;
    } else if (voucherType === 'Journal') {
      party = journalRows.map(r => r.ledger).join(' / ');
    } else if (voucherType === 'Contra') {
      party = `${contraFromAcc} ➔ ${contraToAcc}`;
    }

    const newV: SavedVoucher = {
      id: Date.now().toString(),
      number: voucherNumber,
      type: voucherType,
      date: voucherDate,
      party,
      amount: currentTotalAmount,
      narration: narration || `Created ${voucherType} Voucher`,
    };

    setSavedVouchers([newV, ...savedVouchers]);
    setShowAcceptModal(false);

    alert(`Voucher ${voucherNumber} (${voucherType}) posted successfully!`);
    resetFormForType(voucherType);
  };

  const handleDeleteVoucher = (id: string) => {
    setSavedVouchers(savedVouchers.filter(v => v.id !== id));
  };

  // Dynamic Theme Colors and Titles by Voucher Type
  const voucherMeta = useMemo(() => {
    switch (voucherType) {
      case 'Sales':
        return { title: 'Sales Invoice (F8)', color: 'var(--tally-yellow)', bg: '#00363f', typeLabel: 'Sales' };
      case 'Purchase':
        return { title: 'Purchase Voucher (F9)', color: '#38bdf8', bg: '#062d3a', typeLabel: 'Purchase' };
      case 'Payment':
        return { title: 'Payment Voucher (F5)', color: '#fb923c', bg: '#3b1700', typeLabel: 'Payment' };
      case 'Receipt':
        return { title: 'Receipt Voucher (F6)', color: '#4ade80', bg: '#052e16', typeLabel: 'Receipt' };
      case 'Journal':
        return { title: 'Journal Voucher (F7)', color: '#c084fc', bg: '#2e1065', typeLabel: 'Journal' };
      case 'Contra':
        return { title: 'Contra Transfer (F4)', color: '#22d3ee', bg: '#083344', typeLabel: 'Contra' };
      case 'CreditNote':
        return { title: 'Credit Note / Sales Return (Alt+F6)', color: '#facc15', bg: '#3a2e00', typeLabel: 'Credit Note' };
      case 'DebitNote':
        return { title: 'Debit Note / Purchase Return (Alt+F9)', color: '#818cf8', bg: '#1e1b4b', typeLabel: 'Debit Note' };
      default:
        return { title: 'Accounting Voucher', color: 'var(--tally-yellow)', bg: 'var(--tally-teal-header)', typeLabel: voucherType };
    }
  }, [voucherType]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
      
      {/* Top Bar with Create New, Clear, & View Saved Vouchers Toggle */}
      <div style={{
        backgroundColor: voucherMeta.bg,
        border: `1px solid ${voucherMeta.color}`,
        padding: '0.45rem 0.85rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '2px'
      }}>
        <div style={{ color: voucherMeta.color, fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Accounting Voucher Creation</span>
          <span style={{ fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.15rem 0.5rem', borderRadius: '3px' }}>
            {voucherMeta.title}
          </span>
        </div>

        {/* Voucher Type Tabs & Actions */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => resetFormForType(voucherType)}
            className="tally-btn-yellow"
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}
          >
            + Create New (Reset)
          </button>

          <button
            onClick={() => setShowSavedVouchers(!showSavedVouchers)}
            className="tally-btn"
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', backgroundColor: showSavedVouchers ? 'var(--tally-yellow)' : '#00252b', color: showSavedVouchers ? '#000' : '#fff' }}
          >
            📋 Day Book ({savedVouchers.length})
          </button>

          {(['Sales', 'Purchase', 'Payment', 'Receipt', 'Journal', 'Contra', 'CreditNote', 'DebitNote'] as VoucherType[]).map(type => {
            const isSel = voucherType === type;
            return (
              <button
                key={type}
                onClick={() => handleTypeSelect(type)}
                style={{
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.72rem',
                  backgroundColor: isSel ? 'var(--tally-yellow)' : '#00252b',
                  color: isSel ? '#002229' : '#fff',
                  fontWeight: isSel ? 700 : 400,
                  border: isSel ? '1px solid var(--tally-yellow)' : '1px solid var(--tally-border-highlight)',
                  cursor: 'pointer'
                }}
              >
                {type === 'CreditNote' ? 'Credit Note' : type === 'DebitNote' ? 'Debit Note' : type}
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------- SAVED VOUCHERS / DAY BOOK OVERLAY PANEL ------------------- */}
      {showSavedVouchers && (
        <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '2px solid var(--tally-yellow)', padding: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--tally-yellow)', fontWeight: 700, fontSize: '0.9rem' }}>
              Day Book (Saved Accounting Vouchers in Database)
            </span>
            <button onClick={() => setShowSavedVouchers(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.9rem' }}>✕ Close</button>
          </div>

          {savedVouchers.length === 0 ? (
            <div style={{ padding: '1rem', color: 'var(--tally-text-muted)', textAlign: 'center', fontSize: '0.85rem' }}>
              No saved vouchers yet. Fill in the form and click "Post Voucher" to save!
            </div>
          ) : (
            <table className="tally-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Voucher #</th>
                  <th>Type</th>
                  <th>Particulars / Party A/c</th>
                  <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                  <th>Narration</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {savedVouchers.map((v) => (
                  <tr key={v.id}>
                    <td style={{ color: 'var(--tally-text-muted)' }}>{v.date}</td>
                    <td className="tally-mono" style={{ color: 'var(--tally-yellow)', fontWeight: 700 }}>{v.number}</td>
                    <td><span className="badge badge-dr">{v.type}</span></td>
                    <td style={{ fontWeight: 600 }}>{v.party}</td>
                    <td className="tally-mono" style={{ textAlign: 'right', fontWeight: 700, color: '#4ade80' }}>
                      ₹ {v.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--tally-text-dim)' }}>{v.narration}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteVoucher(v.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--tally-red)', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Delete 🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Dynamic Header Fields Grid */}
      <div style={{
        backgroundColor: 'var(--tally-card-bg)',
        border: '1px solid var(--tally-border)',
        padding: '0.75rem 1rem',
        display: 'grid',
        gridTemplateColumns: voucherType === 'Sales' || voucherType === 'Purchase' || voucherType === 'CreditNote' || voucherType === 'DebitNote' ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
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

        {/* Sales / Purchase / Notes Specific Fields */}
        {(voucherType === 'Sales' || voucherType === 'Purchase' || voucherType === 'CreditNote' || voucherType === 'DebitNote') && (
          <>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block' }}>
                {voucherType === 'Sales' || voucherType === 'CreditNote' ? 'Buyer (Party A/c Name)' : 'Supplier (Party A/c Name)'}
              </span>
              <select className="tally-input" value={partyLedger} onChange={e => setPartyLedger(e.target.value)} style={{ width: '100%' }}>
                <option value="Acme Traders Pvt Ltd">Acme Traders Pvt Ltd (Cur Bal: ₹ 2,15,400.00 Dr)</option>
                <option value="Vortex Raw Materials">Vortex Raw Materials (Cur Bal: ₹ 85,400.00 Cr)</option>
                <option value="Cash Account">Cash Account (Cur Bal: ₹ 45,000.00 Dr)</option>
                <option value="HDFC Bank Account">HDFC Bank Account (Cur Bal: ₹ 3,60,000.00 Dr)</option>
              </select>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block' }}>
                {voucherType === 'Purchase' ? 'Supplier Bill Ref.' : voucherType === 'CreditNote' || voucherType === 'DebitNote' ? 'Original Inv. Ref.' : 'Place of Supply'}
              </span>
              {voucherType === 'Sales' ? (
                <select className="tally-input" value={placeOfSupply} onChange={e => setPlaceOfSupply(e.target.value)} style={{ width: '100%' }}>
                  <option value="DL">Delhi (Intra-State: CGST+SGST)</option>
                  <option value="MH">Maharashtra (Inter-State: IGST)</option>
                </select>
              ) : (
                <input className="tally-input" type="text" value={supplierRefNo} onChange={e => setSupplierRefNo(e.target.value)} placeholder="Ref No." style={{ width: '100%' }} />
              )}
            </div>
          </>
        )}

        {/* Payment / Receipt Specific Fields */}
        {(voucherType === 'Payment' || voucherType === 'Receipt') && (
          <>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--tally-yellow)', fontWeight: 700, display: 'block' }}>
                {voucherType === 'Payment' ? 'Account (Paying From Bank/Cash)' : 'Account (Deposited Into Bank/Cash)'}
              </span>
              <select className="tally-input" value={accountLedger} onChange={e => setAccountLedger(e.target.value)} style={{ width: '100%', fontWeight: 700 }}>
                <option value="HDFC Bank Account">HDFC Bank Account (Cur Bal: ₹ 3,60,000.00 Dr)</option>
                <option value="ICICI Bank Account">ICICI Bank Account (Cur Bal: ₹ 1,20,000.00 Dr)</option>
                <option value="Cash Account">Cash Account (Cur Bal: ₹ 45,000.00 Dr)</option>
              </select>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block' }}>Payment Mode / Instrument</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select className="tally-input" value={paymentMode} onChange={e => setPaymentMode(e.target.value)} style={{ width: '50%' }}>
                  <option value="NEFT/RTGS">NEFT / RTGS</option>
                  <option value="Cheque">Cheque</option>
                  <option value="UPI">UPI / GPay</option>
                  <option value="Cash">Cash</option>
                </select>
                <input className="tally-input" type="text" placeholder="Ref/Cheque No." value={instrumentNo} onChange={e => setInstrumentNo(e.target.value)} style={{ width: '50%' }} />
              </div>
            </div>
          </>
        )}

        {/* Contra Specific Fields */}
        {voucherType === 'Contra' && (
          <>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block' }}>Transfer From (Source A/c)</span>
              <select className="tally-input" value={contraFromAcc} onChange={e => setContraFromAcc(e.target.value)} style={{ width: '100%' }}>
                <option value="Cash Account">Cash Account (Cur Bal: ₹ 45,000.00 Dr)</option>
                <option value="HDFC Bank Account">HDFC Bank Account (Cur Bal: ₹ 3,60,000.00 Dr)</option>
                <option value="ICICI Bank Account">ICICI Bank Account (Cur Bal: ₹ 1,20,000.00 Dr)</option>
              </select>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--tally-yellow)', fontWeight: 700, display: 'block' }}>Transfer To (Destination A/c)</span>
              <select className="tally-input" value={contraToAcc} onChange={e => setContraToAcc(e.target.value)} style={{ width: '100%', fontWeight: 700 }}>
                <option value="HDFC Bank Account">HDFC Bank Account (Cur Bal: ₹ 3,60,000.00 Dr)</option>
                <option value="ICICI Bank Account">ICICI Bank Account (Cur Bal: ₹ 1,20,000.00 Dr)</option>
                <option value="Cash Account">Cash Account (Cur Bal: ₹ 45,000.00 Dr)</option>
              </select>
            </div>
          </>
        )}

        {/* Journal Specific Fields */}
        {voucherType === 'Journal' && (
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block' }}>Voucher Class / Type</span>
            <input className="tally-input" type="text" value="Adjustment Journal" readOnly style={{ width: '100%' }} />
          </div>
        )}
      </div>

      {/* ------------------- DYNAMIC PARTICULARS GRID BY VOUCHER TYPE ------------------- */}

      {/* 1. SALES / PURCHASE / CREDIT NOTE / DEBIT NOTE GRID */}
      {(voucherType === 'Sales' || voucherType === 'Purchase' || voucherType === 'CreditNote' || voucherType === 'DebitNote') && (
        <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)' }}>
          <table className="tally-table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>
                  {voucherType === 'Sales' ? 'Item / Particulars (Sales)' : voucherType === 'Purchase' ? 'Item / Particulars (Purchase)' : 'Item / Adjustment Description'}
                </th>
                <th style={{ width: '12%' }}>Quantity</th>
                <th style={{ width: '15%' }}>Rate (₹)</th>
                <th style={{ width: '10%' }}>GST %</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Amount (₹)</th>
                <th style={{ width: '3%', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {itemRows.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      className="tally-input"
                      type="text"
                      placeholder="Type Item / Ledger Particulars..."
                      value={item.particulars}
                      onChange={e => updateItemRow(item.id, 'particulars', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td>
                    <input
                      className="tally-input"
                      type="number"
                      value={item.qty}
                      onChange={e => updateItemRow(item.id, 'qty', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td>
                    <input
                      className="tally-input"
                      type="number"
                      value={item.rate}
                      onChange={e => updateItemRow(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td>
                    <select
                      className="tally-input"
                      value={item.gstRate}
                      onChange={e => updateItemRow(item.id, 'gstRate', parseFloat(e.target.value))}
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
                    {((item.qty || 0) * (item.rate || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => removeItemRow(item.id)} style={{ background: 'none', border: 'none', color: 'var(--tally-red)', cursor: 'pointer' }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: '0.4rem 0.75rem', backgroundColor: '#051318', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={addItemRow} className="tally-btn">+ Add Line Item</button>
            <span style={{ fontSize: '0.85rem', color: 'var(--tally-text-muted)' }}>
              Subtotal: <strong style={{ color: '#fff' }}>₹ {taxSummary.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
            </span>
          </div>
        </div>
      )}

      {/* 2. PAYMENT / RECEIPT GRID */}
      {(voucherType === 'Payment' || voucherType === 'Receipt') && (
        <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)' }}>
          <div style={{ backgroundColor: 'var(--tally-teal-header)', padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: 'var(--tally-yellow)', fontWeight: 700 }}>
            {voucherType === 'Payment' ? 'Particulars (Paid To Ledgers / Expenses)' : 'Particulars (Received From Ledgers / Customers)'}
          </div>
          <table className="tally-table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Ledger Name</th>
                <th style={{ width: '30%' }}>Bill Allocation / Reference</th>
                <th style={{ width: '20%', textAlign: 'right' }}>Amount (₹)</th>
                <th style={{ width: '5%', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {payEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <select
                      className="tally-input"
                      value={entry.ledger}
                      onChange={e => updatePayRow(entry.id, 'ledger', e.target.value)}
                      style={{ width: '100%' }}
                    >
                      <option value="Vortex Raw Materials">Vortex Raw Materials (Creditor)</option>
                      <option value="Acme Traders Pvt Ltd">Acme Traders Pvt Ltd (Debtor)</option>
                      <option value="Office Rent Expense">Office Rent Expense (Indirect Expense)</option>
                      <option value="Electricity Expenses">Electricity Expenses (Indirect Expense)</option>
                      <option value="Salaries Account">Salaries Account (Indirect Expense)</option>
                      <option value="Consultancy Income">Consultancy Income (Direct Income)</option>
                    </select>
                  </td>
                  <td>
                    <input
                      className="tally-input"
                      type="text"
                      value={entry.refNo}
                      onChange={e => updatePayRow(entry.id, 'refNo', e.target.value)}
                      placeholder="Against Ref / On Account"
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td>
                    <input
                      className="tally-input"
                      type="number"
                      value={entry.amount}
                      onChange={e => updatePayRow(entry.id, 'amount', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', textAlign: 'right', fontWeight: 700 }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => removePayRow(entry.id)} style={{ background: 'none', border: 'none', color: 'var(--tally-red)', cursor: 'pointer' }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: '0.4rem 0.75rem', backgroundColor: '#051318', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={addPayRow} className="tally-btn">+ Add Ledger Particulars</button>
            <span style={{ fontSize: '0.9rem', color: 'var(--tally-yellow)', fontWeight: 700 }}>
              Total {voucherType}: ₹ {paySummary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}

      {/* 3. JOURNAL GRID (DR/CR DOUBLE ENTRY) */}
      {voucherType === 'Journal' && (
        <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)' }}>
          <div style={{ backgroundColor: '#2e1065', padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#c084fc', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
            <span>Journal Entry Grid (Double Entry System)</span>
            <span>
              {journalSummary.isBalanced ? (
                <span style={{ color: '#4ade80' }}>✔ Total Debit = Total Credit ({journalSummary.totalDebit.toLocaleString('en-IN')})</span>
              ) : (
                <span style={{ color: '#f87171' }}>❌ Unbalanced (Diff: ₹ {journalSummary.diff.toLocaleString('en-IN')})</span>
              )}
            </span>
          </div>

          <table className="tally-table">
            <thead>
              <tr>
                <th style={{ width: '10%' }}>Dr / Cr</th>
                <th style={{ width: '50%' }}>Particulars (Ledger Name)</th>
                <th style={{ width: '20%', textAlign: 'right' }}>Debit Amount (₹)</th>
                <th style={{ width: '20%', textAlign: 'right' }}>Credit Amount (₹)</th>
                <th style={{ width: '5%', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {journalRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <select
                      className="tally-input"
                      value={row.type}
                      onChange={e => {
                        const newType = e.target.value as 'Dr' | 'Cr';
                        updateJournalRow(row.id, 'type', newType);
                      }}
                      style={{ width: '100%', fontWeight: 700, color: row.type === 'Dr' ? '#38bdf8' : '#f43f5e' }}
                    >
                      <option value="Dr">By (Dr)</option>
                      <option value="Cr">To (Cr)</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="tally-input"
                      value={row.ledger}
                      onChange={e => updateJournalRow(row.id, 'ledger', e.target.value)}
                      style={{ width: '100%' }}
                    >
                      <option value="Office Rent Expense">Office Rent Expense</option>
                      <option value="Electricity Expenses">Electricity Expenses</option>
                      <option value="HDFC Bank Account">HDFC Bank Account</option>
                      <option value="Acme Traders Pvt Ltd">Acme Traders Pvt Ltd</option>
                      <option value="Vortex Raw Materials">Vortex Raw Materials</option>
                      <option value="Depreciation Account">Depreciation Account</option>
                      <option value="Computer Assets">Computer Assets</option>
                    </select>
                  </td>
                  <td>
                    <input
                      className="tally-input"
                      type="number"
                      disabled={row.type === 'Cr'}
                      value={row.type === 'Dr' ? row.debit : 0}
                      onChange={e => updateJournalRow(row.id, 'debit', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', textAlign: 'right', fontWeight: 700, backgroundColor: row.type === 'Cr' ? '#091519' : undefined }}
                    />
                  </td>
                  <td>
                    <input
                      className="tally-input"
                      type="number"
                      disabled={row.type === 'Dr'}
                      value={row.type === 'Cr' ? row.credit : 0}
                      onChange={e => updateJournalRow(row.id, 'credit', parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', textAlign: 'right', fontWeight: 700, backgroundColor: row.type === 'Dr' ? '#091519' : undefined }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => removeJournalRow(row.id)} style={{ background: 'none', border: 'none', color: 'var(--tally-red)', cursor: 'pointer' }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: '0.4rem 0.75rem', backgroundColor: '#051318', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={addJournalRow} className="tally-btn">+ Add Journal Entry Line</button>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem' }}>
              <span>Total Dr: <strong style={{ color: '#38bdf8' }}>₹ {journalSummary.totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></span>
              <span>Total Cr: <strong style={{ color: '#f43f5e' }}>₹ {journalSummary.totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONTRA GRID (CASH/BANK INTERNAL TRANSFER) */}
      {voucherType === 'Contra' && (
        <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ color: '#22d3ee', fontWeight: 700, fontSize: '0.9rem' }}>
            Contra Transfer Details (Cash / Bank Internal Movement)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', backgroundColor: '#051b22', padding: '1rem', border: '1px solid var(--tally-border)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block' }}>Transfer Amount (₹)</span>
              <input
                className="tally-input"
                type="number"
                value={contraAmount}
                onChange={e => setContraAmount(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', fontSize: '1.2rem', fontWeight: 700, color: 'var(--tally-yellow)' }}
              />
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--tally-text-muted)', display: 'block' }}>Bank Slip / ATM Ref No.</span>
              <input
                className="tally-input"
                type="text"
                value="DEP-SLIP-9981"
                onChange={() => {}}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------- FOOTER SUMMARY & COMMIT BUTTON ------------------- */}
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

        {/* Tax Ledger Summary or Total Panel */}
        <div style={{ backgroundColor: 'var(--tally-card-bg)', border: '1px solid var(--tally-border)', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
          
          {(voucherType === 'Sales' || voucherType === 'Purchase' || voucherType === 'CreditNote' || voucherType === 'DebitNote') && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--tally-text-muted)' }}>
                <span>Subtotal Taxable:</span>
                <span className="tally-mono">₹ {taxSummary.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              {!taxSummary.isInterstate ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--tally-text-muted)' }}>
                    <span>CGST Output Tax (9%):</span>
                    <span className="tally-mono">₹ {taxSummary.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--tally-text-muted)' }}>
                    <span>SGST Output Tax (9%):</span>
                    <span className="tally-mono">₹ {taxSummary.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--tally-text-muted)' }}>
                  <span>IGST Output Tax (18%):</span>
                  <span className="tally-mono">₹ {taxSummary.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--tally-text-muted)' }}>
                <span>Round Off Ledger:</span>
                <span className="tally-mono">₹ {taxSummary.roundOff > 0 ? `+${taxSummary.roundOff}` : taxSummary.roundOff}</span>
              </div>
            </>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.05rem',
            fontWeight: 700,
            color: voucherMeta.color,
            borderTop: '1px solid var(--tally-border)',
            paddingTop: '0.4rem',
            marginTop: '0.3rem'
          }}>
            <span>Total {voucherMeta.typeLabel} Amount:</span>
            <span className="tally-mono">
              ₹ {currentTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={() => setShowAcceptModal(true)}
            className="tally-btn-yellow"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', textAlign: 'center', justifyContent: 'center', backgroundColor: voucherMeta.color, color: '#000', fontWeight: 700 }}
          >
            Post {voucherMeta.typeLabel} Voucher (Enter)
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
            width: '280px',
            backgroundColor: 'var(--tally-card-bg)',
            border: `2px solid ${voucherMeta.color}`,
            padding: '1.25rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}>
            <h3 style={{ color: voucherMeta.color, fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              Accept {voucherMeta.typeLabel}?
            </h3>
            <p style={{ color: '#fff', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Commit {voucherMeta.typeLabel} Voucher ({voucherNumber}) for ₹ {currentTotalAmount.toLocaleString('en-IN')}?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={handleCommitVoucher}
                className="tally-btn-yellow"
                style={{ padding: '0.4rem 1.25rem', backgroundColor: voucherMeta.color, color: '#000', fontWeight: 700 }}
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
