import React from 'react';

/**
 * Four `+` registration marks at the -6px corners, in the accent.
 * The wireframe frame every card / figure / primary button wears.
 */
export function Corners({ color = 'var(--color-accent)' }) {
  const base = {
    position: 'absolute',
    font: "400 11px/1 Barlow, sans-serif",
    fontStyle: 'normal',
    color,
  };
  return (
    <>
      <i style={{ ...base, top: -6, left: -6 }}>+</i>
      <i style={{ ...base, top: -6, right: -6 }}>+</i>
      <i style={{ ...base, bottom: -6, left: -6 }}>+</i>
      <i style={{ ...base, bottom: -6, right: -6 }}>+</i>
    </>
  );
}

/**
 * A blueprint box: square corners, hairline (or accent) border, `+` marks,
 * and an optional legend label that breaks the top border.
 */
export function Blueprint({
  legend,
  accent = false,
  tint = false,
  style,
  cornerColor,
  children,
}) {
  return (
    <div
      style={{
        position: 'relative',
        border: `1px solid ${accent ? 'var(--color-accent)' : 'var(--hair)'}`,
        background: tint ? 'var(--tint)' : 'transparent',
        ...style,
      }}
    >
      <Corners color={cornerColor} />
      {legend && (
        <div
          style={{
            position: 'absolute',
            top: -8,
            left: 'var(--space-4)',
            background: 'var(--color-bg)',
            padding: '0 var(--space-2)',
            font: "600 10px 'Barlow Condensed', sans-serif",
            letterSpacing: '.2em',
            color: 'var(--color-accent)',
          }}
        >
          {legend}
        </div>
      )}
      {children}
    </div>
  );
}
