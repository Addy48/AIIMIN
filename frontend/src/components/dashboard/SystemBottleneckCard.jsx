import React from 'react';

const SystemBottleneckCard = ({ scores = { physical: 82, cognitive: 76, discipline: 69, financial: 74, emotional: 61 } }) => {
    let weakest = 'emotional';
    let minScore = 100;

    const names = { physical: 'Physical Capacity', cognitive: 'Cognitive Load', discipline: 'Behavioral Consistency', financial: 'Financial Health', emotional: 'Emotional Stability' };

    for (const [k, v] of Object.entries(scores)) {
        if (v < minScore) {
            minScore = v;
            weakest = k;
        }
    }

    return (
        <div style={{
            background: 'var(--danger-dim)', border: '1px solid rgba(255,68,102,0.2)',
            borderRadius: 'var(--r-lg)', padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '16px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,68,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                    ⚠️
                </div>
                <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Bottleneck Detected</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)', marginTop: '2px' }}>
                        Weakest System: <span style={{ color: 'var(--danger)' }}>{names[weakest]} ({minScore})</span>
                    </div>
                </div>
            </div>
            <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                View Diagnostics →
            </button>
        </div>
    );
}

export default SystemBottleneckCard;
