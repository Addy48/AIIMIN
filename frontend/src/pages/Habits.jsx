import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Plus, X, Trash2, BarChart2, Check } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';


const DEFAULT_HABITS = [
  { id: 'h1', name: 'Morning Workout', icon: '🏋️', category: 'Health', color: '#22C55E', description: 'Gym session / home workout', target: 7 },
  { id: 'h2', name: 'Read 30 mins', icon: '📚', category: 'Learning', color: '#3B82F6', description: 'Books, articles, technical docs', target: 7 },
  { id: 'h3', name: 'Journaling', icon: '✍️', category: 'Mindset', color: '#F59E0B', description: 'Daily reflection & gratitude', target: 7 },
  { id: 'h4', name: 'Drink 3L Water', icon: '💧', category: 'Health', color: '#06B6D4', description: 'Hydration goal', target: 7 },
  { id: 'h5', name: 'DSA Practice', icon: '💻', category: 'Career', color: '#8B5CF6', description: 'LeetCode / competitive prog', target: 5 },
  { id: 'h6', name: 'No Junk Food', icon: '🥗', category: 'Health', color: '#EC4899', description: 'Clean eating only', target: 7 },
];

const STORAGE_KEY = 'aiimin_habits_v3';
const LOG_KEY     = 'aiimin_habits_logs_v3';
const getDayKey   = (d = new Date()) => d.toISOString().split('T')[0];

const loadHabits = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_HABITS; }
  catch { return DEFAULT_HABITS; }
};
const loadLogs = () => {
  try { return JSON.parse(localStorage.getItem(LOG_KEY) || '{}'); }
  catch { return {}; }
};
const saveHabits = (h) => localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
const saveLogs   = (l) => localStorage.setItem(LOG_KEY,     JSON.stringify(l));

/* ── Streak calculator ── */
const calcStreak = (habitId, logs) => {
  let s = 0;
  const d = new Date();
  while (true) {
    const k = getDayKey(d);
    if (logs[k]?.[habitId]) { s++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return s;
};

/* ── Monthly dot grid ── */
const MonthDots = ({ habitId, logs, color }) => {
  const now = new Date();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const today = now.getDate();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '10px' }}>
      {Array.from({ length: days }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth(), i + 1);
        const done = !!(logs[getDayKey(d)]?.[habitId]);
        const isFuture = i + 1 > today;
        return (
          <div key={i} title={`${now.toLocaleString('default', { month: 'short' })} ${i+1}`}
            style={{
              width: '10px', height: '10px', borderRadius: '3px',
              background: done ? color : (isFuture ? 'transparent' : 'var(--color-border)'),
              border: isFuture ? '1px solid var(--color-border)' : done ? 'none' : 'none',
              opacity: isFuture ? 0.3 : 1, transition: 'all 0.15s',
            }} />
        );
      })}
    </div>
  );
};

