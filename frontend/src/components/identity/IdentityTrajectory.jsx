import React from 'react';

const IdentityTrajectory = ({ logs = [], sessions = [] }) => {
    const recentLogs = logs.slice(0, 14);

    let trajectory = 'Emerging Stabilizer';
    let icon = '🌱';
    let insight = 'Building foundational consistency.';

    const sleepAvg = recentLogs.reduce((a, b) => a + (parseFloat(b.sleep_hours) || 0), 0) / (recentLogs.length || 1);
    const gymFreq = recentLogs.filter(l => l.gym_done).length / (recentLogs.length || 1);

    if (gymFreq > 0.7 && sleepAvg >= 7) {
        trajectory = 'Elite Performer';
        icon = '⚡';
        insight = 'Your physical and recovery engines are firing at maximum output. Identity solidifying around high-performance.';
    } else if (sleepAvg < 6 && recentLogs.filter(l => l.mood <= 2).length > 3) {
        trajectory = 'Burnout Risk';
        icon = '⚠️';
        insight = 'Warning: System detects sustained low recovery and mood suppression. High friction identity forming.';
    } else if (gymFreq >= 0.5) {
        trajectory = 'Disciplined Builder';
        icon = '🏗️';
        insight = 'Showing strong physical consistency. Identity shifting toward disciplined action.';
    }

    return (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--r-lg)' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Identity Direction</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '48px', filter: 'drop-shadow(0 4px 12px rgba(212,175,55,0.2))' }}>{icon}</div>
                <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>{trajectory}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.5, marginTop: '4px' }}>{insight}</div>
                </div>
            </div>
            <button style={{ marginTop: '16px', padding: '6px 12px', background: 'var(--bg-elevated)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '11px', fontWeight: 700, color: 'var(--text-2)', cursor: 'pointer', transition: 'all 0.2s' }}>
                View Evolution Path →
            </button>
        </div>
    );
};

export default IdentityTrajectory;
