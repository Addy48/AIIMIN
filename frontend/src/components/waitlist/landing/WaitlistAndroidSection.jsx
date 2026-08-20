import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import { ANDROID_APP_STATUS, fadeUp } from './waitlistLandingData';

/** Waitlist + mobile: honest Android companion status. No APK CTA. */
export default function WaitlistAndroidSection() {
  return (
    <section className="waitlist-section waitlist-android-section" id="android-app" aria-labelledby="android-app-heading">
      <p className="waitlist-section-label">Android companion</p>
      <h2 id="android-app-heading">{ANDROID_APP_STATUS.headline}</h2>
      <p className="waitlist-section-copy">{ANDROID_APP_STATUS.subhead}</p>

      <motion.div
        className="waitlist-android-panel"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <div className="waitlist-android-status">
          <Smartphone size={18} aria-hidden />
          <div>
            <p className="waitlist-android-badge">{ANDROID_APP_STATUS.badge}</p>
            <p className="waitlist-android-detail">{ANDROID_APP_STATUS.detail}</p>
          </div>
        </div>
        <ul className="waitlist-android-points">
          {ANDROID_APP_STATUS.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <div className="waitlist-android-actions">
          <Link to="/app" className="waitlist-btn waitlist-btn-outline">
            App status page
          </Link>
          <a href="#waitlist-join" className="waitlist-btn waitlist-btn-primary">
            Get founding access
          </a>
        </div>
      </motion.div>
    </section>
  );
}
