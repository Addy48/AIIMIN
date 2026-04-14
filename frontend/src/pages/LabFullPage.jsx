import React from 'react';
import useLabSummary from '../hooks/useLabSummary';
import './lab/lab.css';

const BADGE_COLORS = {
    unranked: 'var(--color-text-3)',
    bronze: '#C87137',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
};

/* ── Skeleton Loader ─────────────────────────────── */
const Skeleton = ({ width = '100%', height = '16px' }) => (
    <div className="lab-skeleton" style={{ width, height }} />
);

/* ── Metric Card (PRACTICE) ──────────────────────── */
function MetricCard({ title, value, subtitle, mastery, streakDays, trend, emptyText }) {
    const isEmpty = value === null || value === undefined;
    return (
        <div className="lab-metric-card">
            <div className="lab-metric-header">
                <span className="lab-metric-title">{title}</span>
                {mastery && mastery !== 'unranked' && (
                    <span className="lab-badge" style={{ color: BADGE_COLORS[mastery] }}>
                        {mastery.toUpperCase()}
                    </span>
                )}
            </div>
            {isEmpty ? (
                <div className="lab-empty-state">{emptyText || 'No data yet'}</div>
            ) : (
                <>
                    <div className="lab-metric-value">{value}</div>
                    {subtitle && <div className="lab-metric-subtitle">{subtitle}</div>}
                </>
            )}
            {streakDays > 0 && (
                <div className="lab-streak">{streakDays} day streak</div>
            )}
        </div>
    );
}

/* ── Intel Row ───────────────────────────────────── */
function IntelRow({ title, value, subtitle, statusDot, emptyText }) {
    return (
        <div className="lab-intel-row">
            <div className="lab-intel-left">
                <span className="lab-intel-title">{title}</span>
                {subtitle && <span className="lab-intel-subtitle">{subtitle}</span>}
            </div>
            <div className="lab-intel-right">
                {statusDot && statusDot !== 'none' && (
                    <span className={`lab-status-dot lab-dot-${statusDot}`} />
                )}
                {value !== null && value !== undefined ? (
                    <span className="lab-intel-value">{value}</span>
                ) : (
                    <span className="lab-intel-empty">{emptyText || '—'}</span>
                )}
            </div>
        </div>
    );
}

/* ── Audit Row ───────────────────────────────────── */
function AuditRow({ title, value, subtitle, emptyText }) {
    return (
        <div className="lab-audit-row">
            <div className="lab-audit-left">
                <span className="lab-audit-title">{title}</span>
                {subtitle && <span className="lab-audit-subtitle">{subtitle}</span>}
            </div>
            <div className="lab-audit-right">
                {value !== null && value !== undefined ? (
                    <span className="lab-audit-value">{value}</span>
                ) : (
                    <span className="lab-audit-empty">{emptyText || '—'}</span>
                )}
            </div>
        </div>
    );
}

