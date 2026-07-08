import React from 'react';
import { Link } from 'react-router-dom';
import ArcLockup from '../brand/ArcLockup';
import ArcMark from '../brand/ArcMark';
import { ARC_BRAND, LIFE_ARC_LABEL } from '../../constants/arc';

export default function ArcBanner({ lifeArc, compact = false }) {
  const line = lifeArc?.trim();
  if (!line) return null;

  if (compact) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          borderRadius: 999,
          border: '1px solid color-mix(in srgb, var(--color-accent) 30%, var(--color-border))',
          background: 'var(--color-accent-dim)',
          maxWidth: '100%',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, lineHeight: 1, flexShrink: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', width: 14, height: 14 }}>
            <ArcMark size={14} stroke="var(--color-accent)" dot="var(--color-accent)" />
          </span>
          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-text-1)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {ARC_BRAND}
          </span>
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-3)' }}>·</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {line}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        marginBottom: 20,
        padding: '16px 20px',
        borderRadius: 16,
        border: '1px solid color-mix(in srgb, var(--color-accent) 28%, var(--color-border))',
        background: 'linear-gradient(135deg, var(--color-accent-dim), var(--color-surface-2))',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <ArcLockup size="sm" showTagline style={{ marginBottom: 12 }} />
        <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-3)' }}>
          {LIFE_ARC_LABEL}
        </p>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 700, lineHeight: 1.45, color: 'var(--color-text-1)' }}>
          {line}
        </p>
        <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--color-text-3)' }}>
          Daily Arc and Weekly Arc bend toward this.
        </p>
      </div>
      <Link
        to="/account?section=profile"
        style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'none', flexShrink: 0 }}
      >
        Edit →
      </Link>
    </div>
  );
}
