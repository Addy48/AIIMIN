import React from 'react';

export const EXPENSE_CATS = [
    { name: 'Food & Dining', icon: '🍛', color: 'var(--gold)' },
    { name: 'Transport', icon: '🚗', color: 'var(--color-info)' },
    { name: 'Shopping', icon: '🛍️', color: 'var(--color-card-purple)' },
    { name: 'Utilities', icon: '🏠', color: 'var(--color-accent)' },
    { name: 'Health', icon: '💊', color: 'var(--color-rust)' },
    { name: 'Entertainment', icon: '🎬', color: '#ec4899' },
    { name: 'Other', icon: '📦', color: 'var(--text-3)' },
];

export const ACCOUNT_ICONS = { bank: '🏦', wallet: '👛', credit_card: '💳', cash: '💵', investment: '📈' };

export const getCatMeta = (name) =>
    EXPENSE_CATS.find(c => c.name === name) || { icon: '💸', color: 'var(--text-3)' };

export const SUBTABS = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'add', label: 'Add', icon: '➕' },
    { key: 'accounts', label: 'Accounts', icon: '🏦' },
    { key: 'lending', label: 'Lending', icon: '🤝' },
];

export const labelStyle = { display: 'block', fontSize: '10px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '5px', textTransform: 'uppercase' };
export const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-1)', fontSize: '13px' };
export const cancelBtnStyle = { padding: '10px 16px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-3)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' };
export const addBtnStyle = { width: '100%', padding: '10px', borderRadius: '10px', border: '1px dashed var(--border-hover)', background: 'transparent', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)' };
export const submitBtnStyle = (saving) => ({ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: 700, fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, marginTop: '4px' });

export function MetricCard({ label, value, color }) {
    return (
        <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: color || 'var(--text-1)', marginTop: '4px' }}>{value}</div>
        </div>
    );
}
