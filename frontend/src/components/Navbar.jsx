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

const Navbar = ({ user }) => {
  const { notifications, unreadCount, loading, fetchAll, markRead, markAllRead, dismiss } = useNotifications();
  const { theme, toggleTheme } = useThemeContext();
  const [notifOpen, setNotifOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'A';
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  const handleOpenNotif = () => {
    if (!notifOpen) fetchAll();
    setNotifOpen(o => !o);
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-height)',
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--content-pad)',
        gap: '24px',
        zIndex: 1000,
      }}>

        {/* LEFT: Brand */}
        <Link to="/overview" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            font: '500 15px/1 var(--font-mono)',
            color: 'var(--color-text-1)',
            letterSpacing: '0.14em',
          }}>
            AIIMIN
          </span>
        </Link>

        {/* CENTER: Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                fontSize: '13px',
                fontWeight: isActive ? 500 : 300,
                fontFamily: 'var(--font-sans)',
                color: isActive ? 'var(--color-text-1)' : 'var(--color-text-2)',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--r-sm)',
                background: isActive ? 'var(--color-surface)' : 'transparent',
                border: isActive ? '1px solid var(--color-border)' : '1px solid transparent',
                transition: `all var(--dur-enter) var(--ease)`,
                position: 'relative',
              })}
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <span style={{
                      position: 'absolute',
                      bottom: '-1px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '16px',
                      height: '2px',
                      background: 'var(--color-accent)',
                      borderRadius: 'var(--r-pill)',
                    }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* RIGHT: Date + Notifications + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <span style={{
            font: '400 11px/1 var(--font-mono)',
            color: 'var(--color-text-3)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            {dateStr}
          </span>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              width: '30px', height: '30px',
              borderRadius: 'var(--r-sm)',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--color-text-2)',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: `all var(--dur-enter) var(--ease)`,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--glass-border-lit)'; e.currentTarget.style.color = 'var(--color-text-1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--color-text-2)'; }}
          >
            {theme === 'dark' ? '☀' : '◐'}
          </button>

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

          <button
            onClick={() => setShowAccount(true)}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border-lit)',
              color: 'var(--color-accent)',
              font: '500 12px var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: `all var(--dur-enter) var(--ease)`,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-bg-hover)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--glass-bg)'; e.currentTarget.style.borderColor = 'var(--glass-border-lit)'; }}
            aria-label="Account settings"
          >
            {userInitial}
          </button>
        </div>
      </nav>

      {showAccount && (
        <AccountModal user={user} isOpen={showAccount} onClose={() => setShowAccount(false)} />
      )}
    </>
  );
};

export default Navbar;
