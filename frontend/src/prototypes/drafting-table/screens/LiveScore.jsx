import React from 'react';
import { Blueprint } from '../components/Blueprint';
import { ScreenHead, PrimaryButton, F } from '../components/ui';

export default function LiveScore({ vm }) {
  return (
    <div className="scr" style={{ padding: '6px var(--space-6) 28px' }}>
      <ScreenHead title="LIVE SCORE" meta="PROVISIONAL" metaColor="var(--color-accent)" />

      {/* Provisional score figure */}
      <Blueprint style={{ marginTop: 'var(--space-6)', padding: 'var(--space-6) var(--space-4) var(--space-4)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 'var(--space-3)' }}>
          <span className="fig" key={vm.score} style={{ font: "700 72px/.86 'JetBrains Mono', monospace", letterSpacing: '-.04em' }}>
            {vm.score}
          </span>
          <span style={{ ...F.mono(15, 500), color: 'var(--color-accent)' }}>{vm.delta}</span>
        </div>
        <div style={{ ...F.body(11), color: 'var(--muted)', marginTop: 'var(--space-2)' }}>
          Settles at 23:59 · marks still open
        </div>
      </Blueprint>

      {/* Mechanism 01 · The Rail */}
      <div
        style={{
          marginTop: 'var(--space-6)',
          borderTop: '1px solid var(--rule)',
          paddingTop: 'var(--space-3)',
          display: 'flex',
          justifyContent: 'space-between',
          ...F.sectionLabelInline,
          font: "600 10px 'Barlow Condensed', sans-serif",
          letterSpacing: '.2em',
          color: 'var(--muted)',
        }}
      >
        <span>MECHANISM 01 · THE RAIL</span>
        <span style={{ color: 'var(--color-accent)', fontFamily: "'JetBrains Mono', monospace" }}>TAP TO SET</span>
      </div>
      <div style={{ ...F.body(11.5, 400, 1.5), color: 'var(--muted)', marginTop: 5, textWrap: 'pretty' }}>
        Tap anywhere on a rail to mark that area. Snaps to fives, so a mark is always a decision, never a wobble.
      </div>
      <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {vm.rails.map((r, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', ...F.body(12), marginBottom: 6 }}>
              <span>{r.label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--color-accent)' }}>{r.value}</span>
            </div>
            <div
              className="tap"
              onClick={r.bump}
              style={{ position: 'relative', height: 24, border: '1px solid var(--hair)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <i style={{ position: 'absolute', left: 0, top: 0, bottom: 0, background: 'var(--tint)', display: 'block', width: r.pct }} />
              <i style={{ position: 'absolute', top: -4, bottom: -4, width: 9, marginLeft: -4, background: 'var(--color-accent)', display: 'block', left: r.pct }} />
            </div>
          </div>
        ))}
      </div>

      {/* Mechanism 02 · The Ladder */}
      <div
        style={{
          marginTop: 'var(--space-8)',
          borderTop: '1px solid var(--rule)',
          paddingTop: 'var(--space-3)',
          display: 'flex',
          justifyContent: 'space-between',
          font: "600 10px 'Barlow Condensed', sans-serif",
          letterSpacing: '.2em',
          color: 'var(--muted)',
        }}
      >
        <span>MECHANISM 02 · THE LADDER</span>
        <span style={{ color: 'var(--color-accent)', fontFamily: "'JetBrains Mono', monospace" }}>ONE TAP</span>
      </div>
      <div style={{ ...F.body(11.5, 400, 1.5), color: 'var(--muted)', marginTop: 5, textWrap: 'pretty' }}>
        Five rungs, one tap, done in a second at the door. For the nights you will not drag anything.
      </div>
      <div style={{ marginTop: 'var(--space-4)' }}>
        <div style={{ ...F.body(12), marginBottom: 'var(--space-2)' }}>How did today go?</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 82 }}>
          {vm.rungs.map((g) => (
            <div
              key={g.n}
              className="tap"
              onClick={g.set}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}
            >
              <span style={{ width: '100%', display: 'block', height: g.h, background: g.bg }} />
              <span style={{ ...F.mono(10, 500), color: g.fg }}>{g.n}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...F.mono(9.5), color: 'var(--muted)', marginTop: 6 }}>
          <span>ROUGH</span>
          <span>STRONG</span>
        </div>
      </div>

      {/* What moved the number */}
      <div
        style={{
          marginTop: 'var(--space-8)',
          borderTop: '1px solid var(--rule)',
          paddingTop: 'var(--space-3)',
          font: "600 10px 'Barlow Condensed', sans-serif",
          letterSpacing: '.2em',
          color: 'var(--muted)',
        }}
      >
        WHAT MOVED THE NUMBER
      </div>
      <div style={{ marginTop: 'var(--space-2)' }}>
        {[
          ['Walk kept · 07:04', '+2.1', 'var(--color-accent)'],
          ['Focus 2h15m', '+1.4', 'var(--color-accent)'],
          ['Screen time 5h12m', '−1.8', 'var(--muted)'],
          ['Minimums open', vm.minsPenalty, 'var(--muted)'],
        ].map(([label, val, color], i, arr) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: i < arr.length - 1 ? '1px solid var(--hair)' : 'none',
            }}
          >
            <span style={F.body(13)}>{label}</span>
            <span style={{ ...F.mono(12.5, 500), color }}>{val}</span>
          </div>
        ))}
      </div>

      <PrimaryButton onClick={vm.settleDay} style={{ width: '100%', marginTop: 'var(--space-6)' }}>
        SETTLE THE DAY
      </PrimaryButton>
    </div>
  );
}
