import React from 'react';

const CARD_CONFIG = [
    { key: 'physical', label: 'Physical', icon: '🦾' },
    { key: 'cognitive', label: 'Cognitive', icon: '🧠' },
    { key: 'discipline', label: 'Behavior', icon: '🔄' },
    { key: 'financial', label: 'Financial', icon: '💰' },
    { key: 'emotional', label: 'Emotional', icon: '👁' },
];

const arrowFor = (value) => value > 0 ? '↑' : value < 0 ? '↓' : '→';
const arrowColor = (value) => value > 0 ? 'var(--success)' : value < 0 ? 'var(--danger)' : 'var(--text-3)';

export default function SystemOverviewStrip({ scores = {}, trends = {} }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            gap: '12px',
            margin: '20px 0 24px',
        }} className="system-overview-strip">
            {CARD_CONFIG.map((card) => (
                <div key={card.key} className="glass-panel" style={{
                    padding: '16px 18px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    minWidth: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            {card.icon} {card.label}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: arrowColor(trends[card.key] || 0) }}>
                            {arrowFor(trends[card.key] || 0)}
                        </span>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.04em' }}>
                        {Math.round(scores[card.key] || 0)}
                    </div>
                    <div style={{ height: '6px', borderRadius: '999px', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                        <div style={{
                            width: `${Math.max(0, Math.min(100, scores[card.key] || 0))}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--accent), #f7d78b)',
                        }} />
                    </div>
                </div>
            ))}
        </div>
    );
}
