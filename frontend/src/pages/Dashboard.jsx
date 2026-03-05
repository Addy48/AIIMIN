import React, { useState, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import DailyLogForm from '../components/DailyLogForm';
import PomodoroTimer from '../components/PomodoroTimer';
import MoodTracker from '../components/MoodTracker';
import Streaks from '../components/Streaks';
import MoneyManager from '../components/MoneyManager';
import CalendarIntegration from '../components/CalendarIntegration';
import Reports from '../components/Reports';
import YouTubeIntegration from '../components/YouTubeIntegration';
import ResetsTracker from '../components/ResetsTracker';
import RemindersWidget from '../components/RemindersWidget';
import WinsEngine from '../components/WinsEngine';
import InsightEngine from '../components/InsightEngine';
import MomentumBar from '../components/MomentumBar';
import WeeklyReport from '../components/WeeklyReport';
import CalendarHeatmap from '../components/calendar/CalendarHeatmap';
import ErrorBoundary from '../components/ErrorBoundary';
import AdminPanel from '../components/account/AdminPanel';
import AdminConsole from '../components/account/AdminConsole';
import SessionStats from '../components/SessionStats';
import useFeatureFlag from '../hooks/useFeatureFlag';
import { useAuth } from '../hooks/useAuth';
import toast from '../utils/toast';
import supabaseClient from '../utils/supabase';

const getDaysInMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Sunday=0 -> offset 6, Mon=1 -> 0, etc (Mon-first grid)
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let i = 1; i <= daysInMonth; i++) cells.push(i);
    return cells;
};

