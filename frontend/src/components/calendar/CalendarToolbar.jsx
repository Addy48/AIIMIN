import React from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { redirectToGoogle } from '../../utils/authRedirect';
import toast from '../../utils/toast';

const VIEWS = [
  { key: 'month', label: 'Month' },
  { key: 'week',  label: 'Week' },
  { key: 'day',   label: 'Day' },
  { key: 'agenda',label: 'Agenda' },
];

const CalendarToolbar = ({ view, onViewChange, currentDate, onDateChange, onNewEvent, session, syncStatus, onPullGoogle, onPushGoogle }) => {
  const { theme } = useThemeContext();
  const isDark = theme === 'vercel' || theme === 'midnight';
  const d = new Date(currentDate);

  const border = 'var(--color-border)';
  const bg = 'var(--glass-bg)';
  const text1 = 'var(--color-text-1)';
  const text2 = 'var(--color-text-2)';
  const text3 = 'var(--color-text-3)';
  const accent = 'var(--color-accent)';

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
    background: 'var(--color-elevated)', border: `1px solid ${border}`, cursor: 'pointer',
    color: text2, fontFamily: 'var(--font-sans)', transition: 'all 200ms var(--ease)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    outline: 'none',
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', background: bg, border: `1px solid ${border}`,
      borderRadius: 'var(--r-lg)', marginBottom: '16px',
      backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)',
      boxShadow: 'var(--glass-shadow-sm)',
    }}>
      {/* Left: navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '1px', background: border, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${border}` }}>
          <button onClick={() => navigate(-1)} style={{ ...btnBase, width: '32px', height: '32px', border: 'none' }}>‹</button>
          <button onClick={() => onDateChange(new Date().toISOString())} style={{
            ...btnBase, padding: '0 14px', height: '32px', fontSize: '11px', fontWeight: 600, border: 'none', textTransform: 'uppercase', letterSpacing: '0.04em'
          }}>Today</button>
          <button onClick={() => navigate(1)} style={{ ...btnBase, width: '32px', height: '32px', border: 'none' }}>›</button>
        </div>
        <span style={{ fontSize: '15px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)', marginLeft: '12px', letterSpacing: '-0.01em' }}>
          {title}
        </span>
      </div>

      {/* Right: view switcher + add */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '2px', padding: '3px', background: 'var(--color-elevated)', borderRadius: '10px', border: `1px solid ${border}` }}>
          {VIEWS.map(v => (
            <button key={v.key} onClick={() => onViewChange(v.key)} style={{
              padding: '6px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer',
              fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-sans)',
              background: view === v.key ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') : 'transparent',
              color: view === v.key ? text1 : text2,
              transition: 'all 200ms var(--ease)',
              outline: 'none',
            }}>{v.label}</button>
          ))}
        </div>
        <button onClick={async () => {
          if (!session) {
            toast.error('Please sign in to sync with Google Calendar.');
            return;
          }
          await redirectToGoogle();
        }} style={{
          padding: '8px 16px', borderRadius: '10px', border: `1px solid ${border}`, cursor: 'pointer',
          background: 'var(--color-surface)', color: text1, fontSize: '12px', fontWeight: 600,
          fontFamily: 'var(--font-sans)', transition: 'all 200ms var(--ease)',
          display: syncStatus?.connected ? 'none' : 'flex', alignItems: 'center', gap: '6px'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-elevated)'; e.currentTarget.style.borderColor = text3; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface)'; e.currentTarget.style.borderColor = border; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
          </svg>
          Connect Google
        </button>
        {syncStatus?.connected && (
          <>
            {syncStatus.linkedEmail && (
              <span style={{ fontSize: '11px', color: text3, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {syncStatus.linkedEmail}
              </span>
            )}
            <button onClick={onPullGoogle} style={{
              padding: '8px 12px', borderRadius: '10px', border: `1px solid ${border}`, cursor: 'pointer',
              background: 'var(--color-surface)', color: text2, fontSize: '12px', fontWeight: 600,
              fontFamily: 'var(--font-sans)'
            }}>
              Pull Google
            </button>
            <button onClick={onPushGoogle} style={{
              padding: '8px 12px', borderRadius: '10px', border: `1px solid ${border}`, cursor: 'pointer',
              background: 'var(--color-surface)', color: text2, fontSize: '12px', fontWeight: 600,
              fontFamily: 'var(--font-sans)'
            }}>
              Push Tasks
            </button>
          </>
        )}
        <button onClick={onNewEvent} style={{
          padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
          background: accent, color: isDark ? '#000' : '#fff', fontSize: '12px', fontWeight: 700,
          fontFamily: 'var(--font-sans)', transition: 'all 200ms var(--ease)',
          boxShadow: `0 4px 12px ${isDark ? 'rgba(34,197,94,0.2)' : 'rgba(30,92,58,0.15)'}`,
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >+ New Event</button>
      </div>
    </div>
  );
};

export default CalendarToolbar;
