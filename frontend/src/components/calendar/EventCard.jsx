import React from 'react';

/**
 * SYSTEM_COLORS — Life OS system type color map for calendar events.
 */
export const SYSTEM_COLORS = {
    physical: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', icon: '⚡', label: 'Physical' },
    cognitive: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', icon: '🧠', label: 'Cognitive' },
    behavior: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', icon: '📊', label: 'Behavior' },
    finance: { color: '#d4af37', bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.25)', icon: '💰', label: 'Finance' },
    reflection: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)', icon: '💭', label: 'Reflection' },
    general: { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.25)', icon: '📅', label: 'General' },
};

/**
 * EventCard — Compact event display used inside calendar views.
 */
export const EventCard = ({ event, onClick, compact = false }) => {
    const sys = SYSTEM_COLORS[event.system_type] || SYSTEM_COLORS.general;
    const startTime = event.all_day ? 'All day' : new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (compact) {
        return (
            <div
                onClick={() => onClick?.(event)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '2px 6px', borderRadius: '4px', cursor: 'pointer',
                    background: event.color || sys.bg, fontSize: '10px',
                    fontWeight: 600, color: event.color ? '#fff' : sys.color,
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                }}
            >
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: sys.color, flexShrink: 0 }} />
                {event.title}
            </div>
        );
    }

    return (
        <div
            onClick={() => onClick?.(event)}
            style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                background: sys.bg, border: `1px solid ${sys.border}`,
                transition: 'all 0.15s',
            }}
        >
            <div style={{
                width: '4px', height: '32px', borderRadius: '2px',
                background: event.color || sys.color, flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {event.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px', display: 'flex', gap: '8px' }}>
                    <span>{startTime}</span>
                    {event.location && <span>📍 {event.location}</span>}
                </div>
            </div>
            <div style={{ fontSize: '14px', flexShrink: 0 }}>{sys.icon}</div>
        </div>
    );
};

/**
 * EventTagSelector — System type picker for event creation.
 */
export const EventTagSelector = ({ value, onChange }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        {Object.entries(SYSTEM_COLORS).map(([key, sys]) => (
            <button
                key={key}
                type="button"
                onClick={() => onChange(key)}
                style={{
                    padding: '8px 10px', borderRadius: '8px', cursor: 'pointer',
                    border: value === key ? `1.5px solid var(--gold)` : '1px solid var(--border)',
                    background: value === key ? 'var(--gold)' : 'var(--bg-elevated)',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '11px', fontWeight: value === key ? 700 : 500,
                    color: value === key ? '#000000' : 'var(--text-2)',
                    transition: 'all 0.15s',
                }}
            >
                <span>{sys.icon}</span>
                {sys.label}
            </button>
        ))}
    </div>
);
