import React from 'react';
import {
    Hammer,
    Barbell,
    BookOpen,
    CurrencyInr,
    Handshake,
} from '@phosphor-icons/react';

const IDENTITY_LABELS = [
    { label: 'I am a builder who ships daily.',       icon: Hammer },
    { label: 'I am an athlete who trains hard.',      icon: Barbell },
    { label: 'I am a scholar who learns every day.',  icon: BookOpen },
    { label: 'I am disciplined with money.',          icon: CurrencyInr },
    { label: 'I am someone who keeps their word.',    icon: Handshake },
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
            {IDENTITY_LABELS.map((item, i) => {
                const Icon = item.icon;
                return (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        background: 'var(--bg-elevated)',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                    }}>
                        <span style={{ display: 'flex', color: 'var(--accent)' }}>
                            <Icon size={18} weight="duotone" />
                        </span>
                        <span style={{ fontSize: '13px', color: 'var(--text-1)', fontStyle: 'italic' }}>{item.label}</span>
                    </div>
                );
            })}
        </div>
    </div>
);

export default IdentityStack;
