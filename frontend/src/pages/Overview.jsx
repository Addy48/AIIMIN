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

const ProgressBar = ({ value, max = 100, color = 'var(--color-accent)', isDark }) => (
  <div style={{
    height: '2px',
    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    borderRadius: '9999px',
    overflow: 'hidden',
    marginTop: '8px',
  }}>
    <div style={{
      height: '100%',
      width: `${Math.min((value / max) * 100, 100)}%`,
      background: color,
      borderRadius: '9999px',
      transition: 'width 400ms cubic-bezier(0.16,1,0.3,1)',
    }} />
  </div>
);

const MetricCard = ({ label, value, sub, icon, progress, progressColor, isDark, style = {} }) => (
  <div style={{
    background: 'transparent',
    padding: '24px 0',
    ...style,
  }}>
    <div style={{
      fontSize: '11px',
      fontWeight: 600,
      color: 'var(--color-text-3)',
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      marginBottom: '12px',
      fontFamily: 'var(--font-sans)',
    }}>{label}</div>
    <div style={{
      fontSize: '42px',
      fontWeight: 700,
      color: 'var(--color-text-1)',
      lineHeight: 1,
      fontFamily: 'var(--font-mono)',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'baseline',
      gap: '8px'
    }}>
      {value ?? '—'}
      {icon && <span style={{ fontSize: '16px', opacity: 0.5 }}>{icon}</span>}
    </div>
    {sub && (
      <div style={{
        fontSize: '12px',
        color: 'var(--color-text-3)',
        fontFamily: 'var(--font-sans)',
        opacity: 0.8
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
    gap: '12px',
    padding: '12px 0',
    borderBottom: `1px solid ${isDark ? 'var(--color-border)' : 'var(--color-border)'}`,
  }}>
    <button
      onClick={() => onToggle(task.id)}
      style={{
        width: '18px', height: '18px',
        borderRadius: '4px',
        border: `1px solid ${task.completed ? 'var(--color-accent)' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)')}`,
        background: task.completed ? 'var(--color-accent)' : 'transparent',
        cursor: 'pointer',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 150ms ease',
      }}
    >
      {task.completed && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontSize: '14px',
        color: task.completed ? 'var(--color-text-3)' : 'var(--color-text-1)',
        textDecoration: task.completed ? 'line-through' : 'none',
        fontFamily: 'var(--font-sans)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>{task.title}</div>
    </div>
    {task.source && (
      <span style={{
        fontSize: '10px',
        fontWeight: 500,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: 'var(--color-text-3)',
        fontFamily: 'var(--font-sans)',
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
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* ── Greeting ─────────────────────────────────── */}
      <div>
        <div style={{
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--color-text-3)',
          fontFamily: 'var(--font-sans)',
          marginBottom: '6px',
        }}>
          {greeting} · {weekday} {monthName} {dayNum} · Day {streak}
        </div>
        <h1 style={{
          font: 'var(--text-hero)',
          color: 'var(--color-text-1)',
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          Hey, {firstName}.
        </h1>
      </div>

      {/* ── Hero Metric Row (4 tiles) ─────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '40px',
        padding: '20px 0',
        borderBottom: `1px solid var(--color-border)`,
        marginBottom: '20px'
      }}>
        <MetricCard
          label="Focus / Sleep"
          value={sleepHours > 0 ? `${Math.floor(sleepHours)}h` : '—'}
          sub={sleepHours >= 7 ? 'Optimal' : 'Deficit'}
          icon="🌙"
          progress={sleepHours}
          progressColor={sleepHours >= 7 ? 'var(--color-accent)' : 'var(--color-warning)'}
          isDark={isDark}
        />
        <MetricCard
          label="Vitality / Steps"
          value={steps ? `${(steps / 1000).toFixed(1)}k` : '—'}
          sub={`${steps.toLocaleString()} / 10k`}
          icon="👟"
          progress={steps}
          progressColor="var(--color-accent)"
          isDark={isDark}
        />
        <MetricCard
          label="Hydration"
          value={water ? `${water}L` : '—'}
          sub={`Target 3.0L`}
          icon="💧"
          progress={water}
          progressColor="#3B82F6"
          isDark={isDark}
        />
        <MetricCard
          label="Momentum"
          value={`${streak}d`}
          sub="Current Streak"
          icon="🔥"
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

        {/* LEFT: Tasks */}
        <div style={{
          background: cardBg,
          border: cardBorder,
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          {/* Card header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: cardBorder,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-text-3)',
              fontFamily: 'var(--font-sans)',
            }}>Today · {pendingTasks.length} intentions</div>
            <div style={{
              fontSize: '11px',
              color: 'var(--color-text-3)',
              fontFamily: 'var(--font-sans)',
            }}>
              {completedTasks.length}/{tasks.length} done
            </div>
          </div>

          {/* Task list */}
          <div style={{ padding: '0 20px' }}>
            {tasks.length === 0 ? (
              <div style={{
                padding: '40px 0',
                textAlign: 'center',
                color: 'var(--color-text-3)',
                fontSize: '14px',
                fontFamily: 'var(--font-sans)',
              }}>No tasks for today</div>
            ) : (
              <>
                {pendingTasks.map(task => (
                  <TaskRow key={task.id} task={task} onToggle={handleTaskToggle} isDark={isDark} />
                ))}
                {completedTasks.map(task => (
                  <TaskRow key={task.id} task={task} onToggle={handleTaskToggle} isDark={isDark} />
                ))}
              </>
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
