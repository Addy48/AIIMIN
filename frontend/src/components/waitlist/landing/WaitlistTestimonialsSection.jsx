import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareQuote } from 'lucide-react';
import { fadeUp, TESTIMONIALS } from './waitlistLandingData';

export default function WaitlistTestimonialsSection() {
  return (
    <section className="waitlist-section waitlist-testimonials waitlist-desktop-only">
      <p className="waitlist-section-label">Early voices</p>
      <h2>What testers are saying</h2>
      <div className="waitlist-grid waitlist-grid-2 waitlist-testimonial-grid">
        {TESTIMONIALS.map((item, index) => (
          <motion.article
            key={item.name}
            custom={index}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="waitlist-card waitlist-quote-card"
          >
            <MessageSquareQuote size={18} className="waitlist-card-icon" />
            <p className="waitlist-quote-text">&ldquo;{item.quote}&rdquo;</p>
            <div className="waitlist-quote-author">
              <span className="waitlist-quote-avatar">{item.initials}</span>
              <div>
                <strong>{item.name}</strong>
                <p>{item.role} · {item.city}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