/* ── Habit Row (desktop expanded) ── */
const HabitRow = ({ habit, logs, todayKey, onToggle, onDelete, onEdit }) => {
  const isDone   = !!(logs[todayKey]?.[habit.id]);
  const streak   = calcStreak(habit.id, logs);
  const doneCount = Object.values(logs).filter(d => d?.[habit.id]).length;
  const weekDays  = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    const dow = d.getDay() === 0 ? 6 : d.getDay() - 1;
    d.setDate(d.getDate() - dow + i);
    return { key: getDayKey(d), done: !!(logs[getDayKey(d)]?.[habit.id]), isToday: i === dow };
  });
  const weekDone = weekDays.filter(w => w.done).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: isDone ? `${habit.color}0D` : 'var(--color-surface)',
        border: `1px solid ${isDone ? habit.color + '40' : 'var(--color-border)'}`,
        borderRadius: '20px', padding: '20px 24px',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'start' }}>
        {/* Left content */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '22px' }}>{habit.icon}</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-1)' }}>{habit.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-3)', marginTop: '1px' }}>{habit.description}</div>
            </div>
            <span style={{ fontSize: '9px', fontWeight: 800, padding: '3px 8px', background: `${habit.color}18`, color: habit.color, borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              {habit.category}
            </span>
          </div>

          {/* Week dots */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            {['M','T','W','T','F','S','S'].map((l, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: weekDays[i]?.isToday ? habit.color : 'var(--color-text-3)', marginBottom: '3px' }}>{l}</div>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '6px',
                  background: weekDays[i]?.done ? habit.color : 'var(--color-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: weekDays[i]?.isToday ? `2px solid ${habit.color}` : 'none',
                }}>
                  {weekDays[i]?.done && <Check size={12} color="#fff" strokeWidth={3} />}
                </div>
              </div>
            ))}
            <div style={{ borderLeft: '1px solid var(--color-border)', marginLeft: '4px', paddingLeft: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 900, color: streak > 0 ? '#F59E0B' : 'var(--color-text-3)' }}>🔥{streak}</div>
                <div style={{ fontSize: '9px', color: 'var(--color-text-3)', fontWeight: 700 }}>streak</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 900, color: habit.color }}>{weekDone}/{habit.target ?? 7}</div>
                <div style={{ fontSize: '9px', color: 'var(--color-text-3)', fontWeight: 700 }}>this wk</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-text-1)' }}>{doneCount}</div>
                <div style={{ fontSize: '9px', color: 'var(--color-text-3)', fontWeight: 700 }}>all time</div>
              </div>
            </div>
          </div>

          <MonthDots habitId={habit.id} logs={logs} color={habit.color} />
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => onToggle(habit.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDone ? habit.color : 'var(--color-text-3)', padding: 0, transition: 'all 0.15s', transform: isDone ? 'scale(1.1)' : 'scale(1)' }}>
            {isDone ? <CheckCircle size={32} strokeWidth={2} /> : <Circle size={32} />}
          </button>
          <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: isDone ? habit.color : 'var(--color-text-3)', letterSpacing: '0.06em' }}>
            {isDone ? 'DONE' : 'TODO'}
          </div>
          <button onClick={() => onDelete(habit.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-3)', padding: '4px', borderRadius: '6px', opacity: 0.5, marginTop: '4px' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Add Habit Modal ── */
const AddModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('⭐');
  const [cat, setCat] = useState('Health');
  const [color, setColor] = useState('#22C55E');
  const [desc, setDesc] = useState('');
  const [target, setTarget] = useState(7);

  const ICONS   = ['⭐','🔥','💎','🎯','🌿','🧘','🎵','🏃','💪','🧠','🎓','⚡','🌙','☀️'];
  const CATS    = ['Health','Career','Learning','Mindset','Finance','Relationships','Custom'];
  const COLORS  = ['#22C55E','#3B82F6','#F59E0B','#EC4899','#8B5CF6','#06B6D4','#EF4444','#F97316'];

  const submit = () => {
    if (!name.trim()) return;
    onAdd({ id: `h${Date.now()}`, name: name.trim(), icon, category: cat, color, description: desc.trim(), target: Number(target) });
    onClose();
  };

  const inp = { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '10px 14px', color: 'var(--color-text-1)', fontSize: '13px', fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ background: 'var(--color-base)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-1)', margin: 0 }}>New Habit</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Icon</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ICONS.map(ic => (
                <button key={ic} onClick={() => setIcon(ic)}
                  style={{ fontSize: '20px', padding: '6px 8px', borderRadius: '10px', border: `2px solid ${icon === ic ? 'var(--color-accent)' : 'var(--color-border)'}`, background: 'var(--color-surface)', cursor: 'pointer' }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Name</div>
            <input style={inp} placeholder="e.g. Morning Run" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Description (optional)</div>
            <input style={inp} placeholder="Short description..." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {CATS.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  style={{ padding: '6px 12px', borderRadius: '99px', border: `1px solid ${cat === c ? 'var(--color-accent)' : 'var(--color-border)'}`, background: cat === c ? 'var(--color-accent)' : 'transparent', color: cat === c ? '#fff' : 'var(--color-text-2)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Color</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, border: `3px solid ${color === c ? '#fff' : 'transparent'}`, cursor: 'pointer', outline: 'none', boxShadow: color === c ? `0 0 0 2px ${c}` : 'none', transition: 'all 0.15s' }} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weekly Target ({target} days)</div>
            <input type="range" min={1} max={7} value={target} onChange={e => setTarget(e.target.value)}
              style={{ width: '100%', accentColor: color, height: '4px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: 'var(--color-text-3)' }}>
              <span>1x / week</span><span>Daily</span>
            </div>
          </div>
          <button onClick={submit}
            style={{ marginTop: '8px', background: color, color: '#fff', border: 'none', padding: '14px', borderRadius: '14px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
            Create Habit
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ── Weekly Heatmap ── */
const WeeklyHeatmap = ({ habits, logs }) => {
  const now = new Date();
  const dow = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - dow + i);
    return d;
  });
  const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '24px', overflowX: 'auto' }}>
      <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BarChart2 size={14} color="var(--color-accent)" /> Weekly Matrix
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `200px repeat(7, 1fr)`, gap: '8px', minWidth: '600px' }}>
        {/* Header */}
        <div />
        {labels.map((l, i) => {
          const isToday = getDayKey(days[i]) === getDayKey();
          return (
            <div key={l} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 800, color: isToday ? 'var(--color-accent)' : 'var(--color-text-3)', textTransform: 'uppercase' }}>
              {l}
              <div style={{ fontSize: '13px', fontWeight: 900, color: isToday ? 'var(--color-accent)' : 'var(--color-text-2)', marginTop: '2px' }}>{days[i].getDate()}</div>
            </div>
          );
        })}
        {/* Rows */}
        {habits.map(h => (
          <React.Fragment key={h.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-2)', paddingRight: '8px' }}>
              <span style={{ fontSize: '16px' }}>{h.icon}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</span>
            </div>
            {days.map(d => {
              const key = getDayKey(d);
              const done = !!(logs[key]?.[h.id]);
              const isFuture = d > now && key !== getDayKey();
              return (
                <div key={key} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '9px',
                    background: done ? h.color : (isFuture ? 'transparent' : 'var(--color-border)'),
                    border: isFuture ? '1px dashed var(--color-border)' : 'none',
                    opacity: isFuture ? 0.3 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                    {done && <Check size={14} color="#fff" strokeWidth={3} />}
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
  const [habits, setHabits] = useState(loadHabits);
  const [logs,   setLogs]   = useState(loadLogs);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState('all');
  const todayKey = getDayKey();

  useEffect(() => saveHabits(habits), [habits]);
  useEffect(() => saveLogs(logs),   [logs]);

  const completedToday = habits.filter(h => logs[todayKey]?.[h.id]).length;
  const pct = habits.length ? Math.round((completedToday / habits.length) * 100) : 0;

  const handleToggle = (habitId) => {
    setLogs(prev => {
      const updated = { ...prev, [todayKey]: { ...(prev[todayKey] || {}), [habitId]: !prev[todayKey]?.[habitId] } };
      return updated;
    });
  };
  const deleteHabit = (id) => setHabits(p => p.filter(h => h.id !== id));
  const addHabit    = (h)  => setHabits(p => [h, ...p]);

  const CATS = ['all', ...new Set(habits.map(h => h.category))];
  const filtered = filter === 'all' ? habits : habits.filter(h => h.category === filter);

  return (
    <div className="page-container">
      {/* Header */}
      {/* Header */}
      <PageHeader 
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            Habits<span style={{ color: 'var(--color-accent)', opacity: 0.5 }}>.</span>
          </span>
        }
        subtitle="Daily Discipline"
        rightContent={
          <>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: pct === 100 ? '#22C55E' : 'var(--color-accent)', lineHeight: 1 }}>{completedToday}/{habits.length}</div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-3)', fontWeight: 700, marginTop: '3px' }}>today's habits</div>
            </div>
            <button onClick={() => window.location.search.includes('guest') ? window.dispatchEvent(new CustomEvent('guest-gate', {detail: 'create habits'})) : setAdding(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-accent)', border: 'none', borderRadius: '14px', padding: '12px 18px', fontSize: '13px', fontWeight: 800, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
              <Plus size={15} /> New
            </button>
          </>
        }
      />

      {/* Progress bar */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Today's Progress</span>
          <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--color-accent)' }}>{pct}%</span>
        </div>
        <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
            style={{ height: '100%', background: pct === 100 ? '#22C55E' : 'var(--color-accent)', borderRadius: '99px' }} />
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{
              padding: '6px 16px', borderRadius: '99px', fontFamily: 'inherit',
              border: `1px solid ${filter === c ? 'var(--color-accent)' : 'var(--color-border)'}`,
              background: filter === c ? 'var(--color-accent)' : 'transparent',
              color: filter === c ? '#fff' : 'var(--color-text-2)',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              textTransform: c === 'all' ? 'none' : 'capitalize',
            }}>
            {c === 'all' ? 'All Habits' : c}
          </button>
        ))}
      </div>

      {/* Habit list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        <AnimatePresence>
          {filtered.map(h => (
            <HabitRow key={h.id} habit={h} logs={logs} todayKey={todayKey} onToggle={handleToggle} onDelete={deleteHabit} />
          ))}
        </AnimatePresence>
      </div>

      {/* Weekly heatmap */}
      <WeeklyHeatmap habits={habits} logs={logs} />

      {/* Add Modal */}
      <AnimatePresence>
        {adding && <AddModal onClose={() => setAdding(false)} onAdd={addHabit} />}
      </AnimatePresence>
    </div>
  );
};

export default Habits;
