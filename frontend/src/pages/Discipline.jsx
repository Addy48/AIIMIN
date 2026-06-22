import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, RefreshCw, ChevronDown, ChevronUp, Trophy, Brain, Zap, Lock, Wind, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../utils/supabase';
import Modal from '../components/ui/Modal';

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
    startedAt: null,
    addictionType: '',
    replacementHabit: '',
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
    icon: <Wind size={20} color="#3B82F6" />,
    color: '#3B82F6'
  },
  {
    title: 'HALT Method',
    desc: 'Are you Hungry, Angry, Lonely, or Tired? These four states make you highly vulnerable to relapse. Fix the underlying state instead of giving in.',
    icon: <Activity size={20} color="#F59E0B" />,
    color: '#F59E0B'
  },
  {
    title: 'Urge Surfing',
    desc: 'Don\'t fight the urge. Observe it like a wave. It rises, peaks, and crashes. Ride it out without acting on it. Every time you surf an urge, your brain gets stronger.',
    icon: <Zap size={20} color="#8B5CF6" />,
    color: '#8B5CF6'
  }
];

const ResetModal = ({ isOpen, onConfirm, onCancel, currentDays, currentHours }) => {
  const [trigger, setTrigger] = useState('');
  const [note, setNote] = useState('');
  const [step, setStep] = useState(1);

  return (
    <Modal isOpen={isOpen} onClose={onCancel} hideCloseButton maxWidth="500px">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', marginBottom: '20px' }}>
          <AlertTriangle size={32} color="#EF4444" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '12px', letterSpacing: '-0.02em' }}>Reset Your Streak?</h2>
        <p style={{ fontSize: '15px', color: 'var(--color-text-2)', lineHeight: 1.6, margin: 0 }}>
          You are about to lose <strong style={{ color: '#EF4444' }}>{currentDays}d {currentHours}h</strong>. 
          This action cannot be undone. Brutal honesty is required for recovery.
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '8px', letterSpacing: '0.1em' }}>What was the exact trigger?</label>
        <input
          type="text"
          value={trigger}
          onChange={e => setTrigger(e.target.value)}
          placeholder="e.g. Stress, Boredom, Specific App..."
          style={{
            width: '100%', padding: '16px', background: 'var(--color-base)', border: '1px solid var(--color-border)',
            borderRadius: '12px', fontSize: '15px', color: 'var(--color-text-1)', outline: 'none',
            transition: 'all 0.2s', fontFamily: 'inherit', boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '32px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '8px', letterSpacing: '0.1em' }}>Write a note to your future self</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="How do you feel right now? Read this next time you get an urge."
          style={{
            width: '100%', padding: '16px', background: 'var(--color-base)', border: '1px solid var(--color-border)',
            borderRadius: '12px', fontSize: '15px', color: 'var(--color-text-1)', outline: 'none', minHeight: '100px', resize: 'none',
            transition: 'all 0.2s', fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box'
          }}
        />
      </div>

      {step === 1 ? (
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '16px', background: 'var(--color-base)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '15px', fontWeight: 800, color: 'var(--color-text-1)', cursor: 'pointer', transition: 'all 0.2s' }}>Cancel</button>
          <button onClick={() => setStep(2)} style={{ flex: 1, padding: '16px', background: '#EF4444', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 800, color: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>Next</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => onConfirm({ trigger, note })} style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', fontSize: '15px', fontWeight: 800, color: '#EF4444', cursor: 'pointer', transition: 'all 0.2s' }}>I Confirm Relapse (Reset to 0)</button>
          <button onClick={onCancel} style={{ padding: '16px', background: 'transparent', border: 'none', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-3)', cursor: 'pointer', transition: 'all 0.2s' }}>Nevermind, I am staying strong</button>
        </div>
      )}
    </Modal>
  );
};

/* ── Urge Surfing Modal ── */
const UrgeModal = ({ isOpen, onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(300);
  const [note, setNote] = useState('');
  
  useEffect(() => {
    if (timeLeft <= 0 || !isOpen) return;
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isOpen]);
  
  return (
    <Modal isOpen={isOpen} onClose={onCancel} maxWidth="500px">
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '24px', background: 'var(--color-accent-dim)', borderRadius: '50%', marginBottom: '24px' }}>
          <Wind size={48} color="var(--color-accent)" />
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-text-1)', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>Urge Surfing</h2>
        <div style={{ fontSize: '64px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--color-text-1)', marginBottom: '40px', letterSpacing: '-0.05em' }}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        <textarea
          value={note} onChange={e => setNote(e.target.value)} rows={3}
          placeholder="What is your brain lying to you about right now?"
          style={{ width: '100%', padding: '16px', background: 'var(--color-base)', border: '1px solid var(--color-border)', borderRadius: '12px', marginBottom: '24px', fontSize: '15px', color: 'var(--color-text-1)', boxSizing: 'border-box' }}
        />
        <button onClick={() => onComplete(note)} disabled={timeLeft > 0} style={{ width: '100%', padding: '20px', background: timeLeft === 0 ? '#10B981' : 'var(--color-base)', border: '1px solid var(--color-border)', borderRadius: '12px', color: timeLeft === 0 ? '#fff' : 'var(--color-text-3)', fontWeight: 800, fontSize: '16px', cursor: timeLeft === 0 ? 'pointer' : 'not-allowed', transition: 'all 0.3s' }}>
          {timeLeft === 0 ? 'I Survived the Urge' : 'Surfing... Just breathe.'}
        </button>
      </div>
    </Modal>
  );
};

