import React from 'react';

const Delta = ({ label, current, previous, unit = '' }) => {
    const diff = current - previous;
    const pct = previous ? ((diff / previous) * 100).toFixed(1) : 0;
    const up = diff >= 0;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>{current}{unit}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: up ? '#10b981' : '#ef4444', padding: '2px 6px', background: up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: '4px' }}>
                    {up ? '+' : ''}{pct}%
                </span>
            </div>
        </div>
    );
};

const PerformanceDeltaHub = ({ weekData = {}, prevWeekData = {} }) => (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
            Week-over-Week Delta
        </div>
        <Delta label="Avg Sleep" current={weekData.sleep || 0} previous={prevWeekData.sleep || 0} unit="h" />
        <Delta label="Avg Steps" current={weekData.steps || 0} previous={prevWeekData.steps || 0} />
        <Delta label="Gym Days" current={weekData.gym || 0} previous={prevWeekData.gym || 0} unit=" days" />
        <Delta label="Avg Mood" current={weekData.mood || 0} previous={prevWeekData.mood || 0} unit="/10" />
        <Delta label="Learning Days" current={weekData.learning || 0} previous={prevWeekData.learning || 0} unit=" days" />
    </div>
);

export default PerformanceDeltaHub;
