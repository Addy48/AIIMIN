import React from 'react';

const ToggleSwitch = ({ checked, onChange }) => (
    <button
        onClick={() => onChange(!checked)}
        style={{
            width: '40px', height: '22px', borderRadius: '99px', position: 'relative',
            transition: 'all 0.2s ease', cursor: 'pointer', border: 'none', flexShrink: 0,
            background: checked ? 'var(--accent)' : 'var(--bg-elevated)',
            outline: checked ? 'none' : '1px solid var(--border)',
        }}
    >
        <div style={{
            position: 'absolute', top: '3px', left: checked ? '21px' : '3px',
            width: '16px', height: '16px', borderRadius: '50%',
            background: 'var(--bg-elevated)', transition: 'left 0.2s ease',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
    </button>
);

export default ToggleSwitch;
