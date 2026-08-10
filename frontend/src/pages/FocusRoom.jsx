import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Square, RotateCcw, Coffee, Brain,
  Music, SkipForward, Target, Lock, X, AlertTriangle, Infinity as InfinityIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from '../utils/toast';
import { useAudio } from '../context/AudioContext';

import { useAuth } from '../hooks/useAuth';
import { fetchFocusWeekStats, logFocusSession } from '../api/focus';
import { formatDate } from '../utils/formatDate';

// ── Session presets ──────────────────────────────────────────────────────────
const PRESETS = [
  { label: '15m', work: 15, break: 3, long: 10 },
  { label: '25m', work: 25, break: 5, long: 15 },
  { label: '45m', work: 45, break: 10, long: 20 },
  { label: '90m', work: 90, break: 15, long: 30 },
  { label: '120m', work: 120, break: 20, long: 40 },
];

const PHASES = {
  work: { label: 'FLOW STATE', color: '#ff6b35', darkGlow: '#c2410c', lightGlow: '#fb923c', bgGlow: 'rgba(255, 107, 53, 0.15)' },
  short: { label: 'COGNITIVE REST', color: '#10b981', darkGlow: '#047857', lightGlow: '#34d399', bgGlow: 'rgba(16, 185, 129, 0.08)' },
  long: { label: 'DEEP RECOVERY', color: '#E8B84B', darkGlow: '#a16207', lightGlow: '#fbbf24', bgGlow: 'rgba(232, 184, 75, 0.08)' },
};

