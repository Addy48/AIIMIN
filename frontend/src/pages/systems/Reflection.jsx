import React, { useState, useEffect } from 'react';
import { ReflectionSection } from '../../components/system/DashboardSections';
import { useAuth } from '../../hooks/useAuth';
import supabase from '../../utils/supabase';

/**
 * Reflection System Page — Mood tracking, Journal, Wins, Identity.
 * Self-contained data fetching for recentLogs / pomo / dsa / tx counts.
 */
const Reflection = () => {
    const { user } = useAuth();
    const [recentLogs, setRecentLogs] = useState([]);
    const [pomoCyclesTotal, setPomoCyclesTotal] = useState(0);
    const [dsaCountTotal, setDsaCountTotal] = useState(0);
    const [txCount, setTxCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toLocaleDateString('en-CA');
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toLocaleDateString('en-CA');

        Promise.all([
            supabase.from('daily_logs').select('*').eq('user_id', user.id)
                .gte('date', sixtyDaysAgo).order('date', { ascending: false })
                .then(({ data }) => data || []),
            supabase.from('pomodoro_sessions').select('id').eq('user_id', user.id)
                .gte('started_at', thirtyDaysAgo + 'T00:00:00')
                .then(({ data }) => data?.length || 0),
            supabase.from('dsa_problems').select('id').eq('user_id', user.id)
                .gte('solved_at', thirtyDaysAgo + 'T00:00:00')
                .then(({ data }) => data?.length || 0),
            supabase.from('money_transactions').select('id').eq('user_id', user.id)
                .gte('date', thirtyDaysAgo)
                .then(({ data }) => data?.length || 0),
        ])
            .then(([logs, pomo, dsa, tx]) => {
                setRecentLogs(logs);
                setPomoCyclesTotal(pomo);
                setDsaCountTotal(dsa);
                setTxCount(tx);
            })
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) return null;

    if (loading) {
        return (
            <div>
                <h1 className="text-section" style={{ marginBottom: 'var(--space-6)' }}>Reflection</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton" style={{ height: '100px', borderRadius: 'var(--r-lg)' }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-section" style={{ marginBottom: 'var(--space-6)' }}>Reflection</h1>
            <ReflectionSection
                user={user}
                recentLogs={recentLogs}
                pomoCyclesTotal={pomoCyclesTotal}
                dsaCountTotal={dsaCountTotal}
                txCount={txCount}
            />
        </div>
    );
};

export default Reflection;
