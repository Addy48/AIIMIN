import React from 'react';
import { BehaviorSection } from '../../components/system/DashboardSections';
import { useAuth } from '../../hooks/useAuth';
import { useDailyStats } from '../../hooks/useDailyStats';

/**
 * Behavior System Page — Habits, Routines, Streaks, Yearly Heatmap.
 * Self-contained data fetching for streak context + loading skeleton.
 */
const Behavior = () => {
    const { user } = useAuth();
    const { loading, computed: sd } = useDailyStats(user);

    if (!user) return null;

    if (loading) {
        return (
            <div>
                <h1 className="text-section" style={{ marginBottom: 'var(--space-6)' }}>Behavior</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="skeleton" style={{ height: '180px', borderRadius: 'var(--r-lg)' }} />
                    <div className="skeleton" style={{ height: '120px', borderRadius: 'var(--r-lg)' }} />
                    <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--r-lg)' }} />
                </div>
            </div>
        );
    }


    return (
        <div>
            <h1 className="text-section" style={{ marginBottom: 'var(--space-4)' }}>Behavior</h1>

            {/* Quick context strip */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                marginBottom: 'var(--space-6)',
            }}>
                {[
                    { label: 'Current Streak', value: `${sd.currentStreak || 0}d`, icon: '🔥', color: sd.currentStreak >= 7 ? 'var(--success)' : 'var(--accent)' },
                    { label: 'Active Days (30d)', value: String(sd.loggedDays || 0), icon: '📊', color: 'var(--text-1)' },
                    { label: 'Gym Days (30d)', value: String(sd.gymDays || 0), icon: '💪', color: sd.gymDays >= 12 ? 'var(--success)' : 'var(--accent)' },
                    { label: 'Learning Days (30d)', value: String(sd.learningDays || 0), icon: '📚', color: sd.learningDays >= 15 ? 'var(--success)' : 'var(--accent)' },
                ].map(item => (
                    <div key={item.label} className="glass-panel" style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--r-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <span style={{ fontSize: '20px' }}>{item.icon}</span>
                        <div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: item.color }}>{item.value}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <BehaviorSection user={user} />
        </div>
    );
};

export default Behavior;
