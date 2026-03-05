import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useTheme from '../hooks/useTheme';
import { useNotifications } from '../hooks/useNotifications';
import NotificationBell from './notifications/NotificationBell';
import NotificationPanel from './notifications/NotificationPanel';
import AccountModal from './account/AccountModal';
import Logo from './Logo';


const Navbar = ({ user, activeTab, onTabChange }) => {
    const { theme, toggleTheme } = useTheme();
    const { notifications, unreadCount, loading: notifLoading, fetchAll, markRead, markAllRead, dismiss } = useNotifications();
    const [notifOpen, setNotifOpen] = useState(false);
    const [showAccount, setShowAccount] = useState(false);

    const tabs = [
        { key: 'today', label: 'Today' },
        { key: 'sessions', label: 'Sessions' },
        { key: 'insights', label: 'Insights' },
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
                    <Logo size={32} />
                </Link>

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
                    {/* Theme toggle */}
                    <button onClick={toggleTheme} style={{
                        width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                        fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s ease', color: 'var(--text-2)',
                    }}>
                        {theme === 'dark' ? '☀' : '☾'}
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
