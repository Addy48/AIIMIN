import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDailyStats } from '../hooks/useDailyStats';
import { useThemeContext } from '../context/ThemeContext';
import { supabase } from '../utils/supabase';
import api from '../utils/api';

/*
 * Overview (Today) — matching the reference design.
 * Greeting → metric tiles → task list (left) + morning note (right)
 */

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

const getDaysToPlacement = () => {
  const placementStart = new Date('2026-07-04');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((placementStart - today) / (1000 * 60 * 60 * 24)));
};

const DayProgress = ({ isDark }) => {
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const totalSeconds = 24 * 60 * 60;
      const elapsedSeconds = (now - startOfDay) / 1000;
      const pct = (elapsedSeconds / totalSeconds) * 100;
      setProgress(pct);

      const hoursLeft = 23 - now.getHours();
      const minsLeft = 59 - now.getMinutes();
      setTimeRemaining(`${hoursLeft}h ${minsLeft}m remaining`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Day Progress · {progress.toFixed(1)}%
        </div>
        <div style={{ fontSize: '10px', color: 'var(--color-text-3)', fontFamily: 'var(--font-mono)', opacity: 0.7 }}>
          {timeRemaining}
        </div>
      </div>
      <div style={{ height: '4px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ height: '100%', background: 'var(--color-accent)', borderRadius: '2px' }}
        />
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, sub, icon, progress, progressColor, isDark, style = {} }) => (
  <div style={{
    background: 'transparent',
    padding: '0',
    ...style,
  }}>
    <div style={{
      fontSize: '10px',
      fontWeight: 700,
      color: 'var(--color-text-3)',
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      marginBottom: '16px',
      fontFamily: 'var(--font-sans)',
    }}>{label}</div>
    <div style={{
      fontSize: '36px',
      fontWeight: 500,
      color: 'var(--color-text-1)',
      lineHeight: 1,
      fontFamily: 'var(--font-serif)',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'baseline',
      gap: '8px'
    }}>
      {value ?? '—'}
    </div>
    {sub && (
      <div style={{
        fontSize: '11px',
        color: 'var(--color-text-3)',
        fontFamily: 'var(--font-sans)',
        opacity: 0.6,
        fontWeight: 500
      }}>{sub}</div>
    )}
    {progress !== undefined && (
      <div style={{ marginTop: '16px' }}>
        <ProgressBar value={progress} color={progressColor} isDark={isDark} />
      </div>
    )}
  </div>
);

const TaskRow = ({ task, onToggle, isDark }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 0',
    borderBottom: `1px solid var(--color-border)`,
  }}>
    <button
      onClick={() => onToggle(task.id)}
      style={{
        width: '20px', height: '20px',
        borderRadius: '6px',
        border: `1.5px solid ${task.completed ? 'var(--color-accent)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
        background: task.completed ? 'var(--color-accent)' : 'transparent',
        cursor: 'pointer',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {task.completed && (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontSize: '15px',
        color: task.completed ? 'var(--color-text-3)' : 'var(--color-text-1)',
        textDecoration: task.completed ? 'line-through' : 'none',
        fontFamily: 'var(--font-sans)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontWeight: task.completed ? 400 : 500,
      }}>{task.title}</div>
    </div>
    {task.source && (
      <span style={{
        fontSize: '9px',
        fontWeight: 800,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--color-text-3)',
        fontFamily: 'var(--font-sans)',
        opacity: 0.5
      }}>{task.source}</span>
    )}
  </div>
);

const Overview = ({ user }) => {
  const { session } = useAuth();
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const { loading: statsLoading, todayLog = {}, computed = {} } = useDailyStats(user) || {};
  const { gymDaysThisWeek = 0 } = computed || {};

  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [netWorth, setNetWorth] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [insight, setInsight] = useState(null);

  const daysToPlacement = getDaysToPlacement();

  useEffect(() => {
    if (!session) return;
    const loadData = async () => {
      try {
        const todayStr = new Date().toLocaleDateString('en-CA');
        const userId = session?.user?.id;

        const [taskRes, habitRes, habitLogRes, accRes, assetRes, insightRes] = await Promise.all([
          supabase.from('tasks').select('id, title, due_date, completed, source')
            .eq('user_id', userId).gte('due_date', todayStr).lte('due_date', todayStr)
            .order('completed', { ascending: true }).limit(10),
          supabase.from('habits').select('id, name, active')
            .eq('user_id', userId).eq('active', true).limit(8),
          supabase.from('habit_logs').select('habit_id, completed')
            .eq('user_id', userId).eq('date', todayStr),
          supabase.from('accounts').select('balance').eq('user_id', userId),
          supabase.from('wealth_assets').select('value').eq('user_id', userId),
          supabase.from('lab_correlations').select('signal_a, signal_b, rho')
            .eq('user_id', userId).order('rho', { ascending: false }).limit(1),
        ]);

        const logMap = {};
        (habitLogRes.data || []).forEach(l => { logMap[l.habit_id] = l.completed; });

        const totalAccounts = (accRes.data || []).reduce((s, a) => s + (Number(a.balance) || 0), 0);
        const totalAssets = (assetRes.data || []).reduce((s, a) => s + (Number(a.value) || 0), 0);
        const nw = totalAccounts + totalAssets;

        if (nw === 0) {
          const { data: nwData } = await supabase.from('net_worth_snapshots').select('total_inr')
            .eq('user_id', userId).order('snapshot_date', { ascending: false }).limit(1).single();
          setNetWorth(nwData?.total_inr ?? 0);
        } else {
          setNetWorth(nw);
        }

        setTasks(taskRes.data || []);
        setHabits((habitRes.data || []).map(h => ({ ...h, completed: logMap[h.id] || false })));
        setInsight(insightRes.data?.[0] || null);
      } catch (err) {
        console.error('Overview load error:', err);
      } finally {
        setDataLoading(false);
      }
    };
    loadData();
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
      await supabase.from('habit_logs').upsert({
        user_id: session.user.id, habit_id: id, date: todayStr, completed: newDone,
      }, { onConflict: 'user_id,habit_id,date' });
    } catch {}
  };

  const loading = statsLoading || dataLoading;
  const s = todayLog || {};
  const score = React.useMemo(() => calcScore(s), [s]);
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'you';

  const sleepHours = typeof s?.sleep_hours === 'number' ? s.sleep_hours : 0;
  const steps = s?.steps || 0;
  const water = s?.water_bottles || 0;
  const streak = 112; // TODO: pull from DB

  // Date / time
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dayNum = now.getDate();
  const monthName = now.toLocaleDateString('en-US', { month: 'long' });
  const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Focus, ' : hour < 17 ? 'Execute, ' : 'Review, ';

  const formatINR = (v) => {
    if (!v && v !== 0) return '—';
    if (Math.abs(v) >= 1e7) return `₹${(v / 1e7).toFixed(1)}Cr`;
    if (Math.abs(v) >= 1e5) return `₹${(v / 1e5).toFixed(0)}L`;
    return `₹${Math.round(v).toLocaleString('en-IN')}`;
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const cardBg = isDark ? 'var(--color-surface)' : '#FFFFFF';
  const cardBorder = `1px solid var(--color-border)`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── Day Progress ─────────────────────────────── */}
      <DayProgress isDark={isDark} />

      {/* ── Greeting ─────────────────────────────────── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-text-3)',
          fontFamily: 'var(--font-sans)',
          marginBottom: '12px',
          opacity: 0.6
        }}>
          {weekday} · {monthName} {dayNum} · Day {streak}
        </div>
        <h1 style={{
          fontSize: '56px',
          fontWeight: 500,
          color: 'var(--color-text-1)',
          margin: 0,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          fontFamily: 'var(--font-serif)',
        }}>
          {greeting}{firstName}.
        </h1>
      </div>

      {/* ── Hero Metric Row (4 tiles) ─────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '40px',
        padding: '40px 0',
        borderBottom: `1px solid var(--color-border)`,
        marginBottom: '20px'
      }}>
        <MetricCard
          label="Sleep"
          value={sleepHours > 0 ? `${Math.floor(sleepHours)}h` : '—'}
          sub={sleepHours >= 7 ? 'RESTORATIVE' : 'DEFICIT'}
          progress={sleepHours}
          progressColor={sleepHours >= 7 ? 'var(--color-accent)' : 'var(--color-warning)'}
          isDark={isDark}
        />
        <MetricCard
          label="Vitality"
          value={steps ? `${(steps / 1000).toFixed(1)}k` : '—'}
          sub={`${steps.toLocaleString()} STEPS`}
          progress={steps}
          progressColor="var(--color-accent)"
          isDark={isDark}
        />
        <MetricCard
          label="Hydration"
          value={water ? `${water}L` : '—'}
          sub={`3.0L TARGET`}
          progress={water}
          progressColor="#3B82F6"
          isDark={isDark}
        />
        <MetricCard
          label="Momentum"
          value={`${streak}d`}
          sub="ACTIVE STREAK"
          isDark={isDark}
        />
      </div>

      {/* ── Two-column layout ─────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '20px',
        alignItems: 'start',
      }}>

        {/* LEFT: Intentions (Tasks) */}
        <div>
          <div style={{
            padding: '0 0 20px 0',
            borderBottom: `1px solid var(--color-border)`,
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-2)',
              fontFamily: 'var(--font-sans)',
            }}>Intentions</div>
            <div style={{
              fontSize: '11px',
              color: 'var(--color-text-3)',
              fontFamily: 'var(--font-mono)',
            }}>
              {completedTasks.length} / {tasks.length}
            </div>
          </div>

          <div style={{ padding: '0' }}>
            {tasks.length === 0 ? (
              <div style={{
                padding: '40px 0',
                color: 'var(--color-text-3)',
                fontSize: '14px',
                fontFamily: 'var(--font-sans)',
                fontStyle: 'italic'
              }}>No intentions set for today.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {pendingTasks.map(task => (
                  <TaskRow key={task.id} task={task} onToggle={handleTaskToggle} isDark={isDark} />
                ))}
                {completedTasks.length > 0 && (
                  <div style={{ marginTop: '20px', opacity: 0.4 }}>
                    {completedTasks.map(task => (
                      <TaskRow key={task.id} task={task} onToggle={handleTaskToggle} isDark={isDark} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Morning note + Insight */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Morning note */}
          <div style={{
            background: cardBg,
            border: cardBorder,
            borderRadius: '8px',
            padding: '20px',
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-3)',
              fontFamily: 'var(--font-sans)',
              marginBottom: '12px',
            }}>Morning Note</div>
            {s.journal_entry ? (
              <>
                <div style={{
                  fontSize: '14px',
                  fontStyle: 'italic',
                  color: 'var(--color-text-1)',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-sans)',
                }}>"{s.journal_entry}"</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-3)', marginTop: '8px', fontFamily: 'var(--font-sans)' }}>
                  from your journal
                </div>
              </>
            ) : (
              <div style={{ fontSize: '14px', color: 'var(--color-text-3)', fontStyle: 'italic', fontFamily: 'var(--font-sans)' }}>
                No note logged yet.
              </div>
            )}
          </div>

          {/* Insight */}
          <div style={{
            background: isDark ? 'rgba(34,197,94,0.04)' : 'rgba(30,92,58,0.04)',
            border: `1px solid ${isDark ? 'rgba(34,197,94,0.12)' : 'rgba(30,92,58,0.12)'}`,
            borderRadius: '8px',
            padding: '20px',
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isDark ? '#22C55E' : 'var(--color-accent)',
              fontFamily: 'var(--font-sans)',
              marginBottom: '8px',
            }}>
              New Pattern · {insight?.rho?.toFixed(2) ?? '0.72'} corr
            </div>
            <div style={{
              fontSize: '13px',
              color: 'var(--color-text-1)',
              lineHeight: 1.55,
              fontFamily: 'var(--font-sans)',
            }}>
              {insight
                ? `${insight.signal_a} correlates with ${insight.signal_b}`
                : 'Sleep drops 20% on nights you log RC after 22:30.'}
            </div>
            <button style={{
              marginTop: '12px',
              fontSize: '11px',
              fontWeight: 500,
              color: isDark ? '#22C55E' : 'var(--color-accent)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}>View Insights →</button>
          </div>

          {/* Habits */}
          {habits.length > 0 && (
            <div style={{
              background: cardBg,
              border: cardBorder,
              borderRadius: '8px',
              padding: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-3)',
                  fontFamily: 'var(--font-sans)',
                }}>Habits</div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-3)', fontFamily: 'var(--font-sans)' }}>
                  {habits.filter(h => h.completed).length}/{habits.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {habits.map(habit => (
                  <button
                    key={habit.id}
                    onClick={() => handleHabitToggle(habit.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: `1px solid ${habit.completed ? 'var(--color-accent)' : (isDark ? 'var(--color-border)' : 'var(--color-border)')}`,
                      background: habit.completed
                        ? (isDark ? 'rgba(34,197,94,0.1)' : 'rgba(30,92,58,0.08)')
                        : 'transparent',
                      color: habit.completed ? 'var(--color-accent)' : 'var(--color-text-2)',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {habit.completed ? '✓ ' : ''}{habit.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
