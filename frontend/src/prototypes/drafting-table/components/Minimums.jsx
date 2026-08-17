import React from 'react';
import { F } from './ui';

// A checkbox whose tick draws in — the small satisfying beat when you complete one.
function Check({ done }) {
  return (
    <span
      style={{
        width: 20,
        height: 20,
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${done ? 'var(--color-accent)' : 'var(--rule)'}`,
        background: done ? 'var(--color-accent)' : 'transparent',
        transition: 'background 160ms cubic-bezier(.22,1,.36,1), border-color 160ms',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M2.5 6.2 L5 8.6 L9.5 3.4"
          stroke="var(--color-bg)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 14,
            strokeDashoffset: done ? 0 : 14,
            transition: 'stroke-dashoffset 260ms cubic-bezier(.22,1,.36,1) 40ms',
          }}
        />
      </svg>
    </span>
  );
}

export default function Minimums({ mins, done, total }) {
  const pct = total ? (done / total) * 100 : 0;
  const allDone = done === total && total > 0;

  return (
    <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--rule)', paddingTop: 'var(--space-3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', ...F.sectionLabel }}>
        <span>DAILY MINIMUMS</span>
        <span style={{ ...F.mono(11, 500), color: allDone ? 'var(--color-accent)' : 'var(--muted)' }}>
          {String(done).padStart(2, '0')}<span style={{ color: 'var(--muted)' }}>/{String(total).padStart(2, '0')}</span>
        </span>
      </div>

      {/* progress track — fills as you clear the day */}
      <div style={{ height: 2, background: 'var(--hair)', marginTop: 'var(--space-3)', overflow: 'hidden' }}>
        <i
          style={{
            display: 'block',
            height: '100%',
            width: `${pct}%`,
            background: 'var(--color-accent)',
            transition: 'width 360ms cubic-bezier(.22,1,.36,1)',
          }}
        />
      </div>

      <div style={{ marginTop: 'var(--space-2)' }}>
        {mins.map((m, i) => (
          <div
            key={i}
            className="tap"
            onClick={m.toggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: '11px var(--space-2) 11px 0',
              borderBottom: i < mins.length - 1 ? '1px solid var(--hair)' : 'none',
              cursor: 'pointer',
            }}
          >
            <Check done={m.done} />
            <span
              style={{
                ...F.body(13.5),
                flex: 1,
                color: m.done ? 'var(--muted)' : 'var(--color-text)',
                textDecoration: m.done ? 'line-through' : 'none',
                textDecorationColor: 'var(--rule)',
                transition: 'color 160ms',
              }}
            >
              {m.label}
            </span>
          </div>
        ))}
      </div>

      {allDone && (
        <div style={{ ...F.mono(10), color: 'var(--color-accent)', letterSpacing: '.14em', marginTop: 'var(--space-3)' }}>
          ✓ DAY CLEARED
        </div>
      )}
    </div>
  );
}
