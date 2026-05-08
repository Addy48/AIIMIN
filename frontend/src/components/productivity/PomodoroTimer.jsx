import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, RotateCcw, Target, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../../context/ThemeContext';

const MODES = {
  focus: { time: 25 * 60, label: 'Deep Work', color: '#E2725B' },
  shortBreak: { time: 5 * 60, label: 'Short Break', color: '#3B7E58' },
  longBreak: { time: 15 * 60, label: 'Long Break', color: '#DCA134' },
};

const PomodoroTimer = ({ onComplete, onClose }) => {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
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
      background: isDark ? 'rgba(20,20,20,0.65)' : 'var(--glass-bg)',
      backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
      borderRadius: '24px',
      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--color-border)',
      boxShadow: isDark 
        ? '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)' 
        : '0 20px 48px rgba(31,32,29,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
      width: '100%', maxWidth: '700px', margin: '0 auto', fontFamily: 'var(--font-sans)',
      position: 'relative', overflow: 'hidden'
    }}>
      
      <div style={{ padding: '40px 60px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Progress Bar (Subtle top edge) */}
        <div style={{ position: 'absolute', top: '0px', left: 0, right: 0, height: '2px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(31,32,29,0.05)' }}>
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
              width: '100%', background: 'transparent', border: 'none',
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(31,32,29,0.12)',
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
              textShadow: isActive && isDark ? `0 0 40px ${MODES[mode].color}40` : 'none',
              lineHeight: 1
            }}
          >
            {formatTime(timeLeft)}
          </motion.div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
          <motion.button 
            whileHover={{ scale: 1.06, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(31,32,29,0.06)' }}
            whileTap={{ scale: 0.94 }}
            onClick={resetTimer} 
            style={{ 
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(31,32,29,0.03)',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--color-border)',
              borderRadius: '50%',
              width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: text2, cursor: 'pointer', transition: 'all 0.2s', outline: 'none'
            }}
          >
            <RotateCcw size={22} />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer} 
            style={{ 
              background: isActive ? 'var(--color-elevated)' : MODES[mode].color, 
              border: `1px solid ${isActive ? 'var(--color-border)' : MODES[mode].color}`, 
              borderRadius: '50%', width: '80px', height: '80px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isActive ? text1 : '#ffffff',
              cursor: 'pointer', transition: 'all 0.3s', outline: 'none',
              boxShadow: isActive ? 'none' : `0 10px 24px ${MODES[mode].color}40`
            }}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={36} fill="currentColor" style={{ marginLeft: '4px' }} />}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.06, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(31,32,29,0.06)' }}
            whileTap={{ scale: 0.94 }}
            onClick={() => { setIsActive(false); if (onComplete) onComplete({ sessions: sessionsCompleted, task }); onClose && onClose(); }} 
            style={{ 
              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(31,32,29,0.03)',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--color-border)',
              borderRadius: '50%',
              width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: text2, cursor: 'pointer', transition: 'all 0.2s', outline: 'none'
            }}
          >
            <Square size={22} fill="currentColor" />
          </motion.button>
        </div>

        {/* Mode Switcher */}
        <div style={{ 
          display: 'flex', gap: '8px',
          background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(31,32,29,0.04)',
          padding: '6px', borderRadius: '16px',
          border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid var(--color-border)'
        }}>
          {Object.entries(MODES).map(([key, m]) => (
            <motion.button 
              key={key} 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => switchMode(key)}
              style={{
                background: mode === key ? (isDark ? 'rgba(255,255,255,0.1)' : 'var(--color-surface)') : 'transparent',
                border: mode === key && !isDark ? '1px solid var(--color-border)' : 'none',
                padding: '8px 20px', borderRadius: '12px', cursor: 'pointer',
                color: mode === key ? text1 : text3, fontSize: '13px', fontWeight: 600,
                boxShadow: mode === key && !isDark ? '0 4px 12px rgba(31,32,29,0.06)' : 'none',
                transition: 'all 0.2s', outline: 'none'
              }}
            >
              {m.label}
            </motion.button>
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
