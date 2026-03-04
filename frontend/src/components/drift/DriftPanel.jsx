/**
 * components/drift/DriftPanel.jsx
 *
 * Right sidebar panel showing active behavioral drift alerts.
 * Alerts are created by the backend drift evaluator.
 */
import React from 'react';

const severityColor = (title) => {
    if (title.includes('streak') || title.includes('drop'))
        return { bg: 'rgba(235,140,140,0.08)', border: 'rgba(235,140,140,0.2)', dot: '#ef4444' };
    return { bg: 'var(--accent-dim)', border: 'var(--border-accent)', dot: 'var(--accent)' };
};

const DriftPanel = ({ alerts, onDismiss }) => {
    if (!alerts || alerts.length === 0) {
        return (
            <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Behavioral Drift
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 0' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✓</div>
                    <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e' }}>All metrics stable</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>No drift detected this week</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Behavioral Drift
                </div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--danger)', background: 'rgba(235,140,140,0.1)', padding: '2px 8px', borderRadius: '99px', border: '1px solid rgba(235,140,140,0.2)' }}>
                    {alerts.length} alert{alerts.length > 1 ? 's' : ''}
                </div>
            </div>

            {alerts.map(alert => {
                const colors = severityColor(alert.title);
                return (
                    <div key={alert.id} style={{
                        padding: '10px 12px', borderRadius: '10px',
                        background: colors.bg, border: `1px solid ${colors.border}`,
                        display: 'flex', gap: '8px', alignItems: 'flex-start',
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.dot, marginTop: '5px', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '2px' }}>
                                {alert.title}
                            </div>
                            {alert.body && (
                                <div style={{ fontSize: '10px', color: 'var(--text-3)', lineHeight: 1.5 }}>
                                    {alert.body}
                                </div>
                            )}
                        </div>
                        {onDismiss && (
                            <button onClick={() => onDismiss(alert.id)} style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--text-3)', fontSize: '11px', padding: '0 2px', flexShrink: 0,
                            }}>✕</button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DriftPanel;
