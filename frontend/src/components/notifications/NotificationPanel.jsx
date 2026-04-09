import React, { useEffect, useRef } from 'react';

const typeLabel = (type) => {
    const map = {
        drift_alert: 'Drift',
        commitment_miss: 'Miss',
        weekly_summary: 'Summary',
        weekly_summary_ready: 'Summary',
        integration_error: 'Error',
        streak_milestone: 'Streak',
        xp_level_up: 'Level Up',
        goal_progress: 'Goal',
    };
    return map[type] || 'Note';
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
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '300px',
            maxHeight: '400px',
            background: 'var(--color-elevated)',
            border: '1px solid var(--color-border-lit)',
            borderRadius: 'var(--r-md)',
            overflow: 'hidden',
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header */}
            <div style={{
                padding: '12px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--color-border)',
                flexShrink: 0,
            }}>
                <span style={{ font: '500 11px/1 var(--font-mono)', color: 'var(--color-text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Notifications
                </span>
                {notifications.some(n => !n.read_at) && (
                    <button onClick={onMarkAllRead} style={{
                        background: 'none', border: 'none',
                        font: '400 11px/1 var(--font-sans)',
                        color: 'var(--color-accent)', cursor: 'pointer',
                    }}>
                        Mark all read
                    </button>
                )}
            </div>

            {/* List */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
                {loading && (
                    <div style={{ padding: '24px', textAlign: 'center', font: '400 12px/1 var(--font-sans)', color: 'var(--color-text-3)' }}>
                        Loading…
                    </div>
                )}
                {!loading && notifications.length === 0 && (
                    <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                        <div style={{ font: '500 11px/1 var(--font-mono)', color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>All clear</div>
                        <div style={{ font: '400 12px/1 var(--font-sans)', color: 'var(--color-text-3)' }}>No new notifications</div>
                    </div>
                )}
                {!loading && notifications.map(n => (
                    <div
                        key={n.id}
                        style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid var(--color-border)',
                            display: 'flex', gap: '10px', alignItems: 'flex-start',
                            background: n.read_at ? 'transparent' : 'var(--color-accent-dim)',
                            transition: 'background 0.15s',
                            cursor: 'default',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface)'}
                        onMouseLeave={e => e.currentTarget.style.background = n.read_at ? 'transparent' : 'var(--color-accent-dim)'}
                    >
                        {/* Type badge */}
                        <span style={{
                            font: '500 9px/1 var(--font-mono)',
                            color: 'var(--color-accent)',
                            background: 'var(--color-accent-dim)',
                            padding: '3px 6px',
                            borderRadius: 'var(--r-sm)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            flexShrink: 0,
                            marginTop: '2px',
                        }}>{typeLabel(n.type)}</span>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                font: `${n.read_at ? '400' : '500'} 12px/1.3 var(--font-sans)`,
                                color: 'var(--color-text-1)',
                                marginBottom: '3px',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                                {n.title}
                            </div>
                            {n.body && (
                                <div style={{ font: '400 11px/1.5 var(--font-sans)', color: 'var(--color-text-3)' }}>
                                    {n.body}
                                </div>
                            )}
                            <div style={{ font: '400 10px/1 var(--font-mono)', color: 'var(--color-text-3)', marginTop: '5px' }}>
                                {timeAgo(n.created_at)}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                            {!n.read_at && (
                                <button onClick={() => onMarkRead(n.id)} title="Mark read" style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: 'var(--color-text-3)', font: '400 10px/1 var(--font-mono)', padding: '2px',
                                }}>✓</button>
                            )}
                            <button onClick={() => onDismiss(n.id)} title="Dismiss" style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--color-text-3)', font: '400 10px/1 var(--font-mono)', padding: '2px',
                            }}>✕</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationPanel;
