import React, { useState, useEffect, useCallback } from 'react';
import supabase from '../utils/supabase';
import { upsertRow } from '../services/dbService';
import { MONEY_XP, MONEY_XP_CAP, getRank } from '../utils/xpEngine';
import { SUBTABS } from './money/MoneyShared';

import MoneyOverviewTab from './money/MoneyOverviewTab';
import MoneyAddTab from './money/MoneyAddTab';
import MoneyAccountsTab from './money/MoneyAccountsTab';
import MoneyLendingTab from './money/MoneyLendingTab';

const MoneyManager = ({ user }) => {
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [lentItems, setLentItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubtab, setActiveSubtab] = useState('overview');

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const [txRes, acctsRes, goalsRes, budgetsRes, lentRes] = await Promise.all([
            supabase.from('money_transactions').select('*')
                .eq('user_id', user.id).gte('date', startOfMonth)
                .order('created_at', { ascending: false }),
            supabase.from('accounts').select('*')
                .eq('user_id', user.id).eq('archived', false)
                .order('created_at', { ascending: true }),
            supabase.from('savings_goals').select('*')
                .eq('user_id', user.id).eq('status', 'active')
                .order('created_at', { ascending: false }),
            supabase.from('budgets').select('*, money_categories(name, icon, color)')
                .eq('user_id', user.id),
            supabase.from('money_lent').select('*')
                .eq('user_id', user.id).neq('status', 'settled')
                .order('created_at', { ascending: false }),
        ]);
        setTransactions(txRes.data || []);
        setAccounts(acctsRes.data || []);
        setSavingsGoals(goalsRes.data || []);
        setBudgets(budgetsRes.data || []);
        setLentItems(lentRes.data || []);
        setLoading(false);
    }, [user]);

    useEffect(() => { if (user) fetchAll(); }, [user, fetchAll]);

    // Award XP for logging money transactions (capped at 3/day)
    const awardMoneyXP = async (userId) => {
        try {
            const todayStr = new Date().toLocaleDateString('en-CA');
            const { count } = await supabase.from('money_transactions')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', userId).eq('date', todayStr);
            if ((count || 0) > MONEY_XP_CAP) return;

            const { data: xp } = await supabase.from('user_xp')
                .select('total_xp, current_rank').eq('user_id', userId).maybeSingle();
            if (!xp) return;
            const newTotal = (xp.total_xp || 0) + MONEY_XP;
            const newRank = getRank(newTotal);
            await upsertRow('user_xp', {
                user_id: userId, total_xp: newTotal, current_rank: newRank.rank,
                power_level: newTotal, updated_at: new Date().toISOString(),
            }, 'user_id');
        } catch { /* silent — XP is non-critical */ }
    };

    return (
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Subtab bar */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-elevated)', borderRadius: '10px', padding: '4px' }}>
                {SUBTABS.map(({ key, label, icon }) => (
                    <button key={key} onClick={() => setActiveSubtab(key)} style={{
                        flex: 1, padding: '7px 10px', borderRadius: '8px', fontSize: '11px',
                        fontWeight: activeSubtab === key ? 700 : 500, border: 'none', cursor: 'pointer',
                        transition: 'all 0.15s',
                        background: activeSubtab === key ? 'var(--bg-card)' : 'transparent',
                        color: activeSubtab === key ? 'var(--text-1)' : 'var(--text-3)',
                        boxShadow: activeSubtab === key ? 'var(--shadow-sm)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                    }}>
                        <span style={{ fontSize: '12px' }}>{icon}</span> {label}
                    </button>
                ))}
            </div>

            {/* Content injection based on selected tab */}
            {activeSubtab === 'overview' && (
                <MoneyOverviewTab
                    transactions={transactions} accounts={accounts}
                    budgets={budgets} savingsGoals={savingsGoals}
                    lentItems={lentItems} loading={loading}
                />
            )}
            {activeSubtab === 'add' && (
                <MoneyAddTab
                    user={user} accounts={accounts}
                    awardMoneyXP={awardMoneyXP} onSuccess={fetchAll}
                />
            )}
            {activeSubtab === 'accounts' && (
                <MoneyAccountsTab
                    user={user} accounts={accounts} setAccounts={setAccounts}
                />
            )}
            {activeSubtab === 'lending' && (
                <MoneyLendingTab
                    user={user} lentItems={lentItems} setLentItems={setLentItems}
                />
            )}
        </div>
    );
};

export default MoneyManager;
