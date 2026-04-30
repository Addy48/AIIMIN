import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw, X } from 'lucide-react';
import { motion } from 'framer-motion';

const PomodoroTimer = ({ onComplete, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [task, setTask] = useState('');

  const MODES = {
    focus: { time: 25 * 60, label: 'Focus Session', color: '#EF4444' },
    shortBreak: { time: 5 * 60, label: 'Short Break', color: '#10B981' },
    longBreak: { time: 15 * 60, label: 'Long Break', color: '#3B82F6' },
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
      if (mode === 'focus') {
        setSessionsCompleted(s => s + 1);
        if ((sessionsCompleted + 1) % 4 === 0) {
          switchMode('longBreak');
        } else {
          switchMode('shortBreak');
        }
      } else {
        switchMode('focus');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, sessionsCompleted]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].time);
    setIsActive(false);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].time);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((MODES[mode].time - timeLeft) / MODES[mode].time) * 100;

  const text1 = 'var(--color-text-1)';
  const text3 = 'var(--color-text-3)';
  const border = 'var(--color-border)';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px', background: 'var(--color-surface)', borderRadius: '24px',
      border: `1px solid ${MODES[mode].color}40`, boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      maxWidth: '400px', margin: '0 auto', fontFamily: 'var(--font-sans)', width: '100%',
      position: 'relative'
    }}>
      {onClose && (
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', 
            top: '12px', 
            right: '12px', 
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)', 
            border: `1px solid ${border}`, 
            color: text3, 
            cursor: 'pointer', 
            borderRadius: '50%',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = text1; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = text3; }}
        >
          <X size={18} />
        </button>
      )}
      
      {/* Task Input */}
      <input
        type="text"
        placeholder="What are you focusing on?"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{
          width: '100%', background: 'var(--color-background)', border: '1px solid var(--color-border)',
          borderRadius: '12px', padding: '16px', fontSize: '16px', color: 'var(--color-text-1)',
          textAlign: 'center', outline: 'none', marginBottom: '32px', fontWeight: 500
        }}
      />

      {/* Mode Selectors */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', background: 'var(--color-background)', padding: '6px', borderRadius: '14px' }}>
        {Object.entries(MODES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            style={{
              padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              background: mode === key ? val.color : 'transparent',
              color: mode === key ? '#FFF' : 'var(--color-text-3)',
              border: 'none', transition: 'all 0.2s'
            }}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div style={{ position: 'relative', width: '240px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
        <svg width="240" height="240" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <circle
            cx="120" cy="120" r="110"
            fill="none" stroke="var(--color-border)" strokeWidth="6"
          />
          <motion.circle
            cx="120" cy="120" r="110"
            fill="none" stroke={MODES[mode].color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 110}
            strokeDashoffset={2 * Math.PI * 110 * (1 - progress / 100)}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{ fontSize: '64px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text-1)', letterSpacing: '-0.05em', lineHeight: 1 }}>
            {formatTime(timeLeft)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-3)', fontWeight: 600, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {task || 'No task set'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button
          onClick={resetTimer}
          style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-2)' }}
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={toggleTimer}
          style={{ width: '64px', height: '64px', borderRadius: '50%', background: isActive ? 'var(--color-elevated)' : MODES[mode].color, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FFF', boxShadow: isActive ? 'none' : `0 8px 24px ${MODES[mode].color}60`, transition: 'all 0.2s' }}
        >
          {isActive ? <Pause size={28} color="var(--color-text-1)" /> : <Play size={28} style={{ marginLeft: '4px' }} />}
        </button>
        <button
          onClick={() => { setIsActive(false); setTimeLeft(0); }}
          style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-2)' }}
        >
          <Square size={18} />
        </button>
      </div>

      {/* Session Tracker */}
      <div style={{ marginTop: '32px', display: 'flex', gap: '8px' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            width: '12px', height: '12px', borderRadius: '50%',
            background: i < (sessionsCompleted % 4) ? MODES.focus.color : 'var(--color-border)'
          }} />
        ))}
      </div>
    </div>
  );
};

export default PomodoroTimer;
