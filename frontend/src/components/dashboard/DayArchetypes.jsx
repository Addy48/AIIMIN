import React from 'react';

const ARCHETYPES = [
    { id: 'builder',   label: 'Builder',   emoji: '🏗️', desc: 'Deep work + coding focus',   color: '#3b82f6' },
    { id: 'warrior',   label: 'Warrior',   emoji: '⚔️', desc: 'Gym + high physical output', color: '#ef4444' },
    { id: 'scholar',   label: 'Scholar',   emoji: '📚', desc: 'Learning + reading day',      color: '#8b5cf6' },
    { id: 'navigator', label: 'Navigator', emoji: '🧭', desc: 'Planning + reviews',           color: '#f59e0b' },
    { id: 'restorer',  label: 'Restorer',  emoji: '🌿', desc: 'Recovery + low stimulus',      color: '#10b981' },
    { id: 'connector', label: 'Connector', emoji: '🤝', desc: 'Social + networking day',      color: '#ec4899' },
];

const DayArchetypes = ({ currentArchetype, onSelect }) => (
    <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: '20px',
    }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
            Day Archetype
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {ARCHETYPES.map(a => {
                const active = currentArchetype === a.id;
                return (
                    <button
                        key={a.id}
                        onClick={() => onSelect?.(a.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '12px 8px',
                            background: active ? `${a.color}18` : 'transparent',
                            border: `1px solid ${active ? a.color : 'var(--border)'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <span style={{ fontSize: '20px' }}>{a.emoji}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: active ? a.color : 'var(--text-2)' }}>
                            {a.label}
                        </span>
                    </button>
                );
            })}
        </div>
        {currentArchetype && (
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-3)', textAlign: 'center' }}>
                {ARCHETYPES.find(a => a.id === currentArchetype)?.desc}
            </div>
        )}
    </div>
);

export default DayArchetypes;
