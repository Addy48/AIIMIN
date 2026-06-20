import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Plus, Trash2, BarChart2, Check, Loader2 } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import YearlyHabitMatrix from '../components/overview/YearlyHabitMatrix';
import Modal from '../components/ui/Modal';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

const getDayKey = (d = new Date()) => {
  // Use local time, format to YYYY-MM-DD
  const offset = d.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(d - offset)).toISOString().slice(0, -1);
  return localISOTime.split('T')[0];
};

/* ── Streak calculator ── */
const calcStreak = (habit) => {
  let s = 0;
  const d = new Date();
  const completedDates = habit.meta?.completedDates || [];
  while (true) {
    const k = getDayKey(d);
    if (completedDates.includes(k)) { s++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return s;
};

/* ── Monthly dot grid ── */
const MonthDots = ({ habit, color }) => {
  const now = new Date();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const today = now.getDate();
  const completedDates = habit.meta?.completedDates || [];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '10px' }}>
      {Array.from({ length: days }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth(), i + 1);
        const done = completedDates.includes(getDayKey(d));
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
const HabitRow = ({ habit, todayKey, onToggle, onDelete, onEdit }) => {
  const completedDates = habit.meta?.completedDates || [];
  const isDone   = completedDates.includes(todayKey);
  const streak   = calcStreak(habit);
  const doneCount = completedDates.length;
  
  const weekDays  = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    const dow = d.getDay() === 0 ? 6 : d.getDay() - 1;
    d.setDate(d.getDate() - dow + i);
    const key = getDayKey(d);
    return { key, done: completedDates.includes(key), isToday: i === dow };
  });
  const weekDone = weekDays.filter(w => w.done).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        background: isDone ? `${habit.meta?.color || '#3B82F6'}0D` : 'var(--color-surface)',
        border: `1px solid ${isDone ? (habit.meta?.color || '#3B82F6') + '40' : 'var(--color-border)'}`,
        borderRadius: '20px', padding: '20px 24px',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'start' }}>
        {/* Left content */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '22px' }}>{habit.emoji}</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-1)' }}>{habit.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-3)', marginTop: '1px' }}>{habit.meta?.description}</div>
            </div>
            <span style={{ fontSize: '9px', fontWeight: 800, padding: '3px 8px', background: `${habit.meta?.color || '#3B82F6'}18`, color: habit.meta?.color || '#3B82F6', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              {habit.category || 'General'}
            </span>
          </div>

          {/* Week dots */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            {['M','T','W','T','F','S','S'].map((l, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: weekDays[i]?.isToday ? (habit.meta?.color || '#3B82F6') : 'var(--color-text-3)', marginBottom: '3px' }}>{l}</div>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '6px',
                  background: weekDays[i]?.done ? (habit.meta?.color || '#3B82F6') : 'var(--color-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: weekDays[i]?.isToday ? `2px solid ${habit.meta?.color || '#3B82F6'}` : 'none',
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
                <div style={{ fontSize: '14px', fontWeight: 900, color: habit.meta?.color || '#3B82F6' }}>{weekDone}/{habit.frequency === 'daily' ? 7 : (habit.meta?.target || 7)}</div>
                <div style={{ fontSize: '9px', color: 'var(--color-text-3)', fontWeight: 700 }}>this wk</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-text-1)' }}>{doneCount}</div>
                <div style={{ fontSize: '9px', color: 'var(--color-text-3)', fontWeight: 700 }}>all time</div>
              </div>
            </div>
          </div>

          <MonthDots habit={habit} color={habit.meta?.color || '#3B82F6'} />
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => onToggle(habit)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDone ? (habit.meta?.color || '#3B82F6') : 'var(--color-text-3)', padding: 0, transition: 'all 0.15s', transform: isDone ? 'scale(1.1)' : 'scale(1)' }}>
            {isDone ? <CheckCircle size={32} strokeWidth={2} /> : <Circle size={32} />}
          </button>
          <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: isDone ? (habit.meta?.color || '#3B82F6') : 'var(--color-text-3)', letterSpacing: '0.06em' }}>
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
const AddModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('⭐');
  const [cat, setCat] = useState('Health');
  const [color, setColor] = useState('#22C55E');
  const [desc, setDesc] = useState('');
  const [target, setTarget] = useState(7);
  const [loading, setLoading] = useState(false);

  const ICONS   = ['⭐','🔥','💎','🎯','🌿','🧘','🎵','🏃','💪','🧠','🎓','⚡','🌙','☀️'];
  const CATS    = ['Health','Career','Learning','Mindset','Finance','Relationships','Custom'];
  const COLORS  = ['#22C55E','#3B82F6','#F59E0B','#EC4899','#8B5CF6','#06B6D4','#EF4444','#F97316'];

  const submit = async () => {
    if (!name.trim() || loading) return;
    setLoading(true);
    
    try {
      const payload = {
        name: name.trim(),
        emoji: icon,
        category: cat,
        frequency: target === 7 ? 'daily' : 'weekly',
        meta: {
          color,
          description: desc.trim(),
          target: Number(target),
          completedDates: []
        }
      };
      
      const newHabit = await apiPost('/habits', payload);
      onAdd({
        ...newHabit,
        meta: newHabit.meta || payload.meta
      });
      onClose();
      // Reset form
      setName(''); setDesc(''); setTarget(7);
    } catch (err) {
      console.error('Failed to create habit', err);
      alert('Failed to create habit');
    } finally {
      setLoading(false);
    }
  };

  const inp = { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '10px 14px', color: 'var(--color-text-1)', fontSize: '13px', fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Habit" maxWidth="480px">
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
          <button onClick={submit} disabled={loading || !name.trim()}
            style={{ marginTop: '8px', background: color, color: '#fff', border: 'none', padding: '14px', borderRadius: '14px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', opacity: (!name.trim() || loading) ? 0.5 : 1 }}>
            {loading ? <Loader2 size={18} className="spin" style={{ margin: '0 auto' }} /> : 'Create Habit'}
          </button>
        </div>
    </Modal>
  );
};

