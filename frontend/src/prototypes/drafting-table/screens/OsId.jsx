import React from 'react';
import { Corners } from '../components/Blueprint';
import { SectionRule, PrimaryButton, F } from '../components/ui';

const SPEC = [
  ['Length', 'EXACTLY 8'],
  ['Case', 'UPPERCASE'],
  ['Digits', 'MAX 4'],
  ['Revisions', '1 LIFETIME'],
];
const APPEARS = ['Public profile', 'Leaderboards', 'Shared reports', 'Money splits', 'Login'];

export default function OsId({ vm }) {
  return (
    <div className="scr" style={{ padding: '6px var(--space-6) 28px' }}>
      <div style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: 'var(--space-3) 0', ...F.chrome }}>
        IDENTIFIER · OS-ID
      </div>

      {/* Part-number card */}
      <div style={{ position: 'relative', border: '1px solid var(--color-accent)', marginTop: 'var(--space-6)', padding: 'var(--space-6) var(--space-4)' }}>
        <Corners />
        <div style={{ font: "600 10px 'Barlow Condensed', sans-serif", letterSpacing: '.24em', color: 'var(--color-accent)' }}>PART NO.</div>
        <div style={{ font: "700 36px/1 'JetBrains Mono', monospace", letterSpacing: '.04em', marginTop: 'var(--space-3)' }}>{vm.chosenId}</div>
        <div style={{ height: 1, background: 'var(--hair)', margin: 'var(--space-4) 0' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', ...F.mono(10.5), color: 'var(--muted)' }}>
          <span>HOLDER · A. UPADHYAY</span>
          <span>ISSUED · 14.03.25</span>
          <span>MEMBER · #1204</span>
          <span>TIER · {vm.tierLabel}</span>
        </div>
      </div>

      {/* Specification */}
      <SectionRule label="SPECIFICATION" />
      <div style={{ marginTop: 'var(--space-2)' }}>
        {SPEC.map(([k, v], i, arr) => (
          <div
            key={k}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '9px 0',
              borderBottom: i < arr.length - 1 ? '1px solid var(--hair)' : 'none',
              ...F.body(13),
            }}
          >
            <span>{k}</span>
            <span style={{ color: 'var(--color-accent)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Appears on */}
      <SectionRule label="APPEARS ON" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 'var(--space-3)' }}>
        {APPEARS.map((a) => (
          <span key={a} style={{ ...F.body(11.5), border: '1px solid var(--hair)', padding: '5px 9px', borderRadius: 'var(--radius-md)' }}>
            {a}
          </span>
        ))}
      </div>

      <PrimaryButton onClick={vm.copyId} style={{ width: '100%', marginTop: 'var(--space-6)' }}>
        COPY IDENTIFIER
      </PrimaryButton>
    </div>
  );
}
