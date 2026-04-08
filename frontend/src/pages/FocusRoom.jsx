import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Square, RotateCcw, Coffee, Brain,
  Music, SkipForward, Target, Zap, Clock,
  AlertTriangle, Check, ChevronDown, ChevronUp, Lock
} from 'lucide-react';
import toast from '../utils/toast';
import { useAudio } from '../context/AudioContext';
import PageHeader from '../components/layout/PageHeader';
import GlobalMusicPlayer from '../components/system/GlobalMusicPlayer';

// ── Session presets ──────────────────────────────────────────────────────────
const PRESETS = [
  { label: '15m', work: 15, break: 3, long: 10, icon: '⚡' },
  { label: '25m', work: 25, break: 5, long: 15, icon: '🎯' },
  { label: '45m', work: 45, break: 10, long: 20, icon: '🔥' },
  { label: '90m', work: 90, break: 15, long: 30, icon: '💎' },
];

const PHASES = {
  work: { label: 'DEEP WORK', color: '#10B981', bgGlow: 'rgba(16,185,129,0.08)', icon: '🎯' },
  short: { label: 'SHORT BREAK', color: '#3B82F6', bgGlow: 'rgba(59,130,246,0.08)', icon: '☕' },
  long: { label: 'LONG BREAK', color: '#8B5CF6', bgGlow: 'rgba(139,92,246,0.08)', icon: '🌿' },
};

// ── Tree visual that grows with focus progress ───────────────────────────────
const TreeVisual = ({ progress, status, phase }) => {
  const trees = ['🌱', '🪴', '🌿', '🌳', '🌲'];
  const idx = status === 'dead' ? -1 : Math.min(4, Math.floor(progress * 5));
  return (
    <motion.div
      key={`${idx}-${status}`}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.1, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      style={{ fontSize: '96px', lineHeight: 1, filter: status === 'dead' ? 'grayscale(1) saturate(0)' : 'drop-shadow(0 0 20px rgba(255,255,255,0.1))', zIndex: 2, position: 'relative' }}
    >
      {status === 'dead' ? '🥀' : trees[Math.max(0, idx)]}
    </motion.div>
  );
};

