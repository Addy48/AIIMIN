import React, { useState, useRef, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotifications } from '../hooks/useNotifications';
import { useThemeContext } from '../context/ThemeContext';
import NotificationBell from './notifications/NotificationBell';
import AccountModal from './account/AccountModal';
import Logo from './Logo';

const NAV_STORAGE_KEY = 'aiimin_nav_pos_v1';

/* ── Draggable floating nav ──────────────────────────────── */
const FloatingNav = ({ user, isDark }) => {
  const getInitialPos = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(NAV_STORAGE_KEY));
      if (saved && typeof saved.x === 'number') return saved;
    } catch {}
    // Default: centered horizontally, just below top bar
    return { x: 0, y: 0 };
  };

  const [pos, setPos] = useState(getInitialPos);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

  const handleDragEnd = useCallback((_, info) => {
    const newPos = { x: pos.x + info.offset.x, y: pos.y + info.offset.y };
    setPos(newPos);
    localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(newPos));
    setTimeout(() => setIsDragging(false), 100);
  }, [pos]);

  return (
    <>
      {/* Full-screen drag constraint layer */}
      <div ref={constraintsRef} style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none', zIndex: 998,
      }} />

      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.08}
        dragConstraints={constraintsRef}
        initial={{ x: pos.x, y: pos.y }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.04, boxShadow: isDark
          ? '0 20px 60px rgba(0,0,0,0.6)'
          : '0 20px 50px rgba(0,0,0,0.18)'
        }}
        style={{
          position: 'fixed',
          top: '56px',
          left: '50%',
          translateX: '-50%',
          zIndex: 999,
          cursor: isDragging ? 'grabbing' : 'default',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          background: isDark ? 'rgba(18,18,18,0.92)' : 'rgba(248,246,242,0.94)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${borderColor}`,
          borderRadius: '14px',
          padding: '4px 8px 4px 4px',
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset'
            : '0 8px 28px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.8) inset',
        }}>

          {/* Grip handle */}
          <div
            title="Hold & drag to move navigation"
            style={{
              cursor: 'grab',
              padding: '6px 8px',
              borderRadius: '9px',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              opacity: 0.35,
              transition: 'opacity 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.35'}
          >
            {[0,1,2].map(row => (
              <div key={row} style={{ display: 'flex', gap: '3px' }}>
                {[0,1].map(col => (
                  <div key={col} style={{
                    width: '3px', height: '3px', borderRadius: '50%',
                    background: isDark ? '#fff' : '#111',
                  }} />
                ))}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', background: borderColor, flexShrink: 0, marginRight: '4px' }} />

          {/* Nav links */}
          {NAV_LINKS.filter(link => !(user?.isGuest && link.hideFromGuest)).map(({ to, label }) => (
            <NavLink
              key={`${to}-${label}`}
              to={to}
              onClick={e => isDragging && e.preventDefault()}
              style={({ isActive }) => ({
                fontSize: '12px',
                fontWeight: isActive ? 600 : 400,
                fontFamily: 'var(--font-sans)',
                color: isActive
                  ? (isDark ? '#EDEDED' : 'var(--color-accent)')
                  : (isDark ? '#71717A' : '#6B6B6B'),
                textDecoration: 'none',
                padding: '6px 11px',
                borderRadius: '9px',
                background: isActive
                  ? (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(30,92,58,0.06)')
                  : 'transparent',
                transition: 'all 180ms',
                whiteSpace: 'nowrap',
                display: 'block',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </motion.div>
    </>
  );
};

/* ── Slim nav — 6 primary links ───────────────────────────── */
const NAV_LINKS = [
  { to: '/overview',    label: 'Today' },
  { to: '/habits',      label: 'Habits' },
  { to: '/goals',       label: 'Goals' },
  { to: '/journal',     label: 'Journal' },
  { to: '/finance',     label: 'Finance' },
  { to: '/calendar',    label: 'Calendar' },
  { to: '/placements',  label: 'Placement' },
  { to: '/sports',      label: 'Sports', hideFromGuest: true },
  { to: '/discipline',  label: 'Discipline', hideFromGuest: true },
  { to: '/focus',       label: 'Focus' },
];

const Navbar = ({ user }) => {
  const { notifications, unreadCount, loading, fetchAll, markRead, markAllRead, dismiss } = useNotifications();
  const { theme, toggleTheme } = useThemeContext();
  const [notifOpen, setNotifOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const bellRef = useRef(null);

  const userInitial = user?.isGuest ? 'G' : (user?.username?.charAt(0) || user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase();
  const isDark = theme === 'dark';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';

  const handleOpenNotif = () => {
    if (!notifOpen) fetchAll();
    setNotifOpen(o => !o);
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 'var(--nav-height)',
        background: isDark ? 'rgba(10,10,10,0.85)' : 'rgba(240,237,232,0.85)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        zIndex: 1000,
      }}>

        {/* LEFT: Brand */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/identity" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Logo size={28} />
            </Link>
            <Link to="/overview" aria-label="AIIMIN today" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <span style={{
                fontSize: '25px',
                fontWeight: 400,
                letterSpacing: '-0.065em',
                color: isDark ? '#F2EBDA' : '#1f201d',
                fontFamily: 'var(--font-serif)',
                lineHeight: 1,
              }}>
                AIIMIN
              </span>
            </Link>
          </div>
        </div>

        {/* CENTER: intentionally empty — nav links are in the draggable FloatingNav below */}
        <div />

        {/* RIGHT: Actions */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Light mode' : 'Dark mode'}
            style={{
              width: '28px', height: '28px', borderRadius: '6px', background: 'transparent',
              border: `1px solid ${borderColor}`,
              color: isDark ? '#71717A' : '#6B6B6B', fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {isDark ? '☀' : '◑'}
          </button>

          {/* Notifications */}
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
              width: '28px', height: '28px', borderRadius: '50%', background: '#23503B',
              border: 'none', color: '#fff', font: '600 11px var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Account"
          >
            {userInitial}
          </button>
        </div>
      </nav>

      {showAccount && (
        <AccountModal isOpen={showAccount} onClose={() => setShowAccount(false)} />
      )}

      {/* Draggable floating nav pill */}
      <FloatingNav user={user} isDark={isDark} />
    </>
  );
};

/* ── Notification dropdown ─────────────────────────────────── */
const typeIcon = (type) => ({
  drift_alert: '📉', commitment_miss: '🎯', weekly_summary: '📊',
  integration_error: '⚠️', streak_milestone: '🔥', xp_level_up: '⚡',
  weekly_summary_ready: '📊', goal_progress: '🎯',
}[type] || '💬');

const timeAgo = (iso) => {
  if (!iso) return '';
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

  const bg = isDark ? '#161616' : '#fff';
  const border = isDark ? '#2a2a2a' : '#e5e7eb';
  const text1 = isDark ? '#ededed' : '#111';
  const text2 = isDark ? '#a1a1aa' : '#6b7280';
  const text3 = isDark ? '#52525b' : '#9ca3af';

  return (
    <div ref={ref} style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
      width: '300px', maxHeight: '400px',
      background: bg, border: `1px solid ${border}`,
      borderRadius: '10px',
      boxShadow: isDark ? '0 16px 48px rgba(0,0,0,0.7)' : '0 8px 24px rgba(0,0,0,0.12)',
      zIndex: 9999, overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: `1px solid ${border}`, flexShrink: 0,
      }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: text1, fontFamily: 'var(--font-sans)' }}>Notifications</span>
        {notifications.some(n => !n.read_at) && (
          <button onClick={onMarkAllRead} style={{
            background: 'none', border: 'none', fontSize: '11px', color: '#22C55E',
            cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500,
          }}>Mark all read</button>
        )}
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {loading && (
          <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: text3, fontFamily: 'var(--font-sans)' }}>Loading…</div>
        )}
        {!loading && notifications.length === 0 && (
          <div style={{ padding: '28px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', marginBottom: '8px' }}>🔔</div>
            <div style={{ fontSize: '12px', color: text2, fontFamily: 'var(--font-sans)' }}>All clear</div>
          </div>
        )}
        {!loading && notifications.map(n => (
          <div key={n.id} style={{
            padding: '10px 14px', borderBottom: `1px solid ${border}`,
            display: 'flex', gap: '10px', alignItems: 'flex-start',
            background: !n.read_at ? (isDark ? 'rgba(34,197,94,0.04)' : 'rgba(34,197,94,0.04)') : 'transparent',
          }}>
            <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>{typeIcon(n.type)}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: n.read_at ? 400 : 600, color: text1, fontFamily: 'var(--font-sans)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {n.title}
              </div>
              {n.body && <div style={{ fontSize: '11px', color: text2, fontFamily: 'var(--font-sans)', lineHeight: 1.4 }}>{n.body}</div>}
              <div style={{ fontSize: '10px', color: text3, marginTop: '3px', fontFamily: 'var(--font-sans)' }}>{timeAgo(n.created_at)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
              {!n.read_at && <button onClick={() => onMarkRead(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22C55E', fontSize: '11px' }}>✓</button>}
              <button onClick={() => onDismiss(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: text3, fontSize: '11px' }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
