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

const getDaysInMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let i = 1; i <= daysInMonth; i++) cells.push(i);
    return cells;
};

/* ─── Calendar grid (FIX 3) ─── */
const CalendarGrid = () => {
    const [hoveredDay, setHoveredDay] = useState(null);
    const cells = getDaysInMonth();
    const today = new Date().getDate();
    const dayHeaders = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <div>
            {/* Header row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '3px',
                marginBottom: '6px',
                textAlign: 'center',
            }}>
                {dayHeaders.map((d, i) => (
                    <div key={i} style={{ fontSize: '10px', color: 'var(--text-3)', textAlign: 'center' }}>{d}</div>
                ))}
            </div>

            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
                {cells.map((day, i) => {
                    if (day === null) {
                        return <div key={`empty-${i}`} />;
                    }
                    const isToday = day === today;
                    const isPast = day < today;
                    const isFuture = day > today;
                    const isHov = hoveredDay === i;
                    const now = new Date();
                    const monthName = now.toLocaleDateString('en-US', { month: 'short' });

                    return (
                        <div
                            key={i}
                            style={{
                                width: '100%',
                                aspectRatio: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                fontSize: '10px',
                                cursor: 'pointer',
                                position: 'relative',
                                background: isPast ? 'rgba(255,107,53,0.08)' : 'transparent',
                                border: isToday ? '1px solid var(--accent)' : '1px solid transparent',
                                color: isToday ? 'var(--accent)' : isPast ? 'var(--text-2)' : 'var(--text-3)',
                                fontWeight: isToday ? 700 : 400,
                                opacity: isFuture ? 0.4 : 1,
                                transform: isHov ? 'scale(1.15)' : 'scale(1)',
                                transition: 'transform 0.12s ease',
                                zIndex: isHov ? 5 : 1,
                            }}
                            onMouseEnter={() => setHoveredDay(i)}
                            onMouseLeave={() => setHoveredDay(null)}
                            onClick={() => (isPast || isToday) && console.log(`${day} ${monthName} ${now.getFullYear()}`)}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* Simulated entry value per type */
const getEntryValue = (type) => {
    if (type === 'score') return '7/8';
    if (type === 'sleep') return '7.2h';
    if (type === 'gym') return '✓ 45min';
    if (type === 'focus') return '4 cycles';
    return '—';
};

/* ─── Week rows with entry highlighting ─── */
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '180px', overflowY: 'auto' }}>
            {days.map((day, i) => {
                const hasEntry = day.dateNum % 2 !== 0; // odd = simulated entry

                if (day.isToday && hasEntry) {
                    return (
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: 'rgba(245,166,35,0.06)', borderRadius: '0 6px 6px 0',
                            padding: '6px 10px', paddingLeft: '8px',
                            borderLeft: '2px solid #f5a623', fontSize: '12px',
                        }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{day.label}</span>
                            <span style={{ color: '#f5a623', fontWeight: 600 }}>{getEntryValue(stat.type)}</span>
                        </div>
                    );
                }

                if (day.isToday && !hasEntry) {
                    return (
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            borderRadius: '0 6px 6px 0', padding: '6px 10px', paddingLeft: '8px',
                            borderLeft: '2px solid var(--border-hover)', fontSize: '12px',
                        }}>
                            <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>{day.label}</span>
                            <span style={{ color: 'var(--text-3)', fontSize: '10px' }}>···</span>
                        </div>
                    );
                }

                if (hasEntry) {
                    return (
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: 'rgba(245,166,35,0.06)', borderRadius: '6px',
                            padding: '6px 10px', fontSize: '12px',
                        }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{day.label}</span>
                            <span style={{ color: '#f5a623', fontWeight: 600 }}>{getEntryValue(stat.type)}</span>
                        </div>
                    );
                }

                return (
                    <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        borderRadius: '6px', padding: '6px 10px', fontSize: '12px',
                    }}>
                        <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>{day.label}</span>
                        <span style={{ color: 'var(--text-3)', fontSize: '10px' }}>···</span>
                    </div>
                );
            })}
        </div>
    );
};

