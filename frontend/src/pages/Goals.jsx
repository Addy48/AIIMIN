import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Target, BookOpen, Briefcase, Heart, Brain, CheckCircle, Trash2, Calendar, ChevronRight, BarChart3, Clock, ArrowUpRight } from 'lucide-react';

/* ── Constants ─────────────────────────────────────────────── */
const PILLARS = [
  { key: 'academic', label: 'Academic', icon: <BookOpen size={16} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', desc: 'Knowledge & Mastery' },
  { key: 'career', label: 'Career', icon: <Briefcase size={16} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)', desc: 'Professional Growth' },
  { key: 'health', label: 'Health', icon: <Heart size={16} />, color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', desc: 'Vitality & Balance' },
  { key: 'personal', label: 'Personal', icon: <Brain size={16} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', desc: 'Mindset & Habits' },
];

const STATUS_OPTS = ['Active', 'On Track', 'At Risk', 'Achieved'];

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

const LS_KEY = 'aiimin_goals_v2';

const loadGoals = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
};

const saveGoals = (g) => localStorage.setItem(LS_KEY, JSON.stringify(g));

const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / 86400000);
};

const blankGoal = () => ({
  id: Date.now().toString(),
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
  const total = goal.milestones?.length || 0;
  const done = goal.milestones?.filter(m => m.done).length || 0;
  const progress = total ? Math.round((done / total) * 100) : 0;
  const days = daysUntil(goal.targetDate);
  const statusColor = STATUS_COLORS[goal.status] || '#6b7280';

  const toggleMilestone = (i) => {
    const updated = { ...goal, milestones: goal.milestones.map((m, idx) => idx === i ? { ...m, done: !m.done } : m) };
    if (updated.milestones.every(m => m.done) && updated.status !== 'Achieved') updated.status = 'Achieved';
    onUpdate(updated);
  };

  const daysSinceCreation = Math.max(1, Math.ceil((new Date() - new Date(goal.createdAt)) / 86400000));
  const velocity = (done / daysSinceCreation).toFixed(2);
  const priorityColor = PRIORITIES.find(p => p.level === goal.priority)?.color || '#f59e0b';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      layout
      style={{ 
        background: 'rgba(255,255,255,0.02)', 
        backdropFilter: 'blur(30px)', 
        border: '1px solid rgba(255,255,255,0.05)', 
        borderRadius: '28px', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        transition: 'all 0.3s'
      }}
    >
      <div style={{ height: '6px', background: pillar.color, width: `${progress}%`, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                background: pillar.bg, 
                color: pillar.color, 
                padding: '6px 12px', 
                borderRadius: '12px', 
                fontSize: '11px', 
                fontWeight: 800, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {pillar.icon} {pillar.label}
              </span>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 800, 
                color: statusColor, 
                background: `${statusColor}10`, 
                padding: '6px 12px', 
                borderRadius: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>{goal.status}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: pillar.color, lineHeight: 1 }}>{progress}%</div>
                <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--color-text-3)', marginTop: '4px', textTransform: 'uppercase' }}>Progress</div>
            </div>
          </div>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 800, 
            color: 'var(--color-text-1)', 
            lineHeight: 1.3,
            marginBottom: '8px',
            fontFamily: 'var(--font-serif)'
          }}>{goal.title || 'Untitled Goal'}</h3>
          {goal.why && <p style={{ fontSize: '13px', color: 'var(--color-text-3)', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>"{goal.why}"</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {goal.milestones?.map((m, i) => m.text && (
            <button 
              key={i} 
              onClick={() => toggleMilestone(i)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                background: m.done ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer', 
                textAlign: 'left', 
                padding: '12px 16px',
                borderRadius: '16px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ 
                width: '18px', 
                height: '18px', 
                borderRadius: '6px', 
                border: `2px solid ${m.done ? pillar.color : 'rgba(255,255,255,0.1)'}`, 
                background: m.done ? pillar.color : 'transparent', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {m.done && <CheckCircle size={12} color="#fff" />}
              </div>
              <span style={{ 
                fontSize: '13px', 
                fontWeight: 600,
                color: m.done ? 'var(--color-text-3)' : 'var(--color-text-2)', 
                textDecoration: m.done ? 'line-through' : 'none' 
              }}>{m.text}</span>
            </button>
          ))}
        </div>

        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingTop: '20px', 
            borderTop: '1px solid rgba(255,255,255,0.05)', 
            marginTop: 'auto' 
        }}>
          {days !== null ? (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '12px', 
                fontWeight: 700, 
                color: days < 7 ? '#ef4444' : days < 30 ? '#f59e0b' : 'var(--color-text-3)' 
            }}>
              <Clock size={14} />
              {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `${days}d remaining`}
            </div>
          ) : <div />}
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
                onClick={() => onDelete(goal.id)} 
                style={{ 
                    background: 'rgba(239, 68, 68, 0.05)', 
                    border: 'none', 
                    color: '#ef4444', 
                    cursor: 'pointer', 
                    padding: '8px', 
                    borderRadius: '10px' 
                }}
            >
              <Trash2 size={14} />
            </button>
            <select 
                value={goal.status} 
                onChange={e => onUpdate({ ...goal, status: e.target.value })}
                style={{ 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    color: statusColor, 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    cursor: 'pointer', 
                    padding: '8px 12px', 
                    borderRadius: '10px',
                    outline: 'none'
                }}
            >
              {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Add Goal Modal ────────────────────────────────────────── */
const GoalModal = ({ onClose, onSave }) => {
  const [goal, setGoal] = useState(blankGoal());
  const pillar = PILLARS.find(p => p.key === goal.pillar) || PILLARS[0];

  const updateMilestone = (i, text) => setGoal(g => ({ ...g, milestones: g.milestones.map((m, idx) => idx === i ? { ...m, text } : m) }));
  const addMilestone = () => goal.milestones.length < 5 && setGoal(g => ({ ...g, milestones: [...g.milestones, { text: '', done: false }] }));
  const removeMilestone = (i) => setGoal(g => ({ ...g, milestones: g.milestones.filter((_, idx) => idx !== i) }));

  const inp = { 
    background: 'rgba(0,0,0,0.2)', 
    border: '1px solid rgba(255,255,255,0.08)', 
    borderRadius: '16px', 
    padding: '14px 18px', 
    color: 'var(--color-text-1)', 
    fontSize: '14px', 
    fontFamily: 'inherit', 
    outline: 'none', 
    width: '100%', 
    boxSizing: 'border-box',
    transition: 'all 0.2s'
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        style={{ 
            background: 'rgba(15,15,15,0.95)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '32px', 
            padding: '40px', 
            width: '100%', 
            maxWidth: '560px', 
            maxHeight: '90vh', 
            overflowY: 'auto',
            boxShadow: '0 64px 128px rgba(0,0,0,0.5)'
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-text-1)', margin: 0, fontFamily: 'var(--font-serif)' }}>Define Commitment</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer', padding: '8px', borderRadius: '12px' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Domain</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {PILLARS.map(p => (
                <button key={p.key} onClick={() => setGoal(g => ({ ...g, pillar: p.key }))}
                  style={{ 
                      padding: '12px 8px', 
                      borderRadius: '16px', 
                      border: `1px solid ${goal.pillar === p.key ? p.color : 'rgba(255,255,255,0.05)'}`, 
                      background: goal.pillar === p.key ? p.bg : 'rgba(255,255,255,0.02)', 
                      color: goal.pillar === p.key ? p.color : 'var(--color-text-3)', 
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
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Goal Title</div>
              <input style={inp} placeholder="e.g. Master React in 30 days" value={goal.title} onChange={e => setGoal(g => ({ ...g, title: e.target.value }))} />
            </div>
            <div style={{ width: '140px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Priority</div>
              <select style={inp} value={goal.priority} onChange={e => setGoal(g => ({ ...g, priority: e.target.value }))}>
                {PRIORITIES.map(p => <option key={p.level} value={p.level}>{p.level}</option>)}
              </select>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>The "Why"</div>
            <input style={inp} placeholder="Because this skill opens doors to financial freedom." value={goal.why} onChange={e => setGoal(g => ({ ...g, why: e.target.value }))} />
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Target Date</div>
            <input type="date" style={inp} value={goal.targetDate} onChange={e => setGoal(g => ({ ...g, targetDate: e.target.value }))} />
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Milestones ({goal.milestones.length}/5)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {goal.milestones.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input style={{ ...inp, flex: 1 }} placeholder={`Milestone ${i + 1}`} value={m.text} onChange={e => updateMilestone(i, e.target.value)} />
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
                marginTop: '12px', 
                background: pillar.color, 
                color: '#fff', 
                border: 'none', 
                padding: '20px', 
                borderRadius: '16px', 
                fontSize: '16px', 
                fontWeight: 900, 
                cursor: 'pointer', 
                boxShadow: `0 12px 32px ${pillar.color}40`,
                transition: 'all 0.2s'
            }}>
            Confirm Commitment
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ── Main Goals Page ──────────────────────────────────────── */
const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('pipeline');

  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  useEffect(() => saveGoals(goals), [goals]);

  const addGoal = (g) => setGoals(p => [g, ...p]);
  const updateGoal = (updated) => setGoals(p => p.map(g => g.id === updated.id ? updated : g));
  const deleteGoal = (id) => setGoals(p => p.filter(g => g.id !== id));

  const baseGoals = viewMode === 'archive' ? goals.filter(g => g.status === 'Achieved') : goals.filter(g => g.status !== 'Achieved');
  const filtered = filter === 'all' ? baseGoals : baseGoals.filter(g => g.pillar === filter);
  const onTrackCount = goals.filter(g => g.status === 'On Track' || g.status === 'Achieved').length;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 0 100px 0' }}>
      
      {/* ── Revolutionary Hero: Vision Board ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '40px',
          padding: '60px',
          marginBottom: '60px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(40px)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ 
                background: 'var(--color-accent)', 
                color: '#fff', 
                padding: '6px 16px', 
                borderRadius: '99px', 
                fontSize: '10px', 
                fontWeight: 900,
                letterSpacing: '0.2em'
            }}>NORTH STAR</span>
          </div>
          <h1 style={{ 
              fontSize: '84px', 
              fontWeight: 900, 
              color: 'var(--color-text-1)', 
              margin: 0, 
              letterSpacing: '-0.06em',
              fontFamily: 'var(--font-serif)',
              lineHeight: 0.9
          }}>
            Forge your<br />future.
          </h1>
          <p style={{ color: 'var(--color-text-3)', fontSize: '18px', fontWeight: 500, marginTop: '32px', maxWidth: '480px', lineHeight: 1.6 }}>
            "The best way to predict the future is to create it." <br />
            <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{onTrackCount} active commitments</span> are currently shaping your reality.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-end' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-text-1)' }}>{goals.length}</div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', marginTop: '4px' }}>Total</div>
            </div>
            <div style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#10b981' }}>{goals.filter(g => g.status === 'Achieved').length}</div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginTop: '4px' }}>Won</div>
            </div>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ 
                background: 'var(--color-text-1)', 
                border: 'none', 
                borderRadius: '24px', 
                padding: '24px 48px', 
                fontSize: '18px', 
                fontWeight: 900, 
                color: 'var(--color-base)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
          >
            <Plus size={22} strokeWidth={3} /> Define Commitment
          </button>
        </div>

        {/* Decorative element */}
        <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)', opacity: 0.05, filter: 'blur(60px)' }} />
      </motion.div>

      {/* ── Filters & Controls ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
            {PILLARS.map(p => {
                const isActive = filter === p.key;
                return (
                    <button 
                        key={p.key} 
                        onClick={() => setFilter(isActive ? 'all' : p.key)}
                        style={{ 
                            background: isActive ? p.bg : 'rgba(255,255,255,0.02)', 
                            border: `1px solid ${isActive ? p.color : 'rgba(255,255,255,0.05)'}`, 
                            borderRadius: '16px', 
                            padding: '12px 24px', 
                            cursor: 'pointer', 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s',
                            color: isActive ? p.color : 'var(--color-text-3)',
                            fontSize: '13px',
                            fontWeight: 800
                        }}
                    >
                        {p.icon} {p.label}
                    </button>
                );
            })}
        </div>
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={() => setViewMode('pipeline')} style={{ padding: '10px 24px', borderRadius: '14px', border: 'none', background: viewMode === 'pipeline' ? 'rgba(255,255,255,0.05)' : 'transparent', color: viewMode === 'pipeline' ? 'var(--color-text-1)' : 'var(--color-text-3)', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>Pipeline</button>
            <button onClick={() => setViewMode('grid')} style={{ padding: '10px 24px', borderRadius: '14px', border: 'none', background: viewMode === 'grid' ? 'rgba(255,255,255,0.05)' : 'transparent', color: viewMode === 'grid' ? 'var(--color-text-1)' : 'var(--color-text-3)', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>Grid</button>
            <button onClick={() => setViewMode('archive')} style={{ padding: '10px 24px', borderRadius: '14px', border: 'none', background: viewMode === 'archive' ? 'rgba(255,255,255,0.05)' : 'transparent', color: viewMode === 'archive' ? 'var(--color-text-1)' : 'var(--color-text-3)', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>Archive</button>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      {goals.length > 0 ? (
        <div style={{ minHeight: '600px' }}>
            {viewMode === 'pipeline' ? (
                <div style={{ display: 'flex', gap: '32px', overflowX: 'auto', paddingBottom: '40px', scrollSnapType: 'x mandatory' }}>
                    {STATUS_OPTS.map(status => {
                        const columnGoals = filtered.filter(g => g.status === status);
                        return (
                            <div key={status} style={{ flex: '0 0 380px', display: 'flex', flexDirection: 'column', gap: '24px', scrollSnapAlign: 'start' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_COLORS[status] }} />
                                        <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-text-1)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{status}</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--color-text-3)', padding: '4px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 800, border: '1px solid rgba(255,255,255,0.05)' }}>{columnGoals.length}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '200px' }}>
                                    <AnimatePresence>
                                        {columnGoals.map(g => <GoalCard key={g.id} goal={g} onUpdate={updateGoal} onDelete={deleteGoal} />)}
                                    </AnimatePresence>
                                    {columnGoals.length === 0 && (
                                        <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--color-text-3)', fontSize: '13px', border: '2px dashed rgba(255,255,255,0.03)', borderRadius: '32px', background: 'rgba(255,255,255,0.01)' }}>
                                            No {status.toLowerCase()} goals
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
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
                padding: '120px 40px', 
                textAlign: 'center', 
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '60px',
                backdropFilter: 'blur(40px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 48px 96px rgba(0,0,0,0.3)'
            }}
        >
            <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ 
                    width: '140px', 
                    height: '140px', 
                    background: 'linear-gradient(135deg, var(--color-accent) 0%, transparent 100%)', 
                    borderRadius: '48px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: '48px',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 24px 48px var(--color-accent-dim)'
                }}
            >
                <Target size={64} strokeWidth={1.2} />
            </motion.div>
            
            <h2 style={{ 
                fontSize: '48px', 
                fontWeight: 900, 
                color: 'var(--color-text-1)', 
                marginBottom: '20px', 
                fontFamily: 'var(--font-serif)', 
                letterSpacing: '-0.04em',
                lineHeight: 1.1
            }}>The Arena is Silent.</h2>
            
            <p style={{ 
                fontSize: '18px', 
                color: 'var(--color-text-3)', 
                marginBottom: '64px', 
                maxWidth: '500px', 
                lineHeight: 1.6, 
                fontWeight: 500,
                opacity: 0.8
            }}>
                High-performance trajectories begin with a single, uncompromising commitment. Define your North Star and begin the collapse into greatness.
            </p>
            
            <button onClick={() => setShowModal(true)}
              className="premium-btn-shimmer"
              style={{ 
                  background: 'var(--color-accent)', 
                  border: 'none', 
                  borderRadius: '24px', 
                  padding: '24px 64px', 
                  fontSize: '20px', 
                  fontWeight: 900, 
                  color: '#fff', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 32px 64px var(--color-accent-dim)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
            >
                <Plus size={24} strokeWidth={3} /> Initialize Commitment <ArrowUpRight size={22} />
                
                {/* Shimmer effect style tag injected locally or in global css */}
            </button>
            
            <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '400px', height: '400px', background: 'var(--color-accent)', opacity: 0.05, filter: 'blur(100px)' }} />
            
            <style>{`
                .premium-btn-shimmer::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        to bottom right,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0) 40%,
                        rgba(255, 255, 255, 0.4) 50%,
                        rgba(255, 255, 255, 0) 60%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    transform: rotate(45deg);
                    animation: shimmer 3s infinite;
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%) rotate(45deg); }
                    100% { transform: translateX(100%) rotate(45deg); }
                }
            `}</style>
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && <GoalModal onClose={() => setShowModal(false)} onSave={addGoal} />}
      </AnimatePresence>
    </div>
  );
};

export default Goals;
