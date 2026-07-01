import React, { useState, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from './notifications/NotificationBell';
import Logo from './Logo';

const SystemStatusIndicator = () => {
  const { isSignedIn } = useAuth();
  const [status, setStatus] = useState('checking');

  React.useEffect(() => {
    let mounted = true;
    const checkHealth = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || '/api'}/health`, { method: 'GET' });
        if (mounted) setStatus(res.ok ? 'online' : 'error');
      } catch {
        // backend down — if signed in, still show online for the app shell
        if (mounted) setStatus(isSignedIn ? 'online' : 'error');
      }
    };
    checkHealth();
    const int = setInterval(checkHealth, 30000);
    return () => { mounted = false; clearInterval(int); };
  }, [isSignedIn]);

  const color = status === 'online' ? '#10B981' : status === 'error' ? '#EF4444' : '#F59E0B';
  const text = status === 'online' ? 'OS Online' : status === 'error' ? 'System Error' : 'Checking...';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '6px 12px', background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--color-border)', borderRadius: '20px',
      cursor: 'default'
    }} title={text}>
      <div style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: color, boxShadow: `0 0 8px ${color}`,
        animation: status === 'online' ? 'pulse 2s infinite' : 'none'
      }} />
      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-2)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
        {text}
      </span>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};



/* ── Slim nav — 6 primary links ───────────────────────────── */
const NAV_LINKS = [
  { to: '/overview',    label: 'Today' },
  { to: '/habits',      label: 'Habits' },
  { to: '/goals',       label: 'Goals' },
  { to: '/journal',     label: 'Journal' },
  { to: '/finance',     label: 'Finance' },
  { to: '/family',      label: 'Family' },
  { to: '/calendar',    label: 'Calendar' },
  { to: '/placements',  label: 'Placement' },
  { to: '/sports',      label: 'Sports', hideFromGuest: true },
  { to: '/discipline',  label: 'Discipline', hideFromGuest: true },
  { to: '/focus',       label: 'Focus' },
  { to: '/lab',         label: 'Lab' },
];

const Navbar = ({ user }) => {
  const { notifications, unreadCount, loading, fetchAll, markRead, markAllRead, dismiss } = useNotifications();
  const { theme, toggleTheme } = useThemeContext();
  const { signOut } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const bellRef = useRef(null);
  const location = useLocation();

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const userInitial = (user?.full_name?.charAt(0) || user?.username?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase();
  const isDark = theme === 'vercel' || theme === 'midnight';
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
        background: 'color-mix(in srgb, var(--color-base) 85%, transparent)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        zIndex: 1000,
      }}>

        {/* LEFT: Brand */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/identity" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Logo size={36} />
            </Link>
            <Link to="/overview" aria-label="AIIMIN today" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <span style={{
                fontSize: '28px',
                fontWeight: 600,
                letterSpacing: '-0.065em',
                color: 'var(--color-text-1)',
                fontFamily: 'var(--font-serif)',
                lineHeight: 1,
              }}>
                AIIMIN
              </span>
            </Link>
          </div>
        </div>

        {/* CENTER: Nav links (Desktop) */}
        <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {NAV_LINKS.filter(link => !(user?.isGuest && link.hideFromGuest)).map(({ to, label }) => (
            <NavLink
              key={`${to}-${label}`}
              to={to}
              style={({ isActive }) => ({
                fontSize: '16px',
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'var(--font-sans)',
                color: isActive ? 'var(--color-text-1)' : 'var(--color-text-2)',
                textDecoration: 'none',
                padding: '10px 16px',
                borderRadius: '10px',
                background: isActive ? 'var(--color-elevated)' : 'transparent',
                transition: 'all 180ms',
                whiteSpace: 'nowrap',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* RIGHT: Actions */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>

          <SystemStatusIndicator />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Light mode' : 'Dark mode'}
            style={{
              width: '36px', height: '36px', borderRadius: '8px', background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-2)', fontSize: '16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {isDark ? '☀' : '◑'}
          </button>

          {/* Notifications */}
          <div ref={bellRef} style={{ position: 'relative' }}>
            <NotificationBell count={unreadCount} onOpen={handleOpenNotif} isOpen={notifOpen} />
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
          <Link
            to="/account"
            style={{
              width: '36px', height: '36px', borderRadius: '50%', background: '#23503B',
              border: 'none', color: '#fff', font: '700 14px var(--font-sans)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none'
            }}
            aria-label="Account"
          >
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              width: '36px', height: '36px', borderRadius: '8px', background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-1)', cursor: 'pointer',
              display: 'none', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 'var(--nav-height)',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'var(--color-base)',
              zIndex: 999,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            {NAV_LINKS.filter(link => !(user?.isGuest && link.hideFromGuest)).map(({ to, label }) => (
              <NavLink
                key={`${to}-${label}-mobile`}
                to={to}
                style={({ isActive }) => ({
                  fontSize: '18px',
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: 'var(--font-sans)',
                  color: isActive ? 'var(--color-text-1)' : 'var(--color-text-2)',
                  textDecoration: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  background: isActive ? 'var(--color-elevated)' : 'transparent',
                  border: isActive ? '1px solid var(--color-border-lit)' : '1px solid transparent',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                })}
              >
                {label}
              </NavLink>
            ))}
            
            <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
               <button
                 onClick={async () => {
                   setMobileMenuOpen(false);
                   await signOut();
                 }}
                 style={{
                   width: '100%',
                   padding: '16px',
                   borderRadius: '12px',
                   background: 'rgba(239, 68, 68, 0.1)',
                   color: 'var(--color-danger, #ef4444)',
                   border: '1px solid rgba(239, 68, 68, 0.2)',
                   fontWeight: '600',
                   fontSize: '16px',
                   cursor: 'pointer'
                 }}
               >
                 Sign Out
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
  const navigate = useNavigate();

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
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: '10px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      zIndex: 9999, overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--color-border)', flexShrink: 0,
      }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-1)', fontFamily: 'var(--font-sans)' }}>Notifications</span>
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
          <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--color-text-3)', fontFamily: 'var(--font-sans)' }}>Loading…</div>
        )}
        {!loading && notifications.length === 0 && (
          <div style={{ padding: '28px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', marginBottom: '8px' }}>🔔</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-2)', fontFamily: 'var(--font-sans)' }}>All clear</div>
          </div>
        )}
        {!loading && notifications.map(n => (
          <div key={n.id} style={{
            padding: '10px 14px', borderBottom: '1px solid var(--color-border)',
            display: 'flex', gap: '10px', alignItems: 'flex-start',
            background: !n.read_at ? 'var(--color-accent-dim)' : 'transparent',
            cursor: n.action_url ? 'pointer' : 'default',
          }} onClick={(e) => {
              if (n.action_url && !e.defaultPrevented) {
                if (!n.read_at) onMarkRead(n.id);
                navigate(n.action_url);
                onClose();
              }
          }}>
            <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>{typeIcon(n.type)}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: n.read_at ? 400 : 600, color: 'var(--color-text-1)', fontFamily: 'var(--font-sans)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {n.title}
              </div>
              {n.body && <div style={{ fontSize: '11px', color: 'var(--color-text-2)', fontFamily: 'var(--font-sans)', lineHeight: 1.4 }}>{n.body}</div>}
              <div style={{ fontSize: '10px', color: 'var(--color-text-3)', marginTop: '3px', fontFamily: 'var(--font-sans)' }}>{timeAgo(n.created_at)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
              {!n.read_at && <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMarkRead(n.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22C55E', fontSize: '11px' }}>✓</button>}
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDismiss(n.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-3)', fontSize: '11px' }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
