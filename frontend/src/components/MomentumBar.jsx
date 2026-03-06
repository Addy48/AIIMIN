import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import useFeatureFlag from '../hooks/useFeatureFlag';

/**
 * MomentumBar — Daily completion score (0-100)
 *
 * Scoring: sleep(25) + gym(20) + focus(20) + learning(15) + journal(10) + steps(10)
 * When habits_system_enabled: routine completion blended in at 8% weight
 * (base score scaled to 92%, routine score contributes up to 8 pts, total still ≤100)
 * Shows: animated bar, consistency %, "+1" animation, yesterday comparison
 */
const MomentumBar = ({ user, justSaved }) => {
    const [score, setScore] = useState(0);
    const [yesterdayScore, setYesterdayScore] = useState(0);
    const [consistency, setConsistency] = useState(0);
    const [showIncrement, setShowIncrement] = useState(false);
    const habitsEnabled = useFeatureFlag('habits_system_enabled');

    // Original formula — DO NOT modify weights
    const calcScore = (log) => {
        if (!log) return 0;
        let s = 0;
        if (log.sleep_hours && log.sleep_hours >= 5) s += 25;
        if (log.gym_done) s += 20;
        if (log.learning_done) s += 15;
        if (log.journal_entry && log.journal_entry.trim().length > 5) s += 10;
        if (log.steps && log.steps >= 5000) s += 10;
        // Focus: check if any pomodoro sessions exist today
        if (log.mood) s += 20; // Proxy for engagement
        return Math.min(s, 100);
    };

    // Routine completion component — blended only when habits_system_enabled
    // completionRatio: 0.0–1.0 (completed_habits / total_habits)
    const calcRoutineScore = (completionRatio) => {
        if (!habitsEnabled || completionRatio == null) return null;
        return completionRatio; // 0.0–1.0
    };

    // Blend base score with routine score, preserving 100-point ceiling
    const blendScore = (base, routineRatio) => {
        if (routineRatio == null) return base;
        // Scale base to 92%, routine contributes up to 8 pts
        return Math.min(100, Math.round(base * 0.92 + routineRatio * 8));
    };

    useEffect(() => {
        if (!user) return;
        const fetchMomentum = async () => {
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

            // Today's log
            const { data: todayLog } = await supabase
                .from('daily_logs')
                .select('*')
                .eq('user_id', user.id)
                .eq('date', today)
                .single();

            // Yesterday's log
            const { data: yLog } = await supabase
                .from('daily_logs')
                .select('*')
                .eq('user_id', user.id)
                .eq('date', yesterday)
                .single();

            // Last 7 days for consistency
            const { data: weekLogs } = await supabase
                .from('daily_logs')
                .select('date, gym_done, learning_done, sleep_hours')
                .eq('user_id', user.id)
                .gte('date', sevenDaysAgo)
                .order('date', { ascending: false });

            let routineRatio = null;
            if (habitsEnabled) {
                // Count today's habit_logs to compute routine completion ratio
                const { count: doneCount } = await supabase
                    .from('habit_logs')
                    .select('id', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .eq('status', 'done')
                    .gte('completed_at', `${today}T00:00:00+05:30`);
                const { count: totalCount } = await supabase
                    .from('habit_logs')
                    .select('id', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .gte('completed_at', `${today}T00:00:00+05:30`);
                if (totalCount > 0) {
                    routineRatio = (doneCount || 0) / totalCount;
                }
            }

            const baseToday = calcScore(todayLog);
            const baseYesterday = calcScore(yLog);
            const todayS = blendScore(baseToday, calcRoutineScore(routineRatio));
            const yesterdayS = blendScore(baseYesterday, null); // no routine data for yesterday

            setScore(todayS);
            setYesterdayScore(yesterdayS);

            if (weekLogs && weekLogs.length > 0) {
                const logged = weekLogs.length;
                setConsistency(Math.round((logged / 7) * 100));
            }
        };

        fetchMomentum();
    }, [user, justSaved, habitsEnabled]); // eslint-disable-line react-hooks/exhaustive-deps

    // Show +1 animation when save happens
    useEffect(() => {
        if (justSaved) {
            setShowIncrement(true);
            const t = setTimeout(() => setShowIncrement(false), 1000);
            return () => clearTimeout(t);
        }
    }, [justSaved]);

    const delta = score - yesterdayScore;
    const deltaColor = delta > 0 ? 'var(--success)' : delta < 0 ? 'var(--danger)' : 'var(--text-3)';
    const deltaText = delta > 0 ? `+${delta} vs yesterday` : delta < 0 ? `${delta} vs yesterday` : 'Same as yesterday';

    return (
        <div style={{ position: 'relative' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-1)', fontVariantNumeric: 'tabular-nums' }}>{score}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>/ 100</span>
                    {showIncrement && (
                        <span className="increment-pop" style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent)', position: 'absolute', top: '-4px', left: '70px' }}>+1</span>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: deltaColor }}>{deltaText}</span>
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: '99px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, color: 'var(--accent)' }}>
                        {consistency}% consistent
                    </div>
                </div>
            </div>

            {/* Bar */}
            <div className="momentum-bar">
                <div className="momentum-bar__fill momentum-fill" style={{ width: `${score}%` }} />
            </div>
        </div>
    );
};

export default MomentumBar;
