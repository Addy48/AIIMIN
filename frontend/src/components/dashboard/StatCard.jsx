import React from 'react';

const StatCard = ({ stat, index, expandedCard, setExpandedCard }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const isExpanded = expandedCard === stat.id;
    return (
        <div className="fade-up" style={{ animationDelay: `${index * 50}ms` }}>
            <div
                style={{
                    background: isHovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                    border: isExpanded ? '1px solid var(--accent)' : isHovered ? '1px solid var(--border-hover)' : '1px solid var(--border)',
                    borderRadius: '14px', padding: '16px 14px',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                    boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.2)' : 'none',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={(e) => { e.stopPropagation(); setExpandedCard(isExpanded ? null : stat.id); }}
            >
                <span style={{ fontSize: '18px', display: 'block', marginBottom: '10px' }}>{stat.icon}</span>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-1)', marginTop: '4px', letterSpacing: '-0.3px' }}>{stat.value}</div>
                {stat.context && (
                    <div style={{ fontSize: '11px', color: stat.contextColor || 'var(--accent)', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                            <polyline points="16 7 22 7 22 13" />
                        </svg>
                        {stat.context}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
