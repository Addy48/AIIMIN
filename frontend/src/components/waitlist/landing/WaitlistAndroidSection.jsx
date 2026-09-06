import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DownloadSimple,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
} from '@phosphor-icons/react';
import { fadeUp } from './waitlistLandingData';

const SHA256_HASH = 'b74d6dd68c2f151c6ce7593be2769581e1eb02e496d4982d58992270451d3993';

export default function WaitlistAndroidSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(SHA256_HASH);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="waitlist-section waitlist-android-section" id="android-app" aria-labelledby="android-app-heading">
      <p className="waitlist-section-label">Physical Execution Layer</p>
      <h2 id="android-app-heading">Hardware-Grade Mobile Terminal. Built for the Real World.</h2>
      <p className="waitlist-section-copy">
        Your desktop runs the strategy. Your mobile terminal captures physical execution instantly. Built in pure native silicon — zero web wrappers, AES-256 hardware keystore encryption, and 100% offline autonomy.
      </p>

      <motion.div
        className="waitlist-android-deck"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
      >
        {/* Left Column: Technical Subsystems & Architecture */}
        <div className="waitlist-android-tech-col">
          <div className="waitlist-android-spec-header">
            <span className="waitlist-android-status-pill">
              <span className="waitlist-android-pulse-dot" />
              Native Android V2 · Closed Beta
            </span>
            <span className="waitlist-android-tech-meta">v2.0.4 · API 35 · 120Hz</span>
          </div>

          <div className="waitlist-android-spec-table">
            <div className="waitlist-android-spec-row">
              <span className="waitlist-android-spec-label">Instant Capture</span>
              <span className="waitlist-android-spec-val">Instant lockscreen logging · zero launch latency</span>
            </div>
            <div className="waitlist-android-spec-row">
              <span className="waitlist-android-spec-label">Biometric Vault</span>
              <span className="waitlist-android-spec-val">AES-256-GCM hardware keystore · keys never leave RAM</span>
            </div>
            <div className="waitlist-android-spec-row">
              <span className="waitlist-android-spec-label">Autonomous Engine</span>
              <span className="waitlist-android-spec-val">100% offline-first SQLite · deterministic zero-loss sync</span>
            </div>
            <div className="waitlist-android-spec-row">
              <span className="waitlist-android-spec-label">Zero Telemetry</span>
              <span className="waitlist-android-spec-val">No analytics SDKs · no ad trackers · pure native binary</span>
            </div>
          </div>

          <div className="waitlist-android-badge-strip">
            <span className="waitlist-android-chip">Native Compose 120Hz</span>
            <span className="waitlist-android-chip">Hardware Keystore</span>
            <span className="waitlist-android-chip">Offline-First SQLite</span>
            <span className="waitlist-android-chip">Zero Analytics</span>
          </div>
        </div>

        {/* Right Column: Download & Checksum Console */}
        <div className="waitlist-android-dl-col">
          <div className="waitlist-android-dl-card">
            <div className="waitlist-android-dl-head">
              <span className="waitlist-android-build-tag">BUILD: v2.0.4-rc</span>
              <span className="waitlist-android-size-tag">~62.8 MB (ARM64/x86)</span>
            </div>

            <div className="waitlist-android-dl-actions">
              <a
                href="/aiimin-v2-debug.apk"
                download="aiimin-v2-debug.apk"
                className="waitlist-android-primary-btn"
              >
                <DownloadSimple size={16} weight="bold" />
                Download V2 APK (~62 MB)
              </a>

              <Link to="/app" className="waitlist-android-secondary-btn">
                Full System Architecture & Specs
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* SHA-256 Block */}
            <div className="waitlist-android-hash-block">
              <div className="waitlist-android-hash-meta">
                <span>SHA-256 Checksum</span>
                <button type="button" onClick={handleCopy} className="waitlist-android-hash-copy">
                  {copied ? (
                    <>
                      <Check size={12} weight="bold" color="#22c55e" />
                      <span style={{ color: '#22c55e' }}>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <code className="waitlist-android-hash-code">
                {SHA256_HASH}
              </code>
            </div>

            <p className="waitlist-android-dl-note">
              <ShieldCheck size={15} weight="duotone" color="#749dc4" />
              <span>Sideloadable debug build for verified testers. Installs alongside web OS.</span>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