/* ─── Calendar grid — clean uniform surface ─── */
const CalendarGrid = () => {
    const [hoveredDay, setHoveredDay] = useState(null);
    const cells = getDaysInMonth();
    const today = new Date().getDate();
    const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '4px',
                marginBottom: '8px',
                textAlign: 'center',
            }}>
                {dayHeaders.map((d, i) => (
                    <div key={i} style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>{d}</div>
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {cells.map((day, i) => {
                    if (day === null) return <div key={`e-${i}`} />;
                    const isToday = day === today;
                    const isPast = day < today;
                    const isFuture = day > today;
                    const isHov = hoveredDay === i;
                    return (
                        <div
                            key={i}
                            style={{
                                aspectRatio: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '6px',
                                fontSize: '11px',
                                cursor: (isPast || isToday) ? 'pointer' : 'default',
                                background: isToday
                                    ? 'var(--accent)'
                                    : isPast
                                        ? (isHov ? 'var(--accent-dim)' : 'var(--bg-elevated)')
                                        : 'transparent',
                                color: isToday ? 'var(--text-1)' : isPast ? 'var(--text-1)' : 'var(--text-3)',
                                fontWeight: isToday ? 800 : isPast ? 600 : 400,
                                opacity: isFuture ? 0.4 : 1,
                                transform: isHov && !isToday ? 'scale(1.1)' : 'scale(1)',
                                transition: 'transform 0.1s ease, background 0.1s ease',
                            }}
                            onMouseEnter={() => setHoveredDay(i)}
                            onMouseLeave={() => setHoveredDay(null)}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ─── Simulated entry value ─── */
const getEntryValue = (type) => {
    if (type === 'score') return '7/8';
    if (type === 'sleep') return '7.2h';
    if (type === 'gym') return '45min';
    if (type === 'focus') return '4 cycles';
    return '—';
};

/* ─── Week rows ─── */
const WeekRows = ({ stat }) => {
    const now = new Date();
    const todayNum = now.getDate();
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({
            label: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dateNum: d.getDate(),
            isToday: d.getDate() === todayNum && d.getMonth() === now.getMonth(),
        });
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {days.map((day, i) => {
                const hasEntry = day.dateNum % 2 !== 0;
                if (day.isToday) {
                    return (
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: 'var(--accent-dim)', borderRadius: '6px',
                            padding: '6px 10px', borderLeft: '2px solid var(--accent)', fontSize: '12px',
                        }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-1)' }}>{day.label}</span>
                            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{hasEntry ? getEntryValue(stat.type) : '···'}</span>
                        </div>
                    );
                }
                return (
                    <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        borderRadius: '6px', padding: '6px 10px', fontSize: '12px',
                        background: hasEntry ? 'var(--bg-elevated)' : 'transparent',
                    }}>
                        <span style={{ fontWeight: hasEntry ? 600 : 400, color: hasEntry ? 'var(--text-1)' : 'var(--text-3)' }}>{day.label}</span>
                        <span style={{ color: hasEntry ? 'var(--text-2)' : 'var(--text-3)', fontSize: '11px', fontWeight: hasEntry ? 600 : 400 }}>{hasEntry ? getEntryValue(stat.type) : '—'}</span>
                    </div>
                );
            })}
        </div>
    );
};

/* ─── Expanded Panel ─── */
const ExpandedStatPanel = ({ stat }) => {
    const [viewMode, setViewMode] = useState('week');
    const now = new Date();
    const isFocusStat = stat.id === 'focus';

    return (
        <div className="fade-up" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '20px',
            minHeight: '260px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{stat.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{stat.label} — Last 7 Days</span>
                </div>
                <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border)' }}>
                    {['week', 'month'].map(mode => (
                        <button key={mode} onClick={() => setViewMode(mode)} style={{
                            padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: 'none',
                            background: viewMode === mode ? 'var(--bg-card)' : 'transparent',
                            color: viewMode === mode ? 'var(--accent)' : 'var(--text-3)',
                            transition: 'all 0.15s ease',
                        }}>
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            {viewMode === 'week'
                ? <WeekRows stat={stat} />
                : (isFocusStat
                    ? <CalendarHeatmap year={now.getFullYear()} month={now.getMonth() + 1} />
                    : <CalendarGrid />)
            }
        </div>
    );
};

/* ─── Stat Card ─── */
const StatCard = ({ stat, index, expandedCard, setExpandedCard }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isExpanded = expandedCard === stat.id;
    return (
        <div className="fade-up" style={{ animationDelay: `${index * 50}ms` }}>
            <div
                style={{
                    background: isHovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                    border: isExpanded ? '1px solid var(--accent)' : isHovered ? '1px solid var(--border-hover)' : '1px solid var(--border)',
                    borderRadius: '14px', padding: '16px 14px',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                    boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.2)' : 'none',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={(e) => { e.stopPropagation(); setExpandedCard(isExpanded ? null : stat.id); }}
            >
                <span style={{ fontSize: '18px', display: 'block', marginBottom: '10px' }}>{stat.icon}</span>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-1)', marginTop: '4px', letterSpacing: '-0.3px' }}>{stat.value}</div>
                {stat.context && (
                    <div style={{ fontSize: '11px', color: stat.contextColor || 'var(--accent)', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                        {stat.context}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─── Settings Section ─── */
const SettingsSection = ({ title, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0 0 10px 0' }}>
            {title}
        </div>
        <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '14px', overflow: 'hidden',
        }}>
            {children}
        </div>
    </div>
);

const SettingsRow = ({ icon, label, description, control, danger }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderBottom: '1px solid var(--border)',
        gap: '16px',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            {icon && <span style={{ fontSize: '16px', flexShrink: 0 }}>{icon}</span>}
            <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: danger ? 'var(--danger)' : 'var(--text-1)' }}>{label}</div>
                {description && <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{description}</div>}
            </div>
        </div>
        {control}
    </div>
);

SettingsRow.defaultProps = { danger: false };

const ToggleSwitch = ({ checked, onChange }) => (
    <button
        onClick={() => onChange(!checked)}
        style={{
            width: '40px', height: '22px', borderRadius: '99px', position: 'relative',
            transition: 'all 0.2s ease', cursor: 'pointer', border: 'none', flexShrink: 0,
            background: checked ? 'var(--accent)' : 'var(--bg-elevated)',
            outline: checked ? 'none' : '1px solid var(--border)',
        }}
    >
        <div style={{
            position: 'absolute', top: '3px', left: checked ? '21px' : '3px',
            width: '16px', height: '16px', borderRadius: '50%',
            background: 'var(--bg-elevated)', transition: 'left 0.2s ease',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
    </button>
);


/* ─── S4: Upcoming Sidebar (dynamic priority logic) ─── */

const UpcomingSidebar = () => {
    const [items, setItems] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const now = new Date();
                const todayStr = now.toISOString().split('T')[0];
                const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

                const newItems = [];

                // 1) Active Focus
                if (localStorage.getItem('aiimin_pomodoro_active') === 'true') {
                    newItems.push({
                        label: 'Focus Session in Progress',
                        time: 'Now',
                        color: 'var(--accent)',
                        type: 'focus'
                    });
                }

                // 2) Unmet Daily Commitments
                const { data: commitments } = await supabaseClient
                    .from('daily_commitments')
                    .select('targets, met_count')
                    .eq('date', todayStr)
                    .maybeSingle();

                if (commitments && commitments.targets) {
                    const parsedTargets = typeof commitments.targets === 'string' ? JSON.parse(commitments.targets) : commitments.targets;
                    const unmetCount = parsedTargets.length - (commitments.met_count || 0);
                    if (unmetCount > 0) {
                        newItems.push({
                            label: `${unmetCount} Commitment${unmetCount > 1 ? 's' : ''} Remaining`,
                            time: 'Today',
                            color: 'var(--success)',
                            type: 'commitment'
                        });
                    }
                }

                // 3) Fetch reminders due within 2 hours
                const { data: reminders } = await supabaseClient
                    .from('notes')
                    .select('id, title, content, reminder_time, type')
                    .eq('type', 'reminder')
                    .eq('completed', false)
                    .gte('reminder_time', now.toISOString())
                    .lte('reminder_time', twoHoursLater.toISOString())
                    .order('reminder_time', { ascending: true })
                    .limit(3);

                const mappedReminders = (reminders || []).map(r => ({
                    label: r.title || r.content?.slice(0, 40) || 'Reminder',
                    time: new Date(r.reminder_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    color: 'var(--success)',
                    type: 'reminder',
                }));

                newItems.push(...mappedReminders);
                setItems(newItems.slice(0, 4));
            } catch (_) {
                setItems([]);
            } finally {
                setLoaded(true);
            }
        };

        fetchUpcoming();
        const interval = setInterval(fetchUpcoming, 60000); // Refresh every minute

        // Listen to storage changes for pomodoro sync across tabs
        const handleStorage = () => fetchUpcoming();
        window.addEventListener('storage', handleStorage);

        // Also listen for custom event we can dispatch locally
        window.addEventListener('aiimin_pomodoro_toggled', handleStorage);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('aiimin_pomodoro_toggled', handleStorage);
        };
    }, []);

    if (!loaded) return <div style={{ fontSize: '11px', color: 'var(--text-3)', padding: '8px 0' }}>Loading...</div>;

    if (items.length === 0) {
        return (
            <div style={{ padding: '12px 0', fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, lineHeight: 1.5 }}>
                Clear schedule — perfect for deep work ✨
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', opacity: i === 0 ? 1 : 0.6 }}>
                    <div style={{ width: '3px', height: '24px', background: item.color, borderRadius: '4px' }} />
                    <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)' }}>{item.label}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>{item.time}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};


/* ─── Dashboard ─── */
const Dashboard = ({ user }) => {
    const [expandedCard, setExpandedCard] = useState(null);
    const [activeTab, setActiveTab] = useState(() => {
        const saved = localStorage.getItem('aiimin_activeTab');
        return ['today', 'sessions', 'insights', 'settings'].includes(saved) ? saved : 'today';
    });


    const [notifReminders, setNotifReminders] = useState(() => localStorage.getItem('aiimin_notif_reminders') === 'true');
    const [notifInsights, setNotifInsights] = useState(() => localStorage.getItem('aiimin_notif_insights') === 'true');

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
    const pomodoroRef = useRef(null);

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

    const scrollToPomodoro = () => {
        if (pomodoroRef.current) {
            pomodoroRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setActiveTab('today');
    };

    const showStreaks = useFeatureFlag('streaks');
    const showWinTracker = useFeatureFlag('win_tracker');
    const showMoneyManager = useFeatureFlag('money_insights');
    const showGoogleCalendar = useFeatureFlag('calendar_integration');
    const showYouTube = useFeatureFlag('youtube_player');
    const showMonthlyGrid = useFeatureFlag('monthly_grid');
    const showNotesSystem = useFeatureFlag('notes_system');

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
        { id: 'gym', label: 'Gym', icon: '💪', value: '3d', type: 'gym', context: '1 ahead of pace', contextColor: 'var(--accent)' },
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

            {/* Main Content Container (V3 1200px Grid) */}
            <main style={{
                maxWidth: 'var(--max-width)',
                margin: '0 auto',
                padding: 'var(--section-gap) var(--container-px)',
                display: 'grid',
                gridTemplateColumns: '1fr 300px',
                gap: 'var(--card-gap)',
                alignItems: 'start'
            }} className="v3-dashboard-grid">

                <style>{`
                    @media (max-width: 1024px) {
                        .v3-dashboard-grid { grid-template-columns: 1fr !important; }
                        .v3-sidebar { display: none; }
                    }
                `}</style>

                {/* Left Primary Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>

                    {/* ── Greeting ── */}
                    <div>
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
                    </div>

                    {/* ── Stat Cards ── */}
                    {(activeTab === 'today' || activeTab === 'insights') && onboardingStage >= 3 && (
                        <div style={{ marginBottom: '28px' }}>
                            <SectionLabel>Today's Overview</SectionLabel>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}
                                className="grid grid-cols-2 sm:grid-cols-5">
                                {statsData.map((stat, i) => {
                                    if (stat.id === 'score' && onboardingStage < 4) return null;
                                    return <StatCard key={stat.id} stat={stat} index={i} expandedCard={expandedCard} setExpandedCard={setExpandedCard} />;
                                })}
                            </div>
                            {expandedCard && (
                                <div style={{ marginTop: '10px' }}>
                                    <ExpandedStatPanel stat={statsData.find(s => s.id === expandedCard)} />
                                </div>
                            )}
                        </div>
                    )}

                    {onboardingStage < 3 && (activeTab === 'today' || activeTab === 'insights') && (
                        <div style={{
                            padding: '32px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border)',
                            textAlign: 'center', marginBottom: '28px'
                        }}>
                            <div style={{ fontSize: '24px', marginBottom: '12px' }}>🔒</div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>Intelligence Locked</div>
                            <p style={{ fontSize: '12px', color: 'var(--text-3)', maxWidth: '240px', margin: '8px auto' }}>
                                Complete {3 - onboardingStage} more logs to unlock your behavioral overview.
                            </p>
                        </div>
                    )}

                    {/* ── TODAY ── */}
                    {activeTab === 'today' && (
                        <>
                            <div style={{ marginBottom: '24px' }} className="fade-up">
                                <SectionLabel>Mood Check-in</SectionLabel>
                                <MoodTracker user={user} onMoodChange={() => { }} />
                            </div>

                            {/* S3: Balanced 2x2 grid for Focus, Wins, Momentum, Intelligence */}
                            <div className="fade-up" style={{ marginBottom: '28px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }} className="focus-intelligence-grid">
                                    {/* Top Left: Focus */}
                                    <div>
                                        <SectionLabel>Focus Engine</SectionLabel>
                                        {onboardingStage >= 1 ? (
                                            <>
                                                <div ref={pomodoroRef}>
                                                    <PomodoroTimer />
                                                </div>
                                                {showYouTube && (
                                                    <div style={{ marginTop: '20px' }}>
                                                        <YouTubeIntegration user={user} />
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                                <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>Complete your first log to unlock the Focus Timer.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Top Right: Wins */}
                                    <div>
                                        <SectionLabel>Wins Engine</SectionLabel>
                                        {onboardingStage >= 2 ? (
                                            showWinTracker ? <WinsEngine /> : null
                                        ) : (
                                            <div style={{ padding: '32px', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                                <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Available at Stage 2</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Left: Momentum */}
                                    <div>
                                        <SectionLabel>Momentum</SectionLabel>
                                        <MomentumBar user={user} />
                                    </div>

                                    {/* Bottom Right: Intelligence */}
                                    <div>
                                        <SectionLabel>Intelligence</SectionLabel>
                                        <ErrorBoundary label="Insight Engine">
                                            <InsightEngine user={user} />
                                        </ErrorBoundary>
                                    </div>
                                </div>
                                <style>{`
                                    @media (max-width: 800px) {
                                        .focus-intelligence-grid, .integrity-grid { grid-template-columns: 1fr !important; }
                                    }
                                `}</style>
                            </div>

                            {/* S9: Daily Integrity moved below Momentum/Focus */}
                            <div className="fade-up" style={{ marginBottom: '28px' }}>
                                <SectionLabel>Daily Integrity</SectionLabel>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="integrity-grid">
                                    <div>
                                        <DailyLogForm user={user} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <ResetsTracker user={user} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── SESSIONS (S10: Stats + History + Calendar) ── */}
                    {activeTab === 'sessions' && (
                        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                            <div>
                                <SectionLabel>Session Performance</SectionLabel>
                                <SessionStats user={user} />
                            </div>
                            <div>
                                <SectionLabel>Schedule & Calendar</SectionLabel>
                                {showGoogleCalendar ? <CalendarIntegration user={user} /> : <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Calendar integration hidden.</div>}
                            </div>
                        </div>
                    )}

                    {/* ── INSIGHTS (S11: Single scrollable view, no mode toggle) ── */}
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
                                    <SectionLabel>Behavioral Insights</SectionLabel>
                                    <ErrorBoundary label="Insight Engine">
                                        <InsightEngine user={user} />
                                    </ErrorBoundary>
                                </div>

                                <div className="fade-up" style={{ animationDelay: '60ms' }}>
                                    <SectionLabel>Financial Summary</SectionLabel>
                                    {showMoneyManager ? <MoneyManager user={user} /> : <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Enable Money Manager in feature flags.</div>}
                                </div>

                                <div className="fade-up" style={{ animationDelay: '80ms' }}>
                                    <SectionLabel>Tracking Chains</SectionLabel>
                                    {showStreaks ? <Streaks user={user} /> : <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Enable Streaks in feature flags.</div>}
                                </div>

                                <div className="fade-up" style={{ animationDelay: '100ms' }}>
                                    <SectionLabel>Performance Reports</SectionLabel>
                                    {showMonthlyGrid ? <Reports user={user} /> : <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Enable Reports in feature flags.</div>}
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
                                        <button onClick={() => setActiveTab('sessions')} style={{ fontSize: '11px', color: 'var(--text-3)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '99px', fontWeight: 600, cursor: 'pointer' }}>Manage →</button>
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
                </div>

                {/* Right Contextual Column (V3 Sidebar) */}
                <aside className="v3-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)', position: 'sticky', top: '92px' }}>

                    {/* Quick Start Card */}
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--card-px)' }}>
                        <SectionLabel>Quick Mission</SectionLabel>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>Start a timed cycle to eliminate cognitive load.</p>
                            <button
                                onClick={scrollToPomodoro}
                                style={{
                                    width: '100%', padding: '12px', background: onboardingStage >= 1 ? 'var(--accent)' : 'var(--bg-elevated)', color: onboardingStage >= 1 ? 'white' : 'var(--text-3)',
                                    border: onboardingStage >= 1 ? 'none' : '1px solid var(--border)', borderRadius: 'var(--r-md)', fontSize: '13px', fontWeight: 700, cursor: onboardingStage >= 1 ? 'pointer' : 'not-allowed',
                                    opacity: onboardingStage >= 1 ? 1 : 0.5
                                }}
                                disabled={onboardingStage < 1}
                            >
                                {onboardingStage >= 1 ? 'Start Focus Session' : '🔒 Locked'}
                            </button>
                        </div>
                    </div>

                    {/* Upcoming Preview (S4: Dynamic — priority order) */}
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--card-px)' }}>
                        <SectionLabel>Upcoming</SectionLabel>
                        {showNotesSystem ? <UpcomingSidebar /> : <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Notes system hidden by flag.</div>}
                    </div>

                    {/* Priorities */}
                    <div style={{ padding: '0 var(--card-px)' }}>
                        <SectionLabel>Top Priorities</SectionLabel>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                            {['Eliminate distraction', 'Complete V3 wireframes', 'Core habit: hydration'].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-2)', fontWeight: 500 }}>
                                    <span style={{ color: 'var(--accent)' }}>•</span> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </main>

            <RemindersWidget user={user} />

            <style>{`
                @keyframes ping {
                    0% { transform: scale(1); opacity: 0.35; }
                    75% { transform: scale(2.2); opacity: 0; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
