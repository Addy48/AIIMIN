import React from 'react';
import DailyLogForm from '../DailyLogForm';
import PomodoroTimer from '../PomodoroTimer';
import MoodTracker from '../MoodTracker';
import Streaks from '../Streaks';
import MoneyManager from '../MoneyManager';
import PersonalCalendar from '../PersonalCalendar';
import Reports from '../Reports';
import SpotifyPlayer from '../SpotifyPlayer';
import QuickCapture from '../dashboard/QuickCapture';
import WinsEngine from '../WinsEngine';
import MomentumBar from '../MomentumBar';
import ErrorBoundary from './ErrorBoundary';
import HabitsPage from '../habits/HabitsPage';
import AdminPanel from '../account/AdminPanel';
import AdminConsole from '../account/AdminConsole';
import SessionStats from '../SessionStats';
import DSACounter from '../DSACounter';
import YearlyHeatmap from '../YearlyHeatmap';
import SleepAnalytics from '../SleepAnalytics';
import StatCard from '../dashboard/StatCard';
import ExpandedStatPanel from '../dashboard/ExpandedStatPanel';
import DesktopXPBar from '../dashboard/DesktopXPBar';
import DailyQuests from '../mobile/DailyQuests';
import AchievementsGallery from '../mobile/AchievementsGallery';
import DailyQuote from '../dashboard/DailyQuote';
import IdentityStack from '../identity/IdentityStack';
import AspirationMeters from '../identity/AspirationMeters';
import PhaseTagger from '../identity/PhaseTagger';
import IdentityTrajectory from '../identity/IdentityTrajectory';
import SideQuests from '../growth/SideQuests';
import DailyIntention from '../growth/DailyIntention';
import PerformanceDeltaHub from '../growth/PerformanceDeltaHub';
import OneBetterNudge from '../growth/OneBetterNudge';
import CausalNodeAnalysis from '../growth/CausalNodeAnalysis';
import WeeklyLifeReview from '../growth/WeeklyLifeReview';
import { SettingsSection, SettingsRow } from '../dashboard/SettingsSection';
import ToggleSwitch from '../dashboard/ToggleSwitch';
import SystemHealthRings from '../dashboard/SystemHealthRings';
import SystemBottleneckCard from '../dashboard/SystemBottleneckCard';
import DayArchetypes from '../dashboard/DayArchetypes';
import SystemOverviewStrip from './SystemOverviewStrip';

const SectionLabel = ({ children, anchor, icon }) => (
    <div id={anchor} style={{
        fontSize: '14px',
        fontWeight: 800,
        color: 'var(--text-1)',
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        margin: '48px 0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        scrollMarginTop: '100px',
    }}>
        <span style={{ fontSize: '20px' }}>{icon}</span> {children}
        <div style={{ flex: 1, height: '1px', background: 'var(--border)', opacity: 0.5 }} />
    </div>
);

export function OverviewSection({ user, firstName, statsData, expandedCard, setExpandedCard, desktopLogSnapshot, todayStr, lhsData, reportData }) {
    const trends = reportData?.trendAnalysis?.forecast?.sevenDays || {};
    const trendMap = {
        physical: trends.lhs?.slope || 0,
        cognitive: trends.focus_cycles?.slope || 0,
        discipline: trends.lhs?.slope || 0,
        financial: (trends.spending?.slope || 0) * -1,
        emotional: trends.mood?.slope || 0,
    };

    return (
        <div id="sys-overview" style={{ scrollMarginTop: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
                    Personal OS, <span style={{ color: 'var(--accent)' }}>{firstName}</span>
                </h1>
                <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-3)',
                    padding: '5px 14px',
                    borderRadius: '99px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border-gold)',
                }}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
            </div>

            <DesktopXPBar user={user} />
            <SystemOverviewStrip scores={lhsData?.systemScores} trends={trendMap} />
            <SystemHealthRings scores={lhsData?.systemScores} trends={trendMap} drift={reportData?.stabilityAndDrift} />
            <SystemBottleneckCard scores={lhsData?.systemScores} drift={reportData?.stabilityAndDrift || []} />
            <MomentumBar user={user} />
            <DailyQuests dateStr={todayStr} logData={desktopLogSnapshot} />
            <DailyQuote logSnapshot={desktopLogSnapshot} />

            <div style={{ marginTop: '24px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '12px' }}>
                    Daily Pulse
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }} className="metrics-row">
                    {statsData.map((stat, index) => (
                        <StatCard key={stat.id} stat={stat} index={index} expandedCard={expandedCard} setExpandedCard={setExpandedCard} />
                    ))}
                </div>
                {expandedCard && (
                    <div style={{ marginTop: '10px' }}>
                        <ExpandedStatPanel stat={statsData.find((item) => item.id === expandedCard)} user={user} />
                    </div>
                )}
            </div>
        </div>
    );
}