/* ── Main Lab Page ───────────────────────────────── */
export default function LabFullPage() {
    const { data, status, error, retry } = useLabSummary();

    if (status === 'loading') {
        return (
            <div className="lab-page">
                <div className="lab-header">
                    <h1 className="lab-title">The Lab</h1>
                    <span className="lab-subtitle">Iteration on self</span>
                </div>
                <div className="lab-three-column">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="lab-column">
                            <Skeleton height="32px" width="120px" />
                            {[1, 2, 3, 4].map(j => (
                                <div key={j} className="lab-metric-card">
                                    <Skeleton height="20px" width="80%" />
                                    <Skeleton height="40px" width="60%" />
                                    <Skeleton height="14px" width="50%" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="lab-page">
                <div className="lab-error">
                    <h2>Something went wrong</h2>
                    <p>{error?.message}</p>
                    <button className="lab-retry-btn" onClick={retry}>Retry</button>
                </div>
            </div>
        );
    }

    const p = data?.practice || {};
    const intel = data?.intel || {};
    const audit = data?.audit || {};
    const latest = data?.latest_pattern;

    return (
        <div className="lab-page">
            {/* ── Header ── */}
            <div className="lab-header">
                <div>
                    <h1 className="lab-title">The Lab</h1>
                    <span className="lab-subtitle">What's <em>under</em> the dashboard.</span>
                </div>
                <div className="lab-module-count">
                    {status === 'empty' ? '0 modules' : '8 modules'}
                </div>
            </div>

            {/* ── Three-Column Grid ── */}
            <div className="lab-three-column">
                {/* PRACTICE */}
                <div className="lab-column practice-column">
                    <div className="lab-column-header">
                        <span className="lab-column-label">Practice</span>
                        <span className="lab-column-count">04 modules</span>
                    </div>

                    <MetricCard
                        title="Typing speed"
                        value={p.typing?.weekly_best_wpm ? `${p.typing.weekly_best_wpm} WPM` : null}
                        subtitle={p.typing?.mastery !== 'unranked' ? p.typing.mastery : null}
                        mastery={p.typing?.mastery}
                        streakDays={p.typing?.streak_days}
                        emptyText="No tests yet. Aim for 60 WPM at 95% accuracy."
                    />
                    <MetricCard
                        title="Speaking"
                        value={p.speaking?.latest_score ? `${p.speaking.latest_score}/100` : null}
                        subtitle={p.speaking?.last_logged_at ? `Last: ${new Date(p.speaking.last_logged_at).toLocaleDateString()}` : null}
                        mastery={p.speaking?.mastery}
                        emptyText="No logs yet. Record a 60-second response to start."
                    />
                    <MetricCard
                        title="Reaction time"
                        value={p.reaction?.mean_ms_last3 ? `${p.reaction.mean_ms_last3} MS` : null}
                        subtitle={p.reaction?.tests_today > 0 ? `${p.reaction.tests_today} tests today` : null}
                        mastery={p.reaction?.mastery}
                        emptyText="No tests yet. 5 trials per session."
                    />
                    <MetricCard
                        title="Decision scenarios"
                        value={p.decisions?.week_count > 0 ? `W${p.decisions.iso_week || ''}` : null}
                        subtitle={p.decisions?.dominant_domain ? `Domain: ${p.decisions.dominant_domain}` : null}
                        mastery={null}
                        emptyText="No scenarios yet. One scenario takes 90 seconds."
                    />
                </div>

                {/* INTEL */}
                <div className="lab-column intel-column">
                    <div className="lab-column-header">
                        <span className="lab-column-label">Intel & Audit</span>
                        <span className="lab-column-count">04 modules</span>
                    </div>

                    <IntelRow
                        title="Growth dashboard"
                        value={intel.growth_dashboard?.active_correlations > 0
                            ? `${intel.growth_dashboard.active_correlations} active correlations`
                            : null}
                        emptyText="Pattern detection starts at 14 days of data."
                    />
                    <IntelRow
                        title="RC sub-logger"
                        value={intel.rc_sublogger?.last_entry_hours_ago !== null
                            ? `Last ${intel.rc_sublogger.last_entry_hours_ago}h`
                            : null}
                        subtitle="Private"
                        statusDot={intel.rc_sublogger?.status_dot}
                        emptyText="Private"
                    />
                    <IntelRow
                        title="Mindset state · today"
                        value={intel.mindset_state?.state || null}
                        subtitle={intel.mindset_state?.logged_at_hour !== null
                            ? `Logged ${String(intel.mindset_state.logged_at_hour).padStart(2, '0')}:00`
                            : null}
                        emptyText="..."
                    />
                    <IntelRow
                        title="Insights"
                        value={intel.insights?.unread_count > 0
                            ? `${intel.insights.unread_count} unread`
                            : (intel.insights?.total_count > 0 ? 'All read' : null)}
                        emptyText="Pattern detection starts at 14 days of data."
                    />
                </div>

                {/* AUDIT */}
                <div className="lab-column audit-column">
                    <div className="lab-column-header">
                        <span className="lab-column-label">Audit</span>
                        <span className="lab-column-count">03 modules</span>
                    </div>

                    <AuditRow
                        title={`Belief inventory · ${audit.belief_inventory?.current_quarter || 'Q1'}`}
                        value={`${audit.belief_inventory?.completed || 0} of ${audit.belief_inventory?.total || 6}`}
                        subtitle={audit.belief_inventory?.completed_domains?.length > 0
                            ? audit.belief_inventory.completed_domains.join(', ')
                            : null}
                        emptyText="First belief audit opens at quarter start."
                    />
                    <AuditRow
                        title="Pattern flags"
                        value={audit.pattern_flags?.flagged_count > 0
                            ? `${audit.pattern_flags.flagged_count} needs review`
                            : null}
                        emptyText="No flags yet."
                    />
                    <AuditRow
                        title="Quarterly review"
                        value={audit.quarterly_review?.days_until !== undefined
                            ? `${audit.quarterly_review.days_until}d`
                            : null}
                        subtitle={`${audit.quarterly_review?.quarter_progress_pct || 0}% through quarter`}
                    />
                </div>
            </div>

            {/* ── Bottom Bar: Latest Pattern ── */}
            {latest && (
                <div className="lab-bottom-bar">
                    <span className="lab-bottom-icon">❝</span>
                    <span className="lab-bottom-text">
                        {latest.headline}
                    </span>
                    {!latest.is_read && (
                        <span className="lab-bottom-action">OPEN →</span>
                    )}
                </div>
            )}
        </div>
    );
}
