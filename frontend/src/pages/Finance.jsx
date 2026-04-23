import React from 'react';
import { FinancialSection } from '../components/system/DashboardSections';
import { useAuth } from '../hooks/useAuth';
import { useFinance } from '../hooks/useFinance';
import { useLHSData } from '../hooks/useLHSData';

/**
 * Finance Page — Full finance page with income tracking, burn rate,
 * category pie chart, savings goals, and LHS financial score.
 */

const PIE_COLORS = ['#d4af37', '#e05c2a', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#6366f1'];

const CategoryPieChart = ({ categories }) => {
    if (!categories.length) return null;
    const total = categories.reduce((s, c) => s + c.amount, 0);
    let cumulativePct = 0;

    return (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--r-lg)' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                Spending by Category
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {/* SVG Pie */}
                <svg width="120" height="120" viewBox="0 0 42 42" style={{ flexShrink: 0 }}>
                    {categories.slice(0, 8).map((cat, i) => {
                        const pct = total > 0 ? (cat.amount / total) * 100 : 0;
                        const offset = 100 - cumulativePct + 25;
                        cumulativePct += pct;
                        return (
                            <circle key={cat.name} r="15.9" cx="21" cy="21" fill="transparent"
                                stroke={PIE_COLORS[i % PIE_COLORS.length]} strokeWidth="6"
                                strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={offset}
                            />
                        );
                    })}
                </svg>
                {/* Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    {categories.slice(0, 6).map((cat, i) => (
                        <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                            <span style={{ color: 'var(--text-2)', flex: 1 }}>{cat.name}</span>
                            <span style={{ fontWeight: 700, color: 'var(--text-1)' }}>{cat.pct}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BurnRateCard = ({ dailyBurnRate, burnRateChange }) => {
    const isUp = burnRateChange > 0;
    return (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--r-lg)' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Daily Burn Rate
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-1)' }}>
                ₹{dailyBurnRate >= 1000 ? `${(dailyBurnRate / 1000).toFixed(1)}k` : dailyBurnRate.toFixed(0)}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: isUp ? 'var(--danger)' : 'var(--success)', marginTop: '4px' }}>
                {isUp ? '▲' : '▼'} {Math.abs(burnRateChange).toFixed(1)}% vs prev 30d
            </div>
        </div>
    );
};

const SavingsGoalsPanel = ({ goals }) => {
    if (!goals.length) return (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--r-lg)', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
            <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>No active savings goals</div>
        </div>
    );
    return (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--r-lg)' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
                Savings Goals
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {goals.slice(0, 4).map(g => {
                    const pct = g.target_amount ? Math.min(100, Math.round((g.current_amount / g.target_amount) * 100)) : 0;
                    return (
                        <div key={g.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{g.name || 'Goal'}</span>
                                <span style={{ color: 'var(--text-3)' }}>₹{(g.current_amount || 0).toLocaleString()} / ₹{(g.target_amount || 0).toLocaleString()}</span>
                            </div>
                            <div style={{ height: '6px', borderRadius: '3px', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, borderRadius: '3px', background: pct >= 100 ? 'var(--success)' : 'var(--accent)', transition: 'width 0.5s' }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const LHSFinancialScore = ({ score }) => (
    <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--r-lg)', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            LHS Financial Score
        </div>
        <div style={{ fontSize: '36px', fontWeight: 900, color: score >= 70 ? 'var(--success)' : score >= 40 ? 'var(--accent)' : 'var(--danger)' }}>
            {score ?? '—'}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '4px' }}>
            {score >= 70 ? 'Healthy' : score >= 40 ? 'Moderate' : score > 0 ? 'At Risk' : '—'}
        </div>
    </div>
);

const Finance = () => {
    const { user, session } = useAuth();
    const { summary, categories, savingsGoals, loading } = useFinance(user);
    const { lhsData } = useLHSData(session);

    if (!user) return null;

    if (loading) {
        return (
            <div>
                <h1 className="text-section" style={{ marginBottom: 'var(--space-6)' }}>Finance</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="skeleton" style={{ height: '80px', borderRadius: 'var(--r-lg)' }} />
                        ))}
                    </div>
                    <div className="skeleton" style={{ height: '300px', borderRadius: 'var(--r-lg)' }} />
                </div>
            </div>
        );
    }

    const s = summary || {};
    const fmt = (val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(0)}`;

    return (
        <div>
            <h1 className="text-section" style={{ marginBottom: 'var(--space-4)' }}>Finance</h1>

            {/* Summary strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: 'var(--space-5)' }}>
                {[
                    { label: '30d Spend', value: fmt(s.totalSpent || 0), icon: '💸', color: 'var(--danger)' },
                    { label: '30d Income', value: fmt(s.totalIncome || 0), icon: '💰', color: 'var(--success)' },
                    { label: 'Net Savings', value: fmt(s.netSavings || 0), icon: '📈', color: (s.netSavings || 0) >= 0 ? 'var(--success)' : 'var(--danger)' },
                    { label: 'Transactions', value: String(s.txCount || 0), icon: '📝', color: 'var(--text-1)' },
                    { label: 'Top Category', value: s.topCategory || '—', icon: '📊', color: 'var(--accent)' },
                ].map(item => (
                    <div key={item.label} className="glass-panel" style={{ padding: '14px 16px', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>{item.icon}</span>
                        <div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: item.color }}>{item.value}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: 'var(--space-6)' }}>
                <CategoryPieChart categories={categories} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <BurnRateCard dailyBurnRate={s.dailyBurnRate || 0} burnRateChange={s.burnRateChange || 0} />
                    <LHSFinancialScore score={lhsData?.systemScores?.financial} />
                </div>
                <SavingsGoalsPanel goals={savingsGoals} />
            </div>

            <FinancialSection user={user} />
        </div>
    );
};

export default Finance;
