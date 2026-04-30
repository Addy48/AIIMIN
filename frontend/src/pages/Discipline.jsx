import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, RefreshCw, ChevronDown, ChevronUp, Trophy, Brain, Zap, Lock, X, Wind, Activity, CheckCircle, AlertTriangle, Flame } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../utils/supabase';
import PageHeader from '../components/layout/PageHeader';

/* ── Storage ── */
const SK_DATA = 'aiimin_discipline_v3';
const SK_LOG  = 'aiimin_discipline_log_v3';

const loadData = () => {
  try { return JSON.parse(localStorage.getItem(SK_DATA) || 'null'); }
  catch { return null; }
};
const loadLog = () => {
  try { return JSON.parse(localStorage.getItem(SK_LOG) || '[]'); }
  catch { return []; }
};
const saveData = (d) => localStorage.setItem(SK_DATA, JSON.stringify(d));
const saveLog  = (l) => localStorage.setItem(SK_LOG,  JSON.stringify(l));

const initData = () => {
  const existing = loadData();
  if (existing) return existing;
  const d = {
    streak: 0,
    longestStreak: 0,
    lastUpdated: null,
    totalResets: 0,
    startedAt: new Date().toISOString(),
  };
  saveData(d);
  return d;
};

const secToDHMS = (sec) => {
  if (!sec || sec < 0) return { d: 0, h: 0, m: 0, s: 0 };
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return { d, h, m, s };
};

/* ── Milestones ── */
const MILESTONES = [
  { days: 1,   icon: '🌱', label: 'First Day', msg: 'The hardest step is the first one.' },
  { days: 3,   icon: '🔥', label: '3 Days',    msg: 'Three days of clarity. Keep going.' },
  { days: 7,   icon: '⚡', label: '1 Week',    msg: 'A full week of discipline. Real progress.' },
  { days: 14,  icon: '🧠', label: '2 Weeks',   msg: '14 days. Your brain is rewiring.' },
  { days: 21,  icon: '💪', label: '3 Weeks',   msg: '21 days — a new habit is forming.' },
  { days: 30,  icon: '🏆', label: '30 Days',   msg: 'A full month. Elite level discipline.' },
  { days: 60,  icon: '🦅', label: '60 Days',   msg: 'Two months. You\'ve mastered your mind.' },
  { days: 90,  icon: '👑', label: '90 Days',   msg: 'THREE MONTHS. Rewired & Reborn.' },
  { days: 365, icon: '🌟', label: '1 Year',    msg: 'An entire year. A completely new life.' },
];

/* ── Recovery Strategies ── */
const STRATEGIES = [
  {
    title: 'The 10-Minute Rule',
    desc: 'When an urge hits, tell yourself you will wait 10 minutes. By the time 10 minutes pass, the chemical spike in your brain will usually have subsided.',
    icon: <Wind size={16} color="#3b82f6" />
  },
  {
    title: 'HALT Method',
    desc: 'Are you Hungry, Angry, Lonely, or Tired? These four states make you highly vulnerable to relapse. Fix the underlying state instead of giving in.',
    icon: <Activity size={16} color="#f59e0b" />
  },
  {
    title: 'Urge Surfing',
    desc: 'Don\'t fight the urge. Observe it like a wave. It rises, peaks, and crashes. Ride it out without acting on it. Every time you surf an urge, your brain gets stronger.',
    icon: <Zap size={16} color="#8b5cf6" />
  }
];

