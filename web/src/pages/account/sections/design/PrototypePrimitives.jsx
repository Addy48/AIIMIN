import React from 'react';
import { ArchBracketMark } from '../../../../components/brand/archBracketMark';
import { tokensToStyle } from './prototypeTokens';

export function PrototypeFrame({ tokens, children, rounded = true, className = '' }) {
  return (
    <div
      className={`proto-frame ${rounded ? 'proto-frame--rounded' : ''} ${className}`.trim()}
      style={tokensToStyle(tokens)}
    >
      {children}
    </div>
  );
}

export function ProtoMark({ tokens, size = 34 }) {
  return (
    <ArchBracketMark
      size={size}
      withChip
      density="nav"
      colors={{
        chipFill: tokens['--proto-chip-fill'],
        chipStroke: tokens['--proto-chip-stroke'],
        arch: '#D1D5DB',
        outer: '#14171A',
        inner: '#6B7280',
        dot: tokens['--proto-accent'] || '#FF6B35',
        archOpacity: 0.9,
        innerOpacity: 0.85,
      }}
    />
  );
}

export function ProtoWordmark({ color = 'var(--proto-text-1)', size = 26 }) {
  return (
    <span className="proto-nav__wordmark" style={{ color, fontSize: size }}>
      AIIMIN
    </span>
  );
}

export function PageSnippet({ tokens, titleStyle = 'serif', showEyebrow = true }) {
  const TitleTag = titleStyle === 'serif' ? 'h2' : 'h2';
  const titleClass = titleStyle === 'serif' ? 'proto-page__title-serif' : 'proto-page__title-sans';

  return (
    <div className="proto-page" style={tokensToStyle(tokens)}>
      {showEyebrow && (
        <div className="proto-page__eyebrow" style={{ color: tokens['--proto-accent'] }}>
          Operational intelligence
        </div>
      )}
      <TitleTag className={titleClass}>Day Control.</TitleTag>
      <div className="proto-capture-row">
        {['Log a Habit', 'Journal Entry', 'Track Expense', 'Add Goal'].map((label) => (
          <div key={label} className="proto-capture">
            {label}
          </div>
        ))}
      </div>
      <div className="proto-hero-card">
        <div className="proto-hero-card__num">22 DAYS</div>
        <div className="proto-hero-card__label">Until July 26 - Placements</div>
        <span className="proto-hero-card__cta">Launch Portal</span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span
          className="proto-pill"
          style={{
            background: `color-mix(in srgb, ${tokens['--proto-accent']} 14%, transparent)`,
            color: tokens['--proto-accent'],
            border: `1px solid color-mix(in srgb, ${tokens['--proto-accent']} 28%, transparent)`,
          }}
        >
          Active nav accent
        </span>
        <span
          className="proto-pill"
          style={{
            background: `color-mix(in srgb, ${tokens['--proto-success']} 14%, transparent)`,
            color: tokens['--proto-success'],
            border: `1px solid color-mix(in srgb, ${tokens['--proto-success']} 28%, transparent)`,
          }}
        >
          Completion / streak
        </span>
      </div>
    </div>
  );
}

export function TokenSwatches({ tokens, labels }) {
  const entries = labels || [
    ['base', '--proto-base'],
    ['surface', '--proto-surface'],
    ['elevated', '--proto-elevated'],
    ['border', '--proto-border'],
    ['text-1', '--proto-text-1'],
    ['text-2', '--proto-text-2'],
    ['accent', '--proto-accent'],
    ['success', '--proto-success'],
    ['logo-bg', '--proto-logo-bg'],
  ];

  return (
    <div className="proto-swatches">
      {entries.map(([name, key]) => (
        <div key={key} className="proto-swatch">
          <div className="proto-swatch__chip" style={{ background: tokens[key] }} />
          <div className="proto-swatch__meta">
            <span className="proto-swatch__name">{name}</span>
            <span className="proto-swatch__hex">{tokens[key]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LabCard({ title, desc, badge, badgeVariant = 'current', children, headExtra }) {
  return (
    <div className="design-lab__card">
      <div className="design-lab__card-head">
        <div>
          <h3 className="design-lab__card-title">{title}</h3>
          {desc && <p className="design-lab__card-desc">{desc}</p>}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {badge && (
            <span className={`design-lab__badge design-lab__badge--${badgeVariant}`}>{badge}</span>
          )}
          {headExtra}
        </div>
      </div>
      {children}
    </div>
  );
}
