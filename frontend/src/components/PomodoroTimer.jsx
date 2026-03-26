import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Zap, Coffee } from 'lucide-react';
import supabase from '../utils/supabase';
import { upsertRow, insertRow } from '../services/dbService';
import toast from '../utils/toast';
import { playSound, sendNotification, requestNotificationPermission } from '../utils/soundEngine';
import { POMODORO_XP, getRank } from '../utils/xpEngine';
import PomodoroReflection from './pomodoro/PomodoroReflection';

const PomodoroTimer = ({ user, onClose }) => {


    const PRESETS = [
        { work: 15, rest: 5, label: 'Quick' },
        { work: 25, rest: 5, label: 'Standard' },
        { work: 45, rest: 10, label: 'Deep Work' },
        { work: 60, rest: 15, label: 'Flow' },
    ];
    
    const [selectedPreset, setSelectedPreset] = useState(0);
    const [showConfig, setShowConfig] = useState(true); // Default to true so user can see timing

    const [workDuration, setWorkDuration] = useState(() => {
        const stored = localStorage.getItem('aiimin_pomodoro_work');
        return stored ? parseInt(stored, 10) : PRESETS[0].work;
    });
    const [breakDuration, setBreakDuration] = useState(() => {
        const stored = localStorage.getItem('aiimin_pomodoro_break');
        return stored ? parseInt(stored, 10) : PRESETS[0].rest;
    });
    const [timeLeft, setTimeLeft] = useState(() => {
        const stored = localStorage.getItem('aiimin_pomodoro_work');
        return (stored ? parseInt(stored, 10) : PRESETS[0].work) * 60;
    });
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [cyclesCompleted, setCyclesCompleted] = useState(0);
    const [showReflection, setShowReflection] = useState(false);
    const [sessionMood, setSessionMood] = useState(null);
    const [sessionNote, setSessionNote] = useState('');
    const [showCompletion, setShowCompletion] = useState(false);

    useEffect(() => {
        localStorage.setItem('aiimin_pomodoro_active', isRunning ? 'true' : 'false');
        window.dispatchEvent(new Event('aiimin_pomodoro_toggled'));
        return () => localStorage.removeItem('aiimin_pomodoro_active');
    }, [isRunning]);

    const handlePresetSelect = (index) => {
        if (isRunning) return;
        setSelectedPreset(index);
        setWorkDuration(PRESETS[index].work);
        setBreakDuration(PRESETS[index].rest);
        if (!isBreak) setTimeLeft(PRESETS[index].work * 60);
    };

    useEffect(() => {
        if (isRunning) {
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            document.title = `${isBreak ? '☕' : '🔥'} ${m}:${s} — AIIMIN`;
        } else if (!isRunning && timeLeft === 0) {
            document.title = isBreak ? '⏰ Break over!' : '🎯 Session done!';
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
                
                if (user?.id) {
                    const today = new Date().toISOString().split('T')[0];
                    insertRow('pomodoro_sessions', [{
                        user_id: user.id,
                        date: today,
                        cycles_completed: 1,
                        duration: workDuration,
                    }]).catch(err => console.error('[Pomodoro] session save failed:', err.message));

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
    }, [isRunning, timeLeft, isBreak, workDuration, cyclesCompleted, user?.id]);

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
    const accentColor = isBreak ? 'var(--color-success)' : 'var(--color-rust)';

    const handleDurationEdit = (type, val) => {
        let n = parseInt(val, 10);
        if (isNaN(n) || n < 1) n = 1;
        if (n > 120) n = 120;

        if (type === 'work') {
            setWorkDuration(n);
            localStorage.setItem('aiimin_pomodoro_work', n.toString());
            if (!isRunning && !isBreak) setTimeLeft(n * 60);
        } else {
            setBreakDuration(n);
            localStorage.setItem('aiimin_pomodoro_break', n.toString());
            if (!isRunning && isBreak) setTimeLeft(n * 60);
        }
    };

    const handleSaveReflection = async () => {
        setShowReflection(false);
        setIsBreak(true);
        setTimeLeft(breakDuration * 60);
        setIsRunning(true);

        if (sessionMood || sessionNote.trim()) {
            try {
                const today = new Date().toISOString().split('T')[0];
                const noteText = `[Session Reflection]: Mood: ${sessionMood || 'N/A'}. Note: ${sessionNote.trim() || 'None'}`;
                const { data: log } = await supabase.from('daily_logs').select('journal_entry').eq('date', today).single();
                const newJournal = log && log.journal_entry ? log.journal_entry + '\n\n' + noteText : noteText;
                if (user?.id) {
                    await upsertRow('daily_logs', { user_id: user.id, date: today, journal_entry: newJournal }, 'user_id,date');
                }
            } catch (e) { console.error("Could not save session note", e); }
        }
        setSessionMood(null);
        setSessionNote('');
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>


            <AnimatePresence mode="wait">
                {showReflection ? (
                    <motion.div 
                        key="reflection"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{ width: '100%', zHeight: 20 }}
                    >
                        <PomodoroReflection
                            sessionMood={sessionMood} setSessionMood={setSessionMood}
                            sessionNote={sessionNote} setSessionNote={setSessionNote}
                            onSave={handleSaveReflection} onSkip={() => { setShowReflection(false); setIsBreak(true); setTimeLeft(breakDuration * 60); setIsRunning(true); }}
                        />
                    </motion.div>
                ) : (
                    <motion.div 
                        key="timer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', width: '100%' }}
                    >
                        <div style={{ 
                            fontSize: '11px', 
                            fontWeight: 800, 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.2em',
                            color: accentColor, 
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}>
                            {isBreak ? <><Coffee size={12} /> Break Time</> : <><Zap size={12} /> Deep Work</>}
                        </div>

                        <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 32px' }}>
                            <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="90" cy="90" r="84" stroke="var(--color-border)" strokeWidth="6" fill="none" />
                                <motion.circle
                                    cx="90" cy="90" r="84" 
                                    stroke={accentColor} 
                                    strokeWidth="6" 
                                    fill="none"
                                    strokeDasharray="527.7" 
                                    strokeDashoffset={(timeLeft / totalDuration) * 527.7}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                                />
                            </svg>
                            <div style={{
                                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                fontSize: '42px', fontWeight: 900, color: 'var(--color-text-1)', letterSpacing: '-0.05em',
                                fontVariantNumeric: 'tabular-nums', lineHeight: 1, fontFamily: 'var(--font-mono)'
                            }}>
                                {formatTime(timeLeft)}
                                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-3)', letterSpacing: '0.1em', marginTop: '4px' }}>
                                    {isBreak ? 'REMAINING' : 'FOCUSING'}
                                </div>
                            </div>
                        </div>


                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { if (!isRunning) requestNotificationPermission(); setIsRunning(!isRunning); }}
                                style={{
                                    width: '64px', height: '64px', borderRadius: '24px', border: 'none',
                                    background: isRunning ? 'var(--color-elevated)' : accentColor,
                                    color: isRunning ? 'var(--color-text-1)' : '#ffffff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    boxShadow: isRunning ? 'none' : '0 8px 24px var(--color-accent-glow)',
                                }}
                            >
                                {isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, background: 'var(--color-elevated)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleReset}
                                style={{
                                    width: '64px', height: '64px', borderRadius: '24px', 
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                <RotateCcw size={20} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowConfig(!showConfig)}
                                style={{
                                    width: '64px', height: '64px', borderRadius: '24px', 
                                    background: showConfig ? 'var(--color-elevated)' : 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    borderColor: showConfig ? accentColor : 'var(--color-border)',
                                    color: showConfig ? accentColor : 'var(--color-text-3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                <Settings size={20} />
                            </motion.button>
                        </div>

                        <AnimatePresence>
                            {showConfig && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div style={{ 
                                        padding: '20px', 
                                        background: 'var(--color-surface)', 
                                        borderRadius: '24px', 
                                        border: '1px solid var(--color-border)',
                                        marginBottom: '24px'
                                    }}>

                                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                                            {PRESETS.map((p, i) => (
                                                <motion.button
                                                    key={i}
                                                    whileHover={isRunning ? {} : { scale: 1.05 }}
                                                    whileTap={isRunning ? {} : { scale: 0.95 }}
                                                    onClick={() => handlePresetSelect(i)}
                                                    disabled={isRunning}
                                                    style={{
                                                        flex: 1, padding: '16px 8px', borderRadius: '32px', fontSize: '16px', fontWeight: 800,
                                                        border: selectedPreset === i ? 'none' : '1px solid var(--color-border)',
                                                        background: selectedPreset === i ? accentColor : 'var(--color-surface)',
                                                        color: selectedPreset === i ? '#ffffff' : 'var(--color-text-2)',
                                                        cursor: isRunning ? 'not-allowed' : 'pointer',
                                                        transition: 'all 0.2s',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        boxShadow: selectedPreset === i ? '0 4px 12px var(--color-accent-glow)' : 'none',
                                                    }}
                                                >
                                                    {p.work}m
                                                </motion.button>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', marginBottom: '6px' }}>Work</div>
                                                <input 
                                                    type="number" value={workDuration}
                                                    onChange={e => handleDurationEdit('work', e.target.value)}
                                                    disabled={isRunning}
                                                    style={{ width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '8px', color: 'var(--color-text-1)', textAlign: 'center', fontWeight: 700, outline: 'none' }}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', marginBottom: '6px' }}>Rest</div>
                                                <input 
                                                    type="number" value={breakDuration}
                                                    onChange={e => handleDurationEdit('rest', e.target.value)}
                                                    disabled={isRunning}
                                                    style={{ width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '8px', color: 'var(--color-text-1)', textAlign: 'center', fontWeight: 700, outline: 'none' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div style={{ fontSize: '12px', color: 'var(--color-text-3)', fontWeight: 600 }}>
                            🔥 {cyclesCompleted} cycles today • <span style={{ color: 'var(--color-accent)' }}>Mastery +{(cyclesCompleted * 10)}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {showCompletion && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', 
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--color-border)',
                        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                        zIndex: 100, borderRadius: '24px'
                    }}
                >
                    <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} style={{ fontSize: '64px', marginBottom: '16px' }}>🎯</motion.div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-text-1)' }}>Session Complete</div>
                    <div style={{ color: 'var(--color-text-2)', marginTop: '8px', fontWeight: 600 }}>Rest for {breakDuration} minutes</div>
                </motion.div>
            )}
        </div>
    );
};

export default PomodoroTimer;
