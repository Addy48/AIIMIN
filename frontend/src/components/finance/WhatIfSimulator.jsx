import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { financeWhatIf } from '../../services/aiService';

/**
 * AI What-If simulator — scenario planning (Thaler mental accounting).
 */
export default function WhatIfSimulator({
  monthlyIncome = 0,
  totalBalance = 0,
  topExpenses = [],
  formatCurrency,
}) {
  const [scenario, setScenario] = useState('');
  const [whatIfResult, setWhatIfResult] = useState('');
  const [simulating, setSimulating] = useState(false);

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!scenario.trim()) return;
    setSimulating(true);
    setWhatIfResult('');
    try {
      const res = await financeWhatIf(scenario, {
        monthlyIncome,
        currentSavings: totalBalance,
        expenses: topExpenses.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.value }), {}),
      });
      setWhatIfResult(res);
    } catch {
      setWhatIfResult('Simulation failed. Check API keys in account settings.');
    } finally {
      setSimulating(false);
    }
  };

  const presets = [
    'Cut food delivery by 50% for 6 months',
    'Start ₹5000/month SIP for 10 years',
    'Reduce subscriptions by ₹2000/month',
  ];

  return (
    <div style={{ padding: '32px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={18} style={{ color: 'var(--color-accent)' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)' }}>AI What-If Simulator</h3>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--color-text-3)', margin: 0 }}>
          Simulate financial decisions and their compound impact.
          {formatCurrency && totalBalance > 0 && (
            <span> Current liquid: {formatCurrency(totalBalance)}.</span>
          )}
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setScenario(p)}
            style={{
              fontSize: '10px', fontWeight: 700, padding: '6px 10px', borderRadius: '8px',
              border: '1px solid var(--color-border)', background: 'var(--color-surface)',
              color: 'var(--color-text-2)', cursor: 'pointer',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <form onSubmit={handleSimulate} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="e.g. cut food delivery by 50% for 6 months"
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--color-border)',
            background: 'rgba(255,255,255,0.02)', color: 'var(--color-text-1)', fontSize: '13px', outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={simulating || !scenario.trim()}
          style={{
            background: 'var(--color-accent)', color: '#fff', border: 'none',
            padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            opacity: (!scenario.trim() || simulating) ? 0.5 : 1,
          }}
        >
          {simulating ? 'Running…' : 'Run'}
        </button>
      </form>

      {whatIfResult && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)',
            borderRadius: '12px', fontSize: '12px', color: 'var(--color-text-2)', lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
          }}
        >
          {whatIfResult}
        </motion.div>
      )}
    </div>
  );
}
