import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const Finance = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW | ACCOUNTS | TRANSACTIONS | BUDGETS | WEALTH
  const [transactions, setTransactions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadFinanceData();
  }, [user]);

  const loadFinanceData = async () => {
    setLoading(true);
    try {
      const [transRes, assetsRes, accountsRes, budgetsRes] = await Promise.all([
        supabase.from('money_transactions').select('*').order('date', { ascending: false }),
        supabase.from('wealth_assets').select('*').order('current_value', { ascending: false }),
        supabase.from('accounts').select('*').order('balance', { ascending: false }),
        supabase.from('budgets').select('*, money_categories(name)').order('amount', { ascending: false })
      ]);
      setTransactions(transRes.data || []);
      setAssets(assetsRes.data || []);
      setAccounts(accountsRes.data || []);
      setBudgets(budgetsRes.data || []);
    } catch (error) {
      console.error("Finance data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const totalNetWorth = useMemo(() => {
    const assetTotal = assets.reduce((sum, a) => sum + Number(a.current_value), 0);
    const accountTotal = accounts.reduce((sum, a) => sum + Number(a.balance), 0);
    return assetTotal + accountTotal;
  }, [assets, accounts]);
  
  const totalInvested = useMemo(() => assets.reduce((sum, a) => sum + Number(a.invested_value), 0), [assets]);
  const totalReturns = totalNetWorth - totalInvested;
  const returnPct = totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : 0;

  // Monthly breakdown
  const monthlyExpenses = useMemo(() => transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + Number(t.amount), 0), [transactions]);

  const monthlyIncome = useMemo(() => transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + Number(t.amount), 0), [transactions]);

  // Budget calculations
  const budgetProgress = useMemo(() => budgets.map(b => {
    const spent = transactions
      .filter(t => t.category_id === b.category_id && t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { ...b, spent, pct: (spent / b.amount) * 100 };
  }), [budgets, transactions]);

  // Asset Breakdown for Wealth Tab
  const assetBreakdown = useMemo(() => {
    const breakdown = {
      gold: 0,
      stock: 0,
      mutual_fund: 0,
      crypto: 0,
      cash: 0,
      bank: accounts.reduce((sum, a) => sum + Number(a.balance), 0)
    };
    assets.forEach(a => {
      const type = a.asset_type.toLowerCase().replace(' ', '_');
      if (breakdown.hasOwnProperty(type)) breakdown[type] += Number(a.current_value);
      else breakdown.stock += Number(a.current_value); // Default to stock if unknown
    });
    return breakdown;
  }, [assets, accounts]);

  if (!user) return null;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);

  return (
    <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', padding: '0 var(--content-pad)', paddingBottom: 'var(--space-9)' }}>
      
      {/* Header - Nordic Calm Aesthetic */}
      <header style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: 700, 
          color: 'var(--text-3)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.15em', 
          marginBottom: '8px' 
        }}>
          FINANCE HUB · {new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '56px', 
            fontWeight: 400, 
            color: 'var(--color-hero)', 
            lineHeight: '1',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Watch the curve.
          </h1>
          <button style={{
            background: 'var(--color-accent)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            boxShadow: '0 4px 12px var(--color-accent-glow)'
          }}
          onMouseEnter={(e) => e.target.style.opacity = 0.9}
          onMouseLeave={(e) => e.target.style.opacity = 1}
          >
            + New Transaction
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '40px', 
        borderBottom: '1px solid var(--border)', 
        marginBottom: 'var(--space-8)',
        paddingBottom: '2px',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {['OVERVIEW', 'ACCOUNTS', 'TRANSACTIONS', 'BUDGETS', 'WEALTH'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '16px 0',
              fontSize: '11px',
              fontWeight: 700,
              color: activeTab === tab ? 'var(--text-1)' : 'var(--text-3)',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              marginBottom: '-1px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><div className="spinner" /></div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'OVERVIEW' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
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
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.7, marginBottom: '16px' }}>Total Net Worth</div>
                      <div style={{ fontSize: '72px', fontWeight: 500, fontFamily: 'var(--font-serif)', lineHeight: 0.9 }}>
                          {formatCurrency(totalNetWorth).replace('₹', '₹ ')}
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
                  <div style={{ position: 'absolute', right: '-5%', bottom: '-10%', width: '40%', height: '80%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
              </div>

              {/* Main Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                  <div className="nordic-card" style={{ padding: '32px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>Liquid Assets</div>
                    <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>{formatCurrency(accounts.reduce((sum, a) => sum + Number(a.balance), 0))}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-2)' }}>Across {accounts.length} linked accounts</div>
                  </div>
                  <div className="nordic-card" style={{ padding: '32px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>Invested Capital</div>
                    <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>{formatCurrency(totalInvested)}</div>
                    <div style={{ fontSize: '11px', color: '#10B981' }}>+ {formatCurrency(totalReturns)} Unrealized P/L</div>
                  </div>
                  <div className="nordic-card" style={{ padding: '32px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>Burn Rate</div>
                    <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>{formatCurrency(monthlyExpenses / (new Date().getDate()))}<span style={{ fontSize: '14px', opacity: 0.6 }}>/day</span></div>
                    <div style={{ fontSize: '11px', color: 'var(--text-2)' }}>Tracking against {budgets.length} budgets</div>
                  </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'TRANSACTIONS' && (
            <motion.div key="transactions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="nordic-card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '20px 24px', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.1em' }}>Date</th>
                      <th style={{ padding: '20px 24px', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.1em' }}>Description</th>
                      <th style={{ padding: '20px 24px', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.1em' }}>Category</th>
                      <th style={{ padding: '20px 24px', fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.1em', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                        <td style={{ padding: '20px 24px', fontSize: '13px', color: 'var(--text-2)' }}>{new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                        <td style={{ padding: '20px 24px', fontSize: '14px', fontWeight: 500 }}>{t.description || 'General Transaction'}</td>
                        <td style={{ padding: '20px 24px' }}>
                          <span className="vercel-badge" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>{t.category}</span>
                        </td>
                        <td style={{ padding: '20px 24px', fontSize: '14px', textAlign: 'right', fontWeight: 600, color: t.type === 'expense' ? 'var(--color-rust)' : '#10B981' }}>
                          {t.type === 'expense' ? '-' : '+'} {formatCurrency(t.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'BUDGETS' && (
            <motion.div key="budgets" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
                {budgetProgress.map(bp => (
                  <div key={bp.id} className="nordic-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'flex-end' }}>
                      <div>
                        <h3 style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{bp.money_categories?.name}</h3>
                        <div style={{ fontSize: '24px', fontFamily: 'var(--font-serif)' }}>{formatCurrency(bp.spent)}</div>
                      </div>
                      <div style={{ fontSize: '12px', color: bp.pct > 100 ? 'var(--color-rust)' : 'var(--text-3)', fontWeight: 600 }}>
                        Target: {formatCurrency(bp.amount)}
                      </div>
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${Math.min(bp.pct, 100)}%` }} 
                        style={{ height: '100%', background: bp.pct > 90 ? 'var(--color-rust)' : 'var(--accent)', borderRadius: '2px' }} 
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{bp.pct.toFixed(0)}% consumed</span>
                        {bp.pct > 100 && <span style={{ fontSize: '10px', color: 'var(--color-rust)', fontWeight: 700, textTransform: 'uppercase' }}>Over Budget</span>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'WEALTH' && (
            <motion.div key="wealth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Wealth Header Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <div className="nordic-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-elevated)' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Portfolio Value</div>
                  <div style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{formatCurrency(totalNetWorth - assetBreakdown.bank - assetBreakdown.cash)}</div>
                </div>
                <div className="nordic-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-elevated)' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Liquid Cash</div>
                  <div style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{formatCurrency(assetBreakdown.bank + assetBreakdown.cash)}</div>
                </div>
                <div className="nordic-card" style={{ padding: '24px', textAlign: 'center', border: '1px solid #10B981' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Total Returns</div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#10B981', fontFamily: 'var(--font-serif)' }}>+ {formatCurrency(totalReturns)}</div>
                </div>
                <div className="nordic-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-elevated)' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Health Score</div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--font-serif)' }}>82/100</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
                {/* Detailed Asset Breakdown */}
                <div className="nordic-card" style={{ padding: '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Asset Allocation</h3>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target: 60% Equity / 40% Safe</div>
                  </div>
                  
                  <div style={{ display: 'grid', gap: '32px' }}>
                    {[
                      { label: 'Mutual Funds', value: assetBreakdown.mutual_fund, icon: '📈', color: '#10B981', trend: '+12.4%', desc: 'Long-term wealth generation' },
                      { label: 'Gold Assets', value: assetBreakdown.gold, icon: '✨', color: '#D4AF37', trend: '+8.2%', desc: 'Hedge against inflation' },
                      { label: 'Equity / Stocks', value: assetBreakdown.stock, icon: '📊', color: '#8B5CF6', trend: '+15.1%', desc: 'High growth potential' },
                      { label: 'Bank Balance', value: assetBreakdown.bank, icon: '🏦', color: '#3B82F6', trend: 'Stable', desc: 'Emergency liquidity' },
                      { label: 'Cash & Others', value: assetBreakdown.cash + assetBreakdown.crypto, icon: '💵', color: '#059669', trend: 'Variable', desc: 'Daily operations & specs' },
                    ].map((item, idx) => (
                      <div key={idx} className="asset-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
                        <div style={{ 
                          width: '56px', 
                          height: '56px', 
                          borderRadius: '16px', 
                          background: `${item.color}15`, 
                          color: item.color,
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '24px',
                          border: `1px solid ${item.color}30`
                        }}>
                          {item.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-1)' }}>{item.label}</span>
                              <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{item.desc}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{formatCurrency(item.value)}</div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '12px', marginBottom: '2px' }}>
                                  {[3, 5, 4, 7, 6, 8, 9].map((h, i) => (
                                    <div key={i} style={{ width: '2px', height: `${h * 10}%`, background: item.trend.startsWith('+') ? '#10B981' : 'var(--text-3)', opacity: 0.5 }} />
                                  ))}
                                </div>
                                <div style={{ fontSize: '10px', color: item.trend.startsWith('+') ? '#10B981' : 'var(--text-3)', fontWeight: 700 }}>{item.trend}</div>
                              </div>
                            </div>
                          </div>
                          {/* Mini Progress Bar */}
                          <div style={{ height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden', marginTop: '12px' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.value / totalNetWorth) * 100}%` }}
                              style={{ height: '100%', background: item.color, borderRadius: '3px' }}
                              transition={{ duration: 1, delay: idx * 0.1 }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Strategy & Growth */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Wealth Trend Sparkline Card */}
                  <div className="nordic-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>30D Net Worth Trend</h3>
                      <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>↗ 4.2%</span>
                    </div>
                    <div style={{ height: '80px', display: 'flex', alignItems: 'flex-end', gap: '4px', padding: '0 4px' }}>
                      {[40, 45, 42, 48, 55, 52, 58, 62, 60, 65, 70, 68, 75, 82, 85, 80, 88, 92, 95, 90, 98, 100].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.02, duration: 0.5 }}
                          style={{ 
                            flex: 1, 
                            background: i === 21 ? 'var(--accent)' : 'var(--accent-dim)', 
                            borderRadius: '2px 2px 0 0',
                            opacity: 0.3 + (h / 150)
                          }} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Freshman Strategy Card */}
                  <div className="nordic-card" style={{ 
                    padding: '32px', 
                    background: 'var(--color-card-dark-green)', 
                    color: 'white', 
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px', opacity: 0.8 }}>Strategic Insight · Age 23</h3>
                      <div style={{ fontSize: '18px', fontFamily: 'var(--font-serif)', lineHeight: '1.5', marginBottom: '24px' }}>
                        "Your current savings rate is <b>32%</b>. Increasing this to 40% will shorten your financial freedom timeline by <b>4.5 years</b>."
                      </div>
                      
                      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '12px', opacity: 0.6 }}>Next Action Items</div>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <li style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                            <span style={{ color: 'var(--accent)' }}>●</span> Start a recurring SIP for Gold (min ₹5k)
                          </li>
                          <li style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                            <span style={{ color: 'var(--accent)' }}>●</span> Maximize 80C benefits before March
                          </li>
                          <li style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                            <span style={{ color: 'var(--accent)' }}>●</span> Move excess cash to Liquid Funds
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* Decorative element */}
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--accent)', filter: 'blur(60px)', opacity: 0.3 }} />
                  </div>

                  {/* Diversification Score */}
                  <div className="nordic-card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>Diversification</h3>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#10B981' }}>OPTIMAL</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', height: '40px', marginBottom: '24px' }}>
                      <div style={{ flex: (assetBreakdown.stock / totalNetWorth) * 10, background: '#8B5CF6', borderRadius: '4px' }} title="Stocks" />
                      <div style={{ flex: (assetBreakdown.mutual_fund / totalNetWorth) * 10, background: '#10B981', borderRadius: '4px' }} title="MF" />
                      <div style={{ flex: (assetBreakdown.gold / totalNetWorth) * 10, background: '#D4AF37', borderRadius: '4px' }} title="Gold" />
                      <div style={{ flex: (assetBreakdown.bank / totalNetWorth) * 10, background: '#3B82F6', borderRadius: '4px' }} title="Cash" />
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: '1.6', margin: 0 }}>
                      Your portfolio has a strong bias towards <b>Equity ({((assetBreakdown.stock + assetBreakdown.mutual_fund) / totalNetWorth * 100).toFixed(0)}%)</b>, which is ideal for your age group to maximize compounding.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Growth Engine Footer */}
      <footer style={{ marginTop: 'var(--space-9)', padding: '48px', background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '16px' }}>
          AIIMIN CAPITAL ENGINE · VERSION 2.0
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-2)', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
          "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it."
        </div>
      </footer>

      <style>{`
        .nordic-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          overflow: hidden;
        }
        .nordic-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent);
          box-shadow: 0 12px 24px rgba(0,0,0,0.04);
        }
        .asset-row:hover {
          transform: translateX(8px);
          transition: transform 0.3s ease;
        }
        .table-row-hover:hover {
          background: var(--bg-elevated);
        }
        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        /* Custom scrollbar for tabs */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Finance;
