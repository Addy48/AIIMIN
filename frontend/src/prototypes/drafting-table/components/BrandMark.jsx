import React from 'react';

/**
 * The real AIIMIN mark — peak "A" (nested chevrons) under an arch, with the
 * brand's warm node (#FF6B35) at the summit. Rendered in the Drafting Table
 * language: strokes take theme color; the node stays warm — the one spark of
 * heat against the steel. `tile` wraps it in the app-icon square.
 */
export default function BrandMark({ size = 20, tile = false, node = '#ff6b35' }) {
  const inner = (
    <>
      <path
        d="M80 384 C80 192 208 112 256 112 C304 112 432 192 432 384"
        stroke="var(--muted)"
        strokeWidth="24"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M144 384 L256 176 L368 384"
        stroke="var(--color-text)"
        strokeWidth="24"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M192 368 L256 272 L320 368"
        stroke="var(--muted)"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <circle cx="256" cy="240" r="30" fill={node} />
    </>
  );

  if (tile) {
    return (
      <svg width={size} height={size} viewBox="0 0 512 512" fill="none" aria-label="AIIMIN">
        <rect width="512" height="512" rx="96" fill="var(--tint)" stroke="var(--rule)" strokeWidth="6" />
        {inner}
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="60 96 392 320" fill="none" aria-label="AIIMIN">
      {inner}
    </svg>
  );
}
