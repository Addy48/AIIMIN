import React, { useEffect, useState } from 'react';

/**
 * MetricTile — Tier 2 display component.
 * Used in 2×2 grid: Sleep | Gym, Steps | Water.
 * Spec: 100px height, left border 2px color-coded, 3px progress bar.
 * Animates border + background on mount, staggered by index.
 */

const METRIC_COLORS = {
  sleep:  'var(--color-sleep)',
  gym:    'var(--color-gym)',
  steps:  'var(--color-steps)',
  water:  'var(--color-water)',
};

const MetricTile = ({
  type,         // 'sleep' | 'gym' | 'steps' | 'water'
  label,        // string — "SLEEP"
  value,        // string — "7h 20m" | "Yes" | "8,234" | "3"
  progress,     // 0–100 (percentage)
  context,      // string — secondary context "Target: 8h"
  index = 0,    // stagger delay
  done,         // boolean — completed state
  onClick,      // optional click handler
  interactive,  // boolean — shows pointer cursor + tap hint
}) => {
  const [mounted, setMounted] = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const color = METRIC_COLORS[type] || 'var(--color-accent)';

  useEffect(() => {
    const delay = index * 50; // +50ms per tile
    const t1 = setTimeout(() => setMounted(true), delay);
    const t2 = setTimeout(() => setBarWidth(progress || 0), delay + 50);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [index, progress]);

  return (
    <div
    onClick={onClick}
    style={{
      height: 'var(--card-tile)',
      background: mounted ? 'var(--color-surface)' : 'transparent',
      border: `1px solid ${mounted ? 'var(--color-border)' : 'transparent'}`,
      borderLeft: `2px solid ${mounted ? color : 'transparent'}`,
      borderRadius: 'var(--r-md)',
      padding: '16px 16px 12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: `background var(--dur-enter) var(--ease), border-color var(--dur-enter) var(--ease)`,
      position: 'relative',
      overflow: 'hidden',
      cursor: interactive ? 'pointer' : 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'var(--color-elevated)';
      e.currentTarget.style.borderTopColor = 'var(--color-border-lit)';
      e.currentTarget.style.borderRightColor = 'var(--color-border-lit)';
      e.currentTarget.style.borderBottomColor = 'var(--color-border-lit)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'var(--color-surface)';
      e.currentTarget.style.borderTopColor = 'var(--color-border)';
      e.currentTarget.style.borderRightColor = 'var(--color-border)';
      e.currentTarget.style.borderBottomColor = 'var(--color-border)';
    }}
    >
      {/* Label + log indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="text-label">{label}</span>
        {interactive && !done && (
          <span style={{
            font: '500 8px/1 var(--font-mono)',
            color: 'var(--color-text-3)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>log</span>
        )}
      </div>

      {/* Value */}
      <span style={{
        font: 'var(--text-metric)',
        color: done ? color : 'var(--color-text-1)',
      }}>
        {value ?? '—'}
      </span>

      {/* Context */}
      {context && (
        <span className="text-subtext">{context}</span>
      )}

      {/* Progress bar — 3px, teal fill */}
      {progress !== undefined && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'var(--color-border)',
        }}>
          <div style={{
            height: '100%',
            width: `${barWidth}%`,
            background: 'var(--color-accent)',
            transition: `width var(--dur-progress) var(--ease)`,
          }} />
        </div>
      )}
    </div>
  );
};

export default MetricTile;
