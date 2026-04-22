import React from 'react';

export const SettingsSection = ({ title, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        <div style={{
            font: '500 10px/1 var(--font-mono)',
            color: 'var(--color-text-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            padding: '0 0 10px 0',
        }}>
            {title}
        </div>
        <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--r-md)',
            overflow: 'hidden',
        }}>
            {children}
        </div>
    </div>
);

export const SettingsRow = ({ label, description, control, danger = false }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderBottom: '1px solid var(--color-border)',
        gap: '16px',
    }}>
        <div style={{ flex: 1 }}>
            <div style={{
                font: '400 13px/1 var(--font-sans)',
                color: danger ? 'var(--color-alert-red)' : 'var(--color-text-1)',
            }}>{label}</div>
            {description && (
                <div style={{
                    font: '300 11px/1.5 var(--font-sans)',
                    color: 'var(--color-text-3)',
                    marginTop: '3px',
                }}>{description}</div>
            )}
        </div>
        {control}
    </div>
);
