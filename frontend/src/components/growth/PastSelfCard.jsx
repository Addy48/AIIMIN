import React from 'react';

const METRICS = [
    { label: 'Sleep avg',    fn: logs => avg(logs.map(l => l.sleep_hours || 0).filter(v => v > 0)),                                    fmt: v => v.toFixed(1) + 'h',       higherBetter: true  },
    { label: 'Gym rate',     fn: logs => pct(logs, l => l.gym_done),                                                                    fmt: v => Math.round(v) + '%',       higherBetter: true  },
    { label: 'Steps avg',    fn: logs => avg(logs.map(l => (l.steps || 0) / 1000).filter(v => v > 0)),                                 fmt: v => v.toFixed(1) + 'k',        higherBetter: true  },
    { label: 'Learning',     fn: logs => pct(logs, l => l.learning_done),                                                               fmt: v => Math.round(v) + '%',       higherBetter: true  },
    { label: 'Journal',      fn: logs => pct(logs, l => !!(l.journal_entry?.trim())),                                                   fmt: v => Math.round(v) + '%',       higherBetter: true  },
    { label: 'Water avg',    fn: logs => avg(logs.map(l => l.water_bottles || 0)),                                                      fmt: v => v.toFixed(1) + ' btl',     higherBetter: true  },
    { label: 'Mood avg',     fn: logs => avg(logs.filter(l => l.mood > 0).map(l => l.mood)),                                           fmt: v => v.toFixed(1) + '/10',      higherBetter: true  },
    { label: 'Breakfast',    fn: logs => pct(logs, l => l.breakfast_done),                                                              fmt: v => Math.round(v) + '%',       higherBetter: true  },
];

const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const pct = (logs, fn) => logs.length ? (logs.filter(fn).length / logs.length) * 100 : 0;

const PastSelfCard = ({ recentLogs = [] }) => {
    const now30  = recentLogs.slice(0, 30);
    const prev30 = recentLogs.slice(30, 60);

    if (now30.length < 5) {
        return (
            <div style={{ padding: '32px', background: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>Need at least 5 days of logs to show your comparison</div>
            </div>
        );
    }

    let upCount = 0, downCount = 0;
    const rows = METRICS.map(m => {
        const now  = m.fn(now30);
        const prev = prev30.length >= 5 ? m.fn(prev30) : null;
        const diff = prev !== null && prev > 0 && now > 0 ? now - prev : null;
        const improved = diff !== null ? (m.higherBetter ? diff > 0 : diff < 0) : null;
        if (improved === true)  upCount++;
        if (improved === false) downCount++;
        return { ...m, now, prev, diff, improved };
    });

    const hasPrev = prev30.length >= 5;

    return (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>📈 You vs 30 Days Ago</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
                        {hasPrev ? 'Last 30 days vs prior 30 days' : 'Prior period data not yet available — keep logging'}
                    </div>
                </div>
                {hasPrev && (
                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px', fontWeight: 700 }}>
                        <span style={{ color: 'var(--success)', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '99px', border: '1px solid rgba(16,185,129,0.25)' }}>
                            ▲ {upCount}
                        </span>
                        <span style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '4px 10px', borderRadius: '99px', border: '1px solid rgba(239,68,68,0.25)' }}>
                            ▼ {downCount}
                        </span>
                    </div>
                )}
            </div>

            {/* Rows */}
            <div>
                {rows.map((r, i) => (
                    <div
                        key={r.label}
                        style={{
                            display: 'grid', gridTemplateColumns: '110px 1fr 110px 70px',
                            alignItems: 'center', padding: '10px 20px', gap: '8px',
                            background: i % 2 === 0 ? 'transparent' : 'var(--bg-card)',
                        }}
                    >
                        <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>{r.label}</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)', textAlign: 'center' }}>
                            {r.now > 0 ? r.fmt(r.now) : '—'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-3)', textAlign: 'center' }}>
                            {hasPrev && r.prev > 0 ? r.fmt(r.prev) : hasPrev ? '—' : 'need data'}
                        </span>
                        <div style={{ textAlign: 'right' }}>
                            {r.diff !== null && Math.abs(r.diff) > 0.05 ? (
                                <span style={{ fontSize: '12px', fontWeight: 800, color: r.improved ? 'var(--success)' : '#ef4444' }}>
                                    {r.improved ? '▲' : '▼'}
                                </span>
                            ) : hasPrev ? (
                                <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>~</span>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>

            {hasPrev && (
                <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-3)' }}>
                    Now: {now30.length} days · Prior: {prev30.length} days
                </div>
            )}
        </div>
    );
};

export default PastSelfCard;
