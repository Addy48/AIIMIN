import React, { useState, useEffect } from 'react';
import toast from '../../utils/toast';
import { apiPost } from '../../utils/api';
import { CheckCircle2 } from 'lucide-react';
import { EXPENSE_CATS } from '../money/MoneyShared';

const EntryForm = ({ user, accounts, initialType, onSuccess }) => {
  const [type, setType] = useState(initialType || 'expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState('');
  const [targetAccountId, setTargetAccountId] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync default account when accounts load
  useEffect(() => {
    if (accounts?.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) {
      toast.error('Valid amount required.');
      return;
    }
    setSaving(true);

    const hourIST = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false });

    try {
      if (type === 'transfer') {
        if (!accountId || !targetAccountId) {
          toast.error('Source and target accounts required.');
          setSaving(false);
          return;
        }
        
        const transferAmt = Math.abs(parseFloat(amount));
        const refNote = note.trim() || 'Internal Transfer';

        // Log outflow from source
        await apiPost('/wealth/transactions', {
          date: date,
          category: 'Transfer',
          description: `To: ${accounts.find(a => a.id === targetAccountId)?.name} — ${refNote}`,
          amount: -transferAmt,
          source: 'manual',
          currency: 'INR',
          type: 'transfer',
          account_id: accountId,
          time_of_day: hourIST,
        });

        // Log inflow to target
        await apiPost('/wealth/transactions', {
          date: date,
          category: 'Transfer',
          description: `From: ${accounts.find(a => a.id === accountId)?.name} — ${refNote}`,
          amount: transferAmt,
          source: 'manual',
          currency: 'INR',
          type: 'transfer',
          account_id: targetAccountId,
          time_of_day: hourIST,
        });
      } else {
        let finalAmount = parseFloat(amount);
        if (type === 'expense') finalAmount = -Math.abs(finalAmount);
        else finalAmount = Math.abs(finalAmount);

        await apiPost('/wealth/transactions', {
          date: date,
          category: category || (type === 'income' ? 'Income' : 'Other'),
          description: note.trim() || null,
          amount: finalAmount,
          source: 'manual',
          currency: 'INR',
          type: type,
          account_id: accountId || null,
          time_of_day: hourIST,
        });
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Synchronization failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Type Toggle */}
      <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: '12px', padding: '4px', border: '1px solid var(--color-border)' }}>
        {['expense', 'income', 'transfer'].map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            style={{
              flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
              background: type === t ? 'var(--color-text-1)' : 'transparent',
              color: type === t ? 'var(--color-base)' : 'var(--color-text-3)',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Amount and Date row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '8px' }}>Amount (INR)</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', opacity: 0.3 }}>₹</span>
            <input 
              type="number" step="0.01" autoFocus placeholder="0.00"
              value={amount} onChange={e => setAmount(e.target.value)}
              style={{
                width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px',
                padding: '14px 16px 14px 36px', fontSize: '24px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--color-text-1)',
                outline: 'none'
              }}
            />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '8px' }}>Date</label>
          <input 
            type="date"
            value={date} onChange={e => setDate(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px',
              padding: '14px 12px', fontSize: '14px', color: 'var(--color-text-1)', outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Account Selection */}
      <div>
        <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '12px' }}>
          {type === 'transfer' ? 'Source Account' : 'Account'}
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {accounts.map(a => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAccountId(a.id)}
              style={{
                padding: '8px 16px', borderRadius: '10px', border: '1px solid',
                borderColor: accountId === a.id ? 'var(--color-text-1)' : 'var(--color-border)',
                background: accountId === a.id ? 'var(--color-text-1)' : 'var(--bg-elevated)',
                color: accountId === a.id ? 'var(--color-base)' : 'var(--color-text-2)',
                fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <span style={{ fontSize: '14px' }}>{a.icon || '🏦'}</span> {a.name}
            </button>
          ))}
        </div>
      </div>

      {/* Target Account (Transfers Only) */}
      {type === 'transfer' && (
        <div>
          <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '12px' }}>Target Account</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {accounts.filter(a => a.id !== accountId).map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => setTargetAccountId(a.id)}
                style={{
                  padding: '8px 16px', borderRadius: '10px', border: '1px solid',
                  borderColor: targetAccountId === a.id ? 'var(--color-accent)' : 'var(--color-border)',
                  background: targetAccountId === a.id ? 'var(--color-accent)' : 'var(--bg-elevated)',
                  color: targetAccountId === a.id ? '#fff' : 'var(--color-text-2)',
                  fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <span style={{ fontSize: '14px' }}>{a.icon || '🏦'}</span> {a.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Selection (Expenses) */}
      {type === 'expense' && (
        <div>
          <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '12px' }}>Category</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {EXPENSE_CATS.map(cat => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCategory(cat.name)}
                style={{
                  padding: '12px 8px', borderRadius: '12px', border: '1px solid',
                  borderColor: category === cat.name ? cat.color : 'var(--color-border)',
                  background: category === cat.name ? `${cat.color}15` : 'var(--bg-elevated)',
                  color: category === cat.name ? cat.color : 'var(--color-text-2)',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      <div>
        <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '8px' }}>Reference Note</label>
        <input 
          type="text" placeholder="Swiggy, Amazon, Rent..."
          value={note} onChange={e => setNote(e.target.value)}
          style={{
            width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px',
            padding: '12px 16px', fontSize: '14px', color: 'var(--color-text-1)', outline: 'none'
          }}
        />
      </div>

      <button 
        type="submit" disabled={saving}
        style={{
          marginTop: '8px', padding: '16px', borderRadius: '16px', border: 'none',
          background: 'var(--color-text-1)', color: 'var(--color-base)',
          fontSize: '15px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s', opacity: saving ? 0.7 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
        }}
      >
        {saving ? <div className="spinner" style={{ width: '16px', height: '16px', borderColor: 'var(--color-base)', borderTopColor: 'transparent' }} /> : <CheckCircle2 size={18} />}
        Sync to Ledger
      </button>
    </form>
  );
};

export default EntryForm;
