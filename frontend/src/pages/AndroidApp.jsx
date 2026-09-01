import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
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
  Info,
  Desktop,
  Play,
  WifiSlash,
  Lightning,
  Terminal,
  Flame,
  CaretDown,
  CaretUp,
  Cpu,
  ArrowsLeftRight,
  Prohibit,
  Clock,
  Fingerprint,
  HardDrives,
  EyeSlash,
} from '@phosphor-icons/react';
import Wordmark from '../components/brand/Wordmark';
import { ArchBracketMark, DARK_PICK } from '../components/brand/archBracketMark';
import '../styles/appPage.css';

const SHA256_HASH = 'b74d6dd68c2f151c6ce7593be2769581e1eb02e496d4982d58992270451d3993';
const ADB_COMMAND = 'adb install -r aiimin-v2-debug.apk';

const CORE_CAPABILITIES = [
  {
    icon: ShieldCheck,
    title: 'Focus Shield Window Interceptor',
    desc: 'Blocks infinite feed algorithms at the Android window manager level. Opening Instagram, X, or YouTube Shorts instantly routes you to a calm, tactile breathing wall.',
    tag: 'BARRIER // 01',
    metric: 'Zero-VPN · No Background Tunnel',
    spec: 'WindowManager Hook',
  },
  {
    icon: Lightning,
    title: 'Sub-2-Second Lock-Screen Capture',
    desc: 'Log habits, record cash outlays, or capture thoughts in two physical taps from your lock screen, then put your phone face down. Total daily app usage stays under 3 minutes.',
    tag: 'VELOCITY // 02',
    metric: '120Hz Jetpack Compose UI',
    spec: 'Native V-Sync Rendering',
  },
  {
    icon: WifiSlash,
    title: '100% Offline-First SQLCipher',
    desc: 'Operates completely in airplane mode, flights, or zero-connectivity dead zones. Every transaction commits instantly to an encrypted local database and syncs conflict-free upon reconnection.',
    tag: 'SOVEREIGN // 03',
    metric: 'Encrypted SQLite Room v2.6',
    spec: 'CRDT Outbox Sync',
  },
  {
    icon: LockKey,
    title: 'Hardware Silicon Keystore (TEE)',
    desc: 'Master encryption keys are generated and sealed in smartphone physical silicon (AndroidKeyStore StrongBox). Zero third-party analytics, zero ad SDKs, zero cloud telemetry.',
    tag: 'ENCLAVE // 04',
    metric: 'AES-256-GCM Cryptography',
    spec: 'Zero Key Escrow',
  },
];

const SPECS = [
  { label: 'Package Identifier', value: 'in.aiimin.app.v3' },
  { label: 'Release Version', value: '2.0.4-rc (Build 108)' },
  { label: 'UI Architecture', value: 'Native Kotlin · Jetpack Compose (120Hz V-Sync)' },
  { label: 'Target Platform', value: 'Android 15 (API Level 35 Vanilla Ice Cream)' },
  { label: 'Minimum Compatibility', value: 'Android 8.0 Oreo (API Level 26)' },
  { label: 'Local Storage Engine', value: 'SQLCipher v4.5.4 Encrypted SQLite (Room)' },
  { label: 'Cryptographic Enclave', value: 'AndroidKeyStore TEE · AES-256-GCM' },
  { label: 'Binary Footprint', value: '62.8 MB (Universal ARM64-v8a / x86_64)' },
  { label: 'Third-Party Trackers', value: '0 SDKs · Zero Analytics · Zero Ad Beacons' },
  { label: 'Sync Architecture', value: 'Deterministic Conflict-Free Outbox (CRDT)' },
];

