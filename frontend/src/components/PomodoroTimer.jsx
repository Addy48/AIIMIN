import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

window.supabase = supabase; // Fallback for the inline callback

const PomodoroTimer = () => {
    const [workDuration, setWorkDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [cyclesCompleted, setCyclesCompleted] = useState(0);
    const [isEditingWork, setIsEditingWork] = useState(false);
    const [isEditingBreak, setIsEditingBreak] = useState(false);
    const [showReflection, setShowReflection] = useState(false);
    const [sessionMood, setSessionMood] = useState(null);
    const [sessionNote, setSessionNote] = useState('');

    useEffect(() => {
        let interval;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isRunning && timeLeft === 0) {
            if (!isBreak) {
                setCyclesCompleted(prev => prev + 1);
                setIsRunning(false);
                setShowReflection(true);
            } else {
                setIsBreak(false);
                setTimeLeft(workDuration * 60);
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft, isBreak, workDuration, breakDuration]);

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
    const accentColor = isBreak ? '#00d97e' : '#f5a623';

    const handleDurationEdit = (type, val) => {
        let n = parseInt(val, 10);
        if (isNaN(n) || n < 1) n = 1;
        if (n > 60) n = 60;

        if (type === 'work') {
            setWorkDuration(n);
            setIsEditingWork(false);
            if (!isRunning && !isBreak) setTimeLeft(n * 60);
        } else {
            setBreakDuration(n);
            setIsEditingBreak(false);
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
                // We'll import supabase dynamically or expect it at window level if not imported.
                // Wait, we need to import supabase at the top of the file!
                // Let's do that in a separate chunk.
                const today = new Date().toISOString().split('T')[0];
                const noteText = `[Session Reflection]: Mood: ${sessionMood || 'N/A'}. Note: ${sessionNote.trim() || 'None'}`;

                // Fetch existing log
                const { data: log } = await window.supabase
                    .from('daily_logs')
                    .select('journal_entry')
                    .eq('date', today)
                    .single();

                const newJournal = log && log.journal_entry
                    ? log.journal_entry + '\n\n' + noteText
                    : noteText;

                await window.supabase
                    .from('daily_logs')
                    .upsert({
                        date: today,
                        journal_entry: newJournal
                    }, { onConflict: 'user_id,date' });

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
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '32px', textAlign: 'center',
            boxShadow: 'var(--shadow-md)', marginBottom: '28px'
        }} className="fade-up">

            <div style={{
                fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
                color: accentColor, marginBottom: '8px'
            }}>
                {isBreak ? '⚡ Break Time' : '🎯 Focus Session'}
            </div>

            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '16px auto' }}>
                <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r="54" stroke="var(--border-hover)" strokeWidth="6" fill="none" />
                    <circle
                        cx="60" cy="60" r="54" stroke={accentColor} strokeWidth="6" fill="none"
                        strokeDasharray="339.3" strokeDashoffset={isNaN(strokeDashoffset) ? 0 : strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                {!showReflection && (
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '28px', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-1px',
                        fontVariantNumeric: 'tabular-nums', lineHeight: 1
                    }}>
                        {formatTime(timeLeft)}
                    </div>
                )}
            </div>

            {showReflection ? (
                <div className="fade-up" style={{
                    marginTop: '16px', padding: '20px', background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-accent)', borderRadius: '16px',
                    boxShadow: 'var(--shadow-md)', textAlign: 'left'
                }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '12px' }}>
                        Great focus! Quick reflection:
                    </h4>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        {['😔', '😕', '😐', '🙂', '🔥'].map((emoji, i) => (
                            <button
                                key={i}
                                onClick={() => setSessionMood(emoji)}
                                style={{
                                    flex: 1, height: '36px', borderRadius: '8px', border: '1px solid var(--border)',
                                    background: sessionMood === emoji ? 'var(--accent-dim)' : 'var(--bg-card)',
                                    borderColor: sessionMood === emoji ? 'var(--accent)' : 'var(--border)',
                                    fontSize: '18px', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                    <textarea
                        placeholder="Key insight or struggle... (optional)"
                        value={sessionNote}
                        onChange={(e) => setSessionNote(e.target.value)}
                        style={{
                            width: '100%', height: '60px', borderRadius: '8px', padding: '10px',
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                            color: 'var(--text-1)', fontSize: '13px', resize: 'none', outline: 'none',
                            marginBottom: '16px'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={handleSkipReflection} style={{
                            flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--bg-card)',
                            border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
                        }}>Skip</button>
                        <button onClick={handleSaveReflection} style={{
                            flex: 2, padding: '10px', borderRadius: '8px', background: 'var(--accent)',
                            border: 'none', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
                        }}>Save & Take Break</button>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        onMouseEnter={(e) => { if (!isRunning) e.currentTarget.style.background = '#f7b84a'; }}
                        onMouseLeave={(e) => { if (!isRunning) e.currentTarget.style.background = '#f5a623'; }}
                        style={{
                            padding: '0 24px', height: '48px', borderRadius: '24px', border: isRunning ? '1px solid rgba(255,255,255,0.15)' : 'none',
                            background: isRunning ? 'rgba(255,255,255,0.08)' : '#f5a623', color: 'white',
                            fontSize: '15px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: isRunning ? 'none' : '0 4px 14px rgba(245,166,35,0.4)',
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

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-2)' }}>
                    Focus
                    {isEditingWork ? (
                        <input
                            type="number" autoFocus defaultValue={workDuration}
                            onBlur={(e) => handleDurationEdit('work', e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleDurationEdit('work', e.target.value)}
                            style={{
                                width: '48px', textAlign: 'center', background: '#1e1e2f', border: '1px solid rgba(245,166,35,0.4)',
                                borderRadius: '6px', color: '#f5a623', fontSize: '14px', fontWeight: 700, padding: '4px'
                            }}
                        />
                    ) : (
                        <span
                            onClick={() => setIsEditingWork(true)}
                            style={{ color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', borderBottom: '1px dashed var(--border-accent)' }}
                        >
                            {workDuration}
                        </span>
                    )}
                    min
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-2)' }}>
                    Break
                    {isEditingBreak ? (
                        <input
                            type="number" autoFocus defaultValue={breakDuration}
                            onBlur={(e) => handleDurationEdit('break', e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleDurationEdit('break', e.target.value)}
                            style={{
                                width: '48px', textAlign: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border-accent)',
                                borderRadius: '6px', color: 'var(--accent)', fontSize: '14px', fontWeight: 700, padding: '4px'
                            }}
                        />
                    ) : (
                        <span
                            onClick={() => setIsEditingBreak(true)}
                            style={{ color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', borderBottom: '1px dashed var(--border-accent)' }}
                        >
                            {breakDuration}
                        </span>
                    )}
                    min
                </div>
            </div>

            <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-3)' }}>
                🔥 {cyclesCompleted} cycles completed today
            </div>

        </div>
    );
};

export default PomodoroTimer;