const ResetModal = ({ onConfirm, onCancel, currentDays, currentHours }) => {
  const TRIGGERS = [
    'Boredom / Loneliness', 'Stress / Anxiety', 'Late night / Exhaustion',
    'Triggered by content', 'Rationalization (Just this once)', 'Other',
  ];
  const [trigger, setTrigger] = useState('');
  const [note, setNote] = useState('');
  const [confirmText, setConfirmText] = useState('');

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{
          background: 'rgba(20, 20, 20, 0.9)',
          border: '1px solid rgba(239,68,68,0.5)',
          boxShadow: '0 24px 64px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
          borderRadius: '24px', padding: '36px',
          width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
          position: 'relative'
        }}
      >
        <button 
          onClick={onCancel}
          style={{ 
            position: 'absolute', top: '24px', right: '24px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
            color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '8px',
            borderRadius: '12px', transition: 'all 0.2s', zIndex: 100
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(239,68,68,0.1)', padding: '16px', borderRadius: '50%', border: '1px solid rgba(239,68,68,0.3)' }}>
            <AlertTriangle size={32} color="#ef4444" />
          </div>
        </div>
        
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 900, color: '#ef4444', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          You are about to throw away
        </h2>
        <h1 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 900, color: '#fff', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          {currentDays} Days, {currentHours} Hours
        </h1>
        <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', lineHeight: 1.6 }}>
          Are you completely sure you want to surrender? You will regret this in exactly 5 minutes. If you must, take accountability.
        </p>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
            What triggered this failure?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {TRIGGERS.map(t => (
              <button key={t} onClick={() => setTrigger(t)}
                style={{
                  padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                  border: `1px solid ${trigger === t ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                  background: trigger === t ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.2)',
                  color: trigger === t ? '#ef4444' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
            Reflect on this moment:
          </div>
          <textarea
            value={note} onChange={e => setNote(e.target.value)} rows={3}
            placeholder="What were you feeling? What led to this? Don't make excuses. Be brutally honest."
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '16px', fontSize: '14px',
              color: '#fff', outline: 'none', resize: 'none',
              fontFamily: 'inherit', lineHeight: 1.5,
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
            Type "I surrender" to confirm:
          </div>
          <input
            type="text"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="I surrender"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '16px', fontSize: '14px',
              color: '#fff', outline: 'none', fontFamily: 'inherit',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel}
            style={{ flex: 1, padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '15px', fontWeight: 800, color: 'rgba(255,255,255,0.8)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            Cancel (Stay Strong)
          </button>
          <button onClick={() => confirmText.trim().toLowerCase() === 'i surrender' && trigger && note && onConfirm({ trigger, note })}
            disabled={confirmText.trim().toLowerCase() !== 'i surrender' || !trigger || !note}
            style={{
              flex: 1, padding: '16px', 
              background: (confirmText.trim().toLowerCase() === 'i surrender' && trigger && note) ? '#ef4444' : 'rgba(0,0,0,0.3)',
              border: `1px solid ${(confirmText.trim().toLowerCase() === 'i surrender' && trigger && note) ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '16px', fontSize: '15px', fontWeight: 900,
              color: (confirmText.trim().toLowerCase() === 'i surrender' && trigger && note) ? '#fff' : 'rgba(255,255,255,0.3)',
              cursor: (confirmText.trim().toLowerCase() === 'i surrender' && trigger && note) ? 'pointer' : 'not-allowed', 
              transition: 'all 0.2s',
            }}>
            Reset Streak
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ── Urge Surfing Modal ── */
const UrgeModal = ({ onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [note, setNote] = useState('');
  
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 24px 64px rgba(56, 189, 248, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
          borderRadius: '32px', padding: '48px',
          width: '100%', maxWidth: '600px',
          position: 'relative', textAlign: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Animated breathing background */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', inset: '-50%', background: 'radial-gradient(circle at center, rgba(56,189,248,0.2) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }}
        />

        <button 
          onClick={onCancel}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', zIndex: 10 }}
        >
          <X size={24} />
        </button>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div 
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: '80px', height: '80px', background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#38bdf8' }}
          >
            <Wind size={32} />
          </motion.div>

          <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Urge Surfing</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '36px', lineHeight: 1.6, fontSize: '16px' }}>
            Breathe in deeply for 4 seconds. Hold for 4. Exhale for 4. Hold for 4. 
            <br/><br/>
            The urge is just a temporary chemical wave in your brain. Do not fight it, just watch it pass. It cannot force you to act.
          </p>

          <div style={{ fontSize: '80px', fontWeight: 900, fontFamily: 'monospace', color: timeLeft === 0 ? '#10b981' : '#38bdf8', marginBottom: '40px', letterSpacing: '-0.04em', textShadow: `0 0 40px ${timeLeft === 0 ? 'rgba(16,185,129,0.5)' : 'rgba(56,189,248,0.5)'}` }}>
            {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
          </div>

          <div style={{ marginBottom: '32px', textAlign: 'left' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>
              Externalize the urge (Optional):
            </div>
            <textarea
              value={note} onChange={e => setNote(e.target.value)} rows={3}
              placeholder="Type out what your brain is trying to convince you of right now. Expose the lie."
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px', padding: '16px', fontSize: '15px',
                color: '#fff', outline: 'none', resize: 'none',
                fontFamily: 'inherit', lineHeight: 1.6,
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(56,189,248,0.5)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <button onClick={() => onComplete(note)}
            disabled={timeLeft > 0}
            style={{
              width: '100%', padding: '20px', background: timeLeft === 0 ? '#10b981' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${timeLeft === 0 ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '16px', fontSize: '16px', fontWeight: 800,
              color: timeLeft === 0 ? '#fff' : 'rgba(255,255,255,0.4)',
              cursor: timeLeft === 0 ? 'pointer' : 'not-allowed', transition: 'all 0.3s',
            }}>
            {timeLeft === 0 ? 'I Survived the Urge' : 'Surfing... Just breathe.'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ── Main Discipline Page ── */
const Discipline = () => {
  const { user } = useAuth();
  const [data, setData] = useState(initData);
  const [log, setLog] = useState(loadLog);
  const [showReset, setShowReset] = useState(false);
  const [showUrge, setShowUrge] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [pledgedToday, setPledgedToday] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return localStorage.getItem('aiimin_discipline_pledge') === today;
  });

  // Calculate elapsed seconds from lastUpdated
  useEffect(() => {
    const calc = () => {
      if (!data.lastUpdated) { setElapsed(0); return; }
      const s = Math.floor((Date.now() - new Date(data.lastUpdated).getTime()) / 1000);
      setElapsed(s);
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [data.lastUpdated]);

  const currentDays = data.lastUpdated ? Math.floor(elapsed / 86400) : 0;
  const { d, h, m, s } = secToDHMS(elapsed);

  const handleStart = () => {
    const now = new Date().toISOString();
    const updated = { ...data, streak: 0, lastUpdated: now, startedAt: data.startedAt || now };
    setData(updated);
    saveData(updated);
  };

  const handlePledge = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('aiimin_discipline_pledge', today);
    setPledgedToday(true);
  };

  const logToJournal = async (content, mood) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    try {
      await supabase.from('journal_entries').insert({
        user_id: user.id,
        date: today,
        encrypted_content: content,
        mood: mood,
        energy_level: 3,
        sleep_hours: 7
      });
    } catch (e) {
      console.error("Failed to log to journal:", e);
    }
  };

  const handleUrgeSurfed = async (note) => {
    setShowUrge(false);
    if (note.trim()) {
      const content = `#urge-surfed\n\nI successfully rode out a strong urge today without breaking my streak.\n\n**Reflection during urge:**\n${note}`;
      await logToJournal(content, 5); // Great mood for a win
    }
  };

  const handleReset = async ({ trigger, note }) => {
    const now = new Date().toISOString();
    const entry = {
      id: Date.now().toString(),
      date: now,
      trigger,
      note,
      streakAtReset: currentDays,
    };
    const newLog = [entry, ...log];
    const updated = {
      ...data,
      streak: 0,
      totalResets: data.totalResets + 1,
      lastUpdated: now,
      longestStreak: Math.max(data.longestStreak, currentDays),
    };
    setData(updated);
    setLog(newLog);
    saveData(updated);
    saveLog(newLog);
    setShowReset(false);
    setPledgedToday(false);
    
    // Log relapse to journal
    const content = `#relapse-reflection\n\nI lost a streak of ${currentDays} days.\n\n**Trigger:** ${trigger}\n\n**Reflection:**\n${note}`;
    await logToJournal(content, 1); // Rough mood for a loss
  };

  const nextMilestone = MILESTONES.find(ms => ms.days > currentDays);

  const motivational = [
    '"Discipline is the bridge between goals and accomplishment." — Jim Rohn',
    '"Hard work beats talent when talent doesn\'t work hard." — Cristiano Ronaldo',
    '"You are not what you feel. You are what you do." — Jose Mourinho',
    '"Champions are made in the moments they want to quit."',
    '"The pain of discipline is far less than the pain of regret."',
    '"We must all suffer from one of two pains: the pain of discipline or the pain of regret." — Jim Rohn',
  ];
  const quote = motivational[currentDays % motivational.length] || motivational[0];

  return (
    <div className="page-container" style={{ paddingBottom: '80px' }}>
      <PageHeader 
        title="Discipline & Recovery"
        subtitle="Rewire your brain. Reclaim your life."
        rightContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 14px' }}>
            <Lock size={12} color="var(--color-text-3)" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-3)' }}>Secure & Private</span>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Main Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: data.lastUpdated
              ? 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(16,185,129,0.02) 100%)'
              : 'rgba(255,255,255,0.02)',
            border: `1px solid ${data.lastUpdated ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '32px', padding: '48px', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
            boxShadow: data.lastUpdated ? '0 32px 64px rgba(34,197,94,0.05), inset 0 1px 0 rgba(255,255,255,0.1)' : 'inset 0 1px 0 rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(34,197,94,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {data.lastUpdated ? (
            <>
              {/* Central Timer */}
              <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                <motion.div
                  key={elapsed}
                  style={{ 
                    fontSize: '100px', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', 
                    fontFamily: 'var(--font-mono, monospace)', 
                    color: currentDays >= 7 ? '#22c55e' : currentDays >= 3 ? '#f59e0b' : '#fff',
                    textShadow: currentDays >= 7 ? '0 0 60px rgba(34,197,94,0.3)' : 'none',
                    display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px'
                  }}>
                  {d}
                  <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {d === 1 ? 'Day' : 'Days'}
                  </span>
                </motion.div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#22c55e', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                  Clean & Focused
                </div>
              </div>

              {/* Exact Time HH:MM:SS */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
                {[
                  { v: String(h).padStart(2,'0'), l: 'Hours' },
                  { v: String(m).padStart(2,'0'), l: 'Minutes' },
                  { v: String(s).padStart(2,'0'), l: 'Seconds' },
                ].map((item, i) => (
                  <div key={i} style={{ 
                    background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', 
                    padding: '16px 24px', borderRadius: '20px', minWidth: '100px' 
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', fontFamily: 'monospace', lineHeight: 1, marginBottom: '6px' }}>{item.v}</div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.l}</div>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div style={{ 
                fontSize: '15px', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', maxWidth: '600px', margin: '0 auto 40px', 
                lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {quote}
              </div>

              {/* Next milestone */}
              {nextMilestone && (
                <div style={{ 
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '24px', padding: '24px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '500px', margin: '0 auto 40px' 
                }}>
                  <div style={{ fontSize: '36px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '20px' }}>{nextMilestone.icon}</div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Next Goal: {nextMilestone.label}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-3)', lineHeight: 1.5 }}>{nextMilestone.msg}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-accent)' }}>{nextMilestone.days - currentDays}</div>
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)' }}>Days Left</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
                {!pledgedToday ? (
                  <button onClick={handlePledge}
                    style={{
                      padding: '16px 32px', background: 'rgba(34,197,94,0.1)',
                      border: '1px solid rgba(34,197,94,0.3)', borderRadius: '20px',
                      fontSize: '15px', fontWeight: 800, color: '#22c55e',
                      cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: '10px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; }}
                  >
                    <Shield size={18} /> I pledge to stay clean today
                  </button>
                ) : (
                  <div style={{
                    padding: '16px 32px', background: 'rgba(34,197,94,0.15)',
                    border: '1px solid rgba(34,197,94,0.4)', borderRadius: '20px',
                    fontSize: '15px', fontWeight: 800, color: '#22c55e',
                    display: 'flex', alignItems: 'center', gap: '10px',
                  }}>
                    <CheckCircle size={18} /> Daily Pledge Active
                  </div>
                )}

                <button onClick={() => setShowUrge(true)}
                  style={{
                    padding: '16px 32px', background: '#3b82f6',
                    border: 'none', borderRadius: '20px',
                    fontSize: '15px', fontWeight: 800, color: '#fff',
                    cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    boxShadow: '0 12px 32px rgba(59,130,246,0.3)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Wind size={18} /> I have an urge
                </button>
                
                <button onClick={() => setShowReset(true)}
                  style={{
                    padding: '16px 32px', background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px',
                    fontSize: '15px', fontWeight: 800, color: '#ef4444',
                    cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: '10px',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                >
                  <RefreshCw size={18} /> Relapse
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: '60px 20px' }}>
              <div style={{ fontSize: '80px', marginBottom: '24px', textShadow: '0 0 60px rgba(255,255,255,0.2)' }}>🛡️</div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '16px', letterSpacing: '-0.02em' }}>Start Your Recovery Journey</div>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px', lineHeight: 1.6 }}>
                Addiction shrinks your world. Discipline expands it. Commit to taking your mind back, starting right now.
              </div>
              <button onClick={handleStart}
                style={{
                  padding: '20px 48px', background: 'var(--color-accent)', border: 'none',
                  borderRadius: '24px', fontSize: '18px', fontWeight: 900, color: '#fff',
                  cursor: 'pointer', boxShadow: '0 16px 40px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Begin Day 1
              </button>
            </div>
          )}
        </motion.div>

        {/* Stats row */}
        {data.lastUpdated && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { label: 'Longest Streak', value: `${Math.max(data.longestStreak, currentDays)}d`, icon: <Trophy size={20} />, color: '#f59e0b' },
              { label: 'Total Resets', value: data.totalResets, icon: <RefreshCw size={20} />, color: '#ef4444' },
              { label: 'Current Score', value: `${Math.min(100, currentDays + 1)}%`, icon: <Flame size={20} />, color: '#22c55e' },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '24px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                <div style={{ color: stat.color, marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Commitment Contract / My Why */}
          {data.lastUpdated && (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Brain size={16} color="var(--color-accent)" /> My Commitment (The "Why")
              </div>
              <textarea
                defaultValue={localStorage.getItem('aiimin_discipline_why') || ''}
                onBlur={e => localStorage.setItem('aiimin_discipline_why', e.target.value)}
                placeholder="Why are you doing this? What do you stand to lose if you fail? What kind of person do you want to become? Be brutally honest here."
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px',
                  padding: '20px', fontSize: '15px', color: '#fff', outline: 'none', resize: 'none',
                  fontFamily: 'inherit', lineHeight: 1.6, minHeight: '180px',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
              />
            </div>
          )}

          {/* Recovery Strategies */}
          {data.lastUpdated && (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={16} color="#22c55e" /> Recovery Strategies
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {STRATEGIES.map((s, i) => (
                  <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      {s.icon}
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{s.title}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reset Log */}
        {log.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', overflow: 'hidden' }}>
            <button onClick={() => setShowLog(l => !l)}
              style={{
                width: '100%', background: 'none', border: 'none', padding: '24px 32px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', color: '#fff', fontFamily: 'inherit',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={16} color="#ef4444" />
                <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ef4444' }}>
                  Relapse Log ({log.length})
                </span>
              </div>
              {showLog ? <ChevronUp size={20} color="rgba(255,255,255,0.5)" /> : <ChevronDown size={20} color="rgba(255,255,255,0.5)" />}
            </button>
            <AnimatePresence>
              {showLog && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {log.map(entry => (
                      <div key={entry.id} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#ef4444' }}>Lost streak of {entry.streakAtReset} days</span>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Trigger: {entry.trigger}</div>
                        {entry.note && <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>"{entry.note}"</div>}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showReset && <ResetModal currentDays={d} currentHours={h} onConfirm={handleReset} onCancel={() => setShowReset(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showUrge && <UrgeModal onComplete={handleUrgeSurfed} onCancel={() => setShowUrge(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Discipline;
