import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Flame, Calendar, Plus, X } from 'lucide-react';

/**
 * AIIMIN Habits Tracker
 * Gallery view of habits + monthly dot calendar + daily tracker
 * Falls back to localStorage if Supabase tables don't exist yet
 */

const DEFAULT_HABITS = [
  { id: 'h1', name: 'Morning Workout', icon: '🏋️', category: 'Health', color: '#22C55E' },
  { id: 'h2', name: 'Read 30 mins', icon: '📚', category: 'Learning', color: '#3B82F6' },
  { id: 'h3', name: 'Journaling', icon: '✍️', category: 'Mindset', color: '#F59E0B' },
  { id: 'h4', name: 'Drink 3L Water', icon: '💧', category: 'Health', color: '#06B6D4' },
  { id: 'h5', name: 'DSA Practice', icon: '💻', category: 'Career', color: '#8B5CF6' },
  { id: 'h6', name: 'No Junk Food', icon: '🥗', category: 'Health', color: '#EC4899' },
];

const STORAGE_KEY = 'aiimin_habits_logs';

const getDayKey = (d = new Date()) => d.toISOString().split('T')[0];

const loadLogs = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
};

const saveLogs = (logs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
};

/* Dot calendar for current month */
const MonthDots = ({ habitId, logs }) => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const today = now.getDate();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '12px' }}>
      {Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth(), i + 1);
        const key = getDayKey(d);
        const done = !!(logs[key] && logs[key][habitId]);
        const isFuture = i + 1 > today;
        return (
          <div key={i} style={{
            width: '9px', height: '9px', borderRadius: '2px',
            background: done ? 'var(--color-accent)' : (isFuture ? 'transparent' : 'var(--color-border)'),
            border: isFuture ? '1px solid var(--color-border)' : 'none',
            opacity: isFuture ? 0.4 : 1,
          }} title={`Day ${i+1}`} />
        );
      })}
    </div>
  );
};

/* Single habit card */
const HabitCard = ({ habit, logs, todayKey, onToggle }) => {
  const isDone = !!(logs[todayKey] && logs[todayKey][habit.id]);
  const streak = (() => {
    let s = 0;
    const d = new Date();
    while (true) {
      const k = getDayKey(d);
      if (logs[k] && logs[k][habit.id]) { s++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return s;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: isDone ? `${habit.color}10` : 'var(--color-surface)',
        border: `1px solid ${isDone ? habit.color + '40' : 'var(--color-border)'}`,
        borderRadius: '20px', padding: '20px',
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>{habit.icon}</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-1)' }}>{habit.name}</div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{habit.category}</div>
          </div>
        </div>
        <button
          onClick={() => onToggle(habit.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDone ? habit.color : 'var(--color-text-3)', padding: 0 }}
        >
          {isDone ? <CheckCircle size={24} strokeWidth={2.5} /> : <Circle size={24} />}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '14px' }}>
        <Flame size={12} color={streak > 0 ? '#F59E0B' : 'var(--color-text-3)'} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: streak > 0 ? '#F59E0B' : 'var(--color-text-3)' }}>
          {streak} day streak
        </span>
        <span style={{ fontSize: '10px', fontWeight: 700, color: isDone ? habit.color : 'var(--color-text-3)', marginLeft: 'auto', textTransform: 'uppercase' }}>
          {isDone ? 'DONE ✓' : 'PENDING'}
        </span>
      </div>

      <MonthDots habitId={habit.id} logs={logs} />
    </motion.div>
  );
};

