import React, { useMemo } from 'react';
import { useThemeContext } from '../../context/ThemeContext';

const MINI_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const EVENT_COLORS = {
  work: 'var(--color-accent)', 
  health: 'var(--color-rust)', 
  finance: 'var(--color-warning)',
  social: 'var(--color-info)', 
  general: 'var(--color-text-3)',
};

const SYS_LABELS = {
  work: 'Work', health: 'Health', finance: 'Finance', social: 'Social', general: 'General',
};

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
    fontSize: '10px', 
    fontWeight: 700, 
    color: text2, 
    textTransform: 'uppercase', 
    letterSpacing: '0.08em', 
    fontFamily: 'var(--font-sans)', 
    marginBottom: '14px' 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '220px', flexShrink: 0 }}>

      {/* Mini-month navigator */}
      <div style={panel}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', textAlign: 'center', marginBottom: '14px' }}>
          {d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' }}>
          {MINI_DAYS.map((w, i) => (
            <div key={i} style={{ fontSize: '9px', fontWeight: 700, color: text2, padding: '4px 0', fontFamily: 'var(--font-sans)' }}>{w}</div>
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
                  padding: '4px 0', borderRadius: '6px', cursor: 'pointer', fontSize: '10px',
                  fontFamily: 'var(--font-sans)', textAlign: 'center',
                  fontWeight: isToday || isSelected ? 700 : 500,
                  color: isSelected ? (isDark ? '#000' : '#fff') : isToday ? 'var(--color-accent)' : text1,
                  background: isSelected ? 'var(--color-accent)' : 'transparent',
                  transition: 'all 200ms var(--ease)',
                }}
              >{day}</div>
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
              color: systemFilter === key ? color : text2, fontWeight: systemFilter === key ? 600 : 500, width: '100%', textAlign: 'left',
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
      <div style={panel}>
        <div style={label}>Month Status</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: text2, fontFamily: 'var(--font-sans)' }}>Activities</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)' }}>{(events || []).length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: text2, fontFamily: 'var(--font-sans)' }}>Remaining</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)' }}>
              {new Date(year, month + 1, 0).getDate() - now.getDate()}d
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar;
