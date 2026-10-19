import React, { useState } from 'react';
import { ArchBracketMark } from '../../../../components/brand/archBracketMark';
import { CHIP_VARIANTS, PROPOSED_THEMES } from './prototypeTokens';
import { LabCard, PrototypeFrame } from './PrototypePrimitives';

export default function LogoTypographyPanel() {
  const [chipKey, setChipKey] = useState('editorLight');
  const chip = CHIP_VARIANTS[chipKey];
  const dark = PROPOSED_THEMES['aiimin-dark'].tokens;
  const light = PROPOSED_THEMES['aiimin-light'].tokens;

  return (
    <div className="design-lab__panel">
      <LabCard
        title="Logo chip variants"
        desc="On light mode the white chip floats like a sticker. Proposed: soft paper fill, 1px stroke, no heavy drop shadow."
        badge="Logo"
        badgeVariant="proposed"
      >
        <div className="design-lab__select-row">
          {Object.entries(CHIP_VARIANTS).map(([key, v]) => (
            <button
              key={key}
              type="button"
              className={`design-lab__chip-btn ${chipKey === key ? 'is-active' : ''}`}
              onClick={() => setChipKey(key)}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="proto-compare-grid">
          <div>
            <p className="proto-compare-col__label" style={{ paddingLeft: 18 }}>On proposed dark</p>
            <PrototypeFrame tokens={dark} rounded>
              <div style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <ArchBracketMark
                  size={40}
                  withChip
                  density="nav"
                  colors={{
                    chipFill: chip.chipFill,
                    chipStroke: chip.chipStroke,
                    arch: chip.arch,
                    outer: chip.outer,
                    inner: chip.inner,
                    dot: chip.dot,
                    archOpacity: 0.9,
                    innerOpacity: 0.85,
                  }}
                />
                <span className="proto-nav__wordmark">AIIMIN</span>
              </div>
            </PrototypeFrame>
          </div>
          <div>
            <p className="proto-compare-col__label" style={{ paddingLeft: 18 }}>On proposed light</p>
            <PrototypeFrame tokens={light} rounded>
              <div style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <ArchBracketMark
                  size={40}
                  withChip
                  density="nav"
                  colors={{
                    chipFill: chip.chipFill,
                    chipStroke: chip.chipStroke,
                    arch: chip.arch,
                    outer: chip.outer,
                    inner: chip.inner,
                    dot: chip.dot,
                    archOpacity: 0.9,
                    innerOpacity: 0.85,
                  }}
                />
                <span className="proto-nav__wordmark" style={{ color: light['--proto-text-1'] }}>AIIMIN</span>
              </div>
            </PrototypeFrame>
          </div>
        </div>
      </LabCard>

      <LabCard
        title="Typography hierarchy"
        desc="Proposed: Bodoni stays wordmark-only. Page titles move to Figtree 800 so the nav does not fight two display voices."
        badge="Typeset"
        badgeVariant="proposed"
      >
        <div className="proto-type-row">
          <span className="proto-type-label">Current nav</span>
          <div>
            <span className="proto-nav__wordmark" style={{ fontSize: 26, marginRight: 16 }}>AIIMIN</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, color: 'var(--color-text-2)' }}>Today Habits Goals</span>
            <p style={{ margin: '8px 0 0', fontSize: 11, color: 'var(--color-text-3)' }}>Serif wordmark + Figtree links = no bridge</p>
          </div>
        </div>
        <div className="proto-type-row">
          <span className="proto-type-label">Current page H1</span>
          <div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>Day Control.</h2>
            <p style={{ margin: '8px 0 0', fontSize: 11, color: 'var(--color-text-3)' }}>Familjen Grotesk competes with Bodoni in the same viewport</p>
          </div>
        </div>
        <div className="proto-type-row">
          <span className="proto-type-label">Proposed page H1</span>
          <div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>Day Control.</h2>
            <p style={{ margin: '8px 0 0', fontSize: 11, color: 'var(--color-text-3)' }}>One display voice in content; Bodoni reserved for brand mark</p>
          </div>
        </div>
        <div className="proto-type-row">
          <span className="proto-type-label">Proposed eyebrow</span>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-2)' }}>
              Drop &quot;OPERATIONAL INTELLIGENCE&quot; kicker from page headers (max 1 per page in app, not on every screen).
            </p>
          </div>
        </div>
        <div className="proto-type-row">
          <span className="proto-type-label">Font stack</span>
          <div style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--color-text-2)' }}>
            <div><strong style={{ color: 'var(--color-text-1)' }}>Bodoni Moda</strong> - wordmark only</div>
            <div><strong style={{ color: 'var(--color-text-1)' }}>Figtree</strong> - nav, body, page titles, buttons</div>
            <div><strong style={{ color: 'var(--color-text-1)' }}>JetBrains Mono</strong> - stats, dates, XP</div>
          </div>
        </div>
      </LabCard>

      <LabCard
        title="Brand click target"
        desc="Current: mark links to /identity, wordmark to /overview. Proposed: single lockup click to /overview."
        badge="IA"
        badgeVariant="current"
      >
        <div className="proto-compare-grid">
          <div style={{ padding: '0 18px 18px' }}>
            <p className="proto-compare-col__label">Current (split)</p>
            <div style={{ padding: 16, borderRadius: 12, border: '1px dashed var(--color-border)', background: 'var(--color-surface-2)' }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>[mark] -&gt; /identity</span>
              <br />
              <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>[AIIMIN] -&gt; /overview</span>
            </div>
          </div>
          <div style={{ padding: '0 18px 18px' }}>
            <p className="proto-compare-col__label">Proposed (unified)</p>
            <div style={{ padding: 16, borderRadius: 12, border: '1px solid color-mix(in srgb, var(--color-accent) 25%, var(--color-border))', background: 'var(--color-accent-dim)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-1)' }}>[mark + AIIMIN] -&gt; /overview</span>
              <br />
              <span style={{ fontSize: 11, color: 'var(--color-text-3)', marginTop: 6, display: 'inline-block' }}>Identity / brand guidelines live under Account or /identity via footer link</span>
            </div>
          </div>
        </div>
      </LabCard>
    </div>
  );
}
