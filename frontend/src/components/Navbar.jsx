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
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const tabRefs = useRef({});

    const tabs = [
        { key: 'today',     label: 'Today' },
        { key: 'focus',     label: 'Focus' },
        { key: 'identity',  label: 'Identity' },
        { key: 'growth',    label: 'Growth' },
        { key: 'habits',    label: 'Habits' },
        { key: 'money',     label: 'Money' },
        { key: 'analytics', label: 'Analytics' },
    ];

    const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

    // Sliding indicator — measures active tab element and moves the bar
    useEffect(() => {
        const el = tabRefs.current[activeTab];
        if (el) {
            const parent = el.parentElement;
            const parentRect = parent.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            setIndicatorStyle({
                width: `${elRect.width - 16}px`,
                left: `${elRect.left - parentRect.left + 8}px`,
            });
        }
    }, [activeTab]);

    const handleOpenNotif = () => {
        if (!notifOpen) fetchAll();
        setNotifOpen(o => !o);
    };

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: '56px', zIndex: 99999,
            backgroundColor: theme === 'light' ? 'rgba(245,240,232,0.92)' : 'rgba(14,16,13,0.88)',
            borderBottom: 'none',
            boxShadow: theme === 'light'
                ? '0 1px 0 rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)'
                : '0 1px 0 rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(24px) saturate(1.4)', WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        }}>
            <div style={{
                maxWidth: '1400px', margin: '0 auto', padding: '0 24px',
                height: '56px', display: 'flex', alignItems: 'center', gap: '16px',
            }}>
                {/* Wordmark */}
                <Link to="/brand" style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    textDecoration: 'none', flexShrink: 0,
                }}>
                    <LogoContainer size={30} />
                    <span style={{
                        fontSize: '16px', fontWeight: 900, letterSpacing: '-0.5px',
                        color: theme === 'dark' ? '#ff8c42' : '#c27814',
                        transition: 'color 0.3s ease',
                    }}>AIIMIN</span>
                </Link>

                {/* Separator + Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <div style={{ width: '1px', height: '16px', background: 'var(--border-hover)', opacity: 0.5 }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.03em' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                </div>

                {/* Center Tabs — clean text with sliding indicator */}
                <div style={{
                    flex: 1, display: 'flex', justifyContent: 'center', gap: '2px',
                    position: 'relative', height: '56px', alignItems: 'center',
                }}>
                    {tabs.map(({ key, label }) => (
                        <button
                            key={key}
                            ref={el => tabRefs.current[key] = el}
                            onClick={() => onTabChange(key)}
                            style={{
                                padding: '8px 12px',
                                fontSize: '13px', fontWeight: activeTab === key ? 650 : 450,
                                cursor: 'pointer', transition: 'color 0.2s ease, font-weight 0.2s ease',
                                border: 'none', background: 'transparent',
                                color: activeTab === key ? 'var(--text-1)' : 'var(--text-3)',
                                position: 'relative', letterSpacing: '-0.01em',
                            }}
                        >
                            {label}
                        </button>
                    ))}
                    {/* Sliding accent bar */}
                    <div style={{
                        position: 'absolute', bottom: '0', height: '2px',
                        borderRadius: '2px 2px 0 0',
                        background: 'var(--accent)',
                        transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1), width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        ...indicatorStyle,
                    }} />
                </div>

                {/* Right controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* Theme toggle — minimal pill */}
                    <button
                        onClick={toggleTheme}
                        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        style={{
                            position: 'relative', width: '48px', height: '26px',
                            borderRadius: '99px', flexShrink: 0, cursor: 'pointer',
                            border: '1px solid var(--border)', padding: 0,
                            background: theme === 'dark' ? '#19213a' : '#fde9b8',
                            transition: 'background 0.35s ease',
                        }}
                    >
                        <div style={{
                            position: 'absolute', top: '3px',
                            left: theme === 'dark' ? '3px' : '22px',
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: theme === 'dark' ? '#3d5a9e' : '#f5a623',
                            boxShadow: theme === 'dark' ? '0 0 6px rgba(91,130,196,0.4)' : '0 0 6px rgba(245,166,35,0.4)',
                            transition: 'left 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s ease, box-shadow 0.3s ease',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '11px',
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

                    <div style={{ width: '1px', height: '16px', background: 'var(--border)', opacity: 0.5 }} />

                    {/* Profile Avatar */}
                    <div style={{ position: 'relative', zIndex: 50 }}>
                        <button
                            onClick={() => setShowAccount(true)}
                            title="Account settings"
                            style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                cursor: 'pointer', border: '2px solid transparent', padding: 0, overflow: 'hidden',
                                fontSize: '12px', fontWeight: 700, color: 'white', flexShrink: 0,
                                transition: 'border-color 0.2s ease',
                                background: !user?.user_metadata?.avatar_url
                                    ? 'linear-gradient(135deg, #c27814, #e05c2a)' : 'none',
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                        >
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : userInitial}
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Account Modal */}
            <AccountModal isOpen={showAccount} onClose={() => setShowAccount(false)} />
        </nav>
    );
};

export default Navbar;
