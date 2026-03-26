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
        { key: 'today',     label: 'Today',     icon: '●' },
        { key: 'focus',     label: 'Focus',     icon: '◆' },
        { key: 'identity',  label: 'Identity',  icon: '◎' },
        { key: 'growth',    label: 'Growth',    icon: '▲' },
        { key: 'habits',    label: 'Habits',    icon: '☰' },
        { key: 'money',     label: 'Money',     icon: '$' },
        { key: 'analytics', label: 'Analytics', icon: '◇' },
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
            borderBottom: 'none',
            boxShadow: theme === 'light'
                ? '0 1px 3px rgba(0,0,0,0.04), 0 1px 0 rgba(0,0,0,0.03)'
                : '0 1px 3px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.03)',
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
                        color: theme === 'dark' ? '#ff8c42' : '#c27814',
                        transition: 'color 0.3s ease',
                    }}>AIIMIN</span>
                </Link>

                {/* Date — inline text, no capsule */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <div style={{ width: '1px', height: '14px', background: 'var(--border-hover)', opacity: 0.6 }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.04em' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                </div>

                {/* Nav tabs — Arc/Linear underline style */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '4px', position: 'relative' }}>
                    {tabs.map(({ key, label, icon }) => (
                        <button key={key} onClick={() => onTabChange(key)} style={{
                            padding: '6px 14px', paddingBottom: '14px',
                            fontSize: '12px', fontWeight: activeTab === key ? 700 : 500,
                            cursor: 'pointer', transition: 'all 0.2s ease', border: 'none',
                            background: 'transparent',
                            color: activeTab === key ? 'var(--accent)' : 'var(--text-3)',
                            position: 'relative', display: 'flex', alignItems: 'center', gap: '5px',
                            letterSpacing: '0.01em',
                        }}>
                            <span style={{ fontSize: '8px', opacity: activeTab === key ? 1 : 0.5 }}>{icon}</span>
                            {label}
                            {/* Animated underline indicator */}
                            <span style={{
                                position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)',
                                height: '2px', borderRadius: '1px',
                                width: activeTab === key ? '60%' : '0%',
                                background: 'var(--accent)',
                                transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                            }} />
                        </button>
                    ))}
                </div>

                {/* Right controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Theme toggle — icon-on-knob pill */}
                    <button
                        onClick={toggleTheme}
                        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        style={{
                            position: 'relative', width: '54px', height: '28px',
                            borderRadius: '99px', flexShrink: 0, cursor: 'pointer',
                            border: '1px solid var(--border)', padding: 0,
                            background: theme === 'dark' ? '#19213a' : '#fde9b8',
                            transition: 'background 0.35s ease',
                        }}
                    >
                        <div style={{
                            position: 'absolute', top: '4px',
                            left: theme === 'dark' ? '4px' : '24px',
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: theme === 'dark' ? '#3d5a9e' : '#f5a623',
                            boxShadow: theme === 'dark' ? '0 0 8px rgba(91,130,196,0.5)' : '0 0 8px rgba(245,166,35,0.5)',
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

                    <div style={{ width: '1px', height: '18px', background: 'var(--border)' }} />

                    {/* Profile → Opens Account Modal */}
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
