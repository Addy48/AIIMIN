import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import supabase from '../utils/supabase';
import { motion } from 'framer-motion';
import { Plus, X, ChevronRight, ChevronLeft, Keyboard, Mic, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import CommandCenter from '../components/overview/CommandCenter';
import PulseCheckModal from '../components/overview/PulseCheckModal';
import { useCalendarEvents } from '../hooks/useCalendarEvents';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];


const WeekCell = React.memo(({ day, dateStr, isToday, calendarEvents }) => {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`aiimin_tasks_${dateStr}`) || '[]');
    } catch { return []; }
  });
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem(`aiimin_tasks_${dateStr}`, JSON.stringify(tasks));
  }, [tasks, dateStr]);

  useEffect(() => {
    try {
      setTasks(JSON.parse(localStorage.getItem(`aiimin_tasks_${dateStr}`) || '[]'));
    } catch { setTasks([]); }
  }, [dateStr]);

  const addTask = () => {
    if (input.trim()) {
      setTasks(p => [...p, { id: Date.now(), text: input.trim(), done: false }]);
      setInput('');
    }
    setAdding(false);
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      style={{
      background: isToday ? 'var(--color-accent-dim)' : 'var(--color-surface)',
      border: `1px solid ${isToday ? 'var(--color-accent)' : 'var(--color-border)'}`,
      boxShadow: isToday ? '0 4px 12px rgba(34,197,94,0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
      borderRadius:'16px', padding:'12px', display:'flex', flexDirection:'column', height: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'10px', borderBottom: isToday ? '1px dashed rgba(34,197,94,0.3)' : '1px dashed var(--color-border)', paddingBottom:'8px', flexShrink: 0 }}>
        <div style={{ fontSize:'10px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.1em', color: isToday ? 'var(--color-accent)' : 'var(--color-text-3)' }}>
          {day}
        </div>
        <div style={{ fontSize:'12px', fontWeight:800, color: isToday ? 'var(--color-accent)' : 'var(--color-text-1)', background: isToday ? 'rgba(34,197,94,0.1)' : 'transparent', padding: isToday ? '2px 6px' : '0', borderRadius: '4px' }}>
          {new Date(dateStr).getDate()}
        </div>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'6px', overflowY:'auto', scrollbarWidth:'none', minHeight: 0 }}>
        {calendarEvents?.map(e => (
          <div key={e.id} style={{ fontSize:'10px', background:'var(--color-elevated)', borderLeft:`2px solid ${e.color||'var(--color-accent)'}`, padding:'4px 6px', borderRadius:'4px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'var(--color-text-1)', fontWeight:600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '8px' }}>🕒</span> {e.title || e.summary}
          </div>
        ))}
        {tasks.map(t => (
          <div key={t.id} style={{ display:'flex', alignItems:'center', gap:'6px', background: t.done ? 'transparent' : 'var(--color-elevated)', padding: '4px 6px', borderRadius: '6px', border: t.done ? '1px solid transparent' : '1px solid var(--color-border)' }}>
            <input type="checkbox" checked={t.done} onChange={() => setTasks(p=>p.map(x=>x.id===t.id?{...x,done:!x.done}:x))}
              style={{ cursor:'pointer', accentColor:'var(--color-accent)', flexShrink:0 }} />
            <span style={{ fontSize:'11px', fontWeight: 600, color: t.done ? 'var(--color-text-3)' : 'var(--color-text-1)', textDecoration: t.done ? 'line-through' : 'none', flex:1, wordBreak:'break-word' }}>
              {t.text}
            </span>
            <button onClick={() => setTasks(p=>p.filter(x=>x.id!==t.id))} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-3)', padding:0, lineHeight:1 }}>
              <X size={10} />
            </button>
          </div>
        ))}
        {adding ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%', boxSizing: 'border-box', marginTop: 'auto' }}>
            <input autoFocus value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter')addTask();if(e.key==='Escape'){setAdding(false);setInput('');}}}
              onBlur={addTask}
              placeholder="Add task..."
              style={{ flex: 1, minWidth: 0, fontSize:'11px', background:'var(--color-elevated)', border:'1px solid var(--color-accent)', borderRadius:'6px', padding:'4px 8px', color:'var(--color-text-1)', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
            />
            <button 
              onMouseDown={(e) => { e.preventDefault(); setAdding(false); setInput(''); }}
              style={{ flexShrink: 0, background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-3)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={10} />
            </button>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} style={{
            background:'var(--color-elevated)', border:'1px dashed var(--color-border)', borderRadius:'6px',
            padding:'6px', fontSize:'10px', color:'var(--color-text-3)', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', marginTop:'auto', fontWeight:800, transition: 'all 0.2s'
          }} onMouseOver={(e) => e.target.style.background = 'var(--color-surface)'} onMouseOut={(e) => e.target.style.background = 'var(--color-elevated)'}>
            <Plus size={10} /> Add Target
          </button>
        )}
      </div>
    </motion.div>
  );
});

