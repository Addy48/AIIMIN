import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, AlertCircle, TrendingUp,
  Activity, Flame, Timer, Zap, PieChart
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const FinanceOverview = ({ 
  totalNetWorth, returnPct, monthlyIncome, monthlyExpenses, formatCurrency,
  aiSummaryLoading, aiSummary,
  savingsRate, fiYears, fiProgressPct = 0, totalBalance, totalReturns,
  financeChecks, velocityData, onReviewAnalytics
}) => {
  const fiTrendLabel = fiYears == null
    ? 'Need savings data'
    : fiYears === 0
      ? 'FI achieved'
      : `${fiYears} yr to FI`;
  const fiTargetYear = fiYears == null || fiYears < 0 ? null : new Date().getFullYear() + Math.max(0, fiYears);
  const fiHeadline = fiYears == null ? '—' : fiYears === 0 ? 'Now' : `${fiYears} years`;
  const capitalSurplus = monthlyIncome - monthlyExpenses;
  const surplusLabel = `${capitalSurplus >= 0 ? '+' : '−'}${formatCurrency(Math.abs(capitalSurplus))}`;
  const isEmptyVault = !totalNetWorth && !monthlyIncome && !monthlyExpenses;
  const progress = Math.max(0, Math.min(100, Number(fiProgressPct) || 0));
  const chartData = Array.isArray(velocityData) && velocityData.length ? velocityData : [{ name: 'Now', value: Math.round(totalNetWorth || 0) }];
  const sanitizeAiText = (s) => {
    if (!s || typeof s !== 'string') return s;
    return s.replace(/\s*AI-\s*$/i, '').replace(/[\s-]+$/g, '').trim();
  };

  return (
    <motion.div 
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {isEmptyVault && (
        <div style={{
          marginBottom: '20px', padding: '14px 18px', borderRadius: '14px',
          background: 'color-mix(in srgb, var(--color-accent) 10%, var(--color-surface))',
          border: '1px solid color-mix(in srgb, var(--color-accent) 28%, var(--color-border))',
          color: 'var(--color-text-1)', fontSize: '13px', lineHeight: 1.5, fontWeight: 600,
        }}>
          No money data yet. Add an account, then record income or expenses to unlock projections and AI insights.
        </div>
      )}

      {/* Hero Banner */}
      <div style={{
          background: 'var(--color-card-dark-green)',
          color: 'white',
          borderRadius: '12px',
          padding: '56px 48px',
          marginBottom: 'var(--space-7)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.25em', opacity: 0.6, marginBottom: '20px', fontWeight: 700 }}>Consolidated Net Worth (INR)</div>
              <div style={{ fontSize: 'clamp(42px, 8vw, 72px)', fontWeight: 500, fontFamily: 'var(--font-serif)', lineHeight: 0.9, letterSpacing: '-0.04em' }} aria-label={`Net worth ${formatCurrency(totalNetWorth)}`}>
                  {formatCurrency(totalNetWorth)}
              </div>

              <div style={{ fontSize: '14px', marginTop: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ opacity: 0.8 }}>Investment Portfolio</span>
                  <span style={{ color: '#10B981', fontWeight: 600 }}>↗ {returnPct}% Growth</span>
              </div>
          </div>
          <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  <div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.6, marginBottom: '8px' }}>Income (MTD)</div>
                    <div style={{ fontSize: '20px', fontWeight: 500 }}>{formatCurrency(monthlyIncome)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.6, marginBottom: '8px' }}>Expenses (MTD)</div>
                    <div style={{ fontSize: '20px', fontWeight: 500, color: 'var(--color-rust)' }}>{formatCurrency(monthlyExpenses)}</div>
                  </div>
              </div>
          </div>
          {/* Decorative background element */}
          <div style={{ position: 'absolute', right: '-5%', bottom: '-10%', width: '40%', height: '80%', background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)', opacity: 0.1, pointerEvents: 'none' }} />
      </div>

      {/* AI Finance Summary Card */}
      {(aiSummaryLoading || aiSummary) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: aiSummary?.sentiment === 'positive'
              ? 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 100%)'
              : aiSummary?.sentiment === 'warning'
              ? 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.02) 100%)'
              : 'var(--color-surface)',
            border: `1px solid ${aiSummary?.sentiment === 'positive' ? 'rgba(16,185,129,0.2)' : aiSummary?.sentiment === 'warning' ? 'rgba(245,158,11,0.2)' : 'var(--color-border)'}`,
            borderRadius: '20px',
            padding: '28px 32px',
            marginBottom: '32px',
          }}
        >
          {aiSummaryLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[180, 300, 220].map((w, i) => (
                <div key={i} style={{ height: '14px', background: 'var(--color-border)', borderRadius: '8px', width: `${w}px`, opacity: 0.5 }} />
              ))}
            </div>
          ) : (
            <div>
              {aiSummary?.aiStatus && aiSummary.aiStatus !== 'success' && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 14px', borderRadius: '8px', marginBottom: '16px',
                  background: 'var(--color-warning-dim)',
                  border: '1px solid rgba(245,158,11,0.2)'
                }}>
                  <span style={{ fontSize: '14px' }}>⚠</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-warning)', fontWeight: 500 }}>
                    {aiSummary.aiStatus === 'limit_reached'
                      ? 'AI limit reached. Showing statistical fallback summary.'
                      : 'API key expired. Showing statistical fallback summary.'}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: aiSummary?.sentiment === 'positive' ? '#10B981' : aiSummary?.sentiment === 'warning' ? '#F59E0B' : 'var(--color-text-2)', background: aiSummary?.sentiment === 'positive' ? 'rgba(16,185,129,0.12)' : aiSummary?.sentiment === 'warning' ? 'rgba(245,158,11,0.12)' : 'var(--color-elevated)', border: '1px solid var(--color-border)', padding: '4px 10px', borderRadius: '99px' }}>
                  {aiSummary?.sentiment === 'positive' ? 'AI Insight' : aiSummary?.sentiment === 'warning' ? 'AI Alert' : 'AI Summary'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-2)', fontFamily: 'var(--font-mono)' }}>30-day analysis</div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-1)', marginBottom: '10px', fontFamily: 'var(--font-serif)', lineHeight: 1.4, overflowWrap: 'anywhere' }}>
                {sanitizeAiText(aiSummary?.headline)}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-2)', marginBottom: '16px', lineHeight: 1.65, overflowWrap: 'anywhere', whiteSpace: 'normal' }}>
                {sanitizeAiText(aiSummary?.summary)}
              </p>
              {aiSummary?.recommendations?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {aiSummary.recommendations.map((rec, i) => (
                    <div key={i} style={{ fontSize: '12px', padding: '5px 12px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '99px', color: 'var(--color-text-2)', fontWeight: 500 }}>
                      → {rec}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* 6-Stat Hero Strip - BREAKTHROUGH UPGRADE */}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Freedom Velocity', val: `${savingsRate}%`, trend: fiTrendLabel, icon: <Zap size={14} />, color: '#10B981', detail: 'Efficiency' },
          { label: 'Monthly Burn', val: formatCurrency(monthlyExpenses), trend: 'Fixed + variable', icon: <Flame size={14} />, color: 'var(--color-rust)', detail: 'Maintenance' },
          { label: 'Capital Surplus', val: surplusLabel, trend: 'Net inflow', icon: <Activity size={14} />, color: '#3B82F6', detail: 'Momentum' },
          { label: 'Liquid Runway', val: monthlyExpenses > 0 ? `${Math.round(totalBalance / monthlyExpenses)} mo` : '—', trend: 'Emergency', icon: <Timer size={14} />, color: '#F59E0B', detail: 'Survival' },
          { label: 'Wealth Delta', val: formatCurrency(totalReturns), trend: 'Portfolio gain', icon: <TrendingUp size={14} />, color: '#8B5CF6', detail: 'Alpha' },
          { label: 'Yield Pct', val: `${returnPct}%`, trend: 'ROI (total)', icon: <PieChart size={14} />, color: '#EC4899', detail: 'Allocation' }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="nordic-card" 
            style={{ 
              padding: '20px', 
              position: 'relative', 
              overflow: 'hidden',
              background: 'var(--color-elevated)',
              border: '1px solid var(--color-border)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ color: stat.color, background: `${stat.color}15`, padding: '6px', borderRadius: '8px', display: 'flex' }}>{stat.icon}</div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-1)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginBottom: '4px', letterSpacing: '-0.02em', color: 'var(--color-text-1)' }}>
              {stat.val}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-2)', fontWeight: 600 }}>{stat.trend}</div>
              <div style={{ fontSize: '10px', color: stat.color, fontWeight: 800, textTransform: 'uppercase' }}>{stat.detail}</div>
            </div>
            {/* Progress Indicator */}
            <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', marginTop: '12px', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                style={{ height: '100%', background: stat.color, opacity: 0.3 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        {financeChecks.map((check) => (
          <div key={check.label} style={{
            background: 'var(--color-surface)',
            border: `1px solid ${check.ok ? 'rgba(16,185,129,0.24)' : 'rgba(226,114,91,0.32)'}`,
            borderRadius: '16px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '18px'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{check.label}</div>
              <div style={{ fontSize: '18px', color: 'var(--color-text-1)', fontWeight: 800, marginTop: '6px' }}>{check.value}</div>
              {!check.ok && <div style={{ fontSize: '11px', color: 'var(--color-rust)', marginTop: '6px', lineHeight: 1.4, overflowWrap: 'anywhere' }}>{check.fix}</div>}
            </div>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: check.ok ? 'rgba(16,185,129,0.12)' : 'rgba(226,114,91,0.12)',
              color: check.ok ? '#10B981' : 'var(--color-rust)'
            }}>
              {check.ok ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row - The "Breakthrough" Portal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
        {/* Wealth Velocity Chart */}
        <div style={{ 
          padding: '32px', 
          background: 'var(--glass-bg)', 
          border: '1px solid var(--color-border)', 
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', fontFamily: 'var(--font-serif)' }}>Wealth Velocity</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-2)', margin: 0 }}>Projected trajectory based on current savings rate.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981' }}>{savingsRate}%</div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-3)' }}>Savings Efficiency</div>
            </div>
          </div>
          
          <div style={{ height: '320px', paddingBottom: '8px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 4, bottom: 8 }}>
                <defs>
                  <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.28}/>
                    <stop offset="95%" stopColor="#ff6b35" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="var(--color-border)" strokeOpacity={0.45} />
                <XAxis dataKey="name" stroke="var(--color-text-3)" fontSize={12} tickLine={false} axisLine={false} dy={6} />
                <YAxis
                  stroke="var(--color-text-3)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  tickFormatter={(v) => (v >= 100000 ? `${Math.round(v / 1000)}k` : String(v))}
                />
                <Tooltip 
                  contentStyle={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px' }}
                  formatter={(val) => [formatCurrency(val), 'Net worth path']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ff6b35" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#velocityGrad)"
                  animationDuration={1200}
                  dot={{ r: 3, fill: '#ff6b35', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Independence Card */}
        <div style={{ 
          padding: '32px', 
          background: 'var(--color-card-dark-green)', 
          borderRadius: '24px', 
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.7, marginBottom: '24px' }}>Freedom Projection</div>
            <h2 style={{ fontSize: '42px', fontWeight: 700, margin: '0 0 16px 0', fontFamily: 'var(--font-serif)' }}>{fiHeadline}</h2>
            <p style={{ fontSize: '14px', lineHeight: 1.6, opacity: 0.8, maxWidth: '280px' }}>
              {fiYears == null
                ? 'Log income and expenses to project your path to financial freedom.'
                : fiYears === 0
                  ? 'Your current net worth meets the 25× annual expense target.'
                  : <>At your current velocity, you will achieve total financial freedom by <b>{fiTargetYear}</b>.</>}
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '12px' }}>
                <span>Progress to Goal (25× annual burn)</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2 }}
                  style={{ height: '100%', background: '#10B981' }}
                />
              </div>
              {monthlyExpenses <= 0 && (
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 10 }}>Needs expense history to compute FI target.</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => onReviewAnalytics?.()}
              style={{
              width: '100%',
              padding: '16px',
              background: 'white',
              color: 'var(--color-card-dark-green)',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}>
              Review Analytics
            </button>
          </div>

          {/* Decorative background logo */}
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.05 }}>
            <TrendingUp size={200} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FinanceOverview;
