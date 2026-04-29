import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import supabase from '../utils/supabase';
import { motion } from 'framer-motion';
import { Plus, X, ChevronRight } from 'lucide-react';

const STATES = ['clarity','scarcity','abundance','fear','growth','aimlessness','focus','noise'];
const STATE_ICONS = { clarity:'🔍', scarcity:'🪨', abundance:'🌊', fear:'🌑', growth:'🌱', aimlessness:'🌫️', focus:'🎯', noise:'📡' };
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

/* ── Trajectory progress bar ── */
const ProgressRow = ({ label, val, color }) => (
  <div style={{ marginBottom: '14px' }}>
    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
      <span style={{ fontSize:'11px', fontWeight:700, color:'var(--color-text-2)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</span>
      <span style={{ fontSize:'11px', fontWeight:800, color }}>{val}%</span>
    </div>
    <div style={{ height:'5px', background:'var(--color-border)', borderRadius:'99px', overflow:'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${val}%` }}
        transition={{ duration: 0.8, ease: [0.16,1,0.3,1], delay: 0.2 }}
        style={{ height:'100%', background: color, borderRadius:'99px' }}
      />
    </div>
  </div>
);

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
      borderRadius:'16px', padding:'12px', minHeight:'160px', display:'flex', flexDirection:'column'
    }}>
      <div style={{ fontSize:'9px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.1em', color: isToday ? 'var(--color-accent)' : 'var(--color-text-3)', marginBottom:'10px', borderBottom:'1px solid var(--color-border)', paddingBottom:'8px' }}>
        {day}
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'5px' }}>
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
          <input autoFocus value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter')addTask();if(e.key==='Escape'){setAdding(false);setInput('');}}}
            onBlur={addTask}
            placeholder="Add task..."
            style={{ fontSize:'11px', background:'var(--color-elevated)', border:'1px solid var(--color-accent)', borderRadius:'6px', padding:'4px 8px', color:'var(--color-text-1)', outline:'none', fontFamily:'inherit' }}
          />
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

/* ── Quick metric tile ── */
const MetricTile = ({ label, value, color, to }) => (
  <Link to={to} style={{ textDecoration:'none' }}>
    <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'14px', padding:'14px', transition:'all 0.15s', cursor:'pointer' }}
      onMouseEnter={e=>e.currentTarget.style.borderColor='var(--color-accent)'}
      onMouseLeave={e=>e.currentTarget.style.borderColor='var(--color-border)'}
    >
      <div style={{ fontSize:'9px', fontWeight:800, color:'var(--color-text-3)', textTransform:'uppercase', marginBottom:'6px', letterSpacing:'0.06em' }}>{label}</div>
      <div style={{ fontSize:'22px', fontWeight:900, color }}>{value}</div>
    </div>
  </Link>
);

