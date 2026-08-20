import React from 'react';
import { F } from '../components/ui';

const Label = ({ children }) => (
  <div style={{ marginTop: 'var(--space-6)', ...F.sectionLabel }}>{children}</div>
);

export default function EdgeStates({ vm }) {
  return (
    <div className="scr" style={{ padding: '6px var(--space-6) 28px' }}>
      <div style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: 'var(--space-3) 0', ...F.chrome }}>
        EDGE STATES
      </div>

      {/* 01 — Error: OS-ID taken */}
      <Label>01 · OS-ID TAKEN — ERROR</Label>
      <div style={{ border: '1px solid var(--danger)', padding: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', border: '1px solid var(--danger)', borderRight: 'none' }}>
          {['A', 'D', 'I', 'T', 'Y', 'A', '0', '1'].map((ch, i) => (
            <span
              key={i}
              style={{ borderRight: '1px solid var(--danger)', aspectRatio: '1 / 1.2', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "700 18px 'JetBrains Mono', monospace" }}
            >
              {ch}
            </span>
          ))}
        </div>
        <div style={{ ...F.mono(11.5, 500), color: 'var(--danger)', marginTop: 'var(--space-3)' }}>✕ ADITYA01 IS TAKEN — CLAIMED 2024</div>
        <div style={{ ...F.body(12, 400, 1.5), color: 'var(--muted)', marginTop: 5 }}>Three near matches are free. Digits count toward the eight.</div>
      </div>

      {/* 02 — Empty: money first run */}
      <Label>02 · MONEY EMPTY — FIRST RUN</Label>
      <div style={{ border: '1px dashed var(--rule)', padding: 'var(--space-6) var(--space-4)', marginTop: 'var(--space-3)', textAlign: 'center' }}>
        <div style={{ font: "700 34px/1 'JetBrains Mono', monospace", color: 'var(--rule)' }}>₹—</div>
        <div style={{ ...F.body(13, 500), marginTop: 'var(--space-3)' }}>No transactions yet</div>
        <div style={{ ...F.body(12, 400, 1.5), color: 'var(--muted)', marginTop: 5, textWrap: 'pretty' }}>
          Connect a bank or log one spend. The budget sheet draws itself from the first entry.
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)', justifyContent: 'center' }}>
          <button className="tap" style={{ font: "600 11.5px 'Barlow Condensed', sans-serif", letterSpacing: '.12em', color: 'var(--color-bg)', background: 'var(--color-accent)', border: 'none', borderRadius: 'var(--radius-md)', padding: '9px 14px', cursor: 'pointer' }}>
            CONNECT BANK
          </button>
          <button className="tap" onClick={() => vm.go('cap')} style={{ font: "600 11.5px 'Barlow Condensed', sans-serif", letterSpacing: '.12em', color: 'var(--color-accent)', background: 'transparent', border: '1px solid var(--rule)', borderRadius: 'var(--radius-md)', padding: '9px 14px', cursor: 'pointer' }}>
            LOG ONE
          </button>
        </div>
      </div>

      {/* 03 — Loading skeleton */}
      <Label>03 · MONEY LOADING — SKELETON</Label>
      <div style={{ border: '1px solid var(--hair)', padding: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
        <div className="sk" style={{ width: '44%', height: 11, background: 'var(--hair)' }} />
        <div className="sk" style={{ width: '66%', height: 34, background: 'var(--hair)', marginTop: 'var(--space-3)' }} />
        <div className="sk" style={{ width: '100%', height: 8, background: 'var(--hair)', marginTop: 'var(--space-4)' }} />
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          <div className="sk" style={{ flex: 1, height: 46, background: 'var(--hair)' }} />
          <div className="sk" style={{ flex: 1, height: 46, background: 'var(--hair)' }} />
        </div>
        <div style={{ ...F.mono(10), color: 'var(--muted)', marginTop: 'var(--space-3)' }}>FETCHING 14 DAYS FROM HDFC…</div>
      </div>

      {/* 04 — Offline held locally */}
      <Label>04 · OFFLINE — HELD LOCALLY</Label>
      <div style={{ border: '1px solid var(--rule)', padding: 'var(--space-4)', marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
        <span style={{ width: 9, height: 9, background: 'var(--color-accent)', display: 'block', marginTop: 5, flex: 'none' }} />
        <div>
          <div style={F.body(13, 500)}>Settled locally · 3 in hold</div>
          <div style={{ ...F.body(11.5, 400, 1.5), color: 'var(--muted)', marginTop: 3, textWrap: 'pretty' }}>
            Nothing is lost. These sync to aiimin.in the moment the connection returns.
          </div>
        </div>
      </div>

      {/* 05 — Destructive typed veil */}
      <Label>05 · DESTRUCTIVE — TYPED VEIL</Label>
      <div style={{ border: '1px solid var(--danger)', padding: 'var(--space-4)', marginTop: 'var(--space-3)' }}>
        <div style={{ ...F.body(13.5, 500), color: 'var(--danger)' }}>Delete account</div>
        <div style={{ ...F.body(12, 400, 1.5), color: 'var(--muted)', marginTop: 5, textWrap: 'pretty' }}>
          184 days of records, 1,204 captures and your OS-ID are removed. ADIT2K04 is never reissued.
        </div>
        <div style={{ border: '1px solid var(--rule)', padding: '10px var(--space-3)', marginTop: 'var(--space-3)', ...F.mono(13, 500), color: 'var(--muted)' }}>
          type DELETE to confirm
        </div>
        <button
          className="tap"
          style={{
            width: '100%',
            marginTop: 'var(--space-3)',
            font: "600 12px 'Barlow Condensed', sans-serif",
            letterSpacing: '.14em',
            color: 'var(--muted)',
            background: 'transparent',
            border: '1px solid var(--rule)',
            borderRadius: 'var(--radius-md)',
            padding: 11,
            cursor: 'not-allowed',
            opacity: 0.5,
          }}
        >
          DELETE PERMANENTLY
        </button>
      </div>
    </div>
  );
}
