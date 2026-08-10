import React, { useState } from 'react';
import ErrorBoundary from '../system/ErrorBoundary';
import WeeklyLifeReview from '../growth/WeeklyLifeReview';
import SideQuests from '../growth/SideQuests';
import InsightEngine from '../InsightEngine';
import CausalNodeAnalysis from '../growth/CausalNodeAnalysis';
import { useAuth } from '../../hooks/useAuth';
import { useLHSData } from '../../hooks/useLHSData';
import { useDailyLogsRange } from '../../hooks/useDailyLogsQuery';
import { useCorrelationsQuery } from '../../hooks/useCorrelationsQuery';

/**
 * Patterns — former Insights tab, grounded in live logs + intelligence report.
 * Dropped fake "Advanced Practitioner / Top 4%" vanity chrome.
 */
export default function PatternsPanel({ report }) {
  const { user, session } = useAuth();
  const { lhsData, reportData } = useLHSData(session);
  const { logsAsc: recentLogs } = useDailyLogsRange(60, { enabled: Boolean(user?.id && !user.isGuest) });
  const { correlations } = useCorrelationsQuery({ enabled: Boolean(user?.id && !user.isGuest) });
  const [showReview, setShowReview] = useState(true);

  const drivers = report?.behaviorDrivers || reportData?.behaviorDrivers || [];
  const actions = report?.actionPlan || reportData?.actionPlan || reportData?.executiveSummary?.recommendations || [];
  const diagnostics = report?.systemDiagnostics || reportData?.systemDiagnostics || [];
  const lhs = report?.lhs || lhsData;
  const scores = lhs?.systemScores || report?.lifeHealthRadar || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-3)', maxWidth: 620 }}>
        Behavioral patterns pulled from your logs and the same intelligence window as the Report tab.
        This replaced the standalone Insights page.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
        {['physical', 'cognitive', 'discipline', 'financial', 'emotional'].map((key) => (
          <div key={key} style={{ padding: 16, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-3)' }}>{key}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text-1)', marginTop: 4 }}>
              {Math.round(Number(scores[key]) || 0)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <section style={{ padding: 22, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--color-text-1)' }}>Behavior drivers</h3>
          <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--color-text-2)', fontSize: 13, lineHeight: 1.55 }}>
            {(Array.isArray(drivers) ? drivers : []).slice(0, 6).map((d) => (
              <li key={d.label || d.behaviorLabel}>{d.label || d.behaviorLabel}</li>
            ))}
            {!drivers?.length && <li>Need a few denser log weeks before drivers sharpen.</li>}
          </ul>
        </section>
        <section style={{ padding: 22, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--color-text-1)' }}>Action plan</h3>
          <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--color-text-2)', fontSize: 13, lineHeight: 1.55 }}>
            {(Array.isArray(actions) ? actions : []).slice(0, 6).map((a) => (
              <li key={typeof a === 'string' ? a : a?.text || JSON.stringify(a)}>
                {typeof a === 'string' ? a : (a?.text || a?.summary || 'Review')}
              </li>
            ))}
            {!actions?.length && <li>Keep logging — plan densifies with the Report window.</li>}
          </ul>
        </section>
        <section style={{ padding: 22, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--color-text-1)' }}>Diagnostics</h3>
          <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--color-text-2)', fontSize: 13, lineHeight: 1.55 }}>
            {(Array.isArray(diagnostics) ? diagnostics : []).slice(0, 5).map((item, i) => (
              <li key={item.metric || item.summary || i}>{item.summary || item.metric || String(item)}</li>
            ))}
            {!diagnostics?.length && <li>No diagnostic flags for this window.</li>}
          </ul>
        </section>
      </div>

      {user && !user.isGuest && (
        <section style={{ padding: 8, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div style={{ padding: '12px 16px 0', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-3)' }}>
            Signal correlations
          </div>
          <ErrorBoundary label="Causal correlations">
            <CausalNodeAnalysis correlations={correlations} logs={recentLogs} />
          </ErrorBoundary>
        </section>
      )}

      {user && !user.isGuest && (
        <section style={{ padding: 8, borderRadius: 16, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div style={{ padding: '12px 16px 0', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-3)' }}>
            Pattern engine
          </div>
          <ErrorBoundary label="Insight engine">
            <InsightEngine user={user} />
          </ErrorBoundary>
        </section>
      )}

      {showReview && (
        <section>
          <ErrorBoundary label="Weekly Life Review">
            <WeeklyLifeReview
              onDismiss={() => setShowReview(false)}
              reviewOverride={actions?.length ? {
                diagnosis: (diagnostics || []).map((item) => item.summary || item.metric).filter(Boolean),
                currentWeek: {
                  avgSleep: lhs?.baseMetrics?.sleepScore ? (lhs.baseMetrics.sleepScore / 20) : 0,
                  avgFocus: lhs?.baseMetrics?.focusScore ? (lhs.baseMetrics.focusScore / 25) : 0,
                  avgSteps: recentLogs.length
                    ? recentLogs.reduce((sum, log) => sum + Number(log.steps || 0), 0) / recentLogs.length
                    : 0,
                },
                previousWeek: { avgSleep: 0, avgFocus: 0, avgSteps: 0 },
              } : null}
            />
          </ErrorBoundary>
        </section>
      )}

      <section>
        <ErrorBoundary label="Side Quests">
          <SideQuests recentLogs={recentLogs} />
        </ErrorBoundary>
      </section>
    </div>
  );
}
