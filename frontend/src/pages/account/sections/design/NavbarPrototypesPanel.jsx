import React, { useState } from 'react';
import { PROPOSED_THEMES } from './prototypeTokens';
import { LabCard } from './PrototypePrimitives';
import {
  NavbarCurrent,
  NavbarMasthead,
  NavbarCommandBar,
  NavbarComparisonPanel,
} from './NavbarPrototypes';

const VARIANTS = [
  {
    id: 'current',
    title: 'A. Current production',
    desc: '80px glass bar, 12 equal Figtree links, gray pill active state, OS Online badge, split brand links. This is what feels wrong after the logo upgrade.',
    badge: 'Current',
    badgeVariant: 'current',
    recommended: false,
  },
  {
    id: 'masthead',
    title: 'B. Masthead (recommended)',
    desc: '68px opaque bar, brand zone with hairline separator, 4 primary links + More overflow, orange underline active, no OS Online, unified brand click, Figtree page titles in snippet.',
    badge: 'Recommended',
    badgeVariant: 'proposed',
    recommended: true,
  },
  {
    id: 'command',
    title: 'C. Command bar',
    desc: '64px dense bar, mark-only (no wordmark in nav), icon+label for top 6 destinations, text-only for the rest. Raycast-like efficiency if you need all routes visible.',
    badge: 'Alternative',
    badgeVariant: 'current',
    recommended: false,
  },
];

export default function NavbarPrototypesPanel() {
  const [variant, setVariant] = useState('masthead');
  const dark = PROPOSED_THEMES['aiimin-dark'].tokens;
  const light = PROPOSED_THEMES['aiimin-light'].tokens;
  const meta = VARIANTS.find((v) => v.id === variant);

  const renderNav = (tokens) => {
    if (variant === 'current') return <NavbarCurrent tokens={tokens} />;
    if (variant === 'command') return <NavbarCommandBar tokens={tokens} />;
    return <NavbarMasthead tokens={tokens} />;
  };

  return (
    <div className="design-lab__panel">
      <div className="design-lab__select-row" style={{ padding: 0, marginBottom: 8 }}>
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`design-lab__chip-btn ${variant === v.id ? 'is-active' : ''}`}
            onClick={() => setVariant(v.id)}
            style={v.recommended ? { borderColor: 'color-mix(in srgb, #ff6b35 35%, var(--color-border))' } : undefined}
          >
            {v.id === 'current' ? 'Current' : v.id === 'masthead' ? 'Masthead' : 'Command'}
          </button>
        ))}
      </div>

      <LabCard title={meta.title} desc={meta.desc} badge={meta.badge} badgeVariant={meta.badgeVariant}>
        {variant === 'masthead' ? (
          <NavbarComparisonPanel darkTokens={dark} lightTokens={light} variant="masthead" />
        ) : (
          <>
            <div className="design-lab__select-row">
              <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>Preview uses proposed dark tokens</span>
            </div>
            {renderNav(dark)}
          </>
        )}
      </LabCard>

      <LabCard
        title="Navbar spec sheet (masthead)"
        desc="Exact values from the audit, ready to implement."
        badge="Spec"
        badgeVariant="proposed"
      >
        <div style={{ padding: '16px 18px', display: 'grid', gap: 8, fontSize: 12, lineHeight: 1.55, color: 'var(--color-text-2)' }}>
          {[
            ['Height', '68px (--nav-height)'],
            ['Background', 'Opaque proto-base, no blur (or 92% mix max)'],
            ['Brand zone', 'Mark 34px + wordmark 26px Bodoni, hairline border-right 1px'],
            ['Primary nav', 'Today, Habits, Goals, Journal - Figtree 14px/500'],
            ['Overflow', 'More button opens secondary row: Finance through Lab'],
            ['Active state', '2px bottom border in --color-accent (orange), not gray pill'],
            ['Actions', 'Theme icon, bell, avatar only - remove OS Online from nav'],
            ['Avatar', 'var(--color-logo-bg) not hardcoded hex'],
            ['Page title', 'Figtree 26px/800, no OPERATIONAL INTELLIGENCE eyebrow'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontWeight: 800, color: 'var(--color-text-1)' }}>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </LabCard>

      <LabCard title="All three variants on proposed dark" desc="Scroll horizontally if needed. Compare density and brand weight." badge="Compare" badgeVariant="current">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '16px 18px' }}>
          <div>
            <p className="proto-compare-col__label">Current</p>
            <NavbarCurrent tokens={dark} />
          </div>
          <div>
            <p className="proto-compare-col__label">Masthead</p>
            <NavbarMasthead tokens={dark} />
          </div>
          <div>
            <p className="proto-compare-col__label">Command bar</p>
            <NavbarCommandBar tokens={dark} />
          </div>
        </div>
      </LabCard>
    </div>
  );
}
