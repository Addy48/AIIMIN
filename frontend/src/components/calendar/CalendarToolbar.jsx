import React from 'react';
import { useThemeContext } from '../../context/ThemeContext';

const VIEWS = [
  { key: 'month', label: 'Month' },
  { key: 'week',  label: 'Week' },
  { key: 'day',   label: 'Day' },
  { key: 'agenda',label: 'Agenda' },
];

const CalendarToolbar = ({ view, onViewChange, currentDate, onDateChange, onNewEvent }) => {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const d = new Date(currentDate);

  const border = isDark ? '#222' : '#E5E7EB';
  const bg = isDark ? '#111' : '#fff';
  const text1 = isDark ? '#EDEDED' : '#111';
  const text2 = isDark ? '#71717A' : '#6B7280';

  const navigate = (dir) => {
    const next = new Date(d);
    if (view === 'month') next.setMonth(d.getMonth() + dir);
    else if (view === 'week') next.setDate(d.getDate() + 7 * dir);
    else next.setDate(d.getDate() + dir);
    onDateChange(next.toISOString());
  };

  const title = view === 'month'
    ? d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : view === 'week'
      ? `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      : d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const btnBase = {
    background: 'transparent', border: `1px solid ${border}`, cursor: 'pointer',
    color: text2, fontFamily: 'var(--font-sans)', transition: 'all 150ms ease',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px', background: bg, border: `1px solid ${border}`,
      borderRadius: '12px', marginBottom: '16px',
    }}>
      {/* Left: navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={() => navigate(-1)} style={{ ...btnBase, width: '32px', height: '32px', borderRadius: '8px', fontSize: '16px' }}>‹</button>
        <button onClick={() => onDateChange(new Date().toISOString())} style={{
          ...btnBase, padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500,
        }}>Today</button>
        <button onClick={() => navigate(1)} style={{ ...btnBase, width: '32px', height: '32px', borderRadius: '8px', fontSize: '16px' }}>›</button>
        <span style={{ fontSize: '16px', fontWeight: 700, color: text1, fontFamily: 'var(--font-sans)', marginLeft: '8px', letterSpacing: '-0.02em' }}>
          {title}
        </span>
      </div>

      {/* Right: view switcher + add */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '2px', padding: '3px', background: isDark ? '#1a1a1a' : '#F3F4F6', borderRadius: '8px' }}>
          {VIEWS.map(v => (
            <button key={v.key} onClick={() => onViewChange(v.key)} style={{
              padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
              fontSize: '12px', fontWeight: 500, fontFamily: 'var(--font-sans)',
              background: view === v.key ? bg : 'transparent',
              color: view === v.key ? text1 : text2,
              boxShadow: view === v.key ? `0 1px 3px rgba(0,0,0,${isDark ? 0.4 : 0.1})` : 'none',
              transition: 'all 150ms ease',
            }}>{v.label}</button>
          ))}
        </div>
        <button onClick={onNewEvent} style={{
          padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
          background: '#22C55E', color: '#fff', fontSize: '12px', fontWeight: 600,
          fontFamily: 'var(--font-sans)', transition: 'opacity 150ms ease',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >+ New event</button>
      </div>
    </div>
  );
};

export default CalendarToolbar;