/* Week view tracker grid */
const WeekTracker = ({ habits, logs }) => {
  const now = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1) + i);
    return d;
  });
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '24px', marginTop: '32px' }}>
      <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-1)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Calendar size={14} color="var(--color-accent)" /> Weekly Tracker
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `160px repeat(7, 1fr)`, gap: '8px', overflowX: 'auto' }}>
        {/* Header */}
        <div />
        {labels.map((l, i) => {
          const isToday = getDayKey(days[i]) === getDayKey();
          return (
            <div key={l} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 800, color: isToday ? 'var(--color-accent)' : 'var(--color-text-3)', textTransform: 'uppercase', paddingBottom: '8px' }}>
              {l}
              <div style={{ fontSize: '12px', fontWeight: 900, color: isToday ? 'var(--color-accent)' : 'var(--color-text-2)', marginTop: '2px' }}>{days[i].getDate()}</div>
            </div>
          );
        })}
        {/* Rows */}
        {habits.map(h => (
          <React.Fragment key={h.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-2)', paddingRight: '8px' }}>
              <span>{h.icon}</span> {h.name}
            </div>
            {days.map(d => {
              const key = getDayKey(d);
              const done = !!(logs[key] && logs[key][h.id]);
              const isFuture = d > now && getDayKey(d) !== getDayKey();
              return (
                <div key={key} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: done ? h.color : (isFuture ? 'transparent' : 'var(--color-border)'),
                    border: isFuture ? '1px solid var(--color-border)' : 'none',
                    opacity: isFuture ? 0.4 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {done && <CheckCircle size={14} color="#fff" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/* ── Main Page ── */
const Habits = () => {
  const [logs, setLogs] = useState(loadLogs);
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const todayKey = getDayKey();

  const completedToday = habits.filter(h => logs[todayKey]?.[h.id]).length;
  const pct = Math.round((completedToday / habits.length) * 100);

  const handleToggle = (habitId) => {
    setLogs(prev => {
      const updated = {
        ...prev,
        [todayKey]: {
          ...(prev[todayKey] || {}),
          [habitId]: !prev[todayKey]?.[habitId],
        }
      };
      saveLogs(updated);
      return updated;
    });
  };

  const addHabit = () => {
    if (!newName.trim()) return;
    const icons = ['⭐','🔥','💎','🎯','🌿','🧘','🎵','🏃'];
    const colors = ['#22C55E','#3B82F6','#F59E0B','#EC4899','#8B5CF6','#06B6D4'];
    const newH = {
      id: `h${Date.now()}`,
      name: newName.trim(),
      icon: icons[Math.floor(Math.random() * icons.length)],
      category: 'Custom',
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setHabits(p => [...p, newH]);
    setNewName(''); setAdding(false);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-accent)', marginBottom: '6px' }}>Daily Discipline</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-text-1)', margin: 0, letterSpacing: '-0.03em', fontFamily: 'var(--font-serif)' }}>Habits.</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-accent)', lineHeight: 1 }}>{completedToday}/{habits.length}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-3)', fontWeight: 600, marginTop: '4px' }}>Completed today</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Today's Progress</span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-accent)' }}>{pct}%</span>
        </div>
        <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: '100%', background: 'var(--color-accent)', borderRadius: '99px' }}
          />
        </div>
      </div>

      {/* Habit cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {habits.map((h, i) => (
          <HabitCard key={h.id} habit={h} logs={logs} todayKey={todayKey} onToggle={handleToggle} />
        ))}

        {/* Add new habit */}
        {adding ? (
          <div style={{ background: 'var(--color-surface)', border: '2px dashed var(--color-accent)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              autoFocus value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addHabit(); if (e.key === 'Escape') { setAdding(false); setNewName(''); } }}
              placeholder="Habit name..."
              style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: 'var(--color-text-1)', outline: 'none', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={addHabit} style={{ flex: 1, background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Add</button>
              <button onClick={() => { setAdding(false); setNewName(''); }} style={{ background: 'var(--color-elevated)', color: 'var(--color-text-2)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}><X size={14} /></button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            style={{
              background: 'transparent', border: '2px dashed var(--color-border)',
              borderRadius: '20px', padding: '20px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '8px', color: 'var(--color-text-3)', minHeight: '120px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-3)'; }}
          >
            <Plus size={24} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>New Habit</span>
          </button>
        )}
      </div>

      {/* Weekly tracker grid */}
      <WeekTracker habits={habits} logs={logs} />
    </div>
  );
};

export default Habits;
