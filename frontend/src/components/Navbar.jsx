import React, { useState } from 'react';
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


    const handleOpenNotif = () => {
        if (!notifOpen) fetchAll();
        setNotifOpen(o => !o);
    };

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: '52px', zIndex: 99999,
            backgroundColor: theme === 'light' ? 'rgba(245,240,232,0.95)' : 'rgba(14,16,13,0.94)',
            borderBottom: '1px solid var(--border)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        }}>
            <div style={{
                maxWidth: '1400px', margin: '0 auto', padding: '0 20px',
                height: '52px', display: 'flex', alignItems: 'center', gap: '12px',
            }}>
                {/* Wordmark */}
                <Link to="/brand" style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    textDecoration: 'none', flexShrink: 0,
                }}>
                    <LogoContainer size={34} />
                    <span style={{
                        fontSize: '15px', fontWeight: 900, letterSpacing: '-0.5px',
                        background: 'var(--gradient-1)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>AIIMIN</span>
                </Link>

                {/* Live date badge */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0,
                    padding: '3px 9px', borderRadius: '99px',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.03em',
                }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, opacity: 0.9 }} />
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>

                {/* Nav tabs */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '2px' }}>
                    {tabs.map(({ key, label }) => (
                        <button key={key} onClick={() => onTabChange(key)} style={{
                            padding: '5px 14px', borderRadius: '99px',
                            fontSize: '12px', fontWeight: activeTab === key ? 700 : 500,
                            cursor: 'pointer', transition: 'all 0.15s ease', border: 'none',
                            background: activeTab === key ? 'var(--accent-dim)' : 'transparent',
                            color: activeTab === key ? 'var(--accent)' : 'var(--text-2)',
                            outline: activeTab === key ? '1px solid var(--border-accent)' : '1px solid transparent',
                        }}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Right controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Theme toggle — sliding pill */}
                    <button
                        onClick={toggleTheme}
                        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        style={{
                            position: 'relative', width: '52px', height: '26px',
                            borderRadius: '99px', flexShrink: 0, cursor: 'pointer',
                            border: '1px solid var(--border)', padding: 0, overflow: 'hidden',
                            background: theme === 'dark' ? '#1c2440' : '#fff3de',
                            transition: 'background 0.35s ease',
                        }}
                    >
                        <span style={{
                            position: 'absolute', left: '6px', top: '50%', transform: 'translateY(-50%)',
                            fontSize: '12px', zIndex: 1, transition: 'opacity 0.2s',
                            opacity: theme === 'dark' ? 1 : 0, pointerEvents: 'none',
                        }}>🌙</span>
                        <span style={{
                            position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)',
                            fontSize: '12px', zIndex: 1, transition: 'opacity 0.2s',
                            opacity: theme === 'dark' ? 0 : 1, pointerEvents: 'none',
                        }}>☀️</span>
                        <div style={{
                            position: 'absolute', top: '3px',
                            left: theme === 'dark' ? '3px' : '25px',
                            width: '18px', height: '18px', borderRadius: '50%',
                            background: theme === 'dark' ? '#5b82c4' : '#ffb347',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                            transition: 'left 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s ease',
                            zIndex: 2,
                        }} />
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

                    <div style={{ width: '1px', height: '18px', background: 'var(--border)' }} />

                    {/* Profile → Opens Account Modal */}
                    <div style={{ position: 'relative', zIndex: 50 }}>
                        <button
                            onClick={() => setShowAccount(true)}
                            title="Account settings"
                            style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                cursor: 'pointer', border: 'none', padding: 0, overflow: 'hidden',
                                fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0,
                                background: !user?.user_metadata?.avatar_url
                                    ? 'linear-gradient(135deg, #c27814, #e05c2a)' : 'none',
                            }}
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
