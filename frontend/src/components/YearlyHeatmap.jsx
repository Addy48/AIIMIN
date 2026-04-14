import React, { useState, useEffect, useMemo } from 'react';
import supabase from '../utils/supabase';

/* ─── Metric configs ─── */
const METRIC_OPTIONS = [
    { key: 'combined', label: 'Combined Score' },
    { key: 'sleep', label: 'Sleep' },
    { key: 'gym', label: 'Gym' },
    { key: 'steps', label: 'Steps' },
    { key: 'mood', label: 'Mood' },
    { key: 'learning', label: 'Learning' },
    { key: 'focus', label: 'Focus' },
];

/* Score a day's log for a given metric — returns 0..4 intensity */
const scoreDay = (log, metric) => {
    if (!log) return 0;
    switch (metric) {
        case 'sleep':
            if (!log.sleep_hours) return 0;
            if (log.sleep_hours >= 8) return 4;
            if (log.sleep_hours >= 7) return 3;
            if (log.sleep_hours >= 5) return 2;
            return 1;
        case 'gym':
            return log.gym_done ? 4 : 0;
        case 'steps':
            if (!log.steps) return 0;
            if (log.steps >= 10000) return 4;
            if (log.steps >= 7000) return 3;
            if (log.steps >= 4000) return 2;
            return 1;
        case 'mood':
            if (!log.mood) return 0;
            if (log.mood >= 8) return 4;
            if (log.mood >= 6) return 3;
            if (log.mood >= 4) return 2;
            return 1;
        case 'learning':
            return log.learning_done ? 4 : 0;
        case 'focus':
            if (!log.pomodoro_minutes && !log.learning_done) return 0;
            const mins = log.pomodoro_minutes || (log.learning_done ? 30 : 0);
            if (mins >= 120) return 4;
            if (mins >= 60) return 3;
            if (mins >= 30) return 2;
            return 1;
        case 'combined':
        default: {
            let s = 0;
            if (log.sleep_hours && log.sleep_hours >= 5) s++;
            if (log.gym_done) s++;
            if (log.learning_done) s++;
            if (log.journal_entry?.trim()?.length > 5) s++;
            if (log.steps >= 5000) s++;
            if (log.mood) s++;
            if (log.breakfast_done) s++;
            if (log.water_bottles >= 2) s++;
            // 0-8 score → 0-4 intensity
            if (s >= 7) return 4;
            if (s >= 5) return 3;
            if (s >= 3) return 2;
            if (s >= 1) return 1;
            return 0;
        }
    }
};

/* ─── Color schemes per intensity (Obsidian Gold palette) ─── */
const getColor = (intensity, metric) => {
    const schemes = {
        // Combined: empty grey → dim gold → mid gold → warm gold → bright gold
        combined: ['var(--bg-elevated)', 'rgba(212,175,55,0.2)', 'rgba(212,175,55,0.45)', 'rgba(212,175,55,0.72)', '#D4AF37'],
        sleep: ['var(--bg-elevated)', '#1a2744', '#1e3a5f', '#2563eb', '#60a5fa'],
        gym: ['var(--bg-elevated)', 'rgba(212,175,55,0.15)', 'rgba(212,175,55,0.35)', 'rgba(212,175,55,0.6)', '#D4AF37'],
        steps: ['var(--bg-elevated)', '#1a3a2a', '#166534', '#22c55e', '#4ade80'],
        mood: ['var(--bg-elevated)', '#3b1a5e', '#581c87', '#a855f7', '#c084fc'],
        learning: ['var(--bg-elevated)', 'rgba(212,175,55,0.12)', 'rgba(229,171,55,0.3)', 'rgba(229,193,74,0.55)', '#E5C14A'],
        focus: ['var(--bg-elevated)', '#4a1a1a', '#991b1b', '#ef4444', '#f87171'],
    };
    const colors = schemes[metric] || schemes.combined;
    return colors[Math.min(intensity, 4)];
};

