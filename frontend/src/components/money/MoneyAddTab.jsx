import React, { useState } from 'react';
import { insertRow } from '../../services/dbService';
import toast from '../../utils/toast';
import { EXPENSE_CATS, labelStyle, inputStyle, submitBtnStyle } from './MoneyShared';

export default function MoneyAddTab({ user, accounts, awardMoneyXP, onSuccess }) {
    const [txType, setTxType] = useState('expense');
    const [txAmount, setTxAmount] = useState('');
    const [txCategory, setTxCategory] = useState('');
    const [txCustomCat, setTxCustomCat] = useState('');
    const [txNote, setTxNote] = useState('');
    const [txAccountId, setTxAccountId] = useState('');
    const [txToAccountId, setTxToAccountId] = useState('');
    const [saving, setSaving] = useState(false);

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        if (!txAmount || isNaN(txAmount)) return;
        setSaving(true);

        const dateStr = new Date().toLocaleDateString('en-CA');
        const hourIST = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false });

        if (txType === 'transfer') {
            if (!txAccountId || !txToAccountId || txAccountId === txToAccountId) {
                toast.error('Select two different accounts');
                setSaving(false);
                return;
            }
            const amt = Math.abs(parseFloat(txAmount));
            const toAcct = accounts.find(a => a.id === txToAccountId);
            const fromAcct = accounts.find(a => a.id === txAccountId);

            const outTx = await insertRow('money_transactions', [{
                user_id: user.id, date: dateStr, category: 'Transfer',
                amount: -amt, source: 'manual', currency: 'INR',
                type: 'transfer_out', account_id: txAccountId,
                description: txNote.trim() || ('\u2192 ' + (toAcct?.name || '')),
                time_of_day: hourIST,
            }]);

            if (outTx?.[0]) {
                await insertRow('money_transactions', [{
                    user_id: user.id, date: dateStr, category: 'Transfer',
                    amount: amt, source: 'manual', currency: 'INR',
                    type: 'transfer_in', account_id: txToAccountId,
                    transfer_pair_id: outTx[0].id,
                    description: txNote.trim() || ('\u2190 ' + (fromAcct?.name || '')),
                    time_of_day: hourIST,
                }]);
            }
            toast.success('Transfer logged');
            awardMoneyXP(user.id);
        } else {
            const catName = txType === 'income'
                ? (txCustomCat.trim() || 'Income')
                : (txCategory || txCustomCat.trim() || 'Other');
            let finalAmount = parseFloat(txAmount);
            if (txType === 'expense') finalAmount = -Math.abs(finalAmount);
            else finalAmount = Math.abs(finalAmount);

            try {
                await insertRow('money_transactions', [{
                    user_id: user.id, date: dateStr, category: catName,
                    description: txNote.trim() || null, amount: finalAmount,
                    source: 'manual', currency: 'INR',
                    type: txType, account_id: txAccountId || null,
                    time_of_day: hourIST,
                }]);
                toast.success('Transaction logged');
                awardMoneyXP(user.id);
            } catch (err) {
                toast.error('Failed to log: ' + err.message);
                setSaving(false);
                return;
            }
        }
        setTxAmount(''); setTxCategory(''); setTxCustomCat(''); setTxNote('');
        setSaving(false);
        onSuccess();
    };

    return (
        <div style={{ background: 'var(--bg-card)', borderRadius: '14px', padding: '20px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 16px', color: 'var(--text-1)' }}>Add Transaction</h3>
            <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Type toggle */}
                <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '3px' }}>
                    {['expense', 'income', 'transfer'].map(t => (
                        <div key={t} onClick={() => { setTxType(t); setTxCategory(''); setTxCustomCat(''); }}
                            style={{
                                flex: 1, textAlign: 'center', padding: '7px', borderRadius: '6px',
                                fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                                background: txType === t ? 'var(--bg-card)' : 'transparent',
                                color: txType === t ? (t === 'income' ? 'var(--success)' : t === 'transfer' ? '#8b5cf6' : 'var(--text-1)') : 'var(--text-3)',
                                boxShadow: txType === t ? 'var(--shadow-sm)' : 'none',
                            }}>
                            {t === 'expense' ? 'Spent' : t === 'income' ? 'Earned' : 'Transfer'}
                        </div>
                    ))}
                </div>

                {/* Amount */}
                <div>
                    <label style={labelStyle}>Amount {'\u20B9'}</label>
                    <input type="number" step="0.01" placeholder="0.00" required value={txAmount}
                        onChange={e => setTxAmount(e.target.value)}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-1)', fontSize: '16px', fontWeight: 600 }} />
                </div>

                {/* Account selection */}
                {accounts.length > 0 && (
                    <div>
                        <label style={labelStyle}>{txType === 'transfer' ? 'From Account' : 'Account'}</label>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {accounts.map(a => (
                                <button key={a.id} type="button"
                                    onClick={() => setTxAccountId(txAccountId === a.id ? '' : a.id)}
                                    style={{
                                        padding: '6px 12px', borderRadius: '8px', fontSize: '11px',
                                        fontWeight: 600, cursor: 'pointer',
                                        border: '1px solid ' + (txAccountId === a.id ? 'var(--accent)' : 'var(--border)'),
                                        background: txAccountId === a.id ? 'rgba(255,107,53,0.1)' : 'var(--bg-elevated)',
                                        color: txAccountId === a.id ? 'var(--accent)' : 'var(--text-3)',
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                    }}>
                                    {a.icon} {a.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* To account (transfers) */}
                {txType === 'transfer' && accounts.length > 1 && (
                    <div>
                        <label style={labelStyle}>To Account</label>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {accounts.filter(a => a.id !== txAccountId).map(a => (
                                <button key={a.id} type="button"
                                    onClick={() => setTxToAccountId(txToAccountId === a.id ? '' : a.id)}
                                    style={{
                                        padding: '6px 12px', borderRadius: '8px', fontSize: '11px',
                                        fontWeight: 600, cursor: 'pointer',
                                        border: '1px solid ' + (txToAccountId === a.id ? '#8b5cf6' : 'var(--border)'),
                                        background: txToAccountId === a.id ? 'rgba(139,92,246,0.1)' : 'var(--bg-elevated)',
                                        color: txToAccountId === a.id ? '#8b5cf6' : 'var(--text-3)',
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                    }}>
                                    {a.icon} {a.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Category grid (expenses) */}
                {txType === 'expense' && (
                    <div>
                        <label style={labelStyle}>Category</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                            {EXPENSE_CATS.map(cat => {
                                const active = txCategory === cat.name;
                                return (
                                    <button key={cat.name} type="button"
                                        onClick={() => setTxCategory(active ? '' : cat.name)}
                                        style={{
                                            padding: '7px 4px', borderRadius: '8px',
                                            border: '2px solid ' + (active ? cat.color : 'var(--border)'),
                                            background: active ? (cat.color + '22') : 'var(--bg-elevated)',
                                            cursor: 'pointer', display: 'flex', flexDirection: 'column',
                                            alignItems: 'center', gap: '3px', transition: 'all 0.15s',
                                        }}>
                                        <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                                        <span style={{ fontSize: '9px', fontWeight: 700, color: active ? cat.color : 'var(--text-3)', textAlign: 'center', lineHeight: 1.2 }}>{cat.name.split(' ')[0]}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Custom label */}
                {txType !== 'transfer' && (txType === 'income' || !txCategory || txCategory === 'Other') && (
                    <div>
                        <label style={labelStyle}>{txType === 'income' ? 'Source / Label' : 'Category Name'}</label>
                        <input type="text"
                            placeholder={txType === 'income' ? 'e.g. Salary, Freelance' : 'e.g. Groceries, Rent'}
                            value={txCustomCat} onChange={e => setTxCustomCat(e.target.value)}
                            required={txType === 'income'}
                            style={inputStyle} />
                    </div>
                )}

                {/* Note */}
                <div>
                    <label style={labelStyle}>Note (optional)</label>
                    <input type="text" placeholder="e.g. Swiggy, monthly bill..."
                        value={txNote} onChange={e => setTxNote(e.target.value)}
                        style={{ ...inputStyle, fontSize: '12px' }} />
                </div>

                <button type="submit" disabled={saving} style={submitBtnStyle(saving)}>
                    {saving ? 'Saving...' : txType === 'transfer' ? 'Log Transfer' : 'Log Transaction'}
                </button>
            </form>
        </div>
    );
}