/* ── Stacked Linear Progress ── */
const LinearProgress = ({ label, color, id, sublabel }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-1)' }}>
          {label}
        </div>
        <div id={`orbit-sub-${id}`} style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-3)' }}>
          {sublabel}
        </div>
      </div>
      <div id={`orbit-pct-${id}`} style={{ fontSize: '13px', fontWeight: 900, color, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1 }}>
        0%
      </div>
    </div>
    <div style={{ height: '10px', background: 'var(--color-elevated)', borderRadius: '99px', overflow: 'hidden', border: '1px solid var(--color-border)', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: color }} />
      <div id={`orbit-ring-${id}`} style={{
        height: '100%',
        width: '0%',
        background: color,
        borderRadius: '99px',
        transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: `0 0 10px ${color}88`
      }} />
    </div>
  </div>
);

const TrajectoryProgress = React.memo(() => {
  const getProgress = () => {
    const now = new Date();
    const startOfYear  = new Date(now.getFullYear(), 0, 1).getTime();
    const nextYear     = new Date(now.getFullYear() + 1, 0, 1).getTime();
    const yearElapsed  = ((now - startOfYear) / (nextYear - startOfYear)) * 100;

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const nextMonth    = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
    const monthElapsed = ((now - startOfMonth) / (nextMonth - startOfMonth)) * 100;

    const dayOfWeek    = (now.getDay() + 6) % 7;
    const startOfWeek  = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    const nextWeek     = new Date(startOfWeek.getTime() + 7 * 86400000);
    const weekElapsed  = ((now - startOfWeek) / (nextWeek - startOfWeek)) * 100;

    const startOfDay   = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    startOfDay.setHours(0, 0, 0, 0);
    const nextDay      = new Date(startOfDay.getTime() + 86400000);
    const dayElapsed   = ((now - startOfDay) / (nextDay - startOfDay)) * 100;

    // "time left" labels
    const daysInYear   = Math.ceil((nextYear - now) / 86400000);
    const daysInMonth  = Math.ceil((nextMonth - now) / 86400000);
    const daysInWeek   = Math.ceil((nextWeek  - now) / 86400000);
    const minsInDay    = Math.ceil((nextDay   - now) / 60000);
    const hoursInDay   = Math.floor(minsInDay / 60);
    const minRem       = minsInDay % 60;
    const daySubLabel  = hoursInDay > 0 ? `${hoursInDay}h ${minRem}m left` : `${minsInDay}m left`;

    return {
      year:  { val: yearElapsed,  sub: `${daysInYear}d left`  },
      month: { val: monthElapsed, sub: `${daysInMonth}d left` },
      week:  { val: weekElapsed,  sub: `${daysInWeek}d left`  },
      day:   { val: dayElapsed,   sub: daySubLabel             },
    };
  };

  useEffect(() => {
    const setDial = (id, val, sub = null) => {
      const ring = document.getElementById(`orbit-ring-${id}`);
      if (ring) ring.style.width = `${Math.min(100, Math.max(0, val))}%`;
      const pct  = document.getElementById(`orbit-pct-${id}`);
      if (pct)  pct.textContent = `${val.toFixed(2)}%`;
      if (sub) {
        const subEl = document.getElementById(`orbit-sub-${id}`);
        if (subEl) subEl.textContent = sub;
      }
    };

    const t = setTimeout(() => {
      const p = getProgress();
      setDial('year',  p.year.val, p.year.sub);
      setDial('month', p.month.val, p.month.sub);
      setDial('week',  p.week.val, p.week.sub);
      setDial('day',   p.day.val, p.day.sub);
    }, 120);

    let raf;
    let last = performance.now();
    const tick = (ts) => {
      if (ts - last > 1000) {
        last = ts;
        const p = getProgress();
        setDial('year',  p.year.val, p.year.sub);
        setDial('month', p.month.val, p.month.sub);
        setDial('week',  p.week.val, p.week.sub);
        setDial('day',   p.day.val, p.day.sub);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initial = React.useMemo(() => getProgress(), []);

  return (
    <div style={{
      background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-elevated) 100%)',
      border: '1px solid var(--color-border)',
      borderRadius: '24px', padding: '24px 32px',
      flex: 1, display: 'flex', flexDirection: 'column', height: '100%',
      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.02), 0 8px 24px rgba(0,0,0,0.04)',
      minHeight: 0
    }}>
      <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-3)', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Trajectory Execution</span>
        <span style={{ color: '#F97316', animation: 'pulse-slow 1.5s infinite' }}>LIVE</span>
        <style>{`
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
        `}</style>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', margin: 'auto 0' }}>
        <LinearProgress id="day"   label="Day"    color="#48A860" sublabel={initial.day.sub}   />
        <LinearProgress id="week"  label="Week"   color="#3B82F6" sublabel={initial.week.sub}  />
        <LinearProgress id="month" label="Month"  color="#EC4899" sublabel={initial.month.sub} />
        <LinearProgress id="year"  label="Year"   color="#F97316" sublabel={initial.year.sub}  />
      </div>
    </div>
  );
});

