import React from 'react';

const StatCard = ({ stat, index, expandedCard, setExpandedCard }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const isExpanded = expandedCard === stat.id;

  return (
    <div className="fade-up" style={{ animationDelay: `${index * 50}ms` }}>
      <div
        style={{
          background: isHovered || isExpanded ? 'var(--color-elevated)' : 'var(--color-surface)',
          border: `1px solid ${isExpanded ? 'var(--color-accent)' : isHovered ? 'var(--color-border-lit)' : 'var(--color-border)'}`,
          borderRadius: 'var(--r-md)',
          padding: '16px 14px',
          cursor: 'pointer',
          transition: `background var(--dur-enter) var(--ease), border-color var(--dur-enter) var(--ease)`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => { e.stopPropagation(); setExpandedCard(isExpanded ? null : stat.id); }}
      >
        <span className="text-label" style={{ display: 'block', marginBottom: '10px' }}>
          {stat.label}
        </span>
        <span style={{ font: 'var(--text-metric)', color: 'var(--color-hero)' }}>
          {stat.value}
        </span>
        {stat.context && (
          <div style={{
            font: '300 11px/1 var(--font-sans)',
            color: stat.contextColor || 'var(--color-accent)',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
