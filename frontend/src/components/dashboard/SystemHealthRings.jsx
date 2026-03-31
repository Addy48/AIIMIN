import React from 'react';

const SystemHealthRings = ({ scores = { physical: 82, cognitive: 76, discipline: 69, financial: 74, emotional: 61 }, trends = { physical: 1, cognitive: -1, discipline: 0, financial: 1, emotional: -1 } }) => {

    const systems = [
        { key: 'physical', label: 'Physical', color: '#10b981' },
        { key: 'cognitive', label: 'Cognitive', color: '#3b82f6' },
        { key: 'discipline', label: 'Behavior', color: '#8b5cf6' },
        { key: 'financial', label: 'Financial', color: '#f5a623' },
        { key: 'emotional', label: 'Emotional', color: '#ec4899' },
    ];

    const getDots = (score) => {
        const full = Math.round(score / 20);
        const dots = [];
        for (let i = 0; i < 5; i++) {
            dots.push(i < full ? '●' : '○');
        }
        return dots.join('');
    };

    const getArrow = (trend) => {
        if (trend > 0) return '↑';
        if (trend < 0) return '↓';
        return '→';
    };

    const getArrowColor = (trend) => {
        if (trend > 0) return 'var(--success)';
        if (trend < 0) return 'var(--danger)';
        return 'var(--text-3)';
    };

    return (
        <div className="glass-panel-gold" style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
            padding: '16px 24px', borderRadius: 'var(--r-lg)',
            gap: '16px', marginBottom: '16px'
        }}>
            {systems.map(sys => (
                <div key={sys.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {sys.label} <span style={{ color: getArrowColor(trends[sys.key]) }}>{getArrow(trends[sys.key])}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontSize: '14px', letterSpacing: '2px', color: sys.color, fontFamily: 'monospace' }}>
                            {getDots(scores[sys.key])}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-1)' }}>
                            {scores[sys.key]}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SystemHealthRings;
