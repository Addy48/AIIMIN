import React, { useMemo } from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { SYSTEM_COLORS } from './EventCard';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MonthView = ({ events, currentDate, onDayClick, onEventClick }) => {
  const { theme } = useThemeContext();
  const isDark = theme === 'vercel' || theme === 'midnight';

  const d = new Date(currentDate);
  const year = d.getFullYear();
  const month = d.getMonth();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const today = now.getDate();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let firstDayOffset = new Date(year, month, 1).getDay() - 1;
  if (firstDayOffset < 0) firstDayOffset = 6;

  const eventsByDay = useMemo(() => {
    const grouped = {};
    (events || []).forEach((ev) => {
      const start = new Date(ev.start_time);
      if (start.getMonth() !== month || start.getFullYear() !== year) return;
      const day = start.getDate();
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(ev);
    });
    return grouped;
  }, [events, month, year]);

  const bg = 'var(--color-surface)';
  const border = 'var(--color-border)';
  const text1 = 'var(--color-text-1)';
  const text2 = 'var(--color-text-2)';

  const totalCells = firstDayOffset + daysInMonth;
  const trailingCells = (7 - (totalCells % 7)) % 7;

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--glass-shadow-sm)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${border}`, background: 'var(--color-elevated)' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {Array.from({ length: firstDayOffset }, (_, i) => (
          <div key={`pad-${i}`} style={{
            minHeight: '112px', background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
            borderRight: `1px solid ${border}`, borderBottom: `1px solid ${border}`,
          }} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const cellDate = new Date(year, month, day);
          const isToday = isCurrentMonth && day === today;
          const isFuture = cellDate > now;
          const dayEvents = eventsByDay[day] || [];
          const col = (firstDayOffset + i) % 7;

          return (
            <div
              key={day}
              onClick={() => onDayClick(new Date(year, month, day))}
              style={{
                minHeight: '112px', padding: '10px', cursor: 'pointer',
                background: isToday
                  ? 'color-mix(in srgb, var(--color-accent) 14%, var(--color-surface))'
                  : bg,
                opacity: isFuture ? 0.72 : 1,
                borderRight: col < 6 ? `1px solid ${border}` : 'none',
                borderBottom: `1px solid ${border}`,
                transition: 'background 150ms ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => { if (!isToday) e.currentTarget.style.background = 'var(--color-elevated)'; }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isToday
                  ? 'color-mix(in srgb, var(--color-accent) 14%, var(--color-surface))'
                  : bg;
              }}
            >
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: isToday ? 700 : 600,
                fontFamily: 'var(--font-sans)',
                background: isToday ? 'var(--color-accent)' : 'transparent',
                color: isToday ? '#fff' : text1,
                marginBottom: '8px',
              }}>
                {day}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {dayEvents.slice(0, 3).map((ev) => {
                  const sys = SYSTEM_COLORS[ev.system_type] || SYSTEM_COLORS.general;
                  const chipColor = (ev.color && /^#|rgb/.test(String(ev.color))) ? ev.color : sys.color;
                  return (
                    <div
                      key={ev.id}
                      className="aiimin-cal-chip-v4"
                      onClick={(e) => { e.stopPropagation(); onEventClick(ev); }}
                      title={ev.title}
                      style={{
                        display: 'flex',
                        alignItems: 'stretch',
                        gap: 0,
                        minHeight: 26,
                        borderRadius: 9,
                        background: '#FFFFFF',
                        border: '1.5px solid #C9BCA3',
                        boxShadow: '0 2px 6px rgba(20, 24, 28, 0.10)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          width: 5,
                          flexShrink: 0,
                          background: chipColor,
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          minWidth: 0,
                          padding: '5px 10px',
                          fontSize: 11,
                          fontWeight: 750,
                          fontFamily: 'var(--font-sans)',
                          color: '#14171A',
                          lineHeight: 1.3,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          background: `color-mix(in srgb, ${chipColor} 14%, #FFFFFF)`,
                        }}
                      >
                        {ev.title}
                      </span>
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div style={{ fontSize: '9px', fontWeight: 700, color: text2, fontFamily: 'var(--font-sans)', paddingLeft: '2px' }}>
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {Array.from({ length: trailingCells }, (_, i) => (
          <div key={`trail-${i}`} style={{
            minHeight: '112px', background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
            borderRight: ((firstDayOffset + daysInMonth + i) % 7) < 6 ? `1px solid ${border}` : 'none',
            borderBottom: `1px solid ${border}`,
          }} />
        ))}
      </div>
    </div>
  );
};

export default MonthView;