export function PhysicalSection({ user }) {
    return (
        <div id="sys-physical" style={{ scrollMarginTop: '100px' }}>
            <SectionLabel icon="🦾">Physical System</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="glass-panel-gold" style={{ borderRadius: 'var(--r-lg)', padding: 'var(--card-px)' }}>
                    <DailyLogForm user={user} />
                </div>
                <ErrorBoundary label="Sleep Analytics">
                    <SleepAnalytics user={user} />
                </ErrorBoundary>
            </div>
        </div>
    );
}

export function CognitiveSection({ user }) {
    return (
        <div id="sys-cognitive" style={{ scrollMarginTop: '100px' }}>
            <SectionLabel icon="🧠">Cognitive System</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'stretch' }}>
                <div style={{ height: '390px' }}>
                    <div className="glass-panel-gold" style={{ borderRadius: 'var(--r-lg)', padding: '24px 20px', height: '100%' }}>
                        <PomodoroTimer user={user} />
                    </div>
                </div>
                <div style={{ height: '390px' }}>
                    <div className="glass-panel" style={{ borderRadius: 'var(--r-lg)', padding: '24px 20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <SpotifyPlayer />
                    </div>
                </div>
            </div>
            <div style={{ marginTop: '24px' }}>
                <SessionStats user={user} />
            </div>
            <div style={{ marginTop: '24px' }}>
                <DSACounter user={user} />
            </div>
        </div>
    );
}

export function BehaviorSection({ user }) {
    return (
        <div id="sys-behavior" style={{ scrollMarginTop: '100px' }}>
            <SectionLabel icon="🔄">Behavior System</SectionLabel>
            <HabitsPage user={user} />
            <div style={{ marginTop: '24px' }}>
                <Streaks user={user} />
            </div>
            <div style={{ marginTop: '24px' }}>
                <YearlyHeatmap user={user} />
            </div>
        </div>
    );
}

export function FinancialSection({ user }) {
    return (
        <div id="sys-financial" style={{ scrollMarginTop: '100px' }}>
            <SectionLabel icon="💰">Financial System</SectionLabel>
            <MoneyManager user={user} />
        </div>
    );
}

