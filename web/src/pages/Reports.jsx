import React, { useEffect, useMemo, useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuth } from '../hooks/useAuth';
import { apiGet } from '../utils/api';
import { hasTier } from '../utils/tierGating';
import ReportWorkspace from '../components/reports/ReportWorkspace';
import { DEMO_REPORT, DEMO_REPORT_GEN } from '../utils/reportDemoFixture';

const WINDOWS = [
  { id: '14', label: '14 days', days: 14 },
  { id: '30', label: '30 days', days: 30 },
  { id: '60', label: '60 days', days: 60 },
  { id: '90', label: '90 days', days: 90 },
  { id: 'ytd', label: 'Year to date' },
  { id: 'custom', label: 'Custom' },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function startOfYear() {
  return `${new Date().getFullYear()}-01-01`;
}

function dateDistance(start, end) {
  const a = new Date(`${start}T12:00:00`).getTime();
  const b = new Date(`${end}T12:00:00`).getTime();
  return Math.max(7, Math.min(365, Math.floor((b - a) / 86400000) + 1));
}

export default function Reports() {
  const { user } = useAuth();
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const demoMode = process.env.NODE_ENV !== 'production' && searchParams.get('demo') === '1';
  const { profile } = useUserProfile({ enabled: !demoMode });
  const tier = String(profile?.subscription_tier || 'explore').toLowerCase();
  const effectiveTier = demoMode ? String(searchParams.get('tier') || 'elite').toLowerCase() : tier;
  const canCompare = hasTier(effectiveTier, 'core');
  const canAnalyze = hasTier(effectiveTier, 'pro');
  const canInvestigate = hasTier(effectiveTier, 'elite');
  const [preset, setPreset] = useState(() => (canInvestigate ? '90' : canAnalyze ? '30' : canCompare ? '14' : '7'));
  const [customStart, setCustomStart] = useState(() => new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10));
  const [customEnd, setCustomEnd] = useState(todayKey);
  const [report, setReport] = useState(null);
  const [reportGen, setReportGen] = useState(null);
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState('');

  useEffect(() => {
    setPreset(canInvestigate ? '90' : canAnalyze ? '30' : canCompare ? '14' : '7');
  }, [canAnalyze, canCompare, canInvestigate]);

  const query = useMemo(() => {
    if (!canCompare) return { days: 7, label: 'Last 7 days' };
    if (preset === 'ytd') {
      const start = startOfYear();
      const end = todayKey();
      return { days: dateDistance(start, end), start, end, label: `YTD ${start} → ${end}` };
    }
    if (preset === 'custom') {
      const start = customStart <= customEnd ? customStart : customEnd;
      const end = customStart <= customEnd ? customEnd : customStart;
      return { days: dateDistance(start, end), start, end, label: `${start} → ${end}` };
    }
    const selected = WINDOWS.find((window) => window.id === preset) || WINDOWS[1];
    return { days: selected.days, label: `Last ${selected.days} days` };
  }, [canCompare, customEnd, customStart, preset]);

  const loadReport = async () => {
    if (demoMode) {
      setReport(DEMO_REPORT);
      setReportGen(DEMO_REPORT_GEN);
      setLoading(false);
      setError('');
      return;
    }
    if (!user || user.isGuest) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ days: String(query.days) });
      if (query.start) params.set('start', query.start);
      if (query.end) params.set('end', query.end);
      const data = await apiGet(`/intelligence/report?${params.toString()}`);
      setReport(data);
      if (canInvestigate) {
        try {
          setReportGen(await apiGet('/intelligence/report-gen/status'));
        } catch {
          setReportGen(null);
        }
      }
    } catch (err) {
      setReport(null);
      setError(err.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
    // query is the intentional stable request shape; user/tier changes should reload it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode, user, tier, query.days, query.start, query.end]);

  if (!user && !demoMode) return <div style={{ padding: 40, color: 'var(--color-text-3)' }}>Sign in to view reports.</div>;

  return (
    <div style={{ paddingBottom: 80 }}>
      {demoMode && <div className="report-demo-banner"><span className="report-mono">LOCAL QA FIXTURE</span><strong>Demo data only</strong><span>Not connected to a real account. Try <code>?demo=1&amp;tier=explore|core|pro|elite</code>.</span></div>}
      {canAnalyze && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }} aria-label="Report window">
          {WINDOWS.map((window) => (
            <button
              key={window.id}
              type="button"
              onClick={() => setPreset(window.id)}
              style={{
                border: `1px solid ${preset === window.id ? 'var(--color-accent)' : 'var(--border)'}`,
                background: preset === window.id ? 'color-mix(in srgb, var(--color-accent) 13%, transparent)' : 'var(--bg-elevated)',
                color: 'var(--color-text-1)',
                borderRadius: 999,
                padding: '8px 13px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {window.label}
            </button>
          ))}
        </div>
      )}
      {preset === 'custom' && canAnalyze && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 11, color: 'var(--color-text-3)' }}>Start<input type="date" value={customStart} max={customEnd} onChange={(event) => setCustomStart(event.target.value)} style={{ padding: '9px 10px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--color-text-1)' }} /></label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 11, color: 'var(--color-text-3)' }}>End<input type="date" value={customEnd} min={customStart} max={todayKey()} onChange={(event) => setCustomEnd(event.target.value)} style={{ padding: '9px 10px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--color-text-1)' }} /></label>
        </div>
      )}
      <ReportWorkspace report={report} reportGen={reportGen} tier={effectiveTier} loading={loading} error={error} onRetry={loadReport} />
    </div>
  );
}
