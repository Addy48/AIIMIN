import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Square, RotateCcw, Coffee, Brain,
  Music, SkipForward, Volume2, Target, Zap, Clock,
  AlertTriangle, Check, ChevronDown, ChevronUp
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
      style={{ fontSize: '72px', lineHeight: 1, filter: status === 'dead' ? 'grayscale(1) saturate(0)' : 'none' }}
    >
      {status === 'dead' ? '🥀' : trees[Math.max(0, idx)]}
    </motion.div>
  );
};

// ── Circular timer ring ──────────────────────────────────────────────────────
const TimerRing = ({ progress, color, children, size = 220 }) => {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.max(0, Math.min(1, progress)));
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth={8} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
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

  // Audio is now handled globally in AudioContext
  const { audioFiles, audioIdx, handleAudioUpload, nextAudio } = useAudio();

  // Tasks for this session
  const [sessionTasks, setSessionTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [showTaskPanel, setShowTaskPanel] = useState(false);

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

  // ── Actions ────────────────────────────────────────────────────────────────
  const start = () => {
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
    <div className="page-container">
      <PageHeader 
        title="Focus Room"
        subtitle="Deep Work Engine"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: '28px' }}>
        {/* ── LEFT: Timer ──────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Preset Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => changePreset(p)} style={{
                padding: '8px 18px', borderRadius: '99px',
                border: `1px solid ${preset.label === p.label ? phaseInfo.color : 'var(--color-border)'}`,
                background: preset.label === p.label ? `${phaseInfo.color}18` : 'var(--color-surface)',
                color: preset.label === p.label ? phaseInfo.color : 'var(--color-text-2)',
                fontSize: '12px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}>
                {p.icon} {p.label}
              </button>
            ))}
            {/* Custom adjustment buttons */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '99px', padding: '2px 8px', gap: '4px' }}>
              <button 
                onClick={() => {
                  const newWork = Math.max(1, preset.work - 5);
                  changePreset({ label: `${newWork}m`, work: newWork, break: Math.round(newWork * 0.2) || 1, long: Math.round(newWork * 0.6) || 5, icon: '⚙️' });
                }} 
                style={{
                  background: 'none', border: 'none', color: 'var(--color-text-2)', 
                  cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', padding: '2px 6px',
                  fontFamily: 'inherit', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1
                }}
                onMouseEnter={e => e.currentTarget.style.color = phaseInfo.color}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-2)'}
                title="Decrease duration by 5m"
              >
                -
              </button>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', padding: '0 2px', userSelect: 'none' }}>
                {preset.work}m
              </span>
              <button 
                onClick={() => {
                  const newWork = Math.min(180, preset.work + 5);
                  changePreset({ label: `${newWork}m`, work: newWork, break: Math.round(newWork * 0.2) || 1, long: Math.round(newWork * 0.6) || 5, icon: '⚙️' });
                }} 
                style={{
                  background: 'none', border: 'none', color: 'var(--color-text-2)', 
                  cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', padding: '2px 6px',
                  fontFamily: 'inherit', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1
                }}
                onMouseEnter={e => e.currentTarget.style.color = phaseInfo.color}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-2)'}
                title="Increase duration by 5m"
              >
                +
              </button>
            </div>
            {/* Phase pills */}
            <div style={{ flex: 1 }} />
            {Object.entries(PHASES).map(([k, v]) => (
              <button key={k} onClick={() => status === 'idle' && initPhase(k)} style={{
                padding: '8px 14px', borderRadius: '99px',
                border: `1px solid ${phase === k ? v.color : 'var(--color-border)'}`,
                background: phase === k ? `${v.color}18` : 'transparent',
                color: phase === k ? v.color : 'var(--color-text-3)',
                fontSize: '11px', fontWeight: 800, cursor: status === 'idle' ? 'pointer' : 'default',
                fontFamily: 'inherit', transition: 'all 0.2s',
              }}>
                {v.icon} {v.label}
              </button>
            ))}
          </div>

          {/* Timer Card */}
          <div style={{
            background: `linear-gradient(135deg, var(--color-surface) 0%, ${phaseInfo.bgGlow} 100%)`,
            border: `1px solid ${status === 'running' ? phaseInfo.color + '55' : 'var(--color-border)'}`,
            borderRadius: '28px', padding: '48px 40px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px',
            position: 'relative', overflow: 'hidden',
            boxShadow: status === 'running' ? `0 0 40px ${phaseInfo.color}15` : 'none',
            transition: 'all 0.4s ease',
          }}>
            {/* Glow pulse when running */}
            {status === 'running' && (
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.04, 0.08, 0.04] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: 0, background: phaseInfo.color, borderRadius: '28px', zIndex: 0 }}
              />
            )}

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              {/* Phase badge */}
              <div style={{
                padding: '6px 16px', borderRadius: '99px', fontSize: '10px', fontWeight: 900,
                textTransform: 'uppercase', letterSpacing: '0.15em',
                background: `${phaseInfo.color}18`, color: phaseInfo.color,
                border: `1px solid ${phaseInfo.color}40`,
              }}>
                {phaseInfo.icon} {phaseInfo.label}
              </div>

              {/* Timer ring with tree inside */}
              <TimerRing progress={progress} color={phaseInfo.color} size={240}>
                <AnimatePresence mode="wait">
                  <TreeVisual progress={progress} status={status} phase={phase} />
                </AnimatePresence>
                <div style={{ fontSize: '42px', fontWeight: 900, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em', color: status === 'dead' ? '#ef4444' : 'var(--color-text-1)', marginTop: '8px', lineHeight: 1 }}>
                  {mins}:{secs}
                </div>
                {status === 'running' && (
                  <div style={{ fontSize: '10px', fontWeight: 700, color: phaseInfo.color, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    In Session
                  </div>
                )}
              </TimerRing>

              {/* Controls */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {status === 'idle' && (
                  <button onClick={start} style={{
                    padding: '14px 36px', borderRadius: '16px', border: 'none',
                    background: phaseInfo.color, color: '#fff',
                    fontSize: '15px', fontWeight: 900, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    boxShadow: `0 8px 20px ${phaseInfo.color}40`, fontFamily: 'inherit',
                  }}>
                    <Play size={18} fill="currentColor" /> Start
                  </button>
                )}
                {(status === 'running' || status === 'paused') && (
                  <>
                    <button onClick={pause} style={{
                      padding: '12px 28px', borderRadius: '14px',
                      border: `1px solid ${phaseInfo.color}`, background: `${phaseInfo.color}18`,
                      color: phaseInfo.color, fontSize: '14px', fontWeight: 800, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit',
                    }}>
                      {status === 'running' ? <><Pause size={16} /> Pause</> : <><Play size={16} fill="currentColor" /> Resume</>}
                    </button>
                    <button onClick={abort} style={{
                      padding: '12px 20px', borderRadius: '14px',
                      border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)',
                      color: '#ef4444', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit',
                    }}>
                      <Square size={14} fill="currentColor" /> Give Up
                    </button>
                  </>
                )}
                {(status === 'dead' || status === 'success') && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={reset} style={{
                      padding: '12px 22px', borderRadius: '14px',
                      border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                      color: 'var(--color-text-2)', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit',
                    }}>
                      <RotateCcw size={14} /> Retry
                    </button>
                    {status === 'success' && (
                      <button onClick={nextPhase} style={{
                        padding: '12px 22px', borderRadius: '14px', border: 'none',
                        background: phaseInfo.color, color: '#fff',
                        fontSize: '14px', fontWeight: 800, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit',
                      }}>
                        {phase === 'work' ? <><Coffee size={14} /> Take Break</> : <><Brain size={14} /> Back to Work</>}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Warning for work phase */}
              {phase === 'work' && status === 'idle' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-text-3)' }}>
                  <AlertTriangle size={12} color="var(--color-text-3)" />
                  Leaving the tab during work kills your tree
                </div>
              )}
            </div>
          </div>

          {/* Audio player */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: audioFiles.length ? '14px' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--color-text-1)' }}>
                <Music size={16} /> Ambient Sounds
              </div>
              {audioFiles.length > 0 && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-elevated)', borderRadius: '12px', padding: '6px 12px', margin: '0 12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{audioFiles[audioIdx].name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-3)' }}>Track {audioIdx + 1}/{audioFiles.length}</div>
                  </div>
                  <button onClick={nextAudio} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-3)' }}>
                    <SkipForward size={16} />
                  </button>
                </div>
              )}
              <label style={{ cursor: 'pointer', fontSize: '11px', fontWeight: 700, padding: '6px 14px', background: 'var(--color-elevated)', borderRadius: '10px', color: 'var(--color-text-2)', border: '1px solid var(--color-border)' }}>
                + Add Music
                <input type="file" accept="audio/*" multiple onChange={handleAudioUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Sidebar ────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Stats */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '20px' }}>Today's Output</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {[
                { label: 'Sessions', value: todaySessions, icon: <Zap size={16} />, color: '#F59E0B' },
                { label: 'Minutes', value: todayMinutes, icon: <Clock size={16} />, color: '#10B981' },
                { label: 'Cycles', value: cycleCount, icon: <Target size={16} />, color: '#3B82F6' },
                { label: 'Streak', value: streakLabel || `${cycleCount % 4}/4`, icon: '🔥', color: '#EF4444', isStr: true },
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--color-elevated)', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: s.color }}>
                    {typeof s.icon === 'string' ? <span style={{ fontSize: '16px' }}>{s.icon}</span> : s.icon}
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-3)' }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: s.isStr ? '14px' : '28px', fontWeight: 900, color: 'var(--color-text-1)', letterSpacing: '-0.02em' }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Focus / Tasks */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '24px' }}>
            <button onClick={() => setShowTaskPanel(v => !v)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showTaskPanel ? '16px' : 0, fontFamily: 'inherit' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)' }}>Session Intent</div>
              {showTaskPanel ? <ChevronUp size={14} color="var(--color-text-3)" /> : <ChevronDown size={14} color="var(--color-text-3)" />}
            </button>
            {showTaskPanel && (
              <div>
                <input
                  value={taskInput}
                  onChange={e => setTaskInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && taskInput.trim()) {
                      setSessionTasks(prev => [...prev, { id: Date.now(), text: taskInput.trim(), done: false }]);
                      setTaskInput('');
                    }
                  }}
                  placeholder="What will you work on? (Enter to add)"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '13px', color: 'var(--color-text-1)', outline: 'none', fontFamily: 'inherit', marginBottom: '12px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sessionTasks.map(t => (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => setSessionTasks(prev => prev.map(x => x.id === t.id ? { ...x, done: !x.done } : x))} style={{
                        width: '20px', height: '20px', borderRadius: '6px', border: `1.5px solid ${t.done ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        background: t.done ? 'var(--color-accent)' : 'transparent', cursor: 'pointer', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {t.done && <Check size={11} color="#fff" />}
                      </button>
                      <span style={{ fontSize: '13px', color: t.done ? 'var(--color-text-3)' : 'var(--color-text-1)', textDecoration: t.done ? 'line-through' : 'none', flex: 1 }}>{t.text}</span>
                    </div>
                  ))}
                  {sessionTasks.length === 0 && <div style={{ fontSize: '12px', color: 'var(--color-text-3)', textAlign: 'center', padding: '12px 0' }}>No tasks yet. Add one above.</div>}
                </div>
              </div>
            )}
          </div>

          {/* Pomodoro cycle guide */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '16px' }}>Session Cycle</div>
            {[0, 1, 2, 3].map(i => {
              const done = i < cycleCount % 4;
              const active = i === cycleCount % 4 && phase === 'work';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--color-border)' : 'none' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                    background: done ? 'var(--color-accent)' : active ? `${phaseInfo.color}20` : 'var(--color-elevated)',
                    border: `1.5px solid ${done ? 'var(--color-accent)' : active ? phaseInfo.color : 'var(--color-border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
                  }}>
                    {done ? <Check size={13} color="#fff" /> : active ? '🎯' : `${i + 1}`}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: active ? phaseInfo.color : done ? 'var(--color-text-3)' : 'var(--color-text-1)' }}>
                      Session {i + 1} — {preset.work}m
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-3)' }}>
                      {done ? '✓ Completed' : active ? 'In Progress' : i === 3 ? `Then ${preset.long}m long break` : `Then ${preset.break}m break`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tips */}
          <div style={{ background: 'var(--color-elevated)', borderRadius: '16px', padding: '16px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-2)', lineHeight: 1.6 }}>
              <strong>Flow tips:</strong> Remove phone from sight · Set 1 clear task · Close unused tabs · Drink water before starting
            </div>
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
