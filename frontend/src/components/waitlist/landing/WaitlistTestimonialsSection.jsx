import React, { useState } from 'react';
import { TESTIMONIALS } from './waitlistLandingData';

const AVATAR_STYLES = [
  { bg: 'rgba(116, 157, 196, 0.15)', color: '#749dc4', border: '1px solid rgba(116, 157, 196, 0.35)' },
  { bg: 'rgba(255, 107, 53, 0.15)', color: '#ff6b35', border: '1px solid rgba(255, 107, 53, 0.35)' },
  { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.35)' },
  { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.35)' },
  { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.35)' },
  { bg: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.35)' },
];

export default function WaitlistTestimonialsSection() {
  const [showAll, setShowAll] = useState(false);
  const displayedTestimonials = showAll ? TESTIMONIALS : TESTIMONIALS.slice(0, 6);

  return (
    <section className="waitlist-section waitlist-testimonials" id="reviews">
      <p className="waitlist-section-label">Closed Beta Feedback</p>
      <h2>What testers are saying</h2>
      <p className="waitlist-testimonials-honest">
        Direct feedback from closed testers running the web command center and native Android companion.
      </p>

      <div className="waitlist-testimonials-container" style={{ marginTop: '28px' }}>
        <div className="waitlist-grid waitlist-grid-3 waitlist-testimonial-grid" style={{ gap: '20px' }}>
          {displayedTestimonials.map((item, index) => {
            const avStyle = AVATAR_STYLES[index % AVATAR_STYLES.length];
            return (
              <article
                key={item.name}
                className="waitlist-quote-card-v2"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <p
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.65',
                      color: 'var(--color-text-1)',
                      margin: 0,
                      fontWeight: 450,
                    }}
                  >
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--color-border)',
                  }}
                >
                  <span
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 800,
                      flexShrink: 0,
                      background: avStyle.bg,
                      color: avStyle.color,
                      border: avStyle.border,
                    }}
                  >
                    {item.initials}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <strong style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-1)' }}>
                      {item.name}
                    </strong>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-2)', fontWeight: 500 }}>
                      {item.role}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {TESTIMONIALS.length > 6 && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-1)',
                padding: '10px 24px',
                borderRadius: '99px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
                e.currentTarget.style.color = 'var(--color-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text-1)';
              }}
            >
              {showAll ? 'Show top reviews ↑' : `View all ${TESTIMONIALS.length} reviews ↓`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
