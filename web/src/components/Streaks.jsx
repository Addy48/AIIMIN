import React, { useMemo } from 'react';
import DumbbellIcon from './icons/DumbbellIcon';
import { useDailyLogsRange } from '../hooks/useDailyLogsQuery';

const Streaks = ({ user }) => {
    const { logs, loading } = useDailyLogsRange(365, {
        fields: 'date,gym_done,learning_done,rc_count,steps',
        enabled: Boolean(user),
    });

    const { streaks, hasLogs } = useMemo(() => {
        if (!logs?.length) return { streaks: { gym: 0, learning: 0, rc: 0, walking: 0 }, hasLogs: false };

        const pad = (n) => String(n).padStart(2, '0');
        const localToday = new Date();
        const logMap = {};
        for (const log of logs) logMap[log.date] = log;

        const countStreak = (predicate, allowMissingDays = false) => {
            let streak = 0;
            const d = new Date(localToday);
            while (true) {
                const dStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                const log = logMap[dStr];
                if (log && predicate(log)) streak += 1;
                else if (allowMissingDays && !log) { /* keep */ }
                else break;
                d.setDate(d.getDate() - 1);
            }
            return streak;
        };

        return {
            hasLogs: true,
            streaks: {
                gym: countStreak((l) => l.gym_done),
                learning: countStreak((l) => l.learning_done),
                rc: countStreak((l) => !l.rc_count || l.rc_count === 0, true),
                walking: countStreak((l) => l.steps >= 10000),
            },
        };
    }, [logs]);

    const MetricCard = ({ icon, label, count, activeColor, inactiveColor }) => (
        <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: count > 0 ? activeColor : inactiveColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', boxShadow: count > 0 ? '0 8px 24px rgba(0,0,0,0.1)' : 'none'
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {label}
                </div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-1px' }}>
                    {count} <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-3)' }}>days</span>
                </div>
                {count > 0 && <div style={{ fontSize: '13px', color: 'var(--success)', marginTop: '4px', fontWeight: 500 }}>🔥 Streak active</div>}
            </div>
        </div>
    );

    if (loading) {
        return <div className="p-8 text-center text-[var(--text-3)]">Loading streaks...</div>;
    }

    if (!hasLogs) {
        return (
            <div className="fade-up" style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '40px 24px', textAlign: 'center',
                boxShadow: 'var(--shadow-sm)', marginTop: '10px'
            }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>🌱</div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '8px' }}>No Chains Yet</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', maxWidth: '280px', margin: '0 auto', lineHeight: 1.5 }}>
                    Begin a focus session today to build your first streak.
                </p>
            </div>
        );
    }

    return (
        <div className="fade-up flex flex-col gap-4">
            <MetricCard
                icon={<DumbbellIcon size={32} color="var(--text-1)" />}
                label="Gym & Workout"
                count={streaks.gym}
                activeColor="rgba(245,166,35,0.2)"
                inactiveColor="var(--bg-elevated)"
            />
            <MetricCard
                icon="📚"
                label="Learning"
                count={streaks.learning}
                activeColor="rgba(93,184,122,0.2)"
                inactiveColor="var(--bg-elevated)"
            />
            <MetricCard
                icon="🚫"
                label="No Resets"
                count={streaks.rc}
                activeColor="rgba(155,138,245,0.2)"
                inactiveColor="var(--bg-elevated)"
            />
            <MetricCard
                icon="👟"
                label="Walking (>10k)"
                count={streaks.walking}
                activeColor="rgba(0,190,255,0.2)"
                inactiveColor="var(--bg-elevated)"
            />
        </div>
    );
};

export default Streaks;
