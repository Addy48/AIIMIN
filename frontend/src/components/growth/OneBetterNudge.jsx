import React from 'react';

const NUDGES = [
    { condition: log => log?.sleep_hours < 7,   text: 'Sleep 30 min earlier tonight.',       icon: '😴' },
    { condition: log => !log?.gym_done,          text: 'Even a 20-min walk counts today.',     icon: '🏃' },
    { condition: log => log?.water_bottles < 4,  text: 'Drink one more bottle before dinner.', icon: '💧' },
    { condition: log => log?.mood < 5,           text: 'Take a 5-min break and breathe.',      icon: '🧘' },
    { condition: log => !log?.learning_done,     text: 'Read one article before bed.',         icon: '📖' },
    { condition: () => true,                     text: 'One small action beats perfect plans.', icon: '⚡' },
];

const OneBetterNudge = ({ todayLog = {} }) => {
    const nudge = NUDGES.find(n => n.condition(todayLog)) || NUDGES[NUDGES.length - 1];

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderLeft: '3px solid var(--accent)',
            borderRadius: 'var(--r-lg)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
        }}>
            <span style={{ fontSize: '28px' }}>{nudge.icon}</span>
            <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>
                    1% Better
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-1)', fontWeight: 600 }}>
                    {nudge.text}
                </div>
            </div>
        </div>
    );
};

export default OneBetterNudge;
