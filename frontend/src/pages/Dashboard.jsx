import React, { useState } from 'react';
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
import AdminPanel from '../components/account/AdminPanel';

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
                                        ? (isHov ? 'rgba(245,166,35,0.12)' : 'rgba(245,166,35,0.06)')
                                        : 'transparent',
                                color: isToday ? '#fff' : isPast ? 'var(--text-1)' : 'var(--text-3)',
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
                            background: 'rgba(245,166,35,0.06)', borderRadius: '6px',
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
                        background: hasEntry ? 'rgba(245,166,35,0.04)' : 'transparent',
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
    return (
        <div className="fade-up" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '20px',
            overflow: 'hidden',
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
            {viewMode === 'week' ? <WeekRows stat={stat} /> : <CalendarGrid />}
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
            background: '#fff', transition: 'left 0.2s ease',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
    </button>
);

/* ─── Insight weekly summary card ─── */
const WeeklySummaryCard = () => {
    const insights = [
        { icon: '📈', text: 'Focus sessions up 28% vs last week. Peak at 10am–12pm.' },
        { icon: '😴', text: 'Sleep average 7.1h — best nights followed by gym days.' },
        { icon: '⚡', text: 'Energy peaks correlate with morning mood ≥ 4/5.' },
        { icon: '🎯', text: '3 of 7 days met all tracked goals. Strongest on Tue & Thu.' },
    ];
    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)' }}>Weekly Behavioral Summary</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
                        {new Date(Date.now() - 6 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                </div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', padding: '4px 10px', borderRadius: '99px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Rule-based
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {insights.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: 'var(--bg-elevated)', borderRadius: '10px' }}>
                        <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>{item.icon}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.55 }}>{item.text}</span>
                    </div>
                ))}
            </div>
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

    const [showAdmin, setShowAdmin] = useState(false);
    const [insightMode, setInsightMode] = useState(() => localStorage.getItem('aiimin_insight_mode') || 'surface');
    const [notifReminders, setNotifReminders] = useState(() => localStorage.getItem('aiimin_notif_reminders') === 'true');
    const [notifInsights, setNotifInsights] = useState(() => localStorage.getItem('aiimin_notif_insights') === 'true');

    const saveAndSet = (key, setter) => (val) => {
        setter(val);
        localStorage.setItem(key, String(val));
    };

    const onboardingStage = user?.onboarding_stage || 0;
    const isSuperAdmin = user?.role === 'super_admin';

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
                                border: '1px solid rgba(99, 193, 133, 0.2)',
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

                            <div className="fade-up" style={{ marginBottom: '28px' }}>
                                <SectionLabel>Focus & Intelligence</SectionLabel>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '24px' }} className="focus-intelligence-grid">
                                    <div>
                                        {onboardingStage >= 1 ? (
                                            <>
                                                <PomodoroTimer />
                                                <div style={{ marginTop: '20px' }}>
                                                    <YouTubeIntegration user={user} />
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                                <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>Complete your first log to unlock the Focus Timer.</p>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <SectionLabel>Momentum & Wins</SectionLabel>
                                        {onboardingStage >= 2 ? (
                                            <WinsEngine />
                                        ) : (
                                            <div style={{ padding: '32px', textAlign: 'center', background: 'rgba(245,166,35,0.03)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                                <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase' }}>Available at Stage 2</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="fade-up" style={{ marginBottom: '28px' }}>
                                <SectionLabel>Daily Integrity</SectionLabel>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="integrity-grid">
                                    <div>
                                        <DailyLogForm user={user} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <ResetsTracker user={user} />
                                        <div style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
                                            <p style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center' }}>
                                                Right side empty space for behavioral cues.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <style>{`
                                    @media (max-width: 800px) {
                                        .focus-intelligence-grid, .integrity-grid { grid-template-columns: 1fr !important; }
                                    }
                                `}</style>
                            </div>
                        </>
                    )}

                    {/* ── SESSIONS ── */}
                    {activeTab === 'sessions' && (
                        <div className="fade-up">
                            <SectionLabel>Schedule & Calendar</SectionLabel>
                            <CalendarIntegration user={user} />
                        </div>
                    )}

                    {/* ── INSIGHTS ── */}
                    {activeTab === 'insights' && (
                        onboardingStage >= 3 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                                <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', gap: '4px' }}>
                                    {['surface', 'deep'].map(mode => (
                                        <button key={mode} onClick={() => saveAndSet('aiimin_insight_mode', setInsightMode)(mode)}
                                            style={{
                                                flex: 1, padding: '8px 0', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                                                cursor: 'pointer', border: 'none', transition: 'all 0.2s ease',
                                                background: insightMode === mode ? 'var(--accent)' : 'transparent',
                                                color: insightMode === mode ? '#fff' : 'var(--text-3)',
                                            }}>
                                            {mode === 'surface' ? '⚡ Surface Mode' : '🔬 Deep Insight Mode'}
                                        </button>
                                    ))}
                                </div>

                                <div className="fade-up">
                                    <SectionLabel>Weekly Summary</SectionLabel>
                                    <WeeklySummaryCard />
                                </div>

                                <div className="fade-up" style={{ animationDelay: '60ms' }}>
                                    <SectionLabel>Tracking Chains</SectionLabel>
                                    <Streaks user={user} />
                                </div>

                                {insightMode === 'deep' && (
                                    <>
                                        {onboardingStage >= 4 ? (
                                            <>
                                                <div className="fade-up" style={{ animationDelay: '80ms' }}>
                                                    <SectionLabel>Financial Ledger</SectionLabel>
                                                    <MoneyManager user={user} />
                                                </div>
                                                <div className="fade-up" style={{ animationDelay: '120ms' }}>
                                                    <SectionLabel>Performance Reports</SectionLabel>
                                                    <Reports user={user} />
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                                <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>Deep Intelligence Locked</h3>
                                                <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>Reach Stage 4 (14-day consistency) to unlock deep behavioral correlation.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div style={{ padding: '100px 40px', textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', marginBottom: '20px' }}>📊</div>
                                <h2 style={{ fontSize: '20px', marginBottom: '12px', fontWeight: 800 }}>Establishing Baseline</h2>
                                <p style={{ fontSize: '14px', color: 'var(--text-3)', maxWidth: '300px', margin: '0 auto', lineHeight: 1.5 }}>
                                    AIIMIN requires 7 days of consistency before generating its first behavioral trend report.
                                </p>
                                <div style={{ marginTop: '32px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--accent)', color: '#fff', borderRadius: '99px', fontSize: '13px', fontWeight: 700 }}>
                                    Current Progress: {onboardingStage * 25}%
                                </div>
                            </div>
                        )
                    )}

                    {/* ── SETTINGS ── */}
                    {activeTab === 'settings' && (
                        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            <SettingsSection title="System Controls">
                                {isSuperAdmin && (
                                    <SettingsRow
                                        icon="🛠"
                                        label="Admin Simulation Suite"
                                        description="Inject synthetic data for engine stress-testing"
                                        control={
                                            <button
                                                onClick={() => setShowAdmin(true)}
                                                style={{ padding: '6px 14px', background: 'var(--danger-dim)', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                                            >
                                                Open Panel
                                            </button>
                                        }
                                    />
                                )}
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

                            {isSuperAdmin && showAdmin && (
                                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                                    <div style={{ maxWidth: '600px', width: '100%' }}>
                                        <AdminPanel user={user} onClose={() => setShowAdmin(false)} />
                                    </div>
                                </div>
                            )}

                            <SettingsSection title="Integrations">
                                <SettingsRow
                                    icon="📅"
                                    label="Google Calendar"
                                    description="Sync events for time-blocking and session scheduling"
                                    control={
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <div style={{ fontSize: '11px', color: 'var(--text-3)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '99px', fontWeight: 600 }}>Manage →</div>
                                        </div>
                                    }
                                />
                                <SettingsRow
                                    icon="▶️"
                                    label="YouTube (Focus Music)"
                                    description="Play personal playlists during focus sessions"
                                    control={
                                        <div style={{ fontSize: '11px', color: 'var(--text-3)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '99px', fontWeight: 600, cursor: 'pointer' }}>Manage →</div>
                                    }
                                />
                            </SettingsSection>

                            <SettingsSection title="Data & Privacy">
                                <SettingsRow
                                    icon="📥"
                                    label="Export Your Data"
                                    description="Download all logs, mood entries, and session data as JSON"
                                    control={
                                        <button onClick={() => alert('Export coming soon')} style={{ padding: '6px 14px', background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
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
                                        <button onClick={() => window.confirm('This will permanently delete all your data. Are you sure?')} style={{ padding: '6px 14px', background: 'rgba(235,140,140,0.1)', color: 'var(--danger)', border: '1px solid rgba(235,140,140,0.25)', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
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
                            <button style={{
                                width: '100%', padding: '12px', background: 'var(--accent)', color: 'white',
                                border: 'none', borderRadius: 'var(--r-md)', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
                            }}>
                                Start Focus Session
                            </button>
                        </div>
                    </div>

                    {/* Upcoming Preview */}
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'var(--card-px)' }}>
                        <SectionLabel>Upcoming</SectionLabel>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '3px', height: '24px', background: 'var(--accent)', borderRadius: '4px' }} />
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)' }}>Strategic Planning</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>14:00 - 15:30</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', opacity: 0.6 }}>
                                <div style={{ width: '3px', height: '24px', background: 'var(--text-3)', borderRadius: '4px' }} />
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)' }}>Review Daily Logs</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>17:00 - 17:30</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Critical Commitments */}
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
