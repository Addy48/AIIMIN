import React, { useState } from 'react';

const StreakItem = ({ label, count, icon, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px' }}>{icon}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: color || 'var(--accent)' }}>{count}</span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase' }}>Day</span>
        </div>
    </div>
);

const RecordItem = ({ label, value }) => (
    <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)' }}>{value}</span>
    </div>
);

const WinsEngine = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Mock data for analytical reinforcement
    const momentumScore = 88;
    const records = [
        { label: 'Longest Focus', value: '12 Days' },
        { label: 'Best Week', value: '94%' },
        { label: 'Avg Mood', value: '8.4' }
    ];

    const timeline = [
        { title: '3 commitments hit', meta: 'Today, 09:12' },
        { title: 'Mood +2 delta', meta: 'Yesterday' },
        { title: 'GYM session completed', meta: 'Yesterday' }
    ];

    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }} className="fade-up">
            <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-1)', margin: 0 }}>Wins Engine</h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, marginTop: '2px' }}>Behavioral Reinforcement System</p>
                    </div>
                    {/* Momentum Circle (0-100) */}
                    <div style={{ position: 'relative', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="50" height="50" viewBox="0 0 50 50">
                            <circle cx="25" cy="25" r="22" fill="none" stroke="var(--border)" strokeWidth="4" />
                            <circle cx="25" cy="25" r="22" fill="none" stroke="var(--accent)" strokeWidth="4"
                                strokeDasharray={`${momentumScore * 1.38} 138`} strokeLinecap="round" transform="rotate(-90 25 25)" />
                        </svg>
                        <span style={{ position: 'absolute', fontSize: '11px', fontWeight: 800, color: 'var(--text-1)' }}>{momentumScore}</span>
                    </div>
                </div>

                {/* Active Streaks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '24px' }}>
                    <StreakItem label="Focus Mastery" count="8" icon="🔥" />
                    <StreakItem label="Gym Commitment" count="3" icon="💪" />
                    <StreakItem label="Stability Index" count="14" icon="⚖️" color="var(--success)" />
                </div>

                {/* Personal Records Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    {records.map((r, i) => <RecordItem key={i} {...r} />)}
                </div>
            </div>

            {/* Win Timeline (Collapsible) */}
            <div style={{ borderTop: '1px solid var(--border)' }}>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        width: '100%', padding: '14px 24px', background: 'none', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer', outline: 'none'
                    }}
                >
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Win Timeline</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-3)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>↓</span>
                </button>
                {isExpanded && (
                    <div style={{ padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="fade-up">
                        {timeline.map((win, i) => (
                            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', marginTop: '5px' }} />
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1)' }}>{win.title}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>{win.meta}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WinsEngine;
