import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { apiGet } from '../../utils/api';
import { getRows } from '../../services/dbService';

const TASKS = [
  { id: 'habit', label: 'Mark a habit complete today', href: '/habits', check: 'habit' },
  { id: 'journal', label: 'Write 3 minutes in your journal', href: '/journal', check: 'journal' },
  { id: 'goal', label: 'Set your first goal', href: '/goals', check: 'goal' },
];

function isCreatedToday(createdAt) {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const now = new Date();
  return (
    created.getFullYear() === now.getFullYear()
    && created.getMonth() === now.getMonth()
    && created.getDate() === now.getDate()
  );
}

export default function DayOneCard({ user }) {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState({ habit: false, journal: false, goal: false });
  const [allComplete, setAllComplete] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const run = async () => {
      try {
        const profile = await apiGet('/account/user-profile').catch(() => null);
        const createdAt = profile?.created_at || user.created_at;
        if (!isCreatedToday(createdAt)) return;

        const today = new Date().toISOString().split('T')[0];

        const [habitsRes, journalRows, goalsRes] = await Promise.all([
          apiGet('/habits').catch(() => []),
          getRows('journal_entries', { limit: 1 }),
          apiGet('/goals').catch(() => []),
        ]);

        const habits = habitsRes || [];
        const hasHabitToday = habits.some((h) => (h.meta?.completedDates || []).includes(today));
        const hasJournal = (journalRows?.length || 0) > 0;
        const hasGoal = (goalsRes || []).length > 0;

        if (hasHabitToday && hasJournal && hasGoal) return;

        setDone({
          habit: hasHabitToday,
          journal: hasJournal,
          goal: hasGoal,
        });
        setVisible(true);
      } catch {
        // Non-blocking
      }
    };

    run();
    const onVisible = () => {
      if (document.visibilityState === 'visible') run();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [user]);

  useEffect(() => {
    if (done.habit && done.journal && done.goal) {
      setAllComplete(true);
      const t = setTimeout(() => setVisible(false), 3500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [done]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
        style={{
          marginBottom: 24,
          padding: '20px 24px',
          background: 'var(--color-surface-2)',
          border: '1px solid rgba(37, 99, 235, 0.25)',
          borderRadius: 'var(--r-lg)',
        }}
      >
        {allComplete ? (
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--color-text-1)' }}>
            Day 1 complete. Good start.
          </p>
        ) : (
          <>
            <p className="text-label" style={{ margin: '0 0 4px', color: 'var(--color-text-3)' }}>Day 1</p>
            <h3 className="text-h3" style={{ margin: '0 0 16px', color: 'var(--color-text-1)' }}>
              Three actions today. That&apos;s how streaks start.
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TASKS.map((task) => {
                const complete = done[task.check];
                return (
                  <li key={task.id}>
                    <Link
                      to={task.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 12px',
                        borderRadius: 'var(--r-md)',
                        background: complete ? 'var(--color-success-dim)' : 'var(--color-surface-3)',
                        border: `1px solid ${complete ? 'rgba(16,185,129,0.3)' : 'var(--color-border)'}`,
                        textDecoration: 'none',
                        color: 'var(--color-text-1)',
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          border: `2px solid ${complete ? 'var(--color-success)' : 'var(--color-border-lit)'}`,
                          background: complete ? 'var(--color-success)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {complete && <Check size={14} color="#fff" strokeWidth={3} />}
                      </span>
                      {task.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