const INSTALL_STEPS = [
  {
    step: '01',
    title: 'Download the Verified Binary',
    desc: 'Download the compiled v2.0.4 APK directly to your Android device from our secure release mirror.',
    note: 'Universal APK (~62.8 MB) works across modern ARM64 and x86_64 Android devices.',
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

/* ── INTERACTIVE COMPANION SOFTWARE CONSOLE ── */
function CompanionSoftwareConsole() {
  const [activeTab, setActiveTab] = useState('loop');
  const [habitsDone, setHabitsDone] = useState({ 0: true, 1: true, 2: false });
  // captureState: 'idle' → 'capturing' (150–250 ms framer-motion transitional) → 'captured' (2.4 s) → 'idle'
  const [captureState, setCaptureState] = useState('idle');

  // Focus Shield Interactive State
  const [killsCount, setKillsCount] = useState(18);
  const [recentKills, setRecentKills] = useState([]);
  const [shieldToast, setShieldToast] = useState(null);

  // Money OS Interactive State
  const [runwayBalance, setRunwayBalance] = useState(214500);
  const [dailyBurn, setDailyBurn] = useState(380);
  const [quickSpent, setQuickSpent] = useState(null);

  // Hardware Vault Interactive State
  const [auditStep, setAuditStep] = useState('idle');

  // Dynamic 5D Score Calculation
  const checkedCount = (habitsDone[0] ? 1 : 0) + (habitsDone[1] ? 1 : 0) + (habitsDone[2] ? 1 : 0);
  const currentScore = 76 + checkedCount * 4;
  const arcCircumference = 163.36;
  const strokeDashoffset = (arcCircumference * (1 - currentScore / 100)).toFixed(1);
  const scoreTrend = currentScore >= 84 ? `+${((currentScore - 70) / 4).toFixed(1)}` : `-${((84 - currentScore) / 4).toFixed(1)}`;

  const toggleHabit = (idx) => {
    setHabitsDone((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleQuickCapture = () => {
    if (captureState !== 'idle') return;
    // Transitional 'capturing' state: 200 ms matches fadeInToast curve used across this file
    setCaptureState('capturing');
    setTimeout(() => {
      setCaptureState('captured');
      setTimeout(() => setCaptureState('idle'), 2400);
    }, 200);
  };

  const triggerTestIntercept = () => {
    const apps = [
      { pkg: 'com.instagram.android', name: 'Instagram', reason: 'Infinite Feed Intercepted' },
      { pkg: 'com.twitter.android', name: 'X / Twitter', reason: 'Algorithmic Feed Blocked' },
      { pkg: 'com.google.android.youtube', name: 'YouTube Shorts', reason: 'Dopamine Stream Halted' },
      { pkg: 'com.zhiliaoapp.musically', name: 'TikTok', reason: 'Short-Form Video Intercepted' },
    ];
    const picked = apps[Math.floor(Math.random() * apps.length)];
    setKillsCount((prev) => prev + 1);
    setRecentKills((prev) => [{ ...picked, time: 'Just now', id: Date.now() }, ...prev.slice(0, 1)]);
    setShieldToast(`Focus Shield intercepted ${picked.name} launch intent`);
    setTimeout(() => setShieldToast(null), 3200);
  };

  const handleQuickExpense = (item, amount) => {
    setRunwayBalance((prev) => Math.max(0, prev - amount));
    setDailyBurn((prev) => prev + amount);
    setQuickSpent({ label: item, amount });
    setTimeout(() => setQuickSpent(null), 2400);
  };

  const resetMoney = () => {
    setRunwayBalance(214500);
    setDailyBurn(380);
    setQuickSpent(null);
  };

  const handleVaultAudit = () => {
    setAuditStep('running');
    setTimeout(() => {
      setAuditStep('verified');
      setTimeout(() => setAuditStep('idle'), 4000);
    }, 1300);
  };

  const burnPacePct = Math.min(100, Math.round((dailyBurn / 1200) * 100));
  const runwayDays = Math.round(runwayBalance / (dailyBurn > 0 ? dailyBurn : 1200));

  return (
    <div className="companion-console-card" aria-label="Interactive Companion App Interface">
      {/* Console Mode Selector */}
      <div className="console-nav-bar" role="tablist" aria-label="App mode tabs">
        <button
          type="button"
          role="tab"
          id="tab-loop"
          aria-selected={activeTab === 'loop'}
          aria-controls="panel-loop"
          className={`console-tab-btn ${activeTab === 'loop' ? 'active' : ''}`}
          onClick={() => setActiveTab('loop')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('loop')}
        >
          <span>Daily Loop</span>
        </button>
        <button
          type="button"
          role="tab"
          id="tab-shield"
          aria-selected={activeTab === 'shield'}
          aria-controls="panel-shield"
          className={`console-tab-btn ${activeTab === 'shield' ? 'active' : ''}`}
          onClick={() => setActiveTab('shield')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('shield')}
        >
          <span>Focus Shield</span>
        </button>
        <button
          type="button"
          role="tab"
          id="tab-money"
          aria-selected={activeTab === 'money'}
          aria-controls="panel-money"
          className={`console-tab-btn ${activeTab === 'money' ? 'active' : ''}`}
          onClick={() => setActiveTab('money')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('money')}
        >
          <span>Money OS</span>
        </button>
        <button
          type="button"
          role="tab"
          id="tab-vault"
          aria-selected={activeTab === 'vault'}
          aria-controls="panel-vault"
          className={`console-tab-btn ${activeTab === 'vault' ? 'active' : ''}`}
          onClick={() => setActiveTab('vault')}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('vault')}
        >
          <span>Hardware Vault</span>
        </button>
      </div>

      {/* Screen View Container */}
      <div className="console-screen-body">
        {/* TAB 01: DAILY LOOP */}
        {activeTab === 'loop' && (
          <div
            className="console-view console-view--loop"
            role="tabpanel"
            id="panel-loop"
            aria-labelledby="tab-loop"
          >
            <div className="console-screen-header">
              <div>
                <span className="console-screen-kicker">TELEMETRY // EXECUTION</span>
                <h4 className="console-screen-title">Daily Execution Loop</h4>
              </div>
              <div className="console-screen-brand">
                <ArchBracketMark size={18} pick={DARK_PICK} />
              </div>
            </div>

            {/* 5D Score Cockpit Card */}
            <div className="console-score-card">
              <div className="score-card-meta">
                <span className="score-card-label">5D EQUILIBRIUM COCKPIT</span>
                <div className="score-card-number-row">
                  <strong className="score-card-number">{currentScore}</strong>
                  <span className="score-card-total">/100</span>
                  <span className={`score-card-trend ${currentScore >= 84 ? 'trend-positive' : 'trend-neutral'}`}>
                    {scoreTrend}
                  </span>
                </div>
                <span className="score-card-helper">
                  {checkedCount === 3
                    ? 'All daily targets logged & synchronized'
                    : checkedCount === 2
                    ? '2 of 3 targets completed'
                    : 'Tap checkboxes below to test live calculation'}
                </span>
              </div>

              <div className="score-card-meter">
                <svg className="score-svg-arc" width="56" height="56" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#23272F" strokeWidth="5" />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke="#749DC4"
                    strokeWidth="5"
                    strokeDasharray={arcCircumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)"
                    style={{ transition: 'stroke-dashoffset 350ms cubic-bezier(0.22, 1, 0.36, 1)' }}
                  />
                </svg>
                <span className="score-meter-text">{currentScore}%</span>
              </div>
            </div>

            {/* Dimension Chips */}
            <div className="console-dimension-strip">
              <span className="dim-chip"><span className="dim-axis">FOCUS</span> <span className="dim-val">{habitsDone[0] ? '94%' : '82%'}</span></span>
              <span className="dim-chip"><span className="dim-axis">HEALTH</span> <span className="dim-val">{habitsDone[1] ? '84%' : '72%'}</span></span>
              <span className="dim-chip"><span className="dim-axis">HABITS</span> <span className="dim-val">{habitsDone[2] ? '90%' : '78%'}</span></span>
            </div>

            {/* Habits Checklist */}
            <div className="console-agenda-list">
              <div
                className={`agenda-row ${habitsDone[0] ? 'is-done' : ''}`}
                onClick={() => toggleHabit(0)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleHabit(0)}
                role="button"
                tabIndex={0}
                aria-pressed={habitsDone[0]}
                aria-label={`Deep Work: Core Engineering — ${habitsDone[0] ? 'completed' : 'pending'}`}
              >
                <span className="agenda-checkbox">{habitsDone[0] ? '✓' : ''}</span>
                <div className="agenda-details">
                  <strong>Deep Work: Core Engineering</strong>
                  <span>90m session {habitsDone[0] ? 'completed' : 'pending'}</span>
                </div>
                <span className="agenda-badge"><Flame size={12} weight="fill" color="#F59E0B" /> 14d</span>
              </div>

              <div
                className={`agenda-row ${habitsDone[1] ? 'is-done' : ''}`}
                onClick={() => toggleHabit(1)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleHabit(1)}
                role="button"
                tabIndex={0}
                aria-pressed={habitsDone[1]}
                aria-label={`Zone 2 Aerobic Conditioning — ${habitsDone[1] ? 'completed' : 'pending'}`}
              >
                <span className="agenda-checkbox">{habitsDone[1] ? '✓' : ''}</span>
                <div className="agenda-details">
                  <strong>Zone 2 Aerobic Conditioning</strong>
                  <span>45m cardio {habitsDone[1] ? 'completed' : 'pending'}</span>
                </div>
                <span className="agenda-badge"><Flame size={12} weight="fill" color="#F59E0B" /> 9d</span>
              </div>

              <div
                className={`agenda-row ${habitsDone[2] ? 'is-done' : ''}`}
                onClick={() => toggleHabit(2)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleHabit(2)}
                role="button"
                tabIndex={0}
                aria-pressed={habitsDone[2]}
                aria-label={`Evening Runway & Habit Audit — ${habitsDone[2] ? 'verified' : 'pending'}`}
              >
                <span className="agenda-checkbox">{habitsDone[2] ? '✓' : ''}</span>
                <div className="agenda-details">
                  <strong>Evening Runway &amp; Habit Audit</strong>
                  <span>Sunday check-in {habitsDone[2] ? 'verified' : 'pending'}</span>
                </div>
                <span className="agenda-badge-status">{habitsDone[2] ? 'DONE' : 'DUE'}</span>
              </div>
            </div>

            {/* Quick Capture Button — framer-motion three-state: idle → capturing → captured */}
            <div className="console-quick-fab-wrap">
              <button
                type="button"
                className={`console-quick-fab ${captureState === 'captured' ? 'triggered' : ''} ${captureState === 'capturing' ? 'is-capturing' : ''}`}
                onClick={handleQuickCapture}
                disabled={captureState !== 'idle'}
                aria-busy={captureState === 'capturing'}
                aria-label="Quick log entry to local SQLite database"
              >
                <AnimatePresence mode="wait">
                  {captureState === 'idle' && (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                      + Quick Log Entry
                    </motion.span>
                  )}
                  {captureState === 'capturing' && (
                    <motion.span
                      key="capturing"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                      Writing to SQLite…
                    </motion.span>
                  )}
                  {captureState === 'captured' && (
                    <motion.span
                      key="captured"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                      Committed to SQLite ✓
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        )}

        {/* TAB 02: FOCUS SHIELD */}
        {activeTab === 'shield' && (
          <div className="console-view console-view--shield" role="tabpanel" id="panel-shield" aria-labelledby="tab-shield">
            <div className="shield-status-card">
              <div className="shield-status-head">
                <span className="shield-active-led" />
                <span className="shield-active-text">SYSTEM ACCESSIBILITY INTERCEPTOR</span>
              </div>
              <h4 className="shield-title">Focus Shield Armed</h4>
              <p className="shield-desc">Zero-VPN algorithmic app blocker. Intercepts infinite feeds at the window manager level.</p>
            </div>

            {/* Telemetry Numbers */}
            <div className="shield-metrics-grid">
              <div className="shield-metric-box">
                <strong className="shield-number">{killsCount}</strong>
                <span className="shield-label">Apps Blocked Today</span>
              </div>
              <div className="shield-metric-box">
                <strong className="shield-number">0 ms</strong>
                <span className="shield-label">Network Latency</span>
              </div>
              <div className="shield-metric-box">
                <strong className="shield-number">0</strong>
                <span className="shield-label">Background VPN Tunnels</span>
              </div>
            </div>

            {/* Test Button */}
            <div className="shield-action-row">
              <button
                type="button"
                className="shield-simulate-btn"
                onClick={triggerTestIntercept}
              >
                <Lightning size={13} weight="fill" />
                <span>Simulate App Intercept</span>
              </button>
            </div>

            {shieldToast && (
              <div className="shield-notification">
                <ShieldCheck size={14} weight="bold" color="#10B981" />
                <span>{shieldToast}</span>
              </div>
            )}

            {/* Kill Feed */}
            <div className="shield-feed-list">
              {recentKills.map((kill) => (
                <div key={kill.id} className="feed-item feed-item--blocked feed-item--simulated">
                  <span className="feed-tag">BLOCKED</span>
                  <div className="feed-text">
                    <strong>{kill.name}</strong>
                    <span>{kill.reason} · {kill.time}</span>
                  </div>
                </div>
              ))}
              <div className="feed-item feed-item--blocked">
                <span className="feed-tag">BLOCKED</span>
                <div className="feed-text">
                  <strong>Instagram</strong>
                  <span>8 launch attempts blocked instantly</span>
                </div>
              </div>
              <div className="feed-item feed-item--blocked">
                <span className="feed-tag">BLOCKED</span>
                <div className="feed-text">
                  <strong>X / Twitter</strong>
                  <span>7 launch attempts blocked instantly</span>
                </div>
              </div>
              <div className="feed-item feed-item--allowed">
                <span className="feed-tag-allow">ALLOWED</span>
                <div className="feed-text">
                  <strong>AIIMIN Life OS</strong>
                  <span>Native companion execution terminal</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 03: MONEY OS */}
        {activeTab === 'money' && (
          <div className="console-view console-view--money" role="tabpanel" id="panel-money" aria-labelledby="tab-money">
            <div className="money-status-card">
              <div className="money-head-row">
                <span className="money-label">LIQUID RUNWAY</span>
                {dailyBurn !== 380 && (
                  <button type="button" className="money-reset-link" onClick={resetMoney}>
                    ↺ Reset Balance
                  </button>
                )}
              </div>
              <div className="money-value-row">
                <strong className="money-value">₹{runwayBalance.toLocaleString('en-IN')}</strong>
                <span className="money-days-badge">{runwayDays} Days Runway</span>
              </div>
            </div>

            {/* Burn Pace Bar */}
            <div className="money-burn-card">
              <div className="burn-label-row">
                <span className="burn-title">Daily Spending Pace</span>
                <strong className="burn-stat">₹{dailyBurn} / ₹1,200</strong>
              </div>
              <div className="burn-track">
                <div
                  className="burn-fill"
                  style={{
                    width: `${burnPacePct}%`,
                    background: burnPacePct > 80 ? '#F59E0B' : '#749DC4',
                  }}
                />
              </div>
              <span className="burn-helper">
                {100 - burnPacePct > 0
                  ? `${100 - burnPacePct}% daily spending buffer intact`
                  : 'Daily budget limit reached'}
              </span>
            </div>

            {/* Quick Logging Buttons */}
            <div className="money-actions-block">
              <span className="money-action-title">ONE-TAP EXPENSE LOGGING</span>
              <div className="money-buttons-grid">
                <button
                  type="button"
                  className="money-tap-btn"
                  onClick={() => handleQuickExpense('Espresso', 80)}
                >
                  <span>☕ Espresso</span>
                  <strong>₹80</strong>
                </button>
                <button
                  type="button"
                  className="money-tap-btn"
                  onClick={() => handleQuickExpense('Fuel / Metro', 240)}
                >
                  <span>⛽ Fuel / Metro</span>
                  <strong>₹240</strong>
                </button>
                <button
                  type="button"
                  className="money-tap-btn"
                  onClick={() => handleQuickExpense('Groceries', 450)}
                >
                  <span>🥗 Nutrition</span>
                  <strong>₹450</strong>
                </button>
              </div>

              {quickSpent && (
                <div className="money-receipt-toast">
                  <CheckCircle size={13} color="#10B981" weight="bold" />
                  <span>Logged {quickSpent.label} (₹{quickSpent.amount}) to local database</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 04: HARDWARE VAULT */}
        {activeTab === 'vault' && (
          <div className="console-view console-view--vault" role="tabpanel" id="panel-vault" aria-labelledby="tab-vault">
            <div className="vault-status-header">
              <span className="vault-kicker">ON-DEVICE CRYPTOGRAPHY</span>
              <h4 className="vault-title">Hardware Vault</h4>
              <p className="vault-desc">Your database is encrypted with keys sealed in physical smartphone silicon.</p>
            </div>

            <div className="vault-details-grid">
              <div className="vault-info-box">
                <span className="vault-info-lbl">Key Storage</span>
                <strong className="vault-info-val">AndroidKeyStore TEE</strong>
              </div>
              <div className="vault-info-box">
                <span className="vault-info-lbl">Cipher Suite</span>
                <strong className="vault-info-val">AES-256-GCM</strong>
              </div>
              <div className="vault-info-box">
                <span className="vault-info-lbl">Local Database</span>
                <strong className="vault-info-val">SQLCipher v4.5.4</strong>
              </div>
              <div className="vault-info-box">
                <span className="vault-info-lbl">Pending Outbox</span>
                <strong className="vault-info-val val-green">0 (Synced)</strong>
              </div>
            </div>

            {/* Audit history disclosure — honest state: no real device audit has run in this demo */}
            {auditStep === 'idle' && (
              <div className="vault-audit-history-note">
                <Info size={12} color="#64748B" />
                <span>First audit runs on next app launch</span>
              </div>
            )}

            {/* Audit Trigger */}
            <div className="vault-audit-wrap">
              <button
                type="button"
                className={`vault-audit-trigger ${auditStep !== 'idle' ? 'is-active' : ''}`}
                onClick={handleVaultAudit}
                disabled={auditStep !== 'idle'}
                aria-label="Verify Hardware Keystore integrity"
              >
                <LockKey size={13} weight="bold" />
                <span>
                  {auditStep === 'idle' && 'Verify Hardware Keystore'}
                  {auditStep === 'running' && 'Probing Secure Element…'}
                  {auditStep === 'verified' && 'Hardware Keystore Sealed ✓'}
                </span>
              </button>
            </div>

            {auditStep === 'verified' && (
              <div className="vault-audit-receipt-card">
                <strong className="receipt-status">HARDWARE ENCLAVE VERIFIED</strong>
                <span className="receipt-text">Keystore: AndroidKeyStore Hardware StrongBox</span>
                <span className="receipt-text">Socket Audit: 0 open third-party connections</span>
              </div>
            )}

            <div className="vault-checklist">
              <div className="vault-check-item">
                <CheckCircle size={13} color="#10B981" weight="bold" />
                <span>Zero analytics SDKs or remote trackers</span>
              </div>
              <div className="vault-check-item">
                <CheckCircle size={13} color="#10B981" weight="bold" />
                <span>Encrypted-at-rest SQLite database</span>
              </div>
              <div className="vault-check-item">
                <CheckCircle size={13} color="#10B981" weight="bold" />
                <span>Biometric authentication on device</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AndroidApp() {
  const [downloading, setDownloading] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedAdb, setCopiedAdb] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(SHA256_HASH);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2200);
  };

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
      <Helmet>
        <title>AIIMIN Android Companion — Physical Capture App</title>
        <meta
          name="description"
          content="The native Android companion app for AIIMIN Life OS. Instant habit capture, offline-first SQLite database, app blocker focus shield, and local AES-256 encryption."
        />
        <link rel="canonical" href="https://aiimin.in/app" />
        <meta property="og:title" content="AIIMIN Android Companion — Native Physical Capture" />
        <meta property="og:description" content="Companion app for AIIMIN Life OS. Native V-Sync rendering, 100% offline habit logging, app blocker focus shield, and local AES-256 encryption." />
        <meta property="og:url" content="https://aiimin.in/app" />
        <meta property="og:type" content="website" />
      </Helmet>

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
              <span>Get APK (v2.0.4)</span>
            </a>
          </div>
        </div>
      </header>

      <main className="app-main-content">
        {/* ── SECTION 1: HERO ── */}
        <section className="app-hero-section">
          <div className="app-hero-grid">
            {/* Left: Copy & Actions */}
            <div className="app-hero-copy">
              <div className="app-status-badge">
                <span className="status-dot" />
                <span>BUILD // COMPANION V2.0.4 · ANDROID 15 COMPILED</span>
              </div>

              <h1 className="app-hero-title">
                Capture in seconds.<br />
                <span className="hero-title-accent">Back to the physical world.</span>
              </h1>

              <p className="app-hero-sub">
                Desktop is your command center for macro planning and weekly reviews. The Android companion is built for speed: log a habit, record an expense, arm your focus shield, and put your phone face down in under two seconds.
              </p>

              <div className="app-hero-actions">
                <a
                  href="/aiimin-v2-debug.apk"
                  download="aiimin-v2-debug.apk"
                  className={`app-primary-btn ${downloading ? 'is-loading' : ''}`}
                  onClick={() => {
                    setDownloading(true);
                    setTimeout(() => setDownloading(false), 3000);
                  }}
                >
                  <DownloadSimple size={16} weight="bold" />
                  <span>{downloading ? 'Downloading APK…' : 'Download APK (62.8 MB)'}</span>
                </a>
                <a href="#install" className="app-ghost-btn">
                  <Play size={13} weight="fill" />
                  <span>Install Guide</span>
                </a>
              </div>

              {/* Trust Bar */}
              <div className="app-trust-strip">
                <span>100% Offline-First</span>
                <span className="trust-sep">·</span>
                <span>Zero Ads or Trackers</span>
                <span className="trust-sep">·</span>
                <span>Local AES-256 Vault</span>
                <span className="trust-sep">·</span>
                <span>Native Jetpack Compose</span>
              </div>
            </div>

            {/* Right: Interactive Companion Software Console */}
            <div className="app-hero-console">
              <CompanionSoftwareConsole />

              {/* Sideload Quick-Command Box */}
              <div className="adb-quick-card">
                <div className="adb-card-head">
                  <div className="adb-title-row">
                    <Terminal size={14} color="#749DC4" weight="bold" />
                    <span className="adb-title">Developer Fast Sideload</span>
                  </div>
                  <span className="adb-badge">ARM64 + x86_64</span>
                </div>

                <div className="adb-command-box">
                  <code>{ADB_COMMAND}</code>
                  <button
                    type="button"
                    className="adb-copy-btn"
                    onClick={handleCopyAdb}
                    title="Copy command"
                  >
                    {copiedAdb ? <Check size={12} color="#10B981" weight="bold" /> : <Copy size={12} />}
                    <span>{copiedAdb ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
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
                  <span className="contrast-bullet trap-bullet">✕</span>
                  <div>
                    <strong>4h 38m average daily screen time</strong>
                    <span>Lost to variable-reward algorithmic feeds and autoplay loops</span>
                  </div>
                </li>
                <li>
                  <span className="contrast-bullet trap-bullet">✕</span>
                  <div>
                    <strong>96 reflexive unlocks per day</strong>
                    <span>Triggered by notification badges designed to exploit social anxiety</span>
                  </div>
                </li>
                <li>
                  <span className="contrast-bullet trap-bullet">✕</span>
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
                  <span className="contrast-bullet antidote-bullet">✓</span>
                  <div>
                    <strong>Under 3 minutes total daily usage</strong>
                    <span>Get in, capture habit or expense, put phone face down</span>
                  </div>
                </li>
                <li>
                  <span className="contrast-bullet antidote-bullet">✓</span>
                  <div>
                    <strong>Native Focus Shield barrier</strong>
                    <span>Blocks doomscrolling apps at the Android window manager level</span>
                  </div>
                </li>
                <li>
                  <span className="contrast-bullet antidote-bullet">✓</span>
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
                    <WifiSlash size={20} weight="bold" />
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

          {/* Direct Download & Verification Box */}
          <div className="install-download-box">
            <div className="download-box-left">
              <span className="download-box-tag">VERIFIED CRYPTOGRAPHIC RELEASE</span>
              <h3 className="download-box-title">aiimin-v2-debug.apk (v2.0.4)</h3>
              <div className="sha-hash-row">
                <span className="sha-label">SHA-256:</span>
                <code className="sha-string">{SHA256_HASH}</code>
                <button
                  type="button"
                  className="sha-copy-action"
                  onClick={handleCopyHash}
                  title="Copy checksum"
                >
                  {copiedHash ? <Check size={12} color="#10B981" weight="bold" /> : <Copy size={12} />}
                  <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <div className="download-box-right">
              <a
                href="/aiimin-v2-debug.apk"
                download="aiimin-v2-debug.apk"
                className="app-primary-btn"
              >
                <DownloadSimple size={15} weight="bold" />
                <span>Download APK (62.8 MB)</span>
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
                className="app-primary-btn"
              >
                <DownloadSimple size={15} weight="bold" />
                <span>Download APK (62.8 MB)</span>
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
          {/* Col 1: Binary Checksum */}
          <div className="footer-col">
            <span className="footer-col-title">01 // VERIFIED CHECKSUM</span>
            <div className="footer-checksum-box">
              <span className="checksum-title">SHA-256 RELEASE CHECKSUM</span>
              <code className="checksum-code">{SHA256_HASH}</code>
              <button
                type="button"
                className="checksum-copy-btn"
                onClick={handleCopyHash}
              >
                {copiedHash ? <Check size={11} color="#10B981" weight="bold" /> : <Copy size={11} />}
                <span>{copiedHash ? 'Checksum Copied' : 'Copy Checksum'}</span>
              </button>
            </div>
            <div className="footer-meta-notes">
              <span>Universal APK · ARM64-v8a + x86_64 · 62.8 MB</span>
              <span>Target: Android 15 (API 35) · Compiled via Kotlin 2.0</span>
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
