import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import supabase from '../utils/supabase';
import { motion } from 'framer-motion';
import { Plus, X, ChevronRight, ChevronLeft, Keyboard, Mic, AlertTriangle, Sun, Moon } from 'lucide-react';
import AnimatedNumber from '../components/ui/AnimatedNumber';
import PageHeader from '../components/layout/PageHeader';
import CommandCenter from '../components/overview/CommandCenter';
import PulseCheckModal from '../components/overview/PulseCheckModal';
import MondayInsight from '../components/overview/MondayInsight';
import WeekInNumbers from '../components/overview/WeekInNumbers';
import { useOverviewWidgets } from '../components/overview/OverviewWidgetGrid';
import { StaggerWrap } from '../components/design/ShippedMotion';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { getSolarTimes } from '../utils/solarTimes';
import UniversalLogger from '../components/dashboard/UniversalLogger';
import ArcBanner from '../components/profile/ArcBanner';
import YourReportCard from '../components/overview/YourReportCard';
import { useUserProfile } from '../hooks/useUserProfile';

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
    <div style={{ height: '100%', paddingTop: 8, paddingBottom: 6, boxSizing: 'border-box' }}>
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      style={{
      background: isToday ? 'var(--color-success-dim, rgba(16, 185, 129, 0.08))' : 'var(--color-surface)',
      border: `1px solid ${isToday ? 'color-mix(in srgb, var(--color-success) 35%, var(--color-border))' : 'var(--color-border)'}`,
      boxShadow: isToday ? '0 4px 12px rgba(34,197,94,0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
      borderRadius:'16px', padding:'12px', display:'flex', flexDirection:'column', height: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'10px', borderBottom: isToday ? '1px dashed rgba(34,197,94,0.3)' : '1px dashed var(--color-border)', paddingBottom:'8px', flexShrink: 0 }}>
        <div style={{ fontSize:'13px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.06em', color: isToday ? 'var(--color-success)' : 'var(--color-text-1)' }}>
          {day}
        </div>
        <div style={{ fontSize:'14px', fontWeight:800, color: isToday ? 'var(--color-success)' : 'var(--color-text-1)', background: isToday ? 'rgba(16, 185, 129, 0.1)' : 'transparent', padding: isToday ? '2px 6px' : '0', borderRadius: '4px' }}>
          {new Date(dateStr).getDate()}
        </div>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'6px', overflowY:'auto', scrollbarWidth:'none', minHeight: 0 }}>
        {calendarEvents?.map(e => (
          <div key={e.id} style={{ fontSize:'10px', background:'var(--color-elevated)', borderLeft:`2px solid ${e.color||'var(--color-info)'}`, padding:'4px 6px', borderRadius:'4px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'var(--color-text-1)', fontWeight:600, display: 'flex', alignItems: 'center', gap: '4px' }}>
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
              style={{ flex: 1, minWidth: 0, fontSize:'11px', background:'var(--color-elevated)', border:'1px solid var(--color-border-lit)', borderRadius:'6px', padding:'4px 8px', color:'var(--color-text-1)', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
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
    </div>
  );
});

const clampPercent = (value) => Math.min(100, Math.max(0, value));

const getTrajectorySnapshot = (timezone) => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const nextYear = new Date(now.getFullYear() + 1, 0, 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const dayOfWeek = (now.getDay() + 6) % 7;
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);
  const nextWeek = new Date(startOfWeek.getTime() + 7 * 86400000);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextDay = new Date(startOfDay.getTime() + 86400000);

  const percentBetween = (start, end) => clampPercent(((now - start) / (end - start)) * 100);
  const minutesLeft = Math.ceil((nextDay - now) / 60000);
  const hoursLeft = Math.floor(minutesLeft / 60);
  const minuteRemainder = minutesLeft % 60;
  const daySub = hoursLeft > 0 ? `${hoursLeft}h ${minuteRemainder}m left` : `${minutesLeft}m left`;
  const dayOfYear = Math.floor((now - startOfYear) / 86400000) + 1;
  const daysInYear = Math.round((nextYear - startOfYear) / 86400000);
  const monthDay = now.getDate();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const phase = currentHour < 11 ? 'Morning build' : currentHour < 17 ? 'Afternoon push' : currentHour < 21 ? 'Evening close' : 'Night reset';

  const solar = getSolarTimes(now, timezone);

  return {
    dayOfWeek,
    dayOfYear,
    daysInYear,
    phase,
    time: {
      sunrise: solar.sunrise,
      sunset: solar.sunset,
    },
    executionRatio: Math.round((percentBetween(startOfDay, nextDay) * 0.54) + (dayOfWeek * 3.5)),
    rows: [
      { id: 'day', label: 'Day', value: percentBetween(startOfDay, nextDay), sub: daySub, color: 'var(--color-success)' },
      { id: 'week', label: 'Week', value: percentBetween(startOfWeek, nextWeek), sub: `${Math.ceil((nextWeek - now) / 86400000)}d left`, color: '#3B82F6' },
      { id: 'month', label: 'Month', value: percentBetween(startOfMonth, nextMonth), sub: `${Math.ceil((nextMonth - now) / 86400000)}d left`, color: '#EC4899' },
      { id: 'year', label: 'Year', value: percentBetween(startOfYear, nextYear), sub: `${Math.ceil((nextYear - now) / 86400000)}d left`, color: '#F97316' },
    ],
    weekRhythm: Array.from({ length: 7 }, (_, index) => {
      if (index < dayOfWeek) return index % 2 === 0 ? 'strong' : 'active';
      if (index === dayOfWeek) return 'today';
      return 'idle';
    }),
    monthDay,
  };
};

const TrajectoryArc = ({ progress, phase, time }) => {
  const cx = 110;
  const cy = 101;
  const radius = 86;
  const angle = Math.PI * (1 - progress / 100);
  const sunX = cx + radius * Math.cos(angle);
  const sunY = cy - radius * Math.sin(angle);
  const circumference = Math.PI * radius;
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', margin: '4px 0 10px' }}>
      <svg viewBox="0 0 220 118" role="img" aria-label={`Day progress ${progress.toFixed(0)} percent`} style={{ width: '100%', maxWidth: '226px', height: '118px', overflow: 'visible' }}>
        <defs>
          <linearGradient id="trajectoryArcGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-success)" stopOpacity="0.18" />
            <stop offset="54%" stopColor="var(--color-success)" stopOpacity="0.72" />
            <stop offset="100%" stopColor="var(--color-warning)" stopOpacity="0.65" />
          </linearGradient>
          <radialGradient id="trajectorySunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-warning)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--color-warning)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <line x1="18" y1="101" x2="202" y2="101" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 5" />
        <path d="M 24 101 A 86 86 0 0 1 196 101" fill="none" stroke="var(--color-border)" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M 24 101 A 86 86 0 0 1 196 101"
          fill="none"
          stroke="url(#trajectoryArcGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        {[25, 50, 75].map((mark) => {
          const markAngle = Math.PI * (1 - mark / 100);
          return (
            <circle
              key={mark}
              cx={cx + radius * Math.cos(markAngle)}
              cy={cy - radius * Math.sin(markAngle)}
              r="2"
              fill="var(--color-surface)"
              stroke="var(--color-border)"
              strokeWidth="1"
            />
          );
        })}
        <circle cx={sunX} cy={sunY} r="15" fill="url(#trajectorySunGlow)" />
        <circle cx={sunX} cy={sunY} r="5.5" fill="var(--color-warning)" />
        <circle cx={sunX - 1.5} cy={sunY - 1.5} r="2" fill="#FDE68A" />
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '226px', color: 'var(--color-text-3)', fontSize: '10px', fontWeight: 700 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Sun size={11} />{time.sunrise}</span>
        <span style={{ color: 'var(--color-text-2)', fontWeight: 800 }}>{phase}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{time.sunset}<Moon size={11} /></span>
      </div>
    </div>
  );
};

