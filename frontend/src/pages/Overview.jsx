import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDailyStats } from '../hooks/useDailyStats';
import HeroMetricCard from '../components/ui/HeroMetricCard';
import MetricTile from '../components/ui/MetricTile';
import TaskRow from '../components/ui/TaskRow';
import HabitCircle from '../components/ui/HabitCircle';
import StatusAlert from '../components/ui/StatusAlert';
import PlacementStrip from '../components/ui/PlacementStrip';
import MoodSelector from '../components/ui/MoodSelector';
import { supabase } from '../utils/supabase';
import api from '../utils/api';

/*
 * Overview (Today) — Primary dashboard at /overview.
 *
 * Layout:
 *   [Greeting + date]
 *   [Alerts — if any]
 *   [PlacementStrip]
 *   [MoodSelector]
 *   [3-col hero row: Daily Score | Sleep | Net Worth]
 *   [2-col: Tasks (left) | Metric Tiles 2×2 (right)]
 *   [Habits row]
 *
 * Cream color count: Score (1) + Sleep (2) + Net Worth (3) = 3 max. ✓
 */

/* ── Daily score calculation ─────────────────────────── */
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

/* ── Placement days remaining ────────────────────────── */
const getDaysToPlacement = () => {
  const placementStart = new Date('2026-07-04');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((placementStart - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
};

/* ── Skeleton ─────────────────────────────────────────── */
const Skeleton = ({ h, style = {} }) => (
  <div className="skeleton" style={{ height: h, ...style }} />
);

const Overview = ({ user }) => {
  const { session } = useAuth();
  const { loading: statsLoading, todayLog = {}, computed = {} } = useDailyStats(user) || {};
  const { gymDaysThisWeek = 0 } = computed || {};

  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [netWorth, setNetWorth] = useState(null);
  const [dsaData, setDsaData] = useState({ percent: null, solved: 0, total: 150 });
  const [mood, setMood] = useState(todayLog?.mood || null);
  const [alerts, setAlerts] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const daysToPlacement = getDaysToPlacement();

  /* ── Load tasks, habits, net worth ─────────────── */
  useEffect(() => {
    if (!session) return;

    const loadData = async () => {
      try {
        const todayStr = new Date().toLocaleDateString('en-CA');
        const userId = session?.user?.id;

        // Tasks
        const { data: taskData } = await supabase
          .from('tasks')
          .select('id, title, due_date, completed, source')
          .eq('user_id', userId)
          .gte('due_date', todayStr)
          .lte('due_date', todayStr)
          .order('completed', { ascending: true })
          .limit(10);

        // Habits
        const { data: habitData } = await supabase
          .from('habits')
          .select('id, name, active')
          .eq('user_id', userId)
          .eq('active', true)
          .limit(8);

        const { data: habitLogs } = await supabase
          .from('habit_logs')
          .select('habit_id, completed')
          .eq('user_id', userId)
          .eq('date', todayStr);

        const logMap = {};
        (habitLogs || []).forEach(l => { logMap[l.habit_id] = l.completed; });

        // Net worth calculation (Sum of accounts and wealth assets)
        const [accRes, assetRes] = await Promise.all([
          supabase.from('accounts').select('balance').eq('user_id', userId),
          supabase.from('wealth_assets').select('value').eq('user_id', userId)
        ]);

        const totalAccounts = (accRes.data || []).reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
        const totalAssets = (assetRes.data || []).reduce((sum, a) => sum + (Number(a.value) || 0), 0);
        const calculatedNetWorth = totalAccounts + totalAssets;

        // Fallback to snapshot if tables are empty
        if (calculatedNetWorth === 0) {
          const { data: nwData } = await supabase
            .from('net_worth_snapshots')
            .select('total_inr')
            .eq('user_id', userId)
            .order('snapshot_date', { ascending: false })
            .limit(1)
            .single();
          setNetWorth(nwData?.total_inr ?? 0);
        } else {
          setNetWorth(calculatedNetWorth);
        }

        // DSA problems solved
        const { data: dsaProblems } = await supabase
          .from('dsa_problems')
          .select('id', { count: 'exact' })
          .eq('user_id', userId);

        const solved = (dsaProblems || []).length;

        setTasks(taskData || []);
        setHabits((habitData || []).map(h => ({ ...h, completed: logMap[h.id] || false })));
        setDsaData({ percent: Math.round((solved / 150) * 100), solved, total: 150 });

        // Build alerts
        const newAlerts = [];
        if (todayLog) {
          if ((todayLog.sleep_hours || 0) > 0 && todayLog.sleep_hours < 6) {
            newAlerts.push({ type: 'critical', title: `Sleep deficit: ${(6 - todayLog.sleep_hours).toFixed(1)}h below minimum`, detail: 'Cognitive performance impaired today.' });
          }
          if ((gymDaysThisWeek || 0) === 0 && new Date().getDay() >= 3) {
            newAlerts.push({ type: 'info', title: 'No gym sessions this week', detail: `${7 - new Date().getDay()} days left in the week.` });
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

  /* ── Handlers ─────────────────────────────────── */
  const handleTaskToggle = async (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    try {
      await api.patch(`/tasks/${id}`, { completed: true });
    } catch (err) {
      console.error('Task toggle failed:', err);
    }
  };

  const handleHabitToggle = async (id) => {
    const habit = habits.find(h => h.id === id);
    const newDone = !habit?.completed;
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: newDone } : h));
    try {
      const todayStr = new Date().toLocaleDateString('en-CA');
      await supabase.from('habit_logs').upsert({
        user_id: session.user.id,
        habit_id: id,
        date: todayStr,
        completed: newDone,
      }, { onConflict: 'user_id,habit_id,date' });
    } catch (err) {
      console.error('Habit toggle failed:', err);
    }
  };

  const handleMoodChange = async (val) => {
    setMood(val);
    try {
      const todayStr = new Date().toLocaleDateString('en-CA');
      await api.post('/daily-logs', { date: todayStr, mood: val });
    } catch (err) {
      console.error('Mood save failed:', err);
    }
  };

  /* ── Derived values ───────────────────────────── */
  const loading = statsLoading || dataLoading;
  const s = todayLog || {};
  const score = React.useMemo(() => calcScore(s), [s]);
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Adi';

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const sleepHours = typeof s?.sleep_hours === 'number' ? s.sleep_hours : 0;
  const sleepContext = sleepHours >= 7
    ? 'Well rested'
    : sleepHours > 0
      ? `${(7 - sleepHours).toFixed(1)}h deficit`
      : 'Not logged';

  /* ── Skeleton state ───────────────────────────── */
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Skeleton h="40px" style={{ width: '300px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <Skeleton h="140px" />
          <Skeleton h="140px" />
          <Skeleton h="140px" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
          <Skeleton h="400px" />
          <Skeleton h="400px" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* ── Greeting & Command Header ─────────────── */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end',
        padding: '0 0 40px',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div className="vercel-badge">Command Center</div>
            <span style={{ fontSize: '12px', color: 'var(--color-text-3)', fontStyle: 'italic' }}>Operational</span>
          </div>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 800, 
            letterSpacing: '-0.04em',
            margin: 0,
            className: 'text-gradient'
          }}>
            Welcome back, {firstName}
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>System Time</div>
          <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
        </div>
      </div>

      {/* ── Operational Alerts ────────────────────── */}
      {alerts.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          {alerts.map((a, i) => (
            <StatusAlert key={i} type={a.type} title={a.title} detail={a.detail} />
          ))}
        </div>
      )}

      {/* ── Career & Growth Strip ─────────────────── */}
      <div style={{ marginTop: '24px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <PlacementStrip
          daysRemaining={daysToPlacement}
          dsaPercent={dsaData.percent}
          topicsRevised={dsaData.solved}
          totalTopics={dsaData.total}
        />
      </div>

      {/* ── Hero Metric Row (3 cols) ───────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '40px',
        marginTop: '32px',
      }}>
        <HeroMetricCard
          label="DAILY PERFORMANCE"
          value={score}
          unit="/100"
          context={score >= 80 ? 'Exceptional' : score >= 50 ? 'Stable' : 'Inconsistent'}
          contextColor={score >= 80 ? 'var(--color-accent)' : undefined}
        />
        <HeroMetricCard
          label="RECOVERY STATUS"
          value={sleepHours}
          unit="h"
          decimals={1}
          context={sleepContext}
          contextColor={sleepHours >= 7 ? 'var(--color-accent)' : 'var(--color-alert-red)'}
        />
        <HeroMetricCard
          label="CAPITAL ENGINE"
          value={netWorth !== null ? Math.abs(netWorth) : null}
          unit="₹"
          unitPosition="before"
          context={netWorth >= 0 ? 'Accumulating' : 'Burning'}
          contextColor={netWorth >= 0 ? 'var(--color-accent)' : 'var(--color-alert-red)'}
        />
      </div>

      {/* ── Main Dashboard Content ────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '40px',
        alignItems: 'start',
      }}>

        {/* LEFT: Task & Mood Engine */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Mood Section */}
          <div className="vercel-card" style={{ padding: '24px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)' }} />
               <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-3)' }}>Current State</span>
             </div>
             <MoodSelector value={mood} onChange={handleMoodChange} />
          </div>

          {/* Task Section */}
          <div className="vercel-card" style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-1)' }}>Today's Directives</span>
                <span className="vercel-badge">{pendingTasks.length} PENDING</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>
                {completedTasks.length}/{tasks.length} Resolved
              </span>
            </div>

            {tasks.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: '6px' }}>
                <span className="text-subtext">No directives assigned for this cycle</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {pendingTasks.map(task => (
                  <TaskRow key={task.id} id={task.id} title={task.title} completed={false} source={task.source} dueTime={task.due_time} onToggle={handleTaskToggle} />
                ))}
                <div style={{ height: '1px', background: 'var(--color-border)', margin: '8px 0' }} />
                {completedTasks.map(task => (
                  <TaskRow key={task.id} id={task.id} title={task.title} completed={true} source={task.source} dueTime={task.due_time} onToggle={handleTaskToggle} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Biometrics & Habits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Biometrics */}
          <div className="vercel-card" style={{ padding: '24px' }}>
             <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '20px', color: 'var(--color-text-1)' }}>Biometric Health</div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <MetricTile type="sleep" label="SLEEP" value={sleepHours > 0 ? `${sleepHours}h` : '—'} progress={Math.min((sleepHours / 8) * 100, 100)} context="8h Target" done={sleepHours >= 7} index={0} />
                <MetricTile type="gym" label="GYM" value={s.gym_done ? 'Done' : 'No'} progress={s.gym_done ? 100 : 0} context={`${gymDaysThisWeek}d/week`} done={s.gym_done} index={1} />
                <MetricTile type="steps" label="STEPS" value={s.steps ? new Intl.NumberFormat('en-IN').format(s.steps) : '—'} progress={Math.min(((s.steps || 0) / 10000) * 100, 100)} context="10k Target" done={(s.steps || 0) >= 10000} index={2} />
                <MetricTile type="water" label="WATER" value={s.water_bottles ? `${s.water_bottles}L` : '—'} progress={Math.min(((s.water_bottles || 0) / 3) * 100, 100)} context="3L Target" done={(s.water_bottles || 0) >= 3} index={3} />
             </div>
          </div>

          {/* Habits */}
          {habits.length > 0 && (
            <div className="vercel-card" style={{ padding: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                 <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-1)' }}>Neural Rewiring</div>
                 <span style={{ fontSize: '11px', color: 'var(--color-text-3)' }}>{habits.filter(h => h.completed).length}/{habits.length}</span>
               </div>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                 {habits.map(habit => (
                   <HabitCircle key={habit.id} id={habit.id} label={habit.name} completed={habit.completed} onToggle={handleHabitToggle} />
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .vercel-card {
           background: var(--color-surface);
           border: 1px solid var(--color-border);
           border-radius: 8px;
           transition: border-color var(--dur-fast) var(--ease);
        }
        .vercel-card:hover {
           border-color: var(--color-border-lit);
        }
        .text-gradient {
          background: linear-gradient(135deg, var(--color-text-1) 30%, var(--color-text-2) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default Overview;
