import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { useThemeContext } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, Sun, Moon, ChevronDown, ChevronRight, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from './notifications/NotificationBell';
import BrandLockup from './brand/BrandLockup';
import { isDarkTheme } from '../constants/themes';
import useNavPreferences from '../hooks/useNavPreferences';
import { useDeviceTier } from '../hooks/useDeviceTier';

const TABLET_NAV_CAP = 8;

const isUrgentNotification = (notification) => (
  ['commitment_miss', 'drift_alert', 'integration_error'].includes(notification?.type)
  || /urgent|overdue|due|renewal|expir/i.test(`${notification?.title || ''} ${notification?.body || ''}`)
);

const notificationActionLabel = (notification) => {
  if (notification?.action_label) return notification.action_label;
  if (notification?.type === 'weekly_report' || notification?.type === 'weekly_summary' || notification?.type === 'weekly_summary_ready') return 'Open report';
  if (notification?.type === 'commitment_miss' || notification?.type === 'drift_alert') return 'Review now';
  return 'Open details';
};

const safeNotificationPath = (actionUrl) => (
  typeof actionUrl === 'string' && actionUrl.startsWith('/') && !actionUrl.startsWith('//') ? actionUrl : '/overview'
);

const mastheadLinkClass = ({ isActive }) =>
  `nav-masthead__link${isActive ? ' nav-masthead__link--active' : ''}`;

