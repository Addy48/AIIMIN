import React from 'react';
import useThemeColors from '../../hooks/useThemeColors';

/**
 * Chain Wall — "Don't break the chain" grid per habit.
 * Kahneman loss aversion (1979): visible chains create psychological cost of breaking.
 */
export default function ChainWall({ habit, weeks = 8 }) {
  const c = useThemeColors();
  const completed = habit.meta?.completedDates || [];
  const today = new Date();
  const cells = [];

  for (let w = weeks - 1; w >= 0; w--) {
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - w * 7 - (6 - d));
      const key = date.toISOString().split('T')[0];
      const done = completed.includes(key);
      const isFuture = date > today;
      cells.push({ key, done, isFuture });
    }
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div className="text-caption" style={{ marginBottom: 8, color: c.text3 }}>Chain wall — last {weeks} weeks</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, maxWidth: 280 }}>
        {cells.map((cell) => (
          <div
            key={cell.key}
            title={cell.key}
            style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: 4,
              background: cell.done ? c.accent : cell.isFuture ? 'transparent' : c.surface4,
              border: cell.isFuture ? `1px dashed ${c.border}` : cell.done ? 'none' : `1px solid ${c.border}`,
              opacity: cell.isFuture ? 0.35 : 1,
              boxShadow: cell.done ? `0 0 8px ${c.accentDim}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
