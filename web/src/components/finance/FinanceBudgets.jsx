import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const FinanceBudgets = ({
  budgetProgress = [],
  formatCurrency,
  setBudgetModalOpen,
}) => {
  const rows = Array.isArray(budgetProgress) ? budgetProgress : [];

  return (
    <motion.div key="budgets" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--color-text-1)' }}>Capital Allocation (MTD)</h3>
        <button
          type="button"
          onClick={() => setBudgetModalOpen?.(true)}
          style={{ background: 'var(--color-accent)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <Plus size={14} /> Define Allocation
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {rows.map((b, idx) => {
          const spent = Number(b.spent) || 0;
          const limit = Number(b.limit ?? b.amount) || 0;
          const percentage = Number.isFinite(Number(b.percentage))
            ? Number(b.percentage)
            : (limit > 0 ? (spent / limit) * 100 : 0);
          const remaining = limit - spent;
          const label = b.category || b.category_name || b.name || `Budget ${idx + 1}`;
          const over = percentage > 100;
          return (
            <div key={b.id || label} className="nordic-card" style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: 12 }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-1)', marginBottom: '4px' }}>{label}</div>
                  <div style={{ fontSize: '11px', color: over ? 'var(--color-rust)' : 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    {over ? 'Over budget' : 'On track'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text-1)' }}>{formatCurrency(spent)}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>of {formatCurrency(limit)}</div>
                </div>
              </div>
              <div style={{ height: '8px', background: 'var(--color-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                  transition={{ duration: 0.8 }}
                  style={{ height: '100%', background: over ? 'var(--color-rust)' : percentage > 85 ? '#F59E0B' : '#10B981', borderRadius: '4px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-3)' }}>
                <span>{percentage.toFixed(1)}% consumed</span>
                <span>{formatCurrency(remaining)} remaining</span>
              </div>
            </div>
          );
        })}
        {rows.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center', color: 'var(--color-text-3)', background: 'var(--color-elevated)', borderRadius: '24px', border: '1px dashed var(--color-border)' }}>
            No capital allocations defined for this period.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FinanceBudgets;
