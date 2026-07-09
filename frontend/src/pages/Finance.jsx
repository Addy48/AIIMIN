import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Upload, Search,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from '../utils/toast';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';
import Modal from '../components/ui/Modal';
import PageHeader from '../components/layout/PageHeader';
import EntryForm from '../components/finance/EntryForm';
import FinanceOverview from '../components/finance/FinanceOverview';
import FinanceAnalytics from '../components/finance/FinanceAnalytics';
import FinanceAccounts from '../components/finance/FinanceAccounts';
import FinanceTransactions from '../components/finance/FinanceTransactions';
import FinanceBudgets from '../components/finance/FinanceBudgets';
import FinanceWealth from '../components/finance/FinanceWealth';
import ShippedSubNav from '../components/design/ShippedSubNav';



const ASSET_TYPE_LABELS = {
  gold: 'Gold',
  stock: 'Stocks',
  mutual_fund: 'Mutual Funds',
  crypto: 'Crypto',
  cash: 'Cash',
  bank: 'Bank & Cash',
};

const normalizeAsset = (row) => ({
  id: row.id,
  name: row.asset_name || row.name || 'Unnamed',
  type: row.asset_type || row.type || 'Other',
  currentValue: Number(row.current_value ?? row.currentValue ?? 0),
  investedAmount: Number(row.invested_value ?? row.investedAmount ?? 0),
  units: Number(row.units ?? 0),
});

const toAssetPayload = (asset) => ({
  asset_name: asset.name,
  asset_type: asset.type,
  current_value: Number(asset.currentValue) || 0,
  invested_value: Number(asset.investedAmount) || 0,
  units: Number(asset.units) || 0,
});

