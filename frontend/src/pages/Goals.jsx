import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, BookOpen, Briefcase, Heart, Brain, Trash2, Clock } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import GoalsVisionTitle from '../components/ui/GoalsVisionTitle';
import Modal from '../components/ui/Modal';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';
import toast from '../utils/toast';

/* ── Local cache helpers ─────────────────────────────────────── */
const GOALS_KEY = 'aiimin_goals_cache_v1';
const loadGoals = () => { try { return JSON.parse(localStorage.getItem(GOALS_KEY) || '[]'); } catch { return []; } };
const saveGoals = (g) => localStorage.setItem(GOALS_KEY, JSON.stringify(g));

/* ── Constants ─────────────────────────────────────────────── */
const PILLARS = [
  { key: 'academic', label: 'Academic', icon: <BookOpen size={16} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', desc: 'Knowledge & Mastery' },
  { key: 'career', label: 'Career', icon: <Briefcase size={16} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)', desc: 'Professional Growth' },
  { key: 'health', label: 'Health', icon: <Heart size={16} />, color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', desc: 'Vitality & Balance' },
  { key: 'personal', label: 'Personal', icon: <Brain size={16} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', desc: 'Mindset & Habits' },
];

const STATUS_OPTS = ['Active', 'On Track', 'At Risk', 'Achieved'];

const normalizeGoalStatus = (status) => (STATUS_OPTS.includes(status) ? status : 'Active');

const STATUS_COLORS = {
  'Active': '#6b7280',
  'On Track': '#10b981',
  'At Risk': '#ef4444',
  'Achieved': '#f59e0b',
};

const PRIORITIES = [
  { level: 'High', color: '#ef4444' },
  { level: 'Medium', color: '#f59e0b' },
  { level: 'Low', color: '#3b82f6' }
];

const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / 86400000);
};

const blankGoal = () => ({
  id: 'temp_' + Date.now().toString(),
  title: '',
  pillar: 'career',
  priority: 'Medium',
  targetDate: '',
  why: '',
  milestones: [{ text: '', done: false }],
  status: 'Active',
  createdAt: new Date().toISOString(),
});

/* ── Goal Card ────────────────────────────────────────────── */
const GoalCard = ({ goal, onUpdate, onDelete }) => {
  const pillar = PILLARS.find(p => p.key === goal.pillar) || PILLARS[0];
  const progress = goal.milestones?.length ? Math.round((goal.milestones.filter(m => m.done).length / goal.milestones.length) * 100) : 0;
  const days = daysUntil(goal.targetDate);
  const statusColor = STATUS_COLORS[goal.status] || '#6b7280';

  const toggleMilestone = (i) => {
    const updated = { ...goal, milestones: goal.milestones.map((m, idx) => idx === i ? { ...m, done: !m.done } : m) };
    if (updated.milestones.every(m => m.done) && updated.status !== 'Achieved') updated.status = 'Achieved';
    onUpdate(updated);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }} 
      animate={{ opacity: 1, y: 0 }} 
      layout
      style={{ 
        background: 'rgba(255,255,255,0.02)', 
        border: '1px solid rgba(255,255,255,0.05)', 
        borderRadius: '12px', 
        display: 'flex', 
        flexDirection: 'column', 
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ height: '3px', background: pillar.color, width: `${progress}%`, transition: 'width 0.4s' }} />
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '2px' }}>
              <span style={{ color: pillar.color }}>{pillar.icon}</span>
              <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-1)', margin: 0 }}>{goal.title || 'Untitled Goal'}</h3>
            </div>
            {goal.why && <p style={{ fontSize: '10px', color: 'var(--color-text-3)', fontStyle: 'italic', margin: 0 }}>"{goal.why}"</p>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <select 
              value={goal.status} 
              onChange={e => onUpdate({ ...goal, status: e.target.value })}
              style={{ background: 'none', border: 'none', color: statusColor, fontSize: '10px', fontWeight: 800, cursor: 'pointer', outline: 'none', padding: 0 }}
            >
              {STATUS_OPTS.map(o => <option key={o} value={o} style={{ background: '#111', color: '#fff' }}>{o}</option>)}
            </select>
          </div>
        </div>

        {goal.targetDate && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', fontSize: '10px', color: days !== null && days < 7 ? '#ef4444' : 'var(--color-text-3)', fontWeight: 600 }}>
            <Clock size={10} /> 
            {days !== null ? (days < 0 ? `Overdue by ${Math.abs(days)}d` : days === 0 ? 'Due Today' : `${days}d left`) : 'No date'}
          </div>
        )}



        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {goal.milestones?.map((m, i) => m.text && (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px', background: m.done ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
              <input type="checkbox" checked={m.done} onChange={() => toggleMilestone(i)} style={{ accentColor: pillar.color, margin: 0, width: '12px', height: '12px' }} />
              <span style={{ fontSize: '11px', fontWeight: 500, color: m.done ? 'var(--color-text-3)' : 'var(--color-text-2)', textDecoration: m.done ? 'line-through' : 'none' }}>{m.text}</span>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 600, color: days < 7 ? '#ef4444' : 'var(--color-text-3)' }}>
            <Clock size={10} /> {days === null ? 'No date' : days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `${days}d left`}
          </div>
          
          <button onClick={() => onDelete(goal.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Add Goal Modal ────────────────────────────────────────── */
const GoalModal = ({ isOpen, onClose, onSave }) => {
  const [goal, setGoal] = useState(blankGoal());
  const pillar = PILLARS.find(p => p.key === goal.pillar) || PILLARS[0];

  const updateMilestone = (i, text) => setGoal(g => ({ ...g, milestones: g.milestones.map((m, idx) => idx === i ? { ...m, text } : m) }));
  const addMilestone = () => goal.milestones.length < 5 && setGoal(g => ({ ...g, milestones: [...g.milestones, { text: '', done: false }] }));
  const removeMilestone = (i) => setGoal(g => ({ ...g, milestones: g.milestones.filter((_, idx) => idx !== i) }));

  const inp = { 
    background: 'var(--bg-elevated)', 
    border: '1px solid var(--color-border)', 
    borderRadius: '10px', 
    padding: '10px 14px', 
    color: 'var(--color-text-1)', 
    fontSize: '13px', 
    fontFamily: 'inherit', 
    outline: 'none', 
    width: '100%', 
    boxSizing: 'border-box',
    transition: 'all 0.2s'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Define Goal" maxWidth="560px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Domain</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {PILLARS.map(p => (
                <button key={p.key} onClick={() => setGoal(g => ({ ...g, pillar: p.key }))}
                  style={{ 
                      padding: '12px 8px', 
                      borderRadius: '16px', 
                      border: `1px solid ${goal.pillar === p.key ? p.color : 'rgba(255,255,255,0.05)'}`, 
                      background: goal.pillar === p.key ? p.bg : 'rgba(255,255,255,0.02)', 
                      color: goal.pillar === p.key ? p.color : 'var(--color-text-2)', 
                      fontSize: '11px', 
                      fontWeight: 800, 
                      cursor: 'pointer', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: '8px',
                      transition: 'all 0.2s'
                  }}>
                  {p.icon}{p.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Goal Title</div>
              <input style={inp} placeholder="What do you want to achieve?" value={goal.title} onChange={e => setGoal(g => ({ ...g, title: e.target.value }))} />
            </div>
            <div style={{ width: '140px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Priority</div>
              <select style={inp} value={goal.priority} onChange={e => setGoal(g => ({ ...g, priority: e.target.value }))}>
                {PRIORITIES.map(p => <option key={p.level} value={p.level}>{p.level}</option>)}
              </select>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Why it matters</div>
            <input style={inp} placeholder="Why does this goal matter to you?" value={goal.why} onChange={e => setGoal(g => ({ ...g, why: e.target.value }))} />
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Target Date</div>
            <input type="date" style={inp} value={goal.targetDate} onChange={e => setGoal(g => ({ ...g, targetDate: e.target.value }))} />
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Milestones ({goal.milestones.length} of 5 max)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {goal.milestones.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input style={{ ...inp, flex: 1 }} placeholder={`Step ${i + 1} — e.g. Finish first draft`} value={m.text} onChange={e => updateMilestone(i, e.target.value)} />
                  {goal.milestones.length > 1 && <button onClick={() => removeMilestone(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={16} /></button>}
                </div>
              ))}
              {goal.milestones.length < 5 && (
                <button onClick={addMilestone} style={{ background: 'transparent', border: `1px dashed rgba(255,255,255,0.1)`, borderRadius: '16px', padding: '12px', fontSize: '13px', color: 'var(--color-text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Plus size={14} /> Add Step
                </button>
              )}
            </div>
          </div>

          <button onClick={() => { if (goal.title.trim()) { onSave(goal); onClose(); } }}
            style={{ 
                marginTop: '16px', 
                background: pillar.color, 
                color: '#fff', 
                border: 'none', 
                padding: '16px', 
                borderRadius: '14px', 
                fontSize: '15px', 
                fontWeight: 800, 
                cursor: 'pointer', 
                width: '100%',
                boxShadow: `0 8px 20px ${pillar.color}40`,
                transition: 'all 0.2s'
            }}>
            Confirm Goal
          </button>
        </div>
    </Modal>
  );
};

/* ── Main Goals Page ──────────────────────────────────────── */
const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('pipeline');

  // Load from API on mount
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await apiGet('/goals');
        setGoals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch goals from API:', err);
        // Fallback to local cache
        setGoals(loadGoals());
      }
    };
    fetchGoals();
  }, []);

  // Save to local cache as backup
  useEffect(() => {
    const timer = setTimeout(() => saveGoals(goals), 500);
    return () => clearTimeout(timer);
  }, [goals]);

  const addGoal = async (g) => {
    // Optimistic
    const tempId = `temp_${Date.now()}`;
    const newGoal = { ...g, id: tempId };
    setGoals(p => [newGoal, ...p]);
    
    try {
      const created = await apiPost('/goals', g);
      setGoals(p => p.map(goal => goal.id === tempId ? created : goal));
      toast.success('Goal added');
    } catch (err) {
      console.error('Add goal error:', err);
      toast.error('Failed to save to server');
      // If backend fails, keep the optimistic one and it'll sync to local cache
    }
  };

  const updateGoal = async (updated) => {
    // Optimistic
    setGoals(p => p.map(g => g.id === updated.id ? updated : g));
    
    try {
      // Only PUT if it's a real ID from backend (not optimistic temp id)
      if (!String(updated.id).startsWith('temp_')) {
        await apiPut(`/goals/${updated.id}`, updated);
      }
    } catch (err) {
      console.error('Update goal error:', err);
      toast.error('Sync failed');
    }
  };

  const deleteGoal = async (id) => {
    // Optimistic
    setGoals(p => p.filter(g => g.id !== id));
    
    try {
      if (!String(id).startsWith('temp_')) {
        await apiDelete(`/goals/${id}`);
        toast.success('Goal deleted');
      }
    } catch (err) {
      console.error('Delete goal error:', err);
      toast.error('Delete failed to sync');
    }
  };

  // Pipeline needs Achieved in its column; Grid = active only; Archive = won only.
  const baseGoals =
    viewMode === 'archive'
      ? goals.filter((g) => normalizeGoalStatus(g.status) === 'Achieved')
      : viewMode === 'pipeline'
        ? goals
        : goals.filter((g) => normalizeGoalStatus(g.status) !== 'Achieved');
  const filtered = filter === 'all' ? baseGoals : baseGoals.filter((g) => g.pillar === filter);
  const onTrackCount = goals.filter((g) => normalizeGoalStatus(g.status) === 'On Track').length;
  const activeCount = goals.filter((g) => normalizeGoalStatus(g.status) !== 'Achieved').length;
  const wonCount = goals.filter((g) => normalizeGoalStatus(g.status) === 'Achieved').length;
  const boardTotal = filtered.length;

  return (
    <div className="page-container">
      
      <PageHeader 
        title={<GoalsVisionTitle />}
        subtitle={
          <span style={{ color: 'var(--color-text-3)', fontSize: '12px', margin: 0, fontWeight: 500 }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{activeCount} active commitment{activeCount === 1 ? '' : 's'}</span> shaping your reality.
          </span>
        }
        rightContent={
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-text-1)' }}>{boardTotal}</div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--color-text-2)', textTransform: 'uppercase' }}>Showing</div>
              </div>
              <div style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>{wonCount}</div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>Won</div>
              </div>
            </div>
            <button onClick={() => setShowModal(true)}
              style={{ 
                  background: 'var(--color-accent)', 
                  border: 'none', 
                  borderRadius: '12px', 
                  padding: '12px 24px', 
                  fontSize: '14px', 
                  fontWeight: 900, 
                  color: '#fff', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
              }}
            >
              <Plus size={16} strokeWidth={3} /> Add
            </button>
          </div>
        }
      />

      {/* ── Filters & Controls ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
            {PILLARS.map(p => {
                const isActive = filter === p.key;
                return (
                    <button 
                        key={p.key} 
                        onClick={() => setFilter(isActive ? 'all' : p.key)}
                        style={{ 
                            background: isActive ? p.bg : 'rgba(255,255,255,0.02)', 
                            border: `1px solid ${isActive ? p.color : 'rgba(255,255,255,0.05)'}`, 
                            borderRadius: '10px', 
                            padding: '8px 16px', 
                            cursor: 'pointer', 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            color: isActive ? p.color : 'var(--color-text-3)',
                            fontSize: '12px',
                            fontWeight: 700
                        }}
                    >
                        {p.icon} {p.label}
                    </button>
                );
            })}
        </div>
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={() => setViewMode('pipeline')} style={{ padding: '6px 16px', borderRadius: '8px', border: 'none', background: viewMode === 'pipeline' ? 'rgba(255,255,255,0.05)' : 'transparent', color: viewMode === 'pipeline' ? 'var(--color-text-1)' : 'var(--color-text-3)', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Pipeline</button>
            <button onClick={() => setViewMode('grid')} style={{ padding: '6px 16px', borderRadius: '8px', border: 'none', background: viewMode === 'grid' ? 'rgba(255,255,255,0.05)' : 'transparent', color: viewMode === 'grid' ? 'var(--color-text-1)' : 'var(--color-text-3)', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Grid</button>
            <button onClick={() => setViewMode('archive')} style={{ padding: '6px 16px', borderRadius: '8px', border: 'none', background: viewMode === 'archive' ? 'rgba(255,255,255,0.05)' : 'transparent', color: viewMode === 'archive' ? 'var(--color-text-1)' : 'var(--color-text-3)', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Archive</button>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      {goals.length > 0 ? (
        <div style={{ minHeight: '400px' }}>
            {viewMode === 'pipeline' ? (
                <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', scrollSnapType: 'x mandatory' }}>
                    {STATUS_OPTS.map(status => {
                        const columnGoals = filtered.filter((g) => normalizeGoalStatus(g.status) === status);
                        return (
                            <div key={status} style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '12px', scrollSnapAlign: 'start' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: STATUS_COLORS[status] }} />
                                        <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-1)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{status}</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--color-text-3)', padding: '2px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: 800, border: '1px solid rgba(255,255,255,0.05)' }}>{columnGoals.length}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '150px' }}>
                                    <AnimatePresence>
                                        {columnGoals.map(g => <GoalCard key={g.id} goal={g} onUpdate={updateGoal} onDelete={deleteGoal} />)}
                                    </AnimatePresence>
                                    {columnGoals.length === 0 && (
                                        <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--color-text-3)', fontSize: '11px', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                                            No {status.toLowerCase()} goals
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    <AnimatePresence>
                        {filtered.map(g => <GoalCard key={g.id} goal={g} onUpdate={updateGoal} onDelete={deleteGoal} />)}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
      ) : (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
                padding: '40px 24px', 
                textAlign: 'center', 
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '8px' }}>Define Your Goals</h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-3)', marginBottom: '24px', maxWidth: '300px' }}>Start tracking what matters.</p>
            
            <button onClick={() => setShowModal(true)}
              style={{ 
                  background: 'var(--color-accent)', 
                  border: 'none', 
                  borderRadius: '12px', 
                  padding: '12px 24px', 
                  fontSize: '14px', 
                  fontWeight: 800, 
                  color: '#fff', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
              }}
            >
                <Plus size={16} strokeWidth={3} /> Add Goal
            </button>
        </motion.div>
      )}

      <GoalModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={addGoal} />
    </div>
  );
};

export default Goals;
