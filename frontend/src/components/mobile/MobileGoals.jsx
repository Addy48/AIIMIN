import React, { useState, useEffect, useCallback } from 'react';
import supabase from '../../utils/supabase';
import { upsertRow, insertRow } from '../../services/dbService';
import toast from '../../utils/toast';

const METRIC_OPTIONS = [
    { id: 'gym_days',    label: 'Gym sessions',    icon: '💪', unit: 'days',    getCount: logs => logs.filter(l => l.gym_done).length },
    { id: 'steps_avg',   label: 'Avg steps',       icon: '👟', unit: 'steps',   getCount: logs => logs.length ? Math.round(logs.reduce((s, l) => s + (l.steps || 0), 0) / logs.length) : 0 },
    { id: 'sleep_7h',    label: 'Sleep 7h+ days',  icon: '💤', unit: 'days',    getCount: logs => logs.filter(l => (l.sleep_hours || 0) >= 7).length },
    { id: 'water_4',     label: 'Water 4+ days',   icon: '💧', unit: 'days',    getCount: logs => logs.filter(l => (l.water_bottles || 0) >= 4).length },
    { id: 'learning',    label: 'Learning days',   icon: '📚', unit: 'days',    getCount: logs => logs.filter(l => l.learning_done).length },
    { id: 'journal',     label: 'Journal entries',  icon: '✍️', unit: 'entries', getCount: logs => logs.filter(l => l.journal_entry?.trim()).length },
    { id: 'pomodoro',    label: 'Focus sessions',  icon: '🍅', unit: 'sessions', getCount: null }, // special handling
    { id: 'clean_days',  label: 'Clean days',      icon: '🛡️', unit: 'days',    getCount: logs => logs.filter(l => !l.rc_count || l.rc_count === 0).length },
];

