import React, { useState, useEffect } from 'react';

const PomodoroTimer = () => {
    const [workDuration, setWorkDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const [cyclesCompleted, setCyclesCompleted] = useState(0);
    const [isEditingWork, setIsEditingWork] = useState(false);
    const [isEditingBreak, setIsEditingBreak] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isRunning && timeLeft === 0) {
            if (!isBreak) {
                setCyclesCompleted(prev => prev + 1);
                setIsBreak(true);
                setTimeLeft(breakDuration * 60);
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
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-1px',
                    fontVariantNumeric: 'tabular-nums', lineHeight: 1
                }}>
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    onMouseEnter={(e) => { if (!isRunning) e.currentTarget.style.background = '#f7b84a'; }}
                    onMouseLeave={(e) => { if (!isRunning) e.currentTarget.style.background = '#f5a623'; }}
                    style={{
                        width: '120px', height: '44px', borderRadius: '22px', border: isRunning ? '1px solid rgba(255,255,255,0.15)' : 'none',
                        background: isRunning ? 'rgba(255,255,255,0.08)' : '#f5a623', color: 'white',
                        fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                >
                    {isRunning ? '⏸ Pause' : '▶ Start'}
                </button>
                <button
                    onClick={handleReset}
                    className="hover:bg-[rgba(255,255,255,0.1)]"
                    style={{
                        width: '80px', height: '44px', borderRadius: '22px', background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: '13px',
                        fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                >
                    ↺ Reset
                </button>
            </div>

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
