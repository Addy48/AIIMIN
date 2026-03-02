/**
 * components/calendar/CalendarHeatmap.jsx
 *
 * Monthly calendar grid where each day cell is color-coded by behavioral intensity.
 * Color = commitment fulfillment %. Tooltip on hover shows behavioral metrics.
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const intensityColor = (pct) => {
    if (pct === 0) return 'var(--bg-elevated)';
    if (pct < 40) return 'rgba(235,140,140,0.35)';  // red — very low
    if (pct < 60) return 'rgba(251,191,36,0.35)';   // amber — low
    if (pct < 80) return 'rgba(139,195,74,0.35)';   // light green — moderate
    return 'rgba(34,197,94,0.40)';                     // green — strong
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CalendarHeatmap = ({ year, month }) => {
    const { session } = useAuth();
    const [data, setData] = useState({});
    const [tooltip, setTooltip] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!session) return;
        setLoading(true);
        fetch(`${API_URL}/calendar/heatmap?year=${year}&month=${month}`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
        })
            .then(r => r.ok ? r.json() : [])
            .then(rows => {
                const map = {};
                rows.forEach(r => { map[r.date] = r; });
                setData(map);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [session, year, month]);

    // Build grid
    const firstDay = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    // Offset: Mon=0, Tue=1, ..., Sun=6
    let offset = firstDay.getDay() - 1;
    if (offset < 0) offset = 6;

    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', marginBottom: '3px' }}>
                {DAYS.map(d => (
                    <div key={d} style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-3)', textAlign: 'center', padding: '2px 0', textTransform: 'uppercase' }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
                {cells.map((day, i) => {
                    if (!day) return <div key={`e-${i}`} />;
                    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const d = data[dateStr] || {};
                    const pct = parseFloat(d.commitment_pct || 0);
                    const isToday = dateStr === new Date().toISOString().slice(0, 10);
                    const hasFocus = d.focus_minutes > 0;

                    return (
                        <div
                            key={dateStr}
                            onMouseEnter={() => setTooltip({ dateStr, ...d })}
                            onMouseLeave={() => setTooltip(null)}
                            style={{
                                aspectRatio: '1', borderRadius: '5px',
                                background: loading ? 'var(--bg-elevated)' : intensityColor(pct),
                                border: isToday ? '2px solid var(--accent)' : '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: hasFocus || pct > 0 ? 'pointer' : 'default',
                                position: 'relative', transition: 'transform 0.1s ease',
                            }}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <span style={{
                                fontSize: '9px', fontWeight: isToday ? 900 : 600,
                                color: isToday ? 'var(--accent)' : 'var(--text-2)',
                            }}>
                                {day}
                            </span>
                            {d.session_count > 0 && (
                                <span style={{
                                    position: 'absolute', bottom: '2px', right: '2px',
                                    width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)',
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div style={{
                    marginTop: '10px', padding: '10px 12px',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: '10px', fontSize: '11px', display: 'grid',
                    gridTemplateColumns: '1fr 1fr', gap: '6px 16px',
                }}>
                    <div style={{ gridColumn: '1/-1', fontWeight: 800, color: 'var(--text-1)', marginBottom: '2px', fontSize: '12px' }}>{tooltip.dateStr}</div>
                    {[
                        ['Focus min', tooltip.focus_minutes || 0],
                        ['Sessions', tooltip.session_count || 0],
                        ['Commitment', `${Math.round(tooltip.commitment_pct || 0)}%`],
                        ['Mood avg', tooltip.mood_avg ? `${tooltip.mood_avg}/5` : '—'],
                    ].map(([label, val]) => (
                        <div key={label}>
                            <span style={{ color: 'var(--text-3)' }}>{label}: </span>
                            <span style={{ color: 'var(--text-1)', fontWeight: 700 }}>{val}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Legend */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>Commitment:</span>
                {[['< 40%', 'rgba(235,140,140,0.5)'], ['40–60%', 'rgba(251,191,36,0.5)'], ['60–80%', 'rgba(139,195,74,0.5)'], ['≥ 80%', 'rgba(34,197,94,0.6)']].map(([label, bg]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: bg }} />
                        <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarHeatmap;