// ── Circular timer ring ──────────────────────────────────────────────────────
const TimerRing = ({ progress, color, children, size = 300, isRunning }) => {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.max(0, Math.min(1, progress)));
  
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background ambient glow when running */}
      {isRunning && (
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`, pointerEvents: 'none' }}
        />
      )}
      
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)', zIndex: 1 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {children}
      </div>
    </div>
  );
};

// ── Main FocusRoom Component ─────────────────────────────────────────────────
export default function FocusRoom() {
  const [preset, setPreset] = useState(PRESETS[1]); // 25m default
  const [phase, setPhase] = useState('work'); // work | short | long
  const [cycleCount, setCycleCount] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | running | paused | dead | success
  const [totalSeconds, setTotalSeconds] = useState(PRESETS[1].work * 60);
  const [remaining, setRemaining] = useState(PRESETS[1].work * 60);
  const [todaySessions, setTodaySessions] = useState(() => {
    try { return parseInt(localStorage.getItem('aiimin_focus_today') || '0', 10); } catch { return 0; }
  });
  const [todayMinutes, setTodayMinutes] = useState(() => {
    try { return parseInt(localStorage.getItem('aiimin_focus_mins') || '0', 10); } catch { return 0; }
  });

  const { audioFiles, audioIdx, handleAudioUpload, nextAudio } = useAudio();

  // Tasks and intent
  const [mainIntent, setMainIntent] = useState(() => localStorage.getItem('aiimin_focus_intent') || '');
  const [sessionTasks, setSessionTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [showTaskPanel, setShowTaskPanel] = useState(true);

  const intervalRef = useRef(null);
  const visRef = useRef(null);

  // ── Reset timer for new phase ──────────────────────────────────────────────
  const initPhase = useCallback((newPhase, newPreset) => {
    const p = newPreset || preset;
    const secs = (newPhase === 'work' ? p.work : newPhase === 'short' ? p.break : p.long) * 60;
    setPhase(newPhase);
    setTotalSeconds(secs);
    setRemaining(secs);
    setStatus('idle');
  }, [preset]);

  // ── Handle preset change ───────────────────────────────────────────────────
  const changePreset = (p) => {
    setPreset(p);
    initPhase('work', p);
    setCycleCount(0);
  };

  // ── Finish a work session ──────────────────────────────────────────────────
  const completeWork = useCallback(() => {
    const mins = Math.round(preset.work);
    const newSessions = todaySessions + 1;
    const newMins = todayMinutes + mins;
    setTodaySessions(newSessions);
    setTodayMinutes(newMins);
    localStorage.setItem('aiimin_focus_today', String(newSessions));
    localStorage.setItem('aiimin_focus_mins', String(newMins));
    setCycleCount(prev => prev + 1);
    setStatus('success');
    toast.success(`Deep work session complete! 🌲 +${mins} minutes`, { duration: 5000 });
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [preset.work, todaySessions, todayMinutes]);

  // ── Timer tick ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            if (phase === 'work') {
              completeWork();
            } else {
              setStatus('success');
              toast.success(`${PHASES[phase].label} complete — ready to focus again!`);
              if (intervalRef.current) clearInterval(intervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status, phase, completeWork]);

  // ── Visibility guard (only for work phase) ────────────────────────────────
  useEffect(() => {
    const onVis = () => {
      if (status !== 'running' || phase !== 'work') return;
      if (document.hidden) {
        toast.error('Focus lost! Come back — your tree is dying...', { duration: 4000 });
        visRef.current = setTimeout(() => {
          setStatus('dead');
          if (intervalRef.current) clearInterval(intervalRef.current);
          toast.error('Your tree died. Leaving the tab breaks focus.', { duration: 6000 });
        }, 8000);
      } else if (visRef.current) {
        clearTimeout(visRef.current);
        visRef.current = null;
        toast.success('Back! Keep going. 🌱', { duration: 2000 });
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      if (visRef.current) clearTimeout(visRef.current);
    };
  }, [status, phase]);

  const saveIntent = (val) => {
    setMainIntent(val);
    localStorage.setItem('aiimin_focus_intent', val);
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const start = () => {
    if (!mainIntent.trim() && phase === 'work') {
      toast.error('Please set your Main Intent first.');
      document.getElementById('mainIntentInput')?.focus();
      return;
    }
    setStatus('running');
  };
  const pause = () => setStatus(s => s === 'running' ? 'paused' : 'running');
  const abort = () => {
    if (window.confirm('Give up this session? Your tree will die.')) {
      setStatus('dead');
      if (intervalRef.current) clearInterval(intervalRef.current);
      toast.error('Session abandoned.');
    }
  };
  const reset = () => initPhase(phase);
  const nextPhase = () => {
    if (phase === 'work') {
      const afterLong = (cycleCount + 1) % 4 === 0;
      initPhase(afterLong ? 'long' : 'short');
    } else {
      initPhase('work');
    }
  };

  // ── Computed ───────────────────────────────────────────────────────────────
  const progress = totalSeconds > 0 ? (totalSeconds - remaining) / totalSeconds : 0;
  const phaseInfo = PHASES[phase];
  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');
  const streakLabel = cycleCount >= 4 ? `🔥 ${Math.floor(cycleCount / 4)} streak${Math.floor(cycleCount / 4) > 1 ? 's' : ''}` : null;

  return (
    <div className="page-container" style={{ paddingBottom: '100px' }}>
      <PageHeader 
        title="Focus Room"
        subtitle="Monk Mode. Zero Distractions."
      />

      {/* ── TOP: Sticky Intent / Commitment ── */}
      <motion.div 
        layout
        style={{
          background: status === 'running' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${status === 'running' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: status === 'running' ? '0 16px 40px rgba(16,185,129,0.15)' : 'none',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s',
          display: 'flex', flexDirection: 'column', gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: status === 'running' ? '#10b981' : 'var(--color-text-3)', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {status === 'running' ? <Lock size={16} /> : <Target size={16} />}
          {status === 'running' ? 'Locked Commitment' : 'Define Your Main Intent'}
        </div>
        <input
          id="mainIntentInput"
          value={mainIntent}
          onChange={e => saveIntent(e.target.value)}
          disabled={status === 'running'}
          placeholder="What is the ONE thing you must accomplish in this session?"
          style={{
            background: 'transparent', border: 'none', color: '#fff',
            fontSize: '24px', fontWeight: 900, outline: 'none', width: '100%',
            fontFamily: 'inherit', letterSpacing: '-0.02em',
            opacity: status === 'running' ? 1 : 0.8
          }}
        />
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: '32px' }}>
        
        {/* ── LEFT: Timer & Visuals ──────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Preset Pills */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => status === 'idle' && changePreset(p)} style={{
                padding: '10px 20px', borderRadius: '16px',
                border: `1px solid ${preset.label === p.label ? phaseInfo.color : 'rgba(255,255,255,0.05)'}`,
                background: preset.label === p.label ? `${phaseInfo.color}18` : 'transparent',
                color: preset.label === p.label ? phaseInfo.color : 'var(--color-text-3)',
                fontSize: '14px', fontWeight: 800, cursor: status === 'idle' ? 'pointer' : 'default', fontFamily: 'inherit',
                transition: 'all 0.2s', opacity: (status !== 'idle' && preset.label !== p.label) ? 0.3 : 1
              }}>
                {p.icon} {p.label}
              </button>
            ))}
            {/* Custom adjustment */}
            {status === 'idle' && (
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '4px 12px', gap: '8px', marginLeft: 'auto' }}>
                <button 
                  onClick={() => {
                    const newWork = Math.max(1, preset.work - 5);
                    changePreset({ label: `${newWork}m`, work: newWork, break: Math.round(newWork * 0.2) || 1, long: Math.round(newWork * 0.6) || 5, icon: '⚙️' });
                  }} 
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-2)', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = phaseInfo.color}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-2)'}
                >-</button>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-1)', userSelect: 'none' }}>{preset.work}m</span>
                <button 
                  onClick={() => {
                    const newWork = Math.min(180, preset.work + 5);
                    changePreset({ label: `${newWork}m`, work: newWork, break: Math.round(newWork * 0.2) || 1, long: Math.round(newWork * 0.6) || 5, icon: '⚙️' });
                  }} 
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-2)', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = phaseInfo.color}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-2)'}
                >+</button>
              </div>
            )}
          </div>

          {/* Phase selectors */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {Object.entries(PHASES).map(([k, v]) => (
              <button key={k} onClick={() => status === 'idle' && initPhase(k)} style={{
                padding: '8px 24px', borderRadius: '99px',
                border: `1px solid ${phase === k ? v.color : 'rgba(255,255,255,0.05)'}`,
                background: phase === k ? `${v.color}15` : 'transparent',
                color: phase === k ? v.color : 'var(--color-text-3)',
                fontSize: '12px', fontWeight: 800, cursor: status === 'idle' ? 'pointer' : 'default',
                fontFamily: 'inherit', transition: 'all 0.2s', letterSpacing: '0.05em'
              }}>
                {v.icon} {v.label}
              </button>
            ))}
          </div>

          {/* Timer Card */}
          <motion.div 
            layout
            style={{
              background: status === 'running' ? `linear-gradient(180deg, rgba(20,20,20,0.8) 0%, ${phaseInfo.bgGlow} 100%)` : 'rgba(255,255,255,0.02)',
              border: `1px solid ${status === 'running' ? phaseInfo.color + '55' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: '40px', padding: '60px 40px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px',
              position: 'relative', overflow: 'hidden',
              backdropFilter: 'blur(30px)',
              boxShadow: status === 'running' ? `0 40px 100px ${phaseInfo.color}20, inset 0 1px 0 rgba(255,255,255,0.1)` : 'inset 0 1px 0 rgba(255,255,255,0.05)',
              transition: 'all 0.4s ease',
            }}
          >
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Timer ring with tree inside */}
              <TimerRing progress={progress} color={phaseInfo.color} size={320} isRunning={status === 'running'}>
                <AnimatePresence mode="wait">
                  <TreeVisual progress={progress} status={status} phase={phase} />
                </AnimatePresence>
                <div style={{ fontSize: '64px', fontWeight: 900, fontFamily: 'var(--font-mono, monospace)', letterSpacing: '-0.04em', color: status === 'dead' ? '#ef4444' : '#fff', marginTop: '16px', lineHeight: 1, textShadow: status === 'running' ? `0 0 40px ${phaseInfo.color}50` : 'none' }}>
                  {mins}:{secs}
                </div>
                {status === 'running' && (
                  <div style={{ fontSize: '13px', fontWeight: 800, color: phaseInfo.color, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    Focus Locked
                  </div>
                )}
              </TimerRing>

              {/* Controls */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '48px' }}>
                {status === 'idle' && (
                  <button onClick={start} style={{
                    padding: '20px 48px', borderRadius: '24px', border: 'none',
                    background: phaseInfo.color, color: '#fff',
                    fontSize: '18px', fontWeight: 900, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    boxShadow: `0 16px 40px ${phaseInfo.color}60`, fontFamily: 'inherit',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <Play size={24} fill="currentColor" /> Enter Monk Mode
                  </button>
                )}
                {(status === 'running' || status === 'paused') && (
                  <>
                    <button onClick={pause} style={{
                      padding: '16px 36px', borderRadius: '20px',
                      border: `1px solid ${phaseInfo.color}`, background: `${phaseInfo.color}20`,
                      color: phaseInfo.color, fontSize: '16px', fontWeight: 800, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'inherit',
                      backdropFilter: 'blur(10px)'
                    }}>
                      {status === 'running' ? <><Pause size={20} fill="currentColor" /> Pause</> : <><Play size={20} fill="currentColor" /> Resume</>}
                    </button>
                    <button onClick={abort} style={{
                      padding: '16px 28px', borderRadius: '20px',
                      border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.1)',
                      color: '#ef4444', fontSize: '16px', fontWeight: 800, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'inherit',
                    }}>
                      <Square size={18} fill="currentColor" /> Give Up
                    </button>
                  </>
                )}
                {(status === 'dead' || status === 'success') && (
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button onClick={reset} style={{
                      padding: '16px 32px', borderRadius: '20px',
                      border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                      color: '#fff', fontSize: '16px', fontWeight: 800, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'inherit',
                    }}>
                      <RotateCcw size={18} /> Retry
                    </button>
                    {status === 'success' && (
                      <button onClick={nextPhase} style={{
                        padding: '16px 36px', borderRadius: '20px', border: 'none',
                        background: phaseInfo.color, color: '#fff',
                        fontSize: '16px', fontWeight: 900, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'inherit',
                        boxShadow: `0 12px 32px ${phaseInfo.color}50`
                      }}>
                        {phase === 'work' ? <><Coffee size={18} /> Take Break</> : <><Brain size={18} /> Back to Work</>}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Warning for work phase */}
              {phase === 'work' && status === 'idle' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '24px' }}>
                  <AlertTriangle size={14} color="#ef4444" />
                  Leaving the tab during deep work kills your tree
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: Sidebar ────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Stats Grid */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '28px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '20px' }}>Today's Output</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Sessions', value: todaySessions, icon: <Zap size={18} />, color: '#F59E0B' },
                { label: 'Minutes', value: todayMinutes, icon: <Clock size={18} />, color: '#10B981' },
                { label: 'Cycles', value: cycleCount, icon: <Target size={18} />, color: '#3B82F6' },
                { label: 'Streak', value: streakLabel || `${cycleCount % 4}/4`, icon: '🔥', color: '#EF4444', isStr: true },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: s.color }}>
                    {typeof s.icon === 'string' ? <span style={{ fontSize: '18px' }}>{s.icon}</span> : s.icon}
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-3)' }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: s.isStr ? '16px' : '36px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pomodoro cycle guide */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '28px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '20px' }}>Session Cycle</div>
            {[0, 1, 2, 3].map(i => {
              const done = i < cycleCount % 4;
              const active = i === cycleCount % 4 && phase === 'work';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                    background: done ? 'var(--color-accent)' : active ? `${phaseInfo.color}20` : 'rgba(0,0,0,0.2)',
                    border: `1.5px solid ${done ? 'var(--color-accent)' : active ? phaseInfo.color : 'rgba(255,255,255,0.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#fff', fontWeight: 800
                  }}>
                    {done ? <Check size={16} color="#fff" /> : active ? '🎯' : `${i + 1}`}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: active ? phaseInfo.color : done ? 'var(--color-text-3)' : '#fff' }}>
                      Session {i + 1} <span style={{ opacity: 0.5 }}>• {preset.work}m</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                      {done ? '✓ Completed' : active ? 'In Progress' : i === 3 ? `Then ${preset.long}m long break` : `Then ${preset.break}m break`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Micro-tasks for the session */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '28px' }}>
            <button onClick={() => setShowTaskPanel(v => !v)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showTaskPanel ? '20px' : 0, fontFamily: 'inherit' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)' }}>Micro Tasks</div>
              {showTaskPanel ? <ChevronUp size={16} color="var(--color-text-3)" /> : <ChevronDown size={16} color="var(--color-text-3)" />}
            </button>
            <AnimatePresence>
              {showTaskPanel && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                  <input
                    value={taskInput}
                    onChange={e => setTaskInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && taskInput.trim()) {
                        setSessionTasks(prev => [...prev, { id: Date.now(), text: taskInput.trim(), done: false }]);
                        setTaskInput('');
                      }
                    }}
                    placeholder="Add small sub-tasks... (Press Enter)"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '14px', color: '#fff', outline: 'none', fontFamily: 'inherit', marginBottom: '16px', transition: 'border-color 0.2s' }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {sessionTasks.map(t => (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <button onClick={() => setSessionTasks(prev => prev.map(x => x.id === t.id ? { ...x, done: !x.done } : x))} style={{
                          width: '24px', height: '24px', borderRadius: '8px', border: `2px solid ${t.done ? 'var(--color-accent)' : 'rgba(255,255,255,0.2)'}`,
                          background: t.done ? 'var(--color-accent)' : 'transparent', cursor: 'pointer', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                        }}>
                          {t.done && <Check size={14} color="#fff" />}
                        </button>
                        <span style={{ fontSize: '14px', color: t.done ? 'rgba(255,255,255,0.3)' : '#fff', textDecoration: t.done ? 'line-through' : 'none', flex: 1, fontWeight: t.done ? 500 : 600 }}>{t.text}</span>
                      </div>
                    ))}
                    {sessionTasks.length === 0 && <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '16px 0' }}>Break down your intent into small steps.</div>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ambient Music Settings (now visually integrated) */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                <Music size={18} color="var(--color-accent)" /> Local Ambient
              </div>
              <label style={{ cursor: 'pointer', fontSize: '12px', fontWeight: 800, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' }}>
                + Load Tracks
                <input type="file" accept="audio/*" multiple onChange={handleAudioUpload} style={{ display: 'none' }} />
              </label>
            </div>
            {audioFiles.length > 0 && (
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, marginRight: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>{audioFiles[audioIdx].name}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Track {audioIdx + 1} of {audioFiles.length}</div>
                </div>
                <button onClick={nextAudio} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'background 0.2s' }}>
                  <SkipForward size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .focus-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <GlobalMusicPlayer />
    </div>
  );
}