const TrajectoryRow = ({ row }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px', minWidth: 0 }}>
        <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--color-text-1)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{row.label}</span>
        <span style={{ fontSize: '10px', color: 'var(--color-text-3)', fontWeight: 700, whiteSpace: 'nowrap' }}>{row.sub}</span>
      </div>
      <span style={{ fontSize: '11px', fontWeight: 900, color: row.color, fontVariantNumeric: 'tabular-nums' }}>{row.value.toFixed(1)}%</span>
    </div>
    <div style={{ height: '6px', borderRadius: '999px', background: 'var(--color-elevated)', border: '1px solid var(--color-border)', overflow: 'hidden', position: 'relative' }}>
      {row.id === 'day' && (
        <>
          <span style={{ position: 'absolute', top: '-2px', bottom: '-2px', left: '33%', width: '1px', background: 'color-mix(in srgb, var(--color-text-3) 28%, transparent)' }} />
          <span style={{ position: 'absolute', top: '-2px', bottom: '-2px', left: '66%', width: '1px', background: 'color-mix(in srgb, var(--color-text-3) 28%, transparent)' }} />
        </>
      )}
      <div style={{
        height: '100%',
        width: `${row.value}%`,
        background: `linear-gradient(90deg, color-mix(in srgb, ${row.color} 62%, white), ${row.color})`,
        borderRadius: 'inherit',
        transition: 'width 700ms cubic-bezier(0.16, 1, 0.3, 1)',
      }} />
    </div>
  </div>
);

