import React, { useState, useEffect, useMemo } from 'react';
import supabase from '../../utils/supabase';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Color mapping per completion score
function getColor(score) {
    if (score === null) return 'var(--bg-elevated)';
    if (score === 8) return '#10b981';       // dark green — perfect
    if (score >= 6) return '#34d399';        // light green
    if (score >= 4) return '#6ee7b7';        // lighter green
    if (score >= 1) return '#a7f3d0';        // pale green
    return 'var(--border)';                   // logged but 0
}

const YearlyHeatmap = ({ user }) => {
    const [logMap, setLogMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [tooltip, setTooltip] = useState(null);
    const [selectedMetric, setSelectedMetric] = useState('all');

    useEffect(() => {
        if (!user) return;
        (async () => {
            setLoading(true);
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            const startDate = oneYearAgo.toLocaleDateString('en-CA');

            const { data: logs } = await supabase.from('daily_logs')
                .select('date, sleep_start, sleep_end, gym_done, breakfast_done, steps, water_bottles, mood, learning_done, journal_entry')
                .eq('user_id', user.id)
                .gte('date', startDate)
                .order('date', { ascending: true });

            const map = {};
            for (const log of (logs || [])) {
                const score = countMetrics(log);
                map[log.date] = { score, log };
            }
            setLogMap(map);
            setLoading(false);
        })();
    }, [user]);

    // Build the grid: 53 weeks × 7 days
    const { weeks, monthLabels } = useMemo(() => {
        const today = new Date();
        const weeks = [];
        const monthLabels = [];
        let lastMonth = -1;

        // Start from 52 weeks ago, align to Sunday start
        const start = new Date(today);
        start.setDate(start.getDate() - 364);
        // Rewind to the nearest Sunday
        start.setDate(start.getDate() - start.getDay());

        const d = new Date(start);
        let weekIdx = 0;

        while (d <= today) {
            if (!weeks[weekIdx]) weeks[weekIdx] = [];

            const dateStr = d.toLocaleDateString('en-CA');
            const isFuture = d > today;
            const entry = logMap[dateStr];

            let score = null;
            if (!isFuture && entry) {
                score = selectedMetric === 'all' ? entry.score : getMetricScore(entry.log, selectedMetric);
            }

            // Track month labels
            if (d.getMonth() !== lastMonth && d.getDay() === 0) {
                monthLabels.push({ weekIdx, month: MONTHS[d.getMonth()] });
                lastMonth = d.getMonth();
            }

            weeks[weekIdx].push({
                date: dateStr,
                score,
                isFuture,
                isToday: dateStr === today.toLocaleDateString('en-CA'),
            });

            d.setDate(d.getDate() + 1);
            if (d.getDay() === 0) weekIdx++;
        }

        return { weeks, monthLabels };
    }, [logMap, selectedMetric]);

    if (loading) return null;

    const totalLogged = Object.keys(logMap).length;
    const perfectDays = Object.values(logMap).filter(v => v.score === 8).length;

    return (
        <div style={{
            background: 'var(--bg-card)', borderRadius: '14px', padding: '16px',
            border: '1px solid var(--border)', margin: '0 16px',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    📊 Year in Review
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{totalLogged} days</span>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>{perfectDays} perfect</span>
                </div>
            </div>

            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
                {[
                    { id: 'all', label: 'All' },
                    { id: 'gym', label: '💪' },
                    { id: 'sleep', label: '💤' },
                    { id: 'steps', label: '👟' },
                    { id: 'learn', label: '📚' },
                    { id: 'journal', label: '✍️' },
                ].map(f => (
                    <button key={f.id} onClick={() => setSelectedMetric(f.id)} style={{
                        padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600,
                        border: selectedMetric === f.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                        background: selectedMetric === f.id ? 'var(--accent-dim)' : 'transparent',
                        color: selectedMetric === f.id ? 'var(--accent)' : 'var(--text-3)',
                        cursor: 'pointer',
                    }}>{f.label}</button>
                ))}
            </div>

            {/* Grid */}
            <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                <div style={{ position: 'relative' }}>
                    {/* Month labels */}
                    <div style={{ display: 'flex', marginLeft: '24px', marginBottom: '4px' }}>
                        {monthLabels.map((ml, i) => (
                            <div key={i} style={{
                                position: 'absolute', left: `${24 + ml.weekIdx * 14}px`,
                                fontSize: '9px', color: 'var(--text-3)', fontWeight: 600,
                            }}>{ml.month}</div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '2px', marginTop: '16px' }}>
                        {/* Day labels */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '4px', paddingTop: '0px' }}>
                            {DAYS.map((d, i) => (
                                <div key={i} style={{ height: '10px', width: '16px', fontSize: '8px', color: 'var(--text-3)', display: 'flex', alignItems: 'center' }}>
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Weeks */}
                        {weeks.map((week, wi) => (
                            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {week.map((day, di) => (
                                    <div
                                        key={di}
                                        onMouseEnter={() => setTooltip(day)}
                                        onMouseLeave={() => setTooltip(null)}
                                        onClick={() => setTooltip(tooltip?.date === day.date ? null : day)}
                                        style={{
                                            width: '10px', height: '10px', borderRadius: '2px',
                                            background: day.isFuture ? 'transparent' : getColor(day.score),
                                            border: day.isToday ? '1.5px solid var(--accent)' : 'none',
                                            cursor: 'pointer',
                                            opacity: day.isFuture ? 0.1 : 1,
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tooltip */}
            {tooltip && !tooltip.isFuture && (
                <div style={{
                    marginTop: '8px', padding: '8px 12px', borderRadius: '8px',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    fontSize: '11px', color: 'var(--text-2)',
                }}>
                    <strong>{tooltip.date}</strong>
                    {tooltip.score !== null
                        ? ` — ${tooltip.score}/8 metrics`
                        : ' — No log'
                    }
                </div>
            )}

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>Less</span>
                {[0, 2, 4, 6, 8].map(s => (
                    <div key={s} style={{
                        width: '10px', height: '10px', borderRadius: '2px',
                        background: getColor(s),
                    }} />
                ))}
                <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>More</span>
            </div>
        </div>
    );
};

// Count completed metrics (8 possible)
function countMetrics(log) {
    return [
        log.sleep_start && log.sleep_end,
        log.gym_done,
        log.breakfast_done,
        (log.steps || 0) >= 1000,
        (log.water_bottles || 0) >= 2,
        (log.mood || 0) > 0,
        log.learning_done,
        log.journal_entry?.trim(),
    ].filter(Boolean).length;
}

// Get single metric score (1 or 0) for filtered view
function getMetricScore(log, metric) {
    if (!log) return null;
    switch (metric) {
        case 'gym':     return log.gym_done ? 8 : 0;
        case 'sleep':   return (log.sleep_start && log.sleep_end) ? 8 : 0;
        case 'steps':   return (log.steps || 0) >= 10000 ? 8 : (log.steps || 0) >= 5000 ? 5 : (log.steps || 0) >= 1000 ? 2 : 0;
        case 'learn':   return log.learning_done ? 8 : 0;
        case 'journal': return log.journal_entry?.trim() ? 8 : 0;
        default:        return countMetrics(log);
    }
}

export default YearlyHeatmap;
