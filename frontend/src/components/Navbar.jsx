import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { useThemeContext } from '../context/ThemeContext';
import NotificationBell from './notifications/NotificationBell';
import NotificationPanel from './notifications/NotificationPanel';
import AccountModal from './account/AccountModal';

const NAV_LINKS = [
  { to: '/overview', label: 'Today' },
  { to: '/insights', label: 'Insights' },
  { to: '/skills', label: 'Skills' },
  { to: '/growth', label: 'Growth' },
  { to: '/finance', label: 'Finance' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
];

/* Amber A-mark logo — matches reference design */
const LogoMark = () => (
  <div style={{
    width: '32px',
    height: '32px',
    background: 'var(--color-logo-bg)',   /* #B97A4A amber */
    borderRadius: '9px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }}>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      {/* Stylised A with leaf arch */}
      <path
        d="M9 2.5 L3.5 14.5 L5.5 14.5 L6.8 11.2 L11.2 11.2 L12.5 14.5 L14.5 14.5 Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M7.5 9.5 L9 6 L10.5 9.5 Z"
        fill="var(--color-logo-bg)"
      />
      {/* Small leaf on top of A */}
      <path
        d="M9 1.5 C9 1.5 11 3 9 5 C7 3 9 1.5 9 1.5Z"
        fill="white"
        fillOpacity="0.85"
      />
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
              padding: 6px 14px;
              border-radius: 9px;
              background: transparent;
              border: none;
              transition: all var(--dur-enter) var(--ease);
              white-space: nowrap;
            }
            .nc-nav-link:hover {
              color: var(--color-text-1);
              background: var(--color-elevated);
            }
            .nc-nav-link--active {
              font-weight: 500;
              color: #fff !important;
              background: var(--color-accent) !important;
              border-radius: 9px;
            }
            [data-theme="dark"] .nc-nav-link--active {
              color: #fff !important;
              background: var(--color-accent) !important;
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
