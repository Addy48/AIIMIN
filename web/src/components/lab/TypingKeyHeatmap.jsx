import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Keyboard } from 'lucide-react';

/** QWERTY layout rows for heatmap visualization */
export const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  [' '],
];

function heatColor(count, max) {
  if (!count || max <= 0) return { bg: 'var(--color-surface)', border: 'var(--color-border)', text: 'var(--color-text-3)' };
  const intensity = Math.min(1, count / max);
  if (intensity > 0.7) return { bg: 'rgba(239, 68, 68, 0.35)', border: '#EF4444', text: '#EF4444' };
  if (intensity > 0.4) return { bg: 'rgba(245, 158, 11, 0.25)', border: '#F59E0B', text: '#F59E0B' };
  return { bg: 'rgba(37, 99, 235, 0.15)', border: '#2563EB', text: '#2563EB' };
}

/**
 * Typing key heatmap — error density per key (muscle memory targeting).
 */
export default function TypingKeyHeatmap({ keyErrors = {}, compact = false, title = 'Key Error Heatmap' }) {
  const { max, total } = useMemo(() => {
    const vals = Object.values(keyErrors || {});
    return { max: Math.max(...vals, 0), total: vals.reduce((a, b) => a + b, 0) };
  }, [keyErrors]);

  if (total === 0) {
    return (
      <div style={{ padding: compact ? '16px' : '24px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '16px', textAlign: 'center' }}>
        <Keyboard size={20} style={{ color: 'var(--color-text-3)', marginBottom: '8px' }} />
        <div style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>Complete a speed test to populate your key heatmap.</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: compact ? '16px' : '24px', background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '16px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)' }}>{title}</div>
        <div style={{ fontSize: '10px', color: 'var(--color-text-3)' }}>{total} total errors tracked</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {row.map((key) => {
              const count = keyErrors[key] || keyErrors[key.toUpperCase()] || 0;
              const c = heatColor(count, max);
              const isSpace = key === ' ';
              return (
                <div
                  key={key}
                  title={count ? `${count} errors on "${isSpace ? 'space' : key}"` : undefined}
                  style={{
                    minWidth: isSpace ? 120 : compact ? 24 : 28,
                    height: compact ? 24 : 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '6px', border: `1px solid ${c.border}`,
                    background: c.bg, color: c.text,
                    fontSize: isSpace ? '9px' : compact ? '10px' : '11px',
                    fontWeight: 800, fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                  }}
                >
                  {isSpace ? 'space' : key}
                  {count > 0 && !compact && (
                    <span style={{ fontSize: '8px', marginLeft: '2px', opacity: 0.8 }}>{count}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'Low', color: '#2563EB' },
          { label: 'Medium', color: '#F59E0B' },
          { label: 'High', color: '#EF4444' },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--color-text-3)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: color, opacity: 0.6 }} />
            {label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
