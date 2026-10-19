import React from 'react';

// Deterministic jitter so the cloud is stable across renders.
const SEED = [0.42, -0.55, 0.18, 0.63, -0.28, 0.35, -0.6, 0.22, 0.5, -0.4, 0.12, -0.18, 0.3];

/**
 * A technical scatter: framed plot with axes, ticks, labels, a dashed trend
 * line whose slope follows the sign of ρ, and the most-recent point in accent.
 * Fits the Drafting Table language — this is a drawn instrument, not a toy chart.
 */
export default function Scatter({ rho = '−.61', xLabel = 'MORNING WALK', yLabel = 'SCREEN TIME' }) {
  const r = parseFloat(String(rho).replace('−', '-')) || 0;
  const negative = r < 0;

  // Plot frame in viewBox units.
  const L = 34, R = 296, T = 12, B = 126;
  const w = R - L, h = B - T;
  const n = SEED.length;

  // Trend endpoints (data space → screen space; SVG y grows downward).
  const y0 = negative ? T + 8 : B - 8;   // left end
  const y1 = negative ? B - 8 : T + 8;   // right end

  const pts = SEED.map((jit, i) => {
    const t = i / (n - 1);
    const x = L + t * w;
    const trendY = y0 + (y1 - y0) * t;
    const y = Math.max(T + 4, Math.min(B - 4, trendY + jit * (h * 0.22)));
    return { x, y, last: i === n - 1 };
  });

  return (
    <div style={{ position: 'relative', border: '1px solid var(--hair)', marginTop: 'var(--space-3)' }}>
      <svg viewBox="0 0 300 150" width="100%" height="150" style={{ display: 'block' }}>
        {/* faint grid */}
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={`h${g}`} x1={L} y1={T + h * g} x2={R} y2={T + h * g} stroke="var(--hair)" strokeWidth="1" opacity="0.5" />
        ))}
        {[0.33, 0.66].map((g) => (
          <line key={`v${g}`} x1={L + w * g} y1={T} x2={L + w * g} y2={B} stroke="var(--hair)" strokeWidth="1" opacity="0.5" />
        ))}

        {/* axes */}
        <line x1={L} y1={T} x2={L} y2={B} stroke="var(--rule)" strokeWidth="1" />
        <line x1={L} y1={B} x2={R} y2={B} stroke="var(--rule)" strokeWidth="1" />
        {/* axis ticks */}
        {[0, 0.5, 1].map((g) => (
          <line key={`xt${g}`} x1={L + w * g} y1={B} x2={L + w * g} y2={B + 3} stroke="var(--rule)" strokeWidth="1" />
        ))}
        {[0, 0.5, 1].map((g) => (
          <line key={`yt${g}`} x1={L - 3} y1={B - h * g} x2={L} y2={B - h * g} stroke="var(--rule)" strokeWidth="1" />
        ))}

        {/* trend line */}
        <line x1={L} y1={y0} x2={R} y2={y1} stroke="var(--color-accent)" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* points */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.last ? 3.5 : 3} fill={p.last ? 'var(--color-accent)' : 'var(--muted)'} />
        ))}

        {/* rho annotation */}
        <text x={R - 4} y={T + 12} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="var(--color-accent)">
          ρ {rho}
        </text>
      </svg>

      {/* axis labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 6px 34px' }}>
        <span style={{ font: "600 8.5px 'Barlow Condensed', sans-serif", letterSpacing: '.14em', color: 'var(--muted)' }}>{xLabel} →</span>
        <span style={{ font: "600 8.5px 'Barlow Condensed', sans-serif", letterSpacing: '.14em', color: 'var(--muted)' }}>↑ {yLabel}</span>
      </div>
    </div>
  );
}
