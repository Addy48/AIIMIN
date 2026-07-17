import React, { useState, useEffect, useMemo } from 'react';
import { apiGet } from '../../utils/api';

/** Local YYYY-MM-DD (avoids UTC shift that emptied early-year cells). */
function toLocalDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Yearly habit heatmap — GitHub-style contribution grid from GET /habits meta.completedDates.
 */
export default function YearlyHabitMatrix() {
  const [data, setData] = useState({});
  const [totalHabits, setTotalHabits] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const habits = await apiGet('/habits');
        if (cancelled) return;
        const list = Array.isArray(habits) ? habits : [];
        setTotalHabits(Math.max(1, list.length));

        const heatmapData = {};
        for (const h of list) {
          const dates = h?.meta?.completedDates || [];
          for (const date of dates) {
            const key = String(date).slice(0, 10);
            heatmapData[key] = (heatmapData[key] || 0) + 1;
          }
        }
        setData(heatmapData);
      } catch (err) {
        console.warn('[YearlyHabitMatrix] load failed:', err.message);
        if (!cancelled) {
          setData({});
          setTotalHabits(1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const { weeks, monthLabels, activeDays, bestStreak } = useMemo(() => {
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    const start = new Date(now);
    start.setDate(start.getDate() - 364);
    // Align to Monday
    const dow = start.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    start.setDate(start.getDate() + mondayOffset);

    const weekCols = [];
    const labels = [];
    let active = 0;
    let streak = 0;
    let best = 0;
    let lastMonth = -1;

    for (let w = 0; w < 53; w++) {
      const col = [];
      for (let r = 0; r < 7; r++) {
        const d = new Date(start);
        d.setDate(start.getDate() + w * 7 + r);
        if (d > now) {
          col.push(null);
          continue;
        }
        const key = toLocalDateKey(d);
        const count = data[key] || 0;
        if (count > 0) {
          active += 1;
          streak += 1;
          best = Math.max(best, streak);
        } else {
          streak = 0;
        }
        const pct = count / totalHabits;
        let level = 0;
        if (pct > 0) level = 1;
        if (pct > 0.35) level = 2;
        if (pct > 0.65) level = 3;
        if (pct >= 0.95) level = 4;
        col.push({ date: key, count, level, label: d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) });

        if (r === 0) {
          const m = d.getMonth();
          if (m !== lastMonth) {
            labels.push({ week: w, text: d.toLocaleDateString('en-US', { month: 'short' }) });
            lastMonth = m;
          }
        }
      }
      weekCols.push(col);
    }
    return { weeks: weekCols, monthLabels: labels, activeDays: active, bestStreak: best };
  }, [data, totalHabits]);

  const LEVEL = [
    'var(--color-elevated)',
    'rgba(16, 185, 129, 0.28)',
    'rgba(16, 185, 129, 0.5)',
    'rgba(16, 185, 129, 0.75)',
    '#10b981',
  ];

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 24,
      padding: '28px 28px 22px',
      overflowX: 'auto',
      marginTop: 32,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-3)', marginBottom: 8 }}>
            Yearly Habit Heatmap
          </div>
          <div style={{ fontSize: 14, color: 'var(--color-text-2)', fontWeight: 600 }}>
            {loading ? 'Loading…' : `${activeDays} active days · best streak ${bestStreak}d · ${totalHabits} habits`}
          </div>
        </div>
        {hover && (
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-1)', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '8px 12px' }}>
            {hover.label} · {hover.count}/{totalHabits} done
          </div>
        )}
      </div>

      <div style={{ position: 'relative', minWidth: 720 }}>
        <div style={{ display: 'flex', marginLeft: 36, marginBottom: 6, height: 16, position: 'relative' }}>
          {monthLabels.map((m) => (
            <div key={`${m.week}-${m.text}`} style={{
              position: 'absolute',
              left: m.week * 15,
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--color-text-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {m.text}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 3 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: 32, paddingTop: 0, justifyContent: 'space-between' }}>
            {['Mon', '', 'Wed', '', 'Fri', '', 'Sun'].map((lab, i) => (
              <div key={i} style={{ height: 12, fontSize: 9, fontWeight: 700, color: 'var(--color-text-3)', lineHeight: '12px' }}>{lab}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {weeks.map((col, ci) => (
              <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {col.map((cell, ri) => (
                  <div
                    key={ri}
                    onMouseEnter={() => cell && setHover(cell)}
                    onMouseLeave={() => setHover(null)}
                    title={cell ? `${cell.label}: ${cell.count} habits` : ''}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: cell ? LEVEL[cell.level] : 'transparent',
                      border: cell && cell.level === 0 ? '1px solid var(--color-border)' : 'none',
                      cursor: cell ? 'pointer' : 'default',
                      transition: 'transform 120ms ease',
                    }}
                    onMouseOver={(e) => { if (cell) e.currentTarget.style.transform = 'scale(1.25)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, marginTop: 18, fontSize: 10, color: 'var(--color-text-3)', fontWeight: 700 }}>
        <span>Less</span>
        {LEVEL.map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c, border: i === 0 ? '1px solid var(--color-border)' : 'none' }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
