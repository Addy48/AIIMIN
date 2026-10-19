import React from 'react';
import ArcMark from './ArcMark';
import { ARC_BRAND, ARC_TAGLINE } from '../../constants/arc';

/**
 * Arc wordmark — orange mark inline with white "Arc" title.
 */
export default function ArcLockup({
  size = 'md',
  showTagline = false,
  center = false,
  className,
  style,
}) {
  const sizes = {
    sm: { title: 18, markScale: 0.72, tagline: 12, gap: 7 },
    md: { title: 22, markScale: 0.7, tagline: 13, gap: 8 },
    lg: { title: 30, markScale: 0.68, tagline: 14, gap: 9 },
  };
  const s = sizes[size] || sizes.md;
  const markSize = Math.round(s.title * s.markScale);

  return (
    <div className={className} style={{ ...style, textAlign: center ? 'center' : undefined }}>
      <div className="arc-lockup__row" style={{ gap: s.gap, justifyContent: center ? 'center' : 'flex-start' }}>
        <span className="arc-lockup__mark">
          <ArcMark
            size={markSize}
            stroke="var(--color-accent)"
            dot="var(--color-accent)"
          />
        </span>
        <span
          className="arc-lockup__word"
          style={{
            fontSize: s.title,
            fontWeight: 850,
            color: 'var(--color-text-1)',
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-display, var(--font-sans))',
          }}
        >
          {ARC_BRAND}
        </span>
      </div>
      {showTagline && (
        <p
          style={{
            margin: center ? '10px auto 0' : '10px 0 0',
            fontSize: s.tagline,
            fontWeight: 500,
            color: 'var(--color-text-2)',
            lineHeight: 1.45,
            maxWidth: 360,
            textAlign: center ? 'center' : 'left',
          }}
        >
          {ARC_TAGLINE}
        </p>
      )}
    </div>
  );
}
