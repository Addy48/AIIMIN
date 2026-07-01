import React from 'react';

/** Shared wordmark styles — high-contrast Didot/Bodoni display serif. */
export const WORDMARK_STYLE = {
  fontFamily: 'var(--font-brand)',
  fontWeight: 700,
  letterSpacing: '-0.04em',
  lineHeight: 1,
  fontOpticalSizing: 'auto',
  textTransform: 'uppercase',
};

/** AIIMIN wordmark — Bodoni Moda only, for the literal "AIIMIN" brand mark. */
export default function Wordmark({
  size = 28,
  weight = WORDMARK_STYLE.fontWeight,
  color = 'var(--color-text-1)',
  as: Component = 'span',
  style = {},
  className = '',
}) {
  return (
    <Component
      className={className ? `aiimin-wordmark ${className}` : 'aiimin-wordmark'}
      style={{
        ...WORDMARK_STYLE,
        fontSize: size,
        fontWeight: weight,
        color,
        ...style,
      }}
    >
      AIIMIN
    </Component>
  );
}
