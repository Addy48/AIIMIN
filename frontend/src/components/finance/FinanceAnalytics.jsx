import React from 'react';
import { motion } from 'framer-motion';

const FinanceAnalytics = ({ 
  dailySpend, savingsRate, monthlyExpenses, monthlyIncome, 
  topExpenses, formatCurrency 
}) => {
  return (
    <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Heatmap */}
        <div className="nordic-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>Daily Spend Velocity</div>
            <div style={{ fontSize: '12px', color: 'var(--text-2)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              Intensity <div style={{ display: 'flex', gap: '2px' }}>{[0.1, 0.4, 0.7, 1].map(o => <div key={o} style={{ width: '8px', height: '8px', background: `rgba(220, 38, 38, ${o})`, borderRadius: '2px' }}/>)}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: '4px' }}>
            {dailySpend.map((d, i) => {
              const intensity = Math.min(1, d.amount / (monthlyExpenses / 15 || 1000));
              return (
                <div 
                  key={i} 
                  title={`${d.date}: ${formatCurrency(d.amount)}`}
                  style={{ 
                    aspectRatio: '1', 
                    background: `rgba(220, 38, 38, ${Math.max(0.1, intensity)})`, 
                    borderRadius: '4px',
                    cursor: 'help'
                  }} 
                />
              );
            })}
          </div>
        </div>

        {/* Savings Gauge */}
        <div className="nordic-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: '16px', alignSelf: 'flex-start' }}>Savings Rate Gauge</div>
          <div style={{ position: 'relative', width: '200px', height: '100px', overflow: 'hidden' }}>
            <div style={{ width: '200px', height: '200px', borderRadius: '50%', border: '20px solid var(--bg-elevated)', borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(-45deg)', position: 'absolute' }} />
            <motion.div 
              initial={{ rotate: -45 }}
              animate={{ rotate: -45 + (180 * (savingsRate / 100)) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ width: '200px', height: '200px', borderRadius: '50%', border: '20px solid #10B981', borderBottomColor: 'transparent', borderLeftColor: 'transparent', position: 'absolute' }} 
            />
          </div>
          <div style={{ fontSize: '48px', fontWeight: 900, fontFamily: 'var(--font-serif)', marginTop: '-20px' }}>{savingsRate}%</div>
          <div style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '8px' }}>Target: 40% | Status: {savingsRate >= 40 ? 'On Track' : 'Needs Optimization'}</div>
        </div>
      </div>

      {/* Cash Flow Waterfall */}
      <div className="nordic-card" style={{ padding: '32px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: '24px' }}>Cash Flow Waterfall (MTD)</div>
        <div style={{ display: 'flex', gap: '4px', height: '120px', alignItems: 'flex-end', paddingTop: '40px' }}>
          {/* Gross Income Bar */}
          <div style={{ flex: 1, position: 'relative', height: '100%', background: '#10B981', borderRadius: '8px' }}>
            <div style={{ position: 'absolute', top: '-28px', left: 0, width: '100%', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>{formatCurrency(monthlyIncome)}</div>
            <div style={{ position: 'absolute', bottom: '12px', left: 0, width: '100%', textAlign: 'center', fontSize: '11px', color: 'white', fontWeight: 700 }}>INCOME</div>
          </div>
          {/* Top Expenses subtracted visually */}
          {topExpenses.map((exp, i) => {
            // Height is proportional to its impact on income
            const heightPct = monthlyIncome > 0 ? (exp.value / monthlyIncome) * 100 : 0;
            return (
              <div key={i} style={{ flex: 1, position: 'relative', height: `${heightPct}%`, background: 'var(--color-rust)', borderRadius: '8px' }}>
                 <div style={{ position: 'absolute', top: '-28px', left: 0, width: '100%', textAlign: 'center', fontSize: '11px', color: 'var(--text-2)' }}>-{formatCurrency(exp.value)}</div>
                 <div style={{ position: 'absolute', bottom: '12px', left: 0, width: '100%', textAlign: 'center', fontSize: '10px', color: 'white', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 4px' }}>{exp.name}</div>
              </div>
            )
          })}
          {/* Remaining Savings Bar */}
          <div style={{ flex: 1, position: 'relative', height: `${Math.max(0, savingsRate)}%`, background: 'var(--color-accent)', borderRadius: '8px' }}>
            <div style={{ position: 'absolute', top: '-28px', left: 0, width: '100%', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>{formatCurrency(monthlyIncome - monthlyExpenses)}</div>
            <div style={{ position: 'absolute', bottom: '12px', left: 0, width: '100%', textAlign: 'center', fontSize: '11px', color: 'white', fontWeight: 700 }}>SAVED</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FinanceAnalytics;
