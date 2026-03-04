import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import DumbbellIcon from './icons/DumbbellIcon';

const StreakItem = ({ label, count, icon, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px' }}>{icon}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: color || 'var(--accent)' }}>{count}</span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase' }}>Day</span>
        </div>
    </div>
);

const RecordItem = ({ label, value }) => (
    <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)' }}>{value}</span>
    </div>
);

const calcDayScore = (log) => {
    if (!log) return 0;
    let score = 0;
    if (log.gym_done) score += 35;
    if (log.learning_done) score += 35;
    if (log.pomodoro_minutes >= 25 || log.learning_done) score += 30;
    return score;
};

const WinsEngine = () => {
    const { user } = useAuth();
    const [winsData, setWinsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            setLoading(true);
            const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

            const { data: logs } = await supabase
                .from('daily_logs')
                .select('date, sleep_hours, gym_done, learning_done, journal_entry, steps, mood, pomodoro_minutes')
                .eq('user_id', user.id)
                .gte('date', thirtyDaysAgo)
                .order('date', { ascending: false });

            if (!logs || logs.length === 0) {
                setWinsData(null);
                setLoading(false);
                return;
            }

            const today = new Date().toISOString().split('T')[0];
            const todayLog = logs.find(l => l.date === today);
            const momentumScore = todayLog ? calcDayScore(todayLog) : 0;

            const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
            let gymStreak = 0, focusStreak = 0, stabilityStreak = 0;
            for (const log of sorted) { if (log.gym_done) gymStreak++; else break; }
            for (const log of sorted) { if (log.learning_done) focusStreak++; else break; }
            for (const log of sorted) { if (log.mood && log.mood >= 3) stabilityStreak++; else break; }

            const weeklyScores = [];
            for (let i = 0; i < 4; i++) {
                const slice = sorted.slice(i * 7, (i + 1) * 7);
                if (slice.length > 0) {
                    const avg = slice.reduce((s, l) => s + calcDayScore(l), 0) / slice.length;
                    weeklyScores.push(Math.round(avg));
                }
            }
            const bestWeek = weeklyScores.length > 0 ? Math.max(...weeklyScores) : 0;

            const moodLogs = logs.filter(l => l.mood);
            const avgMood = moodLogs.length > 0
                ? (moodLogs.reduce((s, l) => s + l.mood, 0) / moodLogs.length).toFixed(1)
                : null;

            const timeline = sorted.slice(0, 7).flatMap(log => {
                const wins = [];
                const dateStr = new Date(log.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                if (log.gym_done) wins.push({ title: 'Gym session completed', meta: dateStr });
                if (log.learning_done) wins.push({ title: 'Learning goal met', meta: dateStr });
                if (log.mood && log.mood >= 4) wins.push({ title: `High mood day (${log.mood}/5)`, meta: dateStr });
                return wins;
            }).slice(0, 5);

            setWinsData({ momentumScore, gymStreak, focusStreak, stabilityStreak, bestWeek, avgMood, timeline });
            setLoading(false);
        };
        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '24px' }} className="fade-up">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="skeleton skeleton-text" style={{ width: '60%', height: '16px' }} />
                    <div className="skeleton skeleton-text" style={{ width: '80%' }} />
                    <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                </div>
            </div>
        );
    }

    if (!winsData) {
        return (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '32px', textAlign: 'center' }} className="fade-up">
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>🏆</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>No wins tracked yet</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Start logging daily entries to build your win history and streaks.</div>
            </div>
        );
    }

    const { momentumScore, gymStreak, focusStreak, stabilityStreak, bestWeek, avgMood, timeline } = winsData;

    const records = [
        { label: 'Gym Streak', value: gymStreak > 0 ? `${gymStreak} Day${gymStreak !== 1 ? 's' : ''}` : '—' },
        { label: 'Best Week', value: bestWeek > 0 ? `${bestWeek}%` : '—' },
        { label: 'Avg Mood', value: avgMood ? `${avgMood}/5` : '—' },
    ];

    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }} className="fade-up">
            <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>Momentum Engine</h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, marginTop: '2px' }}>Behavioral Reinforcement System</p>
                    </div>
                    {/* Momentum Circle (0-100) */}
                    <div style={{ position: 'relative', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="50" height="50" viewBox="0 0 50 50">
                            <circle cx="25" cy="25" r="22" fill="none" stroke="var(--border)" strokeWidth="4" />
                            <circle cx="25" cy="25" r="22" fill="none" stroke="var(--accent)" strokeWidth="4"
                                strokeDasharray={`${momentumScore * 1.38} 138`} strokeLinecap="round" transform="rotate(-90 25 25)" />
                        </svg>
                        <span style={{ position: 'absolute', fontSize: '11px', fontWeight: 800, color: 'var(--text-1)' }}>{momentumScore}</span>
                    </div>
                </div>

                {/* Active Streaks — real computed values */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '24px' }}>
                    <StreakItem label="Focus Mastery" count={focusStreak} icon="🔥" />
                    <StreakItem label="Gym Commitment" count={gymStreak} icon={<DumbbellIcon size={16} color="var(--text-2)" />} />
                    <StreakItem label="Stability Index" count={stabilityStreak} icon="⚖️" color="var(--success)" />
                </div>

                {/* Personal Records Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    {records.map((r, i) => <RecordItem key={i} {...r} />)}
                </div>
            </div>

            {/* Win Timeline (Collapsible) */}
            <div style={{ borderTop: '1px solid var(--border)' }}>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        width: '100%', padding: '14px 24px', background: 'none', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer', outline: 'none'
                    }}
                >
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Win Timeline</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-3)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>↓</span>
                </button>
                {isExpanded && (
                    <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-up">
                        {timeline.length === 0 ? (
                            <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>No notable wins logged in the last 7 days.</div>
                        ) : (
                            timeline.map((win, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', marginTop: '5px', flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)' }}>{win.title}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>{win.meta}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WinsEngine;
