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

function DayProgressBar() {
    const [progress, setProgress] = React.useState(0);
    const [timeStr, setTimeStr] = React.useState('');

    React.useEffect(() => {
        const update = () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            const diff = now - start;
            const dayMs = 24 * 60 * 60 * 1000;
            setProgress((diff / dayMs) * 100);
            setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        update();
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--color-border)',
            padding: '16px 24px',
            borderRadius: '20px',
            marginBottom: '24px',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Temporal Drift · {timeStr}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                    {Math.round(progress)}% Complete
                </span>
            </div>
            <div style={{ height: '6px', background: 'var(--bg-elevated)', borderRadius: '99px', overflow: 'hidden' }}>
                <div
                    style={{ 
                        height: '100%', 
                        background: 'var(--accent)', 
                        borderRadius: '99px', 
                        width: `${progress}%`,
                        transition: 'width 1s ease-in-out',
                        boxShadow: '0 0 12px var(--accent-alpha)' 
                    }}
                />
            </div>
        </div>
    );
}

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.04em', lineHeight: 1.1, margin: 0, fontFamily: 'var(--font-serif)' }}>
                        System Overview
                    </h1>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px', fontWeight: 500 }}>
                        Hey <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Adi</span>. All systems operational.
                    </div>
                </div>
                <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--gold)',
                    padding: '8px 20px',
                    borderRadius: '12px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    backdropFilter: 'blur(10px)'
                }}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <DayProgressBar />
            <DesktopXPBar user={user} />
            <SystemOverviewStrip scores={lhsData?.systemScores} trends={trendMap} />
            <SystemHealthRings scores={lhsData?.systemScores} trends={trendMap} drift={reportData?.stabilityAndDrift} />
            <SystemBottleneckCard scores={lhsData?.systemScores} drift={reportData?.stabilityAndDrift || []} />
            <MomentumBar user={user} />
            <DailyQuests dateStr={todayStr} logData={desktopLogSnapshot} />
            <DailyQuote logSnapshot={desktopLogSnapshot} />

            <div style={{ marginTop: '24px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '12px' }}>
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
            <div className="glass-panel" style={{ borderRadius: 'var(--r-lg)', padding: 'var(--card-px)' }}>
                <MoneyManager user={user} />
            </div>
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
    const text1 = 'var(--color-text-1)';
    const text2 = 'var(--color-text-2)';
    const text3 = 'var(--color-text-3)';
    const border = 'var(--color-border)';
    const accent = 'var(--color-accent)';

    return (
        <div id="sys-skills" style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '60px' }}>
            
            {/* ── Mastery Header ── */}
            <header style={{ 
                textAlign: 'center', 
                padding: '60px 40px', 
                borderRadius: '32px', 
                background: 'var(--bg-card)', 
                border: `1px solid ${border}`,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(to right, ${accent}, #3B82F6, #8B5CF6)` }} />
                <div style={{ fontSize: '11px', fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '16px' }}>Mastery Quotient · AIIMIN V2</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
                   <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                        <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                            <circle cx="18" cy="18" r="16" fill="none" stroke={border} strokeWidth="2" />
                            <circle cx="18" cy="18" r="16" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="100" strokeDashoffset={100 - 74} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800, color: text1 }}>74</div>
                   </div>
                   <div style={{ textAlign: 'left' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: 800, color: text1, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Advanced Practitioner</h2>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: text3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} /> Stage III Growth
                            </span>
                            <span style={{ color: text3, opacity: 0.3 }}>|</span>
                            <span style={{ fontSize: '12px', color: text3, fontWeight: 600 }}>Top 4% of users</span>
                        </div>
                   </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* ── Cognitive Mastery ── */}
                <section className="glass-panel" style={{ padding: '32px', borderRadius: '24px', border: `1px solid ${border}`, background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: text1, margin: 0 }}>Cognitive Logic</h3>
                        <div style={{ padding: '4px 10px', borderRadius: '20px', background: '#3B82F615', color: '#3B82F6', fontSize: '11px', fontWeight: 800 }}>Lvl 14</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-elevated)', border: `1px solid ${border}` }}>
                            <div style={{ fontSize: '10px', color: text3, textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>Processing Speed</div>
                            <div style={{ fontSize: '24px', fontWeight: 800 }}>84 <span style={{ fontSize: '12px', color: text3 }}>WPM</span></div>
                            <div style={{ fontSize: '10px', color: '#10B981', marginTop: '4px', fontWeight: 700 }}>↑ 4.2% from last week</div>
                        </div>
                        <div style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-elevated)', border: `1px solid ${border}` }}>
                            <div style={{ fontSize: '10px', color: text3, textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>Pattern Recognition</div>
                            <div style={{ fontSize: '24px', fontWeight: 800 }}>142 <span style={{ fontSize: '12px', color: text3 }}>DSA</span></div>
                            <div style={{ fontSize: '10px', color: '#10B981', marginTop: '4px', fontWeight: 700 }}>Mastery: 92%</div>
                        </div>
                    </div>
                    <div style={{ height: '140px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { name: 'M', val: 72 }, { name: 'T', val: 75 }, { name: 'W', val: 73 }, 
                                { name: 'T', val: 78 }, { name: 'F', val: 82 }, { name: 'S', val: 84 }
                            ]}>
                                <defs>
                                    <linearGradient id="colorCognitive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={2} fill="url(#colorCognitive)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* ── Disciplinary Integrity ── */}
                <section className="glass-panel" style={{ padding: '32px', borderRadius: '24px', border: `1px solid ${border}`, background: 'var(--bg-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: text1, margin: 0 }}>Willpower & Routine</h3>
                        <div style={{ padding: '4px 10px', borderRadius: '20px', background: '#8B5CF615', color: '#8B5CF6', fontSize: '11px', fontWeight: 800 }}>Lvl 21</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { label: 'Morning Ritual', val: 98, color: '#10B981' },
                            { label: 'Focus Blocks', val: 85, color: '#8B5CF6' },
                            { label: 'Deep Work Integrity', val: 92, color: '#F59E0B' },
                        ].map(item => (
                            <div key={item.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: 600 }}>
                                    <span style={{ color: text2 }}>{item.label}</span>
                                    <span style={{ color: text1 }}>{item.val}%</span>
                                </div>
                                <div style={{ height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.val}%` }} style={{ height: '100%', background: item.color, borderRadius: '3px' }} transition={{ duration: 1 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '32px', padding: '16px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                        <div style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 800, marginBottom: '4px' }}>INSIGHT</div>
                        <div style={{ fontSize: '12px', color: text2, lineHeight: 1.5 }}>Your discipline is highest between 06:00 and 10:00. Use this window for your most complex tasks.</div>
                    </div>
                </section>
            </div>

            {/* ── Vitality Section ── */}
            <section className="glass-panel" style={{ padding: '40px', borderRadius: '32px', border: `1px solid ${border}`, background: 'var(--bg-card)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: text1, margin: '0 0 4px 0' }}>Physical Resilience Engine</h2>
                        <p style={{ fontSize: '13px', color: text3, margin: 0 }}>Biological recovery metrics and vitality tracking.</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>68 <span style={{ fontSize: '14px', color: text3 }}>/ 100</span></div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>Optimal State</div>
                    </div>
                 </div>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div style={{ padding: '24px', borderRadius: '20px', background: 'var(--bg-elevated)', border: `1px solid ${border}`, textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>😴</div>
                        <div style={{ fontSize: '11px', color: text3, textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px' }}>Sleep Efficiency</div>
                        <div style={{ fontSize: '24px', fontWeight: 800 }}>82%</div>
                    </div>
                    <div style={{ padding: '24px', borderRadius: '20px', background: 'var(--bg-elevated)', border: `1px solid ${border}`, textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚶</div>
                        <div style={{ fontSize: '11px', color: text3, textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px' }}>Active Volume</div>
                        <div style={{ fontSize: '24px', fontWeight: 800 }}>12.4k <span style={{ fontSize: '12px', color: text3 }}>steps</span></div>
                    </div>
                    <div style={{ padding: '24px', borderRadius: '20px', background: 'var(--bg-elevated)', border: `1px solid ${border}`, textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
                        <div style={{ fontSize: '11px', color: text3, textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px' }}>Recovery Score</div>
                        <div style={{ fontSize: '24px', fontWeight: 800 }}>High</div>
                    </div>
                 </div>
            </section>

            {/* Weekly Review Toggle */}
            {showReview && (
                <section style={{ borderTop: `1px solid ${border}`, paddingTop: '40px' }}>
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

export function SettingsPanelSection({ user, isAdmin, session, notifReminders, notifInsights, onRemindersChange, onInsightsChange, onExport, onDeleteData, onDelete }) {
    return (
        <div id="sys-settings" style={{ scrollMarginTop: '100px' }}>
            <SectionLabel icon="⚙️">Settings</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <SettingsSection title="System Controls">
                    <SettingsRow
                        icon="🔔"
                        label="Daily Reminders"
                        description="Morning check-in prompts and evening reflection nudges"
                        control={<ToggleSwitch checked={notifReminders} onChange={onRemindersChange} />}
                    />
                    <SettingsRow
                        icon="📊"
                        label="Weekly Insight Digest"
                        description="Summary of behavioral patterns delivered Sunday evening"
                        control={<ToggleSwitch checked={notifInsights} onChange={onInsightsChange} />}
                    />
                </SettingsSection>

                {isAdmin && (
                    <SettingsSection title="Admin Tools">
                        <div style={{ borderBottom: '1px solid var(--border)' }}>
                            <AdminPanel user={user} onClose={() => { }} />
                        </div>
                        <AdminConsole session={session} />
                    </SettingsSection>
                )}



                <SettingsSection title="Data & Privacy">
                    <SettingsRow
                        icon="📥"
                        label="Export Your Data"
                        description="Download all logs, mood entries, and session data as JSON"
                        control={<button onClick={onExport} style={{ padding: '6px 14px', background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Export</button>}
                    />
                    <SettingsRow
                        icon="🧹"
                        label="Wipe Tracked Data"
                        description="Deletes all your logs and metrics but keeps your account intact."
                        danger={true}
                        control={<button onClick={onDeleteData} style={{ padding: '6px 14px', background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Wipe Data</button>}
                    />
                    <SettingsRow
                        icon="🗑"
                        label="Delete Account & Data"
                        description="Permanently removes all data. This cannot be undone."
                        danger={true}
                        control={<button onClick={onDelete} style={{ padding: '6px 14px', background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Delete</button>}
                    />
                </SettingsSection>
            </div>
        </div>
    );
}
