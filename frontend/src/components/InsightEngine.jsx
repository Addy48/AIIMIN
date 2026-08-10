import React, { useMemo } from 'react';
import DumbbellIcon from './icons/DumbbellIcon';
import { useDailyLogsRange } from '../hooks/useDailyLogsQuery';
import { useCorrelationsQuery } from '../hooks/useCorrelationsQuery';

const FIELDS = 'date,sleep_hours,gym_done,learning_done,mood,steps,journal_entry';

/**
 * InsightEngine — rule-based patterns + Spearman correlations from intelligence layer.
 */
const InsightEngine = ({ user, logs: logsProp }) => {
    const { logsAsc, loading: logsLoading } = useDailyLogsRange(30, {
        fields: FIELDS,
        enabled: Boolean(user && !logsProp),
    });
    const { correlations, insights: corrInsights, loading: corrLoading } = useCorrelationsQuery({
        enabled: Boolean(user),
    });

    const logs = logsProp || logsAsc;
    const loading = logsProp ? false : logsLoading;

    const insights = useMemo(() => {
        if (!logs || logs.length < 3) return [];

        const results = [];

        corrInsights.slice(0, 3).forEach((item) => {
            results.push({
                icon: '🔗',
                title: 'Signal correlation',
                body: item.headline,
                type: 'positive',
            });
        });

        correlations.slice(0, 2).forEach((c) => {
            if (results.some((r) => r.body === c.headline)) return;
            results.push({
                icon: '📊',
                title: `${c.signalALabel || c.signalA} ↔ ${c.signalBLabel || c.signalB}`,
                body: c.headline || `ρ=${c.rho?.toFixed(2)} over ${c.n} days.`,
                type: Math.abs(c.rho) >= 0.5 ? 'positive' : 'neutral',
            });
        });

        const withBoth = logs.filter((l) => l.sleep_hours && l.mood);
        if (withBoth.length >= 5) {
            const highSleep = withBoth.filter((l) => l.sleep_hours >= 7);
            const lowSleep = withBoth.filter((l) => l.sleep_hours < 6);
            const avgHigh = highSleep.length > 0 ? highSleep.reduce((s, l) => s + l.mood, 0) / highSleep.length : 0;
            const avgLow = lowSleep.length > 0 ? lowSleep.reduce((s, l) => s + l.mood, 0) / lowSleep.length : 0;
            if (avgHigh - avgLow > 0.5) {
                results.push({
                    icon: '😴',
                    title: 'Sleep boosts your mood',
                    body: `When you sleep 7+ hours, your mood averages ${avgHigh.toFixed(1)} vs ${avgLow.toFixed(1)} on low-sleep days.`,
                    type: 'positive',
                });
            }
        }

        const gymDays = logs.filter((l) => l.gym_done && l.mood);
        const noGymDays = logs.filter((l) => !l.gym_done && l.mood);
        if (gymDays.length >= 3 && noGymDays.length >= 3) {
            const gymMood = gymDays.reduce((s, l) => s + l.mood, 0) / gymDays.length;
            const noGymMood = noGymDays.reduce((s, l) => s + l.mood, 0) / noGymDays.length;
            if (gymMood - noGymMood > 0.3) {
                results.push({
                    icon: <DumbbellIcon size={16} color="var(--text-2)" />,
                    title: 'Exercise lifts your mood',
                    body: `Gym days: mood ${gymMood.toFixed(1)} avg. Rest days: ${noGymMood.toFixed(1)}. Keep training.`,
                    type: 'positive',
                });
            }
        }

        const dayMap = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };
        const dayScores = {};
        logs.forEach((l) => {
            const d = new Date(l.date).getDay();
            if (!dayScores[d]) dayScores[d] = { total: 0, count: 0 };
            let s = 0;
            if (l.sleep_hours >= 7) s += 1;
            if (l.gym_done) s += 1;
            if (l.learning_done) s += 1;
            if (l.mood && l.mood >= 4) s += 1;
            dayScores[d].total += s;
            dayScores[d].count += 1;
        });

        let bestDay = null;
        let bestAvg = 0;
        let worstDay = null;
        let worstAvg = Infinity;
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
                type: 'neutral',
            });
        }

        const loggedDays = logs.length;
        const pct = Math.round((loggedDays / 30) * 100);
        if (pct < 50) {
            results.push({
                icon: '⚠️',
                title: 'Logging consistency is low',
                body: `You've logged ${loggedDays} of the last 30 days (${pct}%). Aim for 5+ days per week.`,
                type: 'warning',
            });
        } else if (pct >= 80) {
            results.push({
                icon: '🏆',
                title: 'Elite consistency',
                body: `${loggedDays}/30 days logged (${pct}%). You're in the top tier of discipline.`,
                type: 'positive',
            });
        }

        return results;
    }, [logs, correlations, corrInsights]);

    if (loading || corrLoading) {
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
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '6px' }}>No Insights Yet</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.5 }}>Log a few more days and patterns will surface here automatically.</div>
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
