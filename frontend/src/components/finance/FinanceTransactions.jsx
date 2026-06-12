import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const FinanceTransactions = ({ 
  transactions, formatCurrency, 
  setEntryModalOpen, setNewTransaction 
}) => {
  return (
    <motion.div key="transactions" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-serif)' }}>Recent Trajectory Events</h3>
        <button onClick={() => setEntryModalOpen(true)} style={{ background: 'var(--color-accent)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Plus size={14} /> Record Event
        </button>
      </div>
      <div className="nordic-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(0,0,0,0.02)' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>Date</th>
              <th style={{ padding: '16px 24px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>Description</th>
              <th style={{ padding: '16px 24px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>Category</th>
              <th style={{ padding: '16px 24px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-3)', fontSize: '14px' }}>No events recorded in this period.</td></tr>
            ) : transactions.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>{format(parseISO(t.date), 'MMM dd, yyyy')}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 600 }}>{t.description}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '99px', color: 'var(--text-2)' }}>{t.category}</span>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '15px', fontWeight: 700, color: t.type === 'income' ? '#10B981' : 'var(--text-1)', fontFamily: 'var(--font-mono)' }}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default FinanceTransactions;
