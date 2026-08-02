import React from 'react';
import { Blueprint } from '../components/Blueprint';
import Sparkline from '../components/Sparkline';
import { ScreenHead, SectionRule, F } from '../components/ui';
import useCountUp from '../useCountUp';

const AREAS = [
  { label: 'CRAFT', val: '88' },
  { label: 'BODY', val: '82' },
  { label: 'ORDER', val: '77' },
  { label: 'MIND', val: '74' },
  { label: 'MONEY', val: '69', money: true },
  { label: 'PEOPLE', val: '61' },
];

const METRICS = [
  { label: 'SCREEN TIME', val: '5h12m', sub: '+48m vs mean' },
  { label: 'STEPS', val: '6,842', sub: '68% of 10k' },
  { label: 'SLEEP', val: '6h40m', sub: '−50m debt' },
  { label: 'FOCUS', val: '2h15m', sub: '3 sessions' },
];

export default function DaySheet({ vm }) {
  const shownScore = useCountUp(vm.score, vm.reduceMotion);
  return (
    <div className="scr" style={{ padding: '6px var(--space-6) 28px' }}>
      <ScreenHead title="AIIMIN · DAY SHEET" meta="02.08.26 TUE" />

      {/* Life score block */}
      <Blueprint
        legend="LIFE SCORE"
        style={{ marginTop: 'var(--space-6)', padding: 'var(--space-6) var(--space-4) var(--space-4)' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-4)' }}>
          <span
            style={{ font: "700 72px/.82 'JetBrains Mono', monospace", letterSpacing: '-.04em' }}
          >
            {shownScore}
          </span>
          <div style={{ paddingBottom: 'var(--space-2)' }}>
            <div style={{ ...F.mono(12.5, 500), color: 'var(--color-accent)' }}>{vm.delta} · 7d</div>
            <div style={{ ...F.body(11), color: 'var(--muted)', marginTop: 2 }}>Band: {vm.band}</div>
          </div>
        </div>
        <Sparkline />
      </Blueprint>

      {/* Six-area grid (3×2) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          border: '1px solid var(--hair)',
          borderRight: 'none',
          marginTop: 'var(--space-6)',
        }}
      >
        {AREAS.map((a, i) => (
          <div
            key={a.label}
            className={a.money ? 'tap' : undefined}
            onClick={a.money ? () => vm.go('money') : undefined}
            style={{
              borderRight: '1px solid var(--hair)',
              borderTop: i >= 3 ? '1px solid var(--hair)' : undefined,
              padding: 'var(--space-3)',
              background: a.money ? 'var(--tint)' : undefined,
              cursor: a.money ? 'pointer' : undefined,
            }}
          >
            <div style={{ ...F.cellLabel, color: a.money ? 'var(--color-accent)' : 'var(--muted)' }}>{a.label}</div>
            <div
              style={{
                font: "700 22px/1 'JetBrains Mono', monospace",
                marginTop: 4,
                color: a.money ? 'var(--color-accent)' : undefined,
              }}
            >
              {a.val}
            </div>
          </div>
        ))}
      </div>

      {/* Action Required · 01 — the one accent object */}
      {vm.showAction && (
        <Blueprint accent tint style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)' }}>
          <div style={{ font: "600 10px 'Barlow Condensed', sans-serif", letterSpacing: '.2em', color: 'var(--color-accent)' }}>
            ACTION REQUIRED · 01
          </div>
          <div style={{ ...F.body(15, 400, 1.45), marginTop: 'var(--space-2)', textWrap: 'pretty' }}>
            Log yesterday's <span style={F.mono(14, 500)}>₹1,240</span> Swiggy spend. Food budget at 84% with 9 days remaining.
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            <button
              className="tap"
              onClick={() => vm.go('cap')}
              style={{
                font: "600 12px 'Barlow Condensed', sans-serif",
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--color-bg)',
                background: 'var(--color-accent)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '9px 16px',
                cursor: 'pointer',
              }}
            >
              LOG IT
            </button>
            <button
              className="tap"
              onClick={vm.deferAction}
              style={{
                font: "600 12px 'Barlow Condensed', sans-serif",
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                background: 'transparent',
                border: '1px solid var(--rule)',
                borderRadius: 'var(--radius-md)',
                padding: '9px 16px',
                cursor: 'pointer',
              }}
            >
              DEFER
            </button>
          </div>
        </Blueprint>
      )}

      {/* Detected pattern */}
      <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--rule)', paddingTop: 'var(--space-3)' }}>
        <div style={F.sectionLabel}>DETECTED PATTERN</div>
        <div style={{ ...F.body(14, 400, 1.5), marginTop: 'var(--space-2)', textWrap: 'pretty' }}>
          Screen time measures <b style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>+41%</b> on days without the 07:00 walk. Confidence high · n=18.
        </div>
        <button
          className="tap"
          onClick={() => vm.go('lab')}
          style={{
            font: "600 11px 'Barlow Condensed', sans-serif",
            letterSpacing: '.14em',
            color: 'var(--color-accent)',
            background: 'none',
            border: 'none',
            padding: 'var(--space-2) 0 0',
            cursor: 'pointer',
          }}
        >
          OPEN IN LAB →
        </button>
      </div>

      {/* Metric grid 2×2 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          border: '1px solid var(--hair)',
          borderRight: 'none',
          marginTop: 'var(--space-6)',
        }}
      >
        {METRICS.map((m, i) => (
          <div
            key={m.label}
            style={{
              borderRight: '1px solid var(--hair)',
              borderTop: i >= 2 ? '1px solid var(--hair)' : undefined,
              padding: 'var(--space-3)',
            }}
          >
            <div style={F.cellLabel}>{m.label}</div>
            <div style={{ font: "700 20px/1 'JetBrains Mono', monospace", marginTop: 4 }}>{m.val}</div>
            <div style={{ ...F.mono(10), color: 'var(--muted)' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Daily minimums */}
      <SectionRule label="DAILY MINIMUMS" value={vm.minsLabel} />
      <div style={{ marginTop: 'var(--space-3)' }}>
        {vm.mins.map((m, i) => (
          <div
            key={i}
            className="tap"
            onClick={m.toggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: '9px 0',
              borderBottom: '1px solid var(--hair)',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                flex: 'none',
                display: 'block',
                border: `1px solid ${m.edge}`,
                background: m.fill,
              }}
            />
            <span style={{ ...F.body(13.5), color: m.color, textDecoration: m.line }}>{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
