import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { useThemeContext } from '../context/ThemeContext';
import NotificationBell from './notifications/NotificationBell';
import NotificationPanel from './notifications/NotificationPanel';
import AccountModal from './account/AccountModal';
import LabMegaMenu from './lab/LabMegaMenu';
import useLabSummary from '../hooks/useLabSummary';

const NAV_LINKS = [
  { to: '/overview',    label: 'Today' },
  { to: '/insights',   label: 'Skills' },
  { to: '/calendar',   label: 'Calendar' },
  { to: '/finance',    label: 'Finance' },
  { to: '/lab',        label: 'Journal' },
  { to: '/reports',    label: 'Sports' },
  { to: '/placements', label: 'Placement' },
  { to: '/insights',   label: 'Insights', skip: true },
  { to: '/reports',    label: 'Reports' },
  { to: '/lab',        label: 'Lab', hasNew: true },
];

const MAIN_NAV = [
  { to: '/overview',    label: 'Today' },
  { to: '/insights',   label: 'Skills' },
  { to: '/calendar',   label: 'Calendar' },
  { to: '/finance',    label: 'Finance' },
  { to: '/lab',        label: 'Journal' },
  { to: '/reports',    label: 'Sports' },
  { to: '/placements', label: 'Placement' },
  { to: '/insights',   label: 'Insights' },
  { to: '/reports',    label: 'Reports' },
  { to: '/lab',        label: 'Lab', hasNew: true },
];

const Navbar = ({ user }) => {
  const { notifications, unreadCount, loading, fetchAll, markRead, markAllRead, dismiss } = useNotifications();
  const { theme, toggleTheme } = useThemeContext();
  const [notifOpen, setNotifOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [labMenuOpen, setLabMenuOpen] = useState(false);
  const { data: labData } = useLabSummary();

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'A';

  const handleOpenNotif = () => {
    if (!notifOpen) fetchAll();
    setNotifOpen(o => !o);
  };

  const isDark = theme === 'dark';

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-height)',
        background: isDark ? 'rgba(10,10,10,0.92)' : 'rgba(240,237,232,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--content-pad)',
        gap: '0',
        zIndex: 1000,
      }}>

        {/* LEFT: Brand */}
        <Link to="/overview" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', marginRight: '24px' }}>
          <div style={{
            width: '26px', height: '26px',
            background: '#23503B',
            borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M9 2.5 L3.5 14.5 L5.5 14.5 L6.8 11.2 L11.2 11.2 L12.5 14.5 L14.5 14.5 Z" fill="white" fillOpacity="0.95" />
              <path d="M7.5 9.5 L9 6 L10.5 9.5 Z" fill="#23503B" />
            </svg>
          </div>
          <span style={{
            fontSize: '15px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            fontStyle: 'italic',
            color: isDark ? '#EDEDED' : '#1A1A1A',
            fontFamily: 'var(--font-sans)',
          }}>
            AIIMIN
          </span>
        </Link>

        {/* CENTER: Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, overflowX: 'auto' }}>
          {[
            { to: '/overview',    label: 'Today' },
            { to: '/insights',   label: 'Skills' },
            { to: '/calendar',   label: 'Calendar' },
            { to: '/finance',    label: 'Finance' },
            { to: '/lab',        label: 'Journal' },
            { to: '/reports',    label: 'Sports' },
            { to: '/placements', label: 'Placement' },
            { to: '/insights',   label: 'Insights' },
            { to: '/reports',    label: 'Reports' },
            { to: '/lab',        label: 'Lab', hasNew: true },
          ].map(({ to, label, hasNew }) => (
            <div
              key={`${to}-${label}`}
              onMouseEnter={() => label === 'Lab' && setLabMenuOpen(true)}
              onMouseLeave={() => label === 'Lab' && setLabMenuOpen(false)}
              style={{ position: 'relative' }}
            >
              <NavLink
                to={to}
                style={({ isActive }) => ({
                  fontSize: '13px',
                  fontWeight: isActive ? 500 : 400,
                  fontFamily: 'var(--font-sans)',
                  color: isActive
                    ? (isDark ? '#EDEDED' : '#1A1A1A')
                    : (isDark ? '#71717A' : '#6B6B6B'),
                  textDecoration: 'none',
                  padding: '5px 10px',
                  borderRadius: 'var(--r-md)',
                  background: isActive
                    ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')
                    : 'transparent',
                  border: '1px solid',
                  borderColor: isActive
                    ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')
                    : 'transparent',
                  transition: 'all var(--dur-enter) var(--ease)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                })}
              >
                {label}
                {hasNew && (
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 600,
                    padding: '1px 5px',
                    borderRadius: 'var(--r-pill)',
                    background: isDark ? '#22C55E' : '#1E5C3A',
                    color: '#fff',
                    letterSpacing: '0.04em',
                    fontFamily: 'var(--font-sans)',
                  }}>NEW</span>
                )}
              </NavLink>

              {label === 'Lab' && labMenuOpen && (
                <div onMouseEnter={() => setLabMenuOpen(true)}>
                  <LabMegaMenu summary={labData} onClose={() => setLabMenuOpen(false)} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT: Theme + Notifications + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              width: '30px', height: '30px',
              borderRadius: 'var(--r-md)',
              background: 'transparent',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              color: isDark ? '#A1A1AA' : '#6B6B6B',
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all var(--dur-enter) var(--ease)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
              e.currentTarget.style.color = isDark ? '#EDEDED' : '#1A1A1A';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = isDark ? '#A1A1AA' : '#6B6B6B';
            }}
          >
            {isDark ? '☀' : '◑'}
          </button>

          <NotificationBell unreadCount={unreadCount} onClick={handleOpenNotif} />

          {/* Avatar */}
          <button
            onClick={() => setShowAccount(true)}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: '#23503B',
              border: 'none',
              color: '#fff',
              font: '600 12px var(--font-sans)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--dur-enter) var(--ease)',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            aria-label="Account settings"
          >
            {userInitial}
          </button>
        </div>
      </nav>

      <NotificationPanel
        open={notifOpen}
        notifications={notifications}
        loading={loading}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
        onDismiss={dismiss}
        onClose={() => setNotifOpen(false)}
      />

      {showAccount && (
        <AccountModal user={user} onClose={() => setShowAccount(false)} />
      )}
    </>
  );
};

export default Navbar;
