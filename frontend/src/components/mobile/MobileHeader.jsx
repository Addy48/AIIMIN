import React from 'react';
import { getRankProgress } from '../../utils/xpEngine';

const MobileHeader = ({ completedCount = 0, totalMetrics = 8, streak = 0, lastSaved, xpData }) => {
    const pct = (completedCount / totalMetrics) * 100;
    const radius = 14;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;
    const today = new Date();
    const day = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const rp = getRankProgress(xpData?.total_xp || 0);
    const rankColor = rp.current.color;

    return (
        <div style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)',
        }}>
            {/* Top row: logo, date, streak, completion ring */}
            <div style={{ padding: '12px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em' }}>AIIMIN</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>{day}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {streak > 0 && (
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            🔥 {streak}
                        </span>
                    )}
                    <div style={{ position: 'relative', width: '36px', height: '36px' }}>
                        <svg width="36" height="36" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="18" cy="18" r={radius} fill="none" stroke="var(--border)" strokeWidth="3" />
                            <circle cx="18" cy="18" r={radius} fill="none" stroke={pct >= 100 ? 'var(--success)' : 'var(--accent)'}
                                strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={offset}
                                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
                        </svg>
                        <span style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                            fontSize: '10px', fontWeight: 800, color: pct >= 100 ? 'var(--success)' : 'var(--text-1)',
                        }}>{completedCount}/{totalMetrics}</span>
                    </div>
                </div>
            </div>

            {/* XP Bar */}
            <div style={{ padding: '0 16px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Rank badge */}
                <span style={{
                    fontSize: '10px', fontWeight: 800, color: rankColor,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    whiteSpace: 'nowrap', minWidth: '70px',
                }}>
                    ⚡ {rp.current.name}
                </span>

                {/* Progress bar */}
                <div style={{
                    flex: 1, height: '6px', borderRadius: '3px',
                    background: 'var(--bg-elevated)', overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%', borderRadius: '3px',
                        background: `linear-gradient(90deg, ${rankColor}, ${rankColor}cc)`,
                        width: `${(rp.progress * 100).toFixed(1)}%`,
                        transition: 'width 0.6s ease',
                        boxShadow: `0 0 8px ${rankColor}40`,
                    }} />
                </div>

                {/* XP count */}
                {rp.next && (
                    <span style={{
                        fontSize: '9px', fontWeight: 700, color: 'var(--text-3)',
                        whiteSpace: 'nowrap',
                    }}>
                        {(xpData?.total_xp || 0).toLocaleString()} / {rp.next.xpRequired.toLocaleString()}
                    </span>
                )}
            </div>
        </div>
    );
};

export default MobileHeader;
