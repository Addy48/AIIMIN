import React from 'react';

/**
 * SYSTEM_COLORS — Life OS system type color map for calendar events.
 * Redesigned with Nordic Calm palette.
 */
export const SYSTEM_COLORS = {
    work:       { color: 'var(--color-accent)',  bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.2)',  icon: '⚡', label: 'Work' },
    health:     { color: 'var(--color-rust)',    bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.2)',  icon: '🧘', label: 'Health' },
    finance:    { color: 'var(--color-warning)', bg: 'rgba(234,179,8,0.1)',  border: 'rgba(234,179,8,0.2)',  icon: '💰', label: 'Finance' },
    social:     { color: 'var(--color-info)',    bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', icon: '🤝', label: 'Social' },
    reflection: { color: 'var(--color-text-3)',  bg: 'rgba(161,161,170,0.1)', border: 'rgba(161,161,170,0.2)', icon: '💭', label: 'Reflection' },
    general:    { color: 'var(--color-text-2)',  bg: 'rgba(113,113,122,0.1)', border: 'rgba(113,113,122,0.2)', icon: '◎', label: 'General' },
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
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '3px 8px', borderRadius: '6px', cursor: 'pointer',
                    background: event.color || 'var(--color-elevated)', fontSize: '10px',
                    fontWeight: 600, color: event.color ? '#fff' : sys.color,
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                    fontFamily: 'var(--font-sans)', transition: 'transform 150ms var(--ease)',
                    borderLeft: `2px solid ${sys.color}`,
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
            >
                {event.title}
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