/* ── Main Overview ── */
const Overview = () => {
  const { user } = useAuth();
  const { theme } = useThemeContext();

  const [progress, setProgress] = useState({ year:34, month:42, week:68, day:72 });

  const targetDate = new Date('2026-07-26');
  const now = new Date();
  const daysLeft = Math.max(0, Math.floor((targetDate - now) / 86400000));

  const getWeekNum = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const y = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - y) / 86400000) + 1) / 7);
  };

  const weekNum = getWeekNum(now);
  const todayIdx = (now.getDay() + 6) % 7;

  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      try {
        const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - todayIdx); startOfWeek.setHours(0,0,0,0);

        const { data: yearData } = await supabase.from('daily_logs').select('id').gte('logged_at', startOfYear).eq('user_id', user.id);
        const { data: monthData } = await supabase.from('daily_logs').select('id').gte('logged_at', startOfMonth).eq('user_id', user.id);
        const { data: weekData } = await supabase.from('daily_logs').select('id').gte('logged_at', startOfWeek.toISOString()).eq('user_id', user.id);

        const dayOfYear = Math.ceil((now - new Date(now.getFullYear(),0,1)) / 86400000);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();

        setProgress({
          year:  Math.min(100, Math.round(((yearData?.length||0) / dayOfYear) * 100)),
          month: Math.min(100, Math.round(((monthData?.length||0) / now.getDate()) * 100)),
          week:  Math.min(100, Math.round(((weekData?.length||0) / (todayIdx+1)) * 100)),
          day:   weekData?.some(d => new Date(d.logged_at).toDateString() === now.toDateString()) ? 100 : 0,
        });
      } catch (e) { /* keep defaults */ }
    };
    fetchProgress();
  }, [user]);

  if (!user) return null;

  return (
    <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'32px' }}>
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

      {/* Two-column layout */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'24px' }}>

        {/* LEFT column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>

          {/* Countdown Hero */}
          <div style={{
            background:'linear-gradient(135deg, #1E5C3A 0%, #0D3B26 100%)',
            borderRadius:'20px', padding:'28px 32px', color:'#fff',
            display:'flex', justifyContent:'space-between', alignItems:'center',
            position:'relative', overflow:'hidden'
          }}>
            <div style={{ position:'absolute', right:'-8px', top:'-12px', fontSize:'120px', opacity:0.07, pointerEvents:'none' }}>🎯</div>
            <div>
              <div style={{ fontSize:'10px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', opacity:0.7, marginBottom:'6px' }}>Placement Target</div>
              <div style={{ fontSize:'64px', fontWeight:900, lineHeight:0.9, letterSpacing:'-0.04em' }}>{daysLeft}</div>
              <div style={{ fontSize:'14px', fontWeight:700, marginTop:'8px', opacity:0.85 }}>Days Until July 26, 2026</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px', alignItems:'flex-end' }}>
              <div style={{ padding:'7px 14px', background:'rgba(255,255,255,0.12)', borderRadius:'10px', fontSize:'10px', fontWeight:800, letterSpacing:'0.1em' }}>
                PROTOCOL ACTIVE
              </div>
              <Link to="/placements" style={{ textDecoration:'none', padding:'7px 14px', background:'rgba(255,255,255,0.08)', borderRadius:'10px', fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.8)', display:'flex', alignItems:'center', gap:'4px' }}>
                View Board <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* Weekly Planner */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
              <div style={{ fontSize:'13px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--color-text-1)' }}>Master Planner</div>
              <div style={{ fontSize:'11px', color:'var(--color-text-3)', fontWeight:600 }}>Week {weekNum}</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'8px' }}>
              {DAYS.map((day, i) => <WeekCell key={day} day={day} isToday={i===todayIdx} />)}
            </div>
          </div>

          {/* Quick metrics row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'10px' }}>
            <MetricTile label="DSA" value="142" color="#3B82F6" to="/lab" />
            <MetricTile label="Typing WPM" value="84" color="#10B981" to="/lab" />
            <MetricTile label="Finance" value="₹" color="#F59E0B" to="/finance" />
            <MetricTile label="Habits" value="5/7" color="#8B5CF6" to="/habits" />
          </div>
        </div>

        {/* RIGHT sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

          <QuickCheckIn user={user} />

          {/* Trajectory */}
          <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'20px', padding:'20px' }}>
            <div style={{ fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--color-text-3)', marginBottom:'18px' }}>Trajectory</div>
            <ProgressRow label="Yearly"  val={progress.year}  color="var(--color-accent)" />
            <ProgressRow label="Monthly" val={progress.month} color="#3B82F6" />
            <ProgressRow label="Weekly"  val={progress.week}  color="#F59E0B" />
            <ProgressRow label="Daily"   val={progress.day}   color="#EC4899" />
          </div>

          {/* Quick nav */}
          <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)', borderRadius:'20px', padding:'20px' }}>
            <div style={{ fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--color-text-3)', marginBottom:'14px' }}>Quick Access</div>
            {[
              { to:'/journal', label:'Journal', icon:'📓', sub:'Write today\'s entry' },
              { to:'/finance', label:'Finance', icon:'💰', sub:'Track expenses' },
              { to:'/habits',  label:'Habits',  icon:'✅', sub:'Mark daily habits' },
              { to:'/sports',  label:'Sports',  icon:'⚽', sub:'Live scores' },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{ textDecoration:'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom:'1px solid var(--color-border)' }}
                  onMouseEnter={e=>e.currentTarget.style.opacity='0.7'}
                  onMouseLeave={e=>e.currentTarget.style.opacity='1'}
                >
                  <span style={{ fontSize:'16px' }}>{item.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'13px', fontWeight:600, color:'var(--color-text-1)' }}>{item.label}</div>
                    <div style={{ fontSize:'11px', color:'var(--color-text-3)' }}>{item.sub}</div>
                  </div>
                  <ChevronRight size={14} color="var(--color-text-3)" />
                </div>
              </Link>
            ))}
          </div>
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
