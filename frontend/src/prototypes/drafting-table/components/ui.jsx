import React from 'react';

// Reused type tokens (the prototype leans on `font:` shorthand everywhere).
export const F = {
  chrome: { font: "600 13px/1 'Barlow Condensed', sans-serif", letterSpacing: '.18em', textTransform: 'uppercase' },
  sectionLabel: { font: "600 10px 'Barlow Condensed', sans-serif", letterSpacing: '.2em', color: 'var(--muted)' },
  cellLabel: { font: "600 9.5px 'Barlow Condensed', sans-serif", letterSpacing: '.16em', color: 'var(--muted)' },
  mono: (size, weight = 400) => ({ font: `${weight} ${size}px 'JetBrains Mono', monospace` }),
  body: (size, weight = 400, lh = 1.5) => ({ font: `${weight} ${size}px/${lh} Barlow, sans-serif` }),
};

// The header rule pair: top+bottom rule with a title left, meta right.
export function ScreenHead({ title, meta, metaColor = 'var(--muted)', center }) {
  return (
    <div
      style={{
        borderTop: '1px solid var(--rule)',
        borderBottom: '1px solid var(--rule)',
        padding: 'var(--space-3) 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      <span style={F.chrome}>{title}</span>
      {meta != null && (
        <span style={{ ...F.mono(10.5), color: metaColor }}>{meta}</span>
      )}
    </div>
  );
}

// A section divider: top rule + all-caps label (optionally with a right value).
export function SectionRule({ label, value, valueColor = 'var(--color-accent)', style }) {
  return (
    <div
      style={{
        marginTop: 'var(--space-6)',
        borderTop: '1px solid var(--rule)',
        paddingTop: 'var(--space-3)',
        display: value != null ? 'flex' : 'block',
        justifyContent: 'space-between',
        ...F.sectionLabel,
        ...style,
      }}
    >
      <span>{label}</span>
      {value != null && (
        <span style={{ ...F.mono(10), color: valueColor, fontWeight: 500 }}>{value}</span>
      )}
    </div>
  );
}

// The solid-accent primary button (the one filled object on the board).
export function PrimaryButton({ children, onClick, style }) {
  return (
    <button
      className="tap"
      onClick={onClick}
      style={{
        font: "600 13px 'Barlow Condensed', sans-serif",
        letterSpacing: '.14em',
        textTransform: 'uppercase',
        color: 'var(--color-bg)',
        background: 'var(--color-accent)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        padding: 13,
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// An outlined / ghost button.
export function GhostButton({ children, onClick, color = 'var(--color-accent)', style }) {
  return (
    <button
      className="tap"
      onClick={onClick}
      style={{
        font: "600 12px 'Barlow Condensed', sans-serif",
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        color,
        background: 'transparent',
        border: '1px solid var(--rule)',
        borderRadius: 'var(--radius-md)',
        padding: '9px 16px',
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
