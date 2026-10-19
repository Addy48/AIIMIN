import React, { useState } from 'react';
import {
  CURRENT_THEMES,
  PROPOSED_THEMES,
  ACCENT_ROLES,
} from './prototypeTokens';
import { LabCard, PrototypeFrame, TokenSwatches, PageSnippet } from './PrototypePrimitives';
import { NavbarCurrent } from './NavbarPrototypes';

export default function ThemePrototypesPanel() {
  const [currentId, setCurrentId] = useState('vercel');
  const [proposedId, setProposedId] = useState('aiimin-dark');
  const current = CURRENT_THEMES[currentId];
  const proposed = PROPOSED_THEMES[proposedId];

  return (
    <div className="design-lab__panel">
      <LabCard
        title="Current vs proposed themes"
        desc="Side-by-side token sets. Proposed themes unify accent to orange (action) and reserve green for completion only."
        badge="Evaluate"
        badgeVariant="proposed"
      >
        <div className="design-lab__select-row">
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-3)', alignSelf: 'center' }}>Current:</span>
          {Object.values(CURRENT_THEMES).map((t) => (
            <button
              key={t.id}
              type="button"
              className={`design-lab__chip-btn ${currentId === t.id ? 'is-active' : ''}`}
              onClick={() => setCurrentId(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="design-lab__select-row">
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-3)', alignSelf: 'center' }}>Proposed:</span>
          {Object.values(PROPOSED_THEMES).map((t) => (
            <button
              key={t.id}
              type="button"
              className={`design-lab__chip-btn ${proposedId === t.id ? 'is-active' : ''}`}
              onClick={() => setProposedId(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="proto-compare-grid">
          <div>
            <p className="proto-compare-col__label">Current - {current.label}</p>
            <TokenSwatches tokens={current.tokens} />
            <PrototypeFrame tokens={current.tokens} rounded>
              <PageSnippet tokens={current.tokens} titleStyle="serif" />
            </PrototypeFrame>
          </div>
          <div>
            <p className="proto-compare-col__label">Proposed - {proposed.label}</p>
            <p style={{ margin: '0 0 10px', padding: '0 18px', fontSize: 12, color: 'var(--color-text-2)', lineHeight: 1.5 }}>
              {proposed.desc}
            </p>
            <TokenSwatches tokens={proposed.tokens} />
            <PrototypeFrame tokens={proposed.tokens} rounded>
              <PageSnippet tokens={proposed.tokens} titleStyle="sans" showEyebrow={false} />
            </PrototypeFrame>
          </div>
        </div>
      </LabCard>

      <LabCard
        title="Full-width nav + page context (current production)"
        desc="This is what you have today: glass bar, 12 pill links, green accent, Familjen page title, OS Online badge."
        badge="Current"
        badgeVariant="current"
      >
        <NavbarCurrent tokens={current.tokens} />
      </LabCard>

      <LabCard
        title="Retirement plan"
        desc="Four themes collapse to two. Legacy IDs map automatically during migration."
        badge="Migration"
        badgeVariant="current"
      >
        <div style={{ padding: '16px 18px', display: 'grid', gap: 10 }}>
          {[
            ['vercel + midnight', 'aiimin-dark', 'Both dark skins merge into one control-room palette'],
            ['nordic + studio', 'aiimin-light', 'Both light skins merge into cool paper + ink'],
            ['Personalization picker', '2 cards only', 'Remove Studio and Midnight from account settings'],
            ['toggleTheme()', 'light <-> dark', 'No personality themes, only mode swap'],
          ].map(([from, to, note]) => (
            <div
              key={from}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                gap: 12,
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface-2)',
                fontSize: 12,
              }}
            >
              <span style={{ fontWeight: 700, color: 'var(--color-text-2)' }}>{from}</span>
              <span style={{ color: 'var(--color-text-3)' }}>-&gt;</span>
              <div>
                <span style={{ fontWeight: 800, color: 'var(--color-accent)' }}>{to}</span>
                <span style={{ display: 'block', color: 'var(--color-text-3)', marginTop: 2, fontSize: 11 }}>{note}</span>
              </div>
            </div>
          ))}
        </div>
      </LabCard>
    </div>
  );
}

export function AccentSystemPanel() {
  const [mode, setMode] = useState('dark');
  const brand = mode === 'dark' ? ACCENT_ROLES.brand.dark : ACCENT_ROLES.brand.light;
  const success = mode === 'dark' ? ACCENT_ROLES.success.dark : ACCENT_ROLES.success.light;

  return (
    <div className="design-lab__panel">
      <LabCard
        title="Accent role system (proposed)"
        desc="Logo ember dot and UI primary accent finally share the same orange. Green is semantic completion only."
        badge="P0 fix"
        badgeVariant="proposed"
      >
        <div className="design-lab__select-row">
          {['dark', 'light'].map((m) => (
            <button
              key={m}
              type="button"
              className={`design-lab__chip-btn ${mode === m ? 'is-active' : ''}`}
              onClick={() => setMode(m)}
            >
              {m === 'dark' ? 'AIIMIN Dark' : 'AIIMIN Light'}
            </button>
          ))}
        </div>

        <div className="proto-accent-grid">
          {Object.values(ACCENT_ROLES).map((role) => {
            const color = mode === 'dark' ? role.dark : role.light;
            return (
              <div key={role.label} className="proto-accent-role">
                <div className="proto-accent-role__chip" style={{ background: color }} />
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-text-1)', marginBottom: 4 }}>{role.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-3)', marginBottom: 6 }}>{color}</div>
                <div style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--color-text-2)' }}>{role.usage}</div>
              </div>
            );
          })}
        </div>

        <div
          className="proto-accent-demo"
          style={{ '--demo-brand': brand, '--demo-success': success }}
        >
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-3)', width: '100%' }}>Live component samples</span>
          <button type="button" className="proto-btn proto-btn--brand">Save daily log</button>
          <button type="button" className="proto-btn proto-btn--success">8/8 complete</button>
          <span className="proto-nav__link proto-nav__link--underline-active" style={{ color: brand, boxShadow: `inset 0 -2px 0 ${brand}` }}>
            Today
          </span>
          <span className="proto-pill" style={{ background: `color-mix(in srgb, ${success} 14%, transparent)`, color: success, border: `1px solid color-mix(in srgb, ${success} 30%, transparent)` }}>
            Gym streak 12d
          </span>
        </div>

        <div className="proto-compare-grid" style={{ paddingTop: 0 }}>
          <div>
            <p className="proto-compare-col__label" style={{ paddingLeft: 18 }}>Before (current tokens)</p>
            <div style={{ padding: '0 18px 16px', fontSize: 12, color: 'var(--color-text-2)', lineHeight: 1.6 }}>
              <code>--color-accent: #10B981</code> used for nav, buttons, eyebrows, focus, AND completion.
              <br />
              Logo dot <code>#FF6B35</code> is the only honest brand orange.
            </div>
          </div>
          <div>
            <p className="proto-compare-col__label" style={{ paddingLeft: 18 }}>After (proposed)</p>
            <div style={{ padding: '0 18px 16px', fontSize: 12, color: 'var(--color-text-2)', lineHeight: 1.6 }}>
              <code>--color-accent: {brand}</code> for action.
              <br />
              <code>--color-success: {success}</code> for metrics done.
              <br />
              <code>--color-logo-bg: #23503B</code> for forest hero cards.
            </div>
          </div>
        </div>
      </LabCard>
    </div>
  );
}
