import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import { Link } from 'react-router-dom';
import {
  DownloadSimple,
  ShieldCheck,
  LockKey,
  Copy,
  Check,
  ArrowRight,
  DeviceMobile,
  CheckCircle,
  XCircle,
  Circle,
  SealCheck,
  Info,
  Desktop,
  Lightning,
  Terminal,
  Flame,
  CaretDown,
  CaretUp,
  Cpu,
  ArrowsLeftRight,
  Prohibit,
  HardDrives,
  EyeSlash,
  X,
  Diamond,
  User,
  Plus,
  Fingerprint,
  Sparkle,
} from '@phosphor-icons/react';
import Wordmark from '../components/brand/Wordmark';
import { ArchBracketMark, DARK_PICK } from '../components/brand/archBracketMark';
import '../styles/appPage.css';

const ADB_COMMAND = 'adb install -r aiimin-v2-debug.apk';

const CORE_CAPABILITIES = [
  {
    icon: Lightning,
    title: 'Instant Capture',
    desc: 'Lockscreen logging in <2s · zero launch lag',
    color: '#FF6B35',
  },
  {
    icon: LockKey,
    title: 'Biometric Vault',
    desc: 'AES-256-GCM hardware keystore · keys stay in TEE',
    color: '#10B981',
  },
  {
    icon: HardDrives,
    title: 'Autonomous Engine',
    desc: '100% offline-first SQLite · zero-loss auto-sync',
    color: '#749DC4',
  },
  {
    icon: ShieldCheck,
    title: 'Zero Telemetry',
    desc: 'No analytics SDKs · no ad trackers · pure native binary',
    color: '#749DC4',
  },
];

const SPECS = [
  { label: 'Package Identifier', value: 'in.aiimin.app.v3' },
  { label: 'Release Version', value: '2.0.4-rc (Build 108)' },
  { label: 'Target Platform', value: 'Android 15 (API Level 35 · Vanilla Ice Cream)' },
  { label: 'Minimum Compatibility', value: 'Android 8.0 Oreo (API Level 26)' },
  { label: 'UI Architecture', value: 'Native Kotlin · Jetpack Compose (120Hz V-Sync)' },
  { label: 'Local Storage Engine', value: 'SQLCipher v4.5.4 Encrypted SQLite (Room v2.6)' },
  { label: 'Cryptographic Enclave', value: 'AndroidKeyStore StrongBox · AES-256-GCM' },
  { label: 'Binary Footprint', value: '44.2 MB (Universal ARM64-v8a / x86_64)' },
  { label: 'Sync Architecture', value: 'Deterministic Conflict-Free Outbox (CRDT)' },
  { label: 'Third-Party Trackers', value: '0 SDKs · Zero Analytics · Zero Ad Beacons' },
];

const INSTALL_STEPS = [
  {
    step: '01',
    title: 'Download the Verified Binary',
    desc: 'Download the compiled v2.0.4 APK directly to your Android device from our secure release mirror.',
    note: 'Universal APK (~44.2 MB) works across modern ARM64 and x86_64 Android devices.',
  },
  {
    step: '02',
    title: 'Enable Sideload Permissions',
    desc: 'When prompted by your browser or files app, allow "Install unknown apps" in Android system settings.',
    note: 'On Android 13, 14, and 15, enable Restricted Settings in App Info if requested for accessibility.',
  },
  {
    step: '03',
    title: 'Biometric Keystore Initialization',
    desc: 'Launch AIIMIN, sign in or continue as Guest. Your phone hardware keystore seals your local database immediately.',
    note: 'Biometric fingerprint or face authentication activates on first launch.',
  },
];

const FAQS = [
  {
    q: 'Why distribute directly as an APK instead of the Google Play Store?',
    a: 'During the closed beta phase, direct APK distribution enables us to ship rapid architectural iterations, instant bug fixes, and zero-day security patches without waiting 3–7 business days for app store review gates. Distribution remains a direct, cryptographically verified APK release during this closed testing phase.',
  },
  {
    q: 'How does Focus Shield block apps without running a background VPN?',
    a: 'Traditional screen-time apps route your entire network traffic through a local fake VPN tunnel, draining up to 15% battery per day and introducing latency. AIIMIN Focus Shield uses native Android Accessibility and WindowManager intercept events. It operates entirely on-device with zero network overhead and no persistent VPN process running in the background.',
  },
  {
    q: 'What happens when I have no internet connection?',
    a: 'AIIMIN Android is 100% offline-first. Every habit logged, expense tracked, and note created writes immediately to a local encrypted SQLCipher SQLite database in under 10 milliseconds. When connectivity restores, an asynchronous CRDT outbox synchronizes your records conflict-free.',
  },
  {
    q: 'Is my financial and personal data encrypted on my device?',
    a: 'Yes. Master cryptographic keys are generated inside your smartphone Trusted Execution Environment (AndroidKeyStore TEE StrongBox). Keys never touch RAM unencrypted, cannot be extracted by root exploits, and are never transmitted to any cloud server.',
  },
  {
    q: 'Which Android versions and device chipsets are supported?',
    a: 'AIIMIN Android v2.0.4 targets Android 15 (API 35) and supports Android 8.0 (Oreo) and above. The universal APK includes optimized 64-bit native binaries for Qualcomm Snapdragon, Google Tensor, MediaTek Dimensity, and Samsung Exynos chipsets.',
  },
];

