import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DownloadSimple,
  ShieldCheck,
  ArrowRight,
  LockKey,
} from '@phosphor-icons/react';
import { fadeUp } from './waitlistLandingData';

export default function WaitlistAndroidSection() {
  return (
    <section className="waitlist-section waitlist-android-section" id="android-app" aria-labelledby="android-app-heading">
      <p className="waitlist-section-label">Native Companion</p>
      <h2 id="android-app-heading">Fast mobile capture. Zero bloated web wrappers.</h2>
      <p className="waitlist-section-copy">
        Desktop is your command center for deep planning and weekly reviews. The Android companion logs habits, expenses, and quick notes in under two seconds — built with 100% native Kotlin and Jetpack Compose, offline SQLite sync, and AES-256 hardware keystore encryption.
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
              <span className="waitlist-android-size-tag">~27.3 MB (ARM64/x86)</span>
            </div>

            <div className="waitlist-android-dl-actions">
              <a
                href="/aiimin-v2-debug.apk"
                download="aiimin-v2-debug.apk"
                className="waitlist-android-primary-btn"
              >
                <DownloadSimple size={16} weight="bold" />
                Download V2 APK (~27 MB)
              </a>

              <Link to="/app" className="waitlist-android-secondary-btn">
                Full System Architecture & Specs
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Verified Security Block */}
            <div className="waitlist-android-hash-block">
              <div className="waitlist-android-hash-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 600 }}>
                  <ShieldCheck size={14} weight="fill" color="#10B981" />
                  Verified Cryptographic Integrity
                </span>
                <span style={{ fontSize: '10px', color: '#749dc4', fontFamily: 'var(--font-mono)' }}>Tamper-Proof</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', fontSize: '11px', color: 'var(--color-text-2)' }}>
                <span>• StrongBox TEE Hardware Keystore</span>
                <span>• 100% On-Device Telemetry · Zero Cloud SMS Storage</span>
                <span>• Zero-VPN Focus Shield · Pure Native Binary</span>
              </div>
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
