import React from 'react';
import { PhysicalSection } from '../../components/system/DashboardSections';
import { useAuth } from '../../hooks/useAuth';
import { useDailyStats } from '../../hooks/useDailyStats';

/**
 * Physical System Page — Sleep, Steps, Gym, Nutrition, Water intake.
 * Self-contained data fetching: pulls today's log + 7-day trend for context.
 */
const Physical = () => {
    const { user } = useAuth();
    const { loading, computed: { gymDaysThisWeek, avgSleep, avgSteps } } = useDailyStats(user);

    if (!user) return null;

    if (loading) {
        return (
            <div>
                <h1 className="text-section" style={{ marginBottom: 'var(--space-6)' }}>Physical</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--r-lg)' }} />
                    <div className="skeleton" style={{ height: '140px', borderRadius: 'var(--r-lg)' }} />
                </div>
            </div>
        );
    }

    // Build summary strip for quick context

    return (
        <div>
            <h1 className="text-section" style={{ marginBottom: 'var(--space-4)' }}>Physical</h1>

            {/* Quick context strip */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: 'var(--space-6)',
            }}>
                {[
                    { label: '7d Avg Sleep', value: `${avgSleep}h`, icon: '😴' },
                    { label: 'Gym This Week', value: `${gymDaysThisWeek}d`, icon: '💪' },
                    { label: 'Avg Steps', value: avgSteps >= 1000 ? `${(avgSteps / 1000).toFixed(1)}k` : String(avgSteps), icon: '👟' },
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
                            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-1)' }}>{item.value}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <PhysicalSection user={user} />
        </div>
    );
};

export default Physical;