// ── Flow State Breathing Visual ──────────────────────────────────────────────
const BreathingVisual = ({ progress, status, phaseInfo }) => {
  if (status === 'dead') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          width: '120px', height: '120px', borderRadius: '50%',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ef4444',
          boxShadow: 'inset 0 0 40px rgba(239, 68, 68, 0.1)'
        }}
      >
        <AlertTriangle size={32} />
      </motion.div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer breathing aura */}
      {status === 'running' && (
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -40,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${phaseInfo.color} 0%, transparent 70%)`,
            filter: 'blur(30px)',
          }}
        />
      )}
      
      {/* Inner pulsating core */}
      <motion.div
        animate={status === 'running' ? {
          scale: [1, 1.1, 1],
          opacity: [0.6, 1, 0.6],
        } : { scale: 1, opacity: 0.2 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '140px', height: '140px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${phaseInfo.lightGlow}, ${phaseInfo.darkGlow})`,
          boxShadow: `0 0 60px ${phaseInfo.color}40, inset 0 0 20px rgba(255,255,255,0.5)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff'
        }}
      >
        {status === 'running' ? (
          <InfinityIcon size={40} opacity={0.8} />
        ) : (
          <Target size={40} opacity={0.5} />
        )}
      </motion.div>
    </div>
  );
};

// ── Liquid Progress Ring ──────────────────────────────────────────────────────
const LiquidTimerRing = ({ progress, color, children, size = 600, isRunning }) => {
  const strokeWidth = 4;
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.max(0, Math.min(1, progress)));
  
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)', zIndex: 1 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'linear' }}
          style={{ filter: isRunning ? `drop-shadow(0 0 8px ${color})` : 'none' }}
        />
      </svg>
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {children}
      </div>
    </div>
  );
};

// ── Isolated Timer Component ───────────────────────────────────────────────────
const LiveTimerDisplay = ({ status, phase, totalSeconds, onComplete, phaseInfo }) => {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds, phase]);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            onComplete();
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status, onComplete]);

  const progress = totalSeconds > 0 ? (totalSeconds - remaining) / totalSeconds : 0;
  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');

  return (
    <LiquidTimerRing progress={progress} color={phaseInfo.color} size={status === 'running' ? 640 : 540} isRunning={status === 'running'}>
      <AnimatePresence mode="wait">
        <BreathingVisual progress={progress} status={status} phaseInfo={phaseInfo} />
      </AnimatePresence>
      <div style={{ 
        marginTop: '40px',
        fontSize: status === 'running' ? '180px' : '130px', 
        fontWeight: 200, 
        fontFamily: 'var(--font-sans)', 
        letterSpacing: '-0.06em', 
        color: status === 'dead' ? '#EF4444' : 'var(--color-text-1)', 
        lineHeight: 1, 
        textShadow: status === 'running' ? `0 0 80px ${phaseInfo.color}80, 0 0 20px ${phaseInfo.color}40` : 'none', 
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' 
      }}>
        {mins}:{secs}
      </div>
      {status === 'running' && (
        <motion.div 
          initial={{ opacity: 0, letterSpacing: '0em' }} animate={{ opacity: 1, letterSpacing: '0.4em' }}
          style={{ fontSize: '12px', fontWeight: 600, color: phaseInfo.color, marginTop: '24px', textTransform: 'uppercase' }}
        >
          {phaseInfo.label} ACTIVE
        </motion.div>
      )}
    </LiquidTimerRing>
  );
};

// ── Main FocusRoom Component ─────────────────────────────────────────────────
export default function FocusRoom() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [weeklyTargetH, setWeeklyTargetH] = useState(() => {
    try {
      return Math.min(80, Math.max(1, Number(localStorage.getItem('aiimin_weekly_focus_target_h')) || 15));
    } catch {
      return 15;
    }
  });
  const [preset, setPreset] = useState(PRESETS[1]); // 25m default
  const [phase, setPhase] = useState('work'); // work | short | long
  const [cycleCount, setCycleCount] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | running | paused | dead | success
  const [totalSeconds, setTotalSeconds] = useState(PRESETS[1].work * 60);
  
  const [todaySessions, setTodaySessions] = useState(() => {
    try { return parseInt(localStorage.getItem('aiimin_focus_today') || '0', 10); } catch { return 0; }
  });
  const [todayMinutes, setTodayMinutes] = useState(() => {
    try { return parseInt(localStorage.getItem('aiimin_focus_mins') || '0', 10); } catch { return 0; }
  });
  const [weekMinutes, setWeekMinutes] = useState(0);
  const [weekRows, setWeekRows] = useState([]);
  const WEEKLY_TARGET_H = weeklyTargetH;

  useEffect(() => {
    const onTarget = (e) => {
      const n = Math.min(80, Math.max(1, Number(e?.detail) || Number(localStorage.getItem('aiimin_weekly_focus_target_h')) || 15));
      setWeeklyTargetH(n);
    };
    window.addEventListener('aiimin-weekly-focus-target', onTarget);
    return () => window.removeEventListener('aiimin-weekly-focus-target', onTarget);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchFocusWeekStats(7);
        if (cancelled || !Array.isArray(rows)) return;
        const todayKey = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD
        const todayRow = rows.find((r) => r.date === todayKey || String(r.date).startsWith(todayKey));
        const sessions = todayRow ? Number(todayRow.cycles) || 0 : 0;
        const mins = todayRow ? Number(todayRow.minutes) || 0 : 0;
        const week = rows.reduce((a, r) => a + (Number(r.minutes) || 0), 0);
        setTodaySessions(sessions);
        setTodayMinutes(mins);
        setWeekMinutes(week);
        setWeekRows([...rows].filter((r) => Number(r.minutes) > 0).reverse().slice(0, 3));
        localStorage.setItem('aiimin_focus_today', String(sessions));
        localStorage.setItem('aiimin_focus_mins', String(mins));
      } catch {
        /* keep local */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const { audioFiles, audioIdx, nextAudio } = useAudio();
  const [mainIntent, setMainIntent] = useState(() => localStorage.getItem('aiimin_focus_intent') || '');
  const visRef = useRef(null);

  const initPhase = useCallback((newPhase, newPreset) => {
    const p = newPreset || preset;
    const secs = (newPhase === 'work' ? p.work : newPhase === 'short' ? p.break : p.long) * 60;
    setPhase(newPhase);
    setTotalSeconds(secs);
    setStatus('idle');
  }, [preset]);

  const changePreset = (p) => {
    setPreset(p);
    initPhase('work', p);
    setCycleCount(0);
  };

  const completeWork = useCallback(() => {
    const mins = Math.round(preset.work);
    const newSessions = todaySessions + 1;
    const newMins = todayMinutes + mins;
    setTodaySessions(newSessions);
    setTodayMinutes(newMins);
    setWeekMinutes((w) => w + mins);
    localStorage.setItem('aiimin_focus_today', String(newSessions));
    localStorage.setItem('aiimin_focus_mins', String(newMins));
    setCycleCount(prev => prev + 1);
    setStatus('success');
    toast.success(`Deep work session complete! +${mins} minutes`, { duration: 5000 });
    logFocusSession({
      duration_minutes: mins,
      session_intent: mainIntent || undefined,
    }).catch(() => {});
  }, [preset.work, todaySessions, todayMinutes, mainIntent]);

  const handleTimerComplete = useCallback(() => {
    if (phase === 'work') completeWork();
    else {
      setStatus('success');
      toast.success(`${PHASES[phase].label} complete — ready to focus again!`);
    }
  }, [phase, completeWork]);

  // Anti-distraction guard
  useEffect(() => {
    const onVis = () => {
      if (status !== 'running' || phase !== 'work') return;
      if (document.hidden) {
        toast.error('Focus compromised! Return to maintain flow.', { duration: 4000 });
        visRef.current = setTimeout(() => {
          setStatus('dead');
          toast.error('Session failed. Context switching breaks flow state.', { duration: 6000 });
        }, 10000); // 10 second grace period
      } else if (visRef.current) {
        clearTimeout(visRef.current);
        visRef.current = null;
        toast.success('Flow maintained.', { duration: 2000 });
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

  const start = () => {
    if (!mainIntent.trim() && phase === 'work') {
      toast.error('Define a singular intent to enter Flow State.');
      document.getElementById('mainIntentInput')?.focus();
      return;
    }
    setStatus('running');
  };
  const pause = () => setStatus(s => s === 'running' ? 'paused' : 'running');
  const abort = () => {
    if (window.confirm('Abandon flow state? Progress will be lost.')) {
      setStatus('dead');
      toast.error('Flow broken.');
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

  const phaseInfo = PHASES[phase];
  const streakLabel = cycleCount >= 4 ? `🔥 ${Math.floor(cycleCount / 4)} streaks` : null;

  return (
    <div className="focus-room-page" style={{
      position: 'relative',
      minHeight: 'calc(100vh - var(--nav-height) - 40px)',
      backgroundColor: 'var(--color-bg)',
      backgroundImage: `radial-gradient(circle at 50% 0%, ${phaseInfo.bgGlow} 0%, var(--color-bg) 100%)`,
      color: 'var(--color-text-1)',
      overflowX: 'hidden', overflowY: 'auto', display: 'flex', flexDirection: 'column',
      borderRadius: '32px',
      border: '1px solid var(--color-border)',
      boxShadow: `0 20px 60px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.08), inset 0 0 80px ${phaseInfo.bgGlow}`,
      margin: '0 auto', width: '100%',
      transition: 'background-image 1s ease, box-shadow 1s ease'
    }}>
      {/* ── AMBIENT DEEP GLOW BACKGROUND ── */}
      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute', top: '50%', left: '50%', width: '120vw', height: '120vw',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle at center, ${phaseInfo.bgGlow} 0%, transparent 60%)`,
          pointerEvents: 'none', zIndex: 0
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at top, var(--color-surface) 0%, transparent 100%)',
        opacity: status === 'running' ? 0.2 : 0.8,
        transition: 'opacity 2s ease', pointerEvents: 'none', zIndex: 0
      }} />

      {/* ── TOP NAV ── */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 48px 16px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', color: phaseInfo.color, opacity: 0.9, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ height: 6, width: 6, borderRadius: '50%', background: phaseInfo.color, boxShadow: `0 0 10px ${phaseInfo.color}`, animation: status === 'running' ? 'pulse 2s infinite' : 'none' }} />
            Focus Room
          </div>
          <div style={{ fontSize: '28px', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--color-text-1)', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: 8 }}>
            Let's build something extraordinary today, {user?.full_name?.split(' ')[0] || 'Architect'}.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {/* Audio Player mini */}
          {audioFiles && audioFiles.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--color-surface)', padding: '10px 24px', borderRadius: '99px', border: '1px solid var(--color-border)', backdropFilter: 'blur(10px)' }}>
              <Music size={16} color="var(--color-text-3)" />
              <div style={{ fontSize: '13px', color: 'var(--color-text-1)', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                {audioFiles[audioIdx]?.name}
              </div>
              <button onClick={nextAudio} style={{ background: 'none', border: 'none', color: 'var(--color-text-2)', cursor: 'pointer', padding: 0, display: 'flex', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0.7}>
                <SkipForward size={16} />
              </button>
            </div>
          )}
          
          {/* Stats */}
          <div style={{ display: 'flex', gap: '32px', background: 'rgba(255,255,255,0.02)', padding: '14px 32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-3)', marginBottom: '4px' }}>Deep Work</div>
              <div style={{ fontSize: '18px', fontWeight: 500, color: 'var(--color-text-1)' }}>{todayMinutes === 0 ? '0' : `${todayMinutes}`}<span style={{ fontSize: '12px', color: 'var(--color-text-3)', marginLeft: '2px' }}>{todayMinutes === 0 ? ' min' : 'm'}</span></div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-3)', marginBottom: '4px' }}>Sessions</div>
              <div style={{ fontSize: '18px', fontWeight: 500, color: 'var(--color-text-1)' }}>{todaySessions}</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-3)', marginBottom: '4px' }}>7d</div>
              <div style={{ fontSize: '18px', fontWeight: 500, color: 'var(--color-text-1)' }}>{weekMinutes}<span style={{ fontSize: '12px', color: 'var(--color-text-3)', marginLeft: '2px' }}>m</span></div>
            </div>
            {streakLabel && (
              <>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-3)', marginBottom: '4px' }}>Momentum</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#F59E0B', textShadow: '0 0 15px rgba(245,158,11,0.4)' }}>{streakLabel}</div>
                </div>
              </>
            )}
          </div>
          
          {/* Back to Today */}
          <button 
            type="button"
            onClick={() => navigate('/overview')}
            style={{
              padding: '12px 24px', borderRadius: '99px', background: 'var(--color-surface)',
              border: '1px solid var(--color-border)', color: 'var(--color-text-1)', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Back to Today
          </button>
        </div>
      </div>

      {/* ── CENTER CONTENT ── */}
      <div style={{ flex: 1, position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Preset & Phase selection — fade out when running */}
        <AnimatePresence>
          {status === 'idle' && (
            <motion.div 
              initial={{ opacity: 0, y: -20, height: 0 }} 
              animate={{ opacity: 1, y: 0, height: 'auto' }} 
              exit={{ opacity: 0, y: -30, height: 0, filter: 'blur(10px)', scale: 0.95 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', marginBottom: '28px' }}
            >
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', background: 'var(--color-surface)', padding: '6px', borderRadius: '99px', border: '1px solid var(--color-border)', backdropFilter: 'blur(20px)' }}>
                {Object.entries(PHASES).map(([k, v]) => (
                  <button key={k} onClick={() => initPhase(k)} style={{
                    padding: '10px 24px', borderRadius: '99px',
                    background: phase === k ? 'var(--color-border)' : 'transparent',
                    color: phase === k ? 'var(--color-text-1)' : 'var(--color-text-2)',
                    border: 'none', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.3s ease', letterSpacing: '0.2em', textTransform: 'uppercase'
                  }}>
                    {v.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                {PRESETS.map(p => (
                  <button key={p.label} onClick={() => changePreset(p)} style={{
                    padding: '10px 28px', borderRadius: '99px',
                    border: `1px solid ${preset.label === p.label ? phaseInfo.color : 'var(--color-border)'}`,
                    background: preset.label === p.label ? `${phaseInfo.color}15` : 'transparent',
                    color: preset.label === p.label ? phaseInfo.color : 'var(--color-text-3)',
                    fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: preset.label === p.label ? `0 0 20px ${phaseInfo.color}20` : 'none'
                  }}
                  onMouseEnter={e => { if(preset.label !== p.label) e.currentTarget.style.background = 'var(--color-surface)' }}
                  onMouseLeave={e => { if(preset.label !== p.label) e.currentTarget.style.background = 'transparent' }}
                  >
                    {p.work}m
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TIMER */}
        <LiveTimerDisplay 
          status={status} 
          phase={phase} 
          totalSeconds={totalSeconds} 
          onComplete={handleTimerComplete} 
          phaseInfo={phaseInfo}
        />

        {/* INTENT INPUT */}
        <div style={{ 
          width: 'min(700px, 92%)', marginTop: '28px', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: status === 'running' ? 0.3 : 1, transform: status === 'running' ? 'scale(0.95) translateY(20px)' : 'scale(1) translateY(0)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: status === 'running' ? phaseInfo.color : 'var(--color-text-2)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '16px' }}>
            {status === 'running' ? <Lock size={16} /> : <Target size={16} />}
            {status === 'running' ? 'Locked intent' : 'Focus intent'}
          </div>
          <div style={{ 
            position: 'relative', width: '100%',
            background: status === 'running' ? 'transparent' : 'var(--color-surface)',
            border: status === 'running' ? 'none' : '1px solid var(--color-border)',
            borderRadius: '24px',
            padding: status === 'running' ? '0' : '20px 40px',
            boxShadow: status === 'running' ? 'none' : '0 20px 40px rgba(0,0,0,0.2)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(20px)'
          }}>
            <input
              id="mainIntentInput"
              value={mainIntent}
              onChange={e => saveIntent(e.target.value)}
              disabled={status === 'running'}
              placeholder="What is your singular mission right now?"
              style={{
                background: 'transparent', border: 'none', color: 'var(--color-text-1)',
                fontSize: status === 'running' ? '46px' : '28px', 
                fontWeight: status === 'running' ? 300 : 400, outline: 'none', width: '100%',
                textAlign: 'center', letterSpacing: '-0.02em',
                fontFamily: 'var(--font-serif)',
                paddingBottom: status === 'running' ? '20px' : '0', 
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
            {/* Animated underline */}
            <div style={{
              position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '2px',
              background: `linear-gradient(90deg, transparent, ${phaseInfo.color}, transparent)`,
              transform: 'scaleX(0.8)', opacity: 0.8, transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              display: status === 'idle' ? 'none' : 'block'
            }} />
          </div>
        </div>
      </div>

      {/* ── BOTTOM CONTROLS ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '24px 48px 48px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {status === 'idle' && (
            <button onClick={start} style={{
              padding: '20px 64px', borderRadius: '99px', border: 'none',
              background: `linear-gradient(135deg, ${phaseInfo.lightGlow}, ${phaseInfo.darkGlow})`,
              color: '#FFF', fontSize: '18px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '16px', letterSpacing: '-0.02em',
              boxShadow: `0 20px 50px ${phaseInfo.color}40, inset 0 2px 10px rgba(255,255,255,0.3)`, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow = `0 30px 60px ${phaseInfo.color}60, inset 0 2px 10px rgba(255,255,255,0.3)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = `0 20px 50px ${phaseInfo.color}40, inset 0 2px 10px rgba(255,255,255,0.3)`; }}
            >
              <Play size={24} fill="currentColor" /> {phase === 'work' ? 'Enter Flow State' : 'Start Recovery'}
            </button>
          )}

          {(status === 'running' || status === 'paused') && (
            <>
              <button onClick={pause} style={{
                padding: '24px 56px', borderRadius: '99px',
                border: `1px solid ${phaseInfo.color}40`, background: `${phaseInfo.color}10`,
                color: phaseInfo.color, fontSize: '18px', fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '16px', backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease', letterSpacing: '-0.01em'
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${phaseInfo.color}20`}
              onMouseLeave={e => e.currentTarget.style.background = `${phaseInfo.color}10`}
              >
                {status === 'running' ? <><Pause size={22} fill="currentColor" /> Pause Flow</> : <><Play size={22} fill="currentColor" /> Resume Flow</>}
              </button>

              <button onClick={abort} style={{
                width: '72px', height: '72px', borderRadius: '50%',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)', color: 'var(--color-text-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ef444420'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface)'; e.currentTarget.style.color = 'var(--color-text-2)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              >
                <Square size={22} fill="currentColor" />
              </button>
            </>
          )}

          {(status === 'dead' || status === 'success') && (
            <div style={{ display: 'flex', gap: '24px' }}>
              <button onClick={reset} style={{
                width: '72px', height: '72px', borderRadius: '50%',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)', color: 'var(--color-text-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface)'; e.currentTarget.style.color = 'var(--color-text-2)'; }}
              >
                <RotateCcw size={22} />
              </button>
              {status === 'success' && (
                <button onClick={nextPhase} style={{
                  padding: '24px 56px', borderRadius: '99px', border: 'none',
                  background: phaseInfo.color, color: '#fff',
                  fontSize: '18px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  boxShadow: `0 20px 50px ${phaseInfo.color}40`, transition: 'all 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {phase === 'work' ? <><Coffee size={22} /> Cognitive Rest</> : <><Brain size={22} /> Back to Flow</>}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent sessions + weekly target — fills dead space below CTA */}
      {status === 'idle' && (
        <div style={{
          position: 'relative',
          zIndex: 10,
          width: 'min(560px, 92%)',
          margin: '0 auto 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          {weekRows.length > 0 && (
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 16,
              padding: '16px 20px',
            }}>
              <div style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-3)',
                marginBottom: 12,
              }}>
                Recent sessions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {weekRows.map((r) => (
                  <div
                    key={r.date}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      alignItems: 'center',
                      gap: 12,
                      fontSize: 12,
                      color: 'var(--color-text-2)',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono, JetBrains Mono, monospace)', fontSize: 11 }}>
                      {formatDate(r.date)}
                    </span>
                    <span style={{ textAlign: 'center', fontWeight: 700, color: 'var(--color-text-1)' }}>
                      {Number(r.minutes) || 0} min
                    </span>
                    <span style={{ textAlign: 'right', color: 'var(--color-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {(mainIntent || 'Focus block').slice(0, 24)}
                    </span>
                  </div>
                ))}
              </div>
              <p style={{
                marginTop: 14,
                marginBottom: 0,
                fontSize: 11,
                color: 'var(--color-text-3)',
                fontWeight: 600,
              }}>
                This week’s logged blocks. Full history lands with Focus archive.
              </p>
            </div>
          )}

          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 16,
            padding: '16px 20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-1)' }}>
                {(weekMinutes / 60).toFixed(1)}h of {WEEKLY_TARGET_H}h weekly target
              </span>
              <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>
                {Math.min(100, Math.round((weekMinutes / (WEEKLY_TARGET_H * 60)) * 100))}%
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: 'var(--color-border)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (weekMinutes / (WEEKLY_TARGET_H * 60)) * 100)}%`,
                background: '#ff6b35',
                borderRadius: 99,
                transition: 'width 0.6s ease',
              }} />
            </div>
            <p style={{ margin: '10px 0 0', fontSize: 11, color: 'var(--color-text-3)' }}>
              Your focus session will start immediately when you enter flow.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

