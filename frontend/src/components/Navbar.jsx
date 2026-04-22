import React, { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { useThemeContext } from '../context/ThemeContext';
import NotificationBell from './notifications/NotificationBell';
import AccountModal from './account/AccountModal';

/* ── Nav link definitions (clean, no duplicates) ── */
const NAV_LINKS = [
  { to: '/overview',    label: 'Today' },
  { to: '/calendar',   label: 'Calendar' },
  { to: '/finance',    label: 'Finance' },
  { to: '/journal',    label: 'Journal' },
  { to: '/insights',   label: 'Skills' },
  { to: '/lab',        label: 'Lab', hasNew: true },
  { to: '/placements', label: 'Placement' },
  { to: '/sports',     label: 'Sports' },
];

const Navbar = ({ user }) => {
  const { notifications, unreadCount, loading, fetchAll, markRead, markAllRead, dismiss } = useNotifications();
  const { theme, toggleTheme } = useThemeContext();
  const [notifOpen, setNotifOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const bellRef = useRef(null);

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'A';
  const isDark = theme === 'dark';

  const handleOpenNotif = () => {
    if (!notifOpen) fetchAll();
    setNotifOpen(o => !o);
  };

  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 'var(--nav-height)',
        background: isDark ? 'rgba(10,10,10,0.92)' : 'rgba(240,237,232,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        zIndex: 1000,
        gap: '0',
      }}>

        {/* LEFT: Brand — fixed width so center stays centered */}
        <div style={{ width: '160px', flexShrink: 0 }}>
          <Link to="/overview" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '26px', height: '26px', background: '#23503B',
              borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M9 2.5 L3.5 14.5 L5.5 14.5 L6.8 11.2 L11.2 11.2 L12.5 14.5 L14.5 14.5 Z" fill="white" fillOpacity="0.95" />
                <path d="M7.5 9.5 L9 6 L10.5 9.5 Z" fill="#23503B" />
              </svg>
            </div>
            <span style={{
              fontSize: '15px', fontWeight: 600, letterSpacing: '-0.02em',
              fontStyle: 'italic', color: isDark ? '#EDEDED' : '#1A1A1A',
              fontFamily: 'var(--font-sans)',
            }}>
              AIIMIN
            </span>
          </Link>
        </div>

        {/* CENTER: Nav links — truly centered with flex auto margins */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
        }}>
          {NAV_LINKS.map(({ to, label, hasNew }) => (
            <NavLink
              key={`${to}-${label}`}
              to={to}
              style={({ isActive }) => ({
                fontSize: '13px',
                fontWeight: isActive ? 500 : 400,
                fontFamily: 'var(--font-sans)',
                color: isActive ? (isDark ? '#EDEDED' : '#1A1A1A') : (isDark ? '#71717A' : '#6B6B6B'),
                textDecoration: 'none',
                padding: '5px 10px',
                borderRadius: '6px',
                background: isActive ? (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)') : 'transparent',
                border: `1px solid ${isActive ? (isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.08)') : 'transparent'}`,
                transition: 'all 150ms ease',
                display: 'flex', alignItems: 'center', gap: '5px',
                whiteSpace: 'nowrap',
              })}
            >
              {label}
              {hasNew && (
                <span style={{
                  fontSize: '8px', fontWeight: 700, padding: '1px 5px',
                  borderRadius: '9999px', background: '#22C55E', color: '#fff',
                  letterSpacing: '0.05em', lineHeight: 1.4,
                }}>NEW</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* RIGHT: Actions — fixed width matching LEFT */}
        <div style={{ width: '160px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', flexShrink: 0 }}>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Light mode' : 'Dark mode'}
            style={{
              width: '30px', height: '30px', borderRadius: '6px', background: 'transparent',
              border: `1px solid ${borderColor}`,
              color: isDark ? '#A1A1AA' : '#6B6B6B', fontSize: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms ease',
            }}
          >
            {isDark ? '☀' : '◑'}
          </button>

          {/* Notification bell + dropdown (position: relative wrapper) */}
          <div ref={bellRef} style={{ position: 'relative' }}>
            <NotificationBell unreadCount={unreadCount} onClick={handleOpenNotif} />

            {notifOpen && (
              <NotifDropdown
                notifications={notifications}
                loading={loading}
                onMarkRead={markRead}
                onMarkAllRead={markAllRead}
                onDismiss={dismiss}
                onClose={() => setNotifOpen(false)}
                isDark={isDark}
              />
            )}
          </div>

          {/* Avatar */}
          <button
            onClick={() => setShowAccount(true)}
            style={{
              width: '30px', height: '30px', borderRadius: '50%', background: '#23503B',
              border: 'none', color: '#fff', font: '600 12px var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Account"
          >
            {userInitial}
          </button>
        </div>
      </nav>

      {showAccount && (
        <AccountModal user={user} onClose={() => setShowAccount(false)} />
      )}
    </>
  );
};

/* ── Inline notification dropdown (positioned from bell) ── */
const typeIcon = (type) => {
  const map = {
    drift_alert: '📉', commitment_miss: '🎯', weekly_summary: '📊',
    integration_error: '⚠', streak_milestone: '🔥', xp_level_up: '⚡',
    weekly_summary_ready: '📊', goal_progress: '🎯',
  };
  return map[type] || '💬';
};

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

const NotifDropdown = ({ notifications, loading, onMarkRead, onMarkAllRead, onDismiss, onClose, isDark }) => {
  const ref = useRef(null);

  React.useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  const bg = isDark ? '#161616' : '#FFFFFF';
  const border = isDark ? '#222222' : '#E5E5E5';

  return (
    <div ref={ref} style={{
      position: 'absolute',
      top: 'calc(100% + 10px)',
      right: 0,
      width: '320px',
      maxHeight: '420px',
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: '10px',
      boxShadow: isDark ? '0 12px 40px rgba(0,0,0,0.6)' : '0 8px 24px rgba(0,0,0,0.12)',
      zIndex: 9999,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: `1px solid ${border}`, flexShrink: 0,
      }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#EDEDED' : '#1A1A1A', fontFamily: 'var(--font-sans)' }}>
          Notifications
        </span>
        {notifications.some(n => !n.read_at) && (
          <button onClick={onMarkAllRead} style={{
            background: 'none', border: 'none', fontSize: '11px', fontWeight: 500,
            color: '#22C55E', cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {loading && (
          <div style={{ padding: '24px', textAlign: 'center', color: isDark ? '#52525B' : '#9CA3AF', fontSize: '12px', fontFamily: 'var(--font-sans)' }}>
            Loading…
          </div>
        )}
        {!loading && notifications.length === 0 && (
          <div style={{ padding: '32px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔔</div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: isDark ? '#A1A1AA' : '#6B7280', fontFamily: 'var(--font-sans)' }}>All clear</div>
          </div>
        )}
        {!loading && notifications.map(n => (
          <div key={n.id} style={{
            padding: '10px 16px', borderBottom: `1px solid ${border}`,
            display: 'flex', gap: '10px', alignItems: 'flex-start',
            background: !n.read_at ? (isDark ? 'rgba(34,197,94,0.04)' : 'rgba(34,197,94,0.04)') : 'transparent',
          }}>
            <span style={{ fontSize: '15px', flexShrink: 0, marginTop: '1px' }}>{typeIcon(n.type)}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '12px', fontWeight: n.read_at ? 400 : 600,
                color: isDark ? '#EDEDED' : '#1A1A1A', marginBottom: '2px', fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{n.title}</div>
              {n.body && (
                <div style={{ fontSize: '11px', color: isDark ? '#71717A' : '#6B7280', lineHeight: 1.4, fontFamily: 'var(--font-sans)' }}>
                  {n.body}
                </div>
              )}
              <div style={{ fontSize: '10px', color: isDark ? '#52525B' : '#9CA3AF', marginTop: '3px', fontFamily: 'var(--font-sans)' }}>
                {n.created_at ? timeAgo(n.created_at) : ''}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
              {!n.read_at && (
                <button onClick={() => onMarkRead(n.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: '#22C55E', fontSize: '11px', padding: '2px',
                }}>✓</button>
              )}
              <button onClick={() => onDismiss(n.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: isDark ? '#52525B' : '#9CA3AF', fontSize: '11px', padding: '2px',
              }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
