import React, { useState } from 'react';
import { insertRow, updateRow } from '../../services/dbService';
import toast from '../../utils/toast';
import { inputStyle, cancelBtnStyle, addBtnStyle } from './MoneyShared';

export default function MoneyLendingTab({ user, lentItems, setLentItems }) {
    const [showLendForm, setShowLendForm] = useState(false);
    const [lendPerson, setLendPerson] = useState('');
    const [lendAmount, setLendAmount] = useState('');
    const [lendDirection, setLendDirection] = useState('lent');
    const [lendReason, setLendReason] = useState('');
    const [saving, setSaving] = useState(false);

    const fmtINR = (v) => '\u20B9' + Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });

    const handleAddLend = async (e) => {
        e.preventDefault();
        if (!lendPerson.trim() || !lendAmount) return;
        setSaving(true);
        try {
            const data = await insertRow('money_lent', [{
                user_id: user.id, person_name: lendPerson.trim(),
                amount: parseFloat(lendAmount), direction: lendDirection,
                reason: lendReason.trim() || null,
            }]);
            if (data?.[0]) {
                setLentItems(prev => [data[0], ...prev]);
                setLendPerson(''); setLendAmount(''); setLendReason(''); setShowLendForm(false);
                toast.success((lendDirection === 'lent' ? 'Lent' : 'Borrowed') + ' recorded');
            }
        } catch (err) {
            toast.error('Failed to record: ' + err.message);
        }
        setSaving(false);
    };

    const handleSettleLend = async (id) => {
        await updateRow('money_lent', { status: 'settled', date_settled: new Date().toLocaleDateString('en-CA') }, 'id', id, 'user_id', user.id);
        setLentItems(prev => prev.filter(l => l.id !== id));
        toast.success('Settled');
    };

    const totalLent = lentItems.filter(l => l.direction === 'lent').reduce((s, l) => s + Number(l.amount), 0);
    const totalBorrowed = lentItems.filter(l => l.direction === 'borrowed').reduce((s, l) => s + Number(l.amount), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase' }}>Lent Out</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)', marginTop: '4px' }}>{fmtINR(totalLent)}</div>
                </div>
                <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase' }}>Borrowed</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--danger)', marginTop: '4px' }}>{fmtINR(totalBorrowed)}</div>
                </div>
            </div>

            {lentItems.length === 0 ? (
                <p style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', padding: '20px 0', fontStyle: 'italic' }}>No pending entries.</p>
            ) : (
                lentItems.map(l => (
                    <div key={l.id} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '14px', borderRadius: '12px',
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                    }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: l.direction === 'lent' ? 'var(--accent-dim)' : 'var(--color-danger-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                            {l.direction === 'lent' ? '\uD83D\uDCE4' : '\uD83D\uDCE5'}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{l.person_name}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>
                                {(l.direction === 'lent' ? 'You lent' : 'You borrowed') + ' \u00B7 ' + new Date(l.date_given || l.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                {l.reason ? (' \u00B7 ' + l.reason) : ''}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: l.direction === 'lent' ? 'var(--accent)' : 'var(--danger)' }}>
                                {fmtINR(l.amount)}
                            </div>
                            <button onClick={() => handleSettleLend(l.id)} style={{ fontSize: '10px', color: 'var(--success)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, marginTop: '2px' }}>
                                Mark Settled
                            </button>
                        </div>
                    </div>
                ))
            )}

            {showLendForm ? (
                <form onSubmit={handleAddLend} style={{ background: 'var(--bg-card)', borderRadius: '14px', padding: '18px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>New Entry</div>
                    <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '3px' }}>
                        {['lent', 'borrowed'].map(d => (
                            <div key={d} onClick={() => setLendDirection(d)} style={{
                                flex: 1, textAlign: 'center', padding: '7px', borderRadius: '6px',
                                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                background: lendDirection === d ? 'var(--bg-card)' : 'transparent',
                                color: lendDirection === d ? 'var(--text-1)' : 'var(--text-3)',
                                boxShadow: lendDirection === d ? 'var(--shadow-sm)' : 'none',
                            }}>
                                {d === 'lent' ? 'I Lent' : 'I Borrowed'}
                            </div>
                        ))}
                    </div>
                    <input autoFocus placeholder="Person name" value={lendPerson}
                        onChange={e => setLendPerson(e.target.value)} required style={inputStyle} />
                    <input type="number" step="0.01" placeholder="Amount" value={lendAmount}
                        onChange={e => setLendAmount(e.target.value)} required style={inputStyle} />
                    <input placeholder="Reason (optional)" value={lendReason}
                        onChange={e => setLendReason(e.target.value)}
                        style={{ ...inputStyle, fontSize: '12px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="submit" disabled={saving} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                            {saving ? 'Saving...' : 'Add'}
                        </button>
                        <button type="button" onClick={() => setShowLendForm(false)} style={cancelBtnStyle}>Cancel</button>
                    </div>
                </form>
            ) : (
                <button onClick={() => setShowLendForm(true)} style={addBtnStyle}>+ Add Entry</button>
            )}
        </div>
    );
}
