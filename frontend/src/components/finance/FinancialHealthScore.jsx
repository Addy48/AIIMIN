import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from 'recharts';
import AnimatedNumber from '../ui/AnimatedNumber';
import { computeFinancialHealthScore } from '../../utils/financeExport';

const GRADE_COLORS = {
  A: '#10B981', B: '#2563EB', C: '#F59E0B', D: '#EF4444', F: '#6B7280',
};

function scoreGrade(score) {
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}

/**
 * Financial Health Score — emergency fund, savings rate, budget adherence, DTI.
 */
export default function FinancialHealthScore({
  totalBalance = 0,
  monthlyIncome = 0,
  monthlyExpenses = 0,
  budgets = [],
  transactions = [],
  serverScore = null,
}) {
  const computed = useMemo(
    () => computeFinancialHealthScore({ totalBalance, monthlyIncome, monthlyExpenses, budgets, transactions }),
    [totalBalance, monthlyIncome, monthlyExpenses, budgets, transactions]
  );

  const health = serverScore || computed;
  const grade = scoreGrade(health.score);
  const gradeColor = GRADE_COLORS[grade];

  const radarData = [
    { metric: 'Emergency\nFund', value: Math.min(100, health.emergencyFundPct || 0), fullMark: 100 },
    { metric: 'Savings\nRate', value: Math.min(100, (health.savingsRate || 0) * 2), fullMark: 100 },
    { metric: 'Budget\nAdherence', value: health.budgetAdherence || 0, fullMark: 100 },
    { metric: 'Low\nDebt', value: Math.max(0, 100 - (health.debtToIncome || 0) * 2), fullMark: 100 },
  ];

  const tips = [];
  if ((health.emergencyFundPct || 0) < 50) tips.push(`Build emergency fund — ${health.emergencyMonths || 0} months runway (target 6).`);
  if ((health.savingsRate || 0) < 20) tips.push('Aim for 20%+ savings rate this month.');
  if ((health.budgetAdherence || 0) < 80 && budgets.length > 0) tips.push('Some budget categories are overspending.');
  if ((health.debtToIncome || 0) > 20) tips.push('Expenses exceed income — review discretionary spend.');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '28px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)',
        borderRadius: '24px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'center',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Shield size={20} style={{ color: gradeColor }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)' }}>Financial Health Score</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '12px' }}>
          <div className="score-highlight" style={{ fontSize: '56px', fontWeight: 900, color: gradeColor, lineHeight: 1, fontFamily: 'var(--font-mono)' }}>
            <AnimatedNumber value={health.score} duration={0.7} />
          </div>
          <div style={{
            fontSize: '24px', fontWeight: 900, color: gradeColor,
            padding: '4px 12px', borderRadius: '8px',
            border: `2px solid ${gradeColor}`, background: `color-mix(in srgb, ${gradeColor} 12%, transparent)`,
          }}>
            {grade}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          {[
            { label: 'Emergency', val: `${health.emergencyMonths || 0}mo` },
            { label: 'Savings', val: `${health.savingsRate || 0}%` },
            { label: 'Budget OK', val: `${health.budgetAdherence || 0}%` },
            { label: 'Debt/Inc', val: `${health.debtToIncome || 0}%` },
          ].map(({ label, val }) => (
            <div key={label} style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-3)' }}>{label}</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-1)', fontFamily: 'var(--font-mono)' }}>{val}</div>
            </div>
          ))}
        </div>

        {tips.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {tips.slice(0, 2).map((tip) => (
              <div key={tip} style={{ fontSize: '11px', color: 'var(--color-text-2)', display: 'flex', gap: '6px', lineHeight: 1.4 }}>
                <Heart size={12} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: 2 }} />
                {tip}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="var(--color-border)" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: 'var(--color-text-3)', fontWeight: 600 }} />
            <Tooltip
              contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
              formatter={(v) => [`${Math.round(v)}/100`, '']}
            />
            <Radar name="Health" dataKey="value" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
