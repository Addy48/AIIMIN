import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, X } from 'lucide-react';

const FinanceAccounts = ({ 
  accounts, formatCurrency, totalBalance, 
  setAccountModalOpen, setNewAccount, handleDeleteAccount 
}) => {
  return (
    <motion.div key="accounts" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}>
      <div style={{ marginBottom: '32px', padding: '32px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: '8px' }}>Total Liquid Balance</div>
          <div style={{ fontSize: '48px', fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.03em' }}>{formatCurrency(totalBalance)}</div>
        </div>
        <button onClick={() => setAccountModalOpen(true)} style={{ background: 'var(--color-accent)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
          <Plus size={16} /> Add Account
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {accounts.map(acc => (
          <div 
            key={acc.id} 
            style={{ 
              padding: '32px', 
              background: 'var(--bg-elevated)', 
              backdropFilter: 'blur(16px)', 
              border: '1px solid var(--color-border)', 
              borderRadius: '24px', 
              transition: 'all 0.2s', 
              position: 'relative'
            }} 
            onMouseEnter={e => {e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--color-border-lit)';}} 
            onMouseLeave={e => {e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--color-border)';}}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  {acc.icon || '🏦'}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-1)' }}>{acc.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{acc.type}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => {
                    setNewAccount(acc);
                    setAccountModalOpen(true);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: '4px' }}
                >
                  <Settings size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteAccount(acc.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-rust)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px' }}>Capital Available</div>
            <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', fontWeight: 600, letterSpacing: '-0.02em' }}>{formatCurrency(acc.balance)}</div>
            
            {/* Visual bar */}
            <div style={{ height: '4px', background: 'var(--color-border)', borderRadius: '2px', marginTop: '24px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                style={{ height: '100%', background: 'var(--color-accent)', opacity: 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FinanceAccounts;
