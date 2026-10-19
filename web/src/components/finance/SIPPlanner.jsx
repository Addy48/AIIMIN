import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calculator } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import AnimatedNumber from '../ui/AnimatedNumber';
import { calculateSIPProjection } from '../../utils/financeExport';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

/**
 * SIP Planner — compound growth visualization (Thaler: present bias counter).
 */
export default function SIPPlanner() {
  const [monthly, setMonthly] = useState(5000);
  const [returnPct, setReturnPct] = useState(12);
  const [years, setYears] = useState(10);

  const projection = useMemo(
    () => calculateSIPProjection(monthly, returnPct, years),
    [monthly, returnPct, years]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '28px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)',
        borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--color-accent-dim)', color: 'var(--color-accent)' }}>
          <Calculator size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)' }}>SIP Planner</h3>
          <p style={{ fontSize: '11px', color: 'var(--color-text-3)', margin: '4px 0 0' }}>
            Systematic Investment Plan — compound growth projection
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[
          { label: 'Monthly SIP (₹)', value: monthly, set: setMonthly, min: 500, max: 100000, step: 500 },
          { label: 'Expected Return (%/yr)', value: returnPct, set: setReturnPct, min: 4, max: 20, step: 0.5 },
          { label: 'Duration (years)', value: years, set: setYears, min: 1, max: 30, step: 1 },
        ].map(({ label, value, set, min, max, step }) => (
          <div key={label}>
            <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-3)', display: 'block', marginBottom: '6px' }}>
              {label}
            </label>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => set(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-accent)' }}
            />
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-1)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              {label.includes('Return') ? `${value}%` : label.includes('years') ? `${value}y` : fmt(value)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total Invested', value: projection.invested, color: '#6B7280' },
          { label: 'Est. Corpus', value: projection.corpus, color: '#2563EB' },
          { label: 'Wealth Gained', value: projection.gains, color: '#10B981' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ padding: '14px', borderRadius: '12px', border: `1px solid ${color}33`, background: `color-mix(in srgb, ${color} 8%, transparent)` }}>
            <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '4px' }}>{label}</div>
            <div className={label === 'Est. Corpus' ? 'score-highlight' : ''} style={{ fontSize: '18px', fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>
              <AnimatedNumber value={value} duration={0.5} prefix="₹" />
            </div>
          </div>
        ))}
      </div>

      {projection.chart.length > 1 && (
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projection.chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--color-text-3)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-3)' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v) => fmt(v)}
                contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="invested" name="Invested" stroke="#6B7280" fill="#6B7280" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="corpus" name="Corpus" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-text-3)' }}>
        <TrendingUp size={12} style={{ color: '#10B981' }} />
        Assumes {returnPct}% CAGR, monthly compounding. Not financial advice.
      </div>
    </motion.div>
  );
}
