import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RANK_UP_LINES } from '../../utils/xpEngine';
import { springSoft } from '../../utils/motionPresets';
import { shouldShip } from '../../utils/designVoteShip';
import ParticleButton from '../kokonutui/particle-button';
import { ShippedGlitchLabel } from '../design/ShippedUI';
import SafeRender from '../design/SafeRender';

export default function LevelUpModal({ data, onClose }) {
  if (!data?.rank) return null;

  const line = RANK_UP_LINES[data.rank.rank] || data.rank.tagline;
  const useParticle = shouldShip('k-particle-btn');

  return (
    <AnimatePresence>
      <motion.div
        className="xp-level-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="xp-level-card"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={springSoft}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="xp-level-eyebrow">Rank up</p>
          <div className="xp-level-emoji">{data.rank.emoji}</div>
          <h2 className="xp-level-title"><ShippedGlitchLabel text={data.rank.name} /></h2>
          <p className="xp-level-line">{line}</p>
          {data.rank.nextRank && (
            <p className="xp-level-next">
              Next: {data.rank.nextRank.emoji} {data.rank.nextRank.name} · {data.rank.xpToNext} XP to go
            </p>
          )}
          {useParticle ? (
            <SafeRender name="particle-btn" fallback={<button type="button" className="xp-level-btn" onClick={onClose}>Keep going</button>}>
              <ParticleButton onClick={onClose}>Keep going</ParticleButton>
            </SafeRender>
          ) : (
            <button type="button" className="xp-level-btn" onClick={onClose}>Keep going</button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
