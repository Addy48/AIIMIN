import React, { useState, useEffect, useMemo } from 'react';
import supabase from '../utils/supabase';

/* ─── Helpers ─── */
const fmt = n => Number(n).toFixed(1);

const timeToMinutes = (t) => {
    if (!t) return null;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
};

const minutesToTime = (mins) => {
    const h = Math.floor(((mins % 1440) + 1440) % 1440 / 60);
    const m = Math.round(((mins % 1440) + 1440) % 1440 % 60);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

/* Circular mean for times (handles midnight wraparound) */
const circularMeanMinutes = (minutes) => {
    if (!minutes.length) return 0;
    const radians = minutes.map(m => (m / 1440) * 2 * Math.PI);
    const sinSum = radians.reduce((a, r) => a + Math.sin(r), 0) / radians.length;
    const cosSum = radians.reduce((a, r) => a + Math.cos(r), 0) / radians.length;
    let mean = Math.atan2(sinSum, cosSum) / (2 * Math.PI) * 1440;
    if (mean < 0) mean += 1440;
    return Math.round(mean);
};

/* Circular deviation (in minutes) from a mean */
const circularDeviation = (minutes, mean) => {
    if (!minutes.length) return 0;
    const diffs = minutes.map(m => {
        let d = Math.abs(m - mean);
        if (d > 720) d = 1440 - d;
        return d * d;
    });
    return Math.sqrt(diffs.reduce((a, b) => a + b, 0) / diffs.length);
};

/* ─── Mini Bar Chart (pure CSS) ─── */
const MiniBar = ({ value, max, color, height = 28 }) => {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div style={{
            width: '100%', height: `${height}px`, borderRadius: '4px',
            background: 'var(--bg-elevated)', overflow: 'hidden',
        }}>
            <div style={{
                width: `${pct}%`, height: '100%', borderRadius: '4px',
                background: color, transition: 'width 0.4s ease',
                minWidth: pct > 0 ? '2px' : '0',
            }} />
        </div>
    );
};

/* ─── Sparkline (SVG) ─── */
const Sparkline = ({ data, color, height = 40, width = '100%' }) => {
    if (!data.length) return null;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const svgW = 200;
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1 || 1)) * svgW;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${svgW} ${height}`} style={{ width, height, display: 'block' }} preserveAspectRatio="none">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Endpoint dot */}
            {data.length > 0 && (() => {
                const lastX = svgW;
                const lastY = height - ((data[data.length - 1] - min) / range) * (height - 4) - 2;
                return <circle cx={lastX} cy={lastY} r="3" fill={color} />;
            })()}
        </svg>
    );
};

/* ─── SleepAnalytics ─── */
const SleepAnalytics = ({ user }) => {
    const [logs, setLogs] = useState([]);
    const [sleepNeed, setSleepNeed] = useState(8.0);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState(7); // 7 or 30

    useEffect(() => {
        if (!user?.id) return;

        const fetch = async () => {
            setLoading(true);
            const daysAgo = new Date(Date.now() - period * 86400000).toISOString().split('T')[0];

            const [logsRes, userRes] = await Promise.all([
                supabase
                    .from('daily_logs')
                    .select('date, sleep_start, sleep_end, sleep_hours, mood, gym_done, steps')
                    .eq('user_id', user.id)
                    .gte('date', daysAgo)
                    .is('deleted_at', null)
                    .order('date', { ascending: true }),
                supabase
                    .from('users')
                    .select('sleep_need_hours')
                    .eq('id', user.id)
                    .single(),
            ]);

            if (logsRes.data) setLogs(logsRes.data);
            if (userRes.data?.sleep_need_hours) setSleepNeed(Number(userRes.data.sleep_need_hours));
            setLoading(false);
        };

        fetch();
    }, [user, period]);

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
        // 30min dev = 100, 120min dev = 0
        const consistencyScore = Math.max(0, Math.min(100,
            100 - ((bedtimeDev + waketimeDev) / 2 - 15) * (100 / 105)
        ));

        // ── Chronotype ──
        let chronotype = 'Intermediate';
        if (avgBedtime !== null) {
            // Bedtime after midnight (0-180 = 12:00 AM to 3:00 AM) or before midnight (1320-1440 = 10PM-12AM)
            const bedHour = avgBedtime >= 720 ? avgBedtime : avgBedtime + 1440; // normalize
            if (bedHour >= 1440 + 60) chronotype = 'Night Owl'; // after 1 AM
            else if (bedHour <= 1380) chronotype = 'Early Bird'; // before 11 PM
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
                <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '6px' }}>
                    Log your first sleep entry in Today's Log to see analytics.
                </p>
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

                {/* Period toggle */}
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
                    <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '3px' }}>
                        target: {fmt(sleepNeed)}h
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
                    <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '3px' }}>
                        {a.currentDebt === 0 ? 'all clear' : `~${a.paybackNights} nights to clear`}
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
                    <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '3px' }}>
                        ±{a.bedtimeDev}min bedtime var
                    </div>
                </div>

                {/* Mood Correlation */}
                <div style={{ padding: '16px 20px', background: 'var(--bg-card)' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                        Sleep → Mood
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: a.moodCorrelation !== null && a.moodCorrelation > 0.3 ? 'var(--success)' : 'var(--text-2)' }}>
                        {a.moodCorrelation !== null ? (a.moodCorrelation > 0 ? '+' : '') + a.moodCorrelation : '—'}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '3px' }}>
                        {a.moodCorrelation !== null
                            ? a.moodCorrelation > 0.5 ? 'strong link' : a.moodCorrelation > 0.2 ? 'moderate link' : 'weak link'
                            : 'need more data'
                        }
                    </div>
                </div>
            </div>

            {/* ── Visual Section ── */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Sleep Hours Trend */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Hours Trend
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                            last {a.sleepTrend.length} nights
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Sparkline data={a.sleepTrend} color="var(--accent)" height={48} />
                        {/* Target line indicator */}
                        <div style={{
                            position: 'absolute', right: 0, top: 0,
                            fontSize: '9px', color: 'var(--text-3)', fontWeight: 600,
                        }}>
                            {fmt(a.sleepTrend[a.sleepTrend.length - 1])}h
                        </div>
                    </div>
                </div>

                {/* Debt Trend */}
                {a.currentDebt > 0 && (
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                            Debt Accumulation
                        </div>
                        <Sparkline data={a.debtTrend} color={debtColor} height={36} />
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
