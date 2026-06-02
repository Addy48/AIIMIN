import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, RefreshCw, ChevronDown, ChevronUp, Trophy, Brain, Zap, Lock, X, Wind } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../utils/supabase';
import PageHeader from '../components/layout/PageHeader';/* ── Storage ── */
const SK_DATA = 'aiimin_discipline_v2';
const SK_LOG  = 'aiimin_discipline_log_v2';

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
  { days: 90,  icon: '👑', label: '90 Days',   msg: 'THREE MONTHS. Ronaldo-level commitment.' },
];

const ResetModal = ({ onConfirm, onCancel, currentDays, currentHours }) => {
  const TRIGGERS = [
    'Boredom / loneliness', 'Stress / anxiety', 'Late night scroll',
    'Triggered by content', 'Weak mindset moment', 'Other',
  ];
  const [trigger, setTrigger] = useState('');
  const [note, setNote] = useState('');
  const [confirmText, setConfirmText] = useState('');

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          background: 'var(--color-surface, #111111)',
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: '28px', padding: '36px',
          width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
          position: 'relative'
        }}
      >
        <button 
          onClick={onCancel}
          style={{ 
            position: 'absolute', top: '24px', right: '24px',
            background: 'var(--color-elevated)', border: '1px solid var(--color-border)', 
            color: 'var(--color-text-2)', cursor: 'pointer', padding: '8px',
            borderRadius: '12px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 100
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-elevated)'; e.currentTarget.style.color = 'var(--color-text-2)'; }}
        >
          <X size={20} />
        </button>

        <div style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'center' }}>⚠️</div>
        <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 900, color: '#ef4444', marginBottom: '6px', letterSpacing: '-0.02em' }}>
          You are about to throw away
        </h2>
        <h1 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 900, color: 'var(--color-text-1)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          {currentDays} Days, {currentHours} Hours
        </h1>
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-text-3)', marginBottom: '28px', lineHeight: 1.6 }}>
          Are you sure you want to surrender? If so, take accountability.
        </p>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '10px' }}>
            What triggered it?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {TRIGGERS.map(t => (
              <button key={t} onClick={() => setTrigger(t)}
                style={{
                  padding: '10px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700,
                  border: `1px solid ${trigger === t ? '#ef4444' : 'var(--color-border)'}`,
                  background: trigger === t ? 'rgba(239,68,68,0.1)' : 'var(--color-surface)',
                  color: trigger === t ? '#ef4444' : 'var(--color-text-2)',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '8px' }}>
            Reflect briefly (mandatory):
          </div>
          <textarea
            value={note} onChange={e => setNote(e.target.value)} rows={3}
            placeholder="What were you feeling? What led to this? Be honest."
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: '12px', padding: '12px 14px', fontSize: '13px',
              color: 'var(--color-text-1)', outline: 'none', resize: 'none',
              fontFamily: 'inherit', lineHeight: 1.5,
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '8px' }}>
            Type "I relapse" to confirm:
          </div>
          <input
            type="text"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="I relapse"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: '12px', padding: '12px 14px', fontSize: '13px',
              color: 'var(--color-text-1)', outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel}
            style={{ flex: 1, padding: '14px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', fontSize: '14px', fontWeight: 800, color: 'var(--color-text-2)', cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
          <button onClick={() => confirmText.trim().toLowerCase() === 'i relapse' && trigger && note && onConfirm({ trigger, note })}
            disabled={confirmText.trim().toLowerCase() !== 'i relapse' || !trigger || !note}
            style={{
              flex: 1, padding: '14px', background: (confirmText.trim().toLowerCase() === 'i relapse' && trigger && note) ? '#ef4444' : 'var(--color-surface)',
              border: `1px solid ${(confirmText.trim().toLowerCase() === 'i relapse' && trigger && note) ? '#ef4444' : 'var(--color-border)'}`,
              borderRadius: '14px', fontSize: '14px', fontWeight: 900,
              color: (confirmText.trim().toLowerCase() === 'i relapse' && trigger && note) ? '#fff' : 'var(--color-text-3)',
              cursor: (confirmText.trim().toLowerCase() === 'i relapse' && trigger && note) ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
            Reset & Restart
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
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'var(--color-surface, #111111)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: '32px', padding: '48px',
          width: '100%', maxWidth: '600px',
          position: 'relative', textAlign: 'center'
        }}
      >
        <button 
          onClick={onCancel}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: '80px', height: '80px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#3b82f6' }}
        >
          <Wind size={40} />
        </motion.div>

        <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-text-1)', marginBottom: '8px' }}>Urge Surfing</h2>
        <p style={{ color: 'var(--color-text-3)', marginBottom: '32px', lineHeight: 1.6 }}>Breathe. The urge is a wave. It will peak and it will pass. Just wait it out.</p>

        <div style={{ fontSize: '64px', fontWeight: 900, fontFamily: 'monospace', color: timeLeft === 0 ? '#10b981' : '#3b82f6', marginBottom: '32px', letterSpacing: '-0.05em' }}>
          {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
        </div>

        <div style={{ marginBottom: '32px', textAlign: 'left' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '8px' }}>
            Journal your thoughts (Optional):
          </div>
          <textarea
            value={note} onChange={e => setNote(e.target.value)} rows={3}
            placeholder="Write down what you're feeling right now. Externalize the urge."
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--color-elevated)', border: '1px solid var(--color-border)',
              borderRadius: '12px', padding: '16px', fontSize: '14px',
              color: 'var(--color-text-1)', outline: 'none', resize: 'none',
              fontFamily: 'inherit', lineHeight: 1.6,
            }}
          />
        </div>

        <button onClick={() => onComplete(note)}
          disabled={timeLeft > 0}
          style={{
            width: '100%', padding: '16px', background: timeLeft === 0 ? '#10b981' : 'var(--color-surface)',
            border: `1px solid ${timeLeft === 0 ? '#10b981' : 'var(--color-border)'}`,
            borderRadius: '16px', fontSize: '15px', fontWeight: 800,
            color: timeLeft === 0 ? '#fff' : 'var(--color-text-3)',
            cursor: timeLeft === 0 ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.3s',
          }}>
          {timeLeft === 0 ? 'I Survived the Urge' : 'Wait out the timer...'}
        </button>
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
    const updated = { ...data, streak: 0, lastUpdated: now };
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
    
    // Log relapse to journal
    const content = `#relapse-reflection\n\nI lost a streak of ${currentDays} days.\n\n**Trigger:** ${trigger}\n\n**Reflection:**\n${note}`;
    await logToJournal(content, 1); // Rough mood for a loss
  };

  const nextMilestone = MILESTONES.find(m => m.days > currentDays);

  const motivational = [
    '"Discipline is the bridge between goals and accomplishment." — Jim Rohn',
    '"Hard work beats talent when talent doesn\'t work hard." — Ronaldo',
    '"You are not what you feel. You are what you do." — Mourinho',
    '"Champions are made in the moments they want to quit."',
    '"The pain of discipline is far less than the pain of regret."',
    '"Winning means you\'re willing to go longer, work harder, and give more." — CR7',
  ];
  const quote = motivational[currentDays % motivational.length];

  return (
    <div className="page-container">
      <PageHeader 
        title="Discipline"
        subtitle="Mind Mastery"
        rightContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '8px 14px' }}>
            <Lock size={12} color="var(--color-text-3)" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-3)' }}>Private</span>
          </div>
        }
      />

      {/* Main counter card */}
      <motion.div
        style={{
          background: data.lastUpdated
            ? 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(16,185,129,0.05) 100%)'
            : 'var(--color-surface)',
          border: `1px solid ${data.lastUpdated ? 'rgba(34,197,94,0.3)' : 'var(--color-border)'}`,
          borderRadius: '28px', padding: '40px', marginBottom: '24px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(34,197,94,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {data.lastUpdated ? (
          <>
            {/* Big counter */}
            <div style={{ marginBottom: '8px' }}>
              <motion.div
                key={elapsed}
                style={{ fontSize: '80px', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', fontFamily: 'var(--font-mono, monospace)', color: currentDays >= 7 ? '#22c55e' : currentDays >= 3 ? '#f59e0b' : 'var(--color-text-1)' }}>
                {d}
              </motion.div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-3)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {d === 1 ? 'Day' : 'Days'} Clean
              </div>
            </div>

            {/* HH:MM:SS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '32px' }}>
              {[
                { v: String(h).padStart(2,'0'), l: 'HRS' },
                { v: ':', l: null },
                { v: String(m).padStart(2,'0'), l: 'MIN' },
                { v: ':', l: null },
                { v: String(s).padStart(2,'0'), l: 'SEC' },
              ].map((item, i) => item.l ? (
                <div key={i} style={{ fontSize: '22px', fontWeight: 900, color: 'var(--color-text-3)', fontFamily: 'monospace', lineHeight: 1.2 }}>:</div>
              ) : (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--color-text-2)', fontFamily: 'monospace', lineHeight: 1 }}>{item.v}</div>
                  <div style={{ fontSize: '8px', fontWeight: 800, color: 'var(--color-text-3)', letterSpacing: '0.1em', marginTop: '2px' }}>{item.l}</div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div style={{ fontSize: '12px', color: 'var(--color-text-3)', fontStyle: 'italic', maxWidth: '500px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              {quote}
            </div>

            {/* Next milestone */}
            {nextMilestone && (
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '28px' }}>{nextMilestone.icon}</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-1)' }}>Next: {nextMilestone.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-3)', marginTop: '2px' }}>{nextMilestone.days - currentDays} days away</div>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-accent)' }}>
                  Day {nextMilestone.days}
                </div>
              </div>
            )}

            {/* Daily Pledge */}
            <div style={{ marginBottom: '24px' }}>
              {!pledgedToday ? (
                <button onClick={handlePledge}
                  style={{
                    padding: '14px 32px', background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)', borderRadius: '16px',
                    fontSize: '14px', fontWeight: 800, color: 'var(--color-text-2)',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.color = '#22c55e'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface)'; e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-2)'; }}
                >
                  <Shield size={16} /> I pledge to stay clean today.
                </button>
              ) : (
                <div style={{
                  padding: '12px 24px', background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.3)', borderRadius: '16px',
                  fontSize: '13px', fontWeight: 800, color: '#22c55e',
                  display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto', width: 'fit-content'
                }}>
                  <Shield size={16} /> Pledge Active
                </div>
              )}
            </div>

            {/* Emergency & Reset buttons */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button onClick={() => setShowUrge(true)}
                style={{
                  padding: '12px 28px', background: '#3b82f6',
                  border: 'none', borderRadius: '14px',
                  fontSize: '13px', fontWeight: 800, color: '#fff',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 8px 24px rgba(59,130,246,0.4)'
                }}
              >
                <Wind size={14} /> I have an urge
              </button>
              
              <button onClick={() => setShowReset(true)}
                style={{
                  padding: '12px 28px', background: 'transparent',
                  border: '1px solid rgba(239,68,68,0.4)', borderRadius: '14px',
                  fontSize: '13px', fontWeight: 800, color: 'rgba(239,68,68,0.8)',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = '#ef4444'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
              >
                <RefreshCw size={14} /> Relapse (Reset)
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🛡️</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '8px' }}>Start Your Journey</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-3)', marginBottom: '28px', maxWidth: '360px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Track your mental discipline streak. Private, accountable, and yours alone.
            </div>
            <button onClick={handleStart}
              style={{
                padding: '16px 40px', background: 'var(--color-accent)', border: 'none',
                borderRadius: '16px', fontSize: '16px', fontWeight: 900, color: '#fff',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
              Begin Today
            </button>
          </>
        )}
      </motion.div>

      {/* Stats row */}
      {data.lastUpdated && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Longest Streak', value: `${Math.max(data.longestStreak, currentDays)}d`, icon: <Trophy size={16} />, color: '#f59e0b' },
            { label: 'Total Resets', value: data.totalResets, icon: <RefreshCw size={16} />, color: '#ef4444' },
            { label: 'Current Score', value: `${Math.min(100, currentDays + 1)}%`, icon: <Zap size={16} />, color: '#22c55e' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '18px', padding: '20px', textAlign: 'center' }}>
              <div style={{ color: stat.color, marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-text-1)', letterSpacing: '-0.02em' }}>{stat.value}</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Milestones */}
      {data.lastUpdated && (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={14} color="var(--color-accent)" /> Milestones
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
            {MILESTONES.map(ms => {
              const achieved = currentDays >= ms.days;
              return (
                <div key={ms.days} style={{
                  padding: '14px', borderRadius: '14px', textAlign: 'center',
                  background: achieved ? 'rgba(34,197,94,0.08)' : 'var(--color-elevated, rgba(255,255,255,0.04))',
                  border: `1px solid ${achieved ? 'rgba(34,197,94,0.3)' : 'var(--color-border)'}`,
                  opacity: achieved ? 1 : 0.5,
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px', filter: achieved ? 'none' : 'grayscale(1)' }}>{ms.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: achieved ? '#22c55e' : 'var(--color-text-2)' }}>{ms.label}</div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-3)', marginTop: '2px' }}>Day {ms.days}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reset Log */}
      {log.length > 0 && (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', overflow: 'hidden', marginBottom: '24px' }}>
          <button onClick={() => setShowLog(l => !l)}
            style={{
              width: '100%', background: 'none', border: 'none', padding: '20px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', color: 'var(--color-text-1)', fontFamily: 'inherit',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Brain size={14} color="var(--color-text-3)" />
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)' }}>
                Reset Log ({log.length})
              </span>
            </div>
            {showLog ? <ChevronUp size={16} color="var(--color-text-3)" /> : <ChevronDown size={16} color="var(--color-text-3)" />}
          </button>
          <AnimatePresence>
            {showLog && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {log.map(entry => (
                    <div key={entry.id} style={{ background: 'var(--color-elevated, rgba(255,255,255,0.04))', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444' }}>Reset at {entry.streakAtReset}d</span>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-3)' }}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-2)', marginBottom: '4px' }}>Trigger: {entry.trigger}</div>
                      {entry.note && <div style={{ fontSize: '11px', color: 'var(--color-text-3)', fontStyle: 'italic', lineHeight: 1.5 }}>"{entry.note}"</div>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Real Experiences & Motivation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wind size={14} color="var(--color-accent)" /> Voices of Victory
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'var(--color-elevated)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-text-2)', margin: '0 0 8px 0', lineHeight: 1.6, fontStyle: 'italic' }}>"The first 2 weeks are physical torture. But on day 30, you wake up and the brain fog is gone. You realize the addiction wasn't curing your stress, it was causing it."</p>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-3)' }}>— Reddit User, r/DecidingToBeBetter</span>
            </div>
            <div style={{ padding: '16px', background: 'var(--color-elevated)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-text-2)', margin: '0 0 8px 0', lineHeight: 1.6, fontStyle: 'italic' }}>"I stopped negotiating with my mind. The moment I felt the urge, I started counting down from 5 and physically left the room. Urges pass in 10 minutes if you don't feed them."</p>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-3)' }}>— Quora, Overcoming Bad Habits</span>
            </div>
            <div style={{ padding: '16px', background: 'var(--color-elevated)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-text-2)', margin: '0 0 8px 0', lineHeight: 1.6, fontStyle: 'italic' }}>"Relapse is a part of recovery for many, but don't use it as an excuse. Take accountability, figure out the exact trigger, and build a system so it doesn't happen again."</p>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-3)' }}>— YouTube Comment, Huberman Lab</span>
            </div>
          </div>
        </div>

      </div>

      {/* Reset modal */}
      <AnimatePresence>
        {showReset && <ResetModal currentDays={d} currentHours={h} onConfirm={handleReset} onCancel={() => setShowReset(false)} />}
      </AnimatePresence>

      {/* Urge modal */}
      <AnimatePresence>
        {showUrge && <UrgeModal onComplete={handleUrgeSurfed} onCancel={() => setShowUrge(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Discipline;
