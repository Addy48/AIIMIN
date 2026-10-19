import React, { useState } from 'react';
import { getCatMeta, ACCOUNT_ICONS, MetricCard } from './MoneyShared';

export default function MoneyOverviewTab({ transactions, accounts, budgets, savingsGoals, lentItems, loading }) {
    const [goalsOpen, setGoalsOpen] = useState(true);

    const fmtINR = (v) => '\u20B9' + Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });

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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Top metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }} className="money-metrics">
                <MetricCard label="Month In" value={fmtINR(thisMonthIncome)} color="var(--success)" />
                <MetricCard label="Month Out" value={fmtINR(thisMonthExpense)} color="var(--text-1)" />
                <MetricCard label="Net" value={(net >= 0 ? '+' : '-') + fmtINR(net)} color={net >= 0 ? 'var(--success)' : 'var(--danger)'} />
            </div>

            {/* Account summary */}
            {accounts.length > 0 && (
                <div className="card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Accounts</span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>{fmtINR(totalBalance)}</span>
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
            <div className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Daily Burn</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-1)', marginTop: '2px' }}>{fmtINR(dailyBurn) + '/day'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Projected</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent)' }}>{fmtINR(projMonth) + '/mo'}</div>
                </div>
            </div>

            {/* Category breakdown */}
            {sortedCats.length > 0 && (
                <div className="card" style={{ padding: '16px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>Top Categories</div>
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
            <div className="card" style={{ padding: '16px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>7-Day Spend</div>
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
                <div style={{ background: 'var(--color-card-purple)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '12px 16px', fontSize: '12px', color: 'var(--text-1)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{'\uD83C\uDF19'}</span>
                    {'Late-night spending: ' + fmtINR(lateNightTotal) + ' (' + lateNightTx.length + ' txns after 11 PM)'}
                </div>
            )}

            {/* Lending summary on overview */}
            {(totalLent > 0 || totalBorrowed > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {totalLent > 0 && (
                        <div className="card" style={{ padding: '12px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>You Lent</div>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)', marginTop: '2px' }}>{fmtINR(totalLent)}</div>
                        </div>
                    )}
                    {totalBorrowed > 0 && (
                        <div className="card" style={{ padding: '12px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>You Borrowed</div>
                            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--danger)', marginTop: '2px' }}>{fmtINR(totalBorrowed)}</div>
                        </div>
                    )}
                </div>
            )}

            {/* Savings goals */}
            {savingsGoals.length > 0 && (
                <div className="card" style={{ padding: '16px' }}>
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
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Recent Activity</div>
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
                                <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: isExp ? 'var(--bg-elevated)' : 'var(--color-accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{meta.icon}</div>
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{t.category}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 500 }}>
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
    );
}
