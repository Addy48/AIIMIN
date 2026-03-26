import React, { useState } from 'react';
import { insertRow } from '../../services/dbService';
import toast from '../../utils/toast';
import { ACCOUNT_ICONS, inputStyle, cancelBtnStyle, addBtnStyle } from './MoneyShared';

export default function MoneyAccountsTab({ user, accounts, setAccounts }) {
    const [showAccountForm, setShowAccountForm] = useState(false);
    const [acctName, setAcctName] = useState('');
    const [acctType, setAcctType] = useState('bank');
    const [acctBalance, setAcctBalance] = useState('');
    const [saving, setSaving] = useState(false);

    const fmtINR = (v) => '\u20B9' + Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });

    const handleAddAccount = async (e) => {
        e.preventDefault();
        if (!acctName.trim()) return;
        setSaving(true);
        try {
            const data = await insertRow('accounts', [{
                user_id: user.id, name: acctName.trim(), type: acctType,
                balance: parseFloat(acctBalance) || 0,
                icon: ACCOUNT_ICONS[acctType] || '🏦',
                is_default: accounts.length === 0,
            }]);
            if (data?.[0]) {
                setAccounts(prev => [...prev, data[0]]);
                resetAccountForm();
                toast.success('Account added');
            }
        } catch (err) {
            toast.error('Failed to add account: ' + err.message);
        }
        setSaving(false);
    };

    const resetAccountForm = () => {
        setAcctName(''); setAcctType('bank'); setAcctBalance(''); setShowAccountForm(false);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {accounts.map(a => (
                <div key={a.id} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '16px', borderRadius: '14px',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                        {a.icon || ACCOUNT_ICONS[a.type]}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>{a.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'capitalize', marginTop: '2px' }}>{a.type.replace('_', ' ')}</div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: Number(a.balance) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {fmtINR(a.balance)}
                    </div>
                </div>
            ))}

            {showAccountForm ? (
                <form onSubmit={handleAddAccount} style={{ background: 'var(--bg-card)', borderRadius: '14px', padding: '18px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>New Account</div>
                    <input autoFocus placeholder="Account name" value={acctName}
                        onChange={e => setAcctName(e.target.value)} required style={inputStyle} />
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {Object.entries(ACCOUNT_ICONS).map(([key, icon]) => (
                            <button key={key} type="button" onClick={() => setAcctType(key)}
                                style={{
                                    padding: '5px 12px', borderRadius: '99px', fontSize: '11px',
                                    fontWeight: 600, cursor: 'pointer',
                                    border: '1px solid ' + (acctType === key ? 'var(--accent)' : 'var(--border)'),
                                    background: acctType === key ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                                    color: acctType === key ? 'var(--accent)' : 'var(--text-3)',
                                }}>
                                {icon} {key.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                    <input type="number" placeholder="Opening balance" value={acctBalance}
                        onChange={e => setAcctBalance(e.target.value)} style={inputStyle} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="submit" disabled={saving} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                            {saving ? 'Adding...' : 'Add Account'}
                        </button>
                        <button type="button" onClick={resetAccountForm} style={cancelBtnStyle}>Cancel</button>
                    </div>
                </form>
            ) : (
                <button onClick={() => setShowAccountForm(true)} style={addBtnStyle}>+ Add Account</button>
            )}
        </div>
    );
}
