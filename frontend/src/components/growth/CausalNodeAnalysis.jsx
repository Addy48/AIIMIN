import React from 'react';

const CORRELATIONS = [
    { cause: 'Sleep 8h+', effect: 'Mood 7+',       strength: 0.82, color: '#6366f1' },
    { cause: 'Gym',       effect: 'Energy High',    strength: 0.76, color: '#10b981' },
    { cause: 'No screen', effect: 'Better sleep',   strength: 0.71, color: '#3b82f6' },
    { cause: 'Learning',  effect: 'Focus score up', strength: 0.68, color: '#8b5cf6' },
];

const CausalNodeAnalysis = ({ logs = [] }) => (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
            Causal Correlations
        </div>
        {logs.length < 7 ? (
            <div style={{ fontSize: '13px', color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>
                Need 7+ days of data to show correlations.
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {CORRELATIONS.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>
                                    <span style={{ fontWeight: 700 }}>{c.cause}</span> → {c.effect}
                                </span>
                                <span style={{ fontSize: '11px', color: c.color, fontWeight: 700 }}>
                                    r={c.strength}
                                </span>
                            </div>
                            <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: `${c.strength * 100}%`, height: '100%', background: c.color, borderRadius: '2px' }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default CausalNodeAnalysis;
