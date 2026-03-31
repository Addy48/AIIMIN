import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useTheme from '../hooks/useTheme';
import { useNotifications } from '../hooks/useNotifications';
import NotificationBell from './notifications/NotificationBell';
import NotificationPanel from './notifications/NotificationPanel';
import AccountModal from './account/AccountModal';
import LogoContainer from './LogoContainer';

const Navbar = ({ user, activeTab, onTabChange }) => {
    const { theme, toggleTheme } = useTheme();
    const { notifications, unreadCount, loading: notifLoading, fetchAll, markRead, markAllRead, dismiss } = useNotifications();
    const [notifOpen, setNotifOpen] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const tabRefs = useRef({});

    const tabs = [
        { key: 'today', label: 'Today' },
        { key: 'focus', label: 'Focus' },
        { key: 'identity', label: 'Identity' },
        { key: 'growth', label: 'Growth' },
        { key: 'habits', label: 'Habits' },
        { key: 'money', label: 'Money' },
        { key: 'analytics', label: 'Analytics' },
    ];

    const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const handleOpenNotif = () => {
        if (!notifOpen) fetchAll();
        setNotifOpen(o => !o);
    };

    /* ── Active tab underline ── */
    const [indicatorStyle, setIndicatorStyle] = useState({});
    useEffect(() => {
        const el = tabRefs.current[activeTab];
        if (el) {
            const parent = el.parentElement;
            const parentRect = parent.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            setIndicatorStyle({
                width: `${elRect.width - 12}px`,
                left: `${elRect.left - parentRect.left + 6}px`,
            });
        }
    }, [activeTab]);

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       RENDER — Floating pill system status bar
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    return (
        <>
            {/* ── Floating Pill Nav ── */}
            <nav style={{
                position: 'fixed',
                top: '16px',
                left: '16px',
                right: '16px',
                zIndex: 99999,
                maxWidth: '1340px',
                margin: '0 auto',
                height: '52px',
                background: 'var(--nav-bg)',
                backdropFilter: 'blur(24px) saturate(1.6)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
                border: '1px solid var(--nav-border)',
                borderRadius: '26px',
                boxShadow: '0 2px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: '12px',
            }}>

                {/* ── LEFT: Logo + AI Health Orb ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <Link to="/brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <LogoContainer size={26} />
                        <span style={{
                            fontSize: '14px',
                            fontWeight: 800,
                            letterSpacing: '-0.3px',
                            color: 'var(--accent)',
                            fontFamily: "'Jost', sans-serif",
                        }}>AIIMIN</span>
                    </Link>

                    {/* AI Health Orb — slow pulse */}
                    <div
                        className="orb-pulse"
                        title="AI Sync Active"
                        style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: 'var(--accent)',
                            boxShadow: '0 0 6px var(--accent)',
                            flexShrink: 0,
                        }}
                    />

                    {/* Divider */}
                    <div style={{ width: '1px', height: '14px', background: 'var(--border-hover)', opacity: 0.5 }} />

                    {/* Date/Time */}
                    <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
                        {dateStr}
                    </span>
                </div>

                {/* ── CENTER: Navigation Tabs ── */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '2px',
                    position: 'relative',
                    height: '52px',
                }}>
                    {tabs.map(({ key, label }) => (
                        <button
                            key={key}
                            ref={el => tabRefs.current[key] = el}
                            onClick={() => onTabChange(key)}
                            style={{
                                padding: '6px 11px',
                                fontSize: '12.5px',
                                fontWeight: activeTab === key ? 650 : 420,
                                cursor: 'pointer',
                                border: 'none',
                                background: 'transparent',
                                color: activeTab === key ? 'var(--text-1)' : 'var(--text-3)',
                                letterSpacing: '-0.01em',
                                transition: 'color 0.2s ease, font-weight 0.2s ease',
                                position: 'relative',
                                fontFamily: "'Jost', sans-serif",
                            }}
                        >
                            {label}
                        </button>
                    ))}
                    {/* Sliding gold underline */}
                    <div style={{
                        position: 'absolute',
                        bottom: '0',
                        height: '2px',
                        borderRadius: '2px 2px 0 0',
                        background: 'var(--accent)',
                        transition: 'left 0.3s cubic-bezier(0.16,1,0.3,1), width 0.3s cubic-bezier(0.16,1,0.3,1)',
                        ...indicatorStyle,
                    }} />
                </div>

                {/* ── RIGHT: Controls ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

                    {/* Theme toggle pill */}
                    <button
                        onClick={toggleTheme}
                        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                        style={{
                            position: 'relative',
                            width: '44px',
                            height: '24px',
                            borderRadius: '99px',
                            flexShrink: 0,
                            cursor: 'pointer',
                            border: '1px solid var(--border)',
                            padding: 0,
                            background: theme === 'dark'
                                ? 'rgba(212, 175, 55, 0.1)'
                                : 'rgba(202, 138, 4, 0.12)',
                            transition: 'background 0.35s ease',
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '2px',
                            left: theme === 'dark' ? '2px' : '20px',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: 'var(--accent)',
                            boxShadow: '0 0 8px var(--accent-dim)',
                            transition: 'left 0.3s cubic-bezier(0.16,1,0.3,1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                        }}>
                            {theme === 'dark' ? '🌙' : '☀️'}
                        </div>
                    </button>

                    {/* Notification Bell */}
                    <div style={{ position: 'relative' }}>
                        <NotificationBell count={unreadCount} onOpen={handleOpenNotif} isOpen={notifOpen} />
                        {notifOpen && (
                            <NotificationPanel
                                notifications={notifications}
                                loading={notifLoading}
                                onMarkRead={markRead}
                                onMarkAllRead={markAllRead}
                                onDismiss={dismiss}
                                onClose={() => setNotifOpen(false)}
                            />
                        )}
                    </div>

                    <div style={{ width: '1px', height: '14px', background: 'var(--border)', opacity: 0.5 }} />

                    {/* Profile Avatar */}
                    <div style={{ position: 'relative', zIndex: 50 }}>
                        <button
                            onClick={() => setShowAccount(true)}
                            title="Account settings"
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                border: '1.5px solid var(--glass-border-gold)',
                                padding: 0,
                                overflow: 'hidden',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: 'white',
                                flexShrink: 0,
                                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                background: !user?.user_metadata?.avatar_url
                                    ? 'linear-gradient(135deg, var(--accent), #E05C2A)' : 'none',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'var(--accent)';
                                e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-dim)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'var(--glass-border-gold)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : userInitial}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Account Modal ── */}
            <AccountModal isOpen={showAccount} onClose={() => setShowAccount(false)} />
        </>
    );
};

export default Navbar;
