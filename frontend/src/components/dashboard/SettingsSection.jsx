import React from 'react';

export const SettingsSection = ({ title, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0 0 10px 0' }}>
            {title}
        </div>
        <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '14px', overflow: 'hidden',
        }}>
            {children}
        </div>
    </div>
);

export const SettingsRow = ({ icon, label, description, control, danger = false }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderBottom: '1px solid var(--border)',
        gap: '16px',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            {icon && <span style={{ fontSize: '16px', flexShrink: 0 }}>{icon}</span>}
            <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: danger ? 'var(--danger)' : 'var(--text-1)' }}>{label}</div>
                {description && <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{description}</div>}
            </div>
        </div>
        {control}
    </div>
);
