import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDailyStats } from '../hooks/useDailyStats';
import HabitCircle from '../components/ui/HabitCircle';
import TaskRow from '../components/ui/TaskRow';
import { supabase } from '../utils/supabase';
import api from '../utils/api';

/* ── Score calculation ───────────────────────────────── */
const calcScore = (log) => {
  if (!log) return 0;
  let score = 0;
  if ((log.sleep_hours || 0) >= 7) score += 20;
  else if ((log.sleep_hours || 0) >= 6) score += 10;
  if (log.gym_done) score += 20;
  if (log.breakfast_done) score += 10;
  if ((log.steps || 0) >= 10000) score += 15;
  else if ((log.steps || 0) >= 5000) score += 8;
  if ((log.water_bottles || 0) >= 3) score += 10;
  else if ((log.water_bottles || 0) >= 2) score += 5;
  if (log.learning_done) score += 15;
  if (log.journal_entry?.trim()) score += 10;
  return Math.min(score, 100);
};

/* ── Daily balance categories (total = 100) ─────────── */
const calcBalance = (log, netWorth) => {
  if (!log) return { body: 0, mind: 0, craft: 0, wealth: 0 };
  const body   = (log.gym_done ? 20 : 0) + (log.breakfast_done ? 10 : 0);
  const mind   = ((log.sleep_hours || 0) >= 7 ? 20 : (log.sleep_hours || 0) >= 6 ? 10 : 0) + (log.learning_done ? 10 : 0);
  const craft  = Math.min(((log.steps || 0) >= 10000 ? 15 : (log.steps || 0) >= 5000 ? 8 : 0) + (log.journal_entry?.trim() ? 10 : 0), 25);
  const wealth = Math.min(((log.water_bottles || 0) >= 3 ? 10 : (log.water_bottles || 0) >= 2 ? 5 : 0) + (netWorth !== null ? 5 : 0), 15);
  return { body, mind, craft, wealth };
};

/* ── Placement days ──────────────────────────────────── */
const getDaysToPlacement = () => {
  const target = new Date('2026-07-04');
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.max(0, Math.ceil((target - today) / 86400000));
};

/* ── Archetype from score ────────────────────────────── */
const getArchetype = (score) => {
  if (score >= 90) return 'The Legend';
  if (score >= 75) return 'The Warrior';
  if (score >= 60) return 'The Builder';
  if (score >= 40) return 'The Striver';
  if (score >= 25) return 'The Drifter';
  return 'The Recluse';
};

/* ── Daily rotation helpers ──────────────────────────── */
const dayOfYear = () => Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);

const PHRASES = [
  'build slowly.', 'earn the reps.', 'close the loops.',
  'keep the streak.', 'show up quietly.', 'trust the process.',
  'write the code.', 'protect the hours.', 'make it count.', 'move the needle.',
];

const INTENTIONS = [
  'Show up for the boring reps.',
  'Earn the compound interest.',
  'Close the open loops.',
  'Small inputs. Long game.',
  'Protect the morning. Protect the work.',
  'Trust the system you built.',
  'One more rep. Then rest.',
  'The work is the reward.',
  'Keep the streak. Keep the faith.',
  'Build quietly. Ship consistently.',
];

/* ── Skeleton ────────────────────────────────────────── */
const Sk = ({ h, w = '100%', r = '10px' }) => (
  <div className="skeleton" style={{ height: h, width: w, borderRadius: r }} />
);

/* ── Card wrapper ────────────────────────────────────── */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--r-card)',
    padding: '20px',
    ...style,
  }}>
    {children}
  </div>
);

/* ── Card label ──────────────────────────────────────── */
const Label = ({ children }) => (
  <span style={{
    font: '500 10px/1 var(--font-mono)',
    color: 'var(--color-text-2)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '12px',
  }}>
    {children}
  </span>
);

/* ── Donut chart ─────────────────────────────────────── */
const DonutChart = ({ value, max = 100 }) => {
  const size = 120;
  const sw = 9;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const filled = c * Math.max(0, Math.min(value / max, 1));
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke="var(--color-border)" strokeWidth={sw} />
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke="var(--color-accent)" strokeWidth={sw}
        strokeDasharray={`${filled} ${c - filled}`}
        strokeLinecap="round"
        style={{ transition: `stroke-dasharray var(--dur-progress) var(--ease)` }}
      />
    </svg>
  );
};

