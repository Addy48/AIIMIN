import React, { useMemo } from 'react';
import { useThemeContext } from '../../context/ThemeContext';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EVENT_COLORS = {
  work:    '#3B82F6',
  health:  '#10B981',
  finance: '#F59E0B',
  social:  '#8B5CF6',
  general: '#6B7280',
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

  const bg = isDark ? '#0A0A0A' : '#fff';
  const bgElevated = isDark ? '#111' : '#F9FAFB';
  const border = isDark ? '#222' : '#E5E7EB';
  const text1 = isDark ? '#EDEDED' : '#111';
  const text2 = isDark ? '#71717A' : '#9CA3AF';
  const text3 = isDark ? '#3F3F3F' : '#D1D5DB';

  const totalCells = firstDayOffset + daysInMonth;
  const trailingCells = (7 - (totalCells % 7)) % 7;

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
      {/* Weekday header row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${border}` }}>
        {WEEKDAYS.map((w, i) => (
          <div key={w} style={{
            textAlign: 'center', fontSize: '11px', fontWeight: 600,
            color: text2, padding: '12px 0', fontFamily: 'var(--font-sans)',
            letterSpacing: '0.04em', textTransform: 'uppercase',
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
            minHeight: '110px', background: bgElevated,
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
                minHeight: '110px', padding: '8px', cursor: 'pointer',
                background: isToday
                  ? (isDark ? 'rgba(34,197,94,0.05)' : 'rgba(34,197,94,0.04)')
                  : isWeekend
                    ? (isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)')
                    : bg,
                borderRight: col < 6 ? `1px solid ${border}` : 'none',
                borderBottom: `1px solid ${border}`,
                transition: 'background 120ms ease',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isToday) e.currentTarget.style.background = isDark ? '#161616' : '#F9FAFB'; }}
              onMouseLeave={e => { e.currentTarget.style.background = isToday ? (isDark ? 'rgba(34,197,94,0.05)' : 'rgba(34,197,94,0.04)') : (isWeekend ? (isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)') : bg); }}
            >
              {/* Day number */}
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: isToday ? 700 : 400,
                fontFamily: 'var(--font-sans)',
                background: isToday ? '#22C55E' : 'transparent',
                color: isToday ? '#fff' : isWeekend ? text2 : text1,
                marginBottom: '6px',
              }}>
                {day}
              </div>

              {/* Events */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {dayEvents.slice(0, 3).map(ev => {
                  const color = EVENT_COLORS[ev.system_type] || EVENT_COLORS.general;
                  return (
                    <div
                      key={ev.id}
                      onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                      style={{
                        fontSize: '10px', fontWeight: 500, fontFamily: 'var(--font-sans)',
                        padding: '2px 6px', borderRadius: '4px',
                        background: `${color}22`, color: color,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        cursor: 'pointer', borderLeft: `2px solid ${color}`,
                        lineHeight: 1.5,
                      }}
                    >
                      {ev.title}
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div style={{ fontSize: '9px', color: text2, fontFamily: 'var(--font-sans)', paddingLeft: '2px' }}>
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Trailing empty cells */}
        {Array.from({ length: trailingCells }, (_, i) => (
          <div key={`pad-end-${i}`} style={{
            minHeight: '110px', background: bgElevated,
            borderRight: (firstDayOffset + daysInMonth + i) % 7 < 6 ? `1px solid ${border}` : 'none',
            borderBottom: `1px solid ${border}`,
          }} />
        ))}
      </div>
    </div>
  );
};

export default MonthView;
