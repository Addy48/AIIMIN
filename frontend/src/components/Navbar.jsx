import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, Sun, Moon, ChevronDown, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from './notifications/NotificationBell';
import BrandLockup from './brand/BrandLockup';
import { isDarkTheme } from '../constants/themes';
import useNavPreferences from '../hooks/useNavPreferences';

const mastheadLinkClass = ({ isActive }) =>
  `nav-masthead__link${isActive ? ' nav-masthead__link--active' : ''}`;

const Navbar = ({ user }) => {
  const { notifications, unreadCount, loading, fetchAll, markRead, markAllRead, dismiss } = useNotifications();
  const { theme, toggleTheme } = useThemeContext();
  const { signOut } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const bellRef = useRef(null);
  const drawerRef = useRef(null);
  const menuToggleRef = useRef(null);
  const moreRef = useRef(null);
  const location = useLocation();
  const isDark = isDarkTheme(theme);
  const { resolveForUser } = useNavPreferences();
  const { pinned: visiblePrimary, more: visibleMore } = resolveForUser(!!user?.isGuest);
  const visibleAll = [...visiblePrimary, ...visibleMore];
  const moreIsActive = visibleMore.some((link) => location.pathname.startsWith(link.to));

  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!moreOpen) return undefined;
    const handle = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [moreOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const getFocusable = () => {
      if (!drawerRef.current) return [];
      return Array.from(
        drawerRef.current.querySelectorAll('a[href], button:not([disabled])'),
      ).filter((el) => el.offsetParent !== null);
    };

    const focusable = getFocusable();
    focusable[0]?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuToggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const toggleEl = menuToggleRef.current;
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      toggleEl?.focus();
    };
  }, [mobileMenuOpen]);

  const handleOpenNotif = () => {
    if (!notifOpen) fetchAll();
    setNotifOpen((o) => !o);
  };

  return (
    <>
      <nav className="nav-masthead" aria-label="Main">
        <div className="nav-masthead__brand">
          <BrandLockup />
        </div>

        <div className="nav-masthead__center">
          <div className="desktop-nav-links nav-masthead__links">
            <div className="nav-masthead__links-scroll">
              {visiblePrimary.map(({ to, label }) => (
                <NavLink key={to} to={to} className={mastheadLinkClass}>
                  {label}
                </NavLink>
              ))}
            </div>
            {visibleMore.length > 0 && (
              <div className="nav-masthead__more-wrap" ref={moreRef}>
                <button
                  type="button"
                  className={`nav-masthead__link nav-masthead__more-btn${moreOpen || moreIsActive ? ' nav-masthead__link--active' : ''}`}
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  onClick={() => setMoreOpen((o) => !o)}
                >
                  More
                  <ChevronDown
                    size={14}
                    className={`nav-masthead__more-chevron${moreOpen ? ' is-open' : ''}`}
                    aria-hidden
                  />
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      className="nav-masthead__more-panel"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                      role="menu"
                    >
                      {visibleMore.map(({ to, label }) => (
                        <NavLink
                          key={to}
                          to={to}
                          className={mastheadLinkClass}
                          role="menuitem"
                          onClick={() => setMoreOpen(false)}
                        >
                          {label}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <div className="nav-masthead__actions">
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="nav-masthead__icon-btn"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

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
              />
            )}
          </div>

          <Link
            to="/account"
            className="nav-masthead__avatar"
            aria-label="Account"
          >
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </Link>

          <button
            ref={menuToggleRef}
            type="button"
            className="mobile-menu-btn nav-masthead__icon-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="nav-mobile-drawer"
          >
            {visibleAll.map(({ to, label }) => (
              <NavLink
                key={`${to}-mobile`}
                to={to}
                className={({ isActive }) =>
                  `nav-mobile-drawer__link${isActive ? ' nav-mobile-drawer__link--active' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="nav-mobile-drawer__footer">
              <button
                type="button"
                onClick={async () => {
                  setMobileMenuOpen(false);
                  await signOut();
                }}
                className="nav-mobile-drawer__signout"
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

const NotifDropdown = ({ notifications, loading, onMarkRead, onMarkAllRead, onDismiss, onClose }) => {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  return (
    <div ref={ref} className="nav-notif-dropdown">
      <div className="nav-notif-dropdown__head">
        <span className="nav-notif-dropdown__title">Notifications</span>
        {notifications.some((n) => !n.read_at) && (
          <button type="button" onClick={onMarkAllRead} className="nav-notif-dropdown__mark-all">
            Mark all read
          </button>
        )}
      </div>
      <div className="nav-notif-dropdown__list">
        {loading && (
          <div className="nav-notif-dropdown__empty">Loading…</div>
        )}
        {!loading && notifications.length === 0 && (
          <div className="nav-notif-dropdown__empty">
            <Bell size={20} style={{ marginBottom: 8, opacity: 0.5 }} />
            <div>All clear</div>
          </div>
        )}
        {!loading && notifications.map((n) => (
          <div
            key={n.id}
            className={`nav-notif-dropdown__item${!n.read_at ? ' is-unread' : ''}`}
            onClick={(e) => {
              if (n.action_url && !e.defaultPrevented) {
                if (!n.read_at) onMarkRead(n.id);
                navigate(n.action_url);
                onClose();
              }
            }}
            onKeyDown={() => {}}
            role={n.action_url ? 'button' : undefined}
            tabIndex={n.action_url ? 0 : undefined}
          >
            <span className="nav-notif-dropdown__icon">{typeIcon(n.type)}</span>
            <div className="nav-notif-dropdown__body">
              <div className="nav-notif-dropdown__item-title">{n.title}</div>
              {n.body && <div className="nav-notif-dropdown__item-body">{n.body}</div>}
              <div className="nav-notif-dropdown__time">{timeAgo(n.created_at)}</div>
            </div>
            <div className="nav-notif-dropdown__actions">
              {!n.read_at && (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMarkRead(n.id); }}
                  className="nav-notif-dropdown__read"
                  aria-label="Mark notification as read"
                >
                  ✓
                </button>
              )}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDismiss(n.id); }}
                className="nav-notif-dropdown__dismiss"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
