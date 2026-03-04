/**
 * components/notifications/NotificationBell.jsx
 *
 * Bell icon with unread badge + NotificationPanel dropdown.
 */
import React from 'react';

const NotificationBell = ({ count, onOpen, isOpen }) => {
    return (
        <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
                onClick={onOpen}
                title="Notifications"
                style={{
                    width: '30px', height: '30px', borderRadius: '8px',
                    background: isOpen ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                    border: `1px solid ${isOpen ? 'var(--border-accent)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.15s ease', position: 'relative',
                    color: isOpen ? 'var(--accent)' : 'var(--text-2)',
                }}
                onMouseEnter={e => { if (!isOpen) { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-1)'; } }}
                onMouseLeave={e => { if (!isOpen) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; } }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {count > 0 && (
                    <span style={{
                        position: 'absolute', top: '-4px', right: '-4px',
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: 'var(--accent)', color: 'white',
                        fontSize: '9px', fontWeight: 800, display: 'flex',
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