/* ── Start Recovery Pledge ── */
const StartRecoveryModal = ({ isOpen, onConfirm }) => {
  const [addiction, setAddiction] = useState('');
  const [replacement, setReplacement] = useState('');
  const [signature, setSignature] = useState('');

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} hideCloseButton maxWidth="500px">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-text-1)', marginBottom: '12px', letterSpacing: '-0.02em' }}>The Integrity Pledge</h2>
        <p style={{ fontSize: '15px', color: 'var(--color-text-2)', lineHeight: 1.6 }}>
          You are making a commitment to your future self. 
          Be honest about what you are giving up, and what you will do instead.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '8px' }}>What are you quitting?</label>
          <input value={addiction} onChange={e => setAddiction(e.target.value)} placeholder="e.g. Doomscrolling, Junk Food, Porn..." style={{ width: '100%', padding: '16px', background: 'var(--color-base)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '15px', color: 'var(--color-text-1)', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-3)', marginBottom: '8px' }}>Replacement Habit</label>
          <input value={replacement} onChange={e => setReplacement(e.target.value)} placeholder="e.g. Read 10 pages, Do 20 Pushups..." style={{ width: '100%', padding: '16px', background: 'var(--color-base)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '15px', color: 'var(--color-text-1)', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ background: 'var(--color-accent-dim)', padding: '24px', borderRadius: '16px', border: '1px dashed var(--color-accent)' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', fontStyle: 'italic', color: 'var(--color-text-1)', lineHeight: 1.6 }}>
            "I pledge to leave my old habits behind. When the urge strikes, I will not fold. I will execute my replacement habit instead."
          </p>
          <input value={signature} onChange={e => setSignature(e.target.value)} placeholder="Type your full name to sign" style={{ width: '100%', padding: '14px', background: 'var(--color-surface)', border: '1px solid var(--color-accent)', borderRadius: '8px', fontSize: '15px', color: 'var(--color-text-1)', outline: 'none', boxSizing: 'border-box', textAlign: 'center', fontWeight: 600 }} />
        </div>
      </div>

      <button 
        onClick={() => onConfirm({ addiction, replacement })} 
        disabled={!addiction || !replacement || !signature} 
        style={{ width: '100%', padding: '16px', background: 'var(--color-accent)', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 800, color: '#fff', cursor: (addiction && replacement && signature) ? 'pointer' : 'not-allowed', opacity: (addiction && replacement && signature) ? 1 : 0.5, transition: 'all 0.2s' }}
      >
        I Commit to This Journey
      </button>
    </Modal>
  );
};

