import React, { forwardRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from './waitlistLandingData';

const WaitlistFaqSection = forwardRef(function WaitlistFaqSection(_props, ref) {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className="waitlist-section waitlist-faq-wrap faq-section" id="faq" ref={ref}>
      <p className="waitlist-section-label">FAQ</p>
      <h2>Questions before joining?</h2>
      <div className="waitlist-faq-list">
        {FAQS.map((faq, index) => (
          <article key={faq.q} className="waitlist-faq-item">
            <button
              type="button"
              className="waitlist-faq-trigger"
              onClick={() => setOpenFaq((prev) => (prev === index ? -1 : index))}
              aria-expanded={openFaq === index}
              aria-controls={`waitlist-faq-ans-${index}`}
            >
              <span>{faq.q}</span>
              <ChevronDown
                size={16}
                className={`waitlist-faq-icon ${openFaq === index ? 'waitlist-faq-icon-open' : ''}`}
                aria-hidden="true"
              />
            </button>
            {openFaq === index && (
              <p id={`waitlist-faq-ans-${index}`} className="waitlist-faq-answer">
                {faq.a}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
});

export default WaitlistFaqSection;
