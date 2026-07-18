import React, { useState, useEffect, useMemo } from 'react';
import { apiGet } from '../../utils/api';
import { useDailyLogsQuery } from '../../hooks/useDailyLogsQuery';
import { fmt, timeToMinutes, minutesToTime, circularMeanMinutes, circularDeviation } from './sleep/SleepHelpers';
import { MiniBar } from './sleep/SleepCharts';
import { RadialBarChart, RadialBar, LineChart, Line, XAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

/* ─── SleepAnalytics ─── */
const SleepAnalytics = ({ user }) => {
    const [sleepNeed, setSleepNeed] = useState(8.0);
    const [period, setPeriod] = useState(7); // 7 or 30

    const daysAgo = new Date(Date.now() - period * 86400000).toLocaleDateString('en-CA');
    const today = new Date().toLocaleDateString('en-CA');
    const { logsAsc: logs, loading: logsLoading } = useDailyLogsQuery({
        from: daysAgo,
        to: today,
        fields: 'date,sleep_start,sleep_end,sleep_hours,mood,gym_done,steps',
        enabled: Boolean(user?.id),
    });

    useEffect(() => {
        if (!user?.id) return;
        apiGet('/db/users', {
            params: { eq: JSON.stringify({ id: user.id }), maybeSingle: 'true' },
        }).then((row) => {
            if (row?.sleep_need_hours) setSleepNeed(Number(row.sleep_need_hours));
        }).catch(() => {});
    }, [user?.id]);

    const loading = logsLoading;

    const analytics = useMemo(() => {
        const validLogs = logs.filter(l => l.sleep_hours && l.sleep_hours > 0);
        if (!validLogs.length) return null;

        // ── Sleep Debt ──
        let runningDebt = 0;
        const debtHistory = validLogs.map(l => {
            const deficit = sleepNeed - l.sleep_hours;
            if (deficit > 0) {
                runningDebt += deficit;
            } else {
                // Recovery: surplus reduces debt at 60% efficiency
                runningDebt = Math.max(0, runningDebt + deficit * 0.6);
            }
            return { date: l.date, debt: Number(runningDebt.toFixed(1)), hours: l.sleep_hours };
        });
        const currentDebt = debtHistory.length ? debtHistory[debtHistory.length - 1].debt : 0;

        // ── Average Sleep ──
        const avgHours = validLogs.reduce((s, l) => s + l.sleep_hours, 0) / validLogs.length;

        // ── Bedtime & Wake Time Consistency ──
        const bedtimes = validLogs.map(l => timeToMinutes(l.sleep_start)).filter(Boolean);
        const waketimes = validLogs.map(l => timeToMinutes(l.sleep_end)).filter(Boolean);

        const avgBedtime = bedtimes.length ? circularMeanMinutes(bedtimes) : null;
        const avgWaketime = waketimes.length ? circularMeanMinutes(waketimes) : null;

        const bedtimeDev = bedtimes.length ? circularDeviation(bedtimes, avgBedtime) : 0;
        const waketimeDev = waketimes.length ? circularDeviation(waketimes, avgWaketime) : 0;

        // Consistency score: 100 = perfect, 0 = very irregular
        const consistencyScore = Math.max(0, Math.min(100,
            100 - ((bedtimeDev + waketimeDev) / 2 - 15) * (100 / 105)
        ));

        // ── Chronotype ──
        let chronotype = 'Intermediate';
        if (avgBedtime !== null) {
            const bedHour = avgBedtime >= 720 ? avgBedtime : avgBedtime + 1440; // normalize
            if (bedHour >= 1440 + 60) chronotype = 'Night Owl';
            else if (bedHour <= 1380) chronotype = 'Early Bird';
        }

        // ── Sleep quality distribution ──
        const good = validLogs.filter(l => l.sleep_hours >= 7).length;
        const ok = validLogs.filter(l => l.sleep_hours >= 5 && l.sleep_hours < 7).length;
        const poor = validLogs.filter(l => l.sleep_hours < 5).length;

        // ── Sleep → mood correlation ──
        const withMood = validLogs.filter(l => l.mood);
        let moodCorrelation = null;
        if (withMood.length >= 3) {
            const sleepArr = withMood.map(l => l.sleep_hours);
            const moodArr = withMood.map(l => l.mood);
            const n = sleepArr.length;
            const meanS = sleepArr.reduce((a, b) => a + b, 0) / n;
            const meanM = moodArr.reduce((a, b) => a + b, 0) / n;
            const num = sleepArr.reduce((a, s, i) => a + (s - meanS) * (moodArr[i] - meanM), 0);
            const denS = Math.sqrt(sleepArr.reduce((a, s) => a + (s - meanS) ** 2, 0));
            const denM = Math.sqrt(moodArr.reduce((a, m) => a + (m - meanM) ** 2, 0));
            moodCorrelation = denS && denM ? Number((num / (denS * denM)).toFixed(2)) : 0;
        }

        // ── Payback estimate ──
        const surplusPerNight = 1; // assume 1hr extra sleep per night
        const paybackNights = currentDebt > 0 ? Math.ceil(currentDebt / (surplusPerNight * 0.6)) : 0;

        return {
            avgHours, currentDebt, debtHistory,
            avgBedtime, avgWaketime,
            bedtimeDev: Math.round(bedtimeDev),
            waketimeDev: Math.round(waketimeDev),
            consistencyScore: Math.round(consistencyScore),
            chronotype, good, ok, poor,
            totalDays: validLogs.length,
            moodCorrelation, paybackNights,
            sleepTrend: validLogs.map(l => l.sleep_hours),
            debtTrend: debtHistory.map(d => d.debt),
        };
    }, [logs, sleepNeed]);

    if (loading) {
        return (
            <div style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div style={{ height: '20px', width: '40%', background: 'var(--bg-elevated)', borderRadius: '6px', marginBottom: '16px' }} />
                <div style={{ height: '60px', width: '100%', background: 'var(--bg-elevated)', borderRadius: '8px' }} />
            </div>
        );
    }

    if (!analytics) {
        return (
            <div style={{
                padding: '40px 24px', background: 'var(--bg-card)', borderRadius: '16px',
                border: '1px solid var(--border)', textAlign: 'center',
            }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>🌙</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>No Sleep Data Yet</div>
                <p style={{ fontSize: '12px', color: 'var(--text-3)', margin: 0 }}>Log sleep to generate analytics.</p>
            </div>
        );
    }

    const a = analytics;
    const debtColor = a.currentDebt === 0 ? 'var(--success)' : a.currentDebt <= 4 ? 'var(--warning)' : 'var(--danger)';
    const consistColor = a.consistencyScore >= 75 ? 'var(--success)' : a.consistencyScore >= 50 ? 'var(--warning)' : 'var(--danger)';

    return (
        <div style={{
            background: 'var(--bg-card)', borderRadius: '16px',
            border: '1px solid var(--border)', overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                padding: '20px 24px 16px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', borderBottom: '1px solid var(--border)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🌙</span>
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-1)' }}>Sleep Intelligence</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
                            {a.chronotype} · {a.totalDays} nights tracked
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex', gap: '2px', padding: '3px', borderRadius: '8px',
                    background: 'var(--bg-elevated)',
                }}>
                    {[7, 30].map(p => (
                        <button key={p} onClick={() => setPeriod(p)} style={{
                            padding: '5px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                            fontSize: '11px', fontWeight: 700,
                            background: period === p ? 'var(--bg-card)' : 'transparent',
                            color: period === p ? 'var(--text-1)' : 'var(--text-3)',
                            boxShadow: period === p ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.15s',
                        }}>
                            {p}d
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Stat Cards Row ── */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px',
                background: 'var(--border)',
            }}>
                {/* Average Hours */}
                <div style={{ padding: '16px 20px', background: 'var(--bg-card)' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                        Avg Sleep
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: a.avgHours >= sleepNeed ? 'var(--success)' : 'var(--text-1)' }}>
                        {fmt(a.avgHours)}h
                    </div>
                </div>

                {/* Sleep Debt */}
                <div style={{ padding: '16px 20px', background: 'var(--bg-card)' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                        Sleep Debt
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: debtColor }}>
                        {a.currentDebt === 0 ? '0' : `${fmt(a.currentDebt)}h`}
                    </div>
                </div>

                {/* Consistency */}
                <div style={{ padding: '16px 20px', background: 'var(--bg-card)' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                        Consistency
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: consistColor }}>
                        {a.consistencyScore}%
                    </div>
                </div>

                {/* Mood Correlation */}
                <div style={{ padding: '16px 20px', background: 'var(--bg-card)' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                        Mood Corr
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: a.moodCorrelation !== null && a.moodCorrelation > 0.3 ? 'var(--success)' : 'var(--text-2)' }}>
                        {a.moodCorrelation !== null ? (a.moodCorrelation > 0 ? '+' : '') + a.moodCorrelation : '—'}
                    </div>
                </div>
            </div>

            {/* ── Visual Section ── */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                {/* Sleep Score Gauge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '100px', height: '100px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: 'Score', value: a.consistencyScore, fill: consistColor }]} startAngle={180} endAngle={0}>
                                <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Overall Sleep Score</div>
                        <div style={{ fontSize: '32px', fontWeight: 900, color: consistColor }}>{a.consistencyScore}<span style={{ fontSize: '16px', color: 'var(--text-3)' }}>/100</span></div>
                    </div>
                </div>

                {/* 7-day consistency heatmap */}
                <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>7-Day Consistency</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {a.sleepTrend.slice(-7).map((score, i) => (
                            <div key={i} style={{ flex: 1, height: '24px', borderRadius: '4px', background: score >= (sleepNeed - 0.5) ? 'var(--success)' : score >= (sleepNeed - 2) ? 'var(--warning)' : 'var(--danger)', opacity: 0.8 }} />
                        ))}
                    </div>
                </div>

                {/* Debt Recovery Projection Line */}
                {a.currentDebt > 0 && (
                    <div style={{ height: '120px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Debt Recovery Projection</div>
                        <ResponsiveContainer>
                            <LineChart data={[{ day: 'Now', debt: a.currentDebt }, ...Array.from({ length: Math.min(a.paybackNights || 1, 14) }, (_, i) => ({ day: `+${i + 1}d`, debt: Math.max(0, a.currentDebt - ((i + 1) * 0.6)) }))]}>
                                <Line type="monotone" dataKey="debt" stroke="var(--success)" strokeWidth={2} dot={{ r: 3, fill: 'var(--bg-card)', stroke: 'var(--success)', strokeWidth: 2 }} />
                                <XAxis dataKey="day" hide />
                                <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="3 3" />
                                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Quality Distribution */}
                <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                        Night Quality
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: a.good, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <MiniBar value={a.good} max={a.totalDays} color="var(--success)" />
                            <div style={{ fontSize: '10px', textAlign: 'center', color: 'var(--success)', fontWeight: 700 }}>
                                {a.good} good
                            </div>
                        </div>
                        <div style={{ flex: a.ok || 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <MiniBar value={a.ok} max={a.totalDays} color="var(--warning)" />
                            <div style={{ fontSize: '10px', textAlign: 'center', color: 'var(--warning)', fontWeight: 700 }}>
                                {a.ok} ok
                            </div>
                        </div>
                        <div style={{ flex: a.poor || 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <MiniBar value={a.poor} max={a.totalDays} color="var(--danger)" />
                            <div style={{ fontSize: '10px', textAlign: 'center', color: 'var(--danger)', fontWeight: 700 }}>
                                {a.poor} poor
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule Card */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
                }}>
                    <div style={{
                        padding: '14px 16px', borderRadius: '12px',
                        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Avg Bedtime
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)' }}>
                            {a.avgBedtime !== null ? minutesToTime(a.avgBedtime) : '—'}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>
                            ±{a.bedtimeDev} min variance
                        </div>
                    </div>
                    <div style={{
                        padding: '14px 16px', borderRadius: '12px',
                        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Avg Wake Time
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)' }}>
                            {a.avgWaketime !== null ? minutesToTime(a.avgWaketime) : '—'}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>
                            ±{a.waketimeDev} min variance
                        </div>
                    </div>
                </div>

                {/* Debt Alert Banner */}
                {a.currentDebt >= 6 && (
                    <div style={{
                        padding: '14px 18px', borderRadius: '12px',
                        background: 'var(--danger-dim)', border: '1px solid rgba(239,68,68,0.2)',
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                    }}>
                        <span style={{ fontSize: '18px' }}>⚠️</span>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--danger)' }}>
                                Critical Sleep Debt
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-2)', marginTop: '3px', lineHeight: 1.5 }}>
                                You've accumulated {fmt(a.currentDebt)}h of sleep debt. Cognitive performance drops significantly above 6h.
                                Prioritize 9+ hour nights for the next {a.paybackNights} days.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SleepAnalytics;