const MobileGoals = ({ user }) => {
    const [goals, setGoals] = useState([]);
    const [progress, setProgress] = useState({});
    const [expanded, setExpanded] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [newMetric, setNewMetric] = useState('gym_days');
    const [newTarget, setNewTarget] = useState('');
    const [newFreq, setNewFreq] = useState('weekly');
    const [loading, setLoading] = useState(true);

    const fetchGoals = useCallback(async () => {
        if (!user) return;
        const { data } = await supabase.from('goals')
            .select('*').eq('user_id', user.id).is('deleted_at', null)
            .order('created_at', { ascending: false });
        setGoals(data || []);
    }, [user]);

    // Fetch goals + compute progress
    useEffect(() => {
        if (!user) return;
        (async () => {
            setLoading(true);
            await fetchGoals();

            // Fetch logs for progress calculation
            const now = new Date();
            const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
            const monthAgo = new Date(now); monthAgo.setDate(monthAgo.getDate() - 30);

            const { data: weekLogs } = await supabase.from('daily_logs')
                .select('*').eq('user_id', user.id)
                .gte('date', weekAgo.toLocaleDateString('en-CA'))
                .order('date', { ascending: false });

            const { data: monthLogs } = await supabase.from('daily_logs')
                .select('*').eq('user_id', user.id)
                .gte('date', monthAgo.toLocaleDateString('en-CA'))
                .order('date', { ascending: false });

            const todayStr = now.toLocaleDateString('en-CA');
            const { data: todayLog } = await supabase.from('daily_logs')
                .select('*').eq('user_id', user.id).eq('date', todayStr).maybeSingle();

            // Pomodoro counts
            const { count: weekPomo } = await supabase.from('pomodoro_sessions')
                .select('id', { count: 'exact', head: true }).eq('user_id', user.id)
                .gte('date', weekAgo.toLocaleDateString('en-CA'));
            const { count: monthPomo } = await supabase.from('pomodoro_sessions')
                .select('id', { count: 'exact', head: true }).eq('user_id', user.id)
                .gte('date', monthAgo.toLocaleDateString('en-CA'));
            const { count: dayPomo } = await supabase.from('pomodoro_sessions')
                .select('id', { count: 'exact', head: true }).eq('user_id', user.id)
                .eq('date', todayStr);

            const prog = {};
            const logSets = { daily: todayLog ? [todayLog] : [], weekly: weekLogs || [], monthly: monthLogs || [] };
            const pomoSets = { daily: dayPomo || 0, weekly: weekPomo || 0, monthly: monthPomo || 0 };

            for (const g of (goals || [])) {
                const metricDef = METRIC_OPTIONS.find(m => m.id === g.metric);
                if (!metricDef) continue;
                const logs = logSets[g.frequency] || logSets.weekly;
                let current;
                if (g.metric === 'pomodoro') {
                    current = pomoSets[g.frequency] || 0;
                } else {
                    current = metricDef.getCount(logs);
                }
                prog[g.id] = { current, target: g.target, pct: Math.min(current / g.target, 1) };
            }
            setProgress(prog);
            setLoading(false);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, fetchGoals, goals.length]);

    const handleAdd = async () => {
        if (!newTarget || isNaN(newTarget) || Number(newTarget) <= 0) return;
        try {
            await insertRow('goals', {
                user_id: user.id, metric: newMetric,
                target: Number(newTarget), frequency: newFreq,
                start_date: new Date().toLocaleDateString('en-CA'),
            });
            setShowAdd(false);
            setNewTarget('');
            await fetchGoals();
            toast.success('Goal added');
        } catch (err) {
            toast.error('Failed to add goal');
        }
    };

    const handleDelete = async (id) => {
        try {
            await upsertRow('goals', { id, deleted_at: new Date().toISOString() }, 'id');
            setGoals(prev => prev.filter(g => g.id !== id));
        } catch { /* silent */ }
    };

    if (loading && goals.length === 0) return null;

    const activeGoals = goals.filter(g => !g.deleted_at);

    return (
        <div style={{
            background: 'var(--bg-card)', borderRadius: '14px', padding: '16px',
            border: '1px solid var(--border)', margin: '0 16px',
        }}>
            <div
                onClick={() => setExpanded(!expanded)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🎯 Goals
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
                        {activeGoals.length} active {expanded ? '▴' : '▾'}
                    </span>
                </div>
            </div>

            {/* Compact progress bubbles */}
            {activeGoals.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {activeGoals.map(g => {
                        const p = progress[g.id];
                        const metricDef = METRIC_OPTIONS.find(m => m.id === g.metric);
                        const pct = p?.pct || 0;
                        const color = pct >= 1 ? '#10b981' : pct >= 0.5 ? '#f59e0b' : 'var(--text-3)';
                        return (
                            <div key={g.id} style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                padding: '4px 10px', borderRadius: '8px',
                                background: pct >= 1 ? 'rgba(16,185,129,0.1)' : 'var(--bg-elevated)',
                                border: `1px solid ${pct >= 1 ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
                            }}>
                                <span style={{ fontSize: '11px' }}>{metricDef?.icon}</span>
                                <span style={{ fontSize: '11px', fontWeight: 700, color }}>{Math.round(pct * 100)}%</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {expanded && (
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activeGoals.map(g => {
                        const p = progress[g.id];
                        const metricDef = METRIC_OPTIONS.find(m => m.id === g.metric);
                        const pct = p?.pct || 0;
                        const done = pct >= 1;
                        return (
                            <div key={g.id} style={{
                                padding: '12px', borderRadius: '10px',
                                background: done ? 'rgba(16,185,129,0.06)' : 'var(--bg-elevated)',
                                border: `1px solid ${done ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '16px' }}>{metricDef?.icon}</span>
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>
                                                {metricDef?.label}
                                            </div>
                                            <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>
                                                {g.frequency} · target: {g.target} {metricDef?.unit}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 800, color: done ? '#10b981' : 'var(--text-1)' }}>
                                            {p?.current || 0}/{g.target}
                                        </span>
                                        <button onClick={() => handleDelete(g.id)} style={{
                                            background: 'none', border: 'none', fontSize: '12px',
                                            color: 'var(--text-3)', cursor: 'pointer', padding: '4px',
                                        }}>✕</button>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div style={{
                                    marginTop: '8px', height: '6px', borderRadius: '3px',
                                    background: 'var(--border)', overflow: 'hidden',
                                }}>
                                    <div style={{
                                        height: '100%', borderRadius: '3px',
                                        width: `${Math.min(pct * 100, 100)}%`,
                                        background: done ? '#10b981' : pct >= 0.5 ? '#f59e0b' : 'var(--accent)',
                                        transition: 'width 0.6s ease',
                                    }} />
                                </div>
                                {done && (
                                    <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>
                                        ✓ Goal achieved!
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Add goal form */}
                    {showAdd ? (
                        <div style={{
                            padding: '12px', borderRadius: '10px',
                            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                            display: 'flex', flexDirection: 'column', gap: '8px',
                        }}>
                            <select value={newMetric} onChange={e => setNewMetric(e.target.value)} style={{
                                padding: '8px', borderRadius: '8px', border: '1px solid var(--border)',
                                background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: '13px',
                            }}>
                                {METRIC_OPTIONS.map(m => (
                                    <option key={m.id} value={m.id}>{m.icon} {m.label}</option>
                                ))}
                            </select>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="number" placeholder="Target" value={newTarget}
                                    onChange={e => setNewTarget(e.target.value)}
                                    style={{
                                        flex: 1, padding: '8px', borderRadius: '8px',
                                        border: '1px solid var(--border)', background: 'var(--bg-card)',
                                        color: 'var(--text-1)', fontSize: '13px',
                                    }}
                                />
                                <select value={newFreq} onChange={e => setNewFreq(e.target.value)} style={{
                                    padding: '8px', borderRadius: '8px', border: '1px solid var(--border)',
                                    background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: '13px',
                                }}>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={handleAdd} style={{
                                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                                    background: 'var(--accent)', color: '#fff', fontWeight: 700,
                                    fontSize: '13px', cursor: 'pointer',
                                }}>Add Goal</button>
                                <button onClick={() => setShowAdd(false)} style={{
                                    padding: '8px 14px', borderRadius: '8px',
                                    border: '1px solid var(--border)', background: 'var(--bg-card)',
                                    color: 'var(--text-3)', fontSize: '13px', cursor: 'pointer',
                                }}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setShowAdd(true)} style={{
                            padding: '10px', borderRadius: '10px',
                            border: '1px dashed var(--border)', background: 'transparent',
                            color: 'var(--text-3)', fontSize: '12px', fontWeight: 600,
                            cursor: 'pointer',
                        }}>+ Add a goal</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MobileGoals;
