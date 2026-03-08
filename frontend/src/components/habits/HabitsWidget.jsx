/**
 * HabitsWidget.jsx
 *
 * Routine execution UI + morning reminder banner.
 * Gated by habits_system_enabled feature flag.
 *
 * Features:
 *  - Reminder banner: shown when time > 09:00 IST and morning routine not started today
 *  - Routine list: tap "Start" to launch checklist
 *  - Execution mode: optimistic habit check-off → POST to backend
 *  - Run completion: marks run fully done
 */
import React, { useState, useEffect, useCallback } from 'react';
import supabase from '../../utils/supabase';
import { API_URL as API_BASE } from '../../utils/api';

// Returns current hour in IST (frontend-side timezone check)
function getISTHour() {
    return parseInt(
        new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: 'numeric',
            hour12: false
        }),
        10
    );
}

export default function HabitsWidget({ user }) {
    const [routines, setRoutines] = useState([]);
    const [activeRun, setActiveRun] = useState(null);
    const [checkedIds, setCheckedIds] = useState(new Set());
    const [skippedIds, setSkippedIds] = useState(new Set());
    const [morningMissed, setMorningMissed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [summaryData, setSummaryData] = useState(null);

    // ─── Load routines ──────────────────────────────────────────────────────
    const fetchRoutines = useCallback(async () => {
        if (!user) return;
        const { data } = await supabase
            .from('routines')
            .select('id, name, time_of_day, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });
        setRoutines(data || []);
    }, [user]);

    // ─── Check if morning routine was started today (for reminder banner) ───
    const checkMorningReminder = useCallback(async () => {
        if (!user) return;
        const istHour = getISTHour();
        if (istHour < 9) return; // Before 09:00 IST — no reminder yet

        const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

        // Find any morning routine
        const { data: morningRoutines } = await supabase
            .from('routines')
            .select('id')
            .eq('user_id', user.id)
            .eq('time_of_day', 'morning');

        if (!morningRoutines?.length) return;

        // Check if a run exists today for any morning routine
        const routineIds = morningRoutines.map(r => r.id);
        const { data: runs } = await supabase
            .from('routine_runs')
            .select('id')
            .eq('user_id', user.id)
            .in('routine_id', routineIds)
            .gte('started_at', `${todayIST}T00:00:00+05:30`)
            .limit(1);

        setMorningMissed(!runs?.length);
    }, [user]);

    useEffect(() => {
        if (!user) return;
        fetchRoutines();
        checkMorningReminder();
    }, [user, fetchRoutines, checkMorningReminder]);

    // ─── Start a routine run ────────────────────────────────────────────────
    const handleStartRun = async (routineId) => {
        setLoading(true);
        try {
            const token = (await supabase.auth.getSession())?.data?.session?.access_token;
            const res = await fetch(`${API_BASE}/routines/${routineId}/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setActiveRun(data);
            setCheckedIds(new Set());
            setSkippedIds(new Set());
            setMorningMissed(false);
        } catch (err) {
            console.error('[HabitsWidget] start run error:', err);
        } finally {
            setLoading(false);
        }
    };

    // ─── Check / skip a habit (optimistic) ─────────────────────────────────
    const handleCheck = async (habitId, status = 'done') => {
        // Optimistic UI update first
        if (status === 'done') {
            setCheckedIds(prev => new Set([...prev, habitId]));
            setSkippedIds(prev => { const s = new Set(prev); s.delete(habitId); return s; });
        } else {
            setSkippedIds(prev => new Set([...prev, habitId]));
            setCheckedIds(prev => { const s = new Set(prev); s.delete(habitId); return s; });
        }

        try {
            const token = (await supabase.auth.getSession())?.data?.session?.access_token;
            await fetch(`${API_BASE}/routine-runs/${activeRun.run.id}/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ habit_id: habitId, status }),
            });
        } catch (err) {
            // Revert optimistic update on failure
            if (status === 'done') {
                setCheckedIds(prev => { const s = new Set(prev); s.delete(habitId); return s; });
            } else {
                setSkippedIds(prev => { const s = new Set(prev); s.delete(habitId); return s; });
            }
            console.error('[HabitsWidget] check error:', err);
        }
    };

    // ─── Complete the run ───────────────────────────────────────────────────
    const handleCompleteRun = async () => {
        setCompleting(true);
        try {
            const token = (await supabase.auth.getSession())?.data?.session?.access_token;
            await fetch(`${API_BASE}/routine-runs/${activeRun.run.id}/complete`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            // Show summary
            setSummaryData({
                routineName: routines.find(r => r.id === activeRun.run.routine_id)?.name || 'Routine',
                totalHabits: activeRun.habits.length,
                done: checkedIds.size,
                skipped: skippedIds.size,
            });
            setShowSummary(true);
            setActiveRun(null);
            fetchRoutines();
        } catch (err) {
            console.error('[HabitsWidget] complete run error:', err);
        } finally {
            setCompleting(false);
        }
    };

    if (!user) return null;

    const allActioned = activeRun
        ? activeRun.habits.every(h => checkedIds.has(h.id) || skippedIds.has(h.id))
        : false;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* ── Completion Summary ── */}
            {showSummary && summaryData && (
                <div style={{
                    background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)',
                    borderRadius: '14px', padding: '24px', textAlign: 'center',
                }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '4px' }}>
                        {summaryData.routineName} Complete!
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '14px' }}>
                        {summaryData.done}/{summaryData.totalHabits} done · {summaryData.skipped} skipped
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <div style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(16,185,129,0.15)', fontSize: '11px', fontWeight: 700, color: 'var(--success)' }}>
                            ✅ {summaryData.done} completed
                        </div>
                        {summaryData.skipped > 0 && (
                            <div style={{ padding: '6px 14px', borderRadius: '8px', background: 'var(--bg-elevated)', fontSize: '11px', fontWeight: 700, color: 'var(--text-3)' }}>
                                ⏭ {summaryData.skipped} skipped
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => { setShowSummary(false); setSummaryData(null); }}
                        style={{
                            marginTop: '14px', padding: '8px 20px', borderRadius: '8px',
                            background: 'var(--success)', color: '#fff', fontWeight: 700,
                            fontSize: '12px', border: 'none', cursor: 'pointer',
                        }}
                    >
                        Done
                    </button>
                </div>
            )}

            {/* Morning reminder banner */}
            {morningMissed && !activeRun && !showSummary && (
                <div style={{
                    background: 'rgba(255, 107, 53, 0.12)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <span style={{ fontSize: '16px' }}>⏰</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-2)', fontWeight: 500 }}>
                        Morning routine not started
                    </span>
                </div>
            )}

            {/* Active run — focused execution mode */}
            {activeRun ? (
                <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: '14px',
                    padding: '20px',
                    border: '1px solid var(--border)',
                }}>
                    {/* Routine header */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div>
                                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)' }}>
                                    {routines.find(r => r.id === activeRun.run.routine_id)?.name || 'Routine'}
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--text-3)', marginLeft: '8px', fontWeight: 500 }}>
                                    In progress
                                </span>
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                                {checkedIds.size + skippedIds.size}/{activeRun.habits.length}
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div style={{ height: '6px', borderRadius: '99px', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', borderRadius: '99px',
                                background: allActioned ? 'var(--success)' : 'var(--accent)',
                                width: `${activeRun.habits.length > 0 ? ((checkedIds.size + skippedIds.size) / activeRun.habits.length) * 100 : 0}%`,
                                transition: 'width 0.3s ease, background 0.3s ease',
                            }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {activeRun.habits.map(habit => {
                            const done    = checkedIds.has(habit.id);
                            const skipped = skippedIds.has(habit.id);
                            return (
                                <div key={habit.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 12px',
                                    borderRadius: '10px',
                                    background: done
                                        ? 'rgba(16, 185, 129, 0.08)'
                                        : skipped
                                            ? 'rgba(107, 114, 128, 0.06)'
                                            : 'var(--bg-elevated)',
                                    border: `1px solid ${done ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                }}>
                                    {/* Tap circle to toggle done */}
                                    <button
                                        onClick={() => handleCheck(habit.id, done ? 'skipped' : 'done')}
                                        style={{
                                            width: 22, height: 22, borderRadius: '50%',
                                            border: `2px solid ${done ? 'var(--success)' : 'var(--border-hover)'}`,
                                            background: done ? 'var(--success)' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', flexShrink: 0, padding: 0,
                                        }}
                                    >
                                        {done && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>✓</span>}
                                    </button>

                                    {/* Habit emoji */}
                                    {habit.emoji && (
                                        <span style={{ fontSize: '16px', flexShrink: 0, opacity: skipped ? 0.4 : 1 }}>
                                            {habit.emoji}
                                        </span>
                                    )}

                                    <span style={{
                                        fontSize: '13px', fontWeight: 500, flex: 1,
                                        color: done ? 'var(--success)' : skipped ? 'var(--text-3)' : 'var(--text-1)',
                                        textDecoration: skipped ? 'line-through' : 'none',
                                    }}>
                                        {habit.name}
                                    </span>

                                    {!done && !skipped && (
                                        <button
                                            onClick={() => handleCheck(habit.id, 'skipped')}
                                            style={{
                                                fontSize: '10px', color: 'var(--text-3)',
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                padding: '2px 6px',
                                            }}
                                        >
                                            skip
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {allActioned && (
                        <button
                            onClick={handleCompleteRun}
                            disabled={completing}
                            style={{
                                marginTop: '14px',
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                background: 'var(--success)',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '13px',
                                border: 'none',
                                cursor: completing ? 'not-allowed' : 'pointer',
                                opacity: completing ? 0.7 : 1,
                            }}
                        >
                            {completing ? 'Saving...' : '✓ Complete Routine'}
                        </button>
                    )}
                </div>
            ) : (
                /* Routine list */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {routines.length === 0 ? (
                        <p style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', padding: '16px 0' }}>
                            No routines yet. Create one to get started.
                        </p>
                    ) : (
                        routines.map(routine => (
                            <div key={routine.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 14px',
                                borderRadius: '10px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                            }}>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)' }}>
                                        {routine.name}
                                    </div>
                                    {routine.time_of_day && (
                                        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px', textTransform: 'capitalize' }}>
                                            {routine.time_of_day}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleStartRun(routine.id)}
                                    disabled={loading}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: '99px',
                                        background: 'var(--accent)',
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontSize: '11px',
                                        border: 'none',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.6 : 1,
                                    }}
                                >
                                    Start
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
