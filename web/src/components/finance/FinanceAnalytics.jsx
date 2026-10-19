import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Finance Analytics — spend heatmap, savings gauge, cash-flow waterfall.
 * Waterfall: shared scale; category labels always under bars; hover tooltips.
 */
const FinanceAnalytics = ({
  dailySpend = [],
  savingsRate = '0',
  monthlyExpenses = 0,
  monthlyIncome = 0,
  topExpenses = [],
  formatCurrency,
}) => {
  const rate = Math.max(0, Math.min(100, Number(savingsRate) || 0));
  const saved = Math.max(0, monthlyIncome - monthlyExpenses);
  const maxBar = Math.max(monthlyIncome, saved, 1);

  const [hoverDay, setHoverDay] = useState(null);
  const [hoverStep, setHoverStep] = useState(null);

  const cells = useMemo(() => {
    if (!dailySpend.length) return [];
    return dailySpend;
  }, [dailySpend]);

  const maxDay = Math.max(1, ...cells.map((d) => d.amount || 0));
  const cols = Math.min(31, Math.max(7, cells.length || 14));

  const waterfallSteps = useMemo(() => {
    const steps = [{ key: 'income', label: 'Income', value: monthlyIncome, kind: 'in' }];
    topExpenses.forEach((exp, i) => {
      steps.push({ key: `e-${i}`, label: exp.name || 'Other', value: exp.value, kind: 'out' });
    });
    steps.push({ key: 'saved', label: 'Saved', value: saved, kind: 'saved' });
    return steps;
  }, [monthlyIncome, topExpenses, saved]);

  const formatDayLabel = (iso) => {
    if (!iso) return '';
    const d = new Date(`${iso}T12:00:00`);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', marginBottom: '24px', order: 2 }}>

        {/* Daily spend heatmap (MTD calendar) */}
        <div className="nordic-card" style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)' }}>Daily Spend Heatmap</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-2)', marginTop: '6px' }}>Month-to-date · darker = heavier day</div>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-3)', display: 'flex', gap: '6px', alignItems: 'center' }}>
              Less
              {[0.12, 0.35, 0.6, 0.9].map((o) => (
                <div key={o} style={{ width: 10, height: 10, borderRadius: 3, background: `rgba(226, 114, 91, ${o})` }} />
              ))}
              More
            </div>
          </div>

          {/* Hover readout above grid */}
          <div
            style={{
              minHeight: 28,
              marginBottom: 12,
              fontSize: 13,
              fontWeight: 600,
              color: hoverDay ? 'var(--color-text-1)' : 'var(--color-text-3)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {hoverDay ? (
              <>
                <span>{formatDayLabel(hoverDay.date)}</span>
                <span style={{ color: 'var(--color-text-3)', fontWeight: 500 }}>·</span>
                <span style={{ color: hoverDay.amount > 0 ? 'var(--color-rust, #e2725b)' : 'var(--color-text-2)' }}>
                  {formatCurrency(hoverDay.amount)}
                </span>
              </>
            ) : (
              <span style={{ fontWeight: 500 }}>Hover a day for amount</span>
            )}
          </div>

          {cells.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-3)', fontSize: 13 }}>No spend logged this month.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 5 }}>
              {cells.map((d) => {
                const intensity = d.amount <= 0 ? 0 : Math.min(1, d.amount / maxDay);
                const active = hoverDay?.date === d.date;
                return (
                  <div
                    key={d.date}
                    role="img"
                    aria-label={`${d.date}: ${formatCurrency(d.amount)}`}
                    onMouseEnter={() => setHoverDay(d)}
                    onMouseLeave={() => setHoverDay(null)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 4,
                      background: intensity === 0
                        ? 'var(--color-elevated)'
                        : `rgba(226, 114, 91, ${0.15 + intensity * 0.85})`,
                      border: active
                        ? '2px solid var(--color-accent)'
                        : intensity === 0
                          ? '1px solid var(--color-border)'
                          : '2px solid transparent',
                      cursor: 'pointer',
                      transform: active ? 'scale(1.08)' : 'none',
                      transition: 'transform 0.12s ease, border-color 0.12s ease',
                      outline: 'none',
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Savings Gauge */}
        <div className="nordic-card" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '20px' }}>Savings Rate</div>
          <div style={{ position: 'relative', width: 200, height: 110, margin: '0 auto', overflow: 'hidden' }}>
            <svg width="200" height="110" viewBox="0 0 200 110">
              <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--color-elevated)" strokeWidth="16" strokeLinecap="round" />
              <motion.path
                d="M20 100 A80 80 0 0 1 180 100"
                fill="none"
                stroke={rate >= 40 ? '#10b981' : 'var(--color-accent)'}
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={`${(rate / 100) * 251} 251`}
                initial={{ strokeDasharray: '0 251' }}
                animate={{ strokeDasharray: `${(rate / 100) * 251} 251` }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
          </div>
          <div style={{ textAlign: 'center', marginTop: -8 }}>
            <div style={{ fontSize: 44, fontWeight: 800, fontFamily: 'var(--font-serif)', letterSpacing: '-0.03em', color: 'var(--color-text-1)' }}>{savingsRate}%</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginTop: 6 }}>
              Target 40% · {rate >= 40 ? 'On track' : 'Below target'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-2)', marginTop: 10 }}>
              {formatCurrency(saved)} of {formatCurrency(monthlyIncome)} kept
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Waterfall — leads Analytics (order 1) */}
      <div className="nordic-card" style={{ padding: '28px 32px', order: 1, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)' }}>Cash Flow Waterfall (MTD)</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-2)', marginTop: 6 }}>Income → top categories → remainder saved</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-1)' }}>
            Burn {formatCurrency(monthlyExpenses)} · Keep {formatCurrency(saved)}
          </div>
        </div>

        <div
          style={{
            minHeight: 28,
            marginBottom: 12,
            fontSize: 13,
            fontWeight: 600,
            color: hoverStep ? 'var(--color-text-1)' : 'var(--color-text-3)',
          }}
        >
          {hoverStep ? (
            <>
              <span style={{ textTransform: 'capitalize' }}>{hoverStep.label}</span>
              <span style={{ color: 'var(--color-text-3)', fontWeight: 500 }}> · </span>
              <span>
                {hoverStep.kind === 'out' ? '−' : ''}
                {formatCurrency(hoverStep.value)}
              </span>
              {hoverStep.kind === 'out' && monthlyIncome > 0 && (
                <span style={{ color: 'var(--color-text-3)', fontWeight: 500 }}>
                  {' '}
                  ({((hoverStep.value / monthlyIncome) * 100).toFixed(1)}% of income)
                </span>
              )}
            </>
          ) : (
            <span style={{ fontWeight: 500 }}>Hover a bar for details</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
          {waterfallSteps.map((step) => {
            const hPct = Math.max(step.kind === 'out' ? 8 : 12, (step.value / maxBar) * 100);
            const bg = step.kind === 'in' ? '#10b981' : step.kind === 'saved' ? 'var(--color-accent)' : 'var(--color-rust, #e2725b)';
            const active = hoverStep?.key === step.key;
            return (
              <div
                key={step.key}
                onMouseEnter={() => setHoverStep(step)}
                onMouseLeave={() => setHoverStep(null)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
              >
                {/* Bar column: amount + bar share fixed height; label sits below (never clipped) */}
                <div style={{ height: 168, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', paddingTop: 24 }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--color-text-1)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {step.kind === 'out' ? '−' : ''}{formatCurrency(step.value)}
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${hPct}%` }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: '100%',
                      background: bg,
                      borderRadius: 10,
                      minHeight: 12,
                      boxShadow: active ? '0 0 0 2px var(--color-accent)' : 'none',
                      opacity: active ? 1 : 0.92,
                    }}
                  />
                </div>

                {/* Category name — always visible under bar */}
                <div
                  title={step.label}
                  style={{
                    marginTop: 10,
                    minHeight: 32,
                    textAlign: 'center',
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    color: active ? 'var(--color-text-1)' : 'var(--color-text-2)',
                    lineHeight: 1.25,
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default FinanceAnalytics;
