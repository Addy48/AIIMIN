import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, RotateCcw, Target, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const MODES = {
  focus: { time: 25 * 60, label: 'Deep Work', color: '#ff5f56' },
  shortBreak: { time: 5 * 60, label: 'Short Break', color: '#27c93f' },
  longBreak: { time: 15 * 60, label: 'Long Break', color: '#ffbd2e' },
};

const PomodoroTimer = ({ onComplete, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [task, setTask] = useState('');

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].time);
    setIsActive(false);
  }, []);

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
  }, [isActive, timeLeft, mode, sessionsCompleted, switchMode]);

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
  const text2 = 'var(--color-text-2)';
  const text3 = 'var(--color-text-3)';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: 'rgba(20,20,20,0.65)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
      borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
      width: '100%', maxWidth: '700px', margin: '0 auto', fontFamily: 'var(--font-sans)',
      position: 'relative', overflow: 'hidden'
    }}>
      
      <div style={{ padding: '40px 60px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Progress Bar (Subtle top edge) */}
        <div style={{ position: 'absolute', top: '0px', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.05)' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "linear" }}
            style={{ height: '100%', background: MODES[mode].color, boxShadow: `0 0 10px ${MODES[mode].color}` }}
          />
        </div>

        {/* Task Input Area */}
        <div style={{ width: '100%', marginBottom: '40px', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="What is your singular focus right now?" 
            value={task}
            onChange={(e) => setTask(e.target.value)}
            style={{
              width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)',
              padding: '12px 0', color: text1, fontSize: '18px', fontWeight: 500, textAlign: 'center',
              outline: 'none', fontFamily: 'var(--font-sans)'
            }}
          />
        </div>

        {/* Timer Display */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0 50px' }}>
          <motion.div 
            key={timeLeft}
            initial={{ opacity: 0.8, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{ 
              fontSize: '110px', fontWeight: 200, color: text1, 
              fontFamily: 'var(--font-mono)', letterSpacing: '-0.05em',
              textShadow: isActive ? `0 0 40px ${MODES[mode].color}40` : 'none',
              lineHeight: 1
            }}
          >
            {formatTime(timeLeft)}
          </motion.div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
          <button onClick={resetTimer} style={{ 
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
            width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: text2, cursor: 'pointer', transition: 'all 0.2s', outline: 'none'
          }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            <RotateCcw size={22} />
          </button>

          <button onClick={toggleTimer} style={{ 
            background: isActive ? 'rgba(255,255,255,0.1)' : MODES[mode].color, 
            border: `1px solid ${isActive ? 'rgba(255,255,255,0.2)' : MODES[mode].color}`, 
            borderRadius: '50%', width: '80px', height: '80px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isActive ? text1 : '#000', cursor: 'pointer', transition: 'all 0.3s', outline: 'none',
            boxShadow: isActive ? 'none' : `0 10px 20px ${MODES[mode].color}40`
          }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={36} fill="currentColor" style={{ marginLeft: '4px' }} />}
          </button>

          <button onClick={() => { setIsActive(false); if (onComplete) onComplete({ sessions: sessionsCompleted, task }); onClose && onClose(); }} style={{ 
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
            width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: text2, cursor: 'pointer', transition: 'all 0.2s', outline: 'none'
          }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            <Square size={22} fill="currentColor" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {Object.entries(MODES).map(([key, m]) => (
            <button 
              key={key} 
              onClick={() => switchMode(key)}
              style={{
                background: mode === key ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none', padding: '8px 20px', borderRadius: '12px', cursor: 'pointer',
                color: mode === key ? text1 : text3, fontSize: '13px', fontWeight: 600,
                transition: 'all 0.2s', outline: 'none'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: text3, fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <Flame size={14} color="#ff5f56" /> {sessionsCompleted} Sessions Completed
        </div>

      </div>
    </div>
  );
};

export default PomodoroTimer;