const Finance = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW | ACCOUNTS | TRANSACTIONS | BUDGETS | WEALTH
  const [transactions, setTransactions] = useState([]);
  const [assets, setAssets] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  // Import & Entry State
  const [importOpen, setImportOpen] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [entryType, setEntryType] = useState('expense'); // Default type for the modal
  const [importStatus, setImportStatus] = useState('idle'); // idle | processing | success | error
  const [dragActive, setDragActive] = useState(false);
  const [importTab, setImportTab] = useState('file'); // 'file' | 'ai'
  const [aiImportText, setAiImportText] = useState('');
  const [aiImportStatus, setAiImportStatus] = useState('idle');
  const [transMonthFilter, setTransMonthFilter] = useState('ALL');
  const [transAccountFilter, setTransAccountFilter] = useState('ALL');
  const [transSearch, setTransSearch] = useState('');
  const [transPage, setTransPage] = useState(1);
  const transPerPage = 15;

  // New Account State
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', balance: 0, type: 'Checking', icon: '🏦' });

  // New Asset State
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', type: 'Stock', investedAmount: 0, currentValue: 0 });

  // New Budget State
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: '', amount: 0 });

  // Asset colors for charts
  const ASSET_COLORS = ['#10B981', '#F59E0B', '#8B5CF6', '#3B82F6', '#EC4899'];

  const handleDeleteAsset = async (id) => {
    if (!window.confirm("Delete asset?")) return;
    try {
      await apiDelete('/wealth/assets/' + id);
      setAssets(prev => prev.filter(a => a.id !== id));
      toast.success("Asset removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete asset");
    }
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      const payload = toAssetPayload(newAsset);
      if (newAsset.id) {
        await apiPut('/wealth/assets/' + newAsset.id, payload);
      } else {
        await apiPost('/wealth/assets', payload);
      }
      setAssetModalOpen(false);
      setNewAsset({ name: '', type: 'Stock', investedAmount: 0, currentValue: 0 });
      loadFinanceData();
      toast.success('Asset saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save asset');
    }
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      if (newBudget.id) {
        await apiPut('/wealth/budgets/' + newBudget.id, newBudget);
      } else {
        await apiPost('/wealth/budgets', newBudget);
      }
      setBudgetModalOpen(false);
      setNewBudget({ category: '', amount: 0 });
      loadFinanceData();
      toast.success('Budget saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save budget');
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setImportStatus('processing');
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use raw fetch so we don't set Content-Type (browser auto-sets multipart boundary)
      const { API_URL } = await import('../utils/api');

      const response = await fetch(`${API_URL}/wealth/import`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const res = await response.json();
      if (res.success) {
        toast.success(res.message || `Imported ${res.imported || ''} transactions`);
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


  const handleAiImport = async () => {
    if (!aiImportText.trim()) return;
    setAiImportStatus('processing');
    try {
      const { API_URL } = await import('../utils/api');
      const response = await fetch(`${API_URL}/wealth/import/ai`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: aiImportText }),
      });
      const res = await response.json();
      if (res.success) {
        toast.success(`Imported ${res.imported || 0} transactions via AI`);
        setAiImportStatus('success');
        await loadFinanceData();
        setTimeout(() => {
          setImportOpen(false);
          setAiImportStatus('idle');
          setAiImportText('');
          setImportTab('file');
        }, 2000);
      } else {
        throw new Error(res.error || 'AI Import failed');
      }
    } catch (err) {
      console.error('AI Import Error:', err);
      toast.error(err.message || 'Failed to process text');
      setAiImportStatus('error');
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
    if (user) {
      loadFinanceData();
      // Lazy-load AI summary after initial data
      if (!user.isGuest) {
        setAiSummaryLoading(true);
        apiGet('/wealth/ai-summary').then(data => {
          setAiSummary(data);
        }).catch(() => {}).finally(() => setAiSummaryLoading(false));
      }
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadFinanceData = async () => {
    setLoading(true);
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000));
      const fetchPromise = Promise.all([
        apiGet('/wealth/transactions'),
        apiGet('/wealth/assets'),
        apiGet('/wealth/accounts'),
        apiGet('/wealth/budgets')
      ]);

      const [transData, assetsData, accountsData, budgetsData] = await Promise.race([fetchPromise, timeoutPromise]);

      setTransactions(transData || []);
      setAssets((assetsData || []).map(normalizeAsset));
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
    const assetTotal = assets.reduce((sum, a) => sum + Number(a.currentValue), 0);
    return assetTotal + totalBalance;
  }, [assets, totalBalance]);
  
  const totalInvested = useMemo(() => assets.reduce((sum, a) => sum + Number(a.investedAmount), 0), [assets]);
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
    assets.forEach((a) => {
      const type = String(a.type || 'stock').toLowerCase().replace(/\s+/g, '_');
      if (Object.prototype.hasOwnProperty.call(breakdown, type)) breakdown[type] += Number(a.currentValue);
      else breakdown.stock += Number(a.currentValue);
    });
    return Object.entries(breakdown)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({ name: ASSET_TYPE_LABELS[key] || key, value }));
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
    <div className="page-container">

      {/* Header */}
      <PageHeader 
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            Wealth Vault<span style={{ color: 'var(--color-accent)', opacity: 0.5 }}>.</span>
          </span>
        }
        subtitle={`Capital Allocation · ${monthStr}`}
        rightContent={
          <>
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
          </>
        }
      />


      <ShippedSubNav
        tabs={[
          { id: 'OVERVIEW', label: 'Overview' },
          { id: 'ANALYTICS', label: 'Analytics' },
          { id: 'ACCOUNTS', label: 'Accounts' },
          { id: 'TRANSACTIONS', label: 'Transactions' },
          { id: 'BUDGETS', label: 'Budgets' },
          { id: 'WEALTH', label: 'Wealth' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {loading ? (
        <div style={{ padding: '24px', opacity: 0.7, pointerEvents: 'none' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ height: '120px', background: 'var(--color-surface)', borderRadius: '24px', border: '1px solid var(--color-border)', animation: 'aiimin-pulse 1.5s infinite' }} />
            ))}
          </div>
          <div style={{ height: '400px', background: 'var(--color-surface)', borderRadius: '24px', border: '1px solid var(--color-border)', animation: 'aiimin-pulse 1.5s infinite' }} />
          <style>{`
            @keyframes aiimin-pulse {
              0% { opacity: 0.6; }
              50% { opacity: 1; }
              100% { opacity: 0.6; }
            }
          `}</style>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'OVERVIEW' && (
            <FinanceOverview 
              totalNetWorth={totalNetWorth} returnPct={returnPct} 
              monthlyIncome={monthlyIncome} monthlyExpenses={monthlyExpenses} 
              formatCurrency={formatCurrency} aiSummaryLoading={aiSummaryLoading} 
              aiSummary={aiSummary} savingsRate={savingsRate} fiYears={fiYears} 
              totalBalance={totalBalance} totalReturns={totalReturns} 
              financeChecks={financeChecks} velocityData={velocityData} 
            />
          )}

          {activeTab === 'ANALYTICS' && (
            <FinanceAnalytics 
              dailySpend={dailySpend} savingsRate={savingsRate} 
              monthlyExpenses={monthlyExpenses} monthlyIncome={monthlyIncome} 
              topExpenses={topExpenses} formatCurrency={formatCurrency} 
            />
          )}

          {activeTab === 'ACCOUNTS' && (
            <FinanceAccounts 
              accounts={accounts} formatCurrency={formatCurrency} 
              totalBalance={totalBalance} setAccountModalOpen={setAccountModalOpen} 
              setNewAccount={setNewAccount} handleDeleteAccount={handleDeleteAccount} 
            />
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
                <FinanceTransactions 
                  transactions={paginatedTransactions} formatCurrency={formatCurrency} 
                  setEntryModalOpen={setEntryOpen} setNewTransaction={() => {}} 
                />
                
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
            );
          })()}

          {activeTab === 'BUDGETS' && (
            <FinanceBudgets 
              budgetProgress={budgetProgress} formatCurrency={formatCurrency} 
              setBudgetModalOpen={setBudgetModalOpen} 
            />
          )}

          {activeTab === 'WEALTH' && (
            <FinanceWealth 
              assets={assets} formatCurrency={formatCurrency} totalInvested={totalInvested} 
              totalReturns={totalReturns} returnPct={returnPct} assetBreakdown={assetBreakdown} 
              ASSET_COLORS={ASSET_COLORS} setAssetModalOpen={setAssetModalOpen} 
              setNewAsset={setNewAsset} handleDeleteAsset={handleDeleteAsset} 
            />
          )}

        </AnimatePresence>
      )}

      {/* Add Account Modal */}
      <Modal isOpen={accountModalOpen} onClose={() => setAccountModalOpen(false)} title={newAccount.id ? 'Edit Account' : 'New Bank Account'} maxWidth="520px">
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
      </Modal>

      {/* Entry Modal */}
      <Modal isOpen={entryOpen} onClose={() => setEntryOpen(false)} title="Record Finance Entry" maxWidth="560px">
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
      </Modal>

      {/* Add Asset Modal */}
      <Modal isOpen={assetModalOpen} onClose={() => setAssetModalOpen(false)} title={newAsset.id ? 'Edit Position' : 'New Position'} maxWidth="520px">
              <form onSubmit={handleAddAsset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '8px' }}>Asset Name</label>
                  <input type="text" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--text-1)', fontSize: '14px', outline: 'none' }} placeholder="e.g. VOO / Real Estate" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '8px' }}>Invested Amount</label>
                    <input type="number" step="0.01" value={newAsset.investedAmount} onChange={e => setNewAsset({...newAsset, investedAmount: e.target.value})} required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--text-1)', fontSize: '14px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '8px' }}>Current Value</label>
                    <input type="number" step="0.01" value={newAsset.currentValue} onChange={e => setNewAsset({...newAsset, currentValue: e.target.value})} required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--text-1)', fontSize: '14px', outline: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '8px' }}>Type</label>
                  <select value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value})} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--text-1)', fontSize: '14px', outline: 'none' }}>
                    <option>Stock</option>
                    <option>Crypto</option>
                    <option>Real Estate</option>
                    <option>Cash</option>
                    <option>Other</option>
                  </select>
                </div>
                <button type="submit" style={{ background: 'var(--color-text-1)', color: 'var(--color-base)', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '16px' }}>
                  {newAsset.id ? 'Save Changes' : 'Create Position'}
                </button>
              </form>
      </Modal>

      {/* Add Budget Modal */}
      <Modal isOpen={budgetModalOpen} onClose={() => setBudgetModalOpen(false)} title={newBudget.id ? 'Edit Budget' : 'New Budget'} maxWidth="520px">
              <form onSubmit={handleAddBudget} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '8px' }}>Category Name</label>
                  <input type="text" value={newBudget.category} onChange={e => setNewBudget({...newBudget, category: e.target.value})} required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--text-1)', fontSize: '14px', outline: 'none' }} placeholder="e.g. Dining" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)', marginBottom: '8px' }}>Monthly Amount</label>
                  <input type="number" step="0.01" value={newBudget.amount} onChange={e => setNewBudget({...newBudget, amount: e.target.value})} required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--text-1)', fontSize: '14px', outline: 'none' }} />
                </div>
                <button type="submit" style={{ background: 'var(--color-text-1)', color: 'var(--color-base)', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '16px' }}>
                  {newBudget.id ? 'Save Changes' : 'Create Budget'}
                </button>
              </form>
      </Modal>

      {/* Import Modal */}
      <Modal isOpen={importOpen} onClose={() => { setImportOpen(false); setImportStatus('idle'); setAiImportStatus('idle'); setImportTab('file'); }} title="Import Transactions" maxWidth="560px">
        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--color-elevated)', borderRadius: '12px', padding: '4px' }}>
          {[{id: 'file', label: '📁 Spreadsheet / CSV'}, {id: 'ai', label: '🤖 AI Text / SMS'}].map(tab => (
            <button key={tab.id} onClick={() => setImportTab(tab.id)} style={{
              flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: importTab === tab.id ? 'var(--color-surface)' : 'transparent',
              color: importTab === tab.id ? 'var(--color-text-1)' : 'var(--color-text-3)',
              fontSize: '13px', fontWeight: 700,
              boxShadow: importTab === tab.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}>{tab.label}</button>
          ))}
        </div>

        {importTab === 'file' && (
          <div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-3)', lineHeight: 1.6, marginBottom: '20px', textAlign: 'center' }}>Upload any Excel, CSV, or bank export file. Our AI parser understands any format.</p>
            {importStatus === 'idle' && (
              <div 
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
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
                <span style={{ fontSize: '10px', color: 'var(--color-text-3)', marginTop: '6px' }}>Excel, CSV, any bank export format</span>
              </div>
            )}
            {importStatus === 'processing' && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div className="spinner" style={{ margin: '0 auto 24px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-1)' }}>Parsing file...</span>
              </div>
            )}
            {importStatus === 'success' && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#10B981' }}>
                <CheckCircle2 size={44} style={{ margin: '0 auto 16px' }} />
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Import Complete!</div>
              </div>
            )}
            {importStatus === 'error' && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-rust)' }}>
                <AlertCircle size={44} style={{ margin: '0 auto 16px' }} />
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Import Failed</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginTop: '6px' }}>Check the file format.</div>
                <button onClick={() => setImportStatus('idle')} style={{ marginTop: '20px', background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-text-1)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Try Again</button>
              </div>
            )}
          </div>
        )}

        {importTab === 'ai' && (
          <div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-3)', lineHeight: 1.6, marginBottom: '16px', textAlign: 'center' }}>Paste any text — bank SMS alerts, WhatsApp expense logs, AI chat history, or notes. AIIMIN will extract and categorise transactions.</p>
            {aiImportStatus === 'idle' || aiImportStatus === 'error' ? (
              <div>
                <textarea
                  value={aiImportText}
                  onChange={e => setAiImportText(e.target.value)}
                  placeholder={`Example:\n"Spent ₹450 on groceries at DMart on 18 Jun\nPaid ₹1200 for electricity bill\nReceived ₹5000 salary advance\nCoffee ₹80 at Starbucks"`}
                  style={{
                    width: '100%', minHeight: '180px', padding: '14px', borderRadius: '12px',
                    border: '1px solid var(--color-border)', background: 'var(--color-elevated)',
                    color: 'var(--color-text-1)', fontSize: '13px', lineHeight: 1.6,
                    fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                {aiImportStatus === 'error' && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>AI parsing failed. Try reformatting your text.</div>}
                <button
                  onClick={handleAiImport}
                  disabled={!aiImportText.trim()}
                  style={{
                    marginTop: '16px', width: '100%', padding: '14px', borderRadius: '12px',
                    background: aiImportText.trim() ? 'var(--color-accent)' : 'var(--color-border)',
                    color: aiImportText.trim() ? '#fff' : 'var(--color-text-3)',
                    border: 'none', fontSize: '14px', fontWeight: 700, cursor: aiImportText.trim() ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                  }}
                >🤖 Analyse & Import</button>
              </div>
            ) : aiImportStatus === 'processing' ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div className="spinner" style={{ margin: '0 auto 24px' }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-1)' }}>AI is reading your transactions...</span>
                <p style={{ fontSize: '12px', color: 'var(--color-text-3)', marginTop: '8px' }}>This may take a few seconds.</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#10B981' }}>
                <CheckCircle2 size={44} style={{ margin: '0 auto 16px' }} />
                <div style={{ fontSize: '16px', fontWeight: 600 }}>AI Import Complete!</div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-3)', marginTop: '8px' }}>Transactions have been categorized and saved.</p>
              </div>
            )}
          </div>
        )}
      </Modal>

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
