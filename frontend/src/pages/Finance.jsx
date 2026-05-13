import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../hooks/useAuth';
import supabase from '../utils/supabase';

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

      // REAL DATA INJECTION FROM CSV
      const realData = [
        { id: 'real-1', date: '2026-05-12', description: 'Transport Expenses', category: 'Transport', amount: 2493.05, type: 'expense' },
        { id: 'real-2', date: '2026-05-12', description: 'Other Expenses', category: 'Other', amount: 1763.00, type: 'expense' },
        { id: 'real-3', date: '2026-05-11', description: 'Food & Dining', category: 'Food', amount: 480.00, type: 'expense' },
        { id: 'real-4', date: '2026-05-10', description: 'Utilities Payment', category: 'Utilities', amount: 235.00, type: 'expense' },
        { id: 'real-5', date: '2026-05-09', description: 'Health & Wellness', category: 'Health', amount: 140.00, type: 'expense' },
      ];

      setTransactions([...realData, ...(transRes.data || [])]);
      setAssets(assetsRes.data || []);
      setAccounts(accountsRes.data || []);
      
      // Sync budgets with real categories
      const realBudgets = [
        { id: 'b-1', amount: 5000, money_categories: { name: 'Transport' }, category_id: 'cat-1' },
        { id: 'b-2', amount: 3000, money_categories: { name: 'Other' }, category_id: 'cat-2' },
        { id: 'b-3', amount: 2000, money_categories: { name: 'Food' }, category_id: 'cat-3' },
      ];
      setBudgets([...realBudgets, ...(budgetsRes.data || [])]);
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

  const monthStr = new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <div style={{ paddingBottom: '80px' }}>

      {/* Header */}
      <header style={{ marginBottom: '32px' }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--color-text-3)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '8px',
          fontFamily: 'var(--font-sans)',
        }}>
          Finance · {monthStr}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{
            font: 'var(--text-hero)',
            color: 'var(--color-text-1)',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Watch the curve.
          </h1>
          <button style={{
            background: 'var(--color-accent)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.01em',
            transition: 'opacity 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            + Add Transaction
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '32px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {['OVERVIEW', 'ACCOUNTS', 'TRANSACTIONS', 'BUDGETS', 'WEALTH'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 20px',
              fontSize: '13px',
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--color-text-1)' : 'var(--color-text-3)',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--color-text-1)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              marginBottom: '-1px',
            }}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
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
                    <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Portfolio Allocation</h3>
                    <div style={{ height: '200px', width: '200px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Mutual Funds', value: assetBreakdown.mutual_fund },
                              { name: 'Gold', value: assetBreakdown.gold },
                              { name: 'Equity', value: assetBreakdown.stock },
                              { name: 'Bank', value: assetBreakdown.bank },
                              { name: 'Cash', value: assetBreakdown.cash + assetBreakdown.crypto },
                            ]}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {['#10B981', '#D4AF37', '#8B5CF6', '#3B82F6', '#059669'].map((col, i) => (
                              <Cell key={i} fill={col} stroke="none" />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
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
                              <div style={{ fontSize: '10px', color: item.trend.startsWith('+') ? '#10B981' : 'var(--text-3)', fontWeight: 700 }}>{item.trend}</div>
                            </div>
                          </div>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div className="nordic-card" style={{ padding: '32px', height: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>Net Worth Projection</h3>
                    </div>
                    <ResponsiveContainer width="100%" height="80%">
                      <AreaChart data={[
                        { name: 'Jan', value: totalNetWorth * 0.8 },
                        { name: 'Feb', value: totalNetWorth * 0.85 },
                        { name: 'Mar', value: totalNetWorth * 0.92 },
                        { name: 'Apr', value: totalNetWorth },
                        { name: 'May', value: totalNetWorth * 1.05 },
                        { name: 'Jun', value: totalNetWorth * 1.15 },
                      ]}>
                        <defs>
                          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="var(--color-accent)" fillOpacity={1} fill="url(#colorVal)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="nordic-card" style={{ 
                    padding: '32px', 
                    background: 'var(--color-card-dark-green)', 
                    color: 'white', 
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px', opacity: 0.8 }}>Strategic Insight</h3>
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
                            <span style={{ color: 'var(--accent)' }}>●</span> Move excess cash to Liquid Funds
                          </li>
                        </ul>
                      </div>
                    </div>
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
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .nordic-card:hover {
          border-color: var(--color-border-lit);
        }
        .asset-row:hover {
          transform: translateX(4px);
          transition: transform 0.2s ease;
        }
        .table-row-hover:hover {
          background: var(--color-elevated);
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Finance;
