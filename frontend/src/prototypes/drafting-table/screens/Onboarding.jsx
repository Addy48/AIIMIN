import React from 'react';
import BrandMark from '../components/BrandMark';
import { PrimaryButton, F } from '../components/ui';

export default function Onboarding({ vm }) {
  return (
    <div className="scr" style={{ padding: '6px var(--space-6) 28px', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', paddingTop: 'var(--space-2)' }}>
        <BrandMark size={22} />
        <span style={{ font: "600 13px 'Barlow Condensed', sans-serif", letterSpacing: '.28em', textTransform: 'uppercase' }}>AIIMIN</span>
      </div>

      {/* 6-segment progress, step 3 filled */}
      <div style={{ display: 'flex', gap: 3, marginTop: 'var(--space-6)' }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <i key={i} style={{ flex: 1, height: 3, background: i < 3 ? 'var(--color-accent)' : 'var(--hair)', display: 'block' }} />
        ))}
      </div>
      <div style={{ ...F.mono(10), letterSpacing: '.16em', color: 'var(--muted)', marginTop: 'var(--space-3)' }}>STEP 03 / 06</div>
      <div style={{ font: "600 38px/1 'Barlow Condensed', sans-serif", marginTop: 'var(--space-3)', textTransform: 'uppercase' }}>Claim your OS-ID</div>
      <div style={{ ...F.body(14, 400, 1.55), color: 'var(--muted)', marginTop: 'var(--space-3)', textWrap: 'pretty' }}>
        Eight characters, yours permanently — on the app, on aiimin.in, on anything AIIMIN builds next.
      </div>

      {/* 8-cell OS-ID grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', border: '1px solid var(--rule)', borderRight: 'none', marginTop: 'var(--space-8)' }}>
        {vm.idCells.map((k, i) => (
          <span
            key={i}
            style={{
              borderRight: '1px solid var(--rule)',
              aspectRatio: '1 / 1.2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              font: "700 20px 'JetBrains Mono', monospace",
              color: k.fg,
              background: k.bg,
            }}
          >
            {k.ch}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', ...F.mono(10), color: 'var(--muted)', marginTop: 'var(--space-2)' }}>
        <span style={{ color: 'var(--color-accent)' }}>✓ AVAILABLE</span>
        <span>8/8 CHARS · 3/4 DIGITS</span>
      </div>

      {/* Alternates */}
      <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--rule)', paddingTop: 'var(--space-3)', ...F.sectionLabel }}>ALTERNATES</div>
      <div style={{ display: 'flex', gap: 5, marginTop: 'var(--space-3)' }}>
        {vm.alts.map((a, i) => (
          <span
            key={i}
            className="tap"
            onClick={a.pick}
            style={{ ...F.mono(12, 500), padding: '7px 10px', cursor: 'pointer', border: `1px solid ${a.edge}`, color: a.fg }}
          >
            {a.id}
          </span>
        ))}
      </div>

      <div style={{ flex: 1 }} />
      <PrimaryButton onClick={vm.claimId} style={{ width: '100%', marginTop: 'var(--space-8)', fontSize: 14, padding: 14 }}>
        CLAIM {vm.chosenId}
      </PrimaryButton>
      <div style={{ textAlign: 'center', ...F.mono(10), color: 'var(--muted)', marginTop: 'var(--space-2)' }}>ONE REVISION PERMITTED, LATER</div>
    </div>
  );
}
