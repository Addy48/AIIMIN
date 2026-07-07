import React from 'react';
import { LabCard } from './PrototypePrimitives';
import BrandLockup from '../../../../components/brand/BrandLockup';

const PHASES = [
  { phase: '1', title: 'Token consolidation', status: 'Shipped', tasks: ['aiimin-dark + aiimin-light token blocks', 'Legacy vercel/midnight/nordic/studio map via normalizeThemeId', 'ThemeContext updated'] },
  { phase: '2', title: 'Accent realignment', status: 'Shipped', tasks: ['--color-accent is brand orange', 'Green reserved for --color-success / completion', 'Focus rings use orange'] },
  { phase: '3', title: 'Navbar refactor', status: 'Shipped', tasks: ['Masthead layout at 68px', '4 primary + More overflow', 'Underline active, no OS Online', 'Sun/Moon icons'] },
  { phase: '4', title: 'Typography', status: 'Shipped', tasks: ['Page H1 uses Figtree', 'Bodoni wordmark only', 'Removed Overview eyebrow'] },
  { phase: '5', title: 'Brand lockup', status: 'Shipped', tasks: ['Unified click to /overview', 'Light-mode soft paper chip'] },
];

export default function OverviewPanel() {
  return (
    <div className="design-lab__panel">
      <LabCard
        title="Current lab focus"
        desc="The old visual identity audit is shipped. The active question now is product personalization: how AIIMIN changes shape for students, professionals, founders, families, athletes, and custom users."
        badge="Active"
        badgeVariant="proposed"
      >
        <div style={{ padding: '16px 18px', fontSize: 13, lineHeight: 1.65, color: 'var(--color-text-2)' }}>
          <p style={{ margin: '0 0 12px' }}>
            Use <strong style={{ color: 'var(--color-text-1)' }}>Personalization prototypes</strong> to review the new
            persona-driven model. Use <strong style={{ color: 'var(--color-text-1)' }}>UI library</strong> for component experiments
            and <strong style={{ color: 'var(--color-text-1)' }}>Shipped archive</strong> for completed design decisions.
          </p>
          <p style={{ margin: 0 }}>
            The live Personalization page now supports active/hidden sections, 12 pinned nav destinations, and life-mode presets.
          </p>
        </div>
      </LabCard>

      <LabCard title="Live brand lockup (production)" desc="Reference against prototypes below." badge="Current" badgeVariant="current">
        <div style={{ padding: '18px 22px' }}>
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 14,
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              marginBottom: 12,
            }}
          >
            <BrandLockup staticPreview style={{ marginLeft: 0 }} />
          </div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-3)', lineHeight: 1.55 }}>
            Assets: <code>public/AIIMIN_logo.svg</code>, <code>public/google-oauth-logo.png</code>, favicons.
          </p>
        </div>
      </LabCard>

      <LabCard title="Completed design phases" desc="Moved out of the active lab because these decisions are already live." badge="Shipped" badgeVariant="current">
        <div style={{ padding: '16px 18px', display: 'grid', gap: 14 }}>
          {PHASES.map((p) => (
            <div
              key={p.phase}
              style={{
                borderRadius: 12,
                border: '1px solid var(--color-border)',
                padding: '14px 16px',
                background: 'var(--color-surface-2)',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--color-success)', marginBottom: 4 }}>Phase {p.phase} · {p.status}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-text-1)', marginBottom: 8 }}>{p.title}</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, lineHeight: 1.6, color: 'var(--color-text-2)' }}>
                {p.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </LabCard>
    </div>
  );
}
