import React from 'react';
import { RANKS } from '../../utils/xpEngine';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../utils/motionPresets';

export default function RankLadder() {
  return (
    <div className="rank-ladder">
      <p className="rank-ladder__intro">
        Ranks track how consistently you live the life you are designing. XP auto-collects when you log your day, finish focus, or track money — no manual claim.
      </p>
      <motion.ul className="rank-ladder__list" variants={staggerContainer} initial="hidden" animate="show">
        {RANKS.map((r) => (
          <motion.li key={r.rank} className="rank-ladder__item" variants={staggerItem}>
            <span className="rank-ladder__emoji">{r.emoji}</span>
            <div>
              <strong>{r.name}</strong>
              <span className="rank-ladder__xp">{r.minXP.toLocaleString()} XP</span>
              <p>{r.tagline}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
