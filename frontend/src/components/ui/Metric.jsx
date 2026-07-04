import React, { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

/**
 * <Metric> — canonical metric display component (Phase 2, C2).
 *
 * Supersedes ad-hoc metric markup scattered across Overview, Finance, and
 * Habits. Composable via `size` + `tone` rather than one-off inline styles.
 *
 *   <Metric label="Net worth" value={182400} unit="₹" size="lg" />
 *   <Metric label="Streak" value={14} unit="d" trend={+2} />
 *   <Metric label="Sleep" value="7h 20m" progress={82} tone="sleep" />
 */
const TONE_COLOR = {
  default: 'var(--color-accent)',
  sleep: 'var(--color-sleep)',
  gym: 'var(--color-gym)',
  steps: 'var(--color-steps)',
  water: 'var(--color-water)',
  danger: 'var(--color-danger)',
  warning: 'var(--color-warning)',
};

const SIZE = {
  sm: { value: 20, label: 11, height: 'var(--card-tile)' },
  md: { value: 28, label: 11, height: 'auto' },
  lg: { value: 40, label: 11, height: 'var(--card-hero)' },
};

function useCountUp(target, decimals = 0) {
  const [displayed, setDisplayed] = useState(typeof target === 'number' ? 0 : target);
  const rafRef = useRef(null);

  useEffect(() => {
    if (typeof target !== 'number' || Number.isNaN(target)) {
      setDisplayed(target);
      return undefined;
    }
    const start = performance.now();
    const duration = 800;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(parseFloat((target * eased).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, decimals]);

  return displayed;
}

export default function Metric({
  label,
  value,
  unit,
  unitPosition = 'after',
  context,
  trend,
  progress,
  tone = 'default',
  size = 'md',
  icon: Icon,
  animate = true,
  onClick,
  style = {},
}) {
  const scale = SIZE[size] || SIZE.md;
  const color = TONE_COLOR[tone] || TONE_COLOR.default;
  const isNumeric = typeof value === 'number';
  const animated = useCountUp(isNumeric && animate ? value : null);
  const displayValue = isNumeric && animate
    ? new Intl.NumberFormat('en-IN').format(animated ?? 0)
    : (value ?? '—');

  const trendPositive = typeof trend === 'number' && trend > 0;
  const trendNegative = typeof trend === 'number' && trend < 0;

  return (
    <div
      className="metric"
      onClick={onClick}
      style={{
        minHeight: scale.height,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {Icon && <Icon size={13} color="var(--color-text-3)" />}
        <span className="text-label" style={{ fontSize: scale.label }}>{label}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {unitPosition === 'before' && unit && (
          <span style={{ font: `300 ${scale.value * 0.55}px/1 var(--font-sans)`, color: 'var(--color-text-2)' }}>{unit}</span>
        )}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: scale.value,
            lineHeight: 1,
            color: 'var(--color-text-1)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
          }}
        >
          {displayValue}
        </span>
        {unitPosition === 'after' && unit && (
          <span style={{ font: `300 ${scale.value * 0.5}px/1 var(--font-sans)`, color: 'var(--color-text-2)' }}>{unit}</span>
        )}
        {typeof trend === 'number' && trend !== 0 && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 700,
            color: trendPositive ? 'var(--color-success)' : trendNegative ? 'var(--color-danger)' : 'var(--color-text-3)',
          }}>
            {trendPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}{typeof trend === 'number' && Math.abs(trend) < 1 ? '%' : ''}
          </span>
        )}
      </div>

      {context && <span className="text-subtext">{context}</span>}

      {progress !== undefined && progress !== null && (
        <div style={{ height: 3, borderRadius: 9999, background: 'var(--color-border)', overflow: 'hidden', marginTop: 2 }}>
          <div style={{
            height: '100%', width: `${Math.max(0, Math.min(100, progress))}%`,
            background: color, transition: `width var(--dur-progress) var(--ease)`,
          }} />
        </div>
      )}
    </div>
  );
}
