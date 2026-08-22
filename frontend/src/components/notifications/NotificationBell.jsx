/**
 * components/notifications/NotificationBell.jsx
 *
 * Bell icon with unread badge + NotificationPanel dropdown.
 */
import React from 'react';

const NotificationBell = ({ count, urgent = false, onOpen, isOpen }) => {
    return (
        <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
                type="button"
                onClick={onOpen}
                title={urgent ? 'Urgent notifications' : 'Notifications'}
                aria-label={urgent ? `Urgent notifications${count > 0 ? `, ${count} unread` : ''}` : count > 0 ? `Notifications, ${count} unread` : 'Notifications'}
                style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: urgent && !isOpen ? 'color-mix(in srgb, #EF4444 12%, var(--bg-elevated))' : isOpen ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                    border: `1px solid ${urgent ? 'rgba(239, 68, 68, 0.55)' : isOpen ? 'var(--border-accent)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.15s ease', position: 'relative',
                    color: urgent ? '#EF4444' : isOpen ? 'var(--accent)' : 'var(--text-2)',
                }}
                onMouseEnter={e => { if (!isOpen) { e.currentTarget.style.borderColor = urgent ? 'rgba(239, 68, 68, 0.75)' : 'var(--border-hover)'; e.currentTarget.style.color = urgent ? '#EF4444' : 'var(--text-1)'; } }}
                onMouseLeave={e => { if (!isOpen) { e.currentTarget.style.borderColor = urgent ? 'rgba(239, 68, 68, 0.55)' : 'var(--border)'; e.currentTarget.style.color = urgent ? '#EF4444' : 'var(--text-2)'; } }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {count > 0 && (
                    <span className={urgent ? 'notification-bell__badge is-urgent' : 'notification-bell__badge'} style={{
                        position: 'absolute', top: '-5px', right: '-5px',
                        minWidth: '18px', height: '18px', borderRadius: '999px',
                        padding: '0 4px',
                                                background: urgent ? '#EF4444' : 'var(--color-accent, #ff6b35)', color: 'white', fontSize: '10px', fontWeight: 800, display: 'flex',

                        alignItems: 'center', justifyContent: 'center',
                        border: '2px solid var(--bg-primary)',
                    }}>
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </button>
        </div>
    );
};

export default NotificationBell;
