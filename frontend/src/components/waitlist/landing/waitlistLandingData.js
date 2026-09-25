import {
  Activity,
  BadgeCheck,
  BriefcaseBusiness,
  ChartColumnBig,
  Compass,
  Crown,
  Gift,
  GraduationCap,
  KeyRound,
  Layers,
  Laptop,
  MessageSquareQuote,
  Rocket,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Waves,
  Zap,
} from 'lucide-react';

export const HERO_TRUST_LINE =
  'One unified Life OS. Web command center on desktop · Native Android companion in closed testing.';

/** Public Android status — single source for waitlist + /app. V2 tester build is live. */
export const ANDROID_APP_STATUS = {
  badge: 'V2 Tester Build · Active closed testing',
  headline: 'Android V2 is here — testers get it first',
  subhead:
    'Native Kotlin companion with Discipline Engine, encrypted local vault, app blocking, and the full V2 Today surface. Same account as the web Life OS. Not on Play Store yet — that is by design.',
  detail:
    'Tester build (~44 MB, Android 8.0+). Requires Android 8.0+. Join the queue for access — founding testers ship before the Play listing.',
  points: [
    'Discipline Engine — screen, food, urge logging with AES-256-GCM encrypted local vault',
    'App blocking via Accessibility service — no battery-draining VPN, no data harvesting',
    'Screen-time accuracy via UsageStatsManager · Health Connect steps + sleep',
    'Notes Keep-grid · Journal mood-first flow · Offline outbox sync',
    'Direct tester APK drops — rapid iteration during closed device testing',
  ],
  apkUrl: '/aiimin-v2-debug.apk',
  apkVersion: 'V2.0.4 · Native Companion · Sep 2026',
  security: 'StrongBox TEE Keystore · Zero-VPN · Zero Analytics / Ad Tracking',
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const PERSONAS = [
  {
    icon: BriefcaseBusiness,
    title: 'Founders & Builders',
    desc: 'Deep work, habit consistency, runway days, and daily execution in one command pane without app-switching.',
  },
  {
    icon: Layers,
    title: 'Engineers & Operators',
    desc: 'Sprint cadence, offline-first quick capture, and deterministic habits without bloat or distraction.',
  },
  {
    icon: Compass,
    title: 'Strategists & Researchers',
    desc: 'Long-horizon planning, structured reflection debriefs, and mental clarity without social feed noise.',
  },
  {
    icon: ChartColumnBig,
    title: 'Pattern Thinkers',
    desc: 'Discover what directly drives your peak days with multi-domain correlations based on your own data.',
  },
];

export const LAUNCH_PHASE_LEGEND = [
  { key: 'open', label: 'Open now' },
  { key: 'launch', label: 'At launch' },
  { key: 'rollout', label: 'Rollout' },
  { key: 'expand', label: 'Expansion' },
];

export const LAUNCH_PHASES = [
  {
    phase: 0,
    icon: UserPlus,
    title: 'Reserve access',
    status: 'open',
    statusLabel: 'Open now',
    window: 'Today → Oct 2026',
    userAction: 'Join the waitlist with your email. Confirm email and optionally claim your custom OS-ID handle.',
    approval: 'Waitlist: instant signup. Testers: invite-only closed beta approval by 31 October.',
    unlocks: ['Founding rates locked for 12 months', 'Priority onboarding waves'],
  },
  {
    phase: 1,
    icon: Rocket,
    title: 'Founding launch',
    status: 'launch',
    statusLabel: 'Nov 2026',
    window: 'Go-live window',
    userAction: '15-minute guided setup for habits, expense categories, and focus sprint defaults.',
    approval: 'Founding members onboard in waves; closed testers get early release builds.',
    unlocks: [
      { name: '5D Life Score', hint: 'Multi-domain score across Body, Mind, Discipline, Money, and Mood' },
      { name: 'Today Command Center', hint: 'Daily minimums, private journal, and focus sprint timer' },
    ],
  },
  {
    phase: 2,
    icon: Sparkles,
    title: 'Module rollout',
    status: 'rollout',
    statusLabel: "Dec '26 – Jan '27",
    window: 'Staggered ships',
    userAction: 'Run your daily loops on web and Android. New modules unlock seamlessly in your existing account.',
    approval: 'All active tiers receive updates as they ship; no migration or re-signup required.',
    unlocks: [
      { name: 'Discipline Engine', hint: 'Daily minimums, momentum recovery, and habit triggers' },
      { name: 'Money OS', hint: 'Spending clarity and runway calculations linked to daily execution' },
    ],
  },
  {
    phase: 3,
    icon: Waves,
    title: 'Full OS expansion',
    status: 'expand',
    statusLabel: 'Mid 2027',
    window: 'Next wave',
    userAction: 'Continuous daily logging — historical patterns compound as intelligence layers deepen.',
    approval: 'Included in Pro and Elite tiers at launch; Explore/Core receive preview features.',
    unlocks: [
      { name: 'Sports Briefing', hint: 'Clean match scores and league tables without doomscrolling feeds' },
      { name: 'Android companion', hint: 'Closed testing now · Google Play release following beta' },
    ],
  },
];

export const PRICING = [
  {
    tier: 'Explore',
    tierAccent: 'explore',
    tierIcon: Compass,
    tierTagline: 'Capture the day. Build the daily habit.',
    price: '₹0',
    note: 'Always free, zero credit card required. Private journal, daily minimums, and basic capture.',
    startHere: true,
    includes: [
      'Today command board: 3 daily verified minimums',
      'Private journal (free write + evening debrief) · Notes · Calendar',
      'Daily wellness logs: sleep duration, mood checkin, movement',
      'Android companion: fast lockscreen capture + 1 English spark / day',
      '1 AI assistant query / day · Core reports visible with deep tabs preview',
    ],
    bestFor: 'Anyone wanting a calm, reliable daily capture loop for free',
  },
  {
    tier: 'Core',
    tierAccent: 'core',
    tierIcon: Layers,
    tierTagline: 'Run your full daily operating loop.',
    price: '₹29',
    note: 'Habits, expenses, focus sprints, structured journal packs, and cognitive practice.',
    includes: [
      'Everything in Explore',
      'Habit system with if–then triggers, goals, and focus countdown timer',
      'Money ledger, peer lending tracker, and career pipeline',
      'Full cognitive practice & vocabulary engine (Lab English)',
      'Android companion: Health Connect steps/sleep sync, offline outbox, widgets',
      '10 AI assistant queries / day',
    ],
    bestFor: 'Ambitious builders & daily operators who live in the system',
  },
  {
    tier: 'Pro',
    tierAccent: 'pro',
    tierIcon: Zap,
    tierTagline: 'Interconnected intelligence & family vault.',
    price: '₹49',
    discounted: '₹49',
    note: '5D correlations, family documents vault, and what-if runway simulations (founding ₹49/mo).',
    recommended: true,
    includes: [
      'Everything in Core',
      'Full 5D Life Score & cross-domain correlation insights (habit vs focus vs sleep)',
      'Runway & what-if financial simulations linked to life goals',
      'Family documents vault, expiry reminders, and contact links (as modules ship)',
      'Android: UPI payment-alert review queue (on-device parsing, user approved)',
      'Monthly Life OS Review PDF exports (6 standard reports / month)',
      '25 AI assistant queries / day',
    ],
    bestFor: 'Users who want deep habit correlations + financial runway in one system',
  },
  {
    tier: 'Elite',
    tierAccent: 'elite',
    tierIcon: Crown,
    tierTagline: 'Maximum intelligence & deep synthesis.',
    price: '₹79',
    discounted: '₹79',
    note: 'Interactive multi-window intelligence dossiers and deep reasoning models (founding ₹79/mo).',
    includes: [
      'Everything in Pro',
      'Interactive Multi-Window Intelligence Dossiers (30/60/90-day deep dives)',
      '3 Deep Intelligence synthesis runs / month + unlimited standard PDFs',
      'Priority routing for advanced AI reasoning pool (40 queries / day)',
      'Highest Android priority for newly released beta command surfaces',
      'Direct roadmap advisory input with the engineering team',
    ],
    bestFor: 'Founders, power users, and data-driven operators who want the complete OS',
  },
];

export const STACK_MONTHLY_INR = 1600;

export const ACCESS_PACKAGES = [
  {
    id: 'tester',
    tag: 'Closed beta tester',
    tagVariant: 'premium',
    title: 'Invited testers',
    deadline: () => 'Register by 31 October',
    perks: [
      { icon: ShieldCheck, text: 'Elite tier free for 12 months (₹948–₹1,188 value)' },
      { icon: Rocket, text: 'First access to every beta module and raw APK drops before public release' },
      { icon: KeyRound, text: 'Priority custom OS-ID reservation + direct founder feedback channel' },
      { icon: Sparkles, text: 'Early prototype features: 5D Correlation Lab, Focus Shield, Sports Briefing' },
      { icon: Laptop, text: 'Web command center on desktop + native Android companion during beta' },
      { icon: MessageSquareQuote, text: 'Direct roadmap input — your reported bugs and feature requests ship first' },
    ],
    cta: { label: 'Sign in to register', href: '/login' },
  },
  {
    id: 'waitlist',
    tag: 'Founding member',
    tagVariant: 'founding',
    title: 'Waitlist members',
    deadline: () => 'Open signup · public go-live targeted Nov 2026',
    perks: [
      { icon: Gift, text: 'Launch setup kit — habits, money categories, and focus presets' },
      { icon: Rocket, text: 'Complimentary Core subscription at go-live' },
      { icon: BadgeCheck, text: 'Pro founding rate locked at ₹49/mo (standard ₹59) for 12 months after launch' },
      { icon: BadgeCheck, text: 'Elite founding rate locked at ₹79/mo (standard ₹99) for 12 months after launch' },
      { icon: KeyRound, text: 'Optional OS-ID handle reservation + priority onboarding waves' },
      { icon: MessageSquareQuote, text: 'Community feature voting — your input shapes upcoming module priorities' },
    ],
    cta: { label: 'Reserve my spot', href: '#waitlist-join' },
  },
];

export const PREVIEW_SCREENS = [
  {
    tag: 'TODAY LOOP',
    title: 'Daily execution board',
    stat: '88%',
    statLabel: 'optimal depth',
    metricBadge: '3/3 Minimums',
    caption: 'Single-pane execution: sleep duration, workout, deep focus, and daily expenses converge without app-switching.',
    image: '/assets/screenshots/surface-today.png',
    items: [
      { label: 'Morning Workout', value: '45m Gym', done: true },
      { label: 'Deep Focus Block', value: '3h 15m Code', done: true },
      { label: 'Evening Reflection', value: 'Journal Logged', done: true },
    ],
    bars: [72, 88, 64, 91, 78, 85, 88],
  },
  {
    tag: '5D INTEL',
    title: '5D Life Score & Correlation Lab',
    stat: '84 / 100',
    statLabel: 'multi-domain score',
    metricBadge: '+19% Momentum',
    caption: 'Cross-domain correlation engine that shows how sleep quality, morning workouts, and spending habits directly affect focus velocity.',
    image: '/assets/screenshots/surface-score.png',
    dimensions: [
      { name: 'BODY', pct: 88, color: '#10b981' },
      { name: 'MIND', pct: 82, color: '#749dc4' },
      { name: 'DISCIPLINE', pct: 90, color: '#ff6b35' },
      { name: 'MONEY', pct: 78, color: '#749dc4' },
      { name: 'MOOD', pct: 84, color: '#416180' },
    ],
    bars: [62, 74, 80, 78, 84, 88, 92],
  },
  {
    tag: 'MONEY OS',
    title: 'Money OS & Open Loops',
    stat: '₹3,450',
    statLabel: 'reconciled spend',
    metricBadge: '100% Provenance',
    caption: 'Track spending and daily runway in an honest ledger linked directly to people, habits, and long-term targets.',
    image: '/assets/screenshots/surface-money.png',
    items: [
      { label: 'Lent to Rahul', value: '₹500 · Linked', done: true },
      { label: 'AWS & Domain Infra', value: '₹1,250 · Fixed', done: true },
      { label: 'Groceries & Nutrition', value: '₹1,700 · Essential', done: true },
    ],
    bars: [45, 52, 61, 58, 74, 82, 90],
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'The offline SQLite sync is rock solid. I commute on the metro with zero signal, log my expenses and morning minimums, and everything reconciles without conflicts the moment I reconnect.',
    name: 'Devansh Verma',
    role: 'Software Engineer · Closed Tester',
    initials: 'DV',
  },
  {
    quote:
      'The 3-minute evening debrief and quick expense ledger cut out all my manual spreadsheet maintenance. Having habits, runway days, and daily priorities on one clean screen keeps me from bouncing between five apps.',
    name: 'Ananya Sharma',
    role: 'Product Designer · Closed Tester',
    initials: 'AS',
  },
  {
    quote:
      'Lockscreen logging on Android takes under two seconds — no splash spinners or slow loading states. Kept a 21-day streak on daily minimums without feeling penalized if I miss a single habit by five minutes.',
    name: 'Rohit Patel',
    role: 'Final Year Engineering Student',
    initials: 'RP',
  },
  {
    quote:
      'Hardware-backed keystore encryption and strict zero ad-tracking policies were the deciding factors for me. Finally a personal life OS that respects privacy instead of profiling users.',
    name: 'Karan Mehta',
    role: 'Systems Architect · Beta Reviewer',
    initials: 'KM',
  },
  {
    quote:
      'I used to maintain three separate apps for habits, money, and focus hours. Seeing my spending and deep focus logs side-by-side helped me spot where my time and energy were slipping during project crunches.',
    name: 'Priya Sundaram',
    role: 'Data Analyst · Closed Tester',
    initials: 'PS',
  },
  {
    quote:
      'The quiet evening reflection helps me plan tomorrow without digital distraction. It is clean, high-density, and does not spam me with notification badges.',
    name: 'Siddharth Rao',
    role: 'Educator & Writer · Closed Tester',
    initials: 'SR',
  },
  {
    quote:
      'Linking money transactions directly to specific project milestones makes tracking expenses effortless. No complex setup or fragile spreadsheet formulas needed.',
    name: 'Neha Kapoor',
    role: 'Freelance Full-Stack Developer',
    initials: 'NK',
  },
  {
    quote:
      'The 5D Life Score gives an honest pulse check across physical, cognitive, and financial routines without guilt-tripping me when deadlines get chaotic.',
    name: 'Vikramaditya Joshi',
    role: 'Research Scholar · Closed Tester',
    initials: 'VJ',
  },
  {
    quote:
      'Setting up 3 daily minimum actions stopped me from overloading my habit list. It keeps me consistent on core routines even on high-stress workdays.',
    name: 'Tanvi Kulkarni',
    role: 'Operations Lead · Closed Tester',
    initials: 'TK',
  },
  {
    quote:
      'Having quick-capture notes right alongside my focus timer means ideas do not get lost while I am deep in code. Simple, responsive, and completely friction-free.',
    name: 'Aditya Nair',
    role: 'Frontend Engineer · Closed Tester',
    initials: 'AN',
  },
  {
    quote:
      'The runway indicator in Money OS keeps my impulse spending in check without making me feel restricted. It gives clear visibility into monthly cash flow.',
    name: 'Meera Deshmukh',
    role: 'Financial Analyst · Closed Tester',
    initials: 'MD',
  },
  {
    quote:
      'Zero artificial gamification or annoying streak popups. It just provides a calm, high-density space to execute daily routines and review week-end progress.',
    name: 'Harshvardhan Singh',
    role: 'Technical Writer · Closed Tester',
    initials: 'HS',
  },
];

export const FAQS = [
  {
    q: 'What is AIIMIN?',
    a: 'AIIMIN is a unified Personal Life OS — daily habits, expenses, calendar, focus timer, private journal, and behavioral intelligence on one interconnected graph. Desktop web is the high-density command center for deep planning and review; the native Android companion is built for fast lockscreen capture, health metrics, and offline execution. Built for ambitious builders, operators, and high performers who want one calm system instead of duct-taping four separate apps together.',
  },
  {
    q: 'How is AIIMIN different from Notion, Obsidian, or standalone habit apps?',
    a: 'Notion and Obsidian are blank note canvases requiring complex templates, manual formulas, and constant maintenance. Standalone trackers isolate your habits from your money and calendar. In AIIMIN, everything lives on one interconnected life graph: your workout minimums feed your 5D Life Score (Body, Mind, Discipline, Money, Mood), your daily expenses calculate live runway, and your evening debrief closes your operating loop — with zero spreadsheet maintenance.',
  },
  {
    q: 'Does AIIMIN work offline without an internet connection?',
    a: 'Yes, 100% offline-first. The native Android companion writes every habit check-in, journal reflection, focus block, and expense directly to an encrypted local SQLCipher SQLite database in under 10 milliseconds. When internet connectivity restores, an asynchronous delta outbox synchronizes your records to your authenticated personal cloud graph conflict-free.',
  },
  {
    q: 'Website vs Android app — what is the difference?',
    a: 'Same account, single unified graph. The desktop web command center (aiimin.in) is optimized for deep weekly planning, multi-dimensional score analysis, detailed financial ledgers, and intelligence dossier reviews. The native Android companion is engineered specifically for fast mobile capture on the move: lockscreen logging in under 2 seconds, Focus Shield app blocking (without battery-draining VPNs), biometric authentication, and Health Connect sync. Phone web (/m) serves as an ultra-fast capture fallback.',
  },
  {
    q: 'Can I download the Android APK right now?',
    a: 'Yes — if you are an invited closed beta tester or registered waitlist member. The optimized native build (~44.2 MB, Android 8.0+) is available directly from the Android section on this page or via /app. We distribute directly during closed testing to ship rapid improvements without app-store review delays. Public Google Play Store release will follow after closed testing completes.',
  },
  {
    q: 'How is my privacy and personal data protected?',
    a: 'We operate on strict data sovereignty: zero ad tracking, zero analytics data brokers, and we never sell user data. On Android, cryptographic keys are generated inside your device hardware security module (AndroidKeyStore StrongBox TEE with AES-256-GCM encryption) and never leave the secure silicon boundary. On the web, all records are protected by PostgreSQL Row-Level Security (RLS) with strict per-user isolation. Your private journal reflections are never used to train external public AI models, and you can export all your data in JSON/CSV or delete your account at any time.',
  },
  {
    q: 'How do I migrate my existing data from Notion or spreadsheets?',
    a: 'AIIMIN provides clean, structured 1-click import utilities for past journal entries, habit streaks, and financial transaction sheets (CSV and JSON format). You do not have to start from scratch or re-enter historical records manually.',
  },
  {
    q: 'When does AIIMIN launch publicly?',
    a: 'We are targeting end of November 2026 for public go-live. Founding tester registration and discount lock-ins close on 31 October 2026.',
  },
  {
    q: 'What do waitlist members get vs invited testers?',
    a: 'Waitlist members receive the Founding Package: complimentary Core subscription at go-live, Pro locked at ₹49/mo (standard ₹59/mo) for 12 months, Elite locked at ₹79/mo (standard ₹99/mo) for 12 months, reserved OS-ID handle, and priority queue onboarding. Invited closed beta testers receive the VIP Package: 12 months of Elite free (₹1,188 value), direct raw APK drops, experimental lab features, and direct engineering channel access. Registration closes 31 October 2026.',
  },
  {
    q: 'Is the Explore tier free forever?',
    a: 'Yes. Explore is free forever — zero credit card required. It includes the Today command board, daily minimums, private journal (free write + evening debrief), focus timer, and basic mobile capture.',
  },
  {
    q: 'What is an OS-ID handle?',
    a: 'OS-ID is your unique, cryptographically-scoped AIIMIN identifier (e.g., OS-ID: AADI0837). Reserving it on the waitlist form locks your preferred handle to your email address before public launch. Entering an OS-ID on the form is optional — if skipped, you can claim one upon invitation.',
  },
  {
    q: 'How does the referral queue work?',
    a: 'When you join the waitlist, you get a personal referral link. Each colleague, peer, or teammate who signs up using your link moves you up 5 spots in the onboarding queue and unlocks early founding bonus features.',
  },
];

export const PAGE_META = {
  pageUrl: 'https://aiimin.in/',
  imageUrl: 'https://aiimin.in/og-image-v2.png',
};