/* ─── Stat card (FIX 2) ─── */
const StatCard = ({ stat, index, expandedCard, setExpandedCard }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [viewMode, setViewMode] = useState('week');
    const isExpanded = expandedCard === stat.id;

    const handleClick = (e) => {
        e.stopPropagation();
        setExpandedCard(isExpanded ? null : stat.id);
    };

    return (
        <div className="fade-up" style={{ animationDelay: `${index * 60}ms` }}>
            {/* Card body */}
            <div
                style={{
                    background: isHovered ? 'linear-gradient(135deg, rgba(245,166,35,0.04), rgba(247,98,58,0.04)), var(--bg-card-hover)' : 'var(--bg-card)',
                    border: isExpanded
                        ? '1px solid var(--accent)'
                        : isHovered ? '1px solid var(--border-hover)' : '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '18px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isHovered ? '0 12px 40px rgba(0,0,0,0.3)' : 'none',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
            >
                {/* Always-visible content */}
                <span style={{ fontSize: '20px', display: 'block', marginBottom: '8px' }}>{stat.icon}</span>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-1)', marginTop: '4px', letterSpacing: '-0.3px' }}>{stat.value}</div>

                {/* Hover tooltip — today's value only, no tabs */}
                {isHovered && !isExpanded && (
                    <div style={{ fontSize: '12px', color: 'var(--text-2)', marginTop: '8px' }}>
                        Today: —
                    </div>
                )}
            </div>

            {/* Expanded panel — in flow, pushes content down */}
            {isExpanded && (
                <div style={{
                    marginTop: '8px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '16px',
                    width: '100%',
                    overflow: 'hidden',
                }}>
                    {/* Tab row */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                        {['week', 'month'].map(mode => (
                            <button
                                key={mode}
                                onClick={(e) => { e.stopPropagation(); setViewMode(mode); }}
                                style={viewMode === mode ? {
                                    background: 'rgba(245,166,35,0.15)',
                                    color: '#f5a623',
                                    border: '1px solid rgba(245,166,35,0.35)',
                                    padding: '3px 10px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                } : {
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#9090bb',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    padding: '3px 10px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    {viewMode === 'week' ? <WeekRows stat={stat} /> : <CalendarGrid />}
                </div>
            )}
        </div>
    );
};

/* ─── Dashboard ─── */
const Dashboard = ({ user }) => {
    const [expandedCard, setExpandedCard] = useState(null);
    const [activeTab, setActiveTab] = useState('log');

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-primary)',
            paddingTop: '52px',
        }}>
            <Navbar user={user} activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="max-w-[780px] mx-auto px-6 pt-9 pb-[100px]">

                {/* Welcome section */}
                <div className="mb-8">
                    <h1 className="text-[28px] font-extrabold text-[var(--text-1)] tracking-[-0.5px] leading-[1.2]">
                        {getGreeting()}, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                    </h1>
                    <p className="text-[14px] mt-1.5" style={{ color: 'var(--text-2)' }}>Here is your daily tracker and life operating system.</p>

                    <div className="inline-flex items-center gap-[6px] mt-3 px-3 py-[5px] bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.25)] rounded-[var(--r-full)] text-[12px] text-[#f5a623] font-medium pulse">
                        ✦ Day tracking active
                    </div>
                </div>

                {/* Stat cards row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px] mb-9">
                    {[
                        { id: 'score', label: 'Score', icon: '🎯', value: '—', type: 'score' },
                        { id: 'sleep', label: 'Sleep', icon: '😴', value: '—', type: 'sleep' },
                        { id: 'gym', label: 'Gym', icon: '💪', value: '—', type: 'gym' },
                        { id: 'focus', label: 'Focus', icon: '🔥', value: '—', type: 'focus' },
                    ].map((stat, i) => (
                        <StatCard
                            key={stat.id}
                            stat={stat}
                            index={i}
                            expandedCard={expandedCard}
                            setExpandedCard={setExpandedCard}
                        />
                    ))}
                </div>

                {/* Content based on active tab */}
                {activeTab === 'log' && (
                    <>
                        {/* Mood section */}
                        <div className="mb-7 fade-up">
                            <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                                Mood
                                <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                            </div>
                            <MoodTracker user={user} onMoodChange={console.log} />
                        </div>

                        {/* Section 1 — Daily Log, Pomodoro, YouTube Integration */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mb-7 fade-up">
                            <div>
                                <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                                    Daily Log
                                    <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                                </div>
                                <DailyLogForm user={user} />
                            </div>
                            <div className="flex flex-col gap-6">
                                <div>
                                    <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                                        Pomodoro Timer
                                        <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                                    </div>
                                    <PomodoroTimer />
                                </div>
                                <div>
                                    <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                                        Focus Music
                                        <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                                    </div>
                                    <YouTubeIntegration user={user} />
                                </div>
                            </div>
                        </div>

                        {/* Win Tracker placeholder */}
                        <div className="mb-7 fade-up" style={{ animationDelay: '60ms' }}>
                            <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                                Win Tracker
                                <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                            </div>
                            <div className="bg-[var(--bg-card)] border border-dashed border-[var(--border)] rounded-[var(--r-xl)] p-9 flex flex-col items-center justify-center gap-[10px] transition-all duration-[var(--t-base)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]">
                                <div className="text-[28px]">🏆</div>
                                <div className="text-[14px] font-semibold text-[var(--text-2)]">Win Tracker</div>
                                <div className="text-[12px] text-[var(--text-3)] text-center">Daily wins and momentum log</div>
                                <div className="mt-1 px-2.5 py-[3px] bg-[var(--purple-dim)] rounded-[var(--r-full)] text-[11px] text-[var(--purple)] font-medium">Coming soon</div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'streaks' && (
                    <div className="fade-up">
                        <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                            Tracking Chains
                            <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                        </div>
                        <Streaks user={user} />
                    </div>
                )}

                {activeTab === 'money' && (
                    <div className="fade-up">
                        <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                            Financial Ledger
                            <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                        </div>
                        <MoneyManager user={user} />
                    </div>
                )}

                {activeTab === 'calendar' && (
                    <div className="fade-up">
                        <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                            Calendar Sync
                            <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                        </div>
                        <CalendarIntegration user={user} />
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="fade-up">
                        <div className="text-[11px] font-bold text-[var(--text-3)] uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                            Custom Export
                            <div className="flex-1 h-[1px] bg-[var(--border)]"></div>
                        </div>
                        <Reports user={user} />
                    </div>
                )}

            </main>
        </div>
    );
};

export default Dashboard;
