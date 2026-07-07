import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, PERSONAS } from './waitlistLandingData';

export default function WaitlistPersonasSection() {
  return (
    <section className="waitlist-section waitlist-desktop-only">
      <p className="waitlist-section-label">Who this is for</p>
      <h2>Built for people who want one system to run their life</h2>
      <div className="waitlist-grid waitlist-grid-4">
        {PERSONAS.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.article
              key={item.title}
              custom={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="waitlist-card"
            >
              <Icon size={18} className="waitlist-card-icon" />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
