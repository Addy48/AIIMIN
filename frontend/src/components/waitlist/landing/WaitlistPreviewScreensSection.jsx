import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { fadeUp, PREVIEW_SCREENS } from './waitlistLandingData';

export default function WaitlistPreviewScreensSection() {
  return (
    <section className="waitlist-section waitlist-section-alt waitlist-desktop-only">
      <p className="waitlist-section-label">Command surfaces</p>
      <h2>High-density surfaces — zero decorative noise</h2>
      <p className="waitlist-section-copy">
        Explore the primary operating layers: immediate daily execution, multi-dimensional score intelligence, and linked financial provenance.
      </p>
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
            <div className="waitlist-screen-card-top">
              <span className="waitlist-screen-tag">{screen.tag}</span>
              {screen.metricBadge && (
                <span className="waitlist-screen-badge">{screen.metricBadge}</span>
              )}
            </div>
            
            <h3 className="waitlist-screen-title">{screen.title}</h3>
            
            <div className="waitlist-screen-stat">
              <div className="waitlist-screen-stat-main">
                <strong>{screen.stat}</strong>
                <span>{screen.statLabel}</span>
              </div>
            </div>

            {screen.items && (
              <div className="waitlist-screen-items">
                {screen.items.map((item) => (
                  <div key={item.label} className="waitlist-screen-item">
                    <span className="waitlist-screen-item-icon" aria-hidden="true">
                      <CheckCircle2 size={13} />
                    </span>
                    <span className="waitlist-screen-item-label">{item.label}</span>
                    <span className="waitlist-screen-item-val">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {screen.dimensions && (
              <div className="waitlist-screen-dimensions">
                {screen.dimensions.map((dim) => (
                  <div key={dim.name} className="waitlist-screen-dim-row">
                    <span className="waitlist-screen-dim-name">{dim.name}</span>
                    <div className="waitlist-screen-dim-bar-wrap">
                      <div
                        className="waitlist-screen-dim-bar"
                        style={{ width: `${dim.pct}%`, background: dim.color }}
                      />
                    </div>
                    <span className="waitlist-screen-dim-pct">{dim.pct}%</span>
                  </div>
                ))}
              </div>
            )}

            <div className="waitlist-screen-chart-block">
              <div className="waitlist-screen-chart-head">
                <span>7-Day Consistency</span>
                <span>Trend: Baseline Optimal</span>
              </div>
              <div className="waitlist-screen-bars" aria-hidden="true">
                {screen.bars.map((h, i) => (
                  <span key={`${screen.title}-${i}-${h}`} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            <p className="waitlist-screen-caption">{screen.caption}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
