import React from 'react';

const METRICS = [
    { id: 'gym', label: 'Gym Commitment', fn: l => l.gym_done },
    { id: 'learning', label: 'Deep Learning', fn: l => l.learning_done },
    { id: 'focus', label: 'Focus Sessions', fn: l => (l.pomodoro_minutes >= 25 || l.learning_done) },
    { id: 'sleep', label: 'Sleep Recovery', fn: l => l.sleep_hours >= 7 },
    { id: 'steps', label: 'Movement (8k+)', fn: l => l.steps >= 8000 },
];

const pct = (logs, fn) => logs.length ? (logs.filter(fn).length / logs.length) * 100 : 0;

const PerformanceDeltaHub = ({ recentLogs = [] }) => {
    const now30 = recentLogs.slice(0, 30);
    const prev30 = recentLogs.slice(30, 60);
    const hasPrev = prev30.length >= 5;

    if (now30.length < 5) {
        return (
            <div style={{ padding: '32px', background: 'var(--bg-elevated)', borderRadius: '14px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>Need at least 5 days of logs for Delta Hub</div>
            </div>
        );
    }

    const rows = METRICS.map(m => {
        const now = pct(now30, m.fn);
        const prev = hasPrev ? pct(prev30, m.fn) : null;
        const diff = prev !== null ? now - prev : 0;

        // "Leakage" if falling by more than 5%. "Momentum" if growing or high (> 80%).
        const isLeakage = diff < -5;
        const isMomentum = diff > 5 || now >= 85;

        return { ...m, now, prev, diff, isLeakage, isMomentum };
    });

    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(90deg, rgba(212,175,55,0.05), transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>⚖️</span>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>Performance Delta Hub</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Vision Gap Analysis • 30 Day Trailing</div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rows.map((r, i) => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        <div style={{ minWidth: '130px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{r.label}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>
                                {Math.round(r.now)}% consistency
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {/* Vision Gap indicator */}
                            <div style={{ display: 'flex', gap: '6px', fontSize: '11px', fontWeight: 800 }}>
                                {r.isLeakage && (
                                    <span style={{ color: '#b91c1c', background: 'rgba(239,68,68,0.1)', padding: '5px 12px', borderRadius: '99px', border: '1px solid rgba(239,68,68,0.2)' }}>
                                        ▼ Leakage ({Math.round(r.diff)}%)
                                    </span>
                                )}
                                {r.isMomentum && !r.isLeakage && (
                                    <span style={{ color: '#ffffff', background: '#22C55E', padding: '5px 12px', borderRadius: '99px', border: '1px solid #16a34a', boxShadow: '0 0 8px rgba(34,197,94,0.5)', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                                        ▲ Momentum {r.diff > 0 ? `(+${Math.round(r.diff)}%)` : ''}
                                    </span>
                                )}
                                {!r.isLeakage && !r.isMomentum && (
                                    <span style={{ color: 'var(--text-3)', background: 'var(--bg-card)', padding: '5px 12px', borderRadius: '99px', border: '1px solid var(--border)' }}>
                                        ~ Stable
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PerformanceDeltaHub;
