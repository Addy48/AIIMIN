import React, { useState, useCallback, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DailyLogForm from '../components/DailyLogForm';
import PomodoroTimer from '../components/PomodoroTimer';
import MoodTracker from '../components/MoodTracker';
import Streaks from '../components/Streaks';
import MoneyManager from '../components/MoneyManager';
import PersonalCalendar from '../components/PersonalCalendar';
import Reports from '../components/Reports';
import SpotifyPlayer from '../components/SpotifyPlayer';
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
import SleepAnalytics from '../components/SleepAnalytics';
import StatCard from '../components/dashboard/StatCard';
import ExpandedStatPanel from '../components/dashboard/ExpandedStatPanel';
import DesktopXPBar from '../components/dashboard/DesktopXPBar';
import DailyQuests from '../components/mobile/DailyQuests';
import AchievementsGallery from '../components/mobile/AchievementsGallery';
import DailyQuote from '../components/dashboard/DailyQuote';

// Tier 2 — Identity Layer
import IdentityStack from '../components/identity/IdentityStack';
import AspirationMeters from '../components/identity/AspirationMeters';
import MirrorVision from '../components/identity/MirrorVision';
import PhaseTagger from '../components/identity/PhaseTagger';
// Tier 3 — Growth Engine
import SideQuests from '../components/growth/SideQuests';
import DailyIntention from '../components/growth/DailyIntention';
import PastSelfCard from '../components/growth/PastSelfCard';
import WeeklyReview from '../components/growth/WeeklyReview';
import OneBetterNudge from '../components/growth/OneBetterNudge';
// Tier 4 — Legacy
import LifeChronicle from '../components/legacy/LifeChronicle';
import HabitDNA from '../components/legacy/HabitDNA';

import { SettingsSection, SettingsRow } from '../components/dashboard/SettingsSection';
import ToggleSwitch from '../components/dashboard/ToggleSwitch';
import DumbbellIcon from '../components/icons/DumbbellIcon';
import { useAuth } from '../hooks/useAuth';
import { API_URL } from '../utils/api';
import supabase from '../utils/supabase';
import toast from '../utils/toast';


/* ─── Dashboard ─── */
const Dashboard = ({ user }) => {
    const [expandedCard, setExpandedCard] = useState(null);
    const [activeTab, setActiveTab] = useState(() => {
        const saved = localStorage.getItem('aiimin_activeTab');
        return ['today', 'focus', 'identity', 'growth', 'habits', 'money', 'analytics', 'settings'].includes(saved) ? saved : 'today';
    });

    const [showWeeklyReview, setShowWeeklyReview] = useState(false);
    const [recentLogs, setRecentLogs] = useState([]);
    const [pomoCyclesTotal, setPomoCyclesTotal] = useState(0);
    const [dsaCountTotal, setDsaCountTotal] = useState(0);
    const [txCount, setTxCount] = useState(0);


    const [notifReminders, setNotifReminders] = useState(() => localStorage.getItem('aiimin_notif_reminders') === 'true');
    const [notifInsights, setNotifInsights] = useState(() => localStorage.getItem('aiimin_notif_insights') === 'true');
    const [intelTab, setIntelTab] = useState('insights');

    // ── Real stats from DB ───────────────────────────────────────
    const [todayStats, setTodayStats] = useState(null);
    const [weekGymDays, setWeekGymDays] = useState(null);
    const [focusSessions, setFocusSessions] = useState(null);

    useEffect(() => {
        if (!user) return;
        const today = new Date().toLocaleDateString('en-CA');
        const weekAgo = new Date(Date.now() - 6 * 86400000).toLocaleDateString('en-CA');

        supabase.from('daily_logs').select('sleep_start, sleep_end, sleep_hours, steps, mood, energy_level, gym_done, gym_duration, breakfast_done, learning_done, learning_topic, journal_entry, water_bottles, brain_fog, headache')
            .eq('user_id', user.id).eq('date', today).maybeSingle()
            .then(({ data }) => setTodayStats(data || {}));

        supabase.from('daily_logs').select('gym_done').eq('user_id', user.id).gte('date', weekAgo)
            .then(({ data }) => { if (data) setWeekGymDays(data.filter(d => d.gym_done).length); });

        supabase.from('pomodoro_sessions').select('id').eq('user_id', user.id)
            .gte('started_at', today + 'T00:00:00').lte('started_at', today + 'T23:59:59')
            .then(({ data }) => { if (data) setFocusSessions(data.length); });

        // Tier 2/3/4 — historical data
        const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toLocaleDateString('en-CA');
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toLocaleDateString('en-CA');

        supabase.from('daily_logs').select('*').eq('user_id', user.id)
            .gte('date', sixtyDaysAgo).order('date', { ascending: false })
            .then(({ data }) => { if (data) setRecentLogs(data); });

        supabase.from('pomodoro_sessions').select('id').eq('user_id', user.id)
            .gte('started_at', thirtyDaysAgo + 'T00:00:00')
            .then(({ data }) => { if (data) setPomoCyclesTotal(data.length); });

        supabase.from('money_transactions').select('id').eq('user_id', user.id)
            .gte('date', thirtyDaysAgo)
            .then(({ data }) => { if (data) setTxCount(data.length); });

        supabase.from('dsa_problems').select('id').eq('user_id', user.id)
            .gte('solved_at', thirtyDaysAgo + 'T00:00:00')
            .then(({ data }) => { if (data) setDsaCountTotal(data.length); });
    }, [user]);

    const saveAndSet = (key, setter) => (val) => {
        setter(val);
        localStorage.setItem(key, String(val));
    };

    const devEmail = process.env.REACT_APP_DEV_EMAIL;
    const isAdmin = !!(devEmail && user?.email === devEmail);

    const { session } = useAuth();

    const handleExport = useCallback(async () => {
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

    const s = todayStats || {};
    const completedToday = [
        s.sleep_hours > 0,
        s.gym_done,
        s.breakfast_done,
        (s.steps || 0) >= 1000,
        (s.water_bottles || 0) >= 2,
        (s.mood || 0) > 0,
        s.learning_done,
        s.journal_entry?.trim?.(),
    ].filter(Boolean).length;

    const statsData = [
        {
            id: 'score', label: 'Score', icon: '🎯',
            value: todayStats ? `${completedToday}/8` : '—',
            type: 'score',
            context: completedToday >= 8 ? 'Perfect day! 🔥' : completedToday >= 6 ? 'On track' : completedToday > 0 ? 'Keep logging' : 'Start today',
            contextColor: completedToday >= 6 ? 'var(--success)' : 'var(--accent)',
        },
        {
            id: 'sleep', label: 'Sleep', icon: '😴',
            value: s.sleep_hours ? `${s.sleep_hours}h` : '—',
            type: 'sleep',
            context: s.sleep_hours >= 7 ? 'Well rested ✓' : s.sleep_hours > 0 ? 'Sleep debt ⚠️' : 'Log tonight',
            contextColor: s.sleep_hours >= 7 ? 'var(--success)' : 'var(--accent)',
        },
        {
            id: 'gym', label: 'Gym', icon: <DumbbellIcon size={18} color="var(--text-2)" />,
            value: weekGymDays !== null ? `${weekGymDays}d` : '—',
            type: 'gym',
            context: weekGymDays >= 5 ? 'Beast mode 🔥' : weekGymDays >= 3 ? 'Consistent' : weekGymDays >= 1 ? 'Keep going' : 'Not yet this week',
            contextColor: weekGymDays >= 3 ? 'var(--success)' : 'var(--accent)',
        },
        {
            id: 'focus', label: 'Focus', icon: '🎯',
            value: focusSessions !== null ? String(focusSessions) : '—',
            type: 'focus',
            context: focusSessions >= 4 ? 'Deep work day ⚡' : focusSessions >= 1 ? `${focusSessions} session${focusSessions > 1 ? 's' : ''} done` : 'No sessions yet',
            contextColor: focusSessions >= 3 ? 'var(--success)' : 'var(--accent)',
        },
        {
            id: 'steps', label: 'Steps', icon: '👟',
            value: s.steps ? s.steps >= 1000 ? `${(s.steps / 1000).toFixed(1)}k` : String(s.steps) : '—',
            type: 'steps',
            context: s.steps >= 10000 ? 'Goal met ✓' : s.steps >= 5000 ? 'Halfway there' : s.steps > 0 ? 'Keep moving' : 'Log steps',
            contextColor: s.steps >= 10000 ? 'var(--success)' : 'var(--accent)',
        },
    ];

    // Snapshot in xpEngine shape for DailyQuests
    const desktopLogSnapshot = {
        sleep_start: s.sleep_start || null,
        sleep_end:   s.sleep_end   || null,
        sleep_hours: s.sleep_hours || 0,
        gym_done:    s.gym_done    || false,
        gym_duration: s.gym_duration || 0,
        breakfast_done: s.breakfast_done || false,
        steps:       s.steps       || 0,
        water_bottles: s.water_bottles || 0,
        mood:        s.mood        || null,
        energy_level: s.energy_level || null,
        learning_done: s.learning_done || false,
        journal_entry: s.journal_entry || null,
        brain_fog:   s.brain_fog   || 0,
        win_logged:  false,
        rc_count:    s.rc_count || 0,
    };
    const todayStr = new Date().toLocaleDateString('en-CA');

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

                {/* ── XP BAR ── */}
                <DesktopXPBar user={user} />

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

                        {/* ── DAILY QUESTS ── */}
                        <DailyQuests dateStr={todayStr} logData={desktopLogSnapshot} />

                        {/* ── DAILY QUOTE ── */}
                        <DailyQuote logSnapshot={desktopLogSnapshot} />

                        {/* ── ZONE 2: METRICS ROW ── */}
                        <div>
                            <SectionLabel>Today's Overview</SectionLabel>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }} className="metrics-row">
                                {statsData.map((stat, i) => (
                                    <StatCard key={stat.id} stat={stat} index={i} expandedCard={expandedCard} setExpandedCard={setExpandedCard} />
                                ))}
                            </div>
                            {expandedCard && (
                                <div style={{ marginTop: '10px' }}>
                                    <ExpandedStatPanel stat={statsData.find(sc => sc.id === expandedCard)} user={user} />
                                </div>
                            )}
                        </div>

                        {/* ── ZONE 3: MAIN GRID (2fr | 1fr) ── */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'stretch' }} className="main-grid">

                            {/* Left Column — Primary Actions */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                                <div>
                                    <SectionLabel>Mood Check-in</SectionLabel>
                                    <MoodTracker user={user} onMoodChange={() => {}} />
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
                                    {intelTab === 'wins' && <WinsEngine />}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minHeight: 0 }}>
                                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--card-px)' }}>
                                        <SectionLabel>Quick Capture</SectionLabel>
                                        <QuickCapture user={user} />
                                    </div>

                                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--card-px)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <SectionLabel>Daily Integrity</SectionLabel>
                                        <ResetsTracker user={user} />
                                    </div>
                                </div>

                            </div>

                            {/* Right Column — Daily Interaction */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--card-px)' }}>
                                    <SectionLabel>Daily Log</SectionLabel>
                                    <DailyLogForm user={user} />
                                </div>

                            </div>
                        </div>

                    </div>
                )}

                {/* ── HABITS & ROUTINES ── */}
                {activeTab === 'habits' && (
                    <HabitsPage user={user} />
                )}

                {/* ── IDENTITY ── */}
                {activeTab === 'identity' && (
                    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                        <div>
                            <SectionLabel>Current Phase</SectionLabel>
                            <PhaseTagger />
                        </div>

                        <div>
                            <SectionLabel>Identity Stack</SectionLabel>
                            <ErrorBoundary label="Identity Stack">
                                <IdentityStack />
                            </ErrorBoundary>
                        </div>

                        <div>
                            <SectionLabel>Aspiration Meters</SectionLabel>
                            <ErrorBoundary label="Aspiration Meters">
                                <AspirationMeters recentLogs={recentLogs} pomoCycles={pomoCyclesTotal} dsaCount={dsaCountTotal} txCount={txCount} />
                            </ErrorBoundary>
                        </div>

                        <div>
                            <SectionLabel>Mirror vs Vision</SectionLabel>
                            <ErrorBoundary label="Mirror Vision">
                                <MirrorVision recentLogs={recentLogs} />
                            </ErrorBoundary>
                        </div>

                    </div>
                )}

                {/* ── GROWTH ── */}
                {activeTab === 'growth' && (
                    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                        <div>
                            <SectionLabel>Daily Intention</SectionLabel>
                            <DailyIntention />
                        </div>

                        {recentLogs.length > 0 && (
                            <div>
                                <SectionLabel>1% Better Today</SectionLabel>
                                <OneBetterNudge recentLogs={recentLogs} />
                            </div>
                        )}

                        <div>
                            <SectionLabel>Side Quest</SectionLabel>
                            <ErrorBoundary label="Side Quests">
                                <SideQuests recentLogs={recentLogs} />
                            </ErrorBoundary>
                        </div>

                        <div>
                            <SectionLabel>You vs 30 Days Ago</SectionLabel>
                            <ErrorBoundary label="Past Self Card">
                                <PastSelfCard recentLogs={recentLogs} />
                            </ErrorBoundary>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '8px' }}>
                            <button
                                onClick={() => setShowWeeklyReview(true)}
                                style={{
                                    padding: '13px 36px', background: 'var(--accent)', color: '#fff',
                                    border: 'none', borderRadius: '12px', fontWeight: 800,
                                    fontSize: '14px', cursor: 'pointer', letterSpacing: '-0.01em',
                                    boxShadow: '0 4px 20px rgba(245,166,35,0.3)',
                                    transition: 'transform 0.15s, box-shadow 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(245,166,35,0.4)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(245,166,35,0.3)'; }}
                            >
                                📋 Weekly Review
                            </button>
                        </div>

                    </div>
                )}

                {/* ── MONEY ── */}
                {activeTab === 'money' && (
                    <div className="fade-up">
                        <MoneyManager user={user} />
                    </div>
                )}

                {/* ⚡ FOCUS ── */}
                {activeTab === 'focus' && (
                    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                        {/* Pomodoro + Spotify side-by-side */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px', alignItems: 'start' }}>
                            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--card-px)' }}>
                                <SectionLabel>⏰ Focus Timer</SectionLabel>
                                <PomodoroTimer user={user} />
                            </div>
                            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--card-px)' }}>
                                <SectionLabel>🎵 Focus Music</SectionLabel>
                                <SpotifyPlayer />
                            </div>
                        </div>

                        <div>
                            <SectionLabel>Session Performance</SectionLabel>
                            <SessionStats user={user} />
                        </div>

                        <div>
                            <SectionLabel>Schedule & Calendar</SectionLabel>
                            <PersonalCalendar user={user} />
                        </div>

                    </div>
                )}

                {/* ── ANALYTICS ── */}
                {activeTab === 'analytics' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

                        <div className="fade-up">
                            <SectionLabel>DSA Problem Tracker</SectionLabel>
                            <DSACounter user={user} />
                        </div>

                        <div className="fade-up" style={{ animationDelay: '40ms' }}>
                            <SectionLabel>Weekly Intelligence</SectionLabel>
                            <ErrorBoundary label="Weekly Report">
                                <WeeklyReport user={user} />
                            </ErrorBoundary>
                        </div>

                        <div className="fade-up" style={{ animationDelay: '80ms' }}>
                            <SectionLabel>Sleep Intelligence</SectionLabel>
                            <ErrorBoundary label="Sleep Analytics">
                                <SleepAnalytics user={user} />
                            </ErrorBoundary>
                        </div>

                        <div className="fade-up" style={{ animationDelay: '120ms' }}>
                            <SectionLabel>Tracking Chains</SectionLabel>
                            <Streaks user={user} />
                        </div>

                        <div className="fade-up" style={{ animationDelay: '160ms' }}>
                            <SectionLabel>Performance Reports</SectionLabel>
                            <Reports user={user} />
                        </div>

                        <div className="fade-up" style={{ animationDelay: '200ms' }}>
                            <SectionLabel>365-Day Contribution Map</SectionLabel>
                            <YearlyHeatmap user={user} />
                        </div>

                        <div className="fade-up" style={{ animationDelay: '240ms' }}>
                            <SectionLabel>Achievements</SectionLabel>
                            <AchievementsGallery user={user} />
                        </div>

                        <div className="fade-up" style={{ animationDelay: '280ms' }}>
                            <SectionLabel>Life Chronicle</SectionLabel>
                            <ErrorBoundary label="Life Chronicle">
                                <LifeChronicle user={user} />
                            </ErrorBoundary>
                        </div>

                        <div className="fade-up" style={{ animationDelay: '320ms' }}>
                            <SectionLabel>Habit DNA — Correlation Engine</SectionLabel>
                            <ErrorBoundary label="Habit DNA">
                                <HabitDNA recentLogs={recentLogs} />
                            </ErrorBoundary>
                        </div>

                    </div>
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
                                    icon="🎵"
                                    label="Spotify Focus Music"
                                    description="Embedded playlists for deep work — no login required"
                                    control={
                                        <button onClick={() => setActiveTab('focus')} style={{ fontSize: '11px', color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', padding: '4px 10px', borderRadius: '99px', fontWeight: 600, cursor: 'pointer' }}>Open →</button>
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
                                    description="AIIMIN Life OS · Build 2026.03.11"
                                    control={<span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600 }}>v2.1.0</span>}
                                />
                            </SettingsSection>

                        </div>
                    )}

            </main>

            {/* ── WEEKLY REVIEW MODAL ── */}
            {showWeeklyReview && (
                <WeeklyReview user={user} onClose={() => setShowWeeklyReview(false)} />
            )}



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
