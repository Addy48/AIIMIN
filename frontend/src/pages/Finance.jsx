import React from 'react';
import { FinancialSection } from '../components/system/DashboardSections';
import { useAuth } from '../hooks/useAuth';
import { useFinance } from '../hooks/useFinance';
import { useLHSData } from '../hooks/useLHSData';

/*
 * Finance Page — income tracking, burn rate, category breakdown,
 * savings goals, LHS financial score.
 */

const PIE_COLORS = [
  'var(--color-accent)',
  'var(--color-alert-red)',
  'var(--color-steps)',
  'var(--color-water)',
  '#8b5cf6',
  '#ec4899',
  'var(--color-warning)',
  '#6366f1',
];

const SectionLabel = ({ children }) => (
  <span className="text-label" style={{ display: 'block', marginBottom: '14px' }}>
    {children}
  </span>
);

const CategoryPieChart = ({ categories }) => {
  if (!categories.length) return null;
  const total = categories.reduce((s, c) => s + c.amount, 0);
  let cumulativePct = 0;

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--r-md)',
      padding: '20px',
    }}>
      <SectionLabel>Spending by Category</SectionLabel>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <svg width="100" height="100" viewBox="0 0 42 42" style={{ flexShrink: 0 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {categories.slice(0, 6).map((cat, i) => (
            <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '6px', height: '6px',
                borderRadius: '1px',
                background: PIE_COLORS[i % PIE_COLORS.length],
                flexShrink: 0,
              }} />
              <span className="text-subtext" style={{ flex: 1 }}>{cat.name}</span>
              <span style={{ font: '500 11px/1 var(--font-mono)', color: 'var(--color-text-1)' }}>
                {cat.pct}%
              </span>
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
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--r-md)',
      padding: '20px',
    }}>
      <SectionLabel>Daily Burn Rate</SectionLabel>
      <span style={{ font: 'var(--text-metric)', color: 'var(--color-hero)' }}>
        ₹{dailyBurnRate >= 1000 ? `${(dailyBurnRate / 1000).toFixed(1)}k` : dailyBurnRate.toFixed(0)}
      </span>
      <div style={{
        font: '300 12px/1 var(--font-sans)',
        color: isUp ? 'var(--color-alert-red)' : 'var(--color-accent)',
        marginTop: '6px',
      }}>
        {isUp ? '▲' : '▼'} {Math.abs(burnRateChange).toFixed(1)}% vs prev 30d
      </div>
    </div>
  );
};

const SavingsGoalsPanel = ({ goals }) => {
  if (!goals.length) return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--r-md)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    }}>
      <span className="text-label">Savings Goals</span>
      <span className="text-subtext" style={{ color: 'var(--color-text-3)' }}>No active goals</span>
    </div>
  );
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--r-md)',
      padding: '20px',
    }}>
      <SectionLabel>Savings Goals</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {goals.slice(0, 4).map(g => {
          const pct = g.target_amount
            ? Math.min(100, Math.round((g.current_amount / g.target_amount) * 100))
            : 0;
          return (
            <div key={g.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ font: '300 12px/1 var(--font-sans)', color: 'var(--color-text-1)' }}>
                  {g.name || 'Goal'}
                </span>
                <span className="text-subtext">
                  ₹{(g.current_amount || 0).toLocaleString()} / ₹{(g.target_amount || 0).toLocaleString()}
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{
                  width: `${pct}%`,
                  background: pct >= 100 ? 'var(--color-accent)' : 'var(--color-accent)',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LHSFinancialScore = ({ score }) => (
  <div style={{
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--r-md)',
    padding: '20px',
    textAlign: 'center',
  }}>
    <SectionLabel>LHS Financial Score</SectionLabel>
    <span style={{
      font: 'var(--text-hero)',
      color: score >= 70
        ? 'var(--color-accent)'
        : score >= 40
        ? 'var(--color-warning)'
        : score > 0
        ? 'var(--color-alert-red)'
        : 'var(--color-text-3)',
    }}>
      {score ?? '—'}
    </span>
    <div className="text-subtext" style={{ marginTop: '6px' }}>
      {score >= 70 ? 'Healthy' : score >= 40 ? 'Moderate' : score > 0 ? 'At Risk' : '—'}
    </div>
  </div>
);

/* ── Summary stat chip ─────────────────────────────── */
const StatChip = ({ label, value, valueColor }) => (
  <div style={{
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--r-md)',
    padding: '16px',
  }}>
    <span className="text-label" style={{ display: 'block', marginBottom: '8px' }}>{label}</span>
    <span style={{
      font: 'var(--text-metric)',
      color: valueColor || 'var(--color-hero)',
    }}>{value}</span>
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
        <div style={{ font: '300 32px/1 var(--font-sans)', color: 'var(--color-text-1)', marginBottom: 'var(--space-6)', letterSpacing: '-0.02em' }}>
          Finance<span style={{ color: 'var(--color-accent)' }}>.</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="skeleton" style={{ height: '80px', borderRadius: 'var(--r-md)' }} />
            ))}
          </div>
          <div className="skeleton" style={{ height: '280px', borderRadius: 'var(--r-md)' }} />
        </div>
      </div>
    );
  }

  const s = summary || {};
  const fmt = (val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : (val || 0).toFixed(0)}`;

  return (
    <div>
      <div style={{
        font: '300 32px/1 var(--font-sans)',
        color: 'var(--color-text-1)',
        marginBottom: 'var(--space-6)',
        letterSpacing: '-0.02em',
      }}>
        Finance<span style={{ color: 'var(--color-accent)' }}>.</span>
      </div>

      {/* Summary strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px',
        marginBottom: 'var(--space-5)',
      }}>
        <StatChip label="30d Spend"     value={fmt(s.totalSpent || 0)}  valueColor="var(--color-alert-red)" />
        <StatChip label="30d Income"    value={fmt(s.totalIncome || 0)} valueColor="var(--color-accent)" />
        <StatChip
          label="Net Savings"
          value={fmt(s.netSavings || 0)}
          valueColor={(s.netSavings || 0) >= 0 ? 'var(--color-accent)' : 'var(--color-alert-red)'}
        />
        <StatChip label="Transactions"  value={String(s.txCount || 0)} />
        <StatChip label="Top Category"  value={s.topCategory || '—'}   valueColor="var(--color-text-2)" />
      </div>

      {/* Analytics row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: 'var(--space-6)' }}>
        <CategoryPieChart categories={categories} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
