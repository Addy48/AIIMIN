import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import toast from '../utils/toast';

const MoneyManager = ({ user }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('expense'); // 'income' or 'expense'

    useEffect(() => {
        if (!user) return;
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            // Fetch this month's transactions
            const d = new Date();
            const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();

            const { data, error } = await supabase
                .from('money_transactions')
                .select('*')
                .eq('user_id', user.id)
                .gte('date', startOfMonth)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTransactions(data || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount)) return;

        setSaving(true);
        try {
            // Date string local format (YYYY-MM-DD)
            const dateStr = new Date().toLocaleDateString('en-CA');

            // Format amount based on type
            let finalAmount = parseFloat(amount);
            if (type === 'expense') finalAmount = -Math.abs(finalAmount);
            else finalAmount = Math.abs(finalAmount);

            const { data, error } = await supabase
                .from('money_transactions')
                .insert([
                    {
                        user_id: user.id,
                        date: dateStr,
                        category: category || (type === 'income' ? 'Income' : 'General'),
                        amount: finalAmount,
                        source: 'manual'
                    }
                ])
                .select();

            if (error) throw error;

            // Prepend new transaction to UI list
            if (data && data[0]) {
                setTransactions(prev => [data[0], ...prev]);
            }

            setAmount('');
            setCategory('');
            toast.success('Transaction logged ✓');
        } catch (err) {
            toast.error('Failed to log transaction');
        } finally {
            setSaving(false);
        }
    };

    // Derived values
    const thisMonthIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + Number(t.amount), 0);
    const thisMonthExpense = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Number(t.amount), 0));
    const net = thisMonthIncome - thisMonthExpense;

    return (
        <div className="fade-up flex flex-col gap-6">

            {/* Overview Cards */}
            <div className="grid grid-cols-2 space-x-3">
                <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>This Month In</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>₹{thisMonthIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>This Month Out</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-1)', marginTop: '4px' }}>₹{thisMonthExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)' }}>Net Cashflow</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: net >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {net >= 0 ? '+' : '-'}₹{Math.abs(net).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>

            {/* Intelligence Layer */}
            {(() => {
                // Monthly burn rate
                const daysElapsed = new Date().getDate();
                const dailyBurn = daysElapsed > 0 ? thisMonthExpense / daysElapsed : 0;
                const projectedMonthly = dailyBurn * 30;

                // Category breakdown
                const categories = {};
                transactions.filter(t => t.amount < 0).forEach(t => {
                    const cat = t.category || 'Other';
                    categories[cat] = (categories[cat] || 0) + Math.abs(t.amount);
                });
                const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 5);
                const maxCat = sortedCats.length > 0 ? sortedCats[0][1] : 1;

                // 7-day spend trend
                const last7 = [];
                for (let i = 6; i >= 0; i--) {
                    const d = new Date(Date.now() - i * 86400000).toLocaleDateString('en-CA');
                    const dayTotal = transactions
                        .filter(t => t.amount < 0 && t.date === d)
                        .reduce((s, t) => s + Math.abs(t.amount), 0);
                    last7.push({ date: d, amount: dayTotal });
                }
                const max7 = Math.max(...last7.map(d => d.amount), 1);

                // Overspend alert
                const avgDaily = thisMonthExpense / Math.max(daysElapsed, 1);
                const todayStr = new Date().toLocaleDateString('en-CA');
                const todaySpend = transactions
                    .filter(t => t.amount < 0 && t.date === todayStr)
                    .reduce((s, t) => s + Math.abs(t.amount), 0);
                const isOverspend = todaySpend > avgDaily * 1.5 && todaySpend > 100;

                return (
                    <>
                        {/* Overspend Alert */}
                        {isOverspend && (
                            <div style={{
                                background: 'var(--danger-dim)', border: '1px solid var(--danger)',
                                borderRadius: '10px', padding: '12px 16px',
                                display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: 600, color: 'var(--danger)'
                            }} className="reveal-up">
                                ⚠️ Today's spending (₹{todaySpend.toFixed(0)}) exceeds your daily average by {((todaySpend / avgDaily - 1) * 100).toFixed(0)}%
                            </div>
                        )}

                        {/* Burn Rate */}
                        <div style={{
                            background: 'var(--bg-card)', borderRadius: '12px', padding: '16px',
                            border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }} className="card-hover">
                            <div>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Burn Rate</div>
                                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', marginTop: '2px' }}>₹{dailyBurn.toFixed(0)}/day</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase' }}>Projected</div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>₹{projectedMonthly.toFixed(0)}/mo</div>
                            </div>
                        </div>

                        {/* Category Breakdown */}
                        {sortedCats.length > 0 && (
                            <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Top Categories</div>
                                {sortedCats.map(([cat, amt]) => (
                                    <div key={cat} style={{ marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-1)' }}>{cat}</span>
                                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-2)' }}>₹{amt.toFixed(0)}</span>
                                        </div>
                                        <div style={{ height: '6px', borderRadius: '99px', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                                            <div className="momentum-fill" style={{ height: '100%', borderRadius: '99px', background: 'var(--accent)', width: `${(amt / maxCat) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 7-Day Spend Trend */}
                        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>7-Day Spend</div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px' }}>
                                {last7.map((d, i) => (
                                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                        <div style={{
                                            width: '100%', borderRadius: '4px 4px 0 0',
                                            background: i === 6 ? 'var(--accent)' : 'var(--bg-elevated)',
                                            height: `${Math.max((d.amount / max7) * 50, 2)}px`,
                                            transition: 'height 0.3s ease'
                                        }} />
                                        <span style={{ fontSize: '9px', color: 'var(--text-3)', fontWeight: 600 }}>
                                            {new Date(d.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                );
            })()}

            {/* Add Transaction Form */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--text-1)' }}>Add Transaction</h3>

                <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                    {/* Toggle Type */}
                    <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '4px' }}>
                        <div
                            onClick={() => setType('expense')}
                            style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: type === 'expense' ? 'var(--bg-card)' : 'transparent', color: type === 'expense' ? 'var(--text-1)' : 'var(--text-3)', boxShadow: type === 'expense' ? 'var(--shadow-sm)' : 'none' }}
                        >Spent</div>
                        <div
                            onClick={() => setType('income')}
                            style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: type === 'income' ? 'var(--bg-card)' : 'transparent', color: type === 'income' ? 'var(--success)' : 'var(--text-3)', boxShadow: type === 'income' ? 'var(--shadow-sm)' : 'none' }}
                        >Earned</div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>Amount ₹</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-1)', fontSize: '16px', fontWeight: 600 }}
                            />
                        </div>
                        <div style={{ flex: 2 }}>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>Category/Note</label>
                            <input
                                type="text"
                                placeholder={type === 'expense' ? "e.g. Groceries, Rent" : "e.g. Salary, Sold Item"}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-1)', fontSize: '14px' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: 700, fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, transition: 'all 0.2s', marginTop: '4px' }}
                    >
                        {saving ? 'Saving...' : 'Log Transaction'}
                    </button>
                </form>
            </div>

            {/* Recent Transactions List */}
            <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    Recent Activity
                </div>

                {loading ? (
                    <div style={{ color: 'var(--text-3)', fontSize: '13px' }}>Loading...</div>
                ) : transactions.length === 0 ? (
                    <div style={{ color: 'var(--text-3)', fontSize: '13px', fontStyle: 'italic' }}>No transactions recorded this month.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {transactions.slice(0, 10).map(t => {
                            const isExpense = Number(t.amount) < 0;
                            return (
                                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isExpense ? 'var(--bg-elevated)' : 'var(--success-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                                            {isExpense ? '📉' : '📈'}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)' }}>{t.category}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{new Date(t.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '15px', fontWeight: 800, color: isExpense ? 'var(--text-1)' : 'var(--success)' }}>
                                        {isExpense ? '' : '+'}₹{Math.abs(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className="h-4"></div>
        </div>
    );
};

export default MoneyManager;
