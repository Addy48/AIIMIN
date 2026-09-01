import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, TESTIMONIALS } from './waitlistLandingData';

const AVATAR_CLASSES = ['avatar-steel', 'avatar-spark', 'avatar-green', 'avatar-purple'];

export default function WaitlistTestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const total = TESTIMONIALS.length;

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 4200);
    return () => clearInterval(timerRef.current);
  }, [paused, next]);

  return (
    <section className="waitlist-section waitlist-testimonials waitlist-desktop-only">
      <p className="waitlist-section-label">Early voices</p>
      <h2>What testers are saying</h2>
      <p className="waitlist-testimonials-honest">
        Paraphrased feedback from closed beta interviews — not paid endorsements.
      </p>

      <motion.div
        className="waitlist-testimonials-carousel"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* 2-col grid showing all 4 cards, with active highlight */}
        <div className="waitlist-grid waitlist-grid-2 waitlist-testimonial-grid">
          {TESTIMONIALS.map((item, index) => (
            <article
              key={item.name}
              className={`waitlist-quote-card-v2 ${index === activeIndex ? 'is-active' : ''}`}
              style={{
                cursor: 'pointer',
              }}
              onClick={() => setActiveIndex(index)}
            >
              <span className="waitlist-quote-mark" aria-hidden="true">&ldquo;</span>
              <p className="waitlist-quote-text-v2">&ldquo;{item.quote}&rdquo;</p>
              <div className="waitlist-quote-author-v2">
                <span className={`waitlist-quote-avatar-v2 ${AVATAR_CLASSES[index % AVATAR_CLASSES.length]}`}>
                  {item.initials}
                </span>
                <div className="waitlist-quote-meta">
                  <strong>{item.name}</strong>
                  <span>{item.role} · {item.city}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="waitlist-testimonials-dots" aria-label="Testimonial navigation">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`waitlist-testimonials-dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
