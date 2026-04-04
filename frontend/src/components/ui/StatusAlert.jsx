import React from 'react';

/**
 * StatusAlert — Critical/warning notification strip.
 * Spec: 60px height, left border 3px (red=critical, teal=info), #1C1E1A bg.
 * Used for: sleep deficit, no gym 5+ days, placement deadline.
 */
const StatusAlert = ({
  type = 'info',  // 'critical' | 'info'
  title,
  detail,
  action,          // { label, onClick }
}) => {
  const borderColor = type === 'critical'
    ? 'var(--color-alert-red)'
    : 'var(--color-accent)';

  return (
    <div style={{
      minHeight: 'var(--alert-height)',
      background: 'var(--color-elevated)',
      borderLeft: `3px solid ${borderColor}`,
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{
          font: '500 13px/1 var(--font-sans)',
          color: 'var(--color-text-1)',
        }}>
          {title}
        </span>
        {detail && (
          <span className="text-subtext">{detail}</span>
        )}
      </div>

      {action && (
        <button
          onClick={action.onClick}
          style={{
            font: '500 11px/1 var(--font-mono)',
            color: borderColor,
            background: 'transparent',
            border: `1px solid ${borderColor}`,
            padding: '4px 10px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
            transition: `background var(--dur-fast) var(--ease)`,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-border)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default StatusAlert;
