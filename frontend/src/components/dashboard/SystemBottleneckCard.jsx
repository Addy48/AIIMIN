import React from 'react';

const SystemBottleneckCard = ({ lhsData = {} }) => {
    const scores = [
        { label: 'Movement', key: 'movement' },
        { label: 'Cognitive', key: 'cognitive' },
        { label: 'Discipline', key: 'discipline' },
        { label: 'Mood', key: 'mood' },
        { label: 'Sleep', key: 'sleep' },
        { label: 'Financial', key: 'financial' },
        { label: 'Focus', key: 'focus' },
    ];

    const sorted = scores
        .map(s => ({ ...s, value: lhsData[s.key] || 0 }))
        .sort((a, b) => a.value - b.value);

    const bottleneck = sorted[0];
    const strength = sorted[sorted.length - 1];

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: '20px',
        }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                System Analysis
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <div>
                        <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bottleneck</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 700, marginTop: '2px' }}>{bottleneck?.label || '—'}</div>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#ef4444' }}>{bottleneck?.value || 0}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div>
                        <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Strength</div>
                        <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 700, marginTop: '2px' }}>{strength?.label || '—'}</div>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{strength?.value || 0}</div>
                </div>
            </div>
        </div>
    );
};

export default SystemBottleneckCard;
