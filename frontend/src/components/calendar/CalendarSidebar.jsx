import React, { useMemo } from 'react';
import { useThemeContext } from '../../context/ThemeContext';

const MINI_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const EVENT_COLORS = {
  work: '#3B82F6', health: '#10B981', finance: '#F59E0B',
  social: '#8B5CF6', general: '#6B7280',
};

const SYS_LABELS = {
  work: 'Work', health: 'Health', finance: 'Finance', social: 'Social', general: 'General',
};

const CalendarSidebar = ({ currentDate, onDateChange, events, systemFilter, onSystemFilterChange }) => {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  const d = new Date(currentDate);
  const year = d.getFullYear();
  const month = d.getMonth();
  const now = useMemo(() => new Date(), []);
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let firstDayOffset = new Date(year, month, 1).getDay() - 1;
  if (firstDayOffset < 0) firstDayOffset = 6;

  const bg = isDark ? '#111' : '#fff';
  const border = isDark ? '#222' : '#E5E7EB';
  const text1 = isDark ? '#EDEDED' : '#111';
  const text2 = isDark ? '#71717A' : '#6B7280';
  const text3 = isDark ? '#3F3F3F' : '#D1D5DB';

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

  const panel = { background: bg, border: `1px solid ${border}`, borderRadius: '10px', padding: '16px' };
  const label = { fontSize: '10px', fontWeight: 600, color: text2, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-sans)', marginBottom: '12px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '210px', flexShrink: 0 }}>

      {/* Mini-month navigator */}
      <div style={panel}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', textAlign: 'center', marginBottom: '12px' }}>
          {d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' }}>
          {MINI_DAYS.map((w, i) => (
            <div key={i} style={{ fontSize: '9px', fontWeight: 600, color: text2, padding: '3px 0', fontFamily: 'var(--font-sans)' }}>{w}</div>
          ))}
          {Array.from({ length: firstDayOffset }, (_, i) => <div key={`p-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isToday = isCurrentMonth && day === now.getDate();
            const isSelected = d.getDate() === day && isCurrentMonth;
            return (
              <div
                key={day}
                onClick={() => onDateChange(new Date(year, month, day).toISOString())}
                style={{
                  padding: '3px 0', borderRadius: '50%', cursor: 'pointer', fontSize: '10px',
                  fontFamily: 'var(--font-sans)', textAlign: 'center',
                  fontWeight: isToday || isSelected ? 700 : 400,
                  color: isSelected ? '#fff' : isToday ? '#22C55E' : text1,
                  background: isSelected ? '#22C55E' : 'transparent',
                  transition: 'all 100ms ease',
                }}
              >{day}</div>
            );
          })}
        </div>
      </div>

      {/* Filter by type */}
      <div style={panel}>
        <div style={label}>Filter</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <button onClick={() => onSystemFilterChange(null)} style={{
            display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px',
            border: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-sans)',
            background: !systemFilter ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)') : 'transparent',
            color: !systemFilter ? text1 : text2, fontWeight: !systemFilter ? 600 : 400, width: '100%', textAlign: 'left',
          }}>
            <span>All events</span>
            <span style={{ fontSize: '11px', fontWeight: 600 }}>{(events || []).length}</span>
          </button>
          {Object.entries(EVENT_COLORS).map(([key, color]) => (
            <button key={key} onClick={() => onSystemFilterChange(systemFilter === key ? null : key)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderRadius: '6px',
              border: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-sans)',
              background: systemFilter === key ? `${color}18` : 'transparent',
              color: systemFilter === key ? color : text2, fontWeight: systemFilter === key ? 600 : 400, width: '100%', textAlign: 'left',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                {SYS_LABELS[key]}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600 }}>{systemCounts[key] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div style={panel}>
          <div style={label}>Upcoming 7 days</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {upcoming.map(ev => {
              const color = EVENT_COLORS[ev.system_type] || EVENT_COLORS.general;
              const dt = new Date(ev.start_time);
              return (
                <div key={ev.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ width: '3px', borderRadius: '2px', background: color, alignSelf: 'stretch', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ev.title}
                    </div>
                    <div style={{ fontSize: '10px', color: text2, fontFamily: 'var(--font-sans)', marginTop: '1px' }}>
                      {dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick stats */}
      <div style={panel}>
        <div style={label}>This Month</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: text2, fontFamily: 'var(--font-sans)' }}>Total events</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)' }}>{(events || []).length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: text2, fontFamily: 'var(--font-sans)' }}>Days remaining</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)' }}>
              {new Date(year, month + 1, 0).getDate() - now.getDate()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;
