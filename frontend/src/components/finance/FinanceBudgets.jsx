import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const FinanceBudgets = ({ 
  budgetProgress, formatCurrency, 
  setBudgetModalOpen 
}) => {
  return (
    <motion.div key="budgets" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)' }}>Capital Allocation (MTD)</h3>
        <button onClick={() => setBudgetModalOpen(true)} style={{ background: 'var(--color-accent)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Plus size={14} /> Define Allocation
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {budgetProgress.map(b => (
          <div key={b.category} className="nordic-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>{b.category}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{b.spent > b.limit ? 'Over budget' : 'On track'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{formatCurrency(b.spent)}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>of {formatCurrency(b.limit)}</div>
              </div>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, b.percentage)}%` }}
                transition={{ duration: 1 }}
                style={{ height: '100%', background: b.percentage > 100 ? 'var(--color-rust)' : b.percentage > 85 ? '#F59E0B' : '#10B981', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-3)' }}>
              <span>{b.percentage.toFixed(1)}% Consumed</span>
              <span>{formatCurrency(b.limit - b.spent)} Remaining</span>
            </div>
          </div>
        ))}
        {budgetProgress.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '64px', textAlign: 'center', color: 'var(--text-3)', background: 'var(--bg-elevated)', borderRadius: '24px', border: '1px dashed var(--color-border)' }}>
            No capital allocations defined for this period.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FinanceBudgets;
