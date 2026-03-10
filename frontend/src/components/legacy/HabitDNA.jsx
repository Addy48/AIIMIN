import React, { useMemo, useState } from 'react';

const CORRELATIONS = [
    { label: 'Gym → Mood',             baseFn: l => l.gym_done,                        outFn: l => l.mood || 0,          notFn: l => !l.gym_done,                      metric: 'mood'    },
    { label: 'Gym → Better sleep',     baseFn: l => l.gym_done,                        outFn: l => l.sleep_hours || 0,   notFn: l => !l.gym_done,                      metric: 'sleep'   },
    { label: 'Good sleep → Clarity',   baseFn: l => (l.sleep_hours || 0) >= 7,         outFn: l => l.brain_fog || 0,     notFn: l => (l.sleep_hours || 0) < 7 && (l.sleep_hours || 0) > 0, metric: 'brain_fog' },
    { label: 'Good sleep → Mood',      baseFn: l => (l.sleep_hours || 0) >= 7,         outFn: l => l.mood || 0,          notFn: l => (l.sleep_hours || 0) < 7 && (l.sleep_hours || 0) > 0, metric: 'mood'    },
    { label: 'Learning → Energy',      baseFn: l => l.learning_done,                   outFn: l => l.energy_level || 0,  notFn: l => !l.learning_done,                 metric: 'energy'  },
    { label: 'Breakfast → Steps',      baseFn: l => l.breakfast_done,                  outFn: l => l.steps || 0,         notFn: l => !l.breakfast_done,                metric: 'steps'   },
    { label: '10k Steps → Mood',       baseFn: l => (l.steps || 0) >= 10000,           outFn: l => l.mood || 0,          notFn: l => (l.steps || 0) < 10000,           metric: 'mood'    },
    { label: 'High Water → Energy',    baseFn: l => (l.water_bottles || 0) >= 4,       outFn: l => l.energy_level || 0,  notFn: l => (l.water_bottles || 0) < 4,       metric: 'energy'  },
    { label: 'Journal → Mood',         baseFn: l => !!(l.journal_entry?.trim()),        outFn: l => l.mood || 0,          notFn: l => !l.journal_entry?.trim(),         metric: 'mood'    },
    { label: 'No fog → High Mood',     baseFn: l => (l.brain_fog || 0) >= 3,           outFn: l => l.mood || 0,          notFn: l => (l.brain_fog || 0) < 3,           metric: 'mood'    },
];

const avg = arr => arr.filter(v => v > 0).length ? arr.filter(v => v > 0).reduce((a, b) => a + b, 0) / arr.filter(v => v > 0).length : null;

const HabitDNA = ({ recentLogs = [] }) => {
    const [expanded, setExpanded] = useState(null);

    const correlations = useMemo(() => {
        return CORRELATIONS.map(c => {
            const withHabit    = recentLogs.filter(c.baseFn);
            const withoutHabit = recentLogs.filter(c.notFn);
            const avgWith    = avg(withHabit.map(c.outFn));
            const avgWithout = avg(withoutHabit.map(c.outFn));
            const diff = (avgWith !== null && avgWithout !== null) ? avgWith - avgWithout : null;
            const significant = withHabit.length >= 5 && diff !== null && Math.abs(diff) >= 0.4;
            return { ...c, avgWith, avgWithout, diff, sampleSize: withHabit.length, significant };
        })
            .filter(c => c.diff !== null && c.sampleSize >= 3)
            .sort((a, b) => Math.abs(b.diff || 0) - Math.abs(a.diff || 0));
    }, [recentLogs]);

    if (!recentLogs.length || correlations.length === 0) {
        return (
            <div style={{ padding: '32px', background: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '26px', marginBottom: '10px' }}>🧬</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)', marginBottom: '6px' }}>DNA analysis needs more data</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Need 2+ weeks of logs to compute habit correlations</div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {correlations.map((c, i) => {
                const positive = (c.diff || 0) >= 0;
                const pct = c.avgWithout && c.avgWithout > 0 ? Math.abs(c.diff || 0) / c.avgWithout * 100 : 0;
                const isExp = expanded === i;

                return (
                    <button
                        key={i}
                        onClick={() => setExpanded(isExp ? null : i)}
                        style={{
                            padding: '14px 16px', background: 'var(--bg-elevated)',
                            border: `1px solid ${isExp ? (positive ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)') : 'var(--border)'}`,
                            borderRadius: '10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                            display: 'flex', flexDirection: 'column', gap: isExp ? '12px' : '0',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{c.label}</div>
                                <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>{c.sampleSize} days with habit tracked</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                {c.significant && (
                                    <span style={{ fontSize: '8px', fontWeight: 700, color: '#ffd700', background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                                        STRONG
                                    </span>
                                )}
                                <span style={{ fontSize: '15px', fontWeight: 900, color: positive ? 'var(--success)' : '#ef4444' }}>
                                    {positive ? '▲' : '▼'} {Math.round(pct)}%
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{isExp ? '▴' : '▾'}</span>
                            </div>
                        </div>

                        {isExp && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div style={{ padding: '12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '10px', color: 'var(--success)', fontWeight: 700, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>With Habit</div>
                                    <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-1)' }}>{c.avgWith?.toFixed(2)}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>avg {c.metric}</div>
                                </div>
                                <div style={{ padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 700, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Without</div>
                                    <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-1)' }}>{c.avgWithout?.toFixed(2)}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>avg {c.metric}</div>
                                </div>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default HabitDNA;