const TrajectoryProgress = React.memo(() => {
  const { user } = useAuth();
  const timezone = user?.timezone;
  const [snapshot, setSnapshot] = useState(() => getTrajectorySnapshot(timezone));

  useEffect(() => {
    setSnapshot(getTrajectorySnapshot(timezone));
    const interval = setInterval(() => setSnapshot(getTrajectorySnapshot(timezone)), 30000);
    return () => clearInterval(interval);
  }, [timezone]);

  const dayProgress = snapshot.rows[0].value;
  const safeExecutionRatio = clampPercent(snapshot.executionRatio);

  return (
    <div style={{
      background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-elevated) 100%)',
      border: '1px solid var(--color-border)',
      borderRadius: '24px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.02), 0 8px 24px rgba(0,0,0,0.04)',
      minHeight: 0,
      overflow: 'hidden',
    }}>
      <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--color-text-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Trajectory Execution</span>
        <span className="trajectory-live-badge">
          <span className="trajectory-live-dot" />
          LIVE
        </span>
      </div>

      <TrajectoryArc progress={dayProgress} phase={snapshot.phase} time={snapshot.time} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '12px 14px',
      }}>
        <div>
          <div style={{ fontSize: '9px', fontWeight: 900, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Time Invested</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-2)', fontWeight: 650, marginTop: '2px' }}>intentional day pressure</div>
        </div>
        <div style={{ color: 'var(--color-text-1)', fontSize: '28px', lineHeight: 1, fontWeight: 950, letterSpacing: '-0.06em', fontVariantNumeric: 'tabular-nums' }}>
          <AnimatedNumber value={safeExecutionRatio} duration={0.8} suffix="%" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {snapshot.rows.map((row) => <TrajectoryRow key={row.id} row={row} />)}
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ fontSize: '9px', fontWeight: 900, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>This Week</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          {DAYS.map((day, index) => {
            const status = snapshot.weekRhythm[index];
            return (
              <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span className={`trajectory-week-dot is-${status}`} />
                <span style={{ fontSize: '8px', color: 'var(--color-text-3)', fontWeight: 800 }}>{day.slice(0, 1)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--color-text-3)', fontWeight: 750 }}>
        Day <span style={{ color: 'var(--color-text-1)', fontWeight: 900 }}>{snapshot.dayOfYear}</span> of {snapshot.daysInYear} · Month day <span style={{ color: 'var(--color-text-1)', fontWeight: 900 }}>{snapshot.monthDay}</span>
      </div>

      <style>{`
        @keyframes trajectoryPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .4; transform: scale(.72); }
        }
        .trajectory-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--color-text-2);
          font-weight: 950;
          letter-spacing: .08em;
        }
        .trajectory-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--color-success);
          animation: trajectoryPulse 1.8s ease-in-out infinite;
        }
        .trajectory-week-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--color-border);
          transition: background .2s ease, box-shadow .2s ease;
        }
        .trajectory-week-dot.is-active {
          background: color-mix(in srgb, var(--color-success) 45%, var(--color-border));
        }
        .trajectory-week-dot.is-strong,
        .trajectory-week-dot.is-today {
          background: var(--color-success);
        }
        .trajectory-week-dot.is-today {
          box-shadow: 0 0 0 3px var(--color-surface), 0 0 0 4px color-mix(in srgb, var(--color-success) 55%, var(--color-border));
        }
        @media (prefers-reduced-motion: reduce) {
          .trajectory-live-dot { animation: none; }
        }
      `}</style>
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
            placeholder="One small thing for today"
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
              {task.text || 'Tap to set today’s micro-task'}
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
  const { profile } = useUserProfile();
  const user = useMemo(() => authUser || { id: 'guest', full_name: 'Guest', username: 'GUEST', role: 'guest', isGuest: true }, [authUser]);
  const navigate = useNavigate();
  const { isVisible, allHidden, Picker } = useOverviewWidgets();

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

      <ArcBanner lifeArc={profile?.tagline} />

      <PulseCheckModal user={user} />

      <Picker />

      {allHidden && (
        <div style={{
          padding: '20px 24px', borderRadius: 16, marginBottom: 24,
          background: 'var(--color-accent-dim)', border: '1px solid var(--color-border)',
          color: 'var(--color-text-2)', fontSize: 14, lineHeight: 1.6,
        }}>
          All overview widgets are hidden. Use <strong style={{ color: 'var(--color-text-1)' }}>Customize widgets</strong> above to turn sections back on.
        </div>
      )}

      {/* Main Grid */}
      <div className="overview-grid">

        {/* LEFT column */}
        <StaggerWrap style={{ display:'flex', flexDirection:'column', gap:'24px', minHeight: 0 }}>
          
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

          {isVisible('monday_insight') && <MondayInsight user={user} />}

          <YourReportCard user={user} tier={profile?.subscription_tier || 'explore'} />

          {isVisible('week_numbers') && <WeekInNumbers user={user} />}

          {isVisible('logger') && (
            <div
              className="today-capture-shell"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                padding: '20px 20px 16px',
              }}
            >
              <UniversalLogger onSuccess={() => {}} />
            </div>
          )}

          {isVisible('countdown') && (
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
          )}

          {isVisible('wins') && (
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
          )}

          {isVisible('micro_task') && <TodayMicroTask />}

          {isVisible('timeline') && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ fontSize:'14px', fontWeight:800, color:'var(--color-text-1)' }}>Command Timeline</div>
                <div style={{ fontSize:'10px', fontWeight:700, color:'var(--color-text-2)', background:'var(--color-elevated)', border:'1px solid var(--color-border)', padding:'4px 8px', borderRadius:'6px' }}>
                  From calendar
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-surface)', padding: '4px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <button type="button" onClick={() => setWeekOffset(p => p - 1)} aria-label="Previous week" style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--color-text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', minWidth: '36px' }}><ChevronLeft size={16} /></button>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-1)', width: '60px', textAlign: 'center' }}>Week {weekNum}</div>
                  <button type="button" onClick={() => setWeekOffset(p => p + 1)} aria-label="Next week" style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--color-text-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', minWidth: '36px' }}><ChevronRight size={16} /></button>
                </div>
                <button onClick={() => setWeekOffset(0)} style={{ fontSize:'11px', fontWeight:700, color:'var(--color-text-2)', background:'var(--color-surface)', border:'1px solid var(--color-border)', padding:'6px 12px', borderRadius:'8px', cursor:'pointer' }}>
                  Today
                </button>
              </div>
            </div>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', margin: '0 -16px', padding: '4px 16px 12px 16px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7, minmax(0, 1fr))', gap:'12px', height: '272px', minWidth: '700px' }}>
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
          )}

        </StaggerWrap>

        {/* RIGHT sidebar */}
        <div className="overview-rail">

          {isVisible('command_center') && <CommandCenter user={user} />}

          {isVisible('trajectory') && <TrajectoryProgress />}

        </div>
      </div>
    </div>
  );
};

export default Overview;
