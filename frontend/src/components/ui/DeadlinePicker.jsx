import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { formatDate, formatMonthYear } from '../../utils/formatDate';

const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function toKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseKey(key) {
  if (!key) return null;
  const d = new Date(`${key}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function buildGrid(viewMonth) {
  const first = startOfMonth(viewMonth);
  // Monday-first (India-friendly)
  const startOffset = (first.getDay() + 6) % 7;
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - startOffset);
  const cells = [];
  for (let i = 0; i < 42; i += 1) {
    const cell = new Date(gridStart);
    cell.setDate(gridStart.getDate() + i);
    cells.push(cell);
  }
  return cells;
}

/**
 * AIIMIN branded deadline calendar — replaces native <input type="date">
 * which overflows / looks unbranded on light theme.
 */
export default function DeadlinePicker({
  value = '',
  onChange,
  accent = '#ff6b35',
  emptyLabel = 'Set deadline',
  showClear = true,
  compact = true,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 288 });

  const selected = useMemo(() => parseKey(value), [value]);
  const [viewMonth, setViewMonth] = useState(() => selected || new Date());

  useEffect(() => {
    if (selected) setViewMonth(selected);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const todayKey = toKey(new Date());
  const cells = useMemo(() => buildGrid(viewMonth), [viewMonth]);

  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.max(288, Math.min(320, window.innerWidth - 24));
    let left = r.left;
    if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
    if (left < 12) left = 12;
    const below = r.bottom + 8;
    const panelH = 340;
    const top = below + panelH > window.innerHeight - 12
      ? Math.max(12, r.top - panelH - 8)
      : below;
    setPos({ top, left, width });
  };

  useLayoutEffect(() => {
    if (!open) return undefined;
    place();
    const onScroll = () => place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (triggerRef.current?.contains(e.target)) return;
      if (panelRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const daysLeft = (() => {
    if (!selected) return null;
    return Math.ceil((selected - new Date(new Date().setHours(0, 0, 0, 0))) / 86400000);
  })();

  const triggerText = (() => {
    if (!selected) return emptyLabel;
    if (daysLeft < 0) return `${Math.abs(daysLeft)}d overdue`;
    if (daysLeft === 0) return 'Due today';
    return `${daysLeft}d left`;
  })();

  const pick = (d) => {
    onChange?.(toKey(d));
    setOpen(false);
  };

  const panel = open
    ? createPortal(
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Choose deadline"
        style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          width: pos.width,
          maxWidth: 'calc(100vw - 24px)',
          zIndex: 9999,
          background: '#FFFFFF',
          border: `1px solid color-mix(in srgb, ${accent} 28%, #C9BCA3)`,
          borderRadius: 16,
          boxShadow: '0 18px 48px rgba(20, 24, 28, 0.22)',
          padding: 14,
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 850, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, marginBottom: 8 }}>
          Deadline
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 850, color: 'var(--color-text-1)', letterSpacing: '-0.02em', minWidth: 0 }}>
            {formatMonthYear(viewMonth)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              style={navBtn}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Go to today"
              onClick={() => {
                const t = new Date();
                setViewMonth(t);
                pick(t);
              }}
              title="Today"
              style={{
                ...navBtn,
                width: 28,
                borderRadius: 999,
                background: 'color-mix(in srgb, var(--color-accent) 14%, transparent)',
                borderColor: 'color-mix(in srgb, var(--color-accent) 35%, var(--color-border))',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: accent, display: 'block' }} />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              style={navBtn}
            >
              <ChevronRight size={16} />
            </button>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} style={navBtn}>
              <X size={14} />
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: 4,
            marginBottom: 6,
          }}
        >
          {DAY_LABELS.map((d, i) => (
            <div
              key={`${d}-${i}`}
              style={{
                textAlign: 'center',
                fontSize: 10,
                fontWeight: 800,
                color: 'var(--color-text-3)',
                letterSpacing: '0.06em',
                padding: '4px 0',
              }}
            >
              {d}
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: 4,
          }}
        >
          {cells.map((d) => {
            const key = toKey(d);
            const inMonth = d.getMonth() === viewMonth.getMonth();
            const isSelected = value === key;
            const isToday = key === todayKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => pick(d)}
                  style={{
                  aspectRatio: '1',
                  width: '100%',
                  minWidth: 0,
                  maxWidth: '100%',
                  border: isToday && !isSelected ? `1px solid ${accent}` : '1px solid transparent',
                  borderRadius: 10,
                  background: isSelected ? accent : 'transparent',
                  color: isSelected
                    ? '#fff'
                    : inMonth
                      ? 'var(--color-text-1)'
                      : 'var(--color-text-3)',
                  fontSize: 12,
                  fontWeight: isSelected || isToday ? 800 : 600,
                  cursor: 'pointer',
                  opacity: inMonth ? 1 : 0.45,
                  fontFamily: 'inherit',
                  padding: 0,
                  boxSizing: 'border-box',
                  transition: 'background 120ms ease, color 120ms ease',
                }}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-3)', fontWeight: 600 }}>
            {selected ? formatDate(selected) : 'No deadline'}
          </span>
          {showClear && value ? (
            <button
              type="button"
              onClick={() => {
                onChange?.('');
                setOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-3)',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textDecoration: 'underline',
              }}
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>,
      document.body,
    )
    : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          background: open
            ? `color-mix(in srgb, ${accent} 14%, var(--color-elevated, transparent))`
            : 'var(--color-elevated, var(--color-surface))',
          border: `1px solid ${open
            ? `color-mix(in srgb, ${accent} 40%, var(--color-border))`
            : 'var(--color-border)'}`,
          borderRadius: 8,
          padding: compact ? '4px 10px' : '8px 12px',
          color: !selected
            ? accent
            : daysLeft !== null && daysLeft < 7
              ? '#ef4444'
              : 'var(--color-text-2)',
          fontSize: compact ? 10 : 13,
          fontWeight: 750,
          cursor: 'pointer',
          fontFamily: 'inherit',
          lineHeight: 1.2,
        }}
      >
        <Clock size={compact ? 10 : 13} />
        {triggerText}
      </button>
      {panel}
    </>
  );
}

const navBtn = {
  width: 30,
  height: 30,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  border: '1px solid var(--color-border)',
  background: 'var(--color-elevated, var(--color-surface))',
  color: 'var(--color-text-1)',
  cursor: 'pointer',
  padding: 0,
};
