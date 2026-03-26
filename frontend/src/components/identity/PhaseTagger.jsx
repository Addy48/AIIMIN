import React, { useState } from 'react';

const PHASES = [
    { id: 'placement', label: 'Placement Prep', color: '#3b82f6' },
    { id: 'fitness',   label: 'Fitness Build',  color: '#10b981' },
    { id: 'finance',   label: 'Finance Fix',    color: '#f59e0b' },
    { id: 'learning',  label: 'Deep Learning',  color: '#8b5cf6' },
    { id: 'recovery',  label: 'Recovery Mode',  color: '#6b7280' },
];

const PhaseTagger = () => {
    const [active, setActive] = useState('placement');

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: '20px',
        }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
                Current Phase
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {PHASES.map(p => (
                    <button
                        key={p.id}
                        onClick={() => setActive(p.id)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '999px',
                            border: `1px solid ${active === p.id ? p.color : 'var(--border)'}`,
                            background: active === p.id ? `${p.color}18` : 'transparent',
                            color: active === p.id ? p.color : 'var(--text-3)',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        {p.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PhaseTagger;
