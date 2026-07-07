import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, PREVIEW_SCREENS } from './waitlistLandingData';

export default function WaitlistPreviewScreensSection() {
  return (
    <section className="waitlist-section waitlist-section-alt waitlist-desktop-only">
      <p className="waitlist-section-label">What you will get</p>
      <h2>Real screens, not abstract promises</h2>
      <div className="waitlist-grid waitlist-grid-3">
        {PREVIEW_SCREENS.map((screen, index) => (
          <motion.article
            key={screen.title}
            custom={index}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.28 }}
            className="waitlist-card waitlist-screen-card"
          >
            <p className="waitlist-screen-title">{screen.title}</p>
            <div className="waitlist-screen-stat">
              <strong>{screen.stat}</strong>
              <span>{screen.statLabel}</span>
            </div>
            <div className="waitlist-screen-bars" aria-hidden="true">
              {screen.bars.map((h) => (
                <span key={`${screen.title}-${h}`} style={{ height: `${h}%` }} />
              ))}
            </div>
            <p>{screen.caption}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