/* ── Community Testimonials ── */
const TESTIMONIALS = [
  { text: "I replaced scrolling with stretching. 60 days in, my mind is clearer and my back pain is gone.", author: "Alex T.", days: 60 },
  { text: "The urges never go away fully, but your ability to dismiss them gets 100x stronger.", author: "Marcus P.", days: 140 },
  { text: "Every time I wanted to give up, I surfed the urge for 5 minutes. That 5 minutes saved my life.", author: "Sarah W.", days: 365 },
];

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

  const handleStart = ({ addiction, replacement }) => {
    const now = new Date().toISOString();
    const updated = { 
      ...data, 
      streak: 0, 
      lastUpdated: now, 
      startedAt: now,
      addictionType: addiction,
      replacementHabit: replacement
    };
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
    <div className="page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '100px' }}>
      <div className="content-container" style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '42px', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--color-text-1)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={28} color="var(--color-accent)" />
              </div>
              Discipline Engine
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--color-text-2)', maxWidth: '500px', margin: 0, lineHeight: 1.5 }}>Master your mind. Protect your energy. A relentless pursuit of compounding willpower.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowLog(true)} style={{ padding: '12px 20px', borderRadius: '12px', background: 'var(--bg-card)', color: 'var(--color-text-2)', border: '1px solid var(--color-border)', cursor: 'pointer', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} /> History
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowUrge(true)} style={{ padding: '12px 20px', borderRadius: '12px', background: 'var(--color-accent-dim)', color: 'var(--color-accent)', border: '1px solid rgba(var(--color-accent-rgb), 0.3)', cursor: 'pointer', fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wind size={16} /> Urge Surfing
            </motion.button>
          </div>
        </div>

        {data.lastUpdated ? (
          <>
            {/* Main Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'stretch' }}>
              
              {/* Massive Counter */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '40px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(to right, var(--color-accent), #3B82F6)' }} />
                <div style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-3)', letterSpacing: '0.15em', marginBottom: '24px' }}>Current Streak</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px' }}>
                  <span style={{ fontSize: '120px', fontWeight: 900, color: 'var(--color-text-1)', lineHeight: 1, letterSpacing: '-0.05em' }} ref={daysRef}>{currentDays}</span>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-3)' }}>DAYS</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '40px', width: '100%', maxWidth: '300px' }}>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDailyPledge} disabled={pledgedToday} style={{ flex: 1, padding: '16px', background: pledgedToday ? 'var(--bg-elevated)' : 'var(--color-accent)', border: pledgedToday ? '1px solid var(--color-border)' : 'none', borderRadius: '12px', color: pledgedToday ? 'var(--color-text-3)' : '#fff', fontSize: '14px', fontWeight: 800, cursor: pledgedToday ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {pledgedToday ? <><CheckCircle size={16} /> Pledged</> : <><Shield size={16} /> Pledge Today</>}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowReset(true)} style={{ padding: '16px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '12px', color: '#EF4444', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RefreshCw size={16} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Secondary Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                  {[
                    { label: 'Longest Streak', val: data.longestStreak },
                    { label: 'Total Resets', val: data.totalResets },
                    { label: 'Win Rate', val: (() => {
                      const daysSinceStart = Math.max(1, Math.floor((Date.now() - new Date(data.startedAt).getTime()) / 86400000));
                      const wr = Math.max(0, ((daysSinceStart - data.totalResets) / daysSinceStart) * 100);
                      return `${wr.toFixed(1)}%`;
                    })(), highlight: true }
                  ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ padding: '24px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', textAlign: 'center' }}>{stat.label}</div>
                      <div style={{ fontSize: '32px', fontWeight: 900, color: stat.highlight ? 'var(--color-accent)' : 'var(--color-text-1)', letterSpacing: '-0.02em' }}>{stat.val}</div>
                    </motion.div>
                  ))}
                </div>
                
                {data.addictionType && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ padding: '32px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-3)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '6px', letterSpacing: '0.1em' }}>Target Defeat</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#EF4444', textDecoration: 'line-through' }}>{data.addictionType}</div>
                    </div>
                    <div style={{ width: '1px', height: '100%', background: 'var(--color-border)', margin: '0 24px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-3)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '6px', letterSpacing: '0.1em' }}>New Protocol</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981' }}>{data.replacementHabit}</div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '20px' }}>
              {/* Milestone Progress */}
              <div style={{ padding: '32px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trophy size={20} color="var(--color-accent)" /> Milestone Timeline
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {MILESTONES.map((m, i) => {
                    const isPast = currentDays >= m.days;
                    return (
                      <div key={i} style={{ display: 'flex', gap: '16px', opacity: isPast ? 1 : 0.5, transition: 'all 0.3s' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isPast ? 'var(--color-accent)' : 'var(--bg-elevated)', border: `1px solid ${isPast ? 'transparent' : 'var(--color-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isPast ? <CheckCircle size={16} color="#fff" /> : <Lock size={16} color="var(--color-text-3)" />}
                          </div>
                          {i !== MILESTONES.length - 1 && <div style={{ width: '2px', flex: 1, background: isPast ? 'var(--color-accent)' : 'var(--color-border)', margin: '8px 0', opacity: isPast ? 0.5 : 1 }} />}
                        </div>
                        <div style={{ paddingBottom: '20px', paddingTop: '6px' }}>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '4px' }}>{m.icon} {m.label}</div>
                          <div style={{ fontSize: '13px', color: 'var(--color-text-2)', lineHeight: 1.5 }}>{m.msg}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Emergency Toolkit */}
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Brain size={20} color="var(--color-accent)" /> Emergency Toolkit
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {STRATEGIES.map((s, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.01 }} style={{ padding: '24px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--color-border)', display: 'flex', gap: '20px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: `color-mix(in srgb, ${s.color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {s.icon}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-1)', margin: '0 0 8px 0' }}>{s.title}</h3>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-2)', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-1)', margin: '40px 0 24px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={20} color="var(--color-accent)" /> Community Wall
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {TESTIMONIALS.map((t, i) => (
                    <div key={i} style={{ padding: '24px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--color-text-2)', lineHeight: 1.6, marginBottom: '16px' }}>"{t.text}"</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-1)' }}>{t.author}</span>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-accent)', background: 'var(--color-accent-dim)', padding: '4px 10px', borderRadius: '8px' }}>{t.days} Days Clean</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reset Log */}
            {log.length > 0 && (
              <div style={{ marginTop: '40px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <button onClick={() => setShowLog(l => !l)}
                  style={{
                    width: '100%', background: 'none', border: 'none', padding: '24px 32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', color: 'var(--color-text-1)', fontFamily: 'inherit',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertTriangle size={20} color="#EF4444" />
                    <span style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#EF4444' }}>
                      Relapse Log ({log.length})
                    </span>
                  </div>
                  {showLog ? <ChevronUp size={24} color="var(--color-text-3)" /> : <ChevronDown size={24} color="var(--color-text-3)" />}
                </button>
                <AnimatePresence>
                  {showLog && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 32px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                        {log.map(entry => (
                          <div key={entry.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444' }}>Lost {entry.streakAtReset} days</span>
                              <span style={{ fontSize: '12px', color: 'var(--color-text-3)', fontWeight: 600 }}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-1)', marginBottom: '12px' }}>Trigger: {entry.trigger}</div>
                            {entry.note && <div style={{ fontSize: '13px', color: 'var(--color-text-2)', fontStyle: 'italic', lineHeight: 1.6, background: 'var(--bg-surface)', padding: '12px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>"{entry.note}"</div>}
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
          <div style={{ padding: '80px 40px', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--color-border)', borderRadius: '32px', marginTop: '40px' }}>
            <div style={{ display: 'inline-flex', padding: '24px', background: 'var(--color-accent-dim)', borderRadius: '50%', marginBottom: '32px' }}>
              <Shield size={48} color="var(--color-accent)" />
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--color-text-1)', marginBottom: '16px', letterSpacing: '-0.02em' }}>The First Step</h2>
            <p style={{ color: 'var(--color-text-2)', fontSize: '16px', lineHeight: 1.6, marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px' }}>
              Discipline is choosing between what you want now, and what you want most. It is time to make a choice.
            </p>
            <StartRecoveryModal isOpen={!data.lastUpdated} onConfirm={handleStart} />
          </div>
        )}
      </div>

      {/* Modals */}
      {(() => {
        const s = Math.floor((Date.now() - new Date(data.lastUpdated || Date.now()).getTime()) / 1000);
        const currentD = Math.floor(s / 86400);
        const currentH = Math.floor((s % 86400) / 3600);
        return <ResetModal isOpen={showReset} currentDays={currentD} currentHours={currentH} onConfirm={handleReset} onCancel={() => setShowReset(false)} />;
      })()}

      <UrgeModal isOpen={showUrge} onComplete={handleUrgeSurfed} onCancel={() => setShowUrge(false)} />
    </div>
  );
};

export default Discipline;
