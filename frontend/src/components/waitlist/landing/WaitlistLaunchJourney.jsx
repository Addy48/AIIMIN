import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, LAUNCH_PHASE_LEGEND, LAUNCH_PHASES } from './waitlistLandingData';

function UnlockChip({ item }) {
  if (typeof item === 'string') {
    return <span className="launch-phase-chip launch-phase-chip--perk">{item}</span>;
  }
  return (
    <span className="launch-phase-chip launch-phase-chip--module">
      <strong>{item.name}</strong>
      <span>{item.hint}</span>
    </span>
  );
}

export default function WaitlistLaunchJourney() {
  return (
    <section className="waitlist-section launch-journey-section waitlist-desktop-only">
      <p className="waitlist-section-label">Launch journey</p>
      <h2>Four phases — from signup to full Life OS</h2>
      <p className="waitlist-section-copy">
        Each phase has a clear window, what you do, and what unlocks. No half-baked drops.
      </p>

      <div className="launch-phase-legend" aria-label="Launch phase stages">
        {LAUNCH_PHASE_LEGEND.map((item) => (
          <span key={item.key} className={`launch-phase-legend-item launch-phase-legend-item--${item.key}`}>
            {item.label}
          </span>
        ))}
      </div>

      <ol className="launch-phase-ladder" aria-label="Launch phases from access to expansion">
        {LAUNCH_PHASES.map((stage, index) => {
          const Icon = stage.icon;
          const isLast = index === LAUNCH_PHASES.length - 1;
          return (
            <motion.li
              key={stage.title}
              className={`launch-phase launch-phase--${stage.status}`}
              custom={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <div className="launch-phase-rail" aria-hidden="true">
                <span className={`launch-phase-dot launch-phase-dot--${stage.status}`} />
                {!isLast && <span className="launch-phase-line" />}
              </div>

              <article className="launch-phase-card">
                <header className="launch-phase-head">
                  <div className="launch-phase-head-left">
                    <span className="launch-phase-level">Phase {stage.phase}</span>
                    <div className="launch-phase-title-row">
                      <span className="launch-phase-icon" aria-hidden="true">
                        <Icon size={16} strokeWidth={2} />
                      </span>
                      <h3>{stage.title}</h3>
                    </div>
                    <p className="launch-phase-window">{stage.window}</p>
                  </div>
                  <span className={`launch-phase-status launch-phase-status--${stage.status}`}>
                    {stage.statusLabel}
                  </span>
                </header>

                <div className="launch-phase-split">
                  <div className="launch-phase-col">
                    <p className="launch-phase-kicker">Your move</p>
                    <p className="launch-phase-copy">{stage.userAction}</p>
                  </div>
                  <div className="launch-phase-col">
                    <p className="launch-phase-kicker">What unlocks</p>
                    <div className="launch-phase-chips">
                      {stage.unlocks.map((item) => (
                        <UnlockChip key={typeof item === 'string' ? item : item.name} item={item} />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="launch-phase-approval">
                  <span className="launch-phase-approval-label">Access</span>
                  {stage.approval}
                </p>
              </article>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
