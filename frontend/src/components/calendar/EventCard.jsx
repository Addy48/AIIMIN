import React from 'react';

/**
 * SYSTEM_COLORS — Life OS system type color map for calendar events.
 * Redesigned with Nordic Calm palette.
 */
export const SYSTEM_COLORS = {
    work:       { color: '#ff6b35',  bg: 'rgba(255,107,53,0.14)',  border: 'rgba(255,107,53,0.35)',  icon: '⚡', label: 'Work' },
    health:     { color: '#10b981',  bg: 'rgba(16,185,129,0.14)',  border: 'rgba(16,185,129,0.35)',  icon: '🧘', label: 'Health' },
    finance:    { color: '#E8B84B',  bg: 'rgba(232,184,75,0.16)',  border: 'rgba(232,184,75,0.4)',   icon: '💰', label: 'Finance' },
    social:     { color: '#5B8DEF',  bg: 'rgba(91,141,239,0.14)',  border: 'rgba(91,141,239,0.35)',  icon: '🤝', label: 'Social' },
    reflection: { color: '#9A7B4F',  bg: 'rgba(154,123,79,0.14)',  border: 'rgba(154,123,79,0.35)',  icon: '💭', label: 'Reflection' },
    general:    { color: '#6b7280',  bg: 'rgba(107,114,128,0.14)', border: 'rgba(107,114,128,0.3)',  icon: '◎', label: 'General' },
};

/**
 * EventCard — Compact event display used inside calendar views.
 */
export const EventCard = ({ event, onClick, compact = false }) => {
    const sys = SYSTEM_COLORS[event.system_type] || SYSTEM_COLORS.general;
    const startTime = event.all_day ? 'All day' : new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    if (compact) {
        return (
            <div
                onClick={() => onClick?.(event)}
                style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: 0,
                    minHeight: 24,
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 1px 2px rgba(20, 24, 28, 0.06)',
                    overflow: 'hidden',
                    fontFamily: 'var(--font-sans)',
                    transition: 'transform 150ms var(--ease)',
                    boxSizing: 'border-box',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
            >
                <span aria-hidden style={{ width: 4, flexShrink: 0, background: sys.color }} />
                <span style={{
                    flex: 1,
                    minWidth: 0,
                    padding: '5px 8px',
                    fontSize: 10,
                    fontWeight: 700,
                    color: 'var(--color-text-1)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    background: `color-mix(in srgb, ${sys.color} 10%, var(--color-surface))`,
                    lineHeight: 1.35,
                }}>
                    {event.title}
                </span>
            </div>
        );
    }

    return (
        <div
            onClick={() => onClick?.(event)}
            style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
                background: 'var(--color-elevated)', border: `1px solid var(--color-border)`,
                boxShadow: 'var(--glass-shadow-sm)',
                transition: 'all 200ms var(--ease)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{
                width: '3px', height: '32px', borderRadius: '4px',
                background: event.color || sys.color, flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-sans)' }}>
                    {event.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-2)', marginTop: '2px', display: 'flex', gap: '8px', fontFamily: 'var(--font-sans)' }}>
                    <span>{startTime}</span>
                    {event.location && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>· {event.location}</span>}
                </div>
            </div>
            <div style={{ fontSize: '16px', flexShrink: 0, opacity: 0.8 }}>{sys.icon}</div>
        </div>
    );
};

/**
 * EventTagSelector — System type picker for event creation.
 */
export const EventTagSelector = ({ value, onChange }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {Object.entries(SYSTEM_COLORS).map(([key, sys]) => (
            <button
                key={key}
                type="button"
                onClick={() => onChange(key)}
                style={{
                    padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                    border: value === key ? `1.5px solid ${sys.color}` : '1px solid var(--color-border)',
                    background: value === key ? `${sys.color}15` : 'var(--color-elevated)',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '11px', fontWeight: value === key ? 700 : 600,
                    color: value === key ? sys.color : 'var(--color-text-2)',
                    transition: 'all 200ms var(--ease)',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                }}
            >
                <span style={{ fontSize: '14px' }}>{sys.icon}</span>
                {sys.label}
            </button>
        ))}
    </div>
);