/* ── Category progress bar ───────────────────────────── */
const CategoryBar = ({ label, value, max }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
      <span style={{ font: '400 13px/1 var(--font-sans)', color: 'var(--color-text-1)' }}>{label}</span>
      <span style={{ font: '400 12px/1 var(--font-mono)', color: 'var(--color-text-2)' }}>{value} / {max}</span>
    </div>
    <div style={{ height: '2px', background: 'var(--color-border)', borderRadius: '2px' }}>
      <div style={{
        height: '100%',
        width: `${Math.min((value / max) * 100, 100)}%`,
        background: 'var(--color-accent)',
        borderRadius: '2px',
        transition: `width var(--dur-progress) var(--ease)`,
      }} />
    </div>
  </div>
);

/* ── Sleep squares ───────────────────────────────────── */
const SleepSquares = ({ hours, target = 8 }) => {
  const filled = Math.min(Math.floor(hours), target);
  return (
    <div style={{ display: 'flex', gap: '4px', marginTop: '10px', flexWrap: 'wrap' }}>
      {Array.from({ length: target }, (_, i) => (
        <div key={i} style={{
          width: '22px',
          height: '13px',
          borderRadius: '3px',
          background: i < filled ? 'var(--color-accent)' : 'var(--color-border)',
          transition: `background ${i * 60 + 200}ms var(--ease)`,
        }} />
      ))}
    </div>
  );
};

/* ── Mood picker ─────────────────────────────────────── */
const MOODS = [
  { emoji: '😠', label: 'depleted', v: 1 },
  { emoji: '😐', label: 'low',      v: 2 },
  { emoji: '🙂', label: 'okay',     v: 3 },
  { emoji: '😊', label: 'good',     v: 4 },
  { emoji: '😁', label: 'sharp',    v: 5 },
];
const MoodPicker = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
    {MOODS.map(({ emoji, label, v }) => {
      const active = value === v;
      return (
        <button
          key={v}
          title={label}
          onClick={() => onChange?.(v)}
          style={{
            width: '38px', height: '38px',
            borderRadius: '50%',
            border: active ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
            background: active ? 'var(--color-accent-dim)' : 'var(--color-elevated)',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all var(--dur-enter) var(--ease)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: active ? 'scale(1.12)' : 'scale(1)',
          }}
        >
          {emoji}
        </button>
      );
    })}
  </div>
);