/* ── Today's Micro-Task ── */
const TodayMicroTask = () => {
  const [task, setTask] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aiimin_microtask_v1')) || { text: '', done: false, date: new Date().toDateString() };
    } catch { return { text: '', done: false, date: new Date().toDateString() }; }
  });
  const [isEditing, setIsEditing] = useState(!task.text || task.date !== new Date().toDateString());

  useEffect(() => {
    if (task.date !== new Date().toDateString()) {
      const resetTask = { text: '', done: false, date: new Date().toDateString() };
      setTask(resetTask);
      setIsEditing(true);
      localStorage.setItem('aiimin_microtask_v1', JSON.stringify(resetTask));
    } else {
      localStorage.setItem('aiimin_microtask_v1', JSON.stringify(task));
    }
  }, [task]);

  const handleSave = (e) => {
    if (e.key === 'Enter' && task.text.trim()) {
      setIsEditing(false);
    }
  };

  return (
    <div>
      <div style={{ fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--color-text-3)', marginBottom:'12px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Today's Micro-Task</span>
        {task.text && !isEditing && (
          <span onClick={() => setIsEditing(true)} style={{ cursor: 'pointer', color: 'var(--color-accent)' }}>Edit</span>
        )}
      </div>
      <div style={{ 
        background: task.done ? 'rgba(34, 197, 94, 0.05)' : 'var(--color-surface)', 
        border: `1px solid ${task.done ? 'rgba(34, 197, 94, 0.3)' : 'var(--color-border)'}`, 
        borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' 
      }}>
        {isEditing ? (
          <input 
            autoFocus
            value={task.text}
            onChange={(e) => setTask({ ...task, text: e.target.value })}
            onKeyDown={handleSave}
            placeholder="What's the one small thing that must get done today?"
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--color-text-1)', fontSize: '15px', fontWeight: 600, outline: 'none' }}
          />
        ) : (
          <>
            <div onClick={() => setTask({ ...task, done: !task.done })} style={{ 
              width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${task.done ? '#10B981' : 'var(--color-border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: task.done ? '#10B981' : 'transparent', transition: 'all 0.2s'
            }}>
              {task.done && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 900 }}>✓</span>}
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600, color: task.done ? 'var(--color-text-3)' : 'var(--color-text-1)', textDecoration: task.done ? 'line-through' : 'none', flex: 1 }}>
              {task.text}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

