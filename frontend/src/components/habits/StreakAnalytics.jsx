/**
 * StreakAnalytics.jsx
 *
 * Habit streak analytics: completion heatmap, per-habit stats,
 * longest streak, monthly consistency rate.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../../utils/api';
import { fetchHabits } from '../../api/habits';
import { fetchDailyLogs } from '../../api/dailyLogs';

export default function StreakAnalytics({ user }) {
    const [habits, setHabits] = useState([]);
    const [logs, setLogs] = useState([]);
    const [moodData, setMoodData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHabit, setSelectedHabit] = useState(null);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
        const today = new Date().toISOString().slice(0, 10);

        const [habitsList, logsList, moodList] = await Promise.all([
            fetchHabits({ status: 'active' }),
            apiGet('/db/habit_logs', {
                params: {
                    gte: JSON.stringify({ completed_at: `${thirtyDaysAgo}T00:00:00.000Z` }),
                    orderCol: 'completed_at',
                    ascending: 'false',
                    limit: '500',
                },
            }),
            fetchDailyLogs(thirtyDaysAgo, today),
        ]);

        setHabits(Array.isArray(habitsList) ? habitsList : []);
        setLogs(Array.isArray(logsList) ? logsList : []);
        setMoodData(Array.isArray(moodList) ? moodList : []);
        setLoading(false);
    }, [user]);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)', fontSize: '13px' }}>Loading analytics…</div>;
    }

    if (habits.length === 0) {
        return (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>No Habits Yet</div>
                <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '6px' }}>
                    Create habits in the Library tab to see analytics here.
                </p>
            </div>
        );
    }

    // ── Compute per-habit stats ──
    const habitStats = habits.map(habit => {
        const habitLogs = logs.filter(l => l.habit_id === habit.id);
        const doneLogs = habitLogs.filter(l => l.status === 'done');
        const skippedLogs = habitLogs.filter(l => l.status === 'skipped');

        // Completion dates (unique days)
        const completionDays = new Set(
            doneLogs.map(l => new Date(l.completed_at).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }))
        );

        // Current streak
        let currentStreak = 0;
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        let checkDate = new Date(today + 'T00:00:00+05:30');
        while (completionDays.has(checkDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }))) {
            currentStreak++;
            checkDate = new Date(checkDate.getTime() - 86400000);
        }

        // Longest streak (scan sorted dates)
        const sortedDays = [...completionDays].sort();
        let longestStreak = 0;
        let runLength = 0;
        let prevDate = null;
        for (const dayStr of sortedDays) {
            const d = new Date(dayStr + 'T00:00:00+05:30');
            if (prevDate && (d.getTime() - prevDate.getTime()) === 86400000) {
                runLength++;
            } else {
                runLength = 1;
            }
            longestStreak = Math.max(longestStreak, runLength);
            prevDate = d;
        }

        // 30-day completion rate
        const completionRate = Math.round((completionDays.size / 30) * 100);

        // Streak temperature (cold → warm → hot)
        const temp = currentStreak === 0 ? 'cold'
            : currentStreak < 3 ? 'warming'
            : currentStreak < 7 ? 'warm'
            : currentStreak < 14 ? 'hot'
            : 'blazing';

        // Optimal completion hour
        const hourCounts = {};
        doneLogs.forEach(l => {
            const h = new Date(l.completed_at).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false });
            hourCounts[h] = (hourCounts[h] || 0) + 1;
        });
        const optimalHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];

        // Mood correlation: avg mood on days habit done vs not done
        const moodMap = {};
        moodData.forEach(m => { if (m.mood) moodMap[m.date] = Number(m.mood); });
        const moodWhenDone = [...completionDays]
            .map(d => moodMap[d]).filter(v => v != null);
        const allMoodDays = Object.values(moodMap);
        const avgMoodDone = moodWhenDone.length > 0
            ? moodWhenDone.reduce((a, b) => a + b, 0) / moodWhenDone.length : null;
        const avgMoodAll = allMoodDays.length > 0
            ? allMoodDays.reduce((a, b) => a + b, 0) / allMoodDays.length : null;
        const moodDelta = avgMoodDone != null && avgMoodAll != null
            ? avgMoodDone - avgMoodAll : null;

        return {
            ...habit,
            totalDone: doneLogs.length,
            totalSkipped: skippedLogs.length,
            completionDays,
            currentStreak,
            longestStreak,
            completionRate,
            temp,
            optimalHour: optimalHour ? `${optimalHour[0]}:00` : null,
            moodDelta,
        };
    });

    const selected = selectedHabit
        ? habitStats.find(h => h.id === selectedHabit)
        : null;

    // ── Overall stats ──
    const totalDone = habitStats.reduce((s, h) => s + h.totalDone, 0);
    const avgCompletion = Math.round(habitStats.reduce((s, h) => s + h.completionRate, 0) / (habitStats.length || 1));
    const bestStreak = Math.max(...habitStats.map(h => h.longestStreak), 0);

    // ── 30-day heatmap data ──
    const heatmapData = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const ds = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        const count = selected
            ? (selected.completionDays.has(ds) ? 1 : 0)
            : habitStats.reduce((s, h) => s + (h.completionDays.has(ds) ? 1 : 0), 0);
        heatmapData.push({ date: ds, count, day: d.toLocaleDateString('en-US', { weekday: 'narrow' }) });
    }
    const maxCount = selected ? 1 : habits.length;

    const TEMP_COLORS = {
        cold:    { bg: 'rgba(107,114,128,0.15)', text: 'var(--text-3)', label: '❄️ Cold' },
        warming: { bg: 'rgba(251,191,36,0.15)',  text: '#f59e0b',      label: '🌤 Warming' },
        warm:    { bg: 'rgba(251,146,60,0.15)',  text: '#f97316',      label: '🔥 Warm' },
        hot:     { bg: 'rgba(239,68,68,0.15)',   text: '#ef4444',      label: '🔥 Hot' },
        blazing: { bg: 'rgba(234,179,8,0.15)',   text: '#eab308',      label: '⚡ Blazing' },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* ── Overview cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="streak-overview-grid">
                <OverviewCard label="Total Completions" value={totalDone} icon="✅" />
                <OverviewCard label="Avg Completion" value={`${avgCompletion}%`} icon="📈" />
                <OverviewCard label="Best Streak" value={`${bestStreak}d`} icon="🏆" />
            </div>

            {/* ── Habit filter pills ── */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setSelectedHabit(null)}
                    style={{
                        padding: '5px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                        border: `1px solid ${!selectedHabit ? 'var(--accent)' : 'var(--border)'}`,
                        background: !selectedHabit ? 'rgba(255,107,53,0.1)' : 'var(--bg-elevated)',
                        color: !selectedHabit ? 'var(--accent)' : 'var(--text-3)',
                        cursor: 'pointer', transition: 'all 0.15s',
                    }}
                >
                    All Habits
                </button>
                {habitStats.map(h => (
                    <button
                        key={h.id}
                        onClick={() => setSelectedHabit(h.id)}
                        style={{
                            padding: '5px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 600,
                            border: `1px solid ${selectedHabit === h.id ? 'var(--accent)' : 'var(--border)'}`,
                            background: selectedHabit === h.id ? 'rgba(255,107,53,0.1)' : 'var(--bg-elevated)',
                            color: selectedHabit === h.id ? 'var(--accent)' : 'var(--text-3)',
                            cursor: 'pointer', transition: 'all 0.15s',
                            display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                    >
                        <span style={{ fontSize: '12px' }}>{h.emoji}</span> {h.name}
                    </button>
                ))}
            </div>

            {/* ── 30-Day Heatmap ── */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', padding: 'var(--card-px)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                    30-Day Activity
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', gap: '3px' }}>
                    {heatmapData.map((d, i) => {
                        const intensity = maxCount > 0 ? d.count / maxCount : 0;
                        const bg = intensity === 0
                            ? 'var(--bg-elevated)'
                            : intensity < 0.5
                                ? 'rgba(16,185,129,0.25)'
                                : intensity < 1
                                    ? 'rgba(16,185,129,0.5)'
                                    : 'rgba(16,185,129,0.85)';
                        return (
                            <div
                                key={i}
                                title={`${d.date}: ${d.count} completed`}
                                style={{
                                    aspectRatio: '1', borderRadius: '3px',
                                    background: bg, transition: 'background 0.2s',
                                }}
                            />
                        );
                    })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>30 days ago</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>Today</span>
                </div>
            </div>

            {/* ── Per-Habit Streak Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="streak-cards-grid">
                {(selected ? [selected] : habitStats).map(h => {
                    const tc = TEMP_COLORS[h.temp];
                    return (
                        <div key={h.id} style={{
                            background: 'var(--bg-card)', borderRadius: '14px',
                            padding: '18px', border: '1px solid var(--border)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '12px',
                                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '20px',
                                }}>
                                    {h.emoji}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{h.name}</div>
                                    <div style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                        fontSize: '10px', fontWeight: 700,
                                        padding: '2px 8px', borderRadius: '99px', marginTop: '3px',
                                        background: tc.bg, color: tc.text,
                                    }}>
                                        {tc.label}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <MiniStat label="Current" value={`${h.currentStreak}d`} />
                                <MiniStat label="Longest" value={`${h.longestStreak}d`} />
                                <MiniStat label="Rate" value={`${h.completionRate}%`} />
                                <MiniStat label="Done" value={h.totalDone} />
                            </div>

                            {/* Completion bar */}
                            <div style={{ marginTop: '12px' }}>
                                <div style={{ height: '6px', borderRadius: '99px', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%', borderRadius: '99px',
                                        background: h.completionRate >= 80 ? 'var(--success)' : h.completionRate >= 50 ? 'var(--accent)' : 'var(--text-3)',
                                        width: `${h.completionRate}%`, transition: 'width 0.5s ease',
                                    }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Behavioral Insights ── */}
            {habitStats.some(h => h.moodDelta != null || h.optimalHour) && (
                <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', padding: 'var(--card-px)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                        🧠 Behavioral Insights
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {(selected ? [selected] : habitStats).map(h => {
                            if (!h.moodDelta && !h.optimalHour) return null;
                            return (
                                <div key={h.id + '-insight'} style={{
                                    padding: '12px 14px', borderRadius: '10px',
                                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                }}>
                                    <span style={{ fontSize: '18px' }}>{h.emoji}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-1)' }}>{h.name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                            {h.moodDelta != null && (
                                                <span>
                                                    Mood {h.moodDelta >= 0 ? '↑' : '↓'}{' '}
                                                    <strong style={{ color: h.moodDelta >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                                        {h.moodDelta >= 0 ? '+' : ''}{h.moodDelta.toFixed(1)}
                                                    </strong>{' '}
                                                    on active days
                                                </span>
                                            )}
                                            {h.optimalHour && (
                                                <span>
                                                    Best time: <strong style={{ color: 'var(--accent)' }}>{h.optimalHour} IST</strong>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .streak-overview-grid { grid-template-columns: 1fr !important; }
                    .streak-cards-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}

function OverviewCard({ label, value, icon }) {
    return (
        <div style={{
            background: 'var(--bg-card)', borderRadius: '14px',
            padding: '18px', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: '14px',
        }}>
            <div style={{ fontSize: '22px' }}>{icon}</div>
            <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-1)' }}>{value}</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            </div>
        </div>
    );
}

function MiniStat({ label, value }) {
    return (
        <div style={{ padding: '8px 10px', background: 'var(--bg-elevated)', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>{value}</div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase' }}>{label}</div>
        </div>
    );
}
