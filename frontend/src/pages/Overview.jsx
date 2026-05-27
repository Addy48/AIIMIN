import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import supabase from '../utils/supabase';
import { motion } from 'framer-motion';
import { Plus, X, ChevronRight, Keyboard, Mic } from 'lucide-react';
import TypingTest from '../components/lab/TypingTest';
import SpeakingLogger from '../components/lab/SpeakingLogger';
import DesktopWindow from '../components/ui/DesktopWindow';

const STATES = ['clarity','scarcity','abundance','fear','growth','aimlessness','focus','noise'];
const STATE_ICONS = { clarity:'🔍', scarcity:'🪨', abundance:'🌊', fear:'🌑', growth:'🌱', aimlessness:'🌫️', focus:'🎯', noise:'📡' };
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

/* ── Trajectory progress bar — smooth GPU-composited ── */
const ProgressRow = ({ label, val, color, delay = 0 }) => {
  const [displayed, setDisplayed] = React.useState(0);
  const mounted = React.useRef(false);

  // On mount: animate from 0 → val smoothly once
  // After that: keep in sync with val via fast CSS transition (no re-trigger of framer)
  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const t = setTimeout(() => setDisplayed(val), 60 + delay);
      return () => clearTimeout(t);
    }
    setDisplayed(val);
  }, [val]); // eslint-disable-line

  return (
    <div style={{ marginBottom: '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        <span style={{ fontSize: '11px', fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{Number(val).toFixed(4)}%</span>
      </div>
      <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden', position: 'relative' }}>
        {/* Glow track */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(90deg, transparent 0%, color-mix(in srgb, ${color} 15%, transparent) 100%)`,
          borderRadius: '99px',
        }} />
        {/* Animated fill */}
        <div style={{
          height: '100%',
          width: `${displayed}%`,
          background: `linear-gradient(90deg, color-mix(in srgb, ${color} 80%, transparent), ${color})`,
          borderRadius: '99px',
          transition: mounted.current
            ? 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'none',
          willChange: 'width',
          position: 'relative',
          boxShadow: `0 0 8px color-mix(in srgb, ${color} 40%, transparent)`,
        }}>
          {/* Shimmer tip */}
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: '12px',
            background: `radial-gradient(ellipse at right, ${color} 100%, transparent 100%)`,
            borderRadius: '99px',
          }} />
        </div>
      </div>
    </div>
  );
};


/* ── Quick Check-In ── */
const QuickCheckIn = ({ user }) => {
  const [vals, setVals] = useState({ mood:7, energy:7, focus:7 });
  const [state, setState] = useState('focus');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!user || saving) return;
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    try {
      if (user.isGuest) {
        setSaved(true);
        setNote('');
        setTimeout(() => setSaved(false), 3000);
        return;
      }
      await supabase.from('daily_logs').insert({ user_id: user.id, mood: vals.mood, energy_level: vals.energy, focus_score: vals.focus, logged_at: new Date().toISOString() });
      await supabase.from('lab_mindset_logs').insert({ user_id: user.id, state, note: note.trim() || null, day_of: today, logged_at: new Date().toISOString() });
      setSaved(true);
      setNote('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'20px', padding:'24px' }}>
      <div style={{ fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--color-text-3)', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}>
        <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--color-accent)', display:'inline-block' }} />
        Operational Pulse
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'6px', marginBottom:'20px' }}>
        {STATES.map(s => (
          <button key={s} onClick={() => setState(s)} style={{
            background: state===s ? 'var(--color-accent)' : 'var(--color-elevated)',
            color: state===s ? '#fff' : 'var(--color-text-3)',
            border: `1px solid ${state===s ? 'var(--color-accent)' : 'var(--color-border)'}`,
            borderRadius:'8px', padding:'8px 4px', cursor:'pointer',
            fontSize:'9px', fontWeight:800, textAlign:'center',
            transition:'all 0.15s', display:'flex', flexDirection:'column', alignItems:'center', gap:'3px'
          }}>
            <span style={{ fontSize:'13px' }}>{STATE_ICONS[s]}</span>
            {s}
          </button>
        ))}
      </div>
      {['mood','energy','focus'].map(k => (
        <div key={k} style={{ marginBottom:'14px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
            <span style={{ fontSize:'10px', fontWeight:800, textTransform:'uppercase', color:'var(--color-text-3)' }}>{k}</span>
            <span style={{ fontSize:'11px', fontWeight:900, color:'var(--color-accent)' }}>{vals[k]}</span>
          </div>
          <input type="range" min={1} max={10} value={vals[k]} onChange={e => setVals(v=>({...v,[k]:Number(e.target.value)}))}
            style={{ width:'100%', height:'4px', appearance:'none', background:'var(--color-border)', borderRadius:'10px', outline:'none', cursor:'pointer', accentColor:'var(--color-accent)' }} />
        </div>
      ))}
      <textarea placeholder="Quick reflection..." value={note} onChange={e=>setNote(e.target.value)}
        style={{ width:'100%', boxSizing:'border-box', background:'var(--color-elevated)', border:'1px solid var(--color-border)', borderRadius:'10px', padding:'10px 12px', fontSize:'13px', color:'var(--color-text-1)', outline:'none', resize:'none', height:'56px', fontFamily:'inherit', marginBottom:'12px' }} />
      <button onClick={save} disabled={saved||saving} style={{
        width:'100%', padding:'13px', borderRadius:'12px',
        background: saved ? 'var(--color-accent-dim)' : 'var(--color-accent)',
        color: saved ? 'var(--color-accent)' : '#fff',
        border:'none', fontSize:'12px', fontWeight:900, cursor:'pointer', transition:'all 0.2s'
      }}>
        {saved ? '✓ SYNCED' : saving ? 'SYNCING...' : 'COMMIT SESSION'}
      </button>
    </div>
  );
};

/* ── Weekly task cell ── */
const WeekCell = ({ day, isToday }) => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [adding, setAdding] = useState(false);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: input.trim(), done: false }]);
    setInput(''); setAdding(false);
  };

  return (
    <div style={{
      background: isToday ? 'var(--color-accent-dim)' : 'var(--color-surface)',
      border: `1px solid ${isToday ? 'var(--color-accent)' : 'var(--color-border)'}`,
      borderRadius:'16px', padding:'12px', minHeight:'160px', maxHeight: '250px', display:'flex', flexDirection:'column'
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
};

/* ── Main Overview ── */
const Overview = () => {
  const { user: authUser } = useAuth();
  const user = authUser || { id: 'guest', full_name: 'Guest', username: 'GUEST', role: 'guest', isGuest: true };

  const [progress, setProgress] = useState({ year:0, month:0, week:0, day:0 });


  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal]);

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

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      
      const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
      const nextYear = new Date(now.getFullYear() + 1, 0, 1).getTime();
      const yearElapsed = ((now.getTime() - startOfYear) / (nextYear - startOfYear)) * 100;
      
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
      const monthElapsed = ((now.getTime() - startOfMonth) / (nextMonth - startOfMonth)) * 100;

      const dayOfWeek = (now.getDay() + 6) % 7; 
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);
      const nextWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
      const weekElapsed = ((now.getTime() - startOfWeek.getTime()) / (nextWeek.getTime() - startOfWeek.getTime())) * 100;

      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startOfDay.setHours(0, 0, 0, 0);
      const nextDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      const dayElapsed = ((now.getTime() - startOfDay.getTime()) / (nextDay.getTime() - startOfDay.getTime())) * 100;

      setProgress({
        year: yearElapsed.toFixed(4),
        month: monthElapsed.toFixed(4),
        week: weekElapsed.toFixed(4),
        day: dayElapsed.toFixed(4)
      });
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  return (
    <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'32px', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.18em', color:'var(--color-accent)', marginBottom:'6px' }}>
            Operational Intelligence
          </div>
          <h1 style={{ fontSize:'36px', fontWeight:800, color:'var(--color-text-1)', margin:0, letterSpacing:'-0.03em', fontFamily:'var(--font-serif)' }}>
            Day Control.
          </h1>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:'13px', fontWeight:700, color:'var(--color-text-2)' }}>
            {now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
          </div>
          <div style={{ fontSize:'10px', color:'var(--color-text-3)', marginTop:'3px' }}>
            Week {weekNum} · AIIMIN v3
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0, 1fr) 340px', gap:'32px' }} className="overview-grid">

        {/* LEFT column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'32px' }}>
          
          {/* Quick Access Horizontal Strip */}
          <div style={{ display:'flex', gap:'12px', overflowX:'auto', paddingBottom:'4px', scrollbarWidth: 'none' }}>
            {[
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
              <button onClick={() => setActiveModal('typing')} style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'20px', padding:'24px', textAlign:'left', cursor:'pointer', transition:'all 0.2s', display:'flex', flexDirection:'column', gap:'16px' }} onMouseEnter={e=>e.currentTarget.style.borderColor='#10B981'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--color-border)'}>
                <div style={{ background:'rgba(16, 185, 129, 0.1)', color:'#10B981', width:'48px', height:'48px', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}><Keyboard size={24} /></div>
                <div>
                  <div style={{ fontSize:'16px', fontWeight:800, color:'var(--color-text-1)' }}>Typing Lab</div>
                  <div style={{ fontSize:'12px', color:'var(--color-text-3)', marginTop:'6px', lineHeight:1.4 }}>Speed & accuracy</div>
                </div>
              </button>
              <button onClick={() => setActiveModal('speaking')} style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'20px', padding:'24px', textAlign:'left', cursor:'pointer', transition:'all 0.2s', display:'flex', flexDirection:'column', gap:'16px' }} onMouseEnter={e=>e.currentTarget.style.borderColor='#8B5CF6'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--color-border)'}>
                <div style={{ background:'rgba(139, 92, 246, 0.1)', color:'#8B5CF6', width:'48px', height:'48px', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}><Mic size={24} /></div>
                <div>
                  <div style={{ fontSize:'16px', fontWeight:800, color:'var(--color-text-1)' }}>Speaking Lab</div>
                  <div style={{ fontSize:'12px', color:'var(--color-text-3)', marginTop:'6px', lineHeight:1.4 }}>Communication mastery</div>
                </div>
              </button>
            </div>
          </div>

          {/* Weekly Planner */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <div style={{ fontSize:'14px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--color-text-1)' }}>Master Planner</div>
              <div style={{ fontSize:'12px', color:'var(--color-text-3)', fontWeight:700, padding: '4px 12px', background: 'var(--color-elevated)', borderRadius: '99px' }}>Week {weekNum}</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7, minmax(0, 1fr))', gap:'12px' }}>
              {DAYS.map((day, i) => <WeekCell key={day} day={day} isToday={i===todayIdx} />)}
            </div>
          </div>

        </div>

        {/* RIGHT sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:'32px' }}>

          <QuickCheckIn user={user} />

          {/* Trajectory */}
          <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'24px', padding:'28px' }}>
            <div style={{ fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--color-text-3)', marginBottom:'24px' }}>Trajectory Execution</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px 24px' }}>
              <ProgressRow label="Yearly"  val={progress.year}  color="var(--color-accent)" delay={0}   />
              <ProgressRow label="Monthly" val={progress.month} color="#3B82F6"              delay={80}  />
              <ProgressRow label="Weekly"  val={progress.week}  color="#F59E0B"              delay={160} />
              <ProgressRow label="Daily"   val={progress.day}   color="#EC4899"              delay={240} />
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      {activeModal === 'typing' && (
        <DesktopWindow title="Typing Lab" subtitle="monkeytype-style keyboard practice" onClose={() => setActiveModal(null)} width="1180px" height="84vh">
          <TypingTest userId={user.id} onComplete={() => {}} onClose={() => setActiveModal(null)} />
        </DesktopWindow>
      )}

      {activeModal === 'speaking' && (
        <DesktopWindow title="Speaking Lab" subtitle="prompt, record, assess, save" onClose={() => setActiveModal(null)} width="1180px" height="84vh">
          <SpeakingLogger onComplete={() => {}} onClose={() => setActiveModal(null)} />
        </DesktopWindow>
      )}




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