/* ── Nordic alert banner ─────────────────────────────── */
const NordicAlert = ({ type, title, detail, action }) => {
  const isCrit = type === 'critical';
  return (
    <div style={{
      background: isCrit ? 'rgba(201,64,64,0.07)' : 'var(--color-sage-bg)',
      border: `1px solid ${isCrit ? 'rgba(201,64,64,0.18)' : 'rgba(0,0,0,0.05)'}`,
      borderRadius: 'var(--r-card)',
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    }}>
      <div style={{
        width: '34px', height: '34px',
        borderRadius: '50%',
        background: isCrit ? 'rgba(201,64,64,0.12)' : 'rgba(45,74,53,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        fontSize: '15px',
      }}>
        {isCrit ? '⚠' : '⏰'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          font: '500 13px/1 var(--font-sans)',
          color: isCrit ? 'var(--color-alert-red)' : 'var(--color-sage-text)',
        }}>
          {title}
        </div>
        {detail && (
          <div style={{
            font: '400 12px/1.5 var(--font-sans)',
            color: isCrit ? 'var(--color-alert-red)' : 'var(--color-sage-text)',
            marginTop: '3px',
            opacity: 0.8,
          }}>
            {detail}
          </div>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            font: '400 13px/1 var(--font-sans)',
            color: 'var(--color-text-1)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '20px',
            padding: '8px 16px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            transition: 'background var(--dur-enter) var(--ease)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-elevated)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-surface)'}
        >
          {action.label} →
        </button>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   Overview component
═══════════════════════════════════════════════════════ */
const Overview = ({ user }) => {
  const { session } = useAuth();
  const { loading: statsLoading, todayLog, computed: { gymDaysThisWeek } } = useDailyStats(user);

  const [tasks, setTasks]         = useState([]);
  const [habits, setHabits]       = useState([]);
  const [netWorth, setNetWorth]   = useState(null);
  const [dsaData, setDsaData]     = useState({ percent: null, solved: 0, total: 150 });
  const [mood, setMood]           = useState(todayLog?.mood || null);
  const [alerts, setAlerts]       = useState([]);
  const [streak, setStreak]       = useState({ current: 0, best: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  const daysToPlacement = getDaysToPlacement();
  const doy = dayOfYear();
  const phrase    = PHRASES[doy % PHRASES.length];
  const intention = INTENTIONS[doy % INTENTIONS.length];
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  /* ── Load data ────────────────────────────────────── */
  useEffect(() => {
    if (!session) return;
    const loadData = async () => {
      try {
        const todayStr = new Date().toLocaleDateString('en-CA');
        const userId = session?.user?.id;

        const [taskRes, habitRes, habitLogRes, nwRes, dsaRes, xpRes] = await Promise.all([
          supabase.from('tasks').select('id, title, due_date, completed, source')
            .eq('user_id', userId).gte('due_date', todayStr).lte('due_date', todayStr)
            .order('completed', { ascending: true }).limit(10),
          supabase.from('habits').select('id, name, active')
            .eq('user_id', userId).eq('active', true).limit(8),
          supabase.from('habit_logs').select('habit_id, completed')
            .eq('user_id', userId).eq('date', todayStr),
          supabase.from('net_worth_snapshots').select('total_inr')
            .eq('user_id', userId).order('snapshot_date', { ascending: false }).limit(1).single(),
          supabase.from('dsa_problems').select('id', { count: 'exact' }).eq('user_id', userId),
          supabase.from('user_xp').select('longest_streak, clean_streak')
            .eq('user_id', userId).single(),
        ]);

        const logMap = {};
        (habitLogRes.data || []).forEach(l => { logMap[l.habit_id] = l.completed; });
        const solved = (dsaRes.data || []).length;

        setTasks(taskRes.data || []);
        setHabits((habitRes.data || []).map(h => ({ ...h, completed: logMap[h.id] || false })));
        setNetWorth(nwRes.data?.total_inr ?? null);
        setDsaData({ percent: Math.round((solved / 150) * 100), solved, total: 150 });
        setStreak({
          current: xpRes.data?.clean_streak || 0,
          best:    xpRes.data?.longest_streak || 0,
        });

        const newAlerts = [];
        if (todayLog) {
          if ((todayLog.sleep_hours || 0) > 0 && todayLog.sleep_hours < 6) {
            newAlerts.push({ type: 'critical', title: `Sleep deficit: ${(6 - todayLog.sleep_hours).toFixed(1)}h below minimum`, detail: 'Cognitive performance impaired today.' });
          }
          if ((gymDaysThisWeek || 0) === 0 && new Date().getDay() >= 3) {
            newAlerts.push({ type: 'info', title: 'No gym sessions this week', detail: `${7 - new Date().getDay()} days left — a 30-min walk would keep the streak alive.` });
          }
        }
        if (daysToPlacement <= 14) {
          newAlerts.push({ type: 'critical', title: `${daysToPlacement} days to placement season`, detail: 'Final preparation window.' });
        }
        setAlerts(newAlerts);

      } catch (err) {
        console.error('Overview load error:', err);
      } finally {
        setDataLoading(false);
      }
    };
    loadData();
  }, [session, todayLog, gymDaysThisWeek, daysToPlacement]);

  /* ── Handlers ─────────────────────────────────────── */
  const handleTaskToggle = async (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    try { await api.patch(`/tasks/${id}`, { completed: true }); }
    catch (err) { console.error('Task toggle failed:', err); }
  };

  const handleHabitToggle = async (id) => {
    const habit = habits.find(h => h.id === id);
    const newDone = !habit?.completed;
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: newDone } : h));
    try {
      const todayStr = new Date().toLocaleDateString('en-CA');
      await supabase.from('habit_logs').upsert(
        { user_id: session.user.id, habit_id: id, date: todayStr, completed: newDone },
        { onConflict: 'user_id,habit_id,date' }
      );
    } catch (err) { console.error('Habit toggle failed:', err); }
  };

  const handleMoodChange = async (val) => {
    setMood(val);
    try {
      const todayStr = new Date().toLocaleDateString('en-CA');
      await api.post('/daily-logs', { date: todayStr, mood: val });
    } catch (err) { console.error('Mood save failed:', err); }
  };

  /* ── Derived ──────────────────────────────────────── */
  const loading = statsLoading || dataLoading;
  const s       = todayLog || {};
  const score   = calcScore(s);
  const balance = calcBalance(s, netWorth);
  const totalBalance = balance.body + balance.mind + balance.craft + balance.wealth;
  const archetype = getArchetype(score);

  const pendingTasks   = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const sleepHours     = s.sleep_hours || 0;

  /* Sync mood from todayLog — only fires when mood is null (not yet selected) */
  useEffect(() => {
    if (todayLog?.mood && mood === null) setMood(todayLog.mood);
  }, [todayLog, mood]);

  /* ── Skeleton ─────────────────────────────────────── */
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <Sk h="14px" w="120px" r="4px" />
          <div style={{ marginTop: '8px' }}><Sk h="52px" w="340px" r="6px" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: '12px' }}>
          <Sk h="240px" r="14px" />
          <Sk h="112px" r="14px" />
          <Sk h="112px" r="14px" />
          <Sk h="112px" r="14px" />
          <Sk h="112px" r="14px" />
        </div>
        <Sk h="64px" r="14px" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <Sk h="240px" r="14px" />
          <Sk h="240px" r="14px" />
        </div>
      </div>
    );
  }

  /* ── Render ───────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Greeting ──────────────────────────────────────── */}
      <div style={{ paddingBottom: '4px' }}>
        <p style={{
          font: '400 13px/1 var(--font-sans)',
          color: 'var(--color-text-2)',
          marginBottom: '8px',
        }}>
          {greeting}.
        </p>
        <h1 style={{
          font: `500 clamp(32px, 3.8vw, 52px)/1.1 var(--font-sans)`,
          color: 'var(--color-text-1)',
          letterSpacing: '-0.02em',
        }}>
          A quiet day to{' '}
          <span style={{ color: 'var(--color-accent)' }}>{phrase}</span>
        </h1>
      </div>

      {/* ── Metric grid ───────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr 1fr',
        gridTemplateRows: 'auto auto',
        gap: '12px',
      }}>

        {/* Daily Balance — spans 2 rows */}
        <Card style={{ gridRow: 'span 2', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div>
            <Label>Daily Balance</Label>
            {/* Donut with center text */}
            <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '8px' }}>
              <DonutChart value={totalBalance} max={100} />
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ font: '300 32px/1 var(--font-sans)', color: 'var(--color-text-1)' }}>
                  {totalBalance}
                </span>
                <span style={{ font: '400 11px/1 var(--font-sans)', color: 'var(--color-text-3)', marginTop: '4px' }}>
                  of 100
                </span>
              </div>
            </div>
            <span style={{ font: '400 10px/1 var(--font-mono)', color: 'var(--color-text-3)', display: 'block' }}>
              refreshes at midnight
            </span>
          </div>

          {/* Category bars */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '28px' }}>
            <CategoryBar label="Body"   value={balance.body}   max={30} />
            <CategoryBar label="Mind"   value={balance.mind}   max={30} />
            <CategoryBar label="Craft"  value={balance.craft}  max={25} />
            <CategoryBar label="Wealth" value={balance.wealth} max={15} />
          </div>
        </Card>

        {/* Sleep */}
        <Card>
          <Label>Sleep</Label>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ font: '300 36px/1 var(--font-sans)', color: 'var(--color-text-1)' }}>
              {sleepHours.toFixed(1)}
            </span>
            <span style={{ font: '300 18px/1 var(--font-sans)', color: 'var(--color-text-2)' }}>h</span>
          </div>
          <span style={{ font: '400 11px/1 var(--font-sans)', color: 'var(--color-text-3)', display: 'block', marginTop: '4px' }}>
            Target 8h
          </span>
          <SleepSquares hours={sleepHours} />
        </Card>

        {/* Mood */}
        <Card>
          <Label>Mood</Label>
          <MoodPicker value={mood} onChange={handleMoodChange} />
          <span style={{
            font: '400 11px/1 var(--font-sans)',
            color: 'var(--color-text-3)',
            display: 'block',
            marginTop: '10px',
          }}>
            {mood ? `Logged: ${MOODS[mood - 1]?.label}` : 'Not logged'}
          </span>
        </Card>

        {/* Net Worth */}
        <Card>
          <Label>Net Worth</Label>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ font: '300 24px/1 var(--font-sans)', color: 'var(--color-text-2)' }}>₹</span>
            <span style={{ font: '300 32px/1 var(--font-sans)', color: 'var(--color-text-1)' }}>
              {netWorth !== null ? new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.abs(netWorth)) : '—'}
            </span>
          </div>
          <span style={{
            font: '400 11px/1 var(--font-sans)',
            color: netWorth !== null && netWorth < 0 ? 'var(--color-alert-red)' : 'var(--color-text-3)',
            display: 'block',
            marginTop: '6px',
          }}>
            {netWorth !== null ? (netWorth >= 0 ? 'Positive balance' : 'Negative') : 'No data yet'}
          </span>
        </Card>

        {/* Streak */}
        <Card>
          <Label>Streak</Label>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ font: '300 40px/1 var(--font-sans)', color: 'var(--color-text-1)' }}>
              {streak.current}
            </span>
            <span style={{ font: '300 16px/1 var(--font-sans)', color: 'var(--color-text-2)' }}>days</span>
          </div>
          <span style={{ font: '400 11px/1 var(--font-sans)', color: 'var(--color-text-3)', display: 'block', marginTop: '6px' }}>
            Best: {streak.best}
          </span>
        </Card>
      </div>

      {/* ── Alert banners ──────────────────────────────────── */}
      {alerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {alerts.map((a, i) => (
            <NordicAlert key={i} type={a.type} title={a.title} detail={a.detail} action={a.action} />
          ))}
        </div>
      )}

      {/* ── Tasks + Intention ──────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        alignItems: 'start',
      }}>

        {/* Tasks */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <span style={{
              font: '500 11px/1 var(--font-mono)',
              color: 'var(--color-text-2)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Today · {completedTasks.length} of {tasks.length}
            </span>
          </div>

          {tasks.length === 0 ? (
            <div style={{
              padding: '40px 0',
              textAlign: 'center',
              font: '400 13px/1 var(--font-sans)',
              color: 'var(--color-text-3)',
            }}>
              No tasks for today
            </div>
          ) : (
            <>
              {pendingTasks.map(task => (
                <TaskRow key={task.id} id={task.id} title={task.title}
                  completed={false} source={task.source} dueTime={task.due_time}
                  onToggle={handleTaskToggle} />
              ))}
              {completedTasks.map(task => (
                <TaskRow key={task.id} id={task.id} title={task.title}
                  completed={true} source={task.source} dueTime={task.due_time}
                  onToggle={handleTaskToggle} />
              ))}
            </>
          )}
        </div>

        {/* Today's Intention — dark card */}
        <div style={{
          background: 'var(--color-dark-card)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 'var(--r-card)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '200px',
        }}>
          <span style={{
            font: '500 10px/1 var(--font-mono)',
            color: 'var(--color-sage-text)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            opacity: 0.85,
          }}>
            Today's Intention
          </span>

          <h2 style={{
            font: `500 clamp(20px,2vw,28px)/1.25 var(--font-sans)`,
            color: '#F0EBE1',
            marginTop: '16px',
            letterSpacing: '-0.01em',
          }}>
            {intention}
          </h2>

          <p style={{
            font: '400 13px/1.6 var(--font-sans)',
            color: 'rgba(240,235,225,0.55)',
            marginTop: 'auto',
            paddingTop: '20px',
          }}>
            You are{' '}
            <strong style={{ color: '#F0EBE1', fontWeight: 500 }}>{archetype}</strong>
            {' '}— small gains compound.{' '}
            {dsaData.solved > 0 && `${dsaData.solved}/${dsaData.total} DSA. `}
            {daysToPlacement > 0 ? `${daysToPlacement} days to placements.` : 'Placement season is here.'}
          </p>
        </div>
      </div>

      {/* ── Habits ─────────────────────────────────────────── */}
      {habits.length > 0 && (
        <div style={{ marginTop: '4px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 'var(--space-3)',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: 'var(--space-4)',
          }}>
            <span style={{ font: '500 10px/1 var(--font-mono)', color: 'var(--color-text-2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Habits
            </span>
            <span style={{ font: '400 12px/1 var(--font-sans)', color: 'var(--color-text-3)' }}>
              {habits.filter(h => h.completed).length}/{habits.length} today
            </span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-5)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
            {habits.map(habit => (
              <HabitCircle key={habit.id} id={habit.id} label={habit.name}
                completed={habit.completed} onToggle={handleHabitToggle} />
            ))}
          </div>
        </div>
      )}

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .nc-grid { grid-template-columns: 1fr 1fr !important; }
          .nc-tasks { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .nc-grid { grid-template-columns: 1fr !important; }
          .nc-tasks { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Overview;
