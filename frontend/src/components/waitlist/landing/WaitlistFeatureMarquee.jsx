import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowsClockwise,
  Gauge,
  Lightning,
  Wallet,
  ShieldCheck,
  ChartLineUp,
  BookOpen,
  Fire,
  SunHorizon,
  Camera,
  Trophy,
  CalendarCheck,
  LockKey,
  DeviceMobile,
  WifiSlash,
  Key,
  Cpu,
  Tag,
  Smiley,
  Moon,
  BellSimple,
  Wrench,
  Folders,
  X,
  CaretLeft,
  CaretRight,
  ArrowUpRight,
  Sparkle,
} from '@phosphor-icons/react';

export const ALL_FEATURES = [
  {
    id: 'daily-loop',
    label: 'Daily Loop',
    tag: 'CORE',
    subsystem: 'LIFECYCLE MACHINE',
    icon: ArrowsClockwise,
    accent: '#749dc4',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core (Free Forever)',
    summary: 'The unified 24-hour cadence linking your morning agenda, active execution sprints, and night debrief into a continuous state machine.',
    deepDive: 'Instead of disjointed todo lists that accumulate guilt and abandon context, the Daily Loop operates as a closed-loop execution protocol. Incomplete priorities require conscious evening triage, rollover debt is calculated explicitly, and daily momentum scores calibrate every midnight.',
    specs: {
      runtime: 'Deterministic State Loop',
      privacy: 'Local-First Persistence',
      sync: 'Sub-16ms Realtime Event Bus',
      status: 'Core Subsystem',
    },
  },
  {
    id: 'life-score',
    label: '5D Life Score',
    tag: 'INTEL',
    subsystem: 'EQUILIBRIUM ENGINE',
    icon: Gauge,
    accent: '#10b981',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core & Pro',
    summary: 'A holistic 0–100 equilibrium metric calculating real-time balance across Focus, Capital Runway, Physical Recovery, Habit Integrity, and Emotional Equilibrium.',
    deepDive: 'Productivity without equilibrium is just accelerated burnout. The 5D Life Score uses multi-variate modeling to reveal hidden lag effects: how two consecutive nights of 5-hour sleep degrade deep-work velocity 36 hours later, or how weekend financial leaks destabilize weekday calm.',
    specs: {
      runtime: 'Multi-Variate Equation',
      privacy: 'Client-Side Local Compute',
      sync: 'Cached Vector State',
      status: 'Algorithmic Model',
    },
  },
  {
    id: 'discipline-engine',
    label: 'Discipline Engine',
    tag: 'SYSTEM',
    subsystem: 'INERTIA BREAKER',
    icon: Lightning,
    accent: '#ff6b35',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core (Free Forever)',
    summary: 'Algorithmic friction counteracting procrastination through velocity-decay detection and adaptive cognitive load scaling.',
    deepDive: 'Monitors real-time task completion intervals and hesitation pauses. When cognitive resistance or task stalling is detected, the engine dynamically decomposes intimidating objectives into micro-actions or triggers focused countdown sprints to restore operational momentum.',
    specs: {
      runtime: 'Hesitation Decay Heuristic',
      privacy: 'Zero Telemetry Leaks',
      sync: 'Immediate Reactive Bus',
      status: 'Realtime Trigger',
    },
  },
  {
    id: 'money-os',
    label: 'Money OS',
    tag: 'FINANCE',
    subsystem: 'RUNWAY SIMULATOR',
    icon: Wallet,
    accent: '#749dc4',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core & Pro',
    summary: 'Personal financial command station tracking daily burn rate, liquid runway in days, and capital preservation without invasive bank scraping.',
    deepDive: 'Treats personal capital as flight fuel for your life rather than backward-looking bookkeeping. Calculates your true survival and comfort runways against recurring fixed commitments, simulating how every discretionary purchase affects your financial independence date.',
    specs: {
      runtime: 'Deterministic Double-Entry',
      privacy: 'Encrypted-at-Rest SQLite',
      sync: 'Zero-Knowledge Outbox',
      status: 'Financial Ledger',
    },
  },
  {
    id: 'focus-shield',
    label: 'Focus Shield',
    tag: 'FOCUS',
    subsystem: 'COGNITIVE INTERCEPT',
    icon: ShieldCheck,
    accent: '#ff6b35',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core & Pro',
    summary: 'System-level distraction defense blocking algorithmic feed hijacking during designated high-value focus windows.',
    deepDive: 'Operates as an intentional barrier between your focus and dopamine-engineered feeds. On Android, Focus Shield intercepts notification banners and introduces mindful friction delays; on desktop, it locks down workspace tabs and logs distraction attempts into your focus integrity score.',
    specs: {
      runtime: 'Android Accessibility + Web Guard',
      privacy: 'Local Process Sandboxing',
      sync: 'Instant Intercept Dispatch',
      status: 'Active Shield',
    },
  },
  {
    id: 'correlations',
    label: '5D Correlations',
    tag: 'INTEL',
    subsystem: 'PATTERN MINING',
    icon: ChartLineUp,
    accent: '#10b981',
    platform: 'Web Desktop OS',
    tier: 'Pro Founding & Elite',
    summary: 'Cross-domain statistical mining discovering non-obvious causal links between your daily habits, spending patterns, sleep quality, and focus hours.',
    deepDive: 'Surfaces mathematical truths you would never notice in isolated apps: "Your focus duration increases 48% on days following morning workouts" or "Late-night discretionary spending surges 3.4x when daily sleep falls below 6 hours". Runs fully on-device without cloud profiling.',
    specs: {
      runtime: 'Pearson / Spearman Matrix',
      privacy: 'Zero Cloud Profiling',
      sync: 'Weekly Synthesis Run',
      status: 'Statistical Model',
    },
  },
  {
    id: 'journal-packs',
    label: 'Journal Packs',
    tag: 'HABIT',
    subsystem: 'COGNITIVE ARCHIVE',
    icon: BookOpen,
    accent: '#749dc4',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core & Pro',
    summary: 'Structured, scientifically structured journaling frameworks built for high-stakes decision audits, evening debriefs, and stoic clarity.',
    deepDive: 'Eliminates blank-canvas paralysis with battle-tested reflection frameworks (Seneca evening balance, Ray Dalio error logs, Charlie Munger inversion sheets). Entries are indexed for instant semantic retrieval, allowing you to review historical mindsets before major decisions.',
    specs: {
      runtime: 'Semantic Markdown Engine',
      privacy: 'AES-256 Vault Encrypted',
      sync: 'Full-Text Local Index',
      status: 'Reflective System',
    },
  },
  {
    id: 'habit-streaks',
    label: 'Habit Streaks',
    tag: 'SYSTEM',
    subsystem: 'ELASTIC MOMENTUM',
    icon: Fire,
    accent: '#ff6b35',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core (Free Forever)',
    summary: 'Resilient habit engine powered by momentum physics rather than fragile binary streak death that causes users to quit.',
    deepDive: 'Conventional apps reset months of discipline to zero over one unavoidable missed day, triggering guilt and abandonment. AIIMIN employs elastic decay: a missed day reduces momentum by a calculated fraction, giving you clear runway to bounce back without losing identity.',
    specs: {
      runtime: 'Elastic Momentum Equation',
      privacy: 'Local SQLite Records',
      sync: 'Conflict-Free Sync',
      status: 'Habit Pipeline',
    },
  },
  {
    id: 'morning-brief',
    label: 'Morning Brief',
    tag: 'CORE',
    subsystem: 'EXECUTIVE DISPATCH',
    icon: SunHorizon,
    accent: '#749dc4',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core (Free Forever)',
    summary: 'High-density 60-second operational dispatch delivered before your morning starts, compiling top priorities, financial runway, and rest metrics.',
    deepDive: 'Synthesized silently before you awake. Replaces morning notification panic with structured operational command: reviews critical deadlines, flags calendar friction, summarizes sleep recovery, and locks in your top 3 non-negotiable targets for the day.',
    specs: {
      runtime: 'Pre-Computed Dispatch Job',
      privacy: '100% On-Device Compilation',
      sync: 'Zero-Latency Morning Render',
      status: 'Daily Briefing',
    },
  },
  {
    id: 'ivory-snapshot',
    label: 'Ivory Snapshot',
    tag: 'RECAP',
    subsystem: 'CARD GENERATOR',
    icon: Camera,
    accent: '#416180',
    platform: 'Web Desktop OS',
    tier: 'Included in Pro & Elite',
    summary: 'Architectural visual milestone generation transforming weekly and monthly performance data into publication-grade vector cards.',
    deepDive: 'Generates high-contrast, minimalist infographics of your personal momentum, habit consistency, and focus blocks. Designed for high-clarity personal reflection or sharing with accountability partners without exposing sensitive raw data.',
    specs: {
      runtime: 'Client-Side Canvas / SVG Gen',
      privacy: 'Rendered On-Device',
      sync: 'Vector Export (PDF/PNG)',
      status: 'Visual Compiler',
    },
  },
  {
    id: 'sports-briefing',
    label: 'Sports Briefing',
    tag: 'BRIEF',
    subsystem: 'NOISELESS FEED',
    icon: Trophy,
    accent: '#749dc4',
    platform: 'Web Desktop OS',
    tier: 'Included in Core & Pro',
    summary: 'Distraction-free athletic updates with zero algorithmic clickbait, betting advertisements, or endless social commentary loops.',
    deepDive: 'Allows passionate fans to stay informed without falling victim to 45-minute dopamine traps on algorithmic sports sites. Delivers crisp match scores, league tables, and schedule alerts directly into your executive briefing console.',
    specs: {
      runtime: 'Aggregated Feed Ingestion',
      privacy: 'No Ad Trackers or Cookies',
      sync: 'Cached 15m Poll Interval',
      status: 'Intel Feed',
    },
  },
  {
    id: 'weekly-review',
    label: 'Weekly Review',
    tag: 'REVIEW',
    subsystem: 'STRATEGIC AUDIT',
    icon: CalendarCheck,
    accent: '#10b981',
    platform: 'Web Desktop OS',
    tier: 'Included in Core (Free Forever)',
    summary: 'Structured Sunday calibration ritual reconciling completed execution, budget variances, habit fidelity, and next-week strategy.',
    deepDive: 'The anchor that prevents weeks from blurring into chaotic months. Pre-populates completed milestones versus initial commitments, pinpoints the exact day your energy dipped, and guides a 15-minute strategic review to enter Monday with clarity.',
    specs: {
      runtime: 'Delta Compilation Pipeline',
      privacy: 'Encrypted Weekly Snapshots',
      sync: 'Sunday Scheduled Trigger',
      status: 'Audit Protocol',
    },
  },
  {
    id: 'aes-vault',
    label: 'AES-256 Vault',
    tag: 'SEC',
    subsystem: 'ZERO-KNOWLEDGE VAULT',
    icon: LockKey,
    accent: '#10b981',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core & Pro',
    summary: 'Military-grade cryptographic enclave ensuring your journals, transactions, and reflections remain strictly sovereign and mathematically indecipherable.',
    deepDive: 'Personal reflections and financial records are encrypted using AES-256-GCM before ever leaving your device. Decryption keys are derived on-client and never stored in plain text; even if our servers were subpoenaed or breached, your records remain impenetrable math.',
    specs: {
      runtime: 'AES-256-GCM / PBKDF2 Key Deriv',
      privacy: 'Zero-Knowledge Architecture',
      sync: 'Encrypted Blob Replication',
      status: 'Cryptographic Core',
    },
  },
  {
    id: 'android-native',
    label: 'Android V2 Native',
    tag: 'MOBILE',
    subsystem: 'SYSTEM COMPANION',
    icon: DeviceMobile,
    accent: '#ff6b35',
    platform: 'Native Android Companion',
    tier: 'Available to All Waitlist Testers',
    summary: 'Sub-100ms native companion engineered in Kotlin & Jetpack Compose specifically for swift, disciplined capture on the move.',
    deepDive: 'Built strictly for capture, not consumption. Zero social feeds, zero algorithmic recommendations, and zero infinite scrolls. Designed for sub-5-second capture: log an unexpected expense, check off a discipline loop, or dictate a thought without triggering phone addiction.',
    specs: {
      runtime: 'Kotlin / Jetpack Compose',
      privacy: 'Hardware Keystore Sandboxing',
      sync: 'Background WorkManager Sync',
      status: 'Companion Engine',
    },
  },
  {
    id: 'offline-sqlite',
    label: 'Offline-First SQLite',
    tag: 'ENGINE',
    subsystem: 'LOCAL PERSISTENCE',
    icon: WifiSlash,
    accent: '#749dc4',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core (Free Forever)',
    summary: 'Fully autonomous embedded database providing 100% functionality on flights, subways, and off-grid remote settings.',
    deepDive: 'Never presents a loading spinner or blocks an action due to spotty cellular reception. Reads and writes execute instantaneously against your local SQLite database, maintaining an immutable append-only mutation log that reconciles cleanly once connectivity resumes.',
    specs: {
      runtime: 'Embedded SQLite / Room Architecture',
      privacy: 'Local Device Boundary',
      sync: 'Two-Way Rebase CRDT',
      status: 'Storage Engine',
    },
  },
  {
    id: 'hardware-keystore',
    label: 'Hardware Vault',
    tag: 'SEC',
    subsystem: 'SILICON ENCLAVE',
    icon: Key,
    accent: '#10b981',
    platform: 'Android Companion V2',
    tier: 'Included in Core & Pro',
    summary: 'Hardware-anchored security binding master authentication credentials to your physical smartphone Secure Enclave / TEE chip.',
    deepDive: 'Uses AndroidKeyStore to generate and isolate asymmetric cryptographic keys within hardware-backed security coprocessors. Encryption keys never enter application RAM and cannot be exported or scraped even on rooted devices.',
    specs: {
      runtime: 'AndroidKeyStore / TEE Hardware',
      privacy: 'Silicon Hardware Isolation',
      sync: 'Per-Device Silicon Binding',
      status: 'Silicon Security',
    },
  },
  {
    id: 'behavioral-engine',
    label: 'Behavioral Engine',
    tag: 'SYSTEM',
    subsystem: 'CIRCADIAN ADAPTATION',
    icon: Cpu,
    accent: '#749dc4',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Pro & Elite',
    summary: 'Cognitive machine learning mapping your unique circadian productivity curve, energy ceilings, and procrastination thresholds.',
    deepDive: 'Analyzes longitudinal completion rates to uncover your personal ultradian rhythms. It flags when you are scheduling deep creative work during predictable afternoon energy slumps, advising task swaps that preserve cognitive endurance.',
    specs: {
      runtime: 'Bayesian Behavioral Classifier',
      privacy: '100% On-Device Parameter Tuning',
      sync: 'Rolling 30-Day Context',
      status: 'Adaptive Engine',
    },
  },
  {
    id: 'auto-categorization',
    label: 'Auto-Categorization',
    tag: 'AI',
    subsystem: 'SEMANTIC ROUTER',
    icon: Tag,
    accent: '#416180',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core & Pro',
    summary: 'Context-aware semantic parser instantly transforming natural-language quick capture into structured life OS entries.',
    deepDive: 'Speak or type: "Met Vikram over lunch ₹680 discussing Q3 marketing roadmap" — the router isolates ₹680 under Dining, assigns the contact tag Vikram, and creates a prioritized Q3 Marketing action item in your active workspace.',
    specs: {
      runtime: 'High-Speed Edge NLP Parser',
      privacy: 'Local Text Classification',
      sync: 'Zero-Delay Parsing',
      status: 'Routing Service',
    },
  },
  {
    id: 'mood-tracking',
    label: 'Mood Tracking',
    tag: 'HEALTH',
    subsystem: 'VALENCE MATRIX',
    icon: Smiley,
    accent: '#ff6b35',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core (Free Forever)',
    summary: 'Two-second valence-arousal micro checkins capturing psychological energy states and emotional equilibrium.',
    deepDive: 'Replaces tedious surveys with a rapid 2-dimensional coordinate check: Energy vs Pleasantness. Quantifies subtle emotional patterns over time and links mood dips directly to consecutive focus marathons or financial volatility.',
    specs: {
      runtime: 'Circumplex Valence Model',
      privacy: 'Local Encrypted Metrics',
      sync: 'Immediate State Calculation',
      status: 'Equilibrium Metric',
    },
  },
  {
    id: 'sleep-cycles',
    label: 'Sleep Cycles',
    tag: 'HEALTH',
    subsystem: 'RECOVERY TELEMETRY',
    icon: Moon,
    accent: '#749dc4',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core & Pro',
    summary: 'Tracks cumulative sleep debt and recovery consistency to realistically calibrate daily focus and workload expectations.',
    deepDive: 'Computes a rolling 14-day cumulative sleep debt score. If your sleep deficit exceeds 3.5 hours, the system automatically suggests rescheduling intense cognitive deliverables, preventing the chronic fatigue spiral before it sets in.',
    specs: {
      runtime: 'Rolling Cumulative Debt Model',
      privacy: 'Encrypted Health Storage',
      sync: 'Morning Automated Evaluation',
      status: 'Recovery Tracking',
    },
  },
  {
    id: 'runway-alerts',
    label: 'Runway Alerts',
    tag: 'FINANCE',
    subsystem: 'VELOCITY SENTINEL',
    icon: BellSimple,
    accent: '#ff6b35',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Pro & Elite',
    summary: 'Predictive cash velocity alerts warning of sudden burn increases before they jeopardize your financial survival cushion.',
    deepDive: 'Detects unusual micro-spending spikes and recurring subscription creep. Translates immediate financial decisions into tangible life runway: "This impulse spend reduces your runway by 4.2 days," restoring immediate rational discipline.',
    specs: {
      runtime: 'Velocity Outlier Detection',
      privacy: 'Zero Third-Party Financial Sharing',
      sync: 'Realtime Threshold Checks',
      status: 'Sentinel Daemon',
    },
  },
  {
    id: 'streak-repair',
    label: 'Streak Repair',
    tag: 'HABIT',
    subsystem: 'GRACE PROTOCOL',
    icon: Wrench,
    accent: '#10b981',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core & Pro',
    summary: 'Earnable immunity tokens and restorative challenges protecting genuine discipline from arbitrary resets during life emergencies.',
    deepDive: 'Travel, sickness, and emergencies shouldn’t punish a disciplined builder. Complete targeted catch-up challenges or redeem earned immunity tokens to safeguard your momentum, keeping self-efficacy high when life interrupts.',
    specs: {
      runtime: 'Restorative Protocol Logic',
      privacy: 'Local Cryptographic Ledger',
      sync: 'Deterministic Grace Verification',
      status: 'Resilience System',
    },
  },
  {
    id: 'deterministic-sync',
    label: 'Deterministic Sync',
    tag: 'DATA',
    subsystem: 'CRDT PROTOCOL',
    icon: Folders,
    accent: '#749dc4',
    platform: 'Web Desktop OS + Android Companion',
    tier: 'Included in Core (Free Forever)',
    summary: 'Conflict-free replicated data types ensuring seamless, zero-overwrite multi-device synchronization across Web and Android.',
    deepDive: 'Whether editing an entry on your desktop in Mumbai or checking off a task on your Android while offline in an airplane, state changes are serialized into mathematically sound CRDT operations that merge cleanly without merge conflicts.',
    specs: {
      runtime: 'CRDT Vector Clock Reconciler',
      privacy: 'End-to-End Encrypted Transport',
      sync: 'Zero-Conflict Eventual Consistency',
      status: 'Data Backbone',
    },
  },
];

