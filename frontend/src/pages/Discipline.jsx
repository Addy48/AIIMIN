import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, RefreshCw, ChevronDown, ChevronUp, Trophy, Brain, Zap, Lock, X, Wind, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../utils/supabase';

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
  const [trigger, setTrigger] = useState('');
  const [note, setNote] = useState('');
  const [step, setStep] = useState(1);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', boxShadow: '0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px var(--border)',
          padding: '40px', maxWidth: '500px', width: '100%',
          position: 'relative'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', padding: '16px', background: 'var(--danger-dim)', borderRadius: '50%', marginBottom: '20px' }}>
            <AlertTriangle size={32} color="var(--danger)" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '12px' }}>Reset Your Streak?</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
            You are about to lose <span style={{ color: 'var(--text-1)' }}>{currentDays}d {currentHours}h</span>. 
            This action cannot be undone. Brutal honesty is required for recovery.
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '8px', letterSpacing: '0.1em' }}>What was the exact trigger?</label>
          <input
            type="text"
            value={trigger}
            onChange={e => setTrigger(e.target.value)}
            placeholder="e.g. Stress, Boredom, Specific App..."
            style={{
              width: '100%', padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', fontSize: '15px', color: 'var(--text-1)', outline: 'none',
              transition: 'all 0.2s', fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '8px', letterSpacing: '0.1em' }}>Write a note to your future self</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="How do you feel right now? Read this next time you get an urge."
            style={{
              width: '100%', padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', fontSize: '15px', color: 'var(--text-1)', outline: 'none', minHeight: '100px', resize: 'none',
              transition: 'all 0.2s', fontFamily: 'inherit', lineHeight: 1.5,
            }}
          />
        </div>

        {step === 1 ? (
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={onCancel} style={{ flex: 1, padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', fontSize: '15px', fontWeight: 800, color: 'var(--text-1)', cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => setStep(2)} disabled={!trigger.trim() || !note.trim()} style={{ flex: 1, padding: '16px', background: 'var(--danger)', border: 'none', borderRadius: 'var(--r-md)', fontSize: '15px', fontWeight: 800, color: '#fff', cursor: (trigger.trim() && note.trim()) ? 'pointer' : 'not-allowed', opacity: (trigger.trim() && note.trim()) ? 1 : 0.5 }}>Next</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => onConfirm({ trigger, note })} style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--r-md)', fontSize: '15px', fontWeight: 800, color: 'var(--danger)', cursor: 'pointer' }}>I Confirm Relapse (Reset to 0)</button>
            <button onClick={onCancel} style={{ padding: '16px', background: 'transparent', border: 'none', fontSize: '14px', fontWeight: 600, color: 'var(--text-3)', cursor: 'pointer' }}>Nevermind, I am staying strong</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

/* ── Urge Surfing Modal ── */
const UrgeModal = ({ onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(300);
  const [note, setNote] = useState('');
  
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);
  
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', boxShadow: '0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px var(--border)',
          padding: '40px', maxWidth: '500px', width: '100%',
        }}
      >
        <button onClick={onCancel} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}><X size={24} /></button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '20px', background: 'var(--accent-dim)', borderRadius: '50%', marginBottom: '24px' }}>
            <Wind size={40} color="var(--accent)" />
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-1)', marginBottom: '16px' }}>Urge Surfing</h2>
          <div style={{ fontSize: '48px', fontWeight: 900, fontFamily: 'monospace', color: 'var(--text-1)', marginBottom: '40px' }}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <textarea
            value={note} onChange={e => setNote(e.target.value)} rows={3}
            placeholder="What is your brain lying to you about right now?"
            style={{ width: '100%', padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', marginBottom: '24px', fontSize: '15px', color: 'var(--text-1)' }}
          />
          <button onClick={() => onComplete(note)} disabled={timeLeft > 0} style={{ width: '100%', padding: '20px', background: timeLeft === 0 ? 'var(--success)' : 'var(--bg-surface)', border: 'none', borderRadius: 'var(--r-md)', color: timeLeft === 0 ? '#fff' : 'var(--text-3)', fontWeight: 800 }}>
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
  const [pledgedToday, setPledgedToday] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return localStorage.getItem('aiimin_discipline_pledge') === today;
  });

  const [currentDays, setCurrentDays] = useState(0);

  const daysRef = useRef(null);
  const hoursRef = useRef(null);
  const minsRef = useRef(null);
  const secsRef = useRef(null);
  const currentDaysRef = useRef(0);

  useEffect(() => {
    if (!data.lastUpdated) {
      setCurrentDays(0);
      currentDaysRef.current = 0;
      return;
    }

    let rafId;
    const calc = () => {
      const ms = Date.now() - new Date(data.lastUpdated).getTime();
      const s = Math.floor(ms / 1000);
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;

      if (daysRef.current) daysRef.current.innerText = d;
      if (hoursRef.current) hoursRef.current.innerText = String(h).padStart(2, '0');
      if (minsRef.current) minsRef.current.innerText = String(m).padStart(2, '0');
      if (secsRef.current) secsRef.current.innerText = String(sec).padStart(2, '0');

      if (d !== currentDaysRef.current) {
        currentDaysRef.current = d;
        setCurrentDays(d);
      }
      rafId = requestAnimationFrame(calc);
    };
    calc();
    return () => cancelAnimationFrame(rafId);
  }, [data.lastUpdated]);

  const handleStart = () => {
    const now = new Date().toISOString();
    const updated = { ...data, streak: 0, lastUpdated: now, startedAt: data.startedAt || now };
    setData(updated);
    saveData(updated);
  };

  const handleDailyPledge = () => {
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
      await logToJournal(content, 5);
    }
  };

  const handleReset = async ({ trigger, note }) => {
    const now = new Date().toISOString();
    const entry = { id: Date.now().toString(), date: now, trigger, note, streakAtReset: currentDays };
    const newLog = [entry, ...log];
    const updated = { ...data, streak: 0, totalResets: data.totalResets + 1, lastUpdated: now, longestStreak: Math.max(data.longestStreak, currentDays) };
    setData(updated);
    setLog(newLog);
    saveData(updated);
    saveLog(newLog);
    setShowReset(false);
    setPledgedToday(false);
    const content = `#relapse-reflection\n\nI lost a streak of ${currentDays} days.\n\n**Trigger:** ${trigger}\n\n**Reflection:**\n${note}`;
    await logToJournal(content, 1);
  };

  return (
    <div className="page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="content-container" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 className="text-heading" style={{ fontSize: '36px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={32} color="var(--accent)" /> 
              Discipline
            </h1>
            <p className="text-subtext" style={{ fontSize: '15px' }}>Master your mind. Protect your energy. Build the streak.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setShowLog(true)} style={{ padding: '12px 20px', borderRadius: 'var(--r-md)', background: 'var(--bg-surface)', color: 'var(--text-2)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} /> History
            </button>
            <button onClick={() => setShowUrge(true)} style={{ padding: '12px 20px', borderRadius: 'var(--r-md)', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wind size={16} /> Urge Surfing
            </button>
          </div>
        </div>

        {data.lastUpdated ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="nordic-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.1em', marginBottom: '16px' }}>Current Streak</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                  <span style={{ fontSize: '72px', fontWeight: 900, color: 'var(--text-1)' }} ref={daysRef}>{currentDays}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-3)' }}>DAYS</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                  <button onClick={() => setShowReset(true)} style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', color: '#ef4444', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                    <RefreshCw size={14} /> Reset
                  </button>
                  <button onClick={handleDailyPledge} disabled={pledgedToday} style={{ padding: '10px 16px', background: pledgedToday ? 'var(--bg-surface)' : 'var(--accent)', border: pledgedToday ? '1px solid var(--border)' : 'none', borderRadius: 'var(--r-md)', color: pledgedToday ? 'var(--text-3)' : '#fff', fontSize: '12px', fontWeight: 700, cursor: pledgedToday ? 'default' : 'pointer' }}>
                    {pledgedToday ? <><CheckCircle size={14} /> Pledged</> : <><Shield size={14} /> Pledge Today</>}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="nordic-card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Longest Streak</div>
                    <div style={{ fontSize: '28px', fontWeight: 900 }}>{data.longestStreak}</div>
                  </div>
                  <div className="nordic-card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Total Resets</div>
                    <div style={{ fontSize: '28px', fontWeight: 900 }}>{data.totalResets}</div>
                  </div>
                </div>
                <div className="nordic-card" style={{ padding: '24px', flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={16} color="var(--accent)" /> Milestone Progress
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {MILESTONES.map((m, i) => {
                      const isPast = currentDays >= m.days;
                      return (
                        <div key={i} style={{ display: 'flex', gap: '16px', opacity: isPast ? 1 : 0.4 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isPast ? 'var(--accent)' : 'var(--bg-surface)', border: `1px solid ${isPast ? 'transparent' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {isPast ? <CheckCircle size={14} color="#fff" /> : <Lock size={14} color="var(--text-3)" />}
                            </div>
                            {i !== MILESTONES.length - 1 && <div style={{ width: '2px', flex: 1, background: isPast ? 'var(--accent)' : 'var(--border)', margin: '4px 0' }} />}
                          </div>
                          <div style={{ paddingBottom: '16px', paddingTop: '6px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)' }}>{m.icon} {m.label}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{m.msg}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Brain size={20} color="var(--accent)" /> Emergency Toolkit
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {STRATEGIES.map((s, i) => (
                  <div key={i} className="nordic-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {s.icon}
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-1)' }}>{s.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Log */}
            {log.length > 0 && (
              <div className="nordic-card" style={{ overflow: 'hidden', marginTop: '20px' }}>
                <button onClick={() => setShowLog(l => !l)}
                  style={{
                    width: '100%', background: 'none', border: 'none', padding: '24px 32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', color: 'var(--text-1)', fontFamily: 'inherit',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={16} color="var(--danger)" />
                    <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--danger)' }}>
                      Relapse Log ({log.length})
                    </span>
                  </div>
                  {showLog ? <ChevronUp size={20} color="var(--text-3)" /> : <ChevronDown size={20} color="var(--text-3)" />}
                </button>
                <AnimatePresence>
                  {showLog && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {log.map(entry => (
                          <div key={entry.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--danger)' }}>Lost streak of {entry.streakAtReset} days</span>
                              <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600 }}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>Trigger: {entry.trigger}</div>
                            {entry.note && <div style={{ fontSize: '14px', color: 'var(--text-2)', fontStyle: 'italic', lineHeight: 1.6, background: 'var(--bg-surface)', padding: '12px', borderRadius: '8px' }}>"{entry.note}"</div>}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        ) : (
          <div className="nordic-card" style={{ padding: '80px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Start Your Recovery</h2>
            <button onClick={handleStart} style={{ padding: '20px 48px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--r-md)', color: '#fff', fontSize: '16px', fontWeight: 800, cursor: 'pointer' }}>Begin Day 1</button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showReset && (() => {
          const s = Math.floor((Date.now() - new Date(data.lastUpdated).getTime()) / 1000);
          const currentD = Math.floor(s / 86400);
          const currentH = Math.floor((s % 86400) / 3600);
          return <ResetModal currentDays={currentD} currentHours={currentH} onConfirm={handleReset} onCancel={() => setShowReset(false)} />;
        })()}
      </AnimatePresence>

      <AnimatePresence>
        {showUrge && <UrgeModal onComplete={handleUrgeSurfed} onCancel={() => setShowUrge(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Discipline;