/* ─── Build 365-day grid structure (Sun → Sat columns, 53 weeks) ─── */
const buildYearGrid = (year) => {
    const jan1 = new Date(year, 0, 1);
    const dec31 = new Date(year, 11, 31);
    const dayOfYear = Math.ceil((dec31 - jan1) / 86400000) + 1;

    // We need to start from the Sunday before Jan 1
    const startDayOfWeek = jan1.getDay(); // 0 = Sunday
    const grid = []; // array of weeks, each week is array of 7 days

    let currentWeek = new Array(7).fill(null);

    // Fill leading nulls for days before Jan 1
    const startDate = new Date(jan1);
    startDate.setDate(startDate.getDate() - startDayOfWeek);

    for (let i = 0; i < startDayOfWeek; i++) {
        currentWeek[i] = null; // pad
    }

    for (let d = 0; d < dayOfYear; d++) {
        const date = new Date(year, 0, 1 + d);
        const dayOfWeek = date.getDay(); // 0 = Sunday

        if (dayOfWeek === 0 && d > 0) {
            grid.push(currentWeek);
            currentWeek = new Array(7).fill(null);
        }

        currentWeek[dayOfWeek] = {
            date: `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
            day: date.getDate(),
            month: date.getMonth(),
        };
    }

    // Push final partial week
    grid.push(currentWeek);
    return grid;
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Sun', '', 'Tue', '', 'Thu', '', 'Sat'];

/* ─── Main Component ─── */
const YearlyHeatmap = ({ user }) => {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [metric, setMetric] = useState('combined');
    const [logsMap, setLogsMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [hoveredDay, setHoveredDay] = useState(null);

    /* Fetch full year of logs */
    useEffect(() => {
        if (!user?.id) return;
        setLoading(true);

        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        supabase.from('daily_logs')
            .select('date, sleep_hours, gym_done, steps, learning_done, mood, journal_entry, pomodoro_minutes, water_bottles, breakfast_done')
            .eq('user_id', user.id)
            .gte('date', startDate)
            .lte('date', endDate)
            .then(({ data }) => {
                const map = {};
                (data || []).forEach(log => { map[log.date] = log; });
                setLogsMap(map);
                setLoading(false);
            });
    }, [user?.id, year]);

    const grid = useMemo(() => buildYearGrid(year), [year]);

    /* Stats */
    const totalLogged = Object.keys(logsMap).length;
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const dayOfYear = Math.ceil((now - new Date(now.getFullYear(), 0, 1)) / 86400000);
    const consistency = dayOfYear > 0 ? Math.round((totalLogged / dayOfYear) * 100) : 0;

    /* Current streak */
    let streak = 0;
    const checkDate = new Date(now);
    while (true) {
        const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        if (logsMap[dateStr]) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else break;
        if (streak > 366) break;
    }

    /* Month column positions for labels */
    const monthPositions = useMemo(() => {
        const positions = [];
        let lastMonth = -1;
        grid.forEach((week, weekIdx) => {
            const firstDay = week.find(d => d !== null);
            if (firstDay && firstDay.month !== lastMonth) {
                positions.push({ month: firstDay.month, col: weekIdx });
                lastMonth = firstDay.month;
            }
        });
        return positions;
    }, [grid]);

    const cellSize = 13;
    const cellGap = 3;
    const labelWidth = 30;

    return (
        <div className="glass-panel" style={{
            borderRadius: '16px', padding: '20px 22px',
        }}>
            {/* ── Header row ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '34px', height: '34px', background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                    }}>🗓</div>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>Year in Review</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 500 }}>
                            {totalLogged} days logged · {consistency}% consistency · {streak}d streak
                        </div>
                    </div>
                </div>

                {/* Year selector */}
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <button onClick={() => setYear(y => y - 1)} style={{
                        width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)',
                        background: 'var(--bg-elevated)', color: 'var(--text-2)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
                    }}>←</button>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)', minWidth: '40px', textAlign: 'center' }}>{year}</span>
                    <button onClick={() => setYear(y => y + 1)} disabled={year >= now.getFullYear()} style={{
                        width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)',
                        background: 'var(--bg-elevated)', color: year >= now.getFullYear() ? 'var(--text-3)' : 'var(--text-2)',
                        cursor: year >= now.getFullYear() ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
                        opacity: year >= now.getFullYear() ? 0.4 : 1,
                    }}>→</button>
                </div>
            </div>

            {/* ── Metric selector ── */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: 'var(--bg-elevated)', borderRadius: '8px', padding: '3px', flexWrap: 'wrap' }}>
                {METRIC_OPTIONS.map(m => (
                    <button key={m.key} onClick={() => setMetric(m.key)} style={{
                        padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                        border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                        background: metric === m.key ? 'var(--bg-card)' : 'transparent',
                        color: metric === m.key ? 'var(--text-1)' : 'var(--text-3)',
                        boxShadow: metric === m.key ? 'var(--shadow-sm)' : 'none',
                    }}>
                        {m.label}
                    </button>
                ))}
            </div>

            {/* ── Heatmap Grid ── */}
            {loading ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', fontSize: '12px', color: 'var(--text-3)' }}>Loading year data...</div>
            ) : (
                <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
                    {/* Month labels */}
                    <div style={{ display: 'flex', paddingLeft: `${labelWidth}px`, marginBottom: '4px' }}>
                        {monthPositions.map(({ month, col }) => (
                            <div key={month} style={{
                                position: 'absolute',
                                left: `${labelWidth + col * (cellSize + cellGap)}px`,
                                fontSize: '10px', fontWeight: 600, color: 'var(--text-3)',
                            }}>
                                {MONTH_LABELS[month]}
                            </div>
                        ))}
                    </div>

                    <div style={{ position: 'relative', marginTop: '18px' }}>
                        {/* Day labels + grid */}
                        <div style={{ display: 'flex' }}>
                            {/* Day labels column */}
                            <div style={{ width: `${labelWidth}px`, flexShrink: 0 }}>
                                {DAY_LABELS.map((label, i) => (
                                    <div key={i} style={{
                                        height: `${cellSize + cellGap}px`,
                                        fontSize: '9px', fontWeight: 600, color: 'var(--text-3)',
                                        display: 'flex', alignItems: 'center',
                                    }}>
                                        {label}
                                    </div>
                                ))}
                            </div>

                            {/* Weeks */}
                            <div style={{ display: 'flex', gap: `${cellGap}px` }}>
                                {grid.map((week, weekIdx) => (
                                    <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: `${cellGap}px` }}>
                                        {week.map((day, dayIdx) => {
                                            if (!day) {
                                                return <div key={dayIdx} style={{ width: `${cellSize}px`, height: `${cellSize}px` }} />;
                                            }

                                            const log = logsMap[day.date];
                                            const intensity = scoreDay(log, metric);
                                            const isFuture = year === now.getFullYear() && new Date(day.date) > now;
                                            const isToday = day.date === todayStr;

                                            return (
                                                <div
                                                    key={dayIdx}
                                                    onMouseEnter={() => setHoveredDay(day)}
                                                    onMouseLeave={() => setHoveredDay(null)}
                                                    style={{
                                                        width: `${cellSize}px`, height: `${cellSize}px`,
                                                        borderRadius: '2px',
                                                        background: isFuture ? 'transparent' : getColor(intensity, metric),
                                                        border: isToday ? '1px solid var(--accent)' : isFuture ? '1px solid var(--border)' : '1px solid transparent',
                                                        opacity: isFuture ? 0.2 : 1,
                                                        cursor: isFuture ? 'default' : 'pointer',
                                                        transition: 'transform 0.1s',
                                                    }}
                                                    title={`${day.date}${log ? ` — Score: ${intensity}/4` : ' — No data'}`}
                                                />
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tooltip */}
                    {hoveredDay && (
                        <div style={{
                            marginTop: '10px', padding: '8px 14px',
                            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                            borderRadius: '8px', fontSize: '12px', color: 'var(--text-2)',
                            display: 'inline-flex', gap: '12px', fontWeight: 600,
                        }}>
                            <span style={{ color: 'var(--text-1)' }}>
                                {new Date(hoveredDay.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            {logsMap[hoveredDay.date] ? (
                                <>
                                    {logsMap[hoveredDay.date].sleep_hours && <span>Sleep: {logsMap[hoveredDay.date].sleep_hours}h</span>}
                                    {logsMap[hoveredDay.date].steps > 0 && <span>Steps: {logsMap[hoveredDay.date].steps.toLocaleString()}</span>}
                                    {logsMap[hoveredDay.date].mood && <span>Mood: {logsMap[hoveredDay.date].mood}/10</span>}
                                    {logsMap[hoveredDay.date].gym_done && <span>Gym ✓</span>}
                                </>
                            ) : (
                                <span style={{ color: 'var(--text-3)' }}>No data logged</span>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ── Legend ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '12px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>Less</span>
                {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                        width: '12px', height: '12px', borderRadius: '2px',
                        background: getColor(i, metric),
                        border: i === 0 ? '1px solid var(--border)' : 'none',
                    }} />
                ))}
                <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>More</span>
            </div>
        </div>
    );
};

export default YearlyHeatmap;
