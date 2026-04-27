import React from 'react';

const ASPIRATIONS = [
    { label: 'Placement Ready',    current: 65, target: 100, color: '#3b82f6' },
    { label: 'Fitness Level',      current: 70, target: 100, color: '#10b981' },
    { label: 'Financial Freedom',  current: 30, target: 100, color: '#f59e0b' },
    { label: 'Knowledge Depth',    current: 55, target: 100, color: '#8b5cf6' },
];

const AspirationMeters = () => (
    <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: '20px',
    }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
            Aspiration Meters
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {ASPIRATIONS.map((a, i) => (
                <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-2)', fontWeight: 600 }}>{a.label}</span>
                        <span style={{ fontSize: '12px', color: a.color, fontWeight: 700 }}>{a.current}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${(a.current / a.target) * 100}%`,
                            height: '100%',
                            background: a.color,
                            borderRadius: '3px',
                            transition: 'width 0.6s ease',
                        }} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default AspirationMeters;
