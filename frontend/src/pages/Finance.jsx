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
      if (newAsset.id) {
        await apiPut('/wealth/assets/' + newAsset.id, newAsset);
      } else {
        await apiPost('/wealth/assets', newAsset);
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
      const { getCurrentSession, API_URL } = await import('../utils/api');
      const currentSession = await getCurrentSession();
      const token = currentSession?.access_token;

      const response = await fetch(`${API_URL}/wealth/import`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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

      {/* Excel Import Modal */}
      <Modal isOpen={importOpen} onClose={() => setImportOpen(false)} title="Import Spreadsheet" maxWidth="520px">
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
