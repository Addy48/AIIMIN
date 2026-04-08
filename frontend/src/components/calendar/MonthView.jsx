import React, { useMemo } from 'react';
import { useThemeContext } from '../../context/ThemeContext';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EVENT_COLORS = {
  work:    'var(--color-accent)',
  health:  'var(--color-rust)',
  finance: 'var(--color-warning)',
  social:  'var(--color-info)',
  general: 'var(--color-text-3)',
};

const MonthView = ({ events, currentDate, onDayClick, onEventClick }) => {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const d = new Date(currentDate);
  const year = d.getFullYear();
  const month = d.getMonth();
  const now = new Date();
  const today = now.getDate();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let firstDayOffset = new Date(year, month, 1).getDay() - 1;
  if (firstDayOffset < 0) firstDayOffset = 6;

  const eventsByDay = useMemo(() => {
    const grouped = {};
    (events || []).forEach(ev => {
      const day = new Date(ev.start_time).getDate();
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(ev);
    });
    return grouped;
  }, [events]);

  const bg = 'var(--color-base)';
  const border = 'var(--color-border)';
  const text1 = 'var(--color-text-1)';
  const text2 = 'var(--color-text-2)';

  const totalCells = firstDayOffset + daysInMonth;
  const trailingCells = (7 - (totalCells % 7)) % 7;

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--glass-shadow-sm)' }}>
      {/* Weekday header row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${border}`, background: 'var(--color-surface)' }}>
        {WEEKDAYS.map((w, i) => (
          <div key={w} style={{
            textAlign: 'center', fontSize: '10px', fontWeight: 700,
            color: text2, padding: '14px 0', fontFamily: 'var(--font-sans)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            borderRight: i < 6 ? `1px solid ${border}` : 'none',
          }}>
            {w}
          </div>
        ))}
      </div>

      {/* Day cells grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {/* Leading empty cells */}
        {Array.from({ length: firstDayOffset }, (_, i) => (
          <div key={`pad-${i}`} style={{
            minHeight: '120px', background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
            borderRight: `1px solid ${border}`, borderBottom: `1px solid ${border}`,
          }} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isToday = isCurrentMonth && day === today;
          const dayEvents = eventsByDay[day] || [];
          const col = (firstDayOffset + i) % 7;
          const isWeekend = col === 5 || col === 6;

          return (
            <div
              key={day}
              onClick={() => onDayClick(new Date(year, month, day))}
              style={{
                minHeight: '120px', padding: '10px', cursor: 'pointer',
                background: isToday 
                  ? 'var(--color-accent-dim)' 
                  : isWeekend ? 'var(--color-surface)' : bg,
                borderRight: col < 6 ? `1px solid ${border}` : 'none',
                borderBottom: `1px solid ${border}`,
                transition: 'all 200ms var(--ease)',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isToday) e.currentTarget.style.background = 'var(--color-elevated)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = isToday ? 'var(--color-accent-dim)' : (isWeekend ? 'var(--color-surface)' : bg); }}
            >
              {/* Day number */}
              <div style={{
                width: '24px', height: '24px', borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: isToday ? 700 : 500,
                fontFamily: 'var(--font-sans)',
                background: isToday ? 'var(--color-accent)' : 'transparent',
                color: isToday ? (isDark ? '#000' : '#fff') : (isWeekend ? text2 : text1),
                marginBottom: '8px',
                transition: 'all 200ms var(--ease)',
              }}>
                {day}
              </div>

              {/* Events */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {dayEvents.slice(0, 4).map(ev => {
                  const color = EVENT_COLORS[ev.system_type] || EVENT_COLORS.general;
                  return (
                    <div
                      key={ev.id}
                      onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                      style={{
                        fontSize: '10px', fontWeight: 600, fontFamily: 'var(--font-sans)',
                        padding: '3px 8px', borderRadius: '6px',
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                        color: color,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        cursor: 'pointer', borderLeft: `2px solid ${color}`,
                        lineHeight: 1.4,
                        transition: 'transform 150ms var(--ease)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                    >
                      {ev.title}
                    </div>
                  );
                })}
                {dayEvents.length > 4 && (
                  <div style={{ fontSize: '9px', fontWeight: 600, color: text2, fontFamily: 'var(--font-sans)', paddingLeft: '4px', marginTop: '2px' }}>
                    + {dayEvents.length - 4} more
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Trailing empty cells */}
        {Array.from({ length: trailingCells }, (_, i) => (
          <div key={`pad-end-${i}`} style={{
            minHeight: '120px', background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
            borderRight: (firstDayOffset + daysInMonth + i) % 7 < 6 ? `1px solid ${border}` : 'none',
            borderBottom: `1px solid ${border}`,
          }} />
        ))}
      </div>
    </div>
  );
};

export default MonthView;