/* ── PHONE MOCKUP COMPONENT ── */
function PhoneDeviceMockup() {
  const [habits, setHabits] = useState({
    gym: true,
    deepWork: true,
    upi: true,
    debrief: true,
  });
  const [activeFilter, setActiveFilter] = useState('minimum');
  const [settling, setSettling] = useState(false);
  const [settledToast, setSettledToast] = useState(null);

  const [enclaveView, setEnclaveView] = useState(false);

  const toggleHabit = (key) => {
    setHabits((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleEnclaveView = () => {
    setEnclaveView((prev) => !prev);
    setSettledToast(!enclaveView ? 'Unlocked StrongBox Hardware Key View 🔐' : 'Switched to Sovereign Telemetry View ⚡');
    setTimeout(() => setSettledToast(null), 2500);
  };

  const handleSettle = () => {
    if (settling) return;
    setSettling(true);
    setTimeout(() => {
      setSettling(false);
      setSettledToast('Committed 4 items to SQLite outbox ✓');
      setTimeout(() => setSettledToast(null), 3000);
    }, 450);
  };

  return (
    <div className="phone-mockup-wrap">
      {/* Titanium Hardware Frame */}
      <div className="phone-chassis">
        {/* Subtle Screen Bezel & Glare */}
        <div className="phone-glare-effect" />
        
        <div className="phone-screen">
          {/* Status Bar */}
          <div className="phone-status-bar">
            <span className="phone-clock">09:41</span>
            <div className="phone-notch-pill" />
            <div className="phone-security-pill">
              <ShieldCheck size={11} weight="fill" color="#10B981" />
              <span>AES-256</span>
            </div>
          </div>

          {/* Interactive Sovereign OS-ID Passport / Enclave Card */}
          <div
            className="phone-os-id-card"
            onClick={toggleEnclaveView}
            role="button"
            tabIndex={0}
            title="Click to toggle between Telemetry and Enclave views"
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleEnclaveView()}
          >
            {/* Card Header */}
            <div className="os-id-topbar">
              <div className="os-id-pill">
                <span className="os-id-beacon" />
                <span className="os-id-code">OPERATOR // ADTY·SYS·01</span>
              </div>
              <div className="os-id-enclave-badge">
                <Fingerprint size={10} weight="bold" color="#10B981" />
                <span>{enclaveView ? 'STRONGBOX TEE' : 'TEE SEALED'}</span>
              </div>
            </div>

            {/* Main Identity Row */}
            <div className="os-id-main-row">
              <div className="os-id-crest">
                <ArchBracketMark size={14} pick={DARK_PICK} />
                <span className="os-id-chip-notch" />
              </div>

              <div className="os-id-meta">
                <div className="os-id-name-row">
                  <strong className="os-id-name">{enclaveView ? 'Hardware Enclave' : 'Aaditya Upadhyay'}</strong>
                  <span className="os-id-tier">{enclaveView ? 'ROOT KEY' : 'FOUNDER'}</span>
                </div>
                <div className="os-id-subline">
                  <span className="os-id-hash">{enclaveView ? 'AES-256-GCM' : '0x8F3D…41C7'}</span>
                  <span className="os-id-dot">·</span>
                  <span className="os-id-mode">{enclaveView ? 'TEE Keystore' : 'SQLCipher 2.6'}</span>
                </div>
              </div>

              {/* Dynamic Life Score / Momentum */}
              <div className="os-id-score-block">
                <div className="os-id-score-val">
                  <span className="os-id-score-num">{enclaveView ? '120' : '84'}</span>
                  <span className="os-id-score-label">{enclaveView ? 'Hz' : 'LHS'}</span>
                </div>
                <div className="os-id-momentum-tag">
                  <Sparkle size={8} weight="fill" />
                  <span>{enclaveView ? 'VSYNC' : '+14%'}</span>
                </div>
              </div>
            </div>

            {/* Micro Telemetry Bar */}
            <div className="os-id-telemetry-bar">
              <div className="os-id-stat">
                <span className="os-id-stat-k">{enclaveView ? 'STORAGE' : 'DEPTH'}</span>
                <strong className="os-id-stat-v">{enclaveView ? 'Encrypted SQLite' : '88%'}</strong>
              </div>
              <div className="os-id-stat-div" />
              <div className="os-id-stat">
                <span className="os-id-stat-k">{enclaveView ? 'LEAK' : 'LATENCY'}</span>
                <strong className="os-id-stat-v text-emerald">{enclaveView ? '0.0 ms' : '0.8ms'}</strong>
              </div>
              <div className="os-id-stat-div" />
              <div className="os-id-stat">
                <span className="os-id-stat-k">{enclaveView ? 'NETWORK' : 'OUTBOX'}</span>
                <strong className="os-id-stat-v text-accent">{enclaveView ? 'OFFLINE 100%' : '4 COMMITTED'}</strong>
              </div>
            </div>
          </div>

          {/* Quick Action Chips */}
          <div className="phone-actions-strip">
            <button
              type="button"
              className={`phone-action-chip phone-action-chip--expense ${activeFilter === 'expense' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('expense')}
            >
              <Plus size={10} weight="bold" />
              <span>EXPENSE</span>
            </button>
            <button
              type="button"
              className={`phone-action-chip phone-action-chip--focus ${activeFilter === 'focus' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('focus')}
            >
              <Lightning size={10} weight="fill" />
              <span>FOCUS</span>
            </button>
            <button
              type="button"
              className={`phone-action-chip phone-action-chip--minimum ${activeFilter === 'minimum' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('minimum')}
            >
              <Check size={10} weight="bold" />
              <span>MINIMUM</span>
            </button>
          </div>

          {/* Habit / Action Items */}
          <div className="phone-items-list">
            <div
              className={`phone-item-card ${habits.gym ? 'is-done' : ''}`}
              onClick={() => toggleHabit('gym')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleHabit('gym')}
            >
              <div className="phone-item-info">
                <strong>Morning Gym Minimum</strong>
                <span>45m Workout · Logged 06:30</span>
              </div>
              <span className="phone-item-check" aria-label={habits.gym ? 'Completed' : 'Pending'}>
                {habits.gym ? (
                  <CheckCircle size={18} weight="fill" color="#10B981" />
                ) : (
                  <Circle size={18} weight="bold" color="#334155" />
                )}
              </span>
            </div>

            <div
              className={`phone-item-card ${habits.deepWork ? 'is-done' : ''}`}
              onClick={() => toggleHabit('deepWork')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleHabit('deepWork')}
            >
              <div className="phone-item-info">
                <strong>Deep Work Sprint</strong>
                <span>3h 15m Code · Logged 10:15</span>
              </div>
              <span className="phone-item-check" aria-label={habits.deepWork ? 'Completed' : 'Pending'}>
                {habits.deepWork ? (
                  <CheckCircle size={18} weight="fill" color="#10B981" />
                ) : (
                  <Circle size={18} weight="bold" color="#334155" />
                )}
              </span>
            </div>

            <div
              className={`phone-item-card ${habits.upi ? 'is-done' : ''}`}
              onClick={() => toggleHabit('upi')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleHabit('upi')}
            >
              <div className="phone-item-info">
                <strong>UPI Reimbursement</strong>
                <span>Lent Rahul ₹500 (Linked)</span>
              </div>
              <span className="phone-item-check" aria-label={habits.upi ? 'Completed' : 'Pending'}>
                {habits.upi ? (
                  <CheckCircle size={18} weight="fill" color="#10B981" />
                ) : (
                  <Circle size={18} weight="bold" color="#334155" />
                )}
              </span>
            </div>

            <div
              className={`phone-item-card ${habits.debrief ? 'is-done' : ''}`}
              onClick={() => toggleHabit('debrief')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleHabit('debrief')}
            >
              <div className="phone-item-info">
                <strong>Evening Debrief</strong>
                <span>Journal &amp; Ledger Synced</span>
              </div>
              <span className="phone-item-check" aria-label={habits.debrief ? 'Completed' : 'Pending'}>
                {habits.debrief ? (
                  <CheckCircle size={18} weight="fill" color="#10B981" />
                ) : (
                  <Circle size={18} weight="bold" color="#334155" />
                )}
              </span>
            </div>
          </div>

          {/* Settle to SQLite Action Button */}
          <div className="phone-bottom-bar">
            {settledToast && (
              <div className="phone-toast-msg">
                <ShieldCheck size={12} weight="bold" color="#10B981" />
                <span>{settledToast}</span>
              </div>
            )}
            <button
              type="button"
              className={`phone-settle-btn ${settling ? 'is-settling' : ''}`}
              onClick={handleSettle}
            >
              <span>{settling ? 'Committing to SQLite…' : 'Settle to Offline SQLite Graph'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AndroidApp() {
  const [downloading, setDownloading] = useState(false);
  const [copiedAdb, setCopiedAdb] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleCopyAdb = () => {
    navigator.clipboard?.writeText(ADB_COMMAND);
    setCopiedAdb(true);
    setTimeout(() => setCopiedAdb(false), 2200);
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? -1 : idx);
  };

  return (
    <div className="app-page-root">
      <SEO
        title="Android Companion App"
        description="The native Android companion app for AIIMIN Life OS. Instant habit capture, offline-first SQLite database, app blocker focus shield, and local AES-256 encryption."
        canonicalPath="/app"
      />

      {/* ── FLOATING PILL NAV ── */}
      <header className="app-nav-wrap">
        <div className="app-nav-pill">
          <Link to="/" className="app-nav-brand" aria-label="AIIMIN Home">
            <ArchBracketMark size={16} pick={DARK_PICK} />
            <Wordmark size={18} color="#F0EDE8" />
            <span className="app-nav-badge">COMPANION V2</span>
          </Link>
          <div className="app-nav-sep" aria-hidden="true" />
          <nav className="app-nav-links">
            <a href="#contrast" className="app-nav-link">Antidote</a>
            <a href="#duality" className="app-nav-link">Duality</a>
            <a href="#engines" className="app-nav-link">Engines</a>
            <a href="#install" className="app-nav-link">Install</a>
            <a href="#specs" className="app-nav-link">Specs</a>
            <a href="#faq" className="app-nav-link">FAQ</a>
          </nav>
          <div className="app-nav-sep" aria-hidden="true" />
          <div className="app-nav-actions">
            <Link to="/waitlist" className="app-nav-ghost">Web OS</Link>
            <a
              href="/aiimin-v2-debug.apk"
              download="aiimin-v2-debug.apk"
              className="app-nav-btn"
            >
              <DownloadSimple size={13} weight="bold" />
              <span className="app-nav-btn-long">Get APK (v2.0.4)</span>
              <span className="app-nav-btn-short">Get APK</span>
            </a>
          </div>
        </div>
      </header>

      <main className="app-main-content">
        {/* ── SECTION 1: MASTER HERO WORKBENCH ── */}
        <section className="app-hero-section">
          {/* Header Typography */}
          <div className="app-hero-header-block">
            <h1 className="app-hero-headline">
              Fast mobile capture. Zero bloated web wrappers.
            </h1>
            <p className="app-hero-subline">
              Desktop is your command center for deep planning and weekly reviews. The Android companion logs habits, expenses, and quick notes in under two seconds — built with 100% native Kotlin and Jetpack Compose, offline SQLite sync, and AES-256 hardware keystore encryption.
            </p>
          </div>

          {/* 3-Column Hero Workbench Frame */}
          <div className="hero-cockpit-container">
            {/* Column 1: Capabilities & Architecture */}
            <div className="cockpit-card cockpit-card--left">
              <div className="cockpit-tag-row">
                <div className="cockpit-status-pill">
                  <span className="cockpit-status-dot" />
                  <span>Native Android V2 · Closed Beta</span>
                </div>
              </div>
              <div className="cockpit-spec-meta">
                <span>v2.0.4 · API 35 · 120Hz</span>
              </div>

              {/* 4 Feature Items */}
              <div className="cockpit-features-list">
                {CORE_CAPABILITIES.map((cap) => {
                  const Icon = cap.icon;
                  return (
                    <div key={cap.title} className="cockpit-feature-item">
                      <div className="cockpit-feat-icon" style={{ color: cap.color }}>
                        <Icon size={16} weight="bold" />
                      </div>
                      <div className="cockpit-feat-content">
                        <strong className="cockpit-feat-title">{cap.title}</strong>
                        <span className="cockpit-feat-desc">{cap.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tech Stack Pills */}
              <div className="cockpit-tech-strip">
                <span className="cockpit-tech-badge">Jetpack Compose 1.7</span>
                <span className="cockpit-tech-badge">Room SQLite 2.6</span>
                <span className="cockpit-tech-badge">Android Keystore TEE</span>
                <span className="cockpit-tech-badge">Coroutines Flow</span>
              </div>
            </div>

            {/* Column 2: Ultra-Realistic Interactive Titanium Smartphone */}
            <div className="cockpit-card cockpit-card--center">
              <PhoneDeviceMockup />
            </div>

            {/* Column 3: Build & Cryptographic Release */}
            <div className="cockpit-card cockpit-card--right">
              <div className="cockpit-build-row">
                <span className="cockpit-build-tag">BUILD: v2.0.4-release</span>
                <span className="cockpit-build-size">~44.2 MB (ARM64)</span>
              </div>

              {/* Primary Download CTA */}
              <div className="cockpit-action-group">
                <a
                  href="/aiimin-v2-debug.apk"
                  download="aiimin-v2-debug.apk"
                  className={`cockpit-download-btn ${downloading ? 'is-loading' : ''}`}
                  onClick={() => {
                    setDownloading(true);
                    setTimeout(() => setDownloading(false), 3000);
                  }}
                >
                  <DownloadSimple size={18} weight="bold" />
                  <span>{downloading ? 'Downloading APK…' : 'Download Latest APK (~44 MB)'}</span>
                </a>

                <a href="#specs" className="cockpit-specs-link">
                  <span>Full Architecture &amp; Specs</span>
                  <ArrowRight size={14} weight="bold" />
                </a>
              </div>

              {/* Cryptographic Integrity Card */}
              <div className="verified-integrity-card">
                <div className="integrity-head">
                  <SealCheck size={16} weight="fill" color="#10B981" />
                  <strong className="integrity-title">Verified Cryptographic Integrity</strong>
                </div>
                <ul className="integrity-points">
                  <li>
                    <CheckCircle size={13} weight="fill" color="#10B981" />
                    <span>StrongBox TEE Hardware Keystore</span>
                  </li>
                  <li>
                    <CheckCircle size={13} weight="fill" color="#10B981" />
                    <span>100% On-Device Telemetry · Zero Cloud SMS</span>
                  </li>
                  <li>
                    <CheckCircle size={13} weight="fill" color="#10B981" />
                    <span>Zero-VPN Focus Shield · Pure Native Binary</span>
                  </li>
                </ul>
              </div>

              {/* Sideload Footnote */}
              <div className="cockpit-sideload-footnote">
                <ShieldCheck size={14} color="#64748B" />
                <span>Sideloadable release build for verified testers.</span>
              </div>

              {/* ADB Command Quickbox */}
              <div className="cockpit-adb-box">
                <code>{ADB_COMMAND}</code>
                <button
                  type="button"
                  className="cockpit-adb-copy"
                  onClick={handleCopyAdb}
                  title="Copy command"
                >
                  {copiedAdb ? <CheckCircle size={12} color="#10B981" weight="fill" /> : <Copy size={11} />}
                  <span>{copiedAdb ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: THE DOPAMINE TRAP VS THE SOVEREIGN ANTIDOTE ── */}
        <section className="app-contrast-section" id="contrast">
          <div className="app-section-header">
            <span className="app-section-tag">ARCHITECTURAL INTENT</span>
            <h2 className="app-section-heading">Engineered with an inverse incentive.</h2>
            <p className="app-section-description">
              Mainstream apps measure success by time spent on screen. AIIMIN measures success by how quickly you close the app and return to deep work.
            </p>
          </div>

          <div className="contrast-grid">
            {/* The Trap */}
            <div className="contrast-card contrast-card--trap">
              <div className="contrast-card-header">
                <div className="contrast-icon-wrap trap-icon">
                  <Prohibit size={20} weight="bold" />
                </div>
                <div>
                  <span className="contrast-eyebrow">THE ATTENTION TRAP</span>
                  <h3 className="contrast-title">Everyday Smartphone Habits</h3>
                </div>
              </div>
              <p className="contrast-desc">
                Algorithmic apps employ cognitive capture to prolong screen time, fragmenting focus and exhausting working memory.
              </p>
              <ul className="contrast-list">
                <li>
                  <span className="contrast-bullet trap-bullet" aria-hidden="true">
                    <XCircle size={18} weight="fill" color="#F43F5E" />
                  </span>
                  <div>
                    <strong>4h 38m average daily screen time</strong>
                    <span>Lost to variable-reward algorithmic feeds and autoplay loops</span>
                  </div>
                </li>
                <li>
                  <span className="contrast-bullet trap-bullet" aria-hidden="true">
                    <XCircle size={18} weight="fill" color="#F43F5E" />
                  </span>
                  <div>
                    <strong>96 reflexive unlocks per day</strong>
                    <span>Triggered by notification badges designed to exploit social anxiety</span>
                  </div>
                </li>
                <li>
                  <span className="contrast-bullet trap-bullet" aria-hidden="true">
                    <XCircle size={18} weight="fill" color="#F43F5E" />
                  </span>
                  <div>
                    <strong>Constant cloud surveillance</strong>
                    <span>Dozens of third-party telemetry beacons harvesting personal data</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* The Antidote */}
            <div className="contrast-card contrast-card--antidote">
              <div className="contrast-card-header">
                <div className="contrast-icon-wrap antidote-icon">
                  <ShieldCheck size={20} weight="bold" />
                </div>
                <div>
                  <span className="contrast-eyebrow">THE SOVEREIGN ANTIDOTE</span>
                  <h3 className="contrast-title">AIIMIN Android Companion</h3>
                </div>
              </div>
              <p className="contrast-desc">
                A hardened physical instrument built to capture reality in sub-2-second bursts and immediately shut off.
              </p>
              <ul className="contrast-list">
                <li>
                  <span className="contrast-bullet antidote-bullet" aria-hidden="true">
                    <CheckCircle size={18} weight="fill" color="#10B981" />
                  </span>
                  <div>
                    <strong>Under 3 minutes total daily usage</strong>
                    <span>Get in, capture habit or expense, put phone face down</span>
                  </div>
                </li>
                <li>
                  <span className="contrast-bullet antidote-bullet" aria-hidden="true">
                    <CheckCircle size={18} weight="fill" color="#10B981" />
                  </span>
                  <div>
                    <strong>Native Focus Shield barrier</strong>
                    <span>Blocks doomscrolling apps at the Android window manager level</span>
                  </div>
                </li>
                <li>
                  <span className="contrast-bullet antidote-bullet" aria-hidden="true">
                    <CheckCircle size={18} weight="fill" color="#10B981" />
                  </span>
                  <div>
                    <strong>100% offline-first silicon enclave</strong>
                    <span>Hardware Keystore encryption with zero ad SDKs and zero tracking</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: TWO SURFACES, ONE LIFE OS ── */}
        <section className="app-duality-section" id="duality">
          <div className="app-section-header">
            <span className="app-section-tag">SYSTEM TOPOLOGY</span>
            <h2 className="app-section-heading">Two dedicated surfaces. One unified Life OS.</h2>
            <p className="app-section-description">
              We do not believe in forcing a desktop dashboard onto a tiny touchscreen, or turning your phone into an infinite distraction loop.
            </p>
          </div>

          <div className="app-surfaces-grid">
            {/* Surface 01: Desktop Web */}
            <div className="app-surface-box surface-desktop">
              <div className="surface-box-header">
                <div className="surface-icon-wrap icon-steel">
                  <Desktop size={20} color="#749DC4" weight="bold" />
                </div>
                <div>
                  <span className="surface-tier">SURFACE 01 // MACRO PLANNING</span>
                  <h3 className="surface-name">Web Command Center</h3>
                </div>
              </div>
              <p className="surface-desc">
                Your strategic cockpit on large displays. Engineered for deep weekly calibrations, Sunday goal reviews, financial runway simulations, and long-horizon habit intelligence.
              </p>
              <ul className="surface-checklist">
                <li><CheckCircle size={14} weight="fill" color="#749DC4" /> Sunday weekly retrospective &amp; goal calibration</li>
                <li><CheckCircle size={14} weight="fill" color="#749DC4" /> 5D multi-variate statistical correlation engine</li>
                <li><CheckCircle size={14} weight="fill" color="#749DC4" /> Financial runway projections &amp; portfolio debriefs</li>
                <li><CheckCircle size={14} weight="fill" color="#749DC4" /> High-density view replacing 6+ disparate apps</li>
              </ul>
              <Link to="/waitlist" className="surface-action-link">
                Explore Web Life OS <ArrowRight size={13} />
              </Link>
            </div>

            {/* Surface 02: Android Companion */}
            <div className="app-surface-box surface-mobile">
              <div className="surface-box-header">
                <div className="surface-icon-wrap icon-steel">
                  <DeviceMobile size={20} color="#749DC4" weight="bold" />
                </div>
                <div>
                  <span className="surface-tier">SURFACE 02 // PHYSICAL SENSOR</span>
                  <h3 className="surface-name">Android Companion App</h3>
                </div>
              </div>
              <p className="surface-desc">
                Your tactical physical sensor in your pocket. Built strictly for rapid capture, instant habit logging, blocking addictive apps, and offline data entry.
              </p>
              <ul className="surface-checklist">
                <li><CheckCircle size={14} weight="fill" color="#749DC4" /> Lock-screen and home-screen fast capture widgets</li>
                <li><CheckCircle size={14} weight="fill" color="#749DC4" /> Native Focus Shield blocking doom-scrolling apps</li>
                <li><CheckCircle size={14} weight="fill" color="#749DC4" /> 100% offline-first SQLCipher local storage</li>
                <li><CheckCircle size={14} weight="fill" color="#749DC4" /> On-device AndroidKeyStore AES-256 hardware seal</li>
              </ul>
              <a href="#install" className="surface-action-link">
                Get the APK <ArrowRight size={13} />
              </a>
            </div>
          </div>

          {/* Duality Bridge Visual */}
          <div className="duality-bridge-bar">
            <div className="bridge-step">
              <span className="bridge-icon"><HardDrives size={15} /></span>
              <span>Physical Capture on Android (Sub-2s)</span>
            </div>
            <div className="bridge-arrow"><ArrowsLeftRight size={14} /></div>
            <div className="bridge-step">
              <span className="bridge-icon"><LockKey size={15} /></span>
              <span>Local SQLCipher AES-256 Commit</span>
            </div>
            <div className="bridge-arrow"><ArrowsLeftRight size={14} /></div>
            <div className="bridge-step">
              <span className="bridge-icon"><Desktop size={15} /></span>
              <span>Reconciled into Macro Desktop Analytics</span>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: THE 4 HARDWARE ENGINES (BENTO GRID) ── */}
        <section className="app-engines-section" id="engines">
          <div className="app-section-header">
            <span className="app-section-tag">HARDWARE ENGINES</span>
            <h2 className="app-section-heading">Four native subsystems. Zero compromise.</h2>
            <p className="app-section-description">
              Every subsystem is written directly in native Kotlin and compiled to hardware bytecode. No sluggish web views, no battery drain, and zero data tracking.
            </p>
          </div>

          <div className="engines-bento-grid">
            {/* Card 1: Focus Shield (Wide) */}
            <div className="bento-card bento-card--focus">
              <div className="bento-card-core">
                <div className="bento-card-top">
                  <div className="bento-icon-box">
                    <ShieldCheck size={20} weight="bold" />
                  </div>
                  <span className="bento-badge">ENGINE 01 // INTERCEPTOR</span>
                </div>
                <h3 className="bento-title">Focus Shield Kernel Interceptor</h3>
                <p className="bento-desc">
                  Unlike primitive screen-time apps that rely on local VPN tunnels, Focus Shield interfaces directly with Android WindowManager accessibility events. When armed during deep work, launching algorithmic feeds triggers an instantaneous calm breathing wall.
                </p>
                <div className="bento-metrics-row">
                  <div className="bento-stat">
                    <strong>0 ms</strong>
                    <span>Network Latency</span>
                  </div>
                  <div className="bento-stat">
                    <strong>0</strong>
                    <span>Background VPN Tunnels</span>
                  </div>
                  <div className="bento-stat">
                    <strong>100%</strong>
                    <span>On-Device Intercept</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Fast Capture Engine */}
            <div className="bento-card">
              <div className="bento-card-core">
                <div className="bento-card-top">
                  <div className="bento-icon-box">
                    <Lightning size={20} weight="bold" />
                  </div>
                  <span className="bento-badge">ENGINE 02 // VELOCITY</span>
                </div>
                <h3 className="bento-title">Native V-Sync Fast Capture</h3>
                <p className="bento-desc">
                  Lock-screen quick tiles and home-screen widgets let you record habits or transactions in two physical taps. Jetpack Compose renders every frame inside the 120Hz V-Sync window.
                </p>
                <div className="bento-card-footer">
                  <span className="bento-foot-label">Frame Budget: 16.6ms · 120 FPS</span>
                </div>
              </div>
            </div>

            {/* Card 3: Silicon Keystore */}
            <div className="bento-card">
              <div className="bento-card-core">
                <div className="bento-card-top">
                  <div className="bento-icon-box">
                    <Cpu size={20} weight="bold" />
                  </div>
                  <span className="bento-badge">ENGINE 03 // SECURITY</span>
                </div>
                <h3 className="bento-title">On-Device Silicon KeyStore</h3>
                <p className="bento-desc">
                  Master encryption keys are generated inside your smartphone physical Secure Element (AndroidKeyStore StrongBox). Zero cloud escrow, zero ad SDKs, zero remote data harvesting.
                </p>
                <div className="bento-card-footer">
                  <span className="bento-foot-label">AES-256-GCM Hardware Sealed</span>
                </div>
              </div>
            </div>

            {/* Card 4: 100% Offline SQLCipher (Wide) */}
            <div className="bento-card bento-card--sql">
              <div className="bento-card-core">
                <div className="bento-card-top">
                  <div className="bento-icon-box">
                    <HardDrives size={20} weight="bold" />
                  </div>
                  <span className="bento-badge">ENGINE 04 // PERSISTENCE</span>
                </div>
                <h3 className="bento-title">100% Offline-First SQLCipher Architecture</h3>
                <p className="bento-desc">
                  Zero internet connection required. Operates seamlessly in flight mode, underground transits, or dead zones. Records commit to local SQLCipher SQLite instantly, queueing in a deterministic CRDT outbox until network handshake.
                </p>
                <div className="bento-metrics-row">
                  <div className="bento-stat">
                    <strong>Room v2.6</strong>
                    <span>Encrypted SQLite</span>
                  </div>
                  <div className="bento-stat">
                    <strong>CRDT Outbox</strong>
                    <span>Conflict-Free Sync</span>
                  </div>
                  <div className="bento-stat">
                    <strong>Zero-Wait</strong>
                    <span>Instant Local Writes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: SIDELOAD & INSTALLATION STATION ── */}
        <section className="app-install-section" id="install">
          <div className="app-section-header">
            <span className="app-section-tag">SIDELOAD STATION</span>
            <h2 className="app-section-heading">Running on your phone in three minutes.</h2>
            <p className="app-section-description">
              While in closed tester beta, AIIMIN Android is distributed directly as a verified cryptographic APK binary without middleman gatekeeping.
            </p>
          </div>

          <div className="app-steps-row">
            {INSTALL_STEPS.map(({ step, title, desc, note }) => (
              <div key={step} className="install-step-card">
                <span className="step-num">{step}</span>
                <h4 className="step-title">{title}</h4>
                <p className="step-desc">{desc}</p>
                <span className="step-note">{note}</span>
              </div>
            ))}
          </div>

          <div className="install-notice-bar">
            <Info size={16} color="#749DC4" style={{ flexShrink: 0 }} />
            <span>
              <strong>Restricted Settings Notice (Android 13+):</strong> If Accessibility access for Focus Shield appears greyed out: Go to <em>Settings → Apps → AIIMIN → tap 3 dots (top-right) → Allow restricted settings</em>.
            </span>
          </div>

          {/* Direct Download & Security Box */}
          <div className="install-download-box">
            <div className="download-box-left">
              <span className="download-box-tag">VERIFIED SECURE COMPANION</span>
              <h3 className="download-box-title">aiimin-v2-debug.apk (v2.0.4)</h3>
              <div className="download-security-proofs">
                <span className="security-proof-item">
                  <ShieldCheck size={14} weight="fill" color="#10B981" />
                  Official Signed Binary · Tamper-Evident
                </span>
                <span className="security-proof-item">
                  <LockKey size={14} weight="bold" color="#749DC4" />
                  StrongBox Hardware Keystore
                </span>
                <span className="security-proof-item">
                  <EyeSlash size={14} weight="bold" color="#749DC4" />
                  Zero Cloud SMS Storage
                </span>
              </div>
            </div>
            <div className="download-box-right">
              <a
                href="/aiimin-v2-debug.apk"
                download="aiimin-v2-debug.apk"
                className="cockpit-download-btn"
              >
                <DownloadSimple size={16} weight="bold" />
                <span>Download APK (44.2 MB)</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: TECHNICAL SPECIFICATIONS MANIFEST ── */}
        <section className="app-specs-section" id="specs">
          <div className="app-section-header">
            <span className="app-section-tag">TECHNICAL MANIFEST</span>
            <h2 className="app-section-heading">Built with discipline. Fully transparent.</h2>
            <p className="app-section-description">
              Detailed runtime parameters and cryptographic specifications for engineers and operators.
            </p>
          </div>

          <div className="app-specs-container">
            <div className="specs-table-chrome">
              <div className="specs-chrome-dots">
                <span className="chrome-dot chrome-dot--red" />
                <span className="chrome-dot chrome-dot--yellow" />
                <span className="chrome-dot chrome-dot--green" />
              </div>
              <span className="specs-chrome-label">aiimin-companion-v2.spec.json</span>
            </div>
            <table className="specs-table">
              <tbody>
                {SPECS.map(({ label, value }) => (
                  <tr key={label}>
                    <td className="spec-label">{label}</td>
                    <td className="spec-value">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SECTION 7: ENGINEERING FAQ ── */}
        <section className="app-faq-section" id="faq">
          <div className="app-section-header">
            <span className="app-section-tag">ENGINEERING FAQ</span>
            <h2 className="app-section-heading">Frequently answered questions.</h2>
            <p className="app-section-description">
              Clear answers on architecture, privacy guarantees, battery overhead, and releases.
            </p>
          </div>

          <div className="faq-accordion-list">
            {FAQS.map((faq, i) => (
              <div
                key={faq.q}
                className={`faq-item ${openFaq === i ? 'is-open' : ''}`}
                onClick={() => toggleFaq(i)}
              >
                <div className="faq-question-row">
                  <h4 className="faq-question">{faq.q}</h4>
                  <span className="faq-chevron">
                    {openFaq === i ? <CaretUp size={16} /> : <CaretDown size={16} />}
                  </span>
                </div>
                {openFaq === i && (
                  <p className="faq-answer">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 8: FINAL ACTION CALL ── */}
        <section className="app-cta-section">
          <div className="app-cta-card">
            <div className="cta-card-copy">
              <span className="cta-card-tag">SOVEREIGN EXECUTION</span>
              <h3 className="cta-card-heading">Ready to run your day with precision?</h3>
              <p className="cta-card-sub">
                Download the verified v2.0.4 companion APK directly, or join the founding waitlist for our upcoming Google Play Store release.
              </p>
            </div>
            <div className="cta-card-buttons">
              <a
                href="/aiimin-v2-debug.apk"
                download="aiimin-v2-debug.apk"
                className="cockpit-download-btn"
              >
                <DownloadSimple size={16} weight="bold" />
                <span>Download APK (44.2 MB)</span>
              </a>
              <Link to="/waitlist#waitlist-join" className="app-ghost-btn">
                Join Waitlist Queue
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── COLOPHON FOOTER ── */}
      <footer className="app-footer">
        <div className="footer-statement-block">
          <div className="statement-pill">
            <span className="statement-dot" />
            <span>SOVEREIGN ARCHITECTURE</span>
          </div>
          <h3 className="footer-statement-title">Physical Execution. Zero Intermediaries.</h3>
          <p className="footer-statement-text">
            The anti-dopamine companion for operators who refuse algorithmic capture. Built for fast daily loops, local hardware keystore encryption, and complete physical agency.
          </p>
        </div>

        <div className="footer-grid">
          {/* Col 1: Security Assurance */}
          <div className="footer-col">
            <span className="footer-col-title">01 // SECURITY ASSURANCE</span>
            <div className="footer-security-box">
              <div className="footer-sec-proof">
                <ShieldCheck size={16} weight="fill" color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span className="sec-proof-title">Cryptographically Signed &amp; Verified</span>
                  <p className="sec-proof-sub">Direct developer build with APK Signature Scheme v2 tamper verification.</p>
                </div>
              </div>
              <div className="footer-sec-proof">
                <LockKey size={16} weight="bold" color="#749DC4" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span className="sec-proof-title">StrongBox Hardware Keystore</span>
                  <p className="sec-proof-sub">PIN &amp; biometrics protected by Android KeyStore hardware enclave.</p>
                </div>
              </div>
              <div className="footer-sec-proof">
                <EyeSlash size={16} weight="bold" color="#749DC4" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span className="sec-proof-title">100% On-Device Telemetry</span>
                  <p className="sec-proof-sub">Zero telemetry SDKs, zero ad trackers. Financial SMS stays strictly on device.</p>
                </div>
              </div>
            </div>
            <div className="footer-meta-notes">
              <span>Universal APK · ARM64-v8a + x86_64 · 44.2 MB</span>
              <span>Target: Android 15 (API 35) · Zero Ad Trackers</span>
            </div>
          </div>

          {/* Col 2: Directory */}
          <div className="footer-col">
            <span className="footer-col-title">02 // DIRECTORY</span>
            <ul className="footer-links-list">
              <li><Link to="/"><span className="link-num">01</span> Web Command Center</Link></li>
              <li><Link to="/waitlist"><span className="link-num">02</span> Founding Waitlist</Link></li>
              <li><a href="#install"><span className="link-num">03</span> Android Sideload Guide</a></li>
              <li><a href="#specs"><span className="link-num">04</span> Technical Specifications</a></li>
              <li><a href="#faq"><span className="link-num">05</span> Engineering FAQ</a></li>
              <li><Link to="/brand"><span className="link-num">06</span> Brand Assets</Link></li>
            </ul>
          </div>

          {/* Col 3: Trust & Legal */}
          <div className="footer-col">
            <span className="footer-col-title">03 // PRIVACY GUARANTEE</span>
            <p className="footer-trust-copy">
              Zero Google Analytics. Zero advertising SDKs. All data stays encrypted on your device using hardware keystore encryption.
            </p>
            <div className="footer-legal-row">
              <Link to="/legal/privacy">Privacy Policy</Link>
              <span className="legal-sep">·</span>
              <a href="https://twitter.com/aiimin_in" target="_blank" rel="noopener noreferrer">Twitter / X (@aiimin_in)</a>
              <span className="legal-sep">·</span>
              <a href="mailto:security@aiimin.in">Security</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <ArchBracketMark size={14} pick={DARK_PICK} />
            <span>AIIMIN LABS · ANDROID COMPANION V2.0.4 (BUILD 108)</span>
          </div>
          <div className="footer-bottom-right">
            <span>PRECISION DRAFTING PALETTE</span>
            <span className="legal-sep">·</span>
            <span>OFFLINE SQLCIPHER</span>
            <span className="legal-sep">·</span>
            <span>© 2026 AIIMIN LABS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
