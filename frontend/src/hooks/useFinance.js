import { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import { useMockData } from '../providers/MockDataProvider';

/**
 * useFinance hook
 * 
 * Centralized hook to fetch 30-day financial summaries, category breakdown,
 * burn rate analytics, and savings goals.
 */
export function useFinance(user) {
    const { isUsingMock, mockData } = useMockData() || {};
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState([]);
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toLocaleDateString('en-CA');
        const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toLocaleDateString('en-CA');

        const processData = (txns, prevTxns, goalsData) => {
            const totalSpent = txns.filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
            const totalIncome = txns.filter(t => t.type === 'income')
                .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
            const txCount = txns.length;

            const catMap = {};
            txns.filter(t => t.type === 'expense').forEach(t => {
                const cat = t.category || 'Other';
                catMap[cat] = (catMap[cat] || 0) + Math.abs(t.amount || 0);
            });
            const sortedCats = Object.entries(catMap)
                .sort((a, b) => b[1] - a[1])
                .map(([name, amount]) => ({ name, amount, pct: totalSpent ? Math.round((amount / totalSpent) * 100) : 0 }));

            const topCategory = sortedCats[0]?.name || '—';

            const daysInPeriod = 30;
            const dailyBurnRate = totalSpent / daysInPeriod;
            const prevSpend = prevTxns.filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
            const prevDailyBurn = prevSpend / daysInPeriod;
            const burnRateChange = prevDailyBurn > 0
                ? ((dailyBurnRate - prevDailyBurn) / prevDailyBurn * 100)
                : 0;

            const netSavings = totalIncome - totalSpent;

            setSummary({
                totalSpent, totalIncome, txCount, topCategory,
                dailyBurnRate, burnRateChange, netSavings,
            });
            setCategories(sortedCats);
            setSavingsGoals(goalsData);
            setLoading(false);
        };

        if (isUsingMock && mockData) {
            setLoading(true);
            const { financialTransactions = [], goalProgress = [] } = mockData;

            const currentTxns = financialTransactions.filter(t => t.date >= thirtyDaysAgo);
            const prevTxns = financialTransactions.filter(t => t.date >= sixtyDaysAgo && t.date < thirtyDaysAgo);

            processData(currentTxns, prevTxns, goalProgress);
            return;
        }

        Promise.all([
            // 30-day transactions
            supabase.from('money_transactions')
                .select('amount, type, category, date')
                .eq('user_id', user.id).gte('date', thirtyDaysAgo),
            // Previous 30-day transactions (for burn rate comparison)
            supabase.from('money_transactions')
                .select('amount, type')
                .eq('user_id', user.id).gte('date', sixtyDaysAgo).lt('date', thirtyDaysAgo),
            // Active savings goals
            supabase.from('savings_goals')
                .select('*')
                .eq('user_id', user.id).eq('status', 'active')
                .order('created_at', { ascending: false }),
        ])
            .then(([currentRes, prevRes, goalsRes]) => {
                processData(currentRes.data || [], prevRes.data || [], goalsRes.data || []);
            })
            .catch((err) => {
                console.error("Pipeline failure in useFinance:", err);
                setError(err);
                setLoading(false);
                throw err;
            });
    }, [user, isUsingMock, mockData]);

    return { summary, categories, savingsGoals, loading, error };
}