const ROW_1 = ALL_FEATURES.slice(0, 12);
const ROW_2 = ALL_FEATURES.slice(12);

export default function WaitlistFeatureMarquee() {
  const [activeFeature, setActiveFeature] = useState(null);

  const row1Doubled = [...ROW_1, ...ROW_1];
  const row2Doubled = [...ROW_2, ...ROW_2];

  const activeIndex = activeFeature ? ALL_FEATURES.findIndex((f) => f.id === activeFeature.id) : -1;

  const handlePrev = useCallback(() => {
    if (activeIndex === -1) return;
    const prevIdx = (activeIndex - 1 + ALL_FEATURES.length) % ALL_FEATURES.length;
    setActiveFeature(ALL_FEATURES[prevIdx]);
  }, [activeIndex]);

  const handleNext = useCallback(() => {
    if (activeIndex === -1) return;
    const nextIdx = (activeIndex + 1) % ALL_FEATURES.length;
    setActiveFeature(ALL_FEATURES[nextIdx]);
  }, [activeIndex]);

  // Keyboard navigation for inspector
  useEffect(() => {
    if (!activeFeature) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveFeature(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFeature, handlePrev, handleNext]);

  const handleJoinClick = (e) => {
    e.preventDefault();
    setActiveFeature(null);
    const target = document.getElementById('waitlist-join') || document.querySelector('.waitlist-hero-form');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      const input = target.querySelector('input[type="email"]');
      if (input) {
        setTimeout(() => input.focus(), 300);
      }
    }
  };

  return (
    <section className="waitlist-marquee-section" aria-label="Operating system architecture">
      {/* Header bar giving clear context & hinting at clickability */}
      <div className="waitlist-marquee-header">
        <div className="waitlist-marquee-header-left">
          <span className="waitlist-marquee-live-dot" />
          <span className="waitlist-marquee-title">SYSTEM ARCHITECTURE MATRIX</span>
          <span className="waitlist-marquee-count">23 NATIVE SUBSYSTEMS</span>
        </div>
        <div className="waitlist-marquee-header-right">
          <span className="waitlist-marquee-interactive-hint">
            <Sparkle size={12} weight="fill" className="interactive-hint-sparkle" />
            Click any module to inspect architecture
          </span>
        </div>
      </div>

      <div className="waitlist-feature-marquee">
        {/* Row 1: Forward */}
        <div className="waitlist-feature-marquee-row waitlist-feature-marquee-row--fwd">
          {row1Doubled.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={`r1-${i}`}
                className="waitlist-feature-chip"
                style={{ '--chip-accent': item.accent }}
                onClick={() => setActiveFeature(item)}
                aria-haspopup="dialog"
                aria-label={`Inspect ${item.label} architecture`}
              >
                <span className="feature-chip-tag" style={{ color: item.accent }}>
                  {item.tag}
                </span>
                <span className="feature-chip-icon" style={{ color: item.accent }}>
                  <Icon size={14} weight="bold" />
                </span>
                <span className="feature-chip-label">{item.label}</span>
                <span className="feature-chip-inspect-hint" aria-hidden="true">
                  <ArrowUpRight size={11} weight="bold" />
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Reverse */}
        <div className="waitlist-feature-marquee-row waitlist-feature-marquee-row--rev">
          {row2Doubled.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={`r2-${i}`}
                className="waitlist-feature-chip"
                style={{ '--chip-accent': item.accent }}
                onClick={() => setActiveFeature(item)}
                aria-haspopup="dialog"
                aria-label={`Inspect ${item.label} architecture`}
              >
                <span className="feature-chip-tag" style={{ color: item.accent }}>
                  {item.tag}
                </span>
                <span className="feature-chip-icon" style={{ color: item.accent }}>
                  <Icon size={14} weight="bold" />
                </span>
                <span className="feature-chip-label">{item.label}</span>
                <span className="feature-chip-inspect-hint" aria-hidden="true">
                  <ArrowUpRight size={11} weight="bold" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Inspector Modal */}
      <AnimatePresence>
        {activeFeature && (
          <motion.div
            className="feature-inspector-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setActiveFeature(null)}
          >
            <motion.div
              className="feature-inspector-dialog"
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={activeFeature.label}
            >
              {/* Top Chrome Bar */}
              <div className="feature-inspector-chrome">
                <div className="feature-inspector-badge-group">
                  <span
                    className="feature-inspector-subsystem-badge"
                    style={{
                      color: activeFeature.accent,
                      background: `color-mix(in srgb, ${activeFeature.accent} 12%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${activeFeature.accent} 25%, transparent)`,
                    }}
                  >
                    {activeFeature.tag} // {activeFeature.subsystem}
                  </span>
                  <span className="feature-inspector-tier-badge">
                    {activeFeature.tier}
                  </span>
                </div>

                <button
                  type="button"
                  className="feature-inspector-close-btn"
                  onClick={() => setActiveFeature(null)}
                  aria-label="Close dialog"
                >
                  <span>ESC</span>
                  <X size={14} weight="bold" />
                </button>
              </div>

              {/* Body */}
              <div className="feature-inspector-body">
                {/* Hero Area */}
                <div className="feature-inspector-hero">
                  <div
                    className="feature-inspector-icon-box"
                    style={{
                      color: activeFeature.accent,
                      background: `color-mix(in srgb, ${activeFeature.accent} 12%, var(--color-surface))`,
                      border: `1px solid color-mix(in srgb, ${activeFeature.accent} 30%, transparent)`,
                      boxShadow: `0 0 24px color-mix(in srgb, ${activeFeature.accent} 20%, transparent)`,
                    }}
                  >
                    {React.createElement(activeFeature.icon, { size: 28, weight: 'duotone' })}
                  </div>

                  <div className="feature-inspector-title-area">
                    <h3 className="feature-inspector-title">{activeFeature.label}</h3>
                    <div className="feature-inspector-platform">
                      <span>PLATFORM: {activeFeature.platform}</span>
                    </div>
                    <p className="feature-inspector-summary">{activeFeature.summary}</p>
                  </div>
                </div>

                {/* Deep Architectural Breakdown */}
                <div className="feature-inspector-deepdive">
                  <div className="feature-inspector-section-label">
                    ARCHITECTURAL MECHANISM
                  </div>
                  <p>{activeFeature.deepDive}</p>
                </div>

                {/* Technical Specs Grid */}
                <div className="feature-inspector-specs-grid">
                  <div className="feature-inspector-spec-card">
                    <div className="feature-inspector-spec-label">EXECUTION ENGINE</div>
                    <div className="feature-inspector-spec-value">{activeFeature.specs.runtime}</div>
                  </div>
                  <div className="feature-inspector-spec-card">
                    <div className="feature-inspector-spec-label">PRIVACY MODEL</div>
                    <div className="feature-inspector-spec-value">{activeFeature.specs.privacy}</div>
                  </div>
                  <div className="feature-inspector-spec-card">
                    <div className="feature-inspector-spec-label">SYNC GUARANTEE</div>
                    <div className="feature-inspector-spec-value">{activeFeature.specs.sync}</div>
                  </div>
                  <div className="feature-inspector-spec-card">
                    <div className="feature-inspector-spec-label">LAYER STATUS</div>
                    <div className="feature-inspector-spec-value" style={{ color: activeFeature.accent }}>
                      {activeFeature.specs.status}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="feature-inspector-footer">
                  <div className="feature-inspector-nav-group">
                    <button
                      type="button"
                      className="feature-inspector-nav-btn"
                      onClick={handlePrev}
                      aria-label="Previous subsystem"
                      title="Previous (Left Arrow)"
                    >
                      <CaretLeft size={14} weight="bold" />
                      <span>Prev</span>
                    </button>
                    <span className="feature-inspector-counter">
                      {activeIndex + 1} / {ALL_FEATURES.length}
                    </span>
                    <button
                      type="button"
                      className="feature-inspector-nav-btn"
                      onClick={handleNext}
                      aria-label="Next subsystem"
                      title="Next (Right Arrow)"
                    >
                      <span>Next</span>
                      <CaretRight size={14} weight="bold" />
                    </button>
                  </div>

                  <a
                    href="#waitlist-join"
                    className="feature-inspector-cta-btn"
                    onClick={handleJoinClick}
                  >
                    <span>Reserve Access in Beta</span>
                    <ArrowUpRight size={14} weight="bold" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
