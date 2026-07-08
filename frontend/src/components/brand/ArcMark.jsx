import React from 'react';

/**
 * Minimal Arc mark — trajectory curve + focal dot.
 * Pairs with AIIMIN Arch Bracket (upward momentum) without duplicating the logo.
 */
export default function ArcMark({
  size = 20,
  stroke = 'var(--color-accent)',
  dot = 'var(--color-accent)',
  strokeWidth = 2,
  className,
  style,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ display: 'block', flexShrink: 0, overflow: 'visible', ...style }}
    >
      <g transform="translate(0, 1)">
        <path
          d="M3.5 17.5C7.5 8.5 10.5 6 12 6s4.5 2.5 8.5 11.5"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <circle cx="12" cy="6" r="2.25" fill={dot} />
      </g>
    </svg>
  );
}
