import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

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
        } catch (err) {
            console.error('Error adding transaction:', err);
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
