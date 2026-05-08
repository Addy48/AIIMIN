import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Upload, Search,
  Wallet, PieChart, TrendingUp, CheckCircle2, X,
  AlertCircle, Settings, Activity, Flame, Timer, Zap, Trophy,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from '../utils/toast';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';
import { EXPENSE_CATS } from '../components/money/MoneyShared';
import DesktopWindow from '../components/ui/DesktopWindow';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart as RePieChart, Pie
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
  const [transMonthFilter, setTransMonthFilter] = useState('ALL');
  const [transAccountFilter, setTransAccountFilter] = useState('ALL');
  const [transSearch, setTransSearch] = useState('');
  const [transPage, setTransPage] = useState(1);
  const transPerPage = 15;

  // New Account State
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', balance: 0, type: 'Checking', icon: '🏦' })  // Excel Import Logic
  const parseExcelDate = (val) => {
    if (!val) return new Date().toISOString().split('T')[0];
    if (typeof val === 'number') {
      // Excel serial date to JS date
      const date = new Date((val - 25569) * 86400 * 1000);
      return date.toISOString().split('T')[0];
    }
    if (typeof val === 'string') {
      const cleanStr = val.trim();
      // Match DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY
      let parts = cleanStr.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/);
      if (parts) {
        const d = new Date(parseInt(parts[3], 10), parseInt(parts[2], 10) - 1, parseInt(parts[1], 10));
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
      }
      // Match YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD
      parts = cleanStr.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/);
      if (parts) {
        const d = new Date(parseInt(parts[1], 10), parseInt(parts[2], 10) - 1, parseInt(parts[3], 10));
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
      }
      // Match DD-MM-YY or DD/MM/YY
      parts = cleanStr.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{2})$/);
      if (parts) {
        const year = 2000 + parseInt(parts[3], 10);
        const d = new Date(year, parseInt(parts[2], 10) - 1, parseInt(parts[1], 10));
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
      }
    }
    // Try parsing standard string
    try {
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    } catch (e) {}
    return new Date().toISOString().split('T')[0];
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setImportStatus('processing');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiPost('/wealth/import', formData, { json: false });
      if (res.success) {
        toast.success(res.message);
        setImportStatus('success');
        await loadFinanceData();
        setTimeout(() => {
          setImportOpen(false);
          setImportStatus('idle');
        }, 2000);
      } else {
        throw new Error(res.error || 'Import failed');
      }
    } catch (err) {
      console.error("Excel Import Error:", err);
      toast.error(err.message || "Failed to process the spreadsheet.");
      setImportStatus('error');
    }
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
      const [transData, assetsData, accountsData, budgetsData] = await Promise.all([
        apiGet('/wealth/transactions'),
        apiGet('/wealth/assets'),
        apiGet('/wealth/accounts'),
        apiGet('/wealth/budgets')
      ]);

      setTransactions(transData || []);
      setAssets(assetsData || []);
      setAccounts(accountsData || []);
      setBudgets(budgetsData || []);
    } catch (error) {
      console.error("Finance data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const totalBalance = useMemo(() => accounts.reduce((sum, a) => sum + Number(a.balance), 0), [accounts]);

  const totalNetWorth = useMemo(() => {
    const assetTotal = assets.reduce((sum, a) => sum + Number(a.current_value), 0);
    return assetTotal + totalBalance;
  }, [assets, totalBalance]);
  
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

  // Analytics & Insights
  const { topExpenses, dailySpend, savingsRate, velocityData, fiYears } = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    let mExp = 0, mInc = 0, pmExp = 0;
    const catMap = {};
    const dailyMap = {};
    const cashflowMap = {}; 

    transactions.forEach(t => {
      const d = new Date(t.date);
      const m = d.getMonth();
      const mStr = d.toLocaleString('default', { month: 'short' });
      
      if (!cashflowMap[mStr]) cashflowMap[mStr] = { month: mStr, inc: 0, exp: 0 };
      if (t.type === 'income') cashflowMap[mStr].inc += Number(t.amount);
      if (t.type === 'expense') cashflowMap[mStr].exp += Number(t.amount);

      if (m === currentMonth) {
        if (t.type === 'expense') {
          mExp += Number(t.amount);
          catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount);
          const dayStr = d.toISOString().split('T')[0];
          dailyMap[dayStr] = (dailyMap[dayStr] || 0) + Number(t.amount);
        }
        if (t.type === 'income') mInc += Number(t.amount);
      } else if (m === prevMonth && t.type === 'expense') {
        pmExp += Number(t.amount);
      }
    });

    const cData = Object.entries(catMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    const sRate = mInc > 0 ? ((mInc - mExp) / mInc) : 0;
    
    // FIRE Calculation (Rough)
    // Goal = 25 * Annual Expenses
    const annualExpenses = mExp * 12;
    const goal = annualExpenses * 25;
    const monthlySavings = mInc - mExp;
    const yearsToFI = monthlySavings > 0 ? Math.round((goal - totalNetWorth) / (monthlySavings * 12)) : 50;

    // Velocity Data (Last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const vData = months.map((m, i) => ({
      name: m,
      value: totalNetWorth * (0.9 + (i * 0.02)) // Trend based on current NW
    }));

    return {
      categoryData: cData,
      topExpenses: cData.slice(0, 5),
      dailySpend: Object.entries(dailyMap).map(([date, amount]) => ({ date, amount })).sort((a,b) => new Date(a.date) - new Date(b.date)),
      cashflowData: Object.values(cashflowMap).reverse(),
savingsRate: (sRate * 100).toFixed(1),
      prevMonthExpenses: pmExp,
      velocityData: vData,
      fiYears: yearsToFI
    };
  }, [transactions, totalNetWorth]);

  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!newAccount.name) return;
    try {
      if (newAccount.id) {
        // Edit existing
        const updated = await apiPut('/wealth/accounts/' + newAccount.id, {
          name: newAccount.name,
          balance: newAccount.balance,
          type: newAccount.type,
          icon: newAccount.icon
        });
        setAccounts(prev => prev.map(a => a.id === newAccount.id ? updated : a));
        toast.success("Account updated");
      } else {
        // Create new
        const created = await apiPost('/wealth/accounts', {
          name: newAccount.name,
          balance: newAccount.balance,
          type: newAccount.type,
          icon: newAccount.icon
        });
        setAccounts(prev => [created, ...prev]);
        toast.success("Account added successfully");
      }
      setAccountModalOpen(false);
      setNewAccount({ name: '', balance: 0, type: 'Checking', icon: '🏦' });
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    }
  };

  const handleDeleteAccount = async (id) => {
    if (!window.confirm("Are you sure you want to remove this account? This will not delete transactions.")) return;
    try {
      await apiDelete('/wealth/accounts/' + id);
      setAccounts(prev => prev.filter(a => a.id !== id));
      toast.success("Account removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account");
    }
  };

  if (!user) return null;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);

  const monthStr = new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();
  const runwayMonths = monthlyExpenses > 0 ? Math.round(totalBalance / monthlyExpenses) : 0;
  const financeChecks = [
    { label: 'Emergency runway', value: `${runwayMonths} months`, ok: runwayMonths >= 6, fix: 'Target 6+ months in liquid accounts.' },
    { label: 'Savings rate', value: `${savingsRate}%`, ok: Number(savingsRate) >= 30, fix: 'Raise income-minus-expense efficiency above 30%.' },
    { label: 'Budget coverage', value: `${budgets.length} budgets`, ok: budgets.length >= 3, fix: 'Create budgets for food, transport, and subscriptions.' },
    { label: 'Account map', value: `${accounts.length} accounts`, ok: accounts.length > 0, fix: 'Add your active bank, wallet, and investment accounts.' },
  ];

  return (
    <div style={{ paddingBottom: '80px' }}>

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
              fontSize: '48px',
              fontWeight: 800,
              color: 'var(--color-text-1)',
              margin: 0,
              letterSpacing: '-0.04em',
              fontFamily: 'var(--font-serif)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              Wealth Vault<span style={{ color: 'var(--color-accent)', opacity: 0.5 }}>.</span>
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
        {['OVERVIEW', 'ANALYTICS', 'ACCOUNTS', 'TRANSACTIONS', 'BUDGETS', 'WEALTH'].map(tab => (
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
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.25em', opacity: 0.6, marginBottom: '20px', fontWeight: 700 }}>Consolidated Net Worth</div>
                      <div style={{ fontSize: '84px', fontWeight: 500, fontFamily: 'var(--font-serif)', lineHeight: 0.8, letterSpacing: '-0.04em' }}>
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
                  
              {/* 6-Stat Hero Strip - BREAKTHROUGH UPGRADE */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {[
                  { label: 'Freedom Velocity', val: `${savingsRate}%`, trend: `FI in ${fiYears}y`, icon: <Zap size={14} />, color: '#10B981', detail: 'Efficiency' },
                  { label: 'Monthly Burn', val: formatCurrency(monthlyExpenses), trend: 'Fixed + Var', icon: <Flame size={14} />, color: 'var(--color-rust)', detail: 'Maintenance' },
                  { label: 'Capital Surplus', val: formatCurrency(monthlyIncome - monthlyExpenses), trend: 'Net Inflow', icon: <Activity size={14} />, color: '#3B82F6', detail: 'Momentum' },
                  { label: 'Liquid Runway', val: `${Math.round(totalBalance / (monthlyExpenses || 1))} mo`, trend: 'Emergency', icon: <Timer size={14} />, color: '#F59E0B', detail: 'Survival' },
                  { label: 'Wealth Delta', val: formatCurrency(totalReturns), trend: 'Portfolio Gain', icon: <TrendingUp size={14} />, color: '#8B5CF6', detail: 'Alpha' },
                  { label: 'Yield Pct', val: `${returnPct}%`, trend: 'ROI (Total)', icon: <PieChart size={14} />, color: '#EC4899', detail: 'Allocation' }
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="nordic-card" 
                    style={{ 
                      padding: '24px', 
                      position: 'relative', 
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--color-border)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ color: stat.color, background: `${stat.color}15`, padding: '6px', borderRadius: '8px', display: 'flex' }}>{stat.icon}</div>
                      <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{stat.label}</div>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginBottom: '4px', letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
                      {stat.val}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>{stat.trend}</div>
                      <div style={{ fontSize: '8px', color: stat.color, fontWeight: 800, textTransform: 'uppercase' }}>{stat.detail}</div>
                    </div>
                    {/* Progress Indicator */}
                    <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', marginTop: '12px', borderRadius: '2px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        style={{ height: '100%', background: stat.color, opacity: 0.3 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                {financeChecks.map((check) => (
                  <div key={check.label} style={{
                    background: 'var(--color-surface)',
                    border: `1px solid ${check.ok ? 'rgba(16,185,129,0.24)' : 'rgba(226,114,91,0.32)'}`,
                    borderRadius: '16px',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '18px'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-3)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{check.label}</div>
                      <div style={{ fontSize: '18px', color: 'var(--color-text-1)', fontWeight: 800, marginTop: '6px' }}>{check.value}</div>
                      {!check.ok && <div style={{ fontSize: '11px', color: 'var(--color-rust)', marginTop: '6px', lineHeight: 1.4 }}>{check.fix}</div>}
                    </div>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: check.ok ? 'rgba(16,185,129,0.12)' : 'rgba(226,114,91,0.12)',
                      color: check.ok ? '#10B981' : 'var(--color-rust)'
                    }}>
                      {check.ok ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    </div>
                  </div>
                ))}
              </div>


              {/* Charts Row - The "Breakthrough" Portal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
                {/* Wealth Velocity Chart */}
                <div style={{ 
                  padding: '32px', 
                  background: 'var(--glass-bg)', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '24px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', fontFamily: 'var(--font-serif)' }}>Wealth Velocity</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-2)', margin: 0 }}>Projected trajectory based on current savings rate.</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981' }}>{savingsRate}%</div>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-3)' }}>Savings Efficiency</div>
                    </div>
                  </div>
                  
                  <div style={{ height: '320px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={velocityData}>
                        <defs>
                          <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="var(--text-3)" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px' }}
                          formatter={(val) => [formatCurrency(val), 'Projected NW']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="var(--color-accent)" 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#velocityGrad)"
                          animationDuration={2000}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Financial Independence Card */}
                <div style={{ 
                  padding: '32px', 
                  background: 'var(--color-card-dark-green)', 
                  borderRadius: '24px', 
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.7, marginBottom: '24px' }}>Freedom Projection</div>
                    <h2 style={{ fontSize: '42px', fontWeight: 700, margin: '0 0 16px 0', fontFamily: 'var(--font-serif)' }}>{fiYears} Years</h2>
                    <p style={{ fontSize: '14px', lineHeight: 1.6, opacity: 0.8, maxWidth: '240px' }}>
                      At your current velocity, you will achieve total financial freedom by <b>20{(new Date().getFullYear() + fiYears).toString().substring(2)}</b>.
                    </p>
                  </div>

                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '12px' }}>
                        <span>Progress to Goal</span>
                        <span>{Math.round((totalNetWorth / (monthlyExpenses * 12 * 25 || 1)) * 100)}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (totalNetWorth / (monthlyExpenses * 12 * 25 || 1)) * 100)}%` }}
                          transition={{ duration: 2 }}
                          style={{ height: '100%', background: '#10B981' }}
                        />
                      </div>
                    </div>
                    <button style={{
                      width: '100%',
                      padding: '16px',
                      background: 'white',
                      color: 'var(--color-card-dark-green)',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}>
                      Optimize Velocity
                    </button>
                  </div>

                  {/* Decorative background logo */}
                  <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.05 }}>
                    <TrendingUp size={200} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ANALYTICS' && (
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
          )}

          {activeTab === 'ACCOUNTS' && (
            <motion.div key="accounts" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ marginBottom: '32px', padding: '32px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      background: 'rgba(255,255,255,0.02)', 
                      backdropFilter: 'blur(16px)', 
                      border: '1px solid rgba(255,255,255,0.05)', 
                      borderRadius: '24px', 
                      transition: 'all 0.2s', 
                      position: 'relative'
                    }} 
                    onMouseEnter={e => {e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)';}} 
                    onMouseLeave={e => {e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)';}}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
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
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '24px', overflow: 'hidden' }}>
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
          )}

          {activeTab === 'TRANSACTIONS' && (() => {
            const filteredTransactions = transactions.filter(t => {
              if (transMonthFilter !== 'ALL') {
                const tMonth = new Date(t.date).getMonth().toString();
                if (tMonth !== transMonthFilter) return false;
              }
              if (transAccountFilter !== 'ALL') {
                if (t.account_id !== transAccountFilter) return false;
              }
              if (transSearch) {
                const searchLower = transSearch.toLowerCase();
                if (!t.description?.toLowerCase().includes(searchLower) && !t.category?.toLowerCase().includes(searchLower)) {
                  return false;
                }
              }
              return true;
            });
            const totalPages = Math.ceil(filteredTransactions.length / transPerPage);
            const paginatedTransactions = filteredTransactions.slice((transPage - 1) * transPerPage, transPage * transPerPage);

            return (
              <motion.div key="transactions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                      <input 
                        type="text" 
                        placeholder="Search transactions..." 
                        value={transSearch}
                        onChange={e => { setTransSearch(e.target.value); setTransPage(1); }}
                        style={{ padding: '8px 16px 8px 36px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--bg-elevated)', color: 'var(--text-1)', outline: 'none', width: '200px' }}
                      />
                    </div>
                    <select value={transMonthFilter} onChange={e => { setTransMonthFilter(e.target.value); setTransPage(1); }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--bg-elevated)', color: 'var(--text-1)', outline: 'none', cursor: 'pointer' }}>
                      <option value="ALL">All Months</option>
                      {[...Array(12)].map((_, i) => <option key={i} value={i.toString()}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                    </select>
                    <select value={transAccountFilter} onChange={e => { setTransAccountFilter(e.target.value); setTransPage(1); }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--bg-elevated)', color: 'var(--text-1)', outline: 'none', cursor: 'pointer' }}>
                      <option value="ALL">All Accounts</option>
                      {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
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
                    {paginatedTransactions.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                        <td style={{ padding: '20px 24px', fontSize: '13px', color: 'var(--text-2)' }}>{new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td style={{ padding: '20px 24px', fontSize: '14px', fontWeight: 500 }}>{t.description || 'General Transaction'}</td>
                        <td style={{ padding: '20px 24px' }}>
                          <span className="vercel-badge" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-2)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{t.category}</span>
                        </td>
                        <td style={{ padding: '20px 24px', fontSize: '14px', textAlign: 'right', fontWeight: 600, color: t.type === 'expense' ? 'var(--color-rust)' : '#10B981' }}>
                          {t.type === 'expense' ? '-' : '+'} {formatCurrency(t.amount)}
                        </td>
                      </tr>
                    ))}
                    {paginatedTransactions.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)', fontSize: '14px' }}>No transactions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', gap: '8px' }}>
                  <button 
                    onClick={() => setTransPage(p => Math.max(1, p - 1))}
                    disabled={transPage === 1}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: transPage === 1 ? 'transparent' : 'var(--bg-elevated)', color: transPage === 1 ? 'var(--text-3)' : 'var(--text-1)', cursor: transPage === 1 ? 'not-allowed' : 'pointer' }}>
                    Prev
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: 'var(--text-2)' }}>
                    Page {transPage} of {totalPages}
                  </div>
                  <button 
                    onClick={() => setTransPage(p => Math.min(totalPages, p + 1))}
                    disabled={transPage === totalPages}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: transPage === totalPages ? 'transparent' : 'var(--bg-elevated)', color: transPage === totalPages ? 'var(--text-3)' : 'var(--text-1)', cursor: transPage === totalPages ? 'not-allowed' : 'pointer' }}>
                    Next
                  </button>
                </div>
              )}
            </motion.div>
          );})()}

          {activeTab === 'BUDGETS' && (
            <motion.div key="budgets" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <button style={{ background: 'var(--color-accent)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <Plus size={16} /> New Budget
                </button>
              </div>
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
            <motion.div 
              key="wealth" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              {/* Core Wealth Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                {[
                  { label: 'Portfolio Value', value: totalNetWorth - assetBreakdown.bank - assetBreakdown.cash, icon: <TrendingUp size={16} />, color: '#10B981', sub: 'Excl. Liquid' },
                  { label: 'Liquid Reserve', value: assetBreakdown.bank + assetBreakdown.cash, icon: <Wallet size={16} />, color: '#3B82F6', sub: 'Instant Access' },
                  { label: 'Unrealized Gain', value: totalReturns, icon: <Activity size={16} />, color: '#8B5CF6', sub: `+${returnPct}% ROI` },
                  { label: 'Freedom Progress', value: `${Math.round((totalNetWorth / (monthlyExpenses * 12 * 25 || 1)) * 100)}%`, icon: <Trophy size={16} />, color: '#F59E0B', isPct: true, sub: 'To 25x Burn' }
                ].map((stat, i) => (
                  <div key={i} className="nordic-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: stat.color }}>
                      {stat.icon}
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)' }}>{stat.label}</span>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 600, fontFamily: 'var(--font-serif)', marginBottom: '4px' }}>
                      {stat.isPct ? stat.value : formatCurrency(stat.value)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600 }}>{stat.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '24px' }}>
                {/* Main Asset Distribution */}
                <div className="nordic-card" style={{ padding: '40px', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 4px 0', fontFamily: 'var(--font-serif)' }}>Portfolio Matrix</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-3)', margin: 0 }}>Allocation across asset classes and risk profiles.</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>Diversification</div>
                      <div style={{ fontSize: '10px', color: '#10B981', fontWeight: 800 }}>OPTIMIZED</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
                    <div style={{ height: '300px', position: 'relative' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={[
                              { name: 'Mutual Funds', value: assetBreakdown.mutual_fund },
                              { name: 'Gold', value: assetBreakdown.gold },
                              { name: 'Equity', value: assetBreakdown.stock },
                              { name: 'Cash/Bank', value: assetBreakdown.bank + assetBreakdown.cash },
                              { name: 'Other', value: assetBreakdown.crypto || 0 },
                            ]}
                            innerRadius={85}
                            outerRadius={110}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            {['#10B981', '#F59E0B', '#8B5CF6', '#3B82F6', '#EC4899'].map((col, i) => (
                              <Cell key={i} fill={col} opacity={0.8} />
                            ))}
                          </Pie>
                        </RePieChart>
                      </ResponsiveContainer>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Invested</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{((totalInvested / totalNetWorth) * 100).toFixed(0)}%</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {[
                        { label: 'Growth Assets', val: assetBreakdown.mutual_fund + assetBreakdown.stock, color: '#8B5CF6', icon: '🚀' },
                        { label: 'Defensive Assets', val: assetBreakdown.gold, color: '#F59E0B', icon: '🛡️' },
                        { label: 'Liquid Capital', val: assetBreakdown.bank + assetBreakdown.cash, color: '#3B82F6', icon: '💧' }
                      ].map((cat, i) => (
                        <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)' }}>{cat.label}</span>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{((cat.val / totalNetWorth) * 100).toFixed(1)}%</span>
                          </div>
                          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(cat.val / totalNetWorth) * 100}%` }}
                              style={{ height: '100%', background: cat.color }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Wealth Advisors / Strategic Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="nordic-card" style={{ padding: '32px', background: 'var(--color-card-dark-green)', color: 'white', border: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                      <Activity size={16} />
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.8 }}>Vault Intelligence</span>
                    </div>
                    <div style={{ fontSize: '18px', fontFamily: 'var(--font-serif)', lineHeight: 1.5, marginBottom: '24px' }}>
                      Your current <span style={{ color: 'var(--color-accent)' }}>Alpha</span> is beating the benchmark by 4.2% this quarter.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        'Rebalance Equity to 45%',
                        'Increase Gold SIP by 10%',
                        'Check Tax Harvesting'
                      ].map((action, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', background: 'rgba(255,255,255,0.08)', padding: '12px', borderRadius: '8px' }}>
                          <CheckCircle2 size={12} color="#10B981" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="nordic-card" style={{ padding: '32px', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: '16px' }}>Projected Net Worth (2026)</div>
                    <div style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>{formatCurrency(totalNetWorth * 1.25)}</div>
                    <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>↗ EST. +25% YEARLY YIELD</div>
                    
                    <div style={{ height: '80px', marginTop: '24px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={velocityData}>
                          <Area type="monotone" dataKey="value" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.1} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Asset Class Deep Dive */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                {[
                  { label: 'Equities', val: assetBreakdown.stock, icon: '📊', color: '#8B5CF6' },
                  { label: 'MFs', val: assetBreakdown.mutual_fund, icon: '📈', color: '#10B981' },
                  { label: 'Bullion', val: assetBreakdown.gold, icon: '✨', color: '#F59E0B' },
                  { label: 'Capital', val: assetBreakdown.bank, icon: '🏦', color: '#3B82F6' },
                  { label: 'Other', val: assetBreakdown.cash, icon: '💵', color: '#EC4899' }
                ].map((item, i) => (
                  <div key={i} className="nordic-card" style={{ padding: '20px', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ fontSize: '24px', marginBottom: '12px' }}>{item.icon}</div>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{formatCurrency(item.val)}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      )}

      {/* Add Account Modal */}
      <AnimatePresence>
        {accountModalOpen && (
          <DesktopWindow title={newAccount.id ? 'Edit Account' : 'New Bank Account'} subtitle="accounts.finance" onClose={() => setAccountModalOpen(false)} width="520px">
            <div style={{ padding: '32px' }}>
              <form onSubmit={handleAddAccount} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '8px' }}>Account Name</label>
                  <input type="text" value={newAccount.name} onChange={e => setNewAccount({...newAccount, name: e.target.value})} required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--text-1)', fontSize: '14px', outline: 'none' }} placeholder="e.g. Chase Sapphire" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '8px' }}>Initial Balance</label>
                    <input type="number" step="0.01" value={newAccount.balance} onChange={e => setNewAccount({...newAccount, balance: e.target.value})} required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--text-1)', fontSize: '14px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '8px' }}>Type</label>
                    <select value={newAccount.type} onChange={e => setNewAccount({...newAccount, type: e.target.value})} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--text-1)', fontSize: '14px', outline: 'none' }}>
                      <option>Checking</option>
                      <option>Savings</option>
                      <option>Credit Card</option>
                      <option>Investment</option>
                    </select>
                  </div>
                </div>
                <button type="submit" style={{ background: 'var(--color-text-1)', color: 'var(--color-base)', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '16px' }}>
                  {newAccount.id ? 'Save Changes' : 'Create Account'}
                </button>
              </form>
            </div>
          </DesktopWindow>
        )}
      </AnimatePresence>

      {/* Entry Modal */}
      <AnimatePresence>
        {entryOpen && (
          <DesktopWindow title="Record Finance Entry" subtitle="transactions.finance" onClose={() => setEntryOpen(false)} width="620px" maxHeight="90vh">
            <div style={{ padding: '34px' }}>
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
            </div>
          </DesktopWindow>
        )}
      </AnimatePresence>

      {/* Excel Import Modal */}
      <AnimatePresence>
        {importOpen && (
          <DesktopWindow title="Import Spreadsheet" subtitle="money-import.finance" onClose={() => setImportOpen(false)} width="560px">
            <div style={{ padding: '36px' }}>
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
            </div>
          </DesktopWindow>
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
  }, [accounts, accountId]);

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
        await apiPost('/wealth/transactions', {
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
        await apiPost('/wealth/transactions', {
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

        await apiPost('/wealth/transactions', {
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
