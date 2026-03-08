/**
 * components/SessionStats.jsx
 *
 * S10: Session statistics header — total hours, weekly count,
 * current streak, longest streak, and recent session history.
 */
import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

const SessionStats = ({ user }) => {
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchStats = async () => {
            setLoading(true);
            try {
                // Fetch all sessions ordered by date
                const { data: sessions, error } = await supabase
                    .from('pomodoro_sessions')
                    .select('date, duration, cycles_completed, created_at')
                    .eq('user_id', user.id)
                    .order('date', { ascending: false });

                if (error) throw error;
                if (!sessions || sessions.length === 0) {
                    setStats({ totalHours: 0, weekCount: 0, currentStreak: 0, longestStreak: 0 });
                    setHistory([]);
                    setLoading(false);
                    return;
                }

                // Total hours
                const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
                const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

                // This week count
                const now = new Date();
                const weekStart = new Date(now);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                weekStart.setHours(0, 0, 0, 0);
                const weekCount = sessions.filter(s => new Date(s.date) >= weekStart).length;

                // Streak calculation (consecutive days with ≥1 session)
                const uniqueDays = [...new Set(sessions.map(s => s.date))].sort().reverse();
                let currentStreak = 0;
                let longestStreak = 0;
                let streak = 0;

                for (let i = 0; i < uniqueDays.length; i++) {
                    const expected = new Date();
                    expected.setDate(expected.getDate() - i);
                    const expectedStr = expected.toISOString().split('T')[0];

                    if (uniqueDays[i] === expectedStr) {
                        streak++;
                        if (i === 0 || streak === i + 1) {
                            currentStreak = streak;
                        }
                    } else {
                        if (streak > 0) break;
                    }
                    longestStreak = Math.max(longestStreak, streak);
                }

                // Recalculate longest streak properly
                let tempStreak = 1;
                longestStreak = 1;
                const sortedDays = [...new Set(sessions.map(s => s.date))].sort();
                for (let i = 1; i < sortedDays.length; i++) {
                    const prev = new Date(sortedDays[i - 1]);
                    const curr = new Date(sortedDays[i]);
                    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
                    if (diffDays === 1) {
                        tempStreak++;
                        longestStreak = Math.max(longestStreak, tempStreak);
                    } else {
                        tempStreak = 1;
                    }
                }

                setStats({ totalHours, weekCount, currentStreak, longestStreak });
                setHistory(sessions.slice(0, 10));
            } catch (e) {
                console.error('[SessionStats] fetch error:', e);
                setStats({ totalHours: 0, weekCount: 0, currentStreak: 0, longestStreak: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    if (loading) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '14px' }} />
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        { label: 'Total Hours', value: `${stats.totalHours}h`, icon: '⏱', color: 'var(--accent)' },
        { label: 'This Week', value: stats.weekCount, icon: '📅', color: 'var(--success)' },
        { label: 'Current Streak', value: `${stats.currentStreak}d`, icon: '🔥', color: '#ff6b35' },
        { label: 'Best Streak', value: `${stats.longestStreak}d`, icon: '🏆', color: 'var(--accent)' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Stats Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className="session-stats-grid">
                {statCards.map((card, i) => (
                    <div key={i} className="fade-up" style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: '14px', padding: '16px', textAlign: 'center',
                        animationDelay: `${i * 50}ms`,
                    }}>
                        <div style={{ fontSize: '18px', marginBottom: '8px' }}>{card.icon}</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: card.color, letterSpacing: '-0.3px' }}>
                            {card.value}
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
                            {card.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Session History */}
            {history.length > 0 && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-1)' }}>
                            Recent Sessions
                        </span>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-3)' }}>
                            Last {history.length}
                        </span>
                    </div>
                    {history.map((s, i) => (
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '12px 18px', borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none',
                        }}>
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)' }}>
                                    {new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>
                                    {s.cycles_completed || 1} cycle{(s.cycles_completed || 1) > 1 ? 's' : ''}
                                </div>
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>
                                {s.duration || 25} min
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {history.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '14px', border: '1px dashed var(--border)' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-3)' }}>
                        No sessions yet. Start a focus session to build your history.
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 600px) {
                    .session-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
            `}</style>
        </div>
    );
};

export default SessionStats;
