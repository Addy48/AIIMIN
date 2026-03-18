import React, { useState, useEffect, useCallback } from 'react';
import supabase from '../utils/supabase';
import { insertRow, updateRow } from '../services/dbService';
import toast from '../utils/toast';

const EXPENSE_CATS = [
    { name: 'Food & Dining',  icon: '🍛', color: '#ff6b35' },
    { name: 'Transport',      icon: '🚗', color: '#3b82f6' },
    { name: 'Shopping',       icon: '🛍️', color: '#a855f7' },
    { name: 'Utilities',      icon: '🏠', color: '#f59e0b' },
    { name: 'Health',         icon: '💊', color: '#10b981' },
    { name: 'Entertainment',  icon: '🎬', color: '#ec4899' },
    { name: 'Other',          icon: '📦', color: '#6b7280' },
];

const ACCOUNT_ICONS = { bank: '🏦', wallet: '👛', credit_card: '💳', cash: '💵', investment: '📈' };

const getCatMeta = (name) =>
    EXPENSE_CATS.find(c => c.name === name) || { icon: '💸', color: '#6b7280' };

const SUBTABS = [
    { key: 'overview',  label: 'Overview',  icon: '📊' },
    { key: 'add',       label: 'Add',       icon: '➕' },
    { key: 'accounts',  label: 'Accounts',  icon: '🏦' },
    { key: 'lending',   label: 'Lending',   icon: '🤝' },
];

