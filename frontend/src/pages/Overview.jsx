import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import supabase from '../utils/supabase';
import { motion } from 'framer-motion';
import { Plus, X, ChevronRight, Keyboard, Mic, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import CommandCenter from '../components/overview/CommandCenter';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];


const WeekCell = React.memo(({ day, isToday }) => {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`aiimin_tasks_${day}`) || '[]');
    } catch { return []; }
  });
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem(`aiimin_tasks_${day}`, JSON.stringify(tasks));
  }, [tasks, day]);

  const addTask = () => {
    if (input.trim()) {
      setTasks(p => [...p, { id: Date.now(), text: input.trim(), done: false }]);
      setInput('');
    }
    setAdding(false);
  };

  return (
    <div style={{
      background: isToday ? 'var(--color-accent-dim)' : 'var(--color-surface)',
      border: `1px solid ${isToday ? 'var(--color-accent)' : 'var(--color-border)'}`,
      borderRadius:'16px', padding:'12px', minHeight:'160px', display:'flex', flexDirection:'column', height: '100%'
    }}>
      <div style={{ fontSize:'9px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.1em', color: isToday ? 'var(--color-accent)' : 'var(--color-text-3)', marginBottom:'10px', borderBottom:'1px solid var(--color-border)', paddingBottom:'8px', flexShrink: 0 }}>
        {day}
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'5px', overflowY:'auto', scrollbarWidth:'none', minHeight: 0 }}>
        {tasks.map(t => (
          <div key={t.id} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <input type="checkbox" checked={t.done} onChange={() => setTasks(p=>p.map(x=>x.id===t.id?{...x,done:!x.done}:x))}
              style={{ cursor:'pointer', accentColor:'var(--color-accent)', flexShrink:0 }} />
            <span style={{ fontSize:'11px', color: t.done ? 'var(--color-text-3)' : 'var(--color-text-1)', textDecoration: t.done ? 'line-through' : 'none', flex:1, wordBreak:'break-word' }}>
              {t.text}
            </span>
            <button onClick={() => setTasks(p=>p.filter(x=>x.id!==t.id))} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-3)', padding:0, lineHeight:1 }}>
              <X size={10} />
            </button>
          </div>
        ))}
        {adding ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%', boxSizing: 'border-box' }}>
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
            background:'none', border:'1.5px dashed var(--color-border)', borderRadius:'8px',
            padding:'5px', fontSize:'10px', color:'var(--color-text-3)', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', marginTop:'auto', fontWeight:800
          }}>
            <Plus size={10} /> Add
          </button>
        )}
      </div>
    </div>
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

  React.useEffect(() => {
    const p = getProgress();
    const setDial = (id, val) => {
      const ring = document.getElementById(`orbit-ring-${id}`);
      if (ring) ring.style.width = `${Math.min(100, Math.max(0, val))}%`;
      const pct  = document.getElementById(`orbit-pct-${id}`);
      if (pct)  pct.textContent = `${val.toFixed(2)}%`;
    };
    const t = setTimeout(() => {
      setDial('year',  p.year.val);
      setDial('month', p.month.val);
      setDial('week',  p.week.val);
      setDial('day',   p.day.val);
    }, 120);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let raf;
    let last = 0;
    const tick = (ts) => {
      if (ts - last > 1000) {
        last = ts;
        const p = getProgress();
        [
          ['year',  p.year.val,  p.year.sub],
          ['month', p.month.val, p.month.sub],
          ['week',  p.week.val,  p.week.sub],
          ['day',   p.day.val,   p.day.sub],
        ].forEach(([id, val, sub]) => {
          const ring = document.getElementById(`orbit-ring-${id}`);
          if (ring) ring.style.width = `${Math.min(100, Math.max(0, val))}%`;
          const pct  = document.getElementById(`orbit-pct-${id}`);
          if (pct)  pct.textContent = `${val.toFixed(2)}%`;
          const subEl = document.getElementById(`orbit-sub-${id}`);
          if (subEl) subEl.textContent = sub;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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
        <span style={{ padding: '4px 10px', background: 'var(--color-surface)', borderRadius: '99px', border: '1px solid var(--color-border)' }}>Live</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', margin: 'auto 0' }}>
        <LinearProgress id="day"   label="Day"    color="#22D3EE" sublabel={initial.day.sub}   />
        <LinearProgress id="week"  label="Week"   color="#A78BFA" sublabel={initial.week.sub}  />
        <LinearProgress id="month" label="Month"  color="#F472B6" sublabel={initial.month.sub} />
        <LinearProgress id="year"  label="Year"   color="#FB923C" sublabel={initial.year.sub}  />
      </div>
    </div>
  );
});


/* ── Main Overview ── */
const Overview = () => {
  const { user: authUser } = useAuth();
  const user = useMemo(() => authUser || { id: 'guest', full_name: 'Guest', username: 'GUEST', role: 'guest', isGuest: true }, [authUser]);
  const navigate = useNavigate();

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

  const weekNum = getWeekNum(now);
  const todayIdx = (now.getDay() + 6) % 7;



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

          {/* Quick Access Horizontal Strip */}
          <div style={{ display:'flex', gap:'12px', overflowX:'auto', paddingBottom:'4px', scrollbarWidth: 'none' }}>
            {[
              { to:'/family',      label:'Family',      icon:'👨‍👩‍👧', color:'#EC4899' },
              { to:'/journal',     label:'Journal',     icon:'📓', color:'#F59E0B' },
              { to:'/finance',     label:'Wealth',      icon:'💰', color:'#22C55E' },
              { to:'/habits',      label:'Habits',      icon:'✅', color:'#3B82F6' },
              { to:'/notes',       label:'Notes',       icon:'🗒️', color:'#8B5CF6' },
              { to:'/sports',      label:'Sports',      icon:'⚽', color:'#EF4444' },
              { to:'/placements',  label:'Career',      icon:'🎯', color:'#14B8A6' },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{ textDecoration:'none', flex: 1, minWidth: '100px' }}>
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display:'flex', flexDirection: 'column', alignItems:'center', gap:'8px', padding:'16px 12px',
                    background:'var(--color-surface)', border:'1px solid var(--color-border)',
                    borderRadius:'20px', cursor:'pointer', transition:'border-color 0.2s',
                    textAlign: 'center'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = item.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                  <div style={{ background: `${item.color}15`, color: item.color, width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '4px' }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize:'12px', fontWeight:800, color:'var(--color-text-1)', letterSpacing: '0.02em' }}>{item.label}</div>
                </motion.div>
              </Link>
            ))}
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

          {/* Action Center */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <div style={{ fontSize:'14px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--color-text-1)' }}>Productivity Labs</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'20px' }}>
              <button onClick={() => navigate('/lab?module=typing')} style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'20px', padding:'24px', textAlign:'left', cursor:'pointer', transition:'all 0.2s', display:'flex', flexDirection:'column', gap:'16px' }} onMouseEnter={e=>e.currentTarget.style.borderColor='#10B981'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--color-border)'}>
                <div style={{ background:'rgba(16, 185, 129, 0.1)', color:'#10B981', width:'48px', height:'48px', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}><Keyboard size={24} /></div>
                <div>
                  <div style={{ fontSize:'16px', fontWeight:800, color:'var(--color-text-1)' }}>Typing Lab</div>
                  <div style={{ fontSize:'12px', color:'var(--color-text-3)', marginTop:'6px', lineHeight:1.4 }}>Speed & accuracy</div>
                </div>
              </button>
              <button onClick={() => navigate('/lab?module=speaking')} style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'20px', padding:'24px', textAlign:'left', cursor:'pointer', transition:'all 0.2s', display:'flex', flexDirection:'column', gap:'16px' }} onMouseEnter={e=>e.currentTarget.style.borderColor='#8B5CF6'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--color-border)'}>
                <div style={{ background:'rgba(139, 92, 246, 0.1)', color:'#8B5CF6', width:'48px', height:'48px', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}><Mic size={24} /></div>
                <div>
                  <div style={{ fontSize:'16px', fontWeight:800, color:'var(--color-text-1)' }}>Speaking Lab</div>
                  <div style={{ fontSize:'12px', color:'var(--color-text-3)', marginTop:'6px', lineHeight:1.4 }}>Communication mastery</div>
                </div>
              </button>
            </div>
          </div>

          {/* Weekly Planner */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <div style={{ fontSize:'14px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--color-text-1)' }}>Master Planner</div>
              <div style={{ fontSize:'12px', color:'var(--color-text-3)', fontWeight:700, padding: '4px 12px', background: 'var(--color-elevated)', borderRadius: '99px' }}>Week {weekNum}</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7, minmax(0, 1fr))', gap:'12px', flex: 1, minHeight: 0, gridAutoRows: '1fr' }}>
              {DAYS.map((day, i) => <WeekCell key={day} day={day} isToday={i===todayIdx} />)}
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
        @media (max-width: 768px) {
          .overview-grid { grid-template-columns: 1fr !important; }
          .week-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .metric-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

export default Overview;
