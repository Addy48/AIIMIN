import React from 'react';

/**
 * ToggleCard — Reusable theme-aware toggle card used in DailyLogForm.
 */
const ToggleCard = ({ active, onClick, icon, text }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: '10px',
            border: active ? '1px solid rgba(245,166,35,0.25)' : '1px solid var(--border)',
            background: active ? 'rgba(245,166,35,0.08)' : 'var(--bg-elevated)',
            cursor: 'pointer', marginBottom: '10px', transition: 'all 0.2s',
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-1)' }}>
            <span style={{ fontSize: '18px' }}>{icon}</span>
            <span>{text}</span>
        </div>
        <div style={{
            width: '44px', height: '24px', borderRadius: '12px',
            background: active ? '#f5a623' : 'var(--border-hover)',
            position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
        }}>
            <div style={{
                position: 'absolute', width: '18px', height: '18px', borderRadius: '50%',
                background: 'white', top: '3px', left: active ? '23px' : '3px',
                transition: 'left 0.2s, transform 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: active ? 'rotate(45deg)' : 'rotate(0deg)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={active ? '#f5a623' : 'var(--text-3)'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s' }}>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </div>
        </div>
    </div>
);

export default ToggleCard;
