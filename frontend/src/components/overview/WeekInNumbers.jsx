import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Activity, BookOpen, Target, Wallet, Brain, Flame } from 'lucide-react';
import { apiGet } from '../../utils/api';
import AnimatedNumber from '../ui/AnimatedNumber';
import { SkeletonCard } from '../ui/Skeleton';
import { calculateLifeScore } from '../../utils/lifeScoreEngine';

const METRIC_ICONS = {
  habits: Activity,
  journal: BookOpen,
  focus: Target,
  finance: Wallet,
  mood: Brain,
  lifeScore: Flame,
};

/**
 * Week in Numbers — aggregated weekly metrics widget grid.
 */
export default function WeekInNumbers({ user }) {
  const weekRange = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  }, []);

  const { data: stats, isLoading: loading } = useQuery({
    queryKey: ['week-in-numbers', user?.id, weekRange.start],
    enabled: Boolean(user && !user.isGuest),
    staleTime: 30_000,
    queryFn: async () => {
      const last7 = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7.push(d.toISOString().split('T')[0]);
      }

      const [widgetRes, habitsRes, focusRes, lifeRes] = await Promise.allSettled([
        apiGet('/dashboard/widgets'),
        apiGet('/habits'),
        apiGet('/focus/week-stats?days=7'),
        calculateLifeScore(user),
      ]);

      const widgets = widgetRes.status === 'fulfilled' ? widgetRes.value : {};
      const habits = habitsRes.status === 'fulfilled' ? (habitsRes.value || []) : [];
      const focus = focusRes.status === 'fulfilled' ? (focusRes.value || []) : [];
      const lifeScore = lifeRes.status === 'fulfilled' ? lifeRes.value : null;

      const habitsDone = habits.reduce((sum, h) => {
        const dates = h.meta?.completedDates || [];
        return sum + last7.filter((d) => dates.includes(d)).length;
      }, 0);
      const habitTarget = habits.length * 7;
      const focusSessions = focus.reduce((s, d) => s + (d.cycles || 0), 0);

      return {
        habits: { value: habitsDone, sub: habitTarget ? `${Math.round((habitsDone / habitTarget) * 100)}% rate` : '—', color: 'var(--color-success)' },
        journal: { value: widgets.journal_entries || 0, sub: 'entries', color: 'var(--color-info)' },
        focus: { value: focusSessions, sub: 'sessions', color: 'var(--color-warning)' },
        finance: { value: widgets.expense_total || 0, sub: 'spent (7d)', color: 'var(--color-danger)', isCurrency: true },
        mood: { value: widgets.avg_mood || '—', sub: widgets.avg_mood ? '/10 avg' : 'no logs', color: 'var(--color-text-2)' },
        lifeScore: { value: lifeScore?.score || '—', sub: lifeScore?.explanation?.slice(0, 40) || '', color: 'var(--color-accent)' },
      };
    },
  });

  if (!user || user.isGuest) return null;

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} height={88} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const items = [
    { key: 'habits', label: 'Habit Completions', ...stats.habits },
    { key: 'journal', label: 'Journal Entries', ...stats.journal },
    { key: 'focus', label: 'Focus Sessions', ...stats.focus },
    { key: 'finance', label: 'Weekly Spend', ...stats.finance },
    { key: 'mood', label: 'Avg Mood', ...stats.mood },
    { key: 'lifeScore', label: 'Life Score', ...stats.lifeScore },
  ];

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-3)', marginBottom: '16px' }}>
        Week in Numbers
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="metric-row">
        {items.map(({ key, label, value, sub, color, isCurrency }, i) => {
          const Icon = METRIC_ICONS[key];
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                padding: '16px', borderRadius: '16px',
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderTop: `3px solid ${color}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                {Icon && <Icon size={12} style={{ color }} />}
                <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-3)' }}>
                  {label}
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-text-1)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {typeof value === 'number' && key !== 'mood' ? (
                  <>
                    {isCurrency && '₹'}
                    <AnimatedNumber value={value} duration={0.5} />
                  </>
                ) : value}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-3)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {sub}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
