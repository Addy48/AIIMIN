import React from 'react';

const ASPIRATIONS = [
    { label: 'Placement Ready',    current: 65, target: 100, color: '#3b82f6' },
    { label: 'Fitness Level',      current: 70, target: 100, color: '#10b981' },
    { label: 'Financial Freedom',  current: 30, target: 100, color: '#f59e0b' },
    { label: 'Knowledge Depth',    current: 55, target: 100, color: '#8b5cf6' },
];

const AspirationMeters = () => (
    <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '20px',
    }}>
        <div style={{ 
            fontSize: '11px', 
            fontWeight: 800, 
            color: 'var(--text-3)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.15em', 
            marginBottom: '18px',
            fontFamily: 'var(--font-mono)'
        }}>
            Strategic Aspiration Meters
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {ASPIRATIONS.map((a, i) => (
                <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{a.label}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-2)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{a.current}%</span>
                    </div>
                    <div style={{ height: '5px', background: 'var(--bg-elevated)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <div style={{
                            width: `${(a.current / a.target) * 100}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${a.color}ee, ${a.color})`,
                            boxShadow: `0 0 10px ${a.color}44`,
                            borderRadius: '10px',
                            transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default AspirationMeters;
