import React from 'react';

const CausalNodeAnalysis = ({ behaviorDrivers = [] }) => {
    if (!behaviorDrivers || !Array.isArray(behaviorDrivers) || behaviorDrivers.length === 0) {
        return (
            <div style={{ padding: '32px', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>🧬</div>
                <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>Insufficient behavioral data</div>
            </div>
        );
    }
    const driversList = behaviorDrivers;

    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(90deg, rgba(212,175,55,0.05), transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>🧬</span>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>Causal Node Analysis</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Actual Behavioral Impacts (Calculated)</div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {driversList.slice(0, 5).map((c, i) => (
                    <div key={i} style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(100px, 1fr) auto minmax(100px, 1fr)',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '12px',
                        background: i === 0 ? 'var(--accent-dim)' : 'transparent',
                        borderRadius: '12px',
                        border: i === 0 ? '1px solid var(--border-accent)' : '1px solid transparent',
                        transition: 'all 0.3s ease'
                    }}>
                        {/* Source Node */}
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Driver</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{c.driver.replace('_', ' ')}</div>
                        </div>

                        {/* Connection Line & Impact */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                            <div style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                color: c.impact >= 0 ? 'var(--success)' : 'var(--danger)',
                                background: 'var(--bg-elevated)',
                                padding: '2px 8px',
                                borderRadius: '99px',
                                border: '1px solid var(--border)',
                                marginBottom: '-8px',
                                zIndex: 1
                            }}>
                                {c.impact >= 0 ? '+' : ''}{Math.round(c.impact)}%
                            </div>
                            <div style={{
                                width: '100%',
                                height: '1px',
                                background: `linear-gradient(90deg, transparent, ${c.impact >= 0 ? 'var(--success)' : 'var(--danger)'}, transparent)`,
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    right: c.impact >= 0 ? '0' : 'auto',
                                    left: c.impact < 0 ? '0' : 'auto',
                                    top: '-3px',
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    background: c.impact >= 0 ? 'var(--success)' : 'var(--danger)',
                                    boxShadow: `0 0 10px ${c.impact >= 0 ? 'var(--success)' : 'var(--danger)'}`
                                }} />
                            </div>
                        </div>

                        {/* Target Node */}
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Impact on</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>{c.target.replace('_', ' ')}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ padding: '12px 24px', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)', fontSize: '10px', color: 'var(--text-3)', fontStyle: 'italic' }}>
                * Impact scores objectively calculated from your last 120 days of analytics pipeline data.
            </div>
        </div>
    );
};

export default CausalNodeAnalysis;
