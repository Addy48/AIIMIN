import React, { useState } from 'react';
import CalendarHeatmap from '../calendar/CalendarHeatmap';
import WeekRows from './WeekRows';

const ExpandedStatPanel = ({ stat, user }) => {
    const [viewMode, setViewMode] = useState('week');
    const now = new Date();

    return (
        <div className="fade-up" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '20px',
            minHeight: '260px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{stat.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>
                        {stat.label} — {viewMode === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
                    </span>
                </div>
                <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border)' }}>
                    {['week', 'month'].map(mode => (
                        <button key={mode} onClick={() => setViewMode(mode)} style={{
                            padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: 'none',
                            background: viewMode === mode ? 'var(--bg-card)' : 'transparent',
                            color: viewMode === mode ? 'var(--accent)' : 'var(--text-3)',
                            transition: 'all 0.15s ease',
                        }}>
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            {viewMode === 'week'
                ? <WeekRows stat={stat} user={user} />
                : <CalendarHeatmap year={now.getFullYear()} month={now.getMonth() + 1} type={stat.id} />
            }
        </div>
    );
};

export default ExpandedStatPanel;
