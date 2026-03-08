import React, { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import DailyLogForm from '../components/DailyLogForm';
import PomodoroTimer from '../components/PomodoroTimer';
import MoodTracker from '../components/MoodTracker';
import Streaks from '../components/Streaks';
import MoneyManager from '../components/MoneyManager';
import PersonalCalendar from '../components/PersonalCalendar';
import Reports from '../components/Reports';
import YouTubeIntegration from '../components/YouTubeIntegration';
import ResetsTracker from '../components/ResetsTracker';
import QuickCapture from '../components/dashboard/QuickCapture';
import WinsEngine from '../components/WinsEngine';
import InsightEngine from '../components/InsightEngine';
import MomentumBar from '../components/MomentumBar';
import WeeklyReport from '../components/WeeklyReport';
import ErrorBoundary from '../components/ErrorBoundary';
import HabitsPage from '../components/habits/HabitsPage';
import GoogleCalendarIntegration from '../components/account/GoogleCalendarIntegration';
import AdminPanel from '../components/account/AdminPanel';
import AdminConsole from '../components/account/AdminConsole';
import SessionStats from '../components/SessionStats';
import DSACounter from '../components/DSACounter';
import YearlyHeatmap from '../components/YearlyHeatmap';
import CalendarHeatmap from '../components/calendar/CalendarHeatmap';
import StatCard from '../components/dashboard/StatCard';
import ExpandedStatPanel from '../components/dashboard/ExpandedStatPanel';

import { SettingsSection, SettingsRow } from '../components/dashboard/SettingsSection';
import ToggleSwitch from '../components/dashboard/ToggleSwitch';
import useFeatureFlag from '../hooks/useFeatureFlag';
import DumbbellIcon from '../components/icons/DumbbellIcon';
import { useAuth } from '../hooks/useAuth';
import toast from '../utils/toast';


/* ─── Dashboard ─── */
const Dashboard = ({ user }) => {
    const [expandedCard, setExpandedCard] = useState(null);
    const [activeTab, setActiveTab] = useState(() => {
        const saved = localStorage.getItem('aiimin_activeTab');
        return ['today', 'habits', 'sessions', 'insights', 'settings'].includes(saved) ? saved : 'today';
    });


    const [notifReminders, setNotifReminders] = useState(() => localStorage.getItem('aiimin_notif_reminders') === 'true');
    const [notifInsights, setNotifInsights] = useState(() => localStorage.getItem('aiimin_notif_insights') === 'true');
    const [focusTab, setFocusTab] = useState('focus');
    const [intelTab, setIntelTab] = useState('insights');

    const saveAndSet = (key, setter) => (val) => {
        setter(val);
        localStorage.setItem(key, String(val));
    };

    const devEmail = process.env.REACT_APP_DEV_EMAIL;
    const isAdmin = !!(devEmail && user?.email === devEmail);
    const rawOnboardingStage = user?.onboarding_stage || 0;
    // Admin bypasses all onboarding gates
    const onboardingStage = isAdmin ? 99 : rawOnboardingStage;

    const { session } = useAuth();

    const handleExport = useCallback(async () => {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const tid = toast.loading('Exporting data...');
        try {
            const res = await fetch(`${API_URL}/account/export`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'aiimin-export.json';
            a.click();
            URL.revokeObjectURL(url);
            toast.update(tid, 'Downloaded ✓', 'success');
        } catch (err) {
            toast.update(tid, 'Export failed', 'error');
        }
    }, [session]);

    const handleDeleteAccount = useCallback(async () => {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        if (!window.confirm('This will PERMANENTLY delete all your data. Type DELETE to confirm.')) return;
        const input = window.prompt('Type DELETE to confirm:');
        if (input !== 'DELETE') return;
        const tid = toast.loading('Deleting account...');
        try {
            const res = await fetch(`${API_URL}/account`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ confirm: 'DELETE' }),
            });
            if (res.ok) {
                toast.update(tid, 'Account deleted', 'success');
                setTimeout(() => window.location.reload(), 1000);
            } else {
                toast.update(tid, 'Delete failed', 'error');
            }
        } catch (err) {
            toast.update(tid, 'Delete failed', 'error');
        }
    }, [session]);

    const showStreaks = useFeatureFlag('streaks');
    const showWinTracker = useFeatureFlag('win_tracker');
    const showYouTube = useFeatureFlag('youtube_player');
    const showMonthlyGrid = useFeatureFlag('monthly_grid');

    React.useEffect(() => {
        localStorage.setItem('aiimin_activeTab', activeTab);
    }, [activeTab]);

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

    const statsData = [
        { id: 'score', label: 'Score', icon: '🎯', value: '8.2', type: 'score', context: 'Top 10% this month', contextColor: 'var(--success)' },
        { id: 'sleep', label: 'Sleep', icon: '😴', value: '7.1h', type: 'sleep', context: '+0.4h vs avg', contextColor: 'var(--success)' },
        { id: 'gym', label: 'Gym', icon: <DumbbellIcon size={18} color="var(--text-2)" />, value: '3d', type: 'gym', context: '1 ahead of pace', contextColor: 'var(--accent)' },
        { id: 'focus', label: 'Focus', icon: '🔥', value: '14', type: 'focus', context: 'Peak flow', contextColor: 'var(--success)' },
        { id: 'steps', label: 'Steps', icon: '👟', value: '11k', type: 'steps', context: 'Goal met', contextColor: 'var(--accent)' },
    ];

    const SectionLabel = ({ children }) => (
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {children}
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', paddingTop: '52px', color: 'var(--text-1)' }}>
            <Navbar user={user} activeTab={activeTab} onTabChange={setActiveTab} />

            <main style={{
                maxWidth: 'var(--max-width)',
                margin: '0 auto',
                padding: 'var(--section-gap) var(--container-px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--section-gap)',
            }}>

                {/* ── ZONE 1: HEADER ── */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
                            {getGreeting()}, {firstName}
                        </h1>
                        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px', fontWeight: 500 }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '6px 14px',
                        background: 'var(--success-dim)',
                        border: '1px solid var(--border)',
                        borderRadius: '99px', fontSize: '11px',
                        color: 'var(--success)', fontWeight: 700, flexShrink: 0,
                        textTransform: 'uppercase', letterSpacing: '0.04em'
                    }}>
                        <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '8px', height: '8px' }}>
                            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--success)', opacity: 0.35, animation: 'ping 1.8s ease-out infinite' }} />
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }} />
                        </span>
                        Tracking active
                    </div>
                </div>

                {/* ── TODAY ── */}
                {activeTab === 'today' && (
                    <div style={{ display: 'grid', gap: '24px' }} className="fade-up">

                        {/* ── MOMENTUM BAR ── */}
                        <MomentumBar user={user} />

                        {/* ── ZONE 2: METRICS ROW ── */}
                        {onboardingStage >= 3 ? (
                            <div>
                                <SectionLabel>Today's Overview</SectionLabel>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }} className="metrics-row">
                                    {statsData.map((stat, i) => {
                                        if (stat.id === 'score' && onboardingStage < 4) return null;
                                        return <StatCard key={stat.id} stat={stat} index={i} expandedCard={expandedCard} setExpandedCard={setExpandedCard} />;
                                    })}
                                </div>
                                {expandedCard && (
                                    <div style={{ marginTop: '10px' }}>
                                        <ExpandedStatPanel stat={statsData.find(s => s.id === expandedCard)} user={user} />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{
                                padding: '32px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border)',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '24px', marginBottom: '12px' }}>🔒</div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>Intelligence Locked</div>
                                <p style={{ fontSize: '12px', color: 'var(--text-3)', maxWidth: '240px', margin: '8px auto' }}>
                                    Complete {3 - onboardingStage} more logs to unlock your behavioral overview.
                                </p>
                            </div>
                        )}

                        {/* ── ZONE 3: MAIN GRID (2fr | 1fr) ── */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'stretch' }} className="main-grid">

                            {/* Left Column — Primary Actions */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                                <div>
                                    <SectionLabel>Mood Check-in</SectionLabel>
                                    <MoodTracker user={user} onMoodChange={() => {}} />
                                </div>

                                <div>
                                    <SectionLabel>Focus Engine</SectionLabel>
                                    {onboardingStage >= 1 ? (
                                        <>
                                            {showYouTube && (
                                                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', background: 'var(--bg-elevated)', borderRadius: '8px', padding: '4px' }}>
                                                    <button onClick={() => setFocusTab('focus')} style={{ flex: 1, padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: focusTab === 'focus' ? 'var(--bg-card)' : 'transparent', color: focusTab === 'focus' ? 'var(--text-1)' : 'var(--text-3)', boxShadow: focusTab === 'focus' ? 'var(--shadow-sm)' : 'none' }}>Focus</button>
                                                    <button onClick={() => setFocusTab('music')} style={{ flex: 1, padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: focusTab === 'music' ? 'var(--bg-card)' : 'transparent', color: focusTab === 'music' ? 'var(--text-1)' : 'var(--text-3)', boxShadow: focusTab === 'music' ? 'var(--shadow-sm)' : 'none' }}>Music</button>
                                                </div>
                                            )}
                                            {focusTab === 'focus' && <PomodoroTimer user={user} />}
                                            {focusTab === 'music' && showYouTube && <YouTubeIntegration user={user} />}
                                        </>
                                    ) : (
                                        <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                            <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>Complete your first log to unlock the Focus Timer.</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', background: 'var(--bg-elevated)', borderRadius: '8px', padding: '4px' }}>
                                        <button onClick={() => setIntelTab('insights')} style={{ flex: 1, padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: intelTab === 'insights' ? 'var(--bg-card)' : 'transparent', color: intelTab === 'insights' ? 'var(--text-1)' : 'var(--text-3)', boxShadow: intelTab === 'insights' ? 'var(--shadow-sm)' : 'none' }}>Insights</button>
                                        <button onClick={() => setIntelTab('wins')} style={{ flex: 1, padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: intelTab === 'wins' ? 'var(--bg-card)' : 'transparent', color: intelTab === 'wins' ? 'var(--text-1)' : 'var(--text-3)', boxShadow: intelTab === 'wins' ? 'var(--shadow-sm)' : 'none' }}>Wins</button>
                                    </div>
                                    {intelTab === 'insights' && (
                                        <ErrorBoundary label="Insight Engine">
                                            <InsightEngine user={user} />
                                        </ErrorBoundary>
                                    )}
                                    {intelTab === 'wins' && (
                                        onboardingStage >= 2 ? (
                                            showWinTracker ? <WinsEngine /> : <div style={{ fontSize: '12px', color: 'var(--text-3)', padding: '16px' }}>Enable Wins in feature flags.</div>
                                        ) : (
                                            <div style={{ padding: '32px', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                                <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Available at Stage 2</p>
                                            </div>
                                        )
                                    )}
                                </div>

                                <div style={{ flex: 1, width: '100%' }}>
                                    <SectionLabel>Monthly Overview</SectionLabel>
                                    <CalendarHeatmap year={new Date().getFullYear()} month={new Date().getMonth() + 1} type="score" />
                                </div>

                            </div>

                            {/* Right Column — Daily Interaction */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--card-px)' }}>
                                    <SectionLabel>Daily Log</SectionLabel>
                                    <DailyLogForm user={user} />
                                </div>

                                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--card-px)' }}>
                                    <SectionLabel>Daily Integrity</SectionLabel>
                                    <ResetsTracker user={user} />
                                </div>

                                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--card-px)' }}>
                                    <SectionLabel>Quick Capture</SectionLabel>
                                    <QuickCapture user={user} />
                                </div>

                            </div>
                        </div>

                    </div>
                )}

                {/* ── HABITS & ROUTINES ── */}
                {activeTab === 'habits' && (
                    <HabitsPage user={user} />
                )}

                {/* ── MONEY ── */}
                {activeTab === 'money' && (
                    <div className="fade-up">
                        <MoneyManager user={user} />
                    </div>
                )}

                {/* ── SESSIONS ── */}
                {activeTab === 'sessions' && (
                        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                            <div>
                                <SectionLabel>Session Performance</SectionLabel>
                                <SessionStats user={user} />
                            </div>
                            <div>
                                <SectionLabel>DSA Problem Tracker</SectionLabel>
                                <DSACounter user={user} />
                            </div>
                            <div>
                                <SectionLabel>Schedule & Calendar</SectionLabel>
                                <PersonalCalendar user={user} />
                            </div>
                        </div>
                    )}

                {/* ── INSIGHTS ── */}
                {activeTab === 'insights' && (
                        onboardingStage >= 3 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                                <div className="fade-up">
                                    <SectionLabel>Weekly Intelligence</SectionLabel>
                                    <ErrorBoundary label="Weekly Report">
                                        <WeeklyReport user={user} />
                                    </ErrorBoundary>
                                </div>

                                <div className="fade-up" style={{ animationDelay: '40ms' }}>
                                    <SectionLabel>Tracking Chains</SectionLabel>
                                    {showStreaks ? <Streaks user={user} /> : <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Enable Streaks in feature flags.</div>}
                                </div>

                                <div className="fade-up" style={{ animationDelay: '80ms' }}>
                                    <SectionLabel>Performance Reports</SectionLabel>
                                    {showMonthlyGrid ? <Reports user={user} /> : <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Enable Reports in feature flags.</div>}
                                </div>

                                <div className="fade-up" style={{ animationDelay: '120ms' }}>
                                    <SectionLabel>365-Day Contribution Map</SectionLabel>
                                    <YearlyHeatmap user={user} />
                                </div>

                            </div>
                        ) : (
                            <div style={{ padding: '100px 40px', textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', marginBottom: '20px' }}>📊</div>
                                <h2 style={{ fontSize: '20px', marginBottom: '12px', fontWeight: 800 }}>Establishing Baseline</h2>
                                <p style={{ fontSize: '14px', color: 'var(--text-3)', maxWidth: '300px', margin: '0 auto', lineHeight: 1.5 }}>
                                    AIIMIN requires 7 days of consistency before generating its first behavioral trend report.
                                </p>
                                <div style={{ marginTop: '32px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--accent)', color: 'var(--text-1)', borderRadius: '99px', fontSize: '13px', fontWeight: 700 }}>
                                    Current Progress: {onboardingStage * 25}%
                                </div>
                            </div>
                        )
                    )}

                {/* ── SETTINGS ── */}
                {activeTab === 'settings' && (
                        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            <SettingsSection title="System Controls">
                                <SettingsRow
                                    icon="🔔"
                                    label="Daily Reminders"
                                    description="Morning check-in prompts and evening reflection nudges"
                                    control={<ToggleSwitch checked={notifReminders} onChange={saveAndSet('aiimin_notif_reminders', setNotifReminders)} />}
                                />
                                <SettingsRow
                                    icon="📊"
                                    label="Weekly Insight Digest"
                                    description="Summary of behavioral patterns delivered Sunday evening"
                                    control={<ToggleSwitch checked={notifInsights} onChange={saveAndSet('aiimin_notif_insights', setNotifInsights)} />}
                                />
                            </SettingsSection>

                            {/* S1: Admin tools inline — no floating modal */}
                            {isAdmin && (
                                <SettingsSection title="Admin Tools">
                                    <div style={{ borderBottom: '1px solid var(--border)' }}>
                                        <AdminPanel user={user} onClose={() => { }} />
                                    </div>
                                    <AdminConsole session={session} />
                                </SettingsSection>
                            )}

                            <SettingsSection title="Integrations">
                                <SettingsRow
                                    icon="📅"
                                    label="Google Calendar"
                                    description="Sync events for time-blocking and session scheduling"
                                    control={
                                        <GoogleCalendarIntegration user={user} />
                                    }
                                />
                                <SettingsRow
                                    icon="▶️"
                                    label="YouTube (Focus Music)"
                                    description="Play personal playlists during focus sessions"
                                    control={
                                        <button onClick={() => setActiveTab('sessions')} style={{ fontSize: '11px', color: 'var(--text-3)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '99px', fontWeight: 600, cursor: 'pointer' }}>Manage →</button>
                                    }
                                />
                            </SettingsSection>

                            <SettingsSection title="Data & Privacy">
                                <SettingsRow
                                    icon="📥"
                                    label="Export Your Data"
                                    description="Download all logs, mood entries, and session data as JSON"
                                    control={
                                        <button onClick={handleExport} style={{ padding: '6px 14px', background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                            Export
                                        </button>
                                    }
                                />
                                <SettingsRow
                                    icon="🔒"
                                    label="Privacy & Data Policy"
                                    description="How AIIMIN stores and handles your information"
                                    control={
                                        <a href="/privacy" style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>Read →</a>
                                    }
                                />
                                <SettingsRow
                                    icon="🗑"
                                    label="Delete Account & Data"
                                    description="Permanently removes all data. This cannot be undone."
                                    danger={true}
                                    control={
                                        <button onClick={handleDeleteAccount} style={{ padding: '6px 14px', background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                            Delete
                                        </button>
                                    }
                                />
                            </SettingsSection>

                            <SettingsSection title="Legal">
                                <SettingsRow
                                    label="Privacy Policy"
                                    description="Last updated March 2026"
                                    control={<a href="/privacy" style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>View →</a>}
                                />
                                <SettingsRow
                                    label="Terms of Service"
                                    description="User agreement and acceptable use policy"
                                    control={<a href="/terms" style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>View →</a>}
                                />
                                <SettingsRow
                                    label="App Version"
                                    description="AIIMIN Dashboard · Build 2026.03"
                                    control={<span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600 }}>v2.0.0</span>}
                                />
                            </SettingsSection>

                        </div>
                    )}

            </main>



            <style>{`
                @keyframes ping {
                    0% { transform: scale(1); opacity: 0.35; }
                    75% { transform: scale(2.2); opacity: 0; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                .metrics-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
                .main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start; }
                .analytics-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
                @media (max-width: 1024px) {
                    .main-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 768px) {
                    .metrics-row { grid-template-columns: repeat(2, 1fr) !important; }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
