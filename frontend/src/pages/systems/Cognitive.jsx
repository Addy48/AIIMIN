import React from 'react';
import { CognitiveSection } from '../../components/system/DashboardSections';
import { useAuth } from '../../hooks/useAuth';
import { useDailyStats } from '../../hooks/useDailyStats';

/**
 * Cognitive System Page — Focus sessions, Learning, Deep work, DSA.
 * Self-contained data fetching for today's pomodoro count, DSA streak, learning status.
 */
const Cognitive = () => {
    const { user } = useAuth();
    const { loading, todayLog, todayFocus, dsaCount30d } = useDailyStats(user);
    const learningDone = todayLog?.learning_done || false;

    if (!user) return null;

    if (loading) {
        return (
            <div>
                <h1 className="text-section" style={{ marginBottom: 'var(--space-6)' }}>Cognitive</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="skeleton" style={{ height: '390px', borderRadius: 'var(--r-lg)' }} />
                        <div className="skeleton" style={{ height: '390px', borderRadius: 'var(--r-lg)' }} />
                    </div>
                    <div className="skeleton" style={{ height: '120px', borderRadius: 'var(--r-lg)' }} />
                    <div className="skeleton" style={{ height: '100px', borderRadius: 'var(--r-lg)' }} />
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-section" style={{ marginBottom: 'var(--space-4)' }}>Cognitive</h1>

            {/* Quick context strip */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: 'var(--space-6)',
            }}>
                {[
                    {
                        label: 'Focus Today',
                        value: todayFocus !== null ? String(todayFocus) : '—',
                        icon: '🎯',
                        color: todayFocus >= 4 ? 'var(--success)' : 'var(--accent)',
                    },
                    {
                        label: 'DSA (30d)',
                        value: dsaCount30d !== null ? String(dsaCount30d) : '—',
                        icon: '💻',
                        color: dsaCount30d >= 20 ? 'var(--success)' : 'var(--accent)',
                    },
                    {
                        label: 'Learning',
                        value: learningDone ? 'Done ✓' : 'Pending',
                        icon: '📚',
                        color: learningDone ? 'var(--success)' : 'var(--text-3)',
                    },
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
                            <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <CognitiveSection user={user} />
        </div>
    );
};

export default Cognitive;
