import React from 'react';

const Ring = ({ label, value, color, size = 64 }) => {
    const r = (size - 8) / 2;
    const circ = 2 * Math.PI * r;
    const dash = ((value || 0) / 100) * circ;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <svg width={size} height={size}>
                <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
                <circle
                    cx={size/2} cy={size/2} r={r}
                    fill="none" stroke={color} strokeWidth="6"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size/2} ${size/2})`}
                    style={{ transition: 'stroke-dasharray 0.6s ease' }}
                />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="var(--text-1)" fontSize="13" fontWeight="700">
                    {value || 0}
                </text>
            </svg>
            <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
            </span>
        </div>
    );
};

const SystemHealthRings = ({ lhsData = {} }) => (
    <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: '20px',
    }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            System Health
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Ring label="Move" value={lhsData.movement} color="#10b981" />
            <Ring label="Mind" value={lhsData.cognitive} color="#3b82f6" />
            <Ring label="Focus" value={lhsData.focus} color="#8b5cf6" />
            <Ring label="Mood" value={lhsData.mood} color="#f59e0b" />
            <Ring label="Sleep" value={lhsData.sleep} color="#6366f1" />
            <Ring label="Finance" value={lhsData.financial} color="#10b981" />
        </div>
    </div>
);

export default SystemHealthRings;
