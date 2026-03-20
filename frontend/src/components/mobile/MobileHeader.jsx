import React from 'react';

const MobileHeader = ({ completedCount = 0, totalMetrics = 8, streak = 0, lastSaved }) => {
    const pct = (completedCount / totalMetrics) * 100;
    const radius = 14;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;
    const today = new Date();
    const day = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <div style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)',
            padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
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
    );
};

export default MobileHeader;
