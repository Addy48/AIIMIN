import React from 'react';
import { SPARK_BARS } from '../data';

/**
 * 14-bar life-score sparkline. Heights are % of a 44px track; the coloring
 * walks hair → rule → muted → accent so the last (recent) bars read hottest.
 */
export default function Sparkline({ bars = SPARK_BARS }) {
  const color = (i, n) => {
    if (i >= n - 3) return 'var(--color-accent)';
    if (i >= n - 5) return 'var(--muted)';
    if (i >= n - 9) return 'var(--rule)';
    return 'var(--hair)';
  };
  return (
    <>
      <div style={{ display: 'flex', height: 44, alignItems: 'flex-end', gap: 3, marginTop: 'var(--space-4)' }}>
        {bars.map((h, i) => (
          <i
            key={i}
            style={{ flex: 1, height: `${h}%`, background: color(i, bars.length), display: 'block' }}
          />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          font: "400 9.5px 'JetBrains Mono', monospace",
          color: 'var(--muted)',
          marginTop: 5,
        }}
      >
        <span>20 JUL</span>
        <span>02 AUG</span>
      </div>
    </>
  );
}
