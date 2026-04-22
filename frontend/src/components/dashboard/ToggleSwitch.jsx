import React from 'react';

const ToggleSwitch = ({ checked, onChange }) => (
    <button
        onClick={() => onChange(!checked)}
        style={{
            width: '40px', height: '22px', borderRadius: '99px', position: 'relative',
            transition: 'background 0.2s ease', cursor: 'pointer', border: 'none', flexShrink: 0,
            background: checked ? 'var(--color-accent)' : 'var(--color-elevated)',
            outline: checked ? 'none' : '1px solid var(--color-border)',
        }}
    >
        <div style={{
            position: 'absolute', top: '3px', left: checked ? '21px' : '3px',
            width: '16px', height: '16px', borderRadius: '50%',
            background: checked ? 'var(--color-base)' : 'var(--color-text-2)',
            transition: 'left 0.2s ease',
        }} />
    </button>
);

export default ToggleSwitch;
