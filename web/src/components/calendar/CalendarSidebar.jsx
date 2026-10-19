import React, { useMemo } from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { SYSTEM_COLORS } from './EventCard';

const MINI_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const EVENT_COLORS = Object.fromEntries(
  Object.entries(SYSTEM_COLORS).map(([k, v]) => [k, v.color])
);

const SYS_LABELS = Object.fromEntries(
  Object.entries(SYSTEM_COLORS).map(([k, v]) => [k, v.label])
);

const CalendarSidebar = ({ currentDate, onDateChange, events, systemFilter, onSystemFilterChange }) => {
  const { theme } = useThemeContext();
  const isDark = theme === 'vercel' || theme === 'midnight';

  const d = new Date(currentDate);
  const year = d.getFullYear();
  const month = d.getMonth();
  const now = useMemo(() => new Date(), []);
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let firstDayOffset = new Date(year, month, 1).getDay() - 1;
  if (firstDayOffset < 0) firstDayOffset = 6;

  const bg = 'var(--color-surface)';
  const border = 'var(--color-border)';
  const text1 = 'var(--color-text-1)';
  const text2 = 'var(--color-text-2)';

  const systemCounts = useMemo(() => {
    const counts = {};
    (events || []).forEach(ev => {
      const t = ev.system_type || 'general';
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, [events]);

  const upcoming = useMemo(() => {
    const cutoff = new Date(now.getTime() + 7 * 86400000);
    return (events || [])
      .filter(ev => new Date(ev.start_time) >= now && new Date(ev.start_time) <= cutoff)
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
      .slice(0, 5);
  }, [events, now]);

  const panel = { 
    background: bg, 
    border: `1px solid ${border}`, 
    borderRadius: '12px', 
    padding: '16px',
    boxShadow: 'var(--glass-shadow-sm)',
  };
  const label = { 
    fontSize: '11px', 
    fontWeight: 700, 
    color: text1, 
    textTransform: 'uppercase', 
    letterSpacing: '0.08em', 
    fontFamily: 'var(--font-sans)', 
    marginBottom: '14px' 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '240px', flexShrink: 0, minWidth: 0 }}>

      {/* Mini-month navigator — must fit 7 cols inside panel (no minWidth on cells) */}
      <div style={{ ...panel, overflow: 'hidden', boxSizing: 'border-box' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', textAlign: 'center', marginBottom: '12px' }}>
          {d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: 2,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {MINI_DAYS.map((w, i) => (
            <div
              key={i}
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: text2,
                padding: '2px 0',
                fontFamily: 'var(--font-sans)',
                textAlign: 'center',
                minWidth: 0,
              }}
            >
              {w}
            </div>
          ))}
          {Array.from({ length: firstDayOffset }, (_, i) => (
            <div key={`p-${i}`} style={{ minWidth: 0, aspectRatio: '1' }} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isToday = isCurrentMonth && day === now.getDate();
            const isSelected = d.getDate() === day && isCurrentMonth;
            return (
              <button
                key={day}
                type="button"
                onClick={() => onDateChange(new Date(year, month, day).toISOString())}
                style={{
                  aspectRatio: '1',
                  width: '100%',
                  minWidth: 0,
                  maxWidth: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 7,
                  cursor: 'pointer',
                  fontSize: 11,
                  fontFamily: 'var(--font-sans)',
                  fontWeight: isToday || isSelected ? 700 : 500,
                  color: isSelected ? (isDark ? '#000' : '#fff') : isToday ? 'var(--color-accent)' : text1,
                  background: isSelected ? 'var(--color-accent)' : isToday ? 'color-mix(in srgb, var(--color-accent) 18%, transparent)' : 'transparent',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  boxSizing: 'border-box',
                  transition: 'all 200ms var(--ease)',
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter by type */}
      <div style={panel}>
        <div style={label}>System Filter</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button onClick={() => onSystemFilterChange(null)} style={{
            display: 'flex', justifyContent: 'space-between', padding: '8px 10px', borderRadius: '8px',
            border: 'none', cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-sans)',
            background: !systemFilter ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)') : 'transparent',
            color: !systemFilter ? text1 : text2, fontWeight: !systemFilter ? 600 : 500, width: '100%', textAlign: 'left',
            transition: 'all 200ms var(--ease)',
          }}>
            <span>All Events</span>
            <span style={{ fontSize: '10px', fontWeight: 700, opacity: 0.6 }}>{(events || []).length}</span>
          </button>
          {Object.entries(EVENT_COLORS).map(([key, color]) => (
            <button key={key} onClick={() => onSystemFilterChange(systemFilter === key ? null : key)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', borderRadius: '8px',
              border: 'none', cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-sans)',
              background: systemFilter === key ? (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)') : 'transparent',
            color: systemFilter === key ? color : text1, fontWeight: systemFilter === key ? 600 : 500, width: '100%', textAlign: 'left',
              transition: 'all 200ms var(--ease)',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                {SYS_LABELS[key]}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 700, opacity: 0.6 }}>{systemCounts[key] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div style={panel}>
          <div style={label}>Upcoming</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcoming.map(ev => {
              const color = EVENT_COLORS[ev.system_type] || EVENT_COLORS.general;
              const dt = new Date(ev.start_time);
              return (
                <div key={ev.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '2px', borderRadius: '2px', background: color, alignSelf: 'stretch', flexShrink: 0, marginTop: '2px', opacity: 0.8 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ev.title}
                    </div>
                    <div style={{ fontSize: '10px', color: text2, fontFamily: 'var(--font-sans)', marginTop: '2px' }}>
                      {dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div style={{ ...panel, paddingBottom: '18px' }}>
        <div style={label}>Month Status</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: text2, fontFamily: 'var(--font-sans)' }}>Activities</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)' }}>{(events || []).length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: text2, fontFamily: 'var(--font-sans)' }}>Days remaining</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)' }}>
              {Math.max(0, new Date(year, month + 1, 0).getDate() - (isCurrentMonth ? now.getDate() : 0))}d
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;
