import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
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
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--content-pad)',
        gap: '24px',
        zIndex: 1000,
      }}>

        {/* LEFT: Brand */}
        <Link to="/overview" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            font: 'var(--text-heading)',
            color: 'var(--color-text-1)',
            letterSpacing: '0.12em',
            fontFamily: 'var(--font-mono)',
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
                font: 'var(--text-body)',
                color: isActive ? 'var(--color-text-1)' : 'var(--color-text-2)',
                textDecoration: 'none',
                padding: '6px 12px',
                borderBottom: isActive ? '1px solid var(--color-accent)' : '1px solid transparent',
                transition: `color var(--dur-enter) var(--ease), border-color var(--dur-enter) var(--ease)`,
              })}
              onMouseEnter={e => { if (!e.currentTarget.className.includes('active')) e.currentTarget.style.color = 'var(--color-text-1)'; }}
              onMouseLeave={e => { if (!e.currentTarget.getAttribute('aria-current')) e.currentTarget.style.color = 'var(--color-text-2)'; }}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* RIGHT: Date + Notifications + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <span className="text-label" style={{ letterSpacing: '0.05em' }}>{dateStr}</span>

          <NotificationBell
            unreadCount={unreadCount}
            onClick={handleOpenNotif}
          />

          <button
            onClick={() => setShowAccount(true)}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--color-elevated)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-2)',
              font: '500 11px var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Account settings"
          >
            {userInitial}
          </button>
        </div>
      </nav>

      {/* Notifications panel */}
      <NotificationPanel
        open={notifOpen}
        notifications={notifications}
        loading={loading}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
        onDismiss={dismiss}
        onClose={() => setNotifOpen(false)}
      />

      {/* Account modal */}
      {showAccount && (
        <AccountModal user={user} onClose={() => setShowAccount(false)} />
      )}
    </>
  );
};

export default Navbar;
