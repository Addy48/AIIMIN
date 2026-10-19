import React from 'react';
import { Corners } from '../components/Blueprint';
import { SectionRule, F } from '../components/ui';

const PRESETS = [
  ['EXPENSE', 'preset_food'],
  ['JOURNAL', 'preset_journal'],
  ['VOICE', 'preset_voice'],
  ['SCAN', 'preset_scan'],
  ['HABIT', 'preset_habit'],
  ['NOTE', 'preset_note'],
];

export default function Capture({ vm }) {
  return (
    <div className="scr" style={{ padding: '6px var(--space-6) 28px' }}>
      <div style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: 'var(--space-3) 0', ...F.chrome }}>
        CAPTURE
      </div>

      {/* Composer in accent registration frame on tint */}
      <div style={{ position: 'relative', border: '1px solid var(--color-accent)', marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--tint)' }}>
        <Corners />
        <textarea
          rows={3}
          placeholder="paid 1240 swiggy dinner with rohan…"
          style={{ font: "400 15px/1.5 Barlow, sans-serif" }}
          value={vm.capText}
          onChange={vm.onCapText}
        />
        {vm.hasOffer ? (
          <div>
            <div style={{ height: 1, background: 'var(--rule)', margin: 'var(--space-3) 0' }} />
            <div style={{ font: "600 9.5px 'Barlow Condensed', sans-serif", letterSpacing: '.18em', color: 'var(--color-accent)' }}>
              THE OFFER · ADJUST BEFORE COMMIT
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 'var(--space-2)' }}>
              {vm.chips.map((c, i) => (
                <span
                  key={i}
                  className="tap"
                  onClick={c.toggle}
                  style={{
                    font: "500 11.5px Barlow, sans-serif",
                    padding: '5px 9px',
                    cursor: 'pointer',
                    border: `1px solid ${c.edge}`,
                    background: c.bg,
                    color: c.fg,
                  }}
                >
                  {c.label}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
              <button
                className="tap"
                onClick={vm.settleCapture}
                style={{
                  flex: 1,
                  font: "600 12px 'Barlow Condensed', sans-serif",
                  letterSpacing: '.12em',
                  color: 'var(--color-bg)',
                  background: 'var(--color-accent)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: 11,
                  cursor: 'pointer',
                }}
              >
                SETTLE
              </button>
              <button
                className="tap"
                onClick={vm.driftCapture}
                style={{
                  font: "600 12px 'Barlow Condensed', sans-serif",
                  letterSpacing: '.12em',
                  color: 'var(--muted)',
                  background: 'transparent',
                  border: '1px solid var(--rule)',
                  borderRadius: 'var(--radius-md)',
                  padding: '11px 15px',
                  cursor: 'pointer',
                }}
              >
                DRIFT
              </button>
            </div>
          </div>
        ) : (
          <div style={{ ...F.body(11.5), color: 'var(--muted)', marginTop: 'var(--space-3)' }}>
            Write anything. AIIMIN reads it and offers a structure — you correct it, then commit.
          </div>
        )}
      </div>

      {/* Mode presets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-2)', marginTop: 'var(--space-6)' }}>
        {PRESETS.map(([label, key]) => (
          <button
            key={label}
            className="tap"
            onClick={vm[key]}
            style={{
              border: '1px solid var(--hair)',
              background: 'transparent',
              color: 'var(--color-text)',
              padding: 'var(--space-4) var(--space-2)',
              font: "600 11px 'Barlow Condensed', sans-serif",
              letterSpacing: '.12em',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Hold tray */}
      <SectionRule label="HOLD TRAY" value={vm.holdLabel} />
      <div style={{ marginTop: 'var(--space-2)' }}>
        {vm.holds.map((h, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--hair)' }}>
            <span style={{ ...F.body(13), color: 'var(--muted)' }}>{h.label}</span>
            <span
              style={{
                font: "500 9.5px 'Barlow Condensed', sans-serif",
                letterSpacing: '.14em',
                color: 'var(--color-accent)',
                border: '1px solid var(--color-accent)',
                padding: '2px 6px',
              }}
            >
              HOLD
            </span>
          </div>
        ))}
      </div>

      {/* Today's captures */}
      <SectionRule label={`TODAY'S CAPTURES · ${vm.capCount}`} />
      <div style={{ marginTop: 'var(--space-2)' }}>
        {vm.captures.map((c, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--hair)' }}>
            <span style={F.body(13)}>{c.label}</span>
            <span style={{ ...F.mono(10), color: 'var(--muted)' }}>{c.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
