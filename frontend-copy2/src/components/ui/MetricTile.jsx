import React, { useEffect, useRef, useState } from 'react';

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
    <div style={{
      height: 'var(--card-tile)',
      background: mounted ? 'var(--glass-bg)' : 'transparent',
      backdropFilter: 'var(--glass-blur-sm)',
      WebkitBackdropFilter: 'var(--glass-blur-sm)',
      border: `1px solid ${mounted ? 'var(--glass-border)' : 'transparent'}`,
      borderLeft: `3px solid ${mounted ? color : 'transparent'}`,
      borderRadius: 'var(--r-md)',
      padding: '16px 16px 12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: `all var(--dur-enter) var(--ease)`,
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'var(--glass-bg-hover)';
      e.currentTarget.style.borderColor = 'var(--glass-border-lit)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'var(--glass-bg)';
      e.currentTarget.style.borderTopColor = 'var(--glass-border)';
      e.currentTarget.style.borderRightColor = 'var(--glass-border)';
      e.currentTarget.style.borderBottomColor = 'var(--glass-border)';
    }}
    >
      {/* Label */}
      <span className="text-label">{label}</span>

      {/* Value */}
      <span style={{
        font: '300 20px/1 var(--font-sans)',
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
