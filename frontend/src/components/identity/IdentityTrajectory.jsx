import React from 'react';

const MILESTONES = [
    { label: 'Consistent Logger',    achieved: true,  date: 'Mar 2026' },
    { label: '30-Day Streak',        achieved: false,  date: 'Apr 2026' },
    { label: 'Placement Ready',      achieved: false,  date: 'Jun 2026' },
    { label: 'Financial Independence', achieved: false, date: '2027' },
];

const IdentityTrajectory = () => (
    <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: '20px',
    }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
            Identity Trajectory
        </div>
        <div style={{ position: 'relative', paddingLeft: '20px' }}>
            <div style={{
                position: 'absolute', left: '6px', top: 0, bottom: 0,
                width: '2px', background: 'var(--border)',
            }} />
            {MILESTONES.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px', position: 'relative' }}>
                    <div style={{
                        position: 'absolute', left: '-17px', top: '2px',
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: m.achieved ? '#10b981' : 'var(--border)',
                        border: `2px solid ${m.achieved ? '#10b981' : 'var(--border)'}`,
                        zIndex: 1,
                    }} />
                    <div>
                        <div style={{ fontSize: '13px', color: m.achieved ? 'var(--text-1)' : 'var(--text-3)', fontWeight: m.achieved ? 700 : 400 }}>
                            {m.label}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{m.date}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default IdentityTrajectory;
