import React from 'react';

export default function SportsNewsStrip({ items = [], title = 'Sports news' }) {
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 12px', color: 'var(--color-text-1)' }}>{title}</h3>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
        {items.map((item) => (
          <div key={item.id} style={{ minWidth: 260, maxWidth: 300, padding: 16, borderRadius: 12, border: '1px solid var(--color-border)', background: 'var(--bg-card)', flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-1)', lineHeight: 1.4, marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-3)', lineHeight: 1.4 }}>
              {item.summary?.slice(0, 120)}
              {item.summary?.length > 120 ? '…' : ''}
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: 'var(--color-text-3)', marginTop: 8 }}>Source: ESPN public news feeds</p>
    </div>
  );
}
