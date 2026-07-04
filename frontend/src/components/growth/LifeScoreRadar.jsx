/**
 * Life Score radar — domain balance visualization.
 * Domain balance predicts life satisfaction (Journal of Happiness Studies, 2005).
 */
import React, { useMemo } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from 'recharts';
import { motion, useReducedMotion } from 'framer-motion';
import { scrollReveal, reducedMotionVariants } from '../../constants/animations';
import useThemeColors from '../../hooks/useThemeColors';

const DOMAIN_COLORS = {
  behavioral: '#2563EB',
  mental_clarity: '#10B981',
  goal_momentum: 'var(--color-accent)',
  financial: '#F59E0B',
  recovery: '#6B7280',
};

export default function LifeScoreRadar({ contributors = {}, compact = false }) {
  const c = useThemeColors();
  const reduceMotion = useReducedMotion();
  const variants = reduceMotion ? reducedMotionVariants : scrollReveal;

  const data = useMemo(() => {
    const entries = Object.entries(contributors);
    if (!entries.length) return [];
    return entries.map(([key, val]) => ({
      domain: (val.label || key).replace(' ', '\n'),
      score: val.score ?? 0,
      fullMark: 100,
    }));
  }, [contributors]);

  if (!data.length) return null;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={variants}
      style={{ width: '100%', height: compact ? 220 : 280 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius={compact ? '68%' : '72%'}>
          <PolarGrid stroke={c.border} />
          <PolarAngleAxis
            dataKey="domain"
            tick={{ fill: c.text3, fontSize: compact ? 9 : 10, fontWeight: 600 }}
          />
          <Tooltip
            contentStyle={{
              background: c.cardBg || c.surface2,
              border: `1px solid ${c.border}`,
              borderRadius: 10,
              fontSize: 12,
            }}
            formatter={(v) => [`${v}/100`, 'Score']}
          />
          <Radar
            name="Life domains"
            dataKey="score"
            stroke="#2563EB"
            fill="#2563EB"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export { DOMAIN_COLORS };
