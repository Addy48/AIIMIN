/**
 * Life Score hero — total score + domain radar.
 * Tracking Competence growth is a reliable intrinsic motivation driver (Deci & Ryan SDT, 1985–2020).
 */
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import AnimatedNumber from '../ui/AnimatedNumber';
import LifeScoreRadar from './LifeScoreRadar';
import { scrollReveal, reducedMotionVariants } from '../../constants/animations';
import useThemeColors from '../../hooks/useThemeColors';

export default function LifeScorePanel({ lifeScore, compact = false }) {
  const c = useThemeColors();
  const reduceMotion = useReducedMotion();
  const variants = reduceMotion ? reducedMotionVariants : scrollReveal;

  if (!lifeScore) return null;

  return (
    <motion.div
      className="card"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variants}
      style={{
        padding: compact ? 20 : 28,
        marginBottom: 32,
        background: c.cardBg,
        border: `1px solid ${c.border}`,
        borderRadius: 20,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1.2fr', gap: 24, alignItems: 'center' }}>
        <div>
          <div className="text-label" style={{ color: c.text3, marginBottom: 8 }}>Life Score</div>
          <div
            className="score-highlight"
            style={{
              fontSize: compact ? 48 : 64,
              fontWeight: 900,
              color: c.text1,
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}
          >
            <AnimatedNumber value={lifeScore.score} duration={0.8} />
          </div>
          <p style={{ fontSize: 14, color: c.text2, lineHeight: 1.5, margin: '12px 0 16px' }}>
            {lifeScore.explanation}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(lifeScore.contributors || {}).map(([key, val]) => (
              <span
                key={key}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 8,
                  background: c.surface4,
                  color: c.text2,
                  border: `1px solid ${c.border}`,
                }}
              >
                {val.label}: {val.score}
              </span>
            ))}
          </div>
        </div>
        <LifeScoreRadar contributors={lifeScore.contributors} compact={compact} />
      </div>
    </motion.div>
  );
}
