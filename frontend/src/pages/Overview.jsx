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
  const { loading: statsLoading, todayLog, computed: { gymDaysThisWeek } } = useDailyStats(user);

  const [tasks, setTasks]         = useState([]);
  const [habits, setHabits]       = useState([]);
  const [netWorth, setNetWorth]   = useState(null);
  const [dsaData, setDsaData]     = useState({ percent: null, solved: 0, total: 150 });
  const [mood, setMood]           = useState(todayLog?.mood || null);
  const [alerts, setAlerts]       = useState([]);
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

        // Net worth (latest snapshot)
        const { data: nwData } = await supabase
          .from('net_worth_snapshots')
          .select('total_inr')
          .eq('user_id', userId)
          .order('snapshot_date', { ascending: false })
          .limit(1)
          .single();

        // DSA problems solved
        const { data: dsaProblems } = await supabase
          .from('dsa_problems')
          .select('id', { count: 'exact' })
          .eq('user_id', userId);

        const solved = (dsaProblems || []).length;

        setTasks(taskData || []);
        setHabits((habitData || []).map(h => ({ ...h, completed: logMap[h.id] || false })));
        setNetWorth(nwData?.total_inr ?? null);
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
  const score = calcScore(s);
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Adi';

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const sleepHours = s.sleep_hours || 0;
  const sleepContext = sleepHours >= 7
    ? 'Well rested'
    : sleepHours > 0
    ? `${(7 - sleepHours).toFixed(1)}h deficit`
    : 'Not logged';

  /* ── Skeleton state ───────────────────────────── */
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Skeleton h="24px" style={{ width: '200px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px' }}>
          <Skeleton h="120px" />
          <Skeleton h="120px" />
          <Skeleton h="120px" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {[1,2,3,4,5].map(i => <Skeleton key={i} h="48px" />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px' }}>
            {[1,2,3,4].map(i => <Skeleton key={i} h="100px" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* ── Greeting ──────────────────────────────── */}
      <div style={{ padding: '0 0 var(--space-5)' }}>
        <span className="text-subtext" style={{ fontStyle: 'italic' }}>
          {firstName}.
        </span>
      </div>

      {/* ── Alerts ────────────────────────────────── */}
      {alerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginBottom: 'var(--space-3)' }}>
          {alerts.map((a, i) => (
            <StatusAlert key={i} type={a.type} title={a.title} detail={a.detail} />
          ))}
        </div>
      )}

      {/* ── Placement Strip ───────────────��───────── */}
      <PlacementStrip
        daysRemaining={daysToPlacement}
        dsaPercent={dsaData.percent}
        topicsRevised={dsaData.solved}
        totalTopics={dsaData.total}
      />

      {/* ── Mood Selector ─────────────────────────── */}
      <div style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 24px',
      }}>
        <MoodSelector value={mood} onChange={handleMoodChange} />
      </div>

      {/* ── Hero Metric Row (3 cols) ───────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: 'var(--space-6)',
        marginTop: 'var(--space-5)',
      }}>
        <HeroMetricCard
          label="DAILY SCORE"
          value={score}
          unit="/100"
          context={score >= 80 ? 'Strong day' : score >= 50 ? 'On track' : score > 0 ? 'Keep going' : 'Not started'}
          contextColor={score >= 80 ? 'var(--color-accent)' : undefined}
        />
        <HeroMetricCard
          label="SLEEP"
          value={sleepHours}
          unit="h"
          decimals={1}
          context={sleepContext}
          contextColor={sleepHours >= 7 ? 'var(--color-accent)' : sleepHours > 0 ? 'var(--color-alert-red)' : undefined}
        />
        <HeroMetricCard
          label="NET WORTH"
          value={netWorth !== null ? Math.abs(netWorth) : null}
          unit="₹"
          unitPosition="before"
          context={netWorth !== null ? (netWorth >= 0 ? 'Positive' : 'Negative') : 'No data'}
          contextColor={netWorth >= 0 ? 'var(--color-accent)' : 'var(--color-alert-red)'}
        />
      </div>

      {/* ── Main 2-col: Tasks + Metrics ───────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '32px',
        alignItems: 'start',
      }}>

        {/* LEFT: Tasks */}
        <div>
          {/* Section header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 'var(--space-3)',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <span className="text-label">Tasks</span>
            <span className="text-subtext">
              {completedTasks.length}/{tasks.length} done
            </span>
          </div>

          {/* Task rows */}
          {tasks.length === 0 ? (
            <div style={{
              padding: 'var(--space-6) 0',
              textAlign: 'center',
            }}>
              <span className="text-subtext">No tasks for today</span>
            </div>
          ) : (
            <>
              {pendingTasks.map(task => (
                <TaskRow
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  completed={false}
                  source={task.source}
                  dueTime={task.due_time}
                  onToggle={handleTaskToggle}
                />
              ))}
              {completedTasks.map(task => (
                <TaskRow
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  completed={true}
                  source={task.source}
                  dueTime={task.due_time}
                  onToggle={handleTaskToggle}
                />
              ))}
            </>
          )}
        </div>

        {/* RIGHT: Metric Tiles 2×2 */}
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}>
            <MetricTile
              type="sleep"
              label="SLEEP"
              value={sleepHours > 0 ? `${sleepHours}h` : '—'}
              progress={Math.min((sleepHours / 8) * 100, 100)}
              context="Target: 8h"
              done={sleepHours >= 7}
              index={0}
            />
            <MetricTile
              type="gym"
              label="GYM"
              value={s.gym_done ? 'Done' : 'No'}
              progress={s.gym_done ? 100 : 0}
              context={gymDaysThisWeek != null ? `${gymDaysThisWeek}d this week` : undefined}
              done={s.gym_done}
              index={1}
            />
            <MetricTile
              type="steps"
              label="STEPS"
              value={s.steps ? new Intl.NumberFormat('en-IN').format(s.steps) : '—'}
              progress={Math.min(((s.steps || 0) / 10000) * 100, 100)}
              context="Target: 10,000"
              done={(s.steps || 0) >= 10000}
              index={2}
            />
            <MetricTile
              type="water"
              label="WATER"
              value={s.water_bottles ? `${s.water_bottles}L` : '—'}
              progress={Math.min(((s.water_bottles || 0) / 3) * 100, 100)}
              context="Target: 3L"
              done={(s.water_bottles || 0) >= 3}
              index={3}
            />
          </div>
        </div>
      </div>

      {/* ── Habits Row ────────────────────────────── */}
      {habits.length > 0 && (
        <div style={{ marginTop: 'var(--space-6)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 'var(--space-3)',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: 'var(--space-4)',
          }}>
            <span className="text-label">Habits</span>
            <span className="text-subtext">
              {habits.filter(h => h.completed).length}/{habits.length} today
            </span>
          </div>

          <div style={{
            display: 'flex',
            gap: 'var(--space-5)',
            overflowX: 'auto',
            paddingBottom: 'var(--space-2)',
          }}>
            {habits.map(habit => (
              <HabitCircle
                key={habit.id}
                id={habit.id}
                label={habit.name}
                completed={habit.completed}
                onToggle={handleHabitToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Responsive overrides ───────────────────── */}
      <style>{`
        @media (max-width: 900px) {
          .overview-hero-row { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 700px) {
          .overview-main { grid-template-columns: 1fr !important; }
          .overview-hero-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Overview;
