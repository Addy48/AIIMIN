import React, { useEffect, useRef, useState } from 'react';

/**
 * HeroMetricCard — Tier 1 display component.
 * Used for: Daily Score, Sleep, Net Worth.
 * Spec: 120px height, #141614 bg, count-up animation 1.2s, glow finish.
 * RULE: cream color (#E8DCC8) — max 5 uses per screen total across all cards.
 */
const HeroMetricCard = ({
  label,       // string — "DAILY SCORE"
  value,       // number — the target value to count up to
  unit,        // string — "h", "/100", "₹"
  unitPosition = 'after', // 'before' | 'after'
  context,     // string — "On track" / "7h 20m"
  contextColor,// optional css color override
  suffix,      // optional string after unit
  decimals = 0,// decimal places for display
  onClick,     // optional click handler
}) => {
  const [displayed, setDisplayed] = useState(0);
  const [glowing, setGlowing] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    if (value === null || value === undefined || isNaN(value)) {
      setDisplayed(null);
      return;
    }

    const start = performance.now();
    const duration = 1200; // --dur-hero
    const from = 0;
    const to = value;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // cubic-bezier(0.25,0.46,0.45,0.94) approximation
      const eased = progress < 1
        ? 1 - Math.pow(1 - progress, 3)
        : 1;
      const current = from + (to - from) * eased;
      setDisplayed(parseFloat(current.toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(to);
        setGlowing(true);
        setTimeout(() => setGlowing(false), 300);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, decimals]);

  const formattedValue = displayed !== null
    ? new Intl.NumberFormat('en-IN').format(displayed)
    : '—';

  return (
    <div
      onClick={onClick}
      style={{
        height: 'var(--card-hero)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--r-md)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        transition: `background var(--dur-enter) var(--ease), border-color var(--dur-enter) var(--ease)`,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-elevated)'; e.currentTarget.style.borderColor = 'var(--color-border-lit)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
    >
      {/* Label */}
      <span className="text-label">{label}</span>

      {/* Hero Number */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        {unitPosition === 'before' && unit && (
          <span style={{
            font: '300 28px/1 var(--font-sans)',
            color: 'var(--color-hero)',
          }}>{unit}</span>
        )}
        <span
          className={glowing ? 'hero-glow' : ''}
          style={{
            font: 'var(--text-hero)',
            color: 'var(--color-hero)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formattedValue}
        </span>
        {unitPosition === 'after' && unit && (
          <span style={{
            font: '300 20px/1 var(--font-sans)',
            color: 'var(--color-text-2)',
          }}>{unit}</span>
        )}
        {suffix && (
          <span className="text-subtext">{suffix}</span>
        )}
      </div>

      {/* Context */}
      {context && (
        <span className="text-subtext" style={{
          color: contextColor || 'var(--color-text-2)',
        }}>
          {context}
        </span>
      )}
    </div>
  );
};

export default HeroMetricCard;
