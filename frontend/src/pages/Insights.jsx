import React, { useState, useEffect } from 'react';
import { InsightsSection } from '../components/system/DashboardSections';
import { useAuth } from '../hooks/useAuth';
import { useLHSData } from '../hooks/useLHSData';
import supabase from '../utils/supabase';

const Insights = () => {
  const { user, session } = useAuth();
  const { lhsData, reportData, loading: lhsLoading } = useLHSData(session);
  const [recentLogs, setRecentLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [showReview, setShowReview] = useState(true);

  useEffect(() => {
    if (!user) return;
    const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toLocaleDateString('en-CA');
    supabase.from('daily_logs').select('*').eq('user_id', user.id)
      .gte('date', sixtyDaysAgo).order('date', { ascending: false })
      .then(({ data }) => setRecentLogs(data || []))
      .finally(() => setLogsLoading(false));
  }, [user]);

  if (!user) return null;

  if (lhsLoading || logsLoading) {
    return (
      <div>
        <PageHeader label="Insights · Correlation Engine" title="The signal beneath the days." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '72px' }} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader label="Skills · Proficiency Engine" title="The signal beneath the days." />
      <InsightsSection
        lhsData={lhsData}
        reportData={reportData}
        recentLogs={recentLogs}
        showReview={showReview}
        onDismissReview={() => setShowReview(false)}
      />
    </div>
  );
};

const PageHeader = ({ label, title }) => (
  <div style={{ marginBottom: '40px' }}>
    <div style={{
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--color-text-3)',
      fontFamily: 'var(--font-mono)',
      marginBottom: '8px',
    }}>{label}</div>
    <h1 style={{
      font: 'var(--text-hero)',
      color: 'var(--color-text-1)',
      margin: 0,
      letterSpacing: '-0.02em',
    }}>{title}</h1>
  </div>
);

export { PageHeader };
export default Insights;