const MoneyManager = ({ user }) => {
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [lentItems, setLentItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [activeSubtab, setActiveSubtab] = useState('overview');
    const [goalsOpen, setGoalsOpen] = useState(true);

    // Transaction form
    const [txType, setTxType] = useState('expense');
    const [txAmount, setTxAmount] = useState('');
    const [txCategory, setTxCategory] = useState('');
    const [txCustomCat, setTxCustomCat] = useState('');
    const [txNote, setTxNote] = useState('');
    const [txAccountId, setTxAccountId] = useState('');
    const [txToAccountId, setTxToAccountId] = useState('');

    // Account form
    const [showAccountForm, setShowAccountForm] = useState(false);
    const [acctName, setAcctName] = useState('');
    const [acctType, setAcctType] = useState('bank');
    const [acctBalance, setAcctBalance] = useState('');

    // Lending form
    const [showLendForm, setShowLendForm] = useState(false);
    const [lendPerson, setLendPerson] = useState('');
    const [lendAmount, setLendAmount] = useState('');
    const [lendDirection, setLendDirection] = useState('lent');
    const [lendReason, setLendReason] = useState('');

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const [txRes, acctsRes, goalsRes, budgetsRes, lentRes] = await Promise.all([
            supabase.from('money_transactions').select('*')
                .eq('user_id', user.id).gte('date', startOfMonth)
                .order('created_at', { ascending: false }),
            supabase.from('accounts').select('*')
                .eq('user_id', user.id).eq('archived', false)
                .order('created_at', { ascending: true }),
            supabase.from('savings_goals').select('*')
                .eq('user_id', user.id).eq('status', 'active')
                .order('created_at', { ascending: false }),
            supabase.from('budgets').select('*, money_categories(name, icon, color)')
                .eq('user_id', user.id),
            supabase.from('money_lent').select('*')
                .eq('user_id', user.id).neq('status', 'settled')
                .order('created_at', { ascending: false }),
        ]);
        setTransactions(txRes.data || []);
        setAccounts(acctsRes.data || []);
        setSavingsGoals(goalsRes.data || []);
        setBudgets(budgetsRes.data || []);
        setLentItems(lentRes.data || []);
        setLoading(false);
    }, [user]);

    useEffect(() => { if (user) fetchAll(); }, [user, fetchAll]);

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
        } else {
            const catName = txType === 'income'
                ? (txCustomCat.trim() || 'Income')
                : (txCategory || txCustomCat.trim() || 'Other');
            let finalAmount = parseFloat(txAmount);
            if (txType === 'expense') finalAmount = -Math.abs(finalAmount);
            else finalAmount = Math.abs(finalAmount);

            try {
                const data = await insertRow('money_transactions', [{
                    user_id: user.id, date: dateStr, category: catName,
                    description: txNote.trim() || null, amount: finalAmount,
                    source: 'manual', currency: 'INR',
                    type: txType, account_id: txAccountId || null,
                    time_of_day: hourIST,
                }]);
                if (data?.[0]) setTransactions(prev => [data[0], ...prev]);
                toast.success('Transaction logged');
            } catch (err) {
                toast.error('Failed to log: ' + err.message);
                setSaving(false);
                return;
            }
        }
        setTxAmount(''); setTxCategory(''); setTxCustomCat(''); setTxNote('');
        setSaving(false);
        fetchAll();
    };

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

    // ── Derived values ──
    const thisMonthIncome = transactions
        .filter(t => Number(t.amount) > 0 && t.type !== 'transfer_in')
        .reduce((s, t) => s + Number(t.amount), 0);
    const thisMonthExpense = Math.abs(
        transactions.filter(t => Number(t.amount) < 0 && t.type !== 'transfer_out')
            .reduce((s, t) => s + Number(t.amount), 0)
    );
    const net = thisMonthIncome - thisMonthExpense;
    const daysElapsed = new Date().getDate();
    const dailyBurn = daysElapsed > 0 ? thisMonthExpense / daysElapsed : 0;
    const projMonth = dailyBurn * 30;

    // Category spend totals
    const categoryTotals = {};
    transactions.filter(t => Number(t.amount) < 0 && t.type !== 'transfer_out').forEach(t => {
        const cat = t.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount);
    });
    const sortedCats = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxCat = sortedCats.length > 0 ? sortedCats[0][1] : 1;

    // Budget lookup
    const budgetByCategory = {};
    budgets.forEach(b => {
        const n = b.money_categories?.name;
        if (n) budgetByCategory[n] = Number(b.amount);
    });

    // 7-day trend
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
        const ds = new Date(Date.now() - i * 86400000).toLocaleDateString('en-CA');
        const amt = transactions
            .filter(t => Number(t.amount) < 0 && t.type !== 'transfer_out' && t.date === ds)
            .reduce((s, t) => s + Math.abs(t.amount), 0);
        last7.push({ date: ds, amount: amt });
    }
    const max7 = Math.max(...last7.map(d => d.amount), 1);

    // Overspend alert
    const todayStr = new Date().toLocaleDateString('en-CA');
    const todaySpend = transactions
        .filter(t => Number(t.amount) < 0 && t.type !== 'transfer_out' && t.date === todayStr)
        .reduce((s, t) => s + Math.abs(t.amount), 0);
    const avgDaily = thisMonthExpense / Math.max(daysElapsed, 1);
    const isOverspend = todaySpend > avgDaily * 1.5 && todaySpend > 100;

    // Late-night spending
    const lateNightTx = transactions.filter(t => {
        const h = parseInt(t.time_of_day);
        return Number(t.amount) < 0 && !isNaN(h) && (h >= 23 || h < 5);
    });
    const lateNightTotal = lateNightTx.reduce((s, t) => s + Math.abs(t.amount), 0);

    // Total outstanding lent/borrowed
    const totalLent = lentItems.filter(l => l.direction === 'lent').reduce((s, l) => s + Number(l.amount), 0);
    const totalBorrowed = lentItems.filter(l => l.direction === 'borrowed').reduce((s, l) => s + Number(l.amount), 0);

    // Account totals
    const totalBalance = accounts.reduce((s, a) => s + Number(a.balance || 0), 0);

    const fmtINR = (v) => '\u20B9' + Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });

    return (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Subtab bar */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-elevated)', borderRadius: '10px', padding: '4px' }}>
                {SUBTABS.map(({ key, label, icon }) => (
                    <button key={key} onClick={() => setActiveSubtab(key)} style={{
                        flex: 1, padding: '7px 10px', borderRadius: '8px', fontSize: '11px',
                        fontWeight: activeSubtab === key ? 700 : 500, border: 'none', cursor: 'pointer',
                        transition: 'all 0.15s',
                        background: activeSubtab === key ? 'var(--bg-card)' : 'transparent',
                        color: activeSubtab === key ? 'var(--text-1)' : 'var(--text-3)',
                        boxShadow: activeSubtab === key ? 'var(--shadow-sm)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                    }}>
                        <span style={{ fontSize: '12px' }}>{icon}</span> {label}
                    </button>
                ))}
            </div>

            {/* ═══ OVERVIEW ═══ */}
            {activeSubtab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    {/* Top metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }} className="money-metrics">
                        <MetricCard label="Month In" value={fmtINR(thisMonthIncome)} color="var(--success)" />
                        <MetricCard label="Month Out" value={fmtINR(thisMonthExpense)} color="var(--text-1)" />
                        <MetricCard label="Net" value={(net >= 0 ? '+' : '-') + fmtINR(net)} color={net >= 0 ? 'var(--success)' : 'var(--danger)'} />
                    </div>

                    {/* Account summary */}
                    {accounts.length > 0 && (
                        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accounts</span>
                                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)' }}>{fmtINR(totalBalance)}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {accounts.map(a => (
                                    <div key={a.id} style={{
                                        padding: '8px 12px', borderRadius: '10px',
                                        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                        fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px',
                                    }}>
                                        <span>{a.icon || ACCOUNT_ICONS[a.type]}</span>
                                        <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{a.name}</span>
                                        <span style={{ fontWeight: 700, color: 'var(--text-2)' }}>{fmtINR(a.balance)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Overspend alert */}
                    {isOverspend && (
                        <div style={{ background: 'var(--danger-dim)', border: '1px solid var(--danger)', borderRadius: '10px', padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--danger)' }}>
                            {'\u26A0\uFE0F Today\u2019s spending (' + fmtINR(todaySpend) + ') is ' + ((todaySpend / avgDaily - 1) * 100).toFixed(0) + '% above your daily average'}
                        </div>
                    )}

                    {/* Burn rate */}
                    <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase' }}>Daily Burn</div>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', marginTop: '2px' }}>{fmtINR(dailyBurn) + '/day'}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase' }}>Projected</div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>{fmtINR(projMonth) + '/mo'}</div>
                        </div>
                    </div>

                    {/* Category breakdown */}
                    {sortedCats.length > 0 && (
                        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em' }}>Top Categories</div>
                            {sortedCats.map(([cat, amt]) => {
                                const budget = budgetByCategory[cat];
                                const barPct = budget ? Math.min((amt / budget) * 100, 100) : (amt / maxCat) * 100;
                                const over = budget && amt > budget;
                                const meta = getCatMeta(cat);
                                return (
                                    <div key={cat} style={{ marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span>{meta.icon}</span> {cat}
                                                {over && <span style={{ fontSize: '9px', background: 'var(--danger-dim)', color: 'var(--danger)', borderRadius: '4px', padding: '1px 5px', fontWeight: 700 }}>OVER</span>}
                                            </span>
                                            <span style={{ fontSize: '12px', fontWeight: 700, color: over ? 'var(--danger)' : 'var(--text-2)' }}>
                                                {fmtINR(amt)}{budget ? (' / ' + fmtINR(budget)) : ''}
                                            </span>
                                        </div>
                                        <div style={{ height: '5px', borderRadius: '99px', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', borderRadius: '99px', background: over ? 'var(--danger)' : meta.color, width: barPct + '%', transition: 'width 0.3s' }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* 7-day trend */}
                    <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em' }}>7-Day Spend</div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '50px' }}>
                            {last7.map((d, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                                    <div style={{ width: '100%', borderRadius: '3px 3px 0 0', background: i === 6 ? 'var(--accent)' : 'var(--bg-elevated)', height: Math.max((d.amount / max7) * 40, 2) + 'px', transition: 'height 0.3s' }} />
                                    <span style={{ fontSize: '8px', color: 'var(--text-3)', fontWeight: 600 }}>
                                        {new Date(d.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Late-night spending insight */}
                    {lateNightTotal > 0 && (
                        <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '10px', padding: '12px 16px', fontSize: '12px', color: '#a855f7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '16px' }}>{'\uD83C\uDF19'}</span>
                            {'Late-night spending: ' + fmtINR(lateNightTotal) + ' (' + lateNightTx.length + ' txns after 11 PM)'}
                        </div>
                    )}

                    {/* Lending summary on overview */}
                    {(totalLent > 0 || totalBorrowed > 0) && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {totalLent > 0 && (
                                <div style={{ background: 'var(--bg-card)', borderRadius: '10px', padding: '12px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase' }}>You Lent</div>
                                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)', marginTop: '2px' }}>{fmtINR(totalLent)}</div>
                                </div>
                            )}
                            {totalBorrowed > 0 && (
                                <div style={{ background: 'var(--bg-card)', borderRadius: '10px', padding: '12px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase' }}>You Borrowed</div>
                                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--danger)', marginTop: '2px' }}>{fmtINR(totalBorrowed)}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Savings goals */}
                    {savingsGoals.length > 0 && (
                        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border)' }}>
                            <button onClick={() => setGoalsOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{'\uD83C\uDFAF'} Savings Goals</span>
                                <span style={{ fontSize: '13px', color: 'var(--text-3)', transform: goalsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>{'\u25BE'}</span>
                            </button>
                            {goalsOpen && (
                                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {savingsGoals.map(goal => {
                                        const pct = Math.min((Number(goal.current_amount) / Number(goal.target_amount)) * 100, 100);
                                        return (
                                            <div key={goal.id}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)' }}>{goal.name}</span>
                                                    <span style={{ fontSize: '11px', fontWeight: 700, color: pct >= 100 ? 'var(--success)' : 'var(--accent)' }}>{pct >= 100 ? '\u2713' : (pct.toFixed(0) + '%')}</span>
                                                </div>
                                                <div style={{ height: '6px', borderRadius: '99px', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', borderRadius: '99px', background: pct >= 100 ? 'var(--success)' : 'var(--accent)', width: pct + '%', transition: 'width 0.5s' }} />
                                                </div>
                                                <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600, marginTop: '4px' }}>
                                                    {fmtINR(goal.current_amount) + ' / ' + fmtINR(goal.target_amount)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Recent transactions */}
                    <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Recent Activity</div>
                        {loading ? (
                            <div style={{ color: 'var(--text-3)', fontSize: '13px' }}>Loading...</div>
                        ) : transactions.length === 0 ? (
                            <div style={{ color: 'var(--text-3)', fontSize: '13px', fontStyle: 'italic' }}>No transactions this month.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {transactions.slice(0, 8).map(t => {
                                    const isExp = Number(t.amount) < 0;
                                    const isXfer = t.type === 'transfer_out' || t.type === 'transfer_in';
                                    const meta = isXfer ? { icon: '\uD83D\uDD04', color: '#8b5cf6' } : isExp ? getCatMeta(t.category) : { icon: '\uD83D\uDCC8', color: '#10b981' };
                                    return (
                                        <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isExp ? 'var(--bg-elevated)' : 'var(--success-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{meta.icon}</div>
                                                <div>
                                                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)' }}>{t.category}</div>
                                                    <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>
                                                        {t.description ? (t.description + ' \u00B7 ') : ''}
                                                        {new Date(t.date || t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '14px', fontWeight: 800, color: isExp ? 'var(--text-1)' : 'var(--success)' }}>
                                                {(isExp ? '-' : '+') + fmtINR(t.amount)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ═══ ADD TRANSACTION ═══ */}
            {activeSubtab === 'add' && (
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
            )}

            {/* ═══ ACCOUNTS ═══ */}
            {activeSubtab === 'accounts' && (
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
                                            background: acctType === key ? 'rgba(255,107,53,0.1)' : 'var(--bg-elevated)',
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
            )}

            {/* ═══ LENDING ═══ */}
            {activeSubtab === 'lending' && (
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
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: l.direction === 'lent' ? 'rgba(255,107,53,0.1)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
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
            )}
        </div>
    );
};

// ── Shared styles ──
const labelStyle = { display: 'block', fontSize: '10px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '5px', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-1)', fontSize: '13px' };
const cancelBtnStyle = { padding: '10px 16px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-3)', fontWeight: 600, fontSize: '13px', cursor: 'pointer' };
const addBtnStyle = { width: '100%', padding: '10px', borderRadius: '10px', border: '1px dashed var(--border-hover)', background: 'transparent', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)' };
const submitBtnStyle = (saving) => ({ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: 700, fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, marginTop: '4px' });

function MetricCard({ label, value, color }) {
    return (
        <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color, marginTop: '4px' }}>{value}</div>
        </div>
    );
}

export default MoneyManager;
