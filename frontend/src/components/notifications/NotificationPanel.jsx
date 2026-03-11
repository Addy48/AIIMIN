/**
 * components/notifications/NotificationPanel.jsx
 *
 * Dropdown panel showing in-app notifications.
 * Opened from NotificationBell in Navbar.
 */
import React, { useEffect, useRef } from 'react';

const typeIcon = (type) => {
    switch (type) {
        case 'drift_alert': return '📉';
        case 'commitment_miss': return '🎯';
        case 'weekly_summary': return '📊';
        case 'integration_error': return '⚠';
        case 'streak_milestone': return '🔥';
        case 'xp_level_up': return '⚡';
        case 'weekly_summary_ready': return '📊';
        case 'goal_progress': return '🎯';
        default: return '💬';
    }
};

const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
};

const NotificationPanel = ({ notifications, loading, onMarkRead, onMarkAllRead, onDismiss, onClose }) => {
    const panelRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [onClose]);

    return (
        <div ref={panelRef} style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: '320px', maxHeight: '420px',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: '16px', overflow: 'hidden',
            boxShadow: 'var(--shadow-md)', zIndex: 9999,
            display: 'flex', flexDirection: 'column',
        }}>
            {/* Header */}
            <div style={{
                padding: '14px 16px 10px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', borderBottom: '1px solid var(--border)',
                flexShrink: 0,
            }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)' }}>Notifications</span>
                {notifications.some(n => !n.read_at) && (
                    <button onClick={onMarkAllRead} style={{
                        background: 'none', border: 'none', fontSize: '11px', fontWeight: 600,
                        color: 'var(--accent)', cursor: 'pointer', padding: '2px 4px',
                    }}>
                        Mark all read
                    </button>
                )}
            </div>

            {/* List */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
                {loading && (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-3)', fontSize: '12px' }}>
                        Loading…
                    </div>
                )}
                {!loading && notifications.length === 0 && (
                    <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔔</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)' }}>All clear</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '4px' }}>No new notifications</div>
                    </div>
                )}
                {!loading && notifications.map(n => (
                    <div
                        key={n.id}
                        style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex', gap: '10px', alignItems: 'flex-start',
                            background: n.read_at ? 'transparent' : 'var(--accent-dim)',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
                        onMouseLeave={e => e.currentTarget.style.background = n.read_at ? 'transparent' : 'var(--accent-dim)'}
                    >
                        <span style={{ fontSize: '16px', flexShrink: 0 }}>{typeIcon(n.type)}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: '12px', fontWeight: n.read_at ? 600 : 800,
                                color: 'var(--text-1)', marginBottom: '2px',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                                {n.title}
                            </div>
                            {n.body && (
                                <div style={{ fontSize: '11px', color: 'var(--text-3)', lineHeight: 1.5 }}>
                                    {n.body}
                                </div>
                            )}
                            <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '4px' }}>
                                {timeAgo(n.created_at)}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                            {!n.read_at && (
                                <button onClick={() => onMarkRead(n.id)} title="Mark read" style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: 'var(--text-3)', fontSize: '10px', padding: '2px',
                                }}>✓</button>
                            )}
                            <button onClick={() => onDismiss(n.id)} title="Dismiss" style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--text-3)', fontSize: '10px', padding: '2px',
                            }}>✕</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationPanel;
