import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Upload, Filter, Search, Download, Calendar, ArrowUpRight, ArrowDownLeft, 
  Wallet, CreditCard, PieChart, TrendingUp, CheckCircle2, ChevronRight, X, 
  AlertCircle, FileText, Settings, HelpCircle, Activity, Heart, Flame, Timer, Zap, MapPin,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import supabase from '../utils/supabase';
import toast from '../utils/toast';
import { insertRow, getRows } from '../services/dbService';
import { EXPENSE_CATS } from '../components/money/MoneyShared';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart as RePieChart, Pie 
} from 'recharts';

// XLSX is loaded via CDN in index.html to avoid build-time dependency issues
const XLSX = typeof window !== 'undefined' ? (window.XLSX || null) : null;

const Finance = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW | ACCOUNTS | TRANSACTIONS | BUDGETS | WEALTH
  const [transactions, setTransactions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Import & Entry State
  const [importOpen, setImportOpen] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [entryType, setEntryType] = useState('expense'); // Default type for the modal
  const [importStatus, setImportStatus] = useState('idle'); // idle | processing | success | error
  const [dragActive, setDragActive] = useState(false);

  // Excel Import Logic
  const parseExcelDate = (val) => {
    if (!val) return new Date().toISOString().split('T')[0];
    if (typeof val === 'number') {
      // Excel serial date to JS date
      const date = new Date((val - 25569) * 86400 * 1000);
      return date.toISOString().split('T')[0];
    }
    // Try parsing string
    try {
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    } catch (e) {}
    return new Date().toISOString().split('T')[0];
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    if (!XLSX) {
      toast.error('Excel engine is still initializing. Please wait a moment.');
      return;
    }
    setImportStatus('processing');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Transform Excel data to transaction objects
        const newTransactions = jsonData.map((row, i) => ({
          id: `import-${Date.now()}-${i}`,
          date: parseExcelDate(row.Date || row.date || row.DATE),
          amount: Math.abs(parseFloat(row.Amount || row.amount || row.AMOUNT || 0)),
          category: row.Category || row.category || row.CATEGORY || 'Other',
          description: row.Note || row.note || row.Description || row.description || row.NOTE || '',
          type: (row.Type || row.type || row.Category || '').toLowerCase().includes('inc') ? 'income' : 'expense'
        })).filter(t => t.amount > 0);

        if (newTransactions.length === 0) throw new Error("No valid transactions found");

        setTransactions(prev => [...newTransactions, ...prev]);
        setImportStatus('success');
        setTimeout(() => {
          setImportOpen(false);
          setImportStatus('idle');
        }, 2000);
      } catch (err) {
        console.error("Excel Import Error:", err);
        setImportStatus('error');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

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

  const monthStr = new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header */}
      <header style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              marginBottom: '12px',
            }}>
              Capital Allocation · {monthStr}
            </div>
            <h1 style={{
              fontSize: '42px',
              fontWeight: 800,
              color: 'var(--color-text-1)',
              margin: 0,
              letterSpacing: '-0.03em',
              fontFamily: 'var(--font-serif)',
            }}>
              Watch the curve.
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => setImportOpen(true)}
              style={{
                background: 'var(--glass-bg)',
                color: 'var(--color-text-1)',
                border: '1px solid var(--color-border)',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--bg-elevated)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--glass-bg)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Upload size={16} /> Import Sheet
            </button>
            <button 
              onClick={() => {
                setEntryType('expense');
                setEntryOpen(true);
              }}
              style={{
                background: 'var(--color-text-1)',
                color: 'var(--color-base)',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={e => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={e => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Plus size={18} /> New Entry
            </button>
          </div>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)', margin: 0 }}>Recent Activity</h3>
                <button 
                  onClick={() => {
                    setEntryType('expense');
                    setEntryOpen(true);
                  }}
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--color-border)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-1)'
                  }}
                >
                  <Plus size={14} /> Add Transaction
                </button>
              </div>
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

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {entryOpen && (
          <div 
            onClick={() => setEntryOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '500px', background: 'var(--color-base)', borderRadius: '24px', border: '1px solid var(--color-border)',
                padding: '40px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                maxHeight: '90vh', overflowY: 'auto'
              }}
            >
              <button onClick={() => setEntryOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}>
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-text-1)', marginBottom: '32px', fontFamily: 'var(--font-serif)' }}>Record Entry</h2>

              <EntryForm 
                user={user} 
                accounts={accounts} 
                initialType={entryType}
                onSuccess={() => {
                  setEntryOpen(false);
                  loadFinanceData();
                  toast.success('Entry synchronized.');
                }} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Excel Import Modal */}
      <AnimatePresence>
        {importOpen && (
          <div 
            onClick={() => setImportOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '440px', background: 'var(--color-base)', borderRadius: '24px', border: '1px solid var(--color-border)',
                padding: '40px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.3)'
              }}
            >
              <button onClick={() => setImportOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}>
                <X size={20} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'var(--color-accent-dim)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <FileSpreadsheet size={30} />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-text-1)', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>Import Spreadsheet</h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-3)', lineHeight: 1.6 }}>Sync your 'Money Manager' transactions instantly.</p>
              </div>

              {importStatus === 'idle' && (
                <div 
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  style={{
                    height: '180px', border: `2px dashed ${dragActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    borderRadius: '16px', background: dragActive ? 'var(--color-accent-dim)' : 'var(--bg-elevated)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                  onClick={() => document.getElementById('excel-input').click()}
                >
                  <input id="excel-input" type="file" accept=".xlsx,.xls,.csv" onChange={e => handleFileUpload(e.target.files[0])} style={{ display: 'none' }} />
                  <Upload size={28} style={{ color: 'var(--color-text-3)', marginBottom: '12px', opacity: 0.5 }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-2)' }}>Drop file or <span style={{ color: 'var(--color-accent)' }}>browse</span></span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-3)', marginTop: '6px' }}>Excel or CSV formats supported</span>
                </div>
              )}

              {importStatus === 'processing' && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div className="spinner" style={{ margin: '0 auto 24px' }} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-1)' }}>Parsing spreadsheet...</span>
                </div>
              )}

              {importStatus === 'success' && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#10B981' }}>
                  <CheckCircle2 size={44} style={{ margin: '0 auto 16px' }} />
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>Sync Complete</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginTop: '6px' }}>Your portfolio is up to date.</div>
                </div>
              )}

              {importStatus === 'error' && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-rust)' }}>
                  <AlertCircle size={44} style={{ margin: '0 auto 16px' }} />
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>Sync Error</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginTop: '6px' }}>Could not read file. Check the format.</div>
                  <button onClick={() => setImportStatus('idle')} style={{ marginTop: '20px', background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-text-1)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Try Again</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

const EntryForm = ({ user, accounts, initialType, onSuccess }) => {
  const [type, setType] = useState(initialType || 'expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState('');
  const [targetAccountId, setTargetAccountId] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync default account when accounts load
  useEffect(() => {
    if (accounts?.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [accounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) {
      toast.error('Valid amount required.');
      return;
    }
    setSaving(true);

    const hourIST = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false });

    try {
      if (type === 'transfer') {
        if (!accountId || !targetAccountId) {
          toast.error('Source and target accounts required.');
          setSaving(false);
          return;
        }
        
        const transferAmt = Math.abs(parseFloat(amount));
        const refNote = note.trim() || 'Internal Transfer';

        // Log outflow from source
        await insertRow('money_transactions', {
          user_id: user.id,
          date: date,
          category: 'Transfer',
          description: `To: ${accounts.find(a => a.id === targetAccountId)?.name} — ${refNote}`,
          amount: -transferAmt,
          source: 'manual',
          currency: 'INR',
          type: 'transfer',
          account_id: accountId,
          time_of_day: hourIST,
        });

        // Log inflow to target
        await insertRow('money_transactions', {
          user_id: user.id,
          date: date,
          category: 'Transfer',
          description: `From: ${accounts.find(a => a.id === accountId)?.name} — ${refNote}`,
          amount: transferAmt,
          source: 'manual',
          currency: 'INR',
          type: 'transfer',
          account_id: targetAccountId,
          time_of_day: hourIST,
        });
      } else {
        let finalAmount = parseFloat(amount);
        if (type === 'expense') finalAmount = -Math.abs(finalAmount);
        else finalAmount = Math.abs(finalAmount);

        await insertRow('money_transactions', {
          user_id: user.id,
          date: date,
          category: category || (type === 'income' ? 'Income' : 'Other'),
          description: note.trim() || null,
          amount: finalAmount,
          source: 'manual',
          currency: 'INR',
          type: type,
          account_id: accountId || null,
          time_of_day: hourIST,
        });
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Synchronization failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Type Toggle */}
      <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: '12px', padding: '4px', border: '1px solid var(--color-border)' }}>
        {['expense', 'income', 'transfer'].map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            style={{
              flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
              background: type === t ? 'var(--color-text-1)' : 'transparent',
              color: type === t ? 'var(--color-base)' : 'var(--color-text-3)',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Amount and Date row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '8px' }}>Amount (INR)</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', opacity: 0.3 }}>₹</span>
            <input 
              type="number" step="0.01" autoFocus placeholder="0.00"
              value={amount} onChange={e => setAmount(e.target.value)}
              style={{
                width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px',
                padding: '14px 16px 14px 36px', fontSize: '24px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--color-text-1)',
                outline: 'none'
              }}
            />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '8px' }}>Date</label>
          <input 
            type="date"
            value={date} onChange={e => setDate(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px',
              padding: '14px 12px', fontSize: '14px', color: 'var(--color-text-1)', outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Account Selection */}
      <div>
        <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '12px' }}>
          {type === 'transfer' ? 'Source Account' : 'Account'}
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {accounts.map(a => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAccountId(a.id)}
              style={{
                padding: '8px 16px', borderRadius: '10px', border: '1px solid',
                borderColor: accountId === a.id ? 'var(--color-text-1)' : 'var(--color-border)',
                background: accountId === a.id ? 'var(--color-text-1)' : 'var(--bg-elevated)',
                color: accountId === a.id ? 'var(--color-base)' : 'var(--color-text-2)',
                fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <span style={{ fontSize: '14px' }}>{a.icon || '🏦'}</span> {a.name}
            </button>
          ))}
        </div>
      </div>

      {/* Target Account (Transfers Only) */}
      {type === 'transfer' && (
        <div>
          <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '12px' }}>Target Account</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {accounts.filter(a => a.id !== accountId).map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => setTargetAccountId(a.id)}
                style={{
                  padding: '8px 16px', borderRadius: '10px', border: '1px solid',
                  borderColor: targetAccountId === a.id ? 'var(--color-accent)' : 'var(--color-border)',
                  background: targetAccountId === a.id ? 'var(--color-accent)' : 'var(--bg-elevated)',
                  color: targetAccountId === a.id ? '#fff' : 'var(--color-text-2)',
                  fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <span style={{ fontSize: '14px' }}>{a.icon || '🏦'}</span> {a.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Selection (Expenses) */}
      {type === 'expense' && (
        <div>
          <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '12px' }}>Category</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {EXPENSE_CATS.map(cat => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCategory(cat.name)}
                style={{
                  padding: '12px 8px', borderRadius: '12px', border: '1px solid',
                  borderColor: category === cat.name ? cat.color : 'var(--color-border)',
                  background: category === cat.name ? `${cat.color}15` : 'var(--bg-elevated)',
                  color: category === cat.name ? cat.color : 'var(--color-text-2)',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      <div>
        <label style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '8px' }}>Reference Note</label>
        <input 
          type="text" placeholder="Swiggy, Amazon, Rent..."
          value={note} onChange={e => setNote(e.target.value)}
          style={{
            width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px',
            padding: '12px 16px', fontSize: '14px', color: 'var(--color-text-1)', outline: 'none'
          }}
        />
      </div>

      <button 
        type="submit" disabled={saving}
        style={{
          marginTop: '8px', padding: '16px', borderRadius: '16px', border: 'none',
          background: 'var(--color-text-1)', color: 'var(--color-base)',
          fontSize: '15px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s', opacity: saving ? 0.7 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
        }}
      >
        {saving ? <div className="spinner" style={{ width: '16px', height: '16px', borderColor: 'var(--color-base)', borderTopColor: 'transparent' }} /> : <CheckCircle2 size={18} />}
        Sync to Ledger
      </button>
    </form>
  );
};

export default Finance;
