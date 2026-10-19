import React, { useState } from 'react';

/**
 * TaskRow — Tier 3 list component.
 * Spec: 48px height, 16×16 checkbox, 270ms total completion animation.
 * Animation sequence:
 *   0ms:   checkbox fills teal (120ms)
 *   120ms: checkmark draws in (100ms)
 *   50ms:  title starts fading + strikethrough (150ms)
 * Total: 270ms
 */
const TaskRow = ({
  id,
  title,
  dueTime,     // string — "2:30 PM" or null
  completed,
  onToggle,    // fn(id)
  onDelete,    // optional fn(id)
  source,      // 'calendar' | 'manual' — used for indicator
}) => {
  const [animating, setAnimating] = useState(false);
  const [localDone, setLocalDone] = useState(completed);

  const handleToggle = () => {
    if (animating) return;
    setAnimating(true);
    setLocalDone(true);

    // After animation completes, call parent
    setTimeout(() => {
      setAnimating(false);
      onToggle?.(id);
    }, 270);
  };

  const isDone = localDone;

  return (
    <div style={{
      height: 'var(--row-task)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '0 4px',
      borderBottom: '1px solid var(--color-border)',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
        style={{
          width: '16px',
          height: '16px',
          flexShrink: 0,
          border: `1.5px solid ${isDone ? 'var(--color-accent)' : 'var(--color-text-3)'}`,
          background: isDone ? 'var(--color-accent)' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          transition: `background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)`,
        }}
      >
        {isDone && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path
              className="checkmark-path"
              d="M1 3L3.5 5.5L8 1"
              stroke="var(--color-base)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Title */}
      <span style={{
        font: 'var(--text-body)',
        color: isDone ? 'var(--color-text-3)' : 'var(--color-text-1)',
        textDecoration: isDone ? 'line-through' : 'none',
        flex: 1,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        opacity: isDone ? 0.5 : 1,
        transition: `opacity var(--dur-normal) var(--ease) 50ms, color var(--dur-normal) var(--ease) 50ms`,
      }}>
        {title}
      </span>

      {/* Meta: due time + source indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {source === 'calendar' && (
          <span style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'var(--color-accent)',
            opacity: 0.6,
          }} />
        )}
        {dueTime && (
          <span className="text-subtext">{dueTime}</span>
        )}
      </div>
    </div>
  );
};

export default TaskRow;