/* ── Main Overview ── */
const Overview = () => {
  const { user: authUser, session } = useAuth();
  const user = useMemo(() => authUser || { id: 'guest', full_name: 'Guest', username: 'GUEST', role: 'guest', isGuest: true }, [authUser]);
  const navigate = useNavigate();

  const [weekOffset, setWeekOffset] = useState(0);

  const currentWeekDates = useMemo(() => {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7;
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOfWeek + (weekOffset * 7));
    startOfWeek.setHours(0, 0, 0, 0);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${d.getFullYear()}-${m}-${dd}`;
      dates.push({ day: DAYS[i], dateStr, isToday: weekOffset === 0 && i === dayOfWeek, rawDate: d });
    }
    return dates;
  }, [weekOffset]);

  const rangeStart = currentWeekDates[0].dateStr;
  const rangeEnd = currentWeekDates[6].dateStr;
  
  const { events: allCalendarEvents } = useCalendarEvents(session, rangeStart, rangeEnd);

  const [urgentReminders, setUrgentReminders] = useState([]);

  useEffect(() => {
    if (user?.isGuest) return;
    const abortController = new AbortController();

    const fetchReminders = async () => {
      try {
        const { data } = await supabase
          .from('family_reminders')
          .select('*')
          .eq('completed', false)
          .gte('due_date', new Date().toISOString().split('T')[0])
          .lte('due_date', new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0])
          .order('due_date', { ascending: true })
          .abortSignal(abortController.signal);
          
        if (data && !abortController.signal.aborted) {
          setUrgentReminders(data);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch reminders:', err);
        }
      }
    };
    
    fetchReminders();
    
    return () => {
      abortController.abort();
    };
  }, [user]);

  const [daysLeft, setDaysLeft] = useState(() => {
    const targetStr = localStorage.getItem('aiimin_execution_target');
    if (targetStr) {
      const targetDate = new Date(targetStr);
      return Math.max(0, Math.ceil((targetDate - new Date()) / 86400000));
    }
    const targetDate = new Date('2026-07-26');
    return Math.max(0, Math.floor((targetDate - new Date()) / 86400000));
  });

  useEffect(() => {
    const handleStorage = () => {
      const targetStr = localStorage.getItem('aiimin_execution_target');
      if (targetStr) {
        const targetDate = new Date(targetStr);
        setDaysLeft(Math.max(0, Math.ceil((targetDate - new Date()) / 86400000)));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const now = new Date();

  const getWeekNum = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const y = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - y) / 86400000) + 1) / 7);
  };

  const displayWeekDate = new Date(currentWeekDates[0].rawDate);
  const weekNum = getWeekNum(displayWeekDate);



  if (!user) return null;

  return (
    <div className="page-container">
      <PageHeader 
        title="Day Control."
        subtitle="Operational Intelligence"
        rightContent={
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'13px', fontWeight:700, color:'var(--color-text-2)' }}>
              {now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
            </div>
            <div style={{ fontSize:'10px', color:'var(--color-text-3)', marginTop:'3px' }}>
              Week {weekNum} · AIIMIN v3
            </div>
          </div>
        }
      />

      <PulseCheckModal user={user} />

      {/* Main Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0, 1fr) 340px', gap:'32px', alignItems: 'stretch' }} className="overview-grid">

        {/* LEFT column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'32px', minHeight: 0 }}>
          
          {/* Urgent Reminders Banner */}
          {urgentReminders.length > 0 && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <AlertTriangle size={14} /> Urgent Family Reminders
              </div>
              {urgentReminders.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-1)', fontWeight: 600 }}>{r.title}</span>
                  <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 700 }}>Due: {r.due_date}</span>
                </div>
              ))}
            </div>
          )}

          {/* QUICK CAPTURE */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <div style={{ fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--color-text-3)' }}>Quick Capture</div>
              <div style={{ fontSize:'12px', fontWeight:800, color:'var(--color-accent)', cursor:'pointer' }}>Smart Log &rarr;</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px', background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'16px', padding:'16px' }}>
              {[
                { label: 'Log a Habit', icon: '✅', to: '/habits' },
                { label: 'Journal Entry', icon: '✏️', to: '/journal' },
                { label: 'Track Expense', icon: '💸', to: '/finance' },
                { label: 'Add Goal', icon: '🎯', to: '/placements' }
              ].map((item, i) => (
                <Link key={i} to={item.to} style={{ textDecoration:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px', padding:'20px 12px', border:'1.5px dashed var(--color-border)', borderRadius:'12px', transition:'all 0.2s', background:'var(--color-elevated)' }} onMouseEnter={e=>e.currentTarget.style.borderColor='var(--color-accent)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--color-border)'}>
                  <div style={{ fontSize:'24px' }}>{item.icon}</div>
                  <div style={{ fontSize:'12px', fontWeight:800, color:'var(--color-text-2)' }}>{item.label}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Countdown Hero */}
          <div style={{
            background:'linear-gradient(135deg, rgba(30,92,58,0.95) 0%, rgba(13,59,38,1) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius:'28px', padding:'40px', color:'#fff',
            display:'flex', justifyContent:'space-between', alignItems:'center',
            position:'relative', overflow:'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <div style={{ position:'absolute', right:'-20px', bottom:'-20px', fontSize:'200px', opacity:0.03, pointerEvents:'none', rotate: '-15deg' }}>🏆</div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize:'10px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.25em', color: '#10B981', marginBottom:'12px' }}>EXECUTION WINDOW</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <div style={{ fontSize:'84px', fontWeight:900, lineHeight:0.8, letterSpacing:'-0.05em', color: '#fff' }}>{daysLeft}</div>
                <div style={{ fontSize:'18px', fontWeight:800, opacity: 0.6 }}>DAYS</div>
              </div>
              <div style={{ fontSize:'14px', fontWeight:700, marginTop:'16px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.02em' }}>UNTIL JULY 26 · <span style={{ color: '#10B981' }}>PLACEMENTS</span></div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'16px', alignItems:'flex-end', position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', opacity: 0.3 }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', opacity: 0.1 }} />
              </div>
              <Link to="/placements" style={{ textDecoration:'none', padding:'12px 24px', background:'#fff', borderRadius:'14px', fontSize:'13px', fontWeight:900, color:'#064e3b', display:'flex', alignItems:'center', gap:'8px', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
              >
                Launch Portal <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* RECENT WINS */}
          <div>
            <div style={{ fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--color-text-3)', marginBottom:'16px' }}>Recent Wins</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'12px' }}>
              {[
                { text: 'Morning Workout — 2h ago', icon: '🔥', color: '#22C55E' },
                { text: 'Journal — yesterday', icon: '✏️', color: '#8B5CF6' },
                { text: 'Saved ₹500 — 3h ago', icon: '💰', color: '#F59E0B' }
              ].map((win, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 16px', background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'99px' }}>
                  <div style={{ width:'6px', height:'6px', borderRadius:'50%', background: win.color }} />
                  <span style={{ fontSize:'14px' }}>{win.icon}</span>
                  <span style={{ fontSize:'13px', fontWeight:600, color:'var(--color-text-2)' }}>{win.text}</span>
                </div>
              ))}
            </div>
          </div>

          <TodayMicroTask />

          {/* Weekly Planner */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ fontSize:'14px', fontWeight:800, color:'var(--color-text-1)' }}>Command Timeline</div>
                <div style={{ fontSize:'10px', fontWeight:800, color:'#22C55E', background:'rgba(34,197,94,0.1)', padding:'4px 8px', borderRadius:'6px', display:'flex', alignItems:'center', gap:'4px' }}>
                  <span style={{ width:'4px', height:'4px', borderRadius:'50%', background:'#22C55E' }} />
                  AI SCHEDULE
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-surface)', padding: '4px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <button onClick={() => setWeekOffset(p => p - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-2)', display: 'flex', alignItems: 'center', padding: '4px' }}><ChevronLeft size={16} /></button>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-1)', width: '60px', textAlign: 'center' }}>Week {weekNum}</div>
                  <button onClick={() => setWeekOffset(p => p + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-2)', display: 'flex', alignItems: 'center', padding: '4px' }}><ChevronRight size={16} /></button>
                </div>
                <button onClick={() => setWeekOffset(0)} style={{ fontSize:'11px', fontWeight:700, color:'var(--color-text-2)', background:'var(--color-surface)', border:'1px solid var(--color-border)', padding:'6px 12px', borderRadius:'8px', cursor:'pointer' }}>
                  Today
                </button>
              </div>
            </div>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '8px', margin: '0 -16px', padding: '0 16px 8px 16px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7, minmax(0, 1fr))', gap:'12px', height: '260px', minWidth: '700px' }}>
                {currentWeekDates.map(d => {
                const dayEvents = allCalendarEvents?.filter(e => {
                  const t = new Date(e.start_time || e.start);
                  const m = String(t.getMonth() + 1).padStart(2, '0');
                  const dd = String(t.getDate()).padStart(2, '0');
                  return `${t.getFullYear()}-${m}-${dd}` === d.dateStr;
                });
                return <WeekCell key={d.dateStr} day={d.day} dateStr={d.dateStr} isToday={d.isToday} calendarEvents={dayEvents} />;
              })}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:'32px', minHeight: 0 }}>

          <CommandCenter user={user} />

          <TrajectoryProgress />
          


        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .overview-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .metric-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Overview;
