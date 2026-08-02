import React from 'react';
import { Corners } from '../components/Blueprint';
import { ScreenHead, SectionRule, F } from '../components/ui';

export default function Lab({ vm }) {
  return (
    <div className="scr" style={{ padding: '6px var(--space-6) 28px' }}>
      <ScreenHead title="THE LAB · CORRELATIONS" meta="n=184d" />
      <div style={{ ...F.body(12, 400, 1.5), color: 'var(--muted)', marginTop: 'var(--space-3)', textWrap: 'pretty' }}>
        Spearman rank correlation across your logged signals, corrected for multiple comparisons (Benjamini–Hochberg, FDR 0.10). Only survivors are shown.
      </div>

      {/* Selected-pair card */}
      <div style={{ position: 'relative', border: '1px solid var(--color-accent)', marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--tint)' }}>
        <Corners />
        <div style={{ font: "600 10px 'Barlow Condensed', sans-serif", letterSpacing: '.2em', color: 'var(--color-accent)' }}>SELECTED PAIR</div>
        <div style={{ ...F.body(16, 400, 1.4), marginTop: 'var(--space-2)' }}>{vm.pairLabel}</div>
        <div style={{ display: 'flex', gap: 'var(--space-6)', marginTop: 'var(--space-3)' }}>
          <div>
            <div style={{ font: "400 9.5px 'Barlow Condensed', sans-serif", letterSpacing: '.16em', color: 'var(--muted)' }}>ρ</div>
            <div className="fig" key={vm.pairRho} style={{ font: "700 22px 'JetBrains Mono', monospace", color: 'var(--color-accent)' }}>{vm.pairRho}</div>
          </div>
          <div>
            <div style={{ font: "400 9.5px 'Barlow Condensed', sans-serif", letterSpacing: '.16em', color: 'var(--muted)' }}>q-VALUE</div>
            <div className="fig" key={vm.pairQ} style={{ font: "700 22px 'JetBrains Mono', monospace" }}>{vm.pairQ}</div>
          </div>
          <div>
            <div style={{ font: "400 9.5px 'Barlow Condensed', sans-serif", letterSpacing: '.16em', color: 'var(--muted)' }}>n</div>
            <div style={{ font: "700 22px 'JetBrains Mono', monospace" }}>{vm.pairN}</div>
          </div>
        </div>
      </div>

      {/* Scatter */}
      <SectionRule label="SCATTER" />
      <div style={{ position: 'relative', border: '1px solid var(--hair)', height: 150, marginTop: 'var(--space-3)' }}>
        <svg viewBox="0 0 300 150" width="100%" height="150" style={{ display: 'block' }}>
          <line x1="0" y1="112" x2="300" y2="38" stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4 3" />
          {[
            [28, 126], [52, 118], [70, 104], [96, 112], [118, 88], [134, 96],
            [156, 72], [172, 80], [194, 58], [212, 66], [236, 44], [258, 52],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" fill="var(--muted)" />
          ))}
          <circle cx="276" cy="34" r="3.5" fill="var(--color-accent)" />
        </svg>
      </div>

      {/* Survivors table */}
      <SectionRule label="ALL SURVIVORS · q < 0.10" />
      <div style={{ marginTop: 'var(--space-2)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 48px 48px',
            gap: 'var(--space-2)',
            padding: '6px 0',
            borderBottom: '1px solid var(--rule)',
            font: "600 9.5px 'Barlow Condensed', sans-serif",
            letterSpacing: '.14em',
            color: 'var(--muted)',
          }}
        >
          <span>PAIR</span>
          <span style={{ textAlign: 'right' }}>ρ</span>
          <span style={{ textAlign: 'right' }}>q</span>
        </div>
        {vm.pairs.map((p, i) => (
          <div
            key={i}
            className="tap"
            onClick={p.pick}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 48px 48px',
              gap: 'var(--space-2)',
              padding: '9px 0',
              borderBottom: '1px solid var(--hair)',
              cursor: 'pointer',
              background: p.bg,
            }}
          >
            <span style={F.body(12.5)}>{p.label}</span>
            <span style={{ ...F.mono(12, 500), textAlign: 'right', color: 'var(--color-accent)' }}>{p.rho}</span>
            <span style={{ ...F.mono(12), textAlign: 'right', color: 'var(--muted)' }}>{p.q}</span>
          </div>
        ))}
      </div>

      {/* Rejected note */}
      <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', border: '1px dashed var(--rule)' }}>
        <div style={{ font: "600 9.5px 'Barlow Condensed', sans-serif", letterSpacing: '.16em', color: 'var(--muted)' }}>
          REJECTED BY CORRECTION · 14 PAIRS
        </div>
        <div style={{ ...F.body(11.5, 400, 1.5), color: 'var(--muted)', marginTop: 4, textWrap: 'pretty' }}>
          Fourteen pairs looked significant before correction and did not survive. AIIMIN does not show you those.
        </div>
      </div>
    </div>
  );
}
