/**
 * Growth Engine nodes — interconnected loop with live stats per step.
 * Gollwitzer (1999) implementation intentions; competence tracking (Deci & Ryan SDT).
 */
import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Target, HelpCircle, Activity, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../utils/api';
import { scrollReveal, reducedMotionVariants } from '../../constants/animations';

const NODES = [
  { id: 'goals', label: '1. Set Goal', icon: Target, desc: 'Define your North Star', color: 'var(--color-accent)', route: '/goals', statKey: 'goals' },
  { id: 'decision', label: '2. Strategize', icon: HelpCircle, desc: 'Mental Models (Lab)', color: '#2563EB', route: '?module=decision', statKey: 'lab' },
  { id: 'habits', label: '3. Build Habit', icon: Activity, desc: 'Daily execution', color: '#10B981', route: '/habits', statKey: 'habits' },
  { id: 'focus', label: '4. Deep Work', icon: Zap, desc: 'Enter Flow State', color: '#F59E0B', route: '/focus', statKey: 'focus' },
  { id: 'discipline', label: '5. Maintain', icon: Shield, desc: 'Discipline Engine', color: '#EF4444', route: '/discipline', statKey: 'discipline' },
];

export default function GrowthNodes() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const variants = reduceMotion ? reducedMotionVariants : scrollReveal;
  const [stats, setStats] = useState({});

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    Promise.allSettled([
      apiGet('/goals'),
      apiGet('/habits'),
      apiGet('/focus/week-stats?days=7'),
      apiGet('/discipline/streak'),
    ]).then(([goalsRes, habitsRes, focusRes, discRes]) => {
      const goals = goalsRes.status === 'fulfilled' ? (goalsRes.value || []) : [];
      const habits = habitsRes.status === 'fulfilled' ? (habitsRes.value || []) : [];
      const focus = focusRes.status === 'fulfilled' ? (focusRes.value || []) : [];
      const disc = discRes.status === 'fulfilled' ? discRes.value : null;

      const doneToday = habits.filter((h) => (h.meta?.completedDates || []).includes(today)).length;
      const focusSessions = focus.reduce((s, d) => s + (d.cycles || 0), 0);

      setStats({
        goals: `${goals.filter((g) => g.status !== 'Achieved').length} active`,
        lab: 'Open Lab →',
        habits: habits.length ? `${doneToday}/${habits.length} today` : 'Add habits',
        focus: focusSessions ? `${focusSessions} sessions` : 'Start focus',
        discipline: disc?.streak_days != null ? `${disc.streak_days}d streak` : 'Start streak',
      });
    });
  }, []);

  const handleNavigate = (route) => {
    if (route.startsWith('?')) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('module', new URLSearchParams(route).get('module'));
      window.history.pushState({}, '', newUrl);
      window.dispatchEvent(new Event('popstate'));
    } else {
      navigate(route);
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={variants}
      style={{
        background: 'var(--color-surface-2)',
        borderRadius: 24,
        border: '1px solid var(--color-border)',
        padding: 32,
        marginBottom: 40,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ padding: 10, background: 'var(--color-accent-dim)', borderRadius: 12, color: 'var(--color-accent)' }}>
          <Activity size={22} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-1)', margin: 0 }}>The Growth Engine</h2>
      </div>
      <p style={{ color: 'var(--color-text-2)', fontSize: 14, lineHeight: 1.6, marginBottom: 40, maxWidth: 640 }}>
        Success compounds through a closed loop. Each node below pulls live data from your dashboard — domain balance predicts life satisfaction (Journal of Happiness Studies, 2005).
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', flexWrap: 'wrap', gap: 16 }}>
        {!reduceMotion && (
          <div style={{
            position: 'absolute', top: 40, left: 40, right: 40, height: 3,
            background: 'var(--color-border)', borderRadius: 2, zIndex: 0,
          }}
          >
            <motion.div
              animate={{ scaleX: [0.2, 1, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                height: '100%',
                width: '100%',
                transformOrigin: 'left',
                background: 'linear-gradient(90deg, var(--color-accent), #2563EB, #10B981)',
                borderRadius: 2,
                opacity: 0.5,
              }}
            />
          </div>
        )}

        {NODES.map((node, i) => (
          <motion.button
            key={node.id}
            type="button"
            onClick={() => handleNavigate(node.route)}
            whileHover={reduceMotion ? {} : { y: -6, scale: 1.03 }}
            style={{
              position: 'relative', zIndex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              cursor: 'pointer', width: 120, minWidth: 100,
              background: 'none', border: 'none', padding: 0, fontFamily: 'inherit',
            }}
          >
            <motion.div
              className={i === 2 ? 'node-active-pulse' : undefined}
              style={{
                width: 68, height: 68, borderRadius: 18,
                background: 'var(--color-surface-3)',
                border: `1px solid var(--color-border)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: node.color, marginBottom: 14,
              }}
            >
              <node.icon size={28} />
            </motion.div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-text-1)', marginBottom: 4, textAlign: 'center' }}>
              {node.label}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-3)', textAlign: 'center', marginBottom: 6 }}>
              {node.desc}
            </div>
            <div style={{
              fontSize: 10, fontWeight: 800, color: node.color,
              padding: '3px 8px', borderRadius: 6,
              background: `color-mix(in srgb, ${node.color} 12%, transparent)`,
            }}
            >
              {stats[node.statKey] || '—'}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