export function ReflectionSection({ user, recentLogs, pomoCyclesTotal, dsaCountTotal, txCount }) {
    return (
        <div id="sys-reflection" style={{ scrollMarginTop: '100px' }}>
            <SectionLabel icon="👁">Reflection System</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <MoodTracker user={user} onMoodChange={() => { }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="glass-panel" style={{ borderRadius: 'var(--r-lg)', padding: 'var(--card-px)' }}>
                        <QuickCapture user={user} />
                    </div>
                    <WinsEngine />
                </div>
                <PhaseTagger />
                <IdentityTrajectory logs={recentLogs} />
                <ErrorBoundary label="Identity Stack">
                    <IdentityStack />
                </ErrorBoundary>
                <ErrorBoundary label="Aspiration Meters">
                    <AspirationMeters recentLogs={recentLogs} pomoCycles={pomoCyclesTotal} dsaCount={dsaCountTotal} txCount={txCount} />
                </ErrorBoundary>
            </div>
        </div>
    );
}

export function InsightsSection({ lhsData, reportData, recentLogs, showReview, onDismissReview }) {
    return (
        <div id="sys-insights" style={{ scrollMarginTop: '100px' }}>
            <SectionLabel icon="🔭">Insights</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <DayArchetypes archetypes={reportData?.archetypes} logs={recentLogs} />
                    <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--r-lg)', background: 'var(--bg-card)' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                            Peak Day Summary
                        </div>
                        {reportData?.bestVsWorstDay?.bestDay ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>Date</div>
                                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gold)' }}>{reportData.bestVsWorstDay.bestDay.date || 'N/A'}</div>
                                </div>
                                <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>Sleep</div>
                                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gold)' }}>{reportData.bestVsWorstDay.bestDay.sleep_hours || reportData.bestVsWorstDay.bestDay.sleep || 0}h</div>
                                </div>
                                <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>Mood Score</div>
                                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gold)' }}>{reportData.bestVsWorstDay.bestDay.mood || 0}/10</div>
                                </div>
                                <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>Focus</div>
                                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--gold)' }}>{reportData.bestVsWorstDay.bestDay.pomodoro_minutes || reportData.bestVsWorstDay.bestDay.focus || 0}m</div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>Your peak day will appear once consistent data is logged.</div>
                        )}
                    </div>
                </div>
                <DailyIntention />
                {recentLogs.length > 0 && <OneBetterNudge recentLogs={recentLogs} />}
                <ErrorBoundary label="Side Quests">
                    <SideQuests recentLogs={recentLogs} />
                </ErrorBoundary>
                <div className="analytics-grid">
                    <PerformanceDeltaHub recentLogs={recentLogs} />
                    <ErrorBoundary label="Causal Node Analysis">
                        <CausalNodeAnalysis behaviorDrivers={reportData?.behaviorDrivers} />
                    </ErrorBoundary>
                </div>
                {showReview && (
                    <ErrorBoundary label="Weekly Life Review">
                        <WeeklyLifeReview
                            onDismiss={onDismissReview}
                            reviewOverride={reportData?.actionPlan ? {
                                diagnosis: reportData.systemDiagnostics?.map((item) => item.summary || item.metric) || [],
                                currentWeek: {
                                    avgSleep: lhsData?.baseMetrics?.sleepScore ? (lhsData.baseMetrics.sleepScore / 20) : 0,
                                    avgFocus: lhsData?.baseMetrics?.focusScore ? (lhsData.baseMetrics.focusScore / 25) : 0,
                                    avgSteps: recentLogs.length ? recentLogs.reduce((sum, log) => sum + Number(log.steps || 0), 0) / recentLogs.length : 0,
                                },
                                previousWeek: { avgSleep: 0, avgFocus: 0, avgSteps: 0 },
                            } : null} />
                    </ErrorBoundary>
                )}
            </div>
        </div>
    );
}

export function ReportsSection({ user }) {
    return (
        <div id="sys-reports" style={{ scrollMarginTop: '100px' }}>
            <SectionLabel icon="📄">Reports</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <Reports user={user} />
                <div style={{ marginTop: '24px' }}>
                    <AchievementsGallery user={user} />
                </div>
            </div>
        </div>
    );
}

export function SettingsPanelSection({ user, isAdmin, session, notifReminders, notifInsights, onRemindersChange, onInsightsChange, onExport, onDelete }) {
    return (
        <div id="sys-settings" style={{ scrollMarginTop: '100px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <SettingsSection title="Notifications">
                    <SettingsRow
                        label="Daily Reminders"
                        description="Morning check-in prompts and evening reflection nudges"
                        control={<ToggleSwitch checked={notifReminders} onChange={onRemindersChange} />}
                    />
                    <SettingsRow
                        label="Weekly Insight Digest"
                        description="Summary of behavioral patterns delivered Sunday evening"
                        control={<ToggleSwitch checked={notifInsights} onChange={onInsightsChange} />}
                    />
                </SettingsSection>

                {isAdmin && (
                    <SettingsSection title="Admin Tools">
                        <div style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <AdminPanel user={user} onClose={() => { }} />
                        </div>
                        <AdminConsole session={session} />
                    </SettingsSection>
                )}

                <SettingsSection title="Data & Privacy">
                    <SettingsRow
                        label="Export Your Data"
                        description="Download all logs, mood entries, and session data as JSON"
                        control={
                            <button onClick={onExport} style={{
                                padding: '6px 14px',
                                background: 'var(--color-accent-dim)',
                                color: 'var(--color-accent)',
                                border: '1px solid var(--color-border-lit)',
                                borderRadius: 'var(--r-sm)',
                                font: '500 11px/1 var(--font-mono)',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                            }}>Export</button>
                        }
                    />
                    <SettingsRow
                        label="Delete Account & Data"
                        description="Permanently removes all data. This cannot be undone."
                        danger={true}
                        control={
                            <button onClick={onDelete} style={{
                                padding: '6px 14px',
                                background: 'rgba(239,68,68,0.08)',
                                color: 'var(--color-alert-red)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--r-sm)',
                                font: '500 11px/1 var(--font-mono)',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                            }}>Delete</button>
                        }
                    />
                </SettingsSection>
            </div>
        </div>
    );
}
