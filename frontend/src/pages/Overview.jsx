import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDailyStats } from '../hooks/useDailyStats';
import { useThemeContext } from '../context/ThemeContext';
import { supabase } from '../utils/supabase';
import api from '../utils/api';
import { motion } from 'framer-motion';

/* ── helpers ─────────────────────────────────── */
const getDaysToPlacement = () => {
  const placementStart = new Date('2026-07-04');
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.max(0, Math.ceil((placementStart - today) / 86400000));
};

const calcScore = (log) => {
  if (!log) return 0;
  let s = 0;
  if ((log.sleep_hours||0) >= 7) s += 20; else if ((log.sleep_hours||0) >= 6) s += 10;
  if (log.gym_done) s += 20;
  if (log.breakfast_done) s += 10;
  if ((log.steps||0) >= 10000) s += 15; else if ((log.steps||0) >= 5000) s += 8;
  if ((log.water_bottles||0) >= 3) s += 10; else if ((log.water_bottles||0) >= 2) s += 5;
  if (log.learning_done) s += 15;
  if (log.journal_entry?.trim()) s += 10;
  return Math.min(s, 100);
};

const DAILY_QUOTES = [
  "Do the work. The rest is noise.",
  "Discipline is choosing between what you want now and what you want most.",
  "You don't rise to the level of your goals. You fall to the level of your systems.",
  "Clarity comes from engagement, not from thought.",
  "The mind is not a vessel to be filled, but a fire to be kindled.",
];

const GOALS_2026 = [
  { id: 1, title: 'Land Placement', emoji: '🎯', target: 'Offer by Aug 2026', progress: 62, color: '#22C55E' },
  { id: 2, title: 'Health & Fitness', emoji: '💪', target: '80kg lean mass', progress: 45, color: '#3B82F6' },
  { id: 3, title: 'Financial Growth', emoji: '₹', target: '₹5L savings', progress: 38, color: '#F59E0B' },
  { id: 4, title: 'Skills Mastery', emoji: '🧠', target: 'DSA + System Design', progress: 55, color: '#A855F7' },
];

const ONE_PRIORITY = 'Solve 2 Leetcode mediums before 2pm';

/* ── sub-components ──────────────────────────── */
const DayProgressBar = ({ isDark }) => {
  const [pct, setPct] = useState(0);
  const [rem, setRem] = useState('');
  useEffect(() => {
    const upd = () => {
      const now = new Date();
      const elapsed = (now - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 1000;
      setPct((elapsed / 86400) * 100);
      setRem(`${23 - now.getHours()}h ${59 - now.getMinutes()}m left today`);
    };
    upd(); const t = setInterval(upd, 60000); return () => clearInterval(t);
  }, []);
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
        <span style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--color-text-3)' }}>Day Progress · {pct.toFixed(1)}%</span>
        <span style={{ fontSize:'11px', color:'var(--color-text-3)', fontFamily:'var(--font-mono)' }}>{rem}</span>
      </div>
      <div style={{ height:'3px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)', borderRadius:'9999px', overflow:'hidden' }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:1.2, ease:'easeOut' }}
          style={{ height:'100%', background:'var(--color-accent)', borderRadius:'9999px' }} />
      </div>
    </div>
  );
};

const WeekGrid = ({ isDark }) => {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const scores = [88, 72, 91, 65, 84, 0, 0]; // TODO: pull from DB
  const today = new Date().getDay(); // 0=Sun
  const todayIdx = today === 0 ? 6 : today - 1;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'8px' }}>
      {days.map((d, i) => {
        const isPast = i < todayIdx;
        const isToday = i === todayIdx;
        const s = scores[i];
        const bg = isToday ? 'var(--color-accent)' : isPast && s > 0 ? (isDark ? 'rgba(34,197,94,0.12)' : 'rgba(30,92,58,0.08)') : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)');
        const textColor = isToday ? '#fff' : isPast && s > 0 ? 'var(--color-accent)' : 'var(--color-text-3)';
        return (
          <div key={d} style={{ background: bg, border:`1px solid ${isToday ? 'var(--color-accent)' : 'var(--color-border)'}`, borderRadius:'10px', padding:'12px 8px', textAlign:'center', transition:'all 200ms' }}>
            <div style={{ fontSize:'10px', fontWeight:700, color: isToday ? 'rgba(255,255,255,0.8)' : 'var(--color-text-3)', textTransform:'uppercase', marginBottom:'6px' }}>{d}</div>
            <div style={{ fontSize:'15px', fontWeight:800, color: textColor }}>{isToday ? '→' : isPast && s > 0 ? `${s}%` : '·'}</div>
          </div>
        );
      })}
    </div>
  );
};

