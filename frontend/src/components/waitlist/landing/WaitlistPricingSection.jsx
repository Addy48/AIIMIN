import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Check } from 'lucide-react';
import { fadeUp, PRICING, STACK_MONTHLY_INR } from './waitlistLandingData';

function CompactValueComparison() {
  const aiiminMax = 79;
  const stackPct = 100;
  const aiiminPct = Math.round((aiiminMax / STACK_MONTHLY_INR) * 100);

  return (
    <div className="value-compare-compact" aria-label="AIIMIN cost vs typical productivity app stack in India">
      <div className="value-compare-col value-compare-col--stack">
        <p className="value-compare-kicker">Typical stack</p>
        <p className="value-compare-price value-compare-price--muted">₹1,600<span>/mo</span></p>
        <div className="value-compare-meter" aria-hidden="true">
          <div className="value-compare-meter-fill value-compare-meter-fill--stack" style={{ width: `${stackPct}%` }} />
        </div>
        <p className="value-compare-apps">Notion · Todoist · Headspace</p>
      </div>

      <div className="value-compare-vs" aria-hidden="true">
        <span className="value-compare-vs-line" />
        <span className="value-compare-vs-label">vs</span>
        <span className="value-compare-vs-line" />
      </div>

      <div className="value-compare-col value-compare-col--aiimin">
        <p className="value-compare-kicker">AIIMIN Life OS</p>
        <p className="value-compare-price">from ₹0<span> · one system</span></p>
        <div className="value-compare-meter" aria-hidden="true">
          <div className="value-compare-meter-fill value-compare-meter-fill--aiimin" style={{ width: `${aiiminPct}%` }} />
        </div>
        <div className="value-tier-pills">
          <span className="value-tier-pill value-tier-pill--explore">Explore ₹0</span>
          <span className="value-tier-pill value-tier-pill--core">Core ₹29</span>
          <span className="value-tier-pill value-tier-pill--pro">Pro ₹49*</span>
          <span className="value-tier-pill value-tier-pill--elite">Elite ₹79*</span>
        </div>
        <p className="value-compare-foot">*Waitlist founding rates · web + mobile · India pricing approx. July 2026</p>
      </div>
    </div>
  );
}

export default function WaitlistPricingSection() {
  const [selectedPricing, setSelectedPricing] = useState('Pro');
  const active = PRICING.find((p) => p.tier === selectedPricing) ?? PRICING[2];

  return (
    <section className="waitlist-section pricing-section waitlist-desktop-only">
      <p className="waitlist-section-label">Pricing</p>
      <h2>Four tiers — each built for a different level of control</h2>
      <p className="waitlist-section-copy">
        Typical productivity stacks run ₹500–₹1,600/mo across separate apps.
        AIIMIN bundles your entire Life OS from ₹0 — Pro at ₹49/mo founding for waitlist members.
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
              <div className="pricing-tier-header">
                <span className="pricing-tier-icon-wrap" aria-hidden="true">
                  <TierIcon size={18} strokeWidth={2} />
                </span>
                <div className="pricing-tier-title-block">
                  {item.startHere && <span className="pricing-tier-eyebrow">Free forever</span>}
                  {item.recommended && <span className="pricing-tier-eyebrow pricing-tier-eyebrow--recommended">Recommended</span>}
                  <h3>{item.tier}</h3>
                  <p className="pricing-tier-tagline">{item.tierTagline}</p>
                </div>
              </div>

              {item.discounted ? (
                <div className="tier-price-block">
                  <span className="tier-price-list">{item.price}<span className="tier-price-list-unit">/mo</span></span>
                  <div className="tier-price-main">
                    <span className="tier-price-amount">{item.discounted}</span>
                    <span className="tier-price-unit">/mo</span>
                  </div>
                  <span className="tier-price-waitlist-label">Waitlist founding rate</span>
                </div>
              ) : item.startHere ? (
                <div className="tier-price-block">
                  <span className="tier-price-list tier-price-row-placeholder" aria-hidden="true">
                    ₹00<span className="tier-price-list-unit">/mo</span>
                  </span>
                  <div className="tier-price-main">
                    <span className="tier-price-amount">{item.price}</span>
                  </div>
                  <span className="tier-price-waitlist-label">Always free</span>
                </div>
              ) : (
                <div className="tier-price-block">
                  <span className="tier-price-list tier-price-row-placeholder" aria-hidden="true">
                    ₹00<span className="tier-price-list-unit">/mo</span>
                  </span>
                  <div className="tier-price-main">
                    <span className="tier-price-amount">{item.price}</span>
                    <span className="tier-price-unit">/mo</span>
                  </div>
                  <span className="tier-price-waitlist-label tier-price-row-placeholder" aria-hidden="true">
                    Waitlist founding rate
                  </span>
                </div>
              )}

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
