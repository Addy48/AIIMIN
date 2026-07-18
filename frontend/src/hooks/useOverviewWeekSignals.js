/**
 * Shared week-range signals for Overview widgets (MondayInsight, WeekInNumbers).
 */
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../utils/api';

function last7DayKeys() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

async function fetchOverviewWeekSignals(user) {
  const last7 = last7DayKeys();
  const weekAgo = last7[last7.length - 1];

  const [
    widgetsRes,
    habitsRes,
    focusRes,
    disciplineStreakRes,
    disciplinePatternsRes,
  ] = await Promise.allSettled([
    apiGet('/dashboard/widgets'),
    apiGet('/habits'),
    apiGet('/focus/week-stats?days=7'),
    apiGet('/discipline/streak'),
    apiGet('/discipline/patterns'),
  ]);

  const widgets = widgetsRes.status === 'fulfilled' ? widgetsRes.value : {};
  const habitsList = habitsRes.status === 'fulfilled' ? (habitsRes.value || []) : [];
  const focus = focusRes.status === 'fulfilled' ? (focusRes.value || []) : [];

  let habitCompletions = 0;
  const habitsData = {};
  habitsList.forEach((h) => {
    const dates = h.meta?.completedDates || [];
    const count = last7.filter((d) => dates.includes(d)).length;
    habitCompletions += count;
    habitsData[h.name] = `${count}/7 days`;
  });
  const habitTarget = habitsList.length * 7;

  const disciplineStreak = disciplineStreakRes.status === 'fulfilled'
    ? (disciplineStreakRes.value?.streak_days || 0)
    : 0;
  const disciplineLine = disciplinePatternsRes.status === 'fulfilled'
    ? disciplinePatternsRes.value?.headline || null
    : null;

  const focusSessions = focus.reduce((s, d) => s + (d.cycles || 0), 0);

  return {
    widgets,
    habitsList,
    habitsData,
    habitCompletions,
    habitTarget,
    focusSessions,
    disciplineStreak,
    disciplineLine,
    weekAgo,
    moodTrend: widgets.avg_mood
      ? `${Number(widgets.avg_mood).toFixed(1)}/10 average`
      : 'No mood logs this week',
    finance: {
      income: widgets.income_total || 0,
      expenses: widgets.expense_total || 0,
      count: widgets.transaction_count || 0,
    },
    labSessions: widgets.lab_sessions || 0,
    journalEntries: widgets.journal_entries || 0,
  };
}

export function useOverviewWeekSignals(user, { enabled = true } = {}) {
  const weekStart = last7DayKeys()[0];
  return useQuery({
    queryKey: ['overview', 'week-signals', user?.id, weekStart],
    queryFn: () => fetchOverviewWeekSignals(user),
    enabled: Boolean(enabled && user && !user.isGuest),
    staleTime: 60_000,
  });
}

export { fetchOverviewWeekSignals, last7DayKeys };
