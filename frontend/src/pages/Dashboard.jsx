import React, { useState, useCallback, useEffect } from 'react';
import Navbar from '../components/Navbar';
import DumbbellIcon from '../components/icons/DumbbellIcon';
import { useAuth } from '../hooks/useAuth';
import { apiDelete, apiGet } from '../utils/api';
import supabase from '../utils/supabase';
import toast from '../utils/toast';
import SystemJumper from '../components/system/SystemJumper';
import {
    OverviewSection,
    PhysicalSection,
    CognitiveSection,
    BehaviorSection,
    FinancialSection,
    ReflectionSection,
    InsightsSection,
    ReportsSection,
    SettingsPanelSection,
} from '../components/system/DashboardSections';

/* ─── Dashboard ─── */
const Dashboard = ({ user }) => {
    const { session } = useAuth();
    const [expandedCard, setExpandedCard] = useState(null);
    const [recentLogs, setRecentLogs] = useState([]);
    const [pomoCyclesTotal, setPomoCyclesTotal] = useState(0);
    const [dsaCountTotal, setDsaCountTotal] = useState(0);
    const [txCount, setTxCount] = useState(0);
    const [lhsData, setLhsData] = useState(null);
    const [reportData, setReportData] = useState(null);

    const [notifReminders, setNotifReminders] = useState(() => localStorage.getItem('aiimin_notif_reminders') === 'true');
    const [notifInsights, setNotifInsights] = useState(() => localStorage.getItem('aiimin_notif_insights') === 'true');

    // ── Real stats from DB ───────────────────────────────────────
    const [todayStats, setTodayStats] = useState(null);
    const [weekGymDays, setWeekGymDays] = useState(null);
    const [focusSessions, setFocusSessions] = useState(null);

    useEffect(() => {
        if (!user) return;
        const today = new Date().toLocaleDateString('en-CA');
        const weekAgo = new Date(Date.now() - 6 * 86400000).toLocaleDateString('en-CA');

        supabase.from('daily_logs').select('sleep_start, sleep_end, sleep_hours, steps, mood, energy_level, gym_done, gym_duration, breakfast_done, learning_done, learning_topic, journal_entry, water_bottles, brain_fog, headache')
            .eq('user_id', user.id).eq('date', today).maybeSingle()
            .then(({ data }) => setTodayStats(data || {}));

        supabase.from('daily_logs').select('gym_done').eq('user_id', user.id).gte('date', weekAgo)
            .then(({ data }) => { if (data) setWeekGymDays(data.filter(d => d.gym_done).length); });

        supabase.from('pomodoro_sessions').select('id').eq('user_id', user.id)
            .gte('started_at', today + 'T00:00:00').lte('started_at', today + 'T23:59:59')
            .then(({ data }) => { if (data) setFocusSessions(data.length); });

        const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toLocaleDateString('en-CA');
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toLocaleDateString('en-CA');

        supabase.from('daily_logs').select('*').eq('user_id', user.id)
            .gte('date', sixtyDaysAgo).order('date', { ascending: false })
            .then(({ data }) => { if (data) setRecentLogs(data); });

        supabase.from('pomodoro_sessions').select('id').eq('user_id', user.id)
            .gte('started_at', thirtyDaysAgo + 'T00:00:00')
            .then(({ data }) => { if (data) setPomoCyclesTotal(data.length); });

        supabase.from('money_transactions').select('id').eq('user_id', user.id)
            .gte('date', thirtyDaysAgo)
            .then(({ data }) => { if (data) setTxCount(data.length); });

        supabase.from('dsa_problems').select('id').eq('user_id', user.id)
            .gte('solved_at', thirtyDaysAgo + 'T00:00:00')
            .then(({ data }) => { if (data) setDsaCountTotal(data.length); });

        if (session) {
            Promise.all([
                apiGet('/intelligence/lhs', { session }),
                apiGet('/intelligence/report', { session }),
            ])
                .then(([lhs, report]) => {
                    setLhsData(lhs);
                    setReportData(report);
                })
                .catch(err => console.error('Analytics fetch fail:', err));
        }
    }, [user, session]);

    const saveAndSet = (key, setter) => (val) => {
        setter(val);
        localStorage.setItem(key, String(val));
    };

    const devEmail = process.env.REACT_APP_DEV_EMAIL;
    const isAdmin = !!(devEmail && user?.email === devEmail);

    const handleExport = useCallback(async () => {
        const tid = toast.loading('Exporting data...');
        try {
            const blob = await apiGet('/account/export', { session, responseType: 'blob' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'aiimin-export.json';
            a.click();
            URL.revokeObjectURL(url);
            toast.update(tid, 'Downloaded ✓', 'success');
        } catch (err) {
            toast.update(tid, 'Export failed', 'error');
        }
    }, [session]);

    const handleDeleteAccount = useCallback(async () => {
        if (!window.confirm('This will PERMANENTLY delete all your data. Type DELETE to confirm.')) return;
        const input = window.prompt('Type DELETE to confirm:');
        if (input !== 'DELETE') return;
        const tid = toast.loading('Deleting account...');
        try {
            await apiDelete('/account', { confirm: 'DELETE' }, { session });
            toast.update(tid, 'Account deleted', 'success');
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            toast.update(tid, 'Delete failed', 'error');
        }
    }, [session]);

    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

    const s = todayStats || {};
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
            value: todayStats ? `${completedToday}/8` : '—',
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
            value: weekGymDays !== null ? `${weekGymDays}d` : '—',
            type: 'gym',
            context: weekGymDays >= 5 ? 'Beast mode 🔥' : weekGymDays >= 3 ? 'Consistent' : weekGymDays >= 1 ? 'Keep going' : 'Not yet this week',
            contextColor: weekGymDays >= 3 ? 'var(--success)' : 'var(--accent)',
        },
        {
            id: 'focus', label: 'Focus', icon: '🎯',
            value: focusSessions !== null ? String(focusSessions) : '—',
            type: 'focus',
            context: focusSessions >= 4 ? 'Deep work day ⚡' : focusSessions >= 1 ? `${focusSessions} session${focusSessions > 1 ? 's' : ''} done` : 'No sessions yet',
            contextColor: focusSessions >= 3 ? 'var(--success)' : 'var(--accent)',
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
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-primary)',
            backgroundImage: 'radial-gradient(ellipse 80% 50% at 10% 20%, rgba(212,175,55,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(212,175,55,0.03) 0%, transparent 60%)',
            paddingTop: '80px',
            color: 'var(--text-1)',
        }}>
            {/* The Navbar might still be useful for brand logo or simple settings, but tabs are gone */}
            <Navbar user={user} activeTab={'home'} onTabChange={() => { }} />

            {/* Split layout: Fixed left Jumper, Scrollable Right Content */}
            <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>

                {/* ── SYSTEM JUMPER (Fixed Left) ── */}
                <aside style={{ width: '80px', flexShrink: 0 }}>
                    <SystemJumper />
                </aside>

                {/* ── MAIN CONTENT (Scrollable Right) ── */}
                <main style={{
                    flex: 1,
                    minWidth: 0,
                    padding: '24px 0 120px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--section-gap)',
                }}>

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
                    <PhysicalSection user={user} />
                    <CognitiveSection user={user} />
                    <BehaviorSection user={user} />
                    <FinancialSection user={user} />
                    <ReflectionSection user={user} recentLogs={recentLogs} pomoCyclesTotal={pomoCyclesTotal} dsaCountTotal={dsaCountTotal} txCount={txCount} />
                    <InsightsSection lhsData={lhsData} reportData={reportData} recentLogs={recentLogs} />
                    <ReportsSection user={user} />
                    <SettingsPanelSection
                        user={user}
                        isAdmin={isAdmin}
                        session={session}
                        notifReminders={notifReminders}
                        notifInsights={notifInsights}
                        onRemindersChange={saveAndSet('aiimin_notif_reminders', setNotifReminders)}
                        onInsightsChange={saveAndSet('aiimin_notif_insights', setNotifInsights)}
                        onExport={handleExport}
                        onDelete={handleDeleteAccount}
                    />

                </main>
            </div>

            <style>{`
                html { scroll-behavior: smooth; }
                @keyframes ping {
                    0% { transform: scale(1); opacity: 0.35; }
                    75% { transform: scale(2.2); opacity: 0; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                .metrics-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
                .analytics-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
                .system-overview-strip { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
                @media (max-width: 1024px) {
                    /* On mobile, probably hide the jumper or make it a bottom sheet, but side works on big screens */
                }
                @media (max-width: 768px) {
                    .metrics-row { grid-template-columns: repeat(2, 1fr) !important; }
                    .system-overview-strip { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
                    aside { display: none !important; } /* Hide jumper on mobile for now */
                    main { padding-left: 0 !important; }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