const Navbar = ({ user }) => {
  const { notifications, unreadCount, loading, fetchAll, markRead, markAllRead, dismiss } = useNotifications();
  const { theme, toggleTheme } = useThemeContext();
  const { signOut } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [forgeOpen, setForgeOpen] = useState(false);
  const bellRef = useRef(null);
  const drawerRef = useRef(null);
  const menuToggleRef = useRef(null);
  const moreRef = useRef(null);
  const forgeRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isDark = isDarkTheme(theme);
  const { isTablet } = useDeviceTier();
  const { resolveForUser } = useNavPreferences();
  // Pinning restored: user-selected pins stay in primary strip; unpinned actives live in More (N)
  const { pinned: visiblePrimary, more: visibleMore } = resolveForUser(!!user?.isGuest);
  const stripPrimary = isTablet ? visiblePrimary.slice(0, TABLET_NAV_CAP) : visiblePrimary;
  const stripMore = isTablet
    ? [...visiblePrimary.slice(TABLET_NAV_CAP), ...visibleMore]
    : visibleMore;
  const visibleAll = [...visiblePrimary, ...visibleMore];
  const isRouteMatching = (link) => {
    if (link.id === 'forge' || link.children) {
      return location.pathname.startsWith('/lab') || location.pathname.startsWith('/sports') || location.pathname.startsWith('/forge');
    }
    return location.pathname.startsWith(link.to);
  };
  const moreIsActive = stripMore.some(isRouteMatching);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreOpen(false);
    setForgeOpen(false);
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
    if (!forgeOpen) return undefined;
    const handle = (e) => {
      if (forgeRef.current && !forgeRef.current.contains(e.target)) {
        setForgeOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [forgeOpen]);

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
              {stripPrimary.map((item) => {
                if (item.children && item.children.length > 0) {
                  const isForgeActive = location.pathname.startsWith('/lab')
                    || location.pathname.startsWith('/sports')
                    || location.pathname.startsWith('/forge');
                  return (
                    <div
                      key={item.id}
                      className="nav-masthead__flyout-wrap"
                      ref={forgeRef}
                      onMouseLeave={() => setForgeOpen(false)}
                    >
                      <NavLink
                        to={item.to}
                        className={`nav-masthead__link${isForgeActive ? ' nav-masthead__link--active' : ''}`}
                        onClick={() => setForgeOpen((v) => !v)}
                        onMouseEnter={() => setForgeOpen(true)}
                        aria-expanded={forgeOpen}
                        aria-haspopup="true"
                        aria-label="Forge skill and sports sections"
                      >
                        {item.label}
                        <ChevronDown
                          size={13}
                          className={`nav-masthead__more-chevron${forgeOpen ? ' is-open' : ''}`}
                          aria-hidden
                        />
                      </NavLink>
                      <AnimatePresence>
                        {forgeOpen && (
                          <motion.div
                            className="nav-masthead__flyout-panel"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                            role="menu"
                          >
                            <div className="nav-masthead__group-heading">{item.label}</div>
                            {item.children.map((child) => {
                              if (user?.isGuest && child.hideFromGuest) return null;
                              return (
                                <NavLink
                                  key={child.to}
                                  to={child.to}
                                  className={mastheadLinkClass}
                                  role="menuitem"
                                  onClick={() => setForgeOpen(false)}
                                >
                                  {child.label}
                                </NavLink>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <NavLink key={item.to} to={item.to} className={mastheadLinkClass}>
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
            {(stripMore.length > 0 || true) && (
              <div className="nav-masthead__more-wrap" ref={moreRef}>
                <button
                  type="button"
                  className={`nav-masthead__link nav-masthead__more-btn${moreOpen || moreIsActive ? ' nav-masthead__link--active' : ''}`}
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  aria-label={stripMore.length > 0 ? `More navigation sections (${stripMore.length})` : 'More navigation sections'}
                  onClick={() => setMoreOpen((o) => !o)}
                >
                  {stripMore.length > 0 ? `More (${stripMore.length})` : 'More'}
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
                      {stripMore.map((item) => {
                        if (item.children && item.children.length > 0) {
                          return (
                            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <div className="nav-masthead__group-heading">{item.label}</div>
                              {item.children.map((child) => {
                                if (user?.isGuest && child.hideFromGuest) return null;
                                const childActive = location.pathname.startsWith(child.to);
                                return (
                                  <NavLink
                                    key={child.to}
                                    to={child.to}
                                    className={`${mastheadLinkClass({ isActive: childActive })} nav-masthead__sublink`}
                                    role="menuitem"
                                    onClick={() => setMoreOpen(false)}
                                  >
                                    {child.label}
                                  </NavLink>
                                );
                              })}
                            </div>
                          );
                        }
                        return (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            className={mastheadLinkClass}
                            role="menuitem"
                            onClick={() => setMoreOpen(false)}
                          >
                            {item.label}
                            {item.to === '/reports' && (
                              <span
                                style={{
                                  marginLeft: 8,
                                  fontSize: 9,
                                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                                  letterSpacing: '0.06em',
                                  color: 'var(--color-accent)',
                                  border: '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)',
                                  borderRadius: 3,
                                  padding: '1px 5px',
                                }}
                              >
                                INTEL
                              </span>
                            )}
                          </NavLink>
                        );
                      })}
                      <NavLink
                        to="/app"
                        className={mastheadLinkClass}
                        role="menuitem"
                        onClick={() => setMoreOpen(false)}
                      >
                        Android companion
                        <span
                          style={{
                            marginLeft: 8,
                            fontSize: 9,
                            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                            letterSpacing: '0.06em',
                            color: '#10b981',
                            border: '1px solid color-mix(in srgb, #10b981 30%, transparent)',
                            borderRadius: 3,
                            padding: '1px 5px',
                          }}
                        >
                          V2 LIVE
                        </span>
                      </NavLink>
                      <button
                        type="button"
                        role="menuitem"
                        className="nav-masthead__link"
                        style={{ width: '100%', textAlign: 'left', cursor: 'pointer', borderTop: '1px solid var(--color-border)', marginTop: 4, paddingTop: 10 }}
                        onClick={() => {
                          setMoreOpen(false);
                          navigate('/account?section=personalization');
                        }}
                      >
                        Customize navigation…
                      </button>
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
            <NotificationBell count={unreadCount} urgent={notifications.some(isUrgentNotification)} onOpen={handleOpenNotif} isOpen={notifOpen} />
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
            {visibleAll.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <div key={`${item.id}-mobile-group`} className="nav-mobile-drawer__group">
                    <div className="nav-mobile-drawer__group-label">{item.label}</div>
                    {item.children.map((child) => {
                      if (user?.isGuest && child.hideFromGuest) return null;
                      return (
                        <NavLink
                          key={`${child.to}-mobile`}
                          to={child.to}
                          className={({ isActive }) =>
                            `nav-mobile-drawer__link nav-mobile-drawer__sublink${isActive ? ' nav-mobile-drawer__link--active' : ''}`
                          }
                        >
                          {child.label}
                        </NavLink>
                      );
                    })}
                  </div>
                );
              }
              return (
                <NavLink
                  key={`${item.to}-mobile`}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-mobile-drawer__link${isActive ? ' nav-mobile-drawer__link--active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}
            <NavLink
              to="/app"
              className={({ isActive }) =>
                `nav-mobile-drawer__link${isActive ? ' nav-mobile-drawer__link--active' : ''}`
              }
            >
              Android Companion (V2 APK)
            </NavLink>

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

  const openNotification = (notification) => {
    if (!notification?.action_url) return;
    if (!notification.read_at) onMarkRead(notification.id);
    navigate(safeNotificationPath(notification.action_url));
    onClose();
  };

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
            className={`nav-notif-dropdown__item${!n.read_at ? ' is-unread' : ''}${isUrgentNotification(n) ? ' is-urgent' : ''}`}
            onClick={() => openNotification(n)}
            onKeyDown={(event) => {
              if (n.action_url && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                openNotification(n);
              }
            }}
            role={n.action_url ? 'button' : undefined}
            tabIndex={n.action_url ? 0 : undefined}
            aria-label={n.action_url ? `${n.title}. ${notificationActionLabel(n)}` : undefined}
          >
            <span className="nav-notif-dropdown__icon" aria-hidden="true">{typeIcon(n.type)}</span>
            <div className="nav-notif-dropdown__body">
              <div className="nav-notif-dropdown__item-title">{n.title}</div>
              {n.body && <div className="nav-notif-dropdown__item-body">{n.body}</div>}
              <div className="nav-notif-dropdown__time">{timeAgo(n.created_at)}</div>
              {n.action_url && (
                <button
                  type="button"
                  className="nav-notif-dropdown__cta"
                  onClick={(event) => { event.preventDefault(); event.stopPropagation(); openNotification(n); }}
                >
                  {notificationActionLabel(n)} <ChevronRight size={13} aria-hidden="true" />
                </button>
              )}
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
