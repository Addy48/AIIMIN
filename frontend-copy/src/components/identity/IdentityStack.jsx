import React from 'react';

const IDENTITY_LABELS = [
    { label: 'I am a builder who ships daily.',       icon: '🏗️' },
    { label: 'I am an athlete who trains hard.',      icon: '💪' },
    { label: 'I am a scholar who learns every day.',  icon: '📚' },
    { label: 'I am disciplined with money.',          icon: '💰' },
    { label: 'I am someone who keeps their word.',    icon: '🤝' },
];

const IdentityStack = () => (
    <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: '20px',
    }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
            Identity Stack
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {IDENTITY_LABELS.map((item, i) => (
                <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    background: 'var(--bg-elevated)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                }}>
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-1)', fontStyle: 'italic' }}>{item.label}</span>
                </div>
            ))}
        </div>
    </div>
);

export default IdentityStack;
