import React, { useState, useEffect } from 'react';
import { InsightsSection } from '../components/system/DashboardSections';
import { useAuth } from '../hooks/useAuth';
import { useLHSData } from '../hooks/useLHSData';
import supabase from '../utils/supabase';

/**
 * Insights Page — All analytics engines with self-contained data fetching.
 * Surfaces: behavior drivers, drift alerts, forecasts, clusters,
 * archetypes, momentum, performance delta, causal analysis, weekly review.
 */
const Insights = () => {
    const { user, session } = useAuth();
    const { lhsData, reportData, loading: lhsLoading } = useLHSData(session);
    const [recentLogs, setRecentLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toLocaleDateString('en-CA');

        supabase.from('daily_logs').select('*').eq('user_id', user.id)
            .gte('date', sixtyDaysAgo).order('date', { ascending: false })
            .then(({ data }) => setRecentLogs(data || []))
            .finally(() => setLogsLoading(false));
    }, [user]);

    const loading = lhsLoading || logsLoading;

    if (!user) return null;

    if (loading) {
        return (
            <div>
                <h1 className="text-section" style={{ marginBottom: 'var(--space-6)' }}>Insights</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--r-lg)' }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-section" style={{ marginBottom: 'var(--space-6)' }}>Insights</h1>
            <InsightsSection lhsData={lhsData} reportData={reportData} recentLogs={recentLogs} />
        </div>
    );
};

export default Insights;
