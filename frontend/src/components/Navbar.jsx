import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { useThemeContext } from '../context/ThemeContext';
import NotificationBell from './notifications/NotificationBell';
import NotificationPanel from './notifications/NotificationPanel';
import AccountModal from './account/AccountModal';

const NAV_LINKS = [
  { to: '/overview',  label: 'Today' },
  { to: '/insights',  label: 'Insights' },
  { to: '/calendar',  label: 'Calendar' },
  { to: '/finance',   label: 'Finance' },
  { to: '/reports',   label: 'Reports' },
  { to: '/settings',  label: 'Settings' },
];

/* Forest-leaf logo mark */
const LogoMark = () => (
  <div style={{
    width: '30px',
    height: '30px',
    background: 'var(--color-accent)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5C5.5 1.5 3 3.5 3 7C3 10 5.5 13 8 14.5C10.5 13 13 10 13 7C13 3.5 10.5 1.5 8 1.5Z"
        fill="white"
        fillOpacity="0.95"
      />
      <line x1="8" y1="8" x2="8" y2="14.5" stroke="white" strokeWidth="1.2" strokeOpacity="0.5" />
    </svg>
  </div>
);

const Navbar = ({ user }) => {
  const { notifications, unreadCount, loading, fetchAll, markRead, markAllRead, dismiss } = useNotifications();
  const { theme, toggleTheme } = useThemeContext();
  const [notifOpen, setNotifOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'A';
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  const handleOpenNotif = () => {
    if (!notifOpen) fetchAll();
    setNotifOpen(o => !o);
  };

  return (
    <>
      {/* Fixed outer wrapper — provides top gap */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '12px var(--content-pad)',
        pointerEvents: 'none',
      }}>
        <nav style={{
          maxWidth: 'var(--content-max)',
          margin: '0 auto',
          height: '52px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)',
          pointerEvents: 'all',
        }}>

          {/* LEFT: Logo */}
          <Link to="/overview" style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
            marginRight: '8px',
          }}>
            <LogoMark />
            <span style={{
              font: '400 14px/1 var(--font-sans)',
              color: 'var(--color-text-1)',
              letterSpacing: '-0.01em',
            }}>
              aiimin
            </span>
          </Link>

          {/* Separator */}
          <div style={{
            width: '1px',
            height: '18px',
            background: 'var(--color-border)',
            marginRight: '8px',
            flexShrink: 0,
          }} />

          {/* CENTER: Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => isActive ? 'nc-nav-link nc-nav-link--active' : 'nc-nav-link'}
              >
                {label}
              </NavLink>
            ))}
          </div>
          <style>{`
            .nc-nav-link {
              font-size: 13px;
              font-weight: 400;
              font-family: var(--font-sans);
              color: var(--color-text-2);
              text-decoration: none;
              padding: 6px 12px;
              border-radius: 9px;
              background: transparent;
              border: 1px solid transparent;
              transition: all var(--dur-enter) var(--ease);
              white-space: nowrap;
            }
            .nc-nav-link:hover {
              color: var(--color-text-1);
              background: var(--color-elevated);
              border-color: var(--color-border);
            }
            .nc-nav-link--active {
              font-weight: 500;
              color: var(--color-text-1);
              background: var(--color-elevated);
              border-color: var(--color-border);
            }
          `}</style>

          {/* RIGHT: Date + controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <span style={{
              font: '400 11px/1 var(--font-mono)',
              color: 'var(--color-text-3)',
              letterSpacing: '0.03em',
              whiteSpace: 'nowrap',
            }}>
              {dateStr}
            </span>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-2)',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--dur-enter) var(--ease)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-border-lit)'; e.currentTarget.style.color = 'var(--color-text-1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-2)'; }}
            >
              {theme === 'dark' ? '☀' : '◐'}
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <NotificationBell unreadCount={unreadCount} onClick={handleOpenNotif} />
              {notifOpen && (
                <NotificationPanel
                  notifications={notifications}
                  loading={loading}
                  onMarkRead={markRead}
                  onMarkAllRead={markAllRead}
                  onDismiss={dismiss}
                  onClose={() => setNotifOpen(false)}
                />
              )}
            </div>

            {/* Avatar */}
            <button
              onClick={() => setShowAccount(true)}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'var(--color-accent)',
                border: 'none',
                color: '#fff',
                font: '500 12px/1 var(--font-sans)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity var(--dur-enter) var(--ease)',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              aria-label="Account"
            >
              {userInitial}
            </button>
          </div>
        </nav>
      </div>

      {showAccount && (
        <AccountModal user={user} isOpen={showAccount} onClose={() => setShowAccount(false)} />
      )}
    </>
  );
};

export default Navbar;
