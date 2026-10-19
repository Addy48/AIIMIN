import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Check } from 'lucide-react';
import { fadeUp, PRICING } from './waitlistLandingData';

function TierPriceBlock({ item }) {
  const hasDiscount = Boolean(item.discounted);
  const isFree = Boolean(item.startHere);

  return (
    <div className="tier-price-block">
      <span className={`tier-price-list ${hasDiscount ? '' : 'tier-price-row-placeholder'}`} aria-hidden={!hasDiscount}>
        {hasDiscount ? (
          <>
            {item.price}
            <span className="tier-price-list-unit">/mo</span>
          </>
        ) : (
          '\u00a0'
        )}
      </span>
      <div className="tier-price-main">
        <span className="tier-price-amount">{hasDiscount ? item.discounted : item.price}</span>
        <span className="tier-price-unit">/mo</span>
      </div>
      <span
        className={`tier-price-waitlist-label ${
          isFree || item.priceLine ? '' : 'tier-price-row-placeholder'
        }`}
      >
        {isFree ? 'Free for as long as you like' : item.priceLine || '\u00a0'}
      </span>
    </div>
  );
}

function CompactValueComparison() {
  return (
    <div className="value-compare-compact" aria-label="AIIMIN plans and prices">
      <div className="value-compare-col value-compare-col--aiimin">
        <p className="value-compare-kicker">Same prices in the app and on the web</p>
        <div className="value-tier-pills">
          {PRICING.map((p) => (
            <span key={p.tier} className={`value-tier-pill value-tier-pill--${p.tierAccent}`}>{p.tier} {p.price}</span>
          ))}
        </div>
        <p className="value-compare-foot">Per month, including GST · yearly plans cost less · cancel anytime</p>
      </div>
    </div>
  );
}

export default function WaitlistPricingSection() {
  const [selectedPricing, setSelectedPricing] = useState('Pro');
  const active = PRICING.find((p) => p.tier === selectedPricing) ?? PRICING[2];

  return (
    <section className="waitlist-section pricing-section" id="pricing">
      <p className="waitlist-section-label">Pricing</p>
      <h2>Free for one person. Plans for more.</h2>
      <p className="waitlist-section-copy">
        Every plan keeps the same promise: bank SMS read on your phone, no ads, no loans, no selling data. Items marked
        &ldquo;Coming&rdquo; are planned and not included yet.
      </p>

      <div className="waitlist-pricing-grid">
        {PRICING.map((item, index) => {
          const TierIcon = item.tierIcon;
          const isActive = selectedPricing === item.tier;
          return (
            <motion.button
              key={item.tier}
              type="button"
              custom={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className={[
                'waitlist-pricing-card',
                `waitlist-pricing-tier-${item.tierAccent}`,
                item.recommended ? 'waitlist-pricing-recommended' : '',
                isActive ? 'waitlist-pricing-active' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setSelectedPricing(item.tier)}
              aria-pressed={isActive}
            >
              <span className="pricing-tier-accent-bar" aria-hidden="true" />
              {item.recommended && <span className="pricing-tier-glow" aria-hidden="true" />}
              {item.startHere && (
                <span className="pricing-tier-eyebrow pricing-tier-eyebrow--floating">Free forever</span>
              )}
              {item.recommended && (
                <span className="pricing-tier-eyebrow pricing-tier-eyebrow--recommended pricing-tier-eyebrow--floating">
                  Recommended
                </span>
              )}
              <div className="pricing-tier-header">
                <span className="pricing-tier-icon-wrap" aria-hidden="true">
                  <TierIcon size={18} strokeWidth={2} />
                </span>
                <div className="pricing-tier-title-block">
                  <h3>{item.tier}</h3>
                  <p className="pricing-tier-tagline">{item.tierTagline}</p>
                </div>
              </div>

              <TierPriceBlock item={item} />

              {item.freeNote && <p className="tier-free-note">{item.freeNote}</p>}
              <p className="waitlist-pricing-note">{item.note}</p>

              <ul className="waitlist-pricing-features">
                {item.includes.slice(0, 3).map((line) => (
                  <li key={line}>
                    <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        key={active.tier}
        className="waitlist-pricing-detail"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="waitlist-pricing-tabs" role="tablist" aria-label="Pricing tier breakdown">
          {PRICING.map((tier) => (
            <button
              key={tier.tier}
              type="button"
              role="tab"
              aria-selected={selectedPricing === tier.tier}
              className={`waitlist-pricing-tab ${selectedPricing === tier.tier ? 'waitlist-pricing-tab-active' : ''}`}
              onClick={() => setSelectedPricing(tier.tier)}
            >
              {tier.tier}
            </button>
          ))}
        </div>
        <div className="waitlist-pricing-detail-head">
          <h3>{active.tier}: what you get</h3>
          <p>Best for: {active.bestFor}</p>
        </div>
        <ul className="waitlist-pricing-detail-list">
          {active.includes.map((line) => (
            <li key={line}><BadgeCheck size={14} /> {line}</li>
          ))}
        </ul>
      </motion.div>

      <CompactValueComparison />
    </section>
  );
}
