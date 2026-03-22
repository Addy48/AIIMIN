import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import { upsertRow, insertRow } from '../services/dbService';
import toast from '../utils/toast';
import { playSound, sendNotification, requestNotificationPermission } from '../utils/soundEngine';
import { POMODORO_XP, getRank } from '../utils/xpEngine';
import PomodoroReflection from './pomodoro/PomodoroReflection';
import PomodoroPresets from './pomodoro/PomodoroPresets';

const PomodoroTimer = ({ user }) => {
    const PRESETS = [
        { work: 25, rest: 5 },
        { work: 45, rest: 10 },
        { work: 90, rest: 20 },
    ];
    const [selectedPreset, setSelectedPreset] = useState(0);
    const [showCustom, setShowCustom] = useState(false);
    const [workDuration, setWorkDuration] = useState(PRESETS[0].work);
    const [breakDuration, setBreakDuration] = useState(PRESETS[0].rest);
    const [timeLeft, setTimeLeft] = useState(PRESETS[0].work * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [cyclesCompleted, setCyclesCompleted] = useState(0);
    const [showReflection, setShowReflection] = useState(false);
    const [sessionMood, setSessionMood] = useState(null);
    const [sessionNote, setSessionNote] = useState('');
    const [showCompletion, setShowCompletion] = useState(false);

    // Sync active state for UpcomingSidebar
    useEffect(() => {
        localStorage.setItem('aiimin_pomodoro_active', isRunning ? 'true' : 'false');
        window.dispatchEvent(new Event('aiimin_pomodoro_toggled'));
        return () => localStorage.removeItem('aiimin_pomodoro_active'); // Clear on unmount
    }, [isRunning]);

    const handlePresetSelect = (index) => {
        if (isRunning) return;
        setSelectedPreset(index);
        setShowCustom(false);
        setWorkDuration(PRESETS[index].work);
        setBreakDuration(PRESETS[index].rest);
        if (!isBreak) setTimeLeft(PRESETS[index].work * 60);
    };

    // Dynamic tab title during timer
    useEffect(() => {
        if (isRunning) {
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            document.title = `${isBreak ? '☕' : '🔥'} ${m}:${s} — AIIMIN`;
        } else if (!isRunning && timeLeft === 0) {
            document.title = isBreak ? '⏰ Break over! — AIIMIN' : '🎯 Session done! — AIIMIN';
        }
        return () => { if (!isRunning) document.title = 'AIIMIN'; };
    }, [isRunning, timeLeft, isBreak]);

    useEffect(() => {
        let interval;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isRunning && timeLeft === 0) {
            if (!isBreak) {
                const newCycles = cyclesCompleted + 1;
                setCyclesCompleted(newCycles);
                setIsRunning(false);
                setShowCompletion(true);
                playSound('chime');
                sendNotification('Focus session complete! 🎯', `Session #${newCycles} done — ${workDuration} min of deep work.`);
                toast.success(`Focus session #${newCycles} complete!`);
                // Record completed session to pomodoro_sessions
                if (user?.id) {
                    const today = new Date().toISOString().split('T')[0];
                    insertRow('pomodoro_sessions', [{
                        user_id: user.id,
                        date: today,
                        cycles_completed: 1,
                        duration: workDuration,
                    }]).catch(err => console.error('[Pomodoro] session save failed:', err.message));

                    // Award Pomodoro XP
                    (async () => {
                        try {
                            const { data: xp } = await supabase.from('user_xp')
                                .select('total_xp, current_rank').eq('user_id', user.id).maybeSingle();
                            if (xp) {
                                const newTotal = (xp.total_xp || 0) + POMODORO_XP;
                                const newRank = getRank(newTotal);
                                await upsertRow('user_xp', {
                                    user_id: user.id,
                                    total_xp: newTotal,
                                    current_rank: newRank.rank,
                                    power_level: newTotal,
                                    updated_at: new Date().toISOString(),
                                }, 'user_id');
                                toast.success(`⚡ +${POMODORO_XP} XP — Focus session`);
                            }
                        } catch { /* silent */ }
                    })();
                }
                setTimeout(() => {
                    setShowCompletion(false);
                    setShowReflection(true);
                }, 1500);
            } else {
                playSound('bell');
                sendNotification('Break over! ⚡', 'Time to get back to work.');
                setIsBreak(false);
                setTimeLeft(workDuration * 60);
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, isBreak, workDuration, breakDuration, cyclesCompleted, user?.id]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsBreak(false);
        setTimeLeft(workDuration * 60);
    };

    const totalDuration = isBreak ? breakDuration * 60 : workDuration * 60;
    const strokeDashoffset = (timeLeft / totalDuration) * 339.3;
    const accentColor = isBreak ? 'var(--success)' : 'var(--accent)';

    const handleDurationEdit = (type, val) => {
        let n = parseInt(val, 10);
        if (isNaN(n) || n < 1) n = 1;
        if (n > 120) n = 120;

        if (type === 'work') {
            setWorkDuration(n);
            if (!isRunning && !isBreak) setTimeLeft(n * 60);

            // Auto rest calculation (5m per 25m = 20%)
            const calculatedRest = Math.max(1, Math.round(n * 0.2));
            setBreakDuration(calculatedRest);
        } else {
            setBreakDuration(n);
            if (!isRunning && isBreak) setTimeLeft(n * 60);
        }
    };

    const handleSaveReflection = async () => {
        // Continue to break
        setShowReflection(false);
        setIsBreak(true);
        setTimeLeft(breakDuration * 60);
        setIsRunning(true);

        if (sessionMood || sessionNote.trim()) {
            try {
                const today = new Date().toISOString().split('T')[0];
                const noteText = `[Session Reflection]: Mood: ${sessionMood || 'N/A'}. Note: ${sessionNote.trim() || 'None'}`;

                // Fetch existing log
                const { data: log } = await supabase
                    .from('daily_logs')
                    .select('journal_entry')
                    .eq('date', today)
                    .single();

                const newJournal = log && log.journal_entry
                    ? log.journal_entry + '\n\n' + noteText
                    : noteText;

                if (user?.id) {
                    await upsertRow('daily_logs', {
                        user_id: user.id,
                        date: today,
                        journal_entry: newJournal
                    }, 'user_id,date');
                }

            } catch (e) { console.error("Could not save session note", e); }
        }

        setSessionMood(null);
        setSessionNote('');
    };

    const handleSkipReflection = () => {
        setShowReflection(false);
        setSessionMood(null);
        setSessionNote('');
        setIsBreak(true);
        setTimeLeft(breakDuration * 60);
        setIsRunning(true);
    };

    return (
        <div style={{
            textAlign: 'center',
            position: 'relative', height: '100%', display: 'flex', flexDirection: 'column'
        }} className={`fade-up ${isRunning ? 'glow-pulse' : ''}`}>

            <div style={{
                fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
                color: accentColor, marginBottom: '0px'
            }}>
                {isBreak ? '⚡ Break Time' : '🎯 Focus Session'}
            </div>

            <div style={{ position: 'relative', width: '140px', height: '140px', margin: 'auto' }}>
                <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="70" cy="70" r="64" stroke="var(--bg-elevated)" strokeWidth="6" fill="none" />
                    <circle
                        cx="70" cy="70" r="64" stroke={accentColor} strokeWidth="6" fill="none"
                        strokeDasharray="402.1" strokeDashoffset={isNaN(strokeDashoffset) ? 0 : (timeLeft / totalDuration) * 402.1}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                {!showReflection && (
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '32px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.04em',
                        fontVariantNumeric: 'tabular-nums', lineHeight: 1
                    }}>
                        {formatTime(timeLeft)}
                    </div>
                )}
            </div>

            {showReflection ? (
                <PomodoroReflection
                    sessionMood={sessionMood} setSessionMood={setSessionMood}
                    sessionNote={sessionNote} setSessionNote={setSessionNote}
                    onSave={handleSaveReflection} onSkip={handleSkipReflection}
                />
            ) : (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: 'auto' }}>
                    <button
                        onClick={() => { if (!isRunning) requestNotificationPermission(); setIsRunning(!isRunning); }}
                        onMouseEnter={(e) => { if (!isRunning) e.currentTarget.style.background = '#f7b84a'; }}
                        onMouseLeave={(e) => { if (!isRunning) e.currentTarget.style.background = '#f5a623'; }}
                        style={{
                            padding: '0 26px', height: '44px', borderRadius: '22px', border: isRunning ? '1px solid rgba(255,255,255,0.15)' : 'none',
                            background: isRunning ? 'rgba(255,255,255,0.08)' : '#f5a623', color: 'white',
                            fontSize: '14px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: isRunning ? 'none' : '0 4px 12px rgba(245,166,35,0.3)',
                        }}
                    >
                        {isRunning ? '⏸ Pause' : '▶ Begin'}
                    </button>
                    <button
                        onClick={handleReset}
                        className="hover:bg-[rgba(255,255,255,0.1)]"
                        style={{
                            width: '80px', height: '48px', borderRadius: '24px', background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: '13px',
                            fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        ↺ Reset
                    </button>
                </div>
            )}

            <PomodoroPresets
                presets={PRESETS} selectedPreset={selectedPreset}
                showCustom={showCustom} isRunning={isRunning}
                workDuration={workDuration} breakDuration={breakDuration}
                onPresetSelect={handlePresetSelect}
                onToggleCustom={() => { if (!isRunning) setShowCustom(!showCustom); }}
                onDurationEdit={handleDurationEdit}
            />

            <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-3)' }}>
                🔥 {cyclesCompleted} cycles completed today
            </div>

            {/* Completion Overlay */}
            {showCompletion && (
                <div className="completion-burst" style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)',
                    borderRadius: 'var(--r-lg)', zIndex: 10,
                }}>
                    <div className="check-pop" style={{ fontSize: '48px', marginBottom: '12px' }}>✓</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1)' }}>Session Complete</div>
                    <div style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600, marginTop: '4px' }}>
                        #{cyclesCompleted} today
                    </div>
                </div>
            )}

        </div>
    );
};

export default PomodoroTimer;