/* ── Weekly Heatmap ── */
const WeeklyHeatmap = ({ habits }) => {
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
              <span style={{ fontSize: '16px' }}>{h.emoji}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</span>
            </div>
            {days.map(d => {
              const key = getDayKey(d);
              const completedDates = h.meta?.completedDates || [];
              const done = completedDates.includes(key);
              const isFuture = d > now && key !== getDayKey();
              return (
                <div key={key} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '9px',
                    background: done ? (h.meta?.color || '#3B82F6') : (isFuture ? 'transparent' : 'var(--color-border)'),
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
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState('all');
  const todayKey = getDayKey();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    // Abort after 5 seconds so the page never hangs forever
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const rows = await apiGet('/habits', { signal: controller.signal });
      // Ensure meta is initialized
      const processedHabits = (rows || []).map(h => ({
        ...h,
        meta: h.meta || { completedDates: [] }
      }));
      setHabits(processedHabits);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn('fetchHabits: request timed out');
        setError('Could not reach the server. Check your connection or start the backend.');
      } else {
        console.error('Failed to load habits:', err);
        setError('Failed to load habits. Please try again.');
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };


  const completedToday = habits.filter(h => (h.meta?.completedDates || []).includes(todayKey)).length;
  const pct = habits.length ? Math.round((completedToday / habits.length) * 100) : 0;

  const handleToggle = async (habit) => {
    // Optimistic UI update
    const completedDates = habit.meta?.completedDates || [];
    const isDone = completedDates.includes(todayKey);
    let newCompletedDates;
    
    if (isDone) {
      newCompletedDates = completedDates.filter(d => d !== todayKey);
    } else {
      newCompletedDates = [...completedDates, todayKey];
    }
    
    const updatedMeta = { ...habit.meta, completedDates: newCompletedDates };
    
    setHabits(prev => prev.map(h => 
      h.id === habit.id ? { ...h, meta: updatedMeta } : h
    ));
    
    // API Call
    try {
      await apiPut(`/habits/${habit.id}`, { meta: updatedMeta });
    } catch (err) {
      console.error('Failed to toggle habit', err);
      // Revert on failure
      fetchHabits();
    }
  };
  
  const deleteHabit = async (id) => {
    setHabits(p => p.filter(h => h.id !== id));
    try {
      await apiDelete(`/habits/${id}`);
    } catch (err) {
      console.error('Failed to delete habit', err);
      fetchHabits();
    }
  };
  
  const addHabit = (h) => {
    setHabits(p => [h, ...p]);
  };

  const CATS = ['all', ...new Set(habits.map(h => h.category || 'General'))];
  const filtered = filter === 'all' ? habits : habits.filter(h => (h.category || 'General') === filter);

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loader2 className="spin" size={32} color="var(--color-accent)" />
      </div>
    );
  }

  return (
    <div className="page-container">
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

      {error && (
        <div style={{ background: '#EF444420', color: '#EF4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: 600 }}>
          {error}
        </div>
      )}

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
            <HabitRow key={h.id} habit={h} todayKey={todayKey} onToggle={handleToggle} onDelete={deleteHabit} />
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-3)' }}>
              <Circle size={48} strokeWidth={1} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-2)' }}>No habits found</div>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>Click "New" to start building discipline.</div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Weekly heatmap */}
      {habits.length > 0 && <WeeklyHeatmap habits={habits} />}

      <YearlyHabitMatrix />

      <AddModal isOpen={adding} onClose={() => setAdding(false)} onAdd={addHabit} />
    </div>
  );
};

export default Habits;
