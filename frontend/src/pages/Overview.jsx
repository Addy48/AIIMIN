import React, { useState } from 'react';
import DumbbellIcon from '../components/icons/DumbbellIcon';
import { useAuth } from '../hooks/useAuth';
import { useDailyStats } from '../hooks/useDailyStats';
import { useLHSData } from '../hooks/useLHSData';
import { OverviewSection } from '../components/system/DashboardSections';

/**
 * Overview Page — Primary landing page at /overview.
 * Shows: LHS score, system health rings, daily pulse metrics, quests, momentum.
 * All other sections (Physical, Cognitive, etc.) are separate route-based pages.
 */
const Overview = ({ user }) => {
    const { session } = useAuth();
    const [expandedCard, setExpandedCard] = useState(null);

    const {
        loading: statsLoading,
        todayLog,
        todayFocus,
        computed: { gymDaysThisWeek }
    } = useDailyStats(user);

    const { lhsData, reportData, loading: lhsLoading } = useLHSData(session);

    const loading = statsLoading || lhsLoading;

    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

    if (loading) {
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div className="skeleton" style={{ width: '280px', height: '34px', borderRadius: 'var(--r-md)' }} />
                    <div className="skeleton" style={{ width: '200px', height: '28px', borderRadius: '99px' }} />
                </div>
                <div className="skeleton" style={{ height: '48px', borderRadius: 'var(--r-md)', marginBottom: '16px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '16px' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="skeleton" style={{ height: '80px', borderRadius: 'var(--r-lg)' }} />
                    ))}
                </div>
                <div className="skeleton" style={{ height: '120px', borderRadius: 'var(--r-lg)', marginBottom: '16px' }} />
                <div className="skeleton" style={{ height: '60px', borderRadius: 'var(--r-lg)' }} />
            </div>
        );
    }

    const s = todayLog || {};
    const completedToday = [
        s.sleep_hours > 0,
        s.gym_done,
        s.breakfast_done,
        (s.steps || 0) >= 1000,
        (s.water_bottles || 0) >= 2,
        (s.mood || 0) > 0,
        s.learning_done,
        s.journal_entry?.trim?.(),
    ].filter(Boolean).length;

    const statsData = [
        {
            id: 'score', label: 'Score', icon: '🎯',
            value: todayLog ? `${completedToday}/8` : '—',
            type: 'score',
            context: completedToday >= 8 ? 'Perfect day! 🔥' : completedToday >= 6 ? 'On track' : completedToday > 0 ? 'Keep logging' : 'Start today',
            contextColor: completedToday >= 6 ? 'var(--success)' : 'var(--accent)',
        },
        {
            id: 'sleep', label: 'Sleep', icon: '😴',
            value: s.sleep_hours ? `${s.sleep_hours}h` : '—',
            type: 'sleep',
            context: s.sleep_hours >= 7 ? 'Well rested ✓' : s.sleep_hours > 0 ? 'Sleep debt ⚠️' : 'Log tonight',
            contextColor: s.sleep_hours >= 7 ? 'var(--success)' : 'var(--accent)',
        },
        {
            id: 'gym', label: 'Gym', icon: <DumbbellIcon size={18} color="var(--text-2)" />,
            value: gymDaysThisWeek !== null ? `${gymDaysThisWeek}d` : '—',
            type: 'gym',
            context: gymDaysThisWeek >= 5 ? 'Beast mode 🔥' : gymDaysThisWeek >= 3 ? 'Consistent' : gymDaysThisWeek >= 1 ? 'Keep going' : 'Not yet this week',
            contextColor: gymDaysThisWeek >= 3 ? 'var(--success)' : 'var(--accent)',
        },
        {
            id: 'focus', label: 'Focus', icon: '🎯',
            value: todayFocus !== null ? String(todayFocus) : '—',
            type: 'focus',
            context: todayFocus >= 4 ? 'Deep work day ⚡' : todayFocus >= 1 ? `${todayFocus} session${todayFocus > 1 ? 's' : ''} done` : 'No sessions yet',
            contextColor: todayFocus >= 3 ? 'var(--success)' : 'var(--accent)',
        },
        {
            id: 'steps', label: 'Steps', icon: '👟',
            value: s.steps ? s.steps >= 1000 ? `${(s.steps / 1000).toFixed(1)}k` : String(s.steps) : '—',
            type: 'steps',
            context: s.steps >= 10000 ? 'Goal met ✓' : s.steps >= 5000 ? 'Halfway there' : s.steps > 0 ? 'Keep moving' : 'Log steps',
            contextColor: s.steps >= 10000 ? 'var(--success)' : 'var(--accent)',
        },
    ];

    const desktopLogSnapshot = {
        sleep_start: s.sleep_start || null,
        sleep_end: s.sleep_end || null,
        sleep_hours: s.sleep_hours || 0,
        gym_done: s.gym_done || false,
        gym_duration: s.gym_duration || 0,
        breakfast_done: s.breakfast_done || false,
        steps: s.steps || 0,
        water_bottles: s.water_bottles || 0,
        mood: s.mood || null,
        energy_level: s.energy_level || null,
        learning_done: s.learning_done || false,
        journal_entry: s.journal_entry || null,
        brain_fog: s.brain_fog || 0,
        win_logged: false,
        rc_count: s.rc_count || 0,
    };
    const todayStr = new Date().toLocaleDateString('en-CA');

    return (
        <>
            <OverviewSection
                user={user}
                firstName={firstName}
                statsData={statsData}
                expandedCard={expandedCard}
                setExpandedCard={setExpandedCard}
                desktopLogSnapshot={desktopLogSnapshot}
                todayStr={todayStr}
                lhsData={lhsData}
                reportData={reportData}
            />

            <style>{`
                .metrics-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
                .system-overview-strip { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
                @media (max-width: 768px) {
                    .metrics-row { grid-template-columns: repeat(2, 1fr) !important; }
                    .system-overview-strip { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
                }
            `}</style>
        </>
    );
};

export default Overview;
