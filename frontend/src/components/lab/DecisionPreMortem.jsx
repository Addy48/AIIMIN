import React from 'react';
import { Skull } from 'lucide-react';

/**
 * Pre-mortem step — Klein (2007): imagine failure before deciding.
 * Integrated into Decision Matrix flow.
 */
export default function DecisionPreMortem({ value, onChange, color = '#2563EB' }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{ padding: '8px', borderRadius: '10px', background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
          <Skull size={20} style={{ color }} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-1)', margin: 0 }}>Pre-Mortem</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-3)', margin: '4px 0 0' }}>Klein (2007) — prospective hindsight</p>
        </div>
      </div>

      <p style={{ color: 'var(--color-text-2)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.55 }}>
        Fast-forward 6 months. The decision failed spectacularly. Write the post-mortem headline and top 3 reasons it failed.
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. 'Startup failed — ran out of runway.' Reasons: 1) No product-market fit 2) Burned savings too fast 3) Ignored market signals..."
        rows={6}
        style={{
          width: '100%', background: 'var(--color-bg)', border: '1px solid var(--color-border)',
          color: 'var(--color-text-1)', padding: '1rem', borderRadius: '12px', fontSize: '1rem',
          resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5,
        }}
        onFocus={(e) => { e.target.style.borderColor = color; }}
        onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; }}
      />

      <div style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)', fontSize: '12px', color: 'var(--color-text-2)', lineHeight: 1.5 }}>
        Pre-mortems reduce overconfidence by ~30% in group decisions (Klein et al.). Be specific — vague fears don&apos;t help.
      </div>
    </div>
  );
}