const GoalCard = ({ goal, isDark }) => (
  <div style={{ background: isDark ? 'var(--color-surface)' : '#fff', border:'1px solid var(--color-border)', borderRadius:'12px', padding:'16px 20px' }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        <span style={{ fontSize:'20px' }}>{goal.emoji}</span>
        <div>
          <div style={{ fontSize:'13px', fontWeight:700, color:'var(--color-text-1)' }}>{goal.title}</div>
          <div style={{ fontSize:'11px', color:'var(--color-text-3)', marginTop:'2px' }}>{goal.target}</div>
        </div>
      </div>
      <div style={{ fontSize:'18px', fontWeight:800, color: goal.color, fontFamily:'var(--font-mono)' }}>{goal.progress}%</div>
    </div>
    <div style={{ height:'5px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius:'9999px', overflow:'hidden' }}>
      <motion.div initial={{ width:0 }} animate={{ width:`${goal.progress}%` }} transition={{ duration:1, ease:'easeOut' }}
        style={{ height:'100%', background: goal.color, borderRadius:'9999px' }} />
    </div>
  </div>
);

const TaskRow = ({ task, onToggle, isDark }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 0', borderBottom:`1px solid var(--color-border)` }}>
    <button onClick={() => onToggle(task.id)} style={{
      width:'18px', height:'18px', borderRadius:'50%', border:`2px solid ${task.completed ? 'var(--color-accent)' : 'var(--color-border-lit)'}`,
      background: task.completed ? 'var(--color-accent)' : 'transparent', cursor:'pointer', flexShrink:0,
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      {task.completed && <span style={{ color:'#fff', fontSize:'10px', lineHeight:1 }}>✓</span>}
    </button>
    <span style={{ fontSize:'14px', fontFamily:'var(--font-sans)', color: task.completed ? 'var(--color-text-3)' : 'var(--color-text-1)', textDecoration: task.completed ? 'line-through' : 'none', flex:1 }}>{task.title}</span>
    {task.source && <span style={{ fontSize:'9px', fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-3)', opacity:0.5 }}>{task.source}</span>}
  </div>
);

/* ── Main Component ──────────────────────────── */
const Overview = ({ user }) => {
  const { session } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const { todayLog = {} } = useDailyStats(user) || {};

  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [insight, setInsight] = useState(null);

  const daysToPlacement = getDaysToPlacement();

  useEffect(() => {
    if (!session) return;
    const load = async () => {
      try {
        const todayStr = new Date().toLocaleDateString('en-CA');
        const uid = session?.user?.id;
        const [taskRes, habitRes, habitLogRes, insightRes] = await Promise.all([
          supabase.from('tasks').select('id,title,due_date,completed,source')
            .eq('user_id', uid).gte('due_date', todayStr).lte('due_date', todayStr)
            .order('completed', { ascending: true }).limit(10),
          supabase.from('habits').select('id,name,active').eq('user_id', uid).eq('active', true).limit(8),
          supabase.from('habit_logs').select('habit_id,completed').eq('user_id', uid).eq('date', todayStr),
          supabase.from('lab_correlations').select('signal_a,signal_b,rho').eq('user_id', uid).order('rho', { ascending: false }).limit(1),
        ]);
        const logMap = {};
        (habitLogRes.data || []).forEach(l => { logMap[l.habit_id] = l.completed; });
        setTasks(taskRes.data || []);
        setHabits((habitRes.data || []).map(h => ({ ...h, completed: logMap[h.id] || false })));
        setInsight(insightRes.data?.[0] || null);
      } catch (err) { console.error('Overview load:', err); }
      finally { setDataLoading(false); }
    };
    load();
  }, [session]);

  const handleTaskToggle = async (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    try { await api.patch(`/tasks/${id}`, { completed: true }); } catch {}
  };

  const handleHabitToggle = async (id) => {
    const habit = habits.find(h => h.id === id);
    const newDone = !habit?.completed;
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: newDone } : h));
    try {
      const todayStr = new Date().toLocaleDateString('en-CA');
      await supabase.from('habit_logs').upsert({ user_id: session.user.id, habit_id: id, date: todayStr, completed: newDone }, { onConflict: 'user_id,habit_id,date' });
    } catch {}
  };

  const s = todayLog || {};
  const score = calcScore(s);
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'you';
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
  const quoteIdx = now.getDate() % DAILY_QUOTES.length;
  const pendingTasks = tasks.filter(t => !t.completed);
  const doneTasks = tasks.filter(t => t.completed);
  const cardBg = isDark ? 'var(--color-surface)' : '#fff';
  const border = '1px solid var(--color-border)';

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>

      {/* Day progress bar */}
      <DayProgressBar isDark={isDark} />

      {/* ── HERO HEADER ── */}
      <div style={{ marginBottom:'36px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
          <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--color-text-3)' }}>{dateStr}</div>
          <div style={{ padding:'3px 10px', borderRadius:'99px', background: isDark?'rgba(34,197,94,0.12)':'rgba(30,92,58,0.08)', border:'1px solid var(--color-accent)', fontSize:'10px', fontWeight:800, color:'var(--color-accent)', letterSpacing:'0.08em' }}>
            {daysToPlacement}d to placement
          </div>
        </div>
        <h1 style={{ fontSize:'48px', fontWeight:500, color:'var(--color-text-1)', margin:'0 0 14px', letterSpacing:'-0.03em', lineHeight:1.05, fontFamily:'var(--font-serif)' }}>
          {greeting} {firstName}.
        </h1>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'14px 18px', background: isDark?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.025)', border:'1px solid var(--color-border)', borderLeft:'3px solid var(--color-accent)', borderRadius:'0 10px 10px 0' }}>
          <span style={{ fontSize:'16px' }}>⚡</span>
          <div>
            <div style={{ fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--color-text-3)', marginBottom:'2px' }}>One Priority</div>
            <div style={{ fontSize:'14px', fontWeight:600, color:'var(--color-text-1)', fontFamily:'var(--font-sans)' }}>{ONE_PRIORITY}</div>
          </div>
        </div>
        <p style={{ fontSize:'14px', color:'var(--color-text-3)', marginTop:'14px', fontStyle:'italic', fontFamily:'var(--font-serif)', letterSpacing:'-0.01em', margin:'14px 0 0' }}>
          &ldquo;{DAILY_QUOTES[quoteIdx]}&rdquo;
        </p>
      </div>

      {/* ── TOP STATS ROW ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'12px', marginBottom:'32px' }}>
        {[
          { label:'Day Score', value:`${score}%`, color: score >= 70 ? 'var(--color-accent)' : 'var(--color-warning)' },
          { label:'Sleep', value: s.sleep_hours ? `${Math.floor(s.sleep_hours)}h` : '—', color:'var(--color-text-1)' },
          { label:'Steps', value: s.steps ? `${Math.round(s.steps/1000*10)/10}k` : '—', color:'var(--color-text-1)' },
          { label:'Water', value: s.water_bottles ? `${s.water_bottles}L` : '—', color:'#3B82F6' },
          { label:'Streak', value:'112d', color:'#F59E0B' },
        ].map(m => (
          <div key={m.label} style={{ background: cardBg, border, borderRadius:'12px', padding:'16px', textAlign:'center' }}>
            <div style={{ fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--color-text-3)', marginBottom:'6px' }}>{m.label}</div>
            <div style={{ fontSize:'22px', fontWeight:800, color: m.color, fontFamily:'var(--font-mono)' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID: Left col (tasks + habits) | Right col (goals + weekly) ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:'24px', alignItems:'start' }}>

        {/* LEFT */}
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

          {/* Today's Intentions */}
          <div style={{ background: cardBg, border, borderRadius:'16px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <div style={{ fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--color-text-2)' }}>Today's Intentions</div>
              <div style={{ fontSize:'11px', color:'var(--color-text-3)', fontFamily:'var(--font-mono)' }}>{doneTasks.length}/{tasks.length} done</div>
            </div>
            {tasks.length === 0 ? (
              <div style={{ padding:'24px 0', color:'var(--color-text-3)', fontSize:'14px', fontStyle:'italic', textAlign:'center' }}>
                No tasks for today. Add some in Calendar.
              </div>
            ) : (
              <>
                {pendingTasks.map(t => <TaskRow key={t.id} task={t} onToggle={handleTaskToggle} isDark={isDark} />)}
                {doneTasks.length > 0 && (
                  <div style={{ opacity:0.4, marginTop:'8px' }}>
                    {doneTasks.map(t => <TaskRow key={t.id} task={t} onToggle={handleTaskToggle} isDark={isDark} />)}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Habits */}
          {habits.length > 0 && (
            <div style={{ background: cardBg, border, borderRadius:'16px', padding:'24px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
                <div style={{ fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--color-text-2)' }}>Daily Habits</div>
                <span style={{ fontSize:'11px', color:'var(--color-text-3)' }}>{habits.filter(h => h.completed).length}/{habits.length}</span>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                {habits.map(h => (
                  <button key={h.id} onClick={() => handleHabitToggle(h.id)} style={{
                    padding:'8px 14px', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:'pointer',
                    border:`1px solid ${h.completed ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: h.completed ? (isDark ? 'rgba(34,197,94,0.1)' : 'rgba(30,92,58,0.07)') : 'transparent',
                    color: h.completed ? 'var(--color-accent)' : 'var(--color-text-2)',
                    transition:'all 150ms ease',
                  }}>
                    {h.completed ? '✓ ' : ''}{h.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Morning Note */}
          <div style={{ background: cardBg, border, borderRadius:'16px', padding:'24px' }}>
            <div style={{ fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--color-text-3)', marginBottom:'12px' }}>Morning Note</div>
            {s.journal_entry ? (
              <div style={{ fontSize:'15px', fontStyle:'italic', color:'var(--color-text-1)', lineHeight:1.65, fontFamily:'var(--font-serif)' }}>"{s.journal_entry}"</div>
            ) : (
              <div style={{ fontSize:'14px', color:'var(--color-text-3)', fontStyle:'italic' }}>No note yet — write in Journal.</div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

          {/* Weekly view */}
          <div style={{ background: cardBg, border, borderRadius:'16px', padding:'24px' }}>
            <div style={{ fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--color-text-2)', marginBottom:'16px' }}>This Week</div>
            <WeekGrid isDark={isDark} />
          </div>

          {/* 2026 Goals */}
          <div style={{ background: cardBg, border, borderRadius:'16px', padding:'24px' }}>
            <div style={{ fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--color-text-2)', marginBottom:'16px' }}>2026 Goals</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {GOALS_2026.map(g => <GoalCard key={g.id} goal={g} isDark={isDark} />)}
            </div>
          </div>

          {/* Insight card */}
          <div style={{
            background: isDark ? 'rgba(34,197,94,0.05)' : 'rgba(30,92,58,0.04)',
            border:`1px solid ${isDark ? 'rgba(34,197,94,0.15)' : 'rgba(30,92,58,0.12)'}`,
            borderRadius:'16px', padding:'20px',
          }}>
            <div style={{ fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--color-accent)', marginBottom:'8px' }}>
              Pattern Detected
            </div>
            <div style={{ fontSize:'14px', color:'var(--color-text-1)', lineHeight:1.55 }}>
              {insight ? `${insight.signal_a} correlates with ${insight.signal_b}` : 'Sleep drops 20% on nights you log RC after 22:30.'}
            </div>
            <div style={{ fontSize:'11px', color:'var(--color-text-3)', marginTop:'8px' }}>
              correlation · {insight?.rho?.toFixed(2) ?? '0.72'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
