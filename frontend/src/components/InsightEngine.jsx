import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

/**
 * InsightEngine — Behavioral pattern recognition
 *
 * Queries last 30 days of daily_logs and computes:
 * - Sleep vs mood correlation
 * - Gym days vs mood average
 * - Best day of week
 * - Weakest pattern
 *
 * No ML — just structured rule logic with plain-language summaries.
 */
const InsightEngine = ({ user }) => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const analyze = async () => {
            setLoading(true);
            const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

            const { data: logs, error } = await supabase
                .from('daily_logs')
                .select('date, sleep_hours, gym_done, learning_done, mood, steps, journal_entry')
                .eq('user_id', user.id)
                .gte('date', thirtyDaysAgo)
                .order('date', { ascending: true });

            if (error || !logs || logs.length < 3) {
                setLoading(false);
                return;
            }

            const results = [];

            // 1. Sleep vs Mood
            const withBoth = logs.filter(l => l.sleep_hours && l.mood);
            if (withBoth.length >= 5) {
                const highSleep = withBoth.filter(l => l.sleep_hours >= 7);
                const lowSleep = withBoth.filter(l => l.sleep_hours < 6);
                const avgHigh = highSleep.length > 0 ? highSleep.reduce((s, l) => s + l.mood, 0) / highSleep.length : 0;
                const avgLow = lowSleep.length > 0 ? lowSleep.reduce((s, l) => s + l.mood, 0) / lowSleep.length : 0;
                if (avgHigh - avgLow > 0.5) {
                    results.push({
                        icon: '😴',
                        title: 'Sleep boosts your mood',
                        body: `When you sleep 7+ hours, your mood averages ${avgHigh.toFixed(1)} vs ${avgLow.toFixed(1)} on low-sleep days.`,
                        type: 'positive'
                    });
                }
            }

            // 2. Gym vs Mood
            const gymDays = logs.filter(l => l.gym_done && l.mood);
            const noGymDays = logs.filter(l => !l.gym_done && l.mood);
            if (gymDays.length >= 3 && noGymDays.length >= 3) {
                const gymMood = gymDays.reduce((s, l) => s + l.mood, 0) / gymDays.length;
                const noGymMood = noGymDays.reduce((s, l) => s + l.mood, 0) / noGymDays.length;
                if (gymMood - noGymMood > 0.3) {
                    results.push({
                        icon: '💪',
                        title: 'Exercise lifts your mood',
                        body: `Gym days: mood ${gymMood.toFixed(1)} avg. Rest days: ${noGymMood.toFixed(1)}. Keep training.`,
                        type: 'positive'
                    });
                }
            }

            // 3. Best day of week
            const dayMap = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
            const dayScores = {};
            logs.forEach(l => {
                const d = new Date(l.date).getDay();
                if (!dayScores[d]) dayScores[d] = { total: 0, count: 0 };
                let s = 0;
                if (l.sleep_hours >= 7) s++;
                if (l.gym_done) s++;
                if (l.learning_done) s++;
                if (l.mood && l.mood >= 4) s++;
                dayScores[d].total += s;
                dayScores[d].count++;
            });

            let bestDay = null, bestAvg = 0, worstDay = null, worstAvg = Infinity;
            Object.entries(dayScores).forEach(([d, v]) => {
                const avg = v.total / v.count;
                if (avg > bestAvg) { bestAvg = avg; bestDay = d; }
                if (avg < worstAvg) { worstAvg = avg; worstDay = d; }
            });

            if (bestDay !== null) {
                results.push({
                    icon: '📅',
                    title: `${dayMap[bestDay]} is your power day`,
                    body: `You score highest on ${dayMap[bestDay]}s. Your weakest day is ${dayMap[worstDay]} — consider adding structure there.`,
                    type: 'neutral'
                });
            }

            // 4. Consistency check
            const loggedDays = logs.length;
            const pct = Math.round((loggedDays / 30) * 100);
            if (pct < 50) {
                results.push({
                    icon: '⚠️',
                    title: 'Logging consistency is low',
                    body: `You've logged ${loggedDays} of the last 30 days (${pct}%). Aim for 5+ days per week.`,
                    type: 'warning'
                });
            } else if (pct >= 80) {
                results.push({
                    icon: '🏆',
                    title: 'Elite consistency',
                    body: `${loggedDays}/30 days logged (${pct}%). You're in the top tier of discipline.`,
                    type: 'positive'
                });
            }

            setInsights(results);
            setLoading(false);
        };

        analyze();
    }, [user]);

    if (loading) {
        return (
            <div className="insight-card">
                <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                <div className="skeleton skeleton-text" style={{ width: '90%' }} />
                <div className="skeleton skeleton-text" style={{ width: '40%' }} />
            </div>
        );
    }

    if (insights.length === 0) {
        return (
            <div className="insight-card" style={{ textAlign: 'center', padding: '32px 24px' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>🧠</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '6px' }}>Insights Unlock Soon</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.5 }}>Log at least 5 days for pattern detection.</div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="reveal-up">
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                🧠 Pattern Insights
            </div>
            {insights.map((insight, i) => (
                <div key={i} className="insight-card card-hover">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <span style={{ fontSize: '20px', flexShrink: 0 }}>{insight.icon}</span>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>{insight.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.5 }}>{insight.body}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InsightEngine;
