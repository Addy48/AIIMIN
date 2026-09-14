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
    'Discipline Engine — screen, food, urge logging with AES-GCM encrypted local vault',
    'App blocking via Accessibility service — no VPN, no data harvesting',
    'Screen-time accuracy via UsageStatsManager · Health Connect steps + sleep',
    'Notes Keep-grid · Journal mood-first flow · Offline outbox sync',
    'Not on Play Store yet — tester queue ships builds directly',
  ],
  apkUrl: '/aiimin-v2-debug.apk',
  apkVersion: 'V2.0.4 · Native Companion · Sep 2026',
  security: 'Hardware Keystore · Zero-VPN · 100% On-Device Telemetry',
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
    desc: 'Code, deep work, runway, and daily loops — one command pane, zero context switching.',
  },
  {
    icon: Layers,
    title: 'Engineers & Operators',
    desc: 'Sprint cadence, hardware-grade offline capture, and deterministic habits without bloat.',
  },
  {
    icon: Compass,
    title: 'Strategists & Researchers',
    desc: 'Long-horizon planning, structured reflection journals, and cognitive clarity without digital noise.',
  },
  {
    icon: ChartColumnBig,
    title: 'Pattern Thinkers',
    desc: 'Discover what directly drives your peak days — intelligence reports that cite your own data.',
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
    userAction: 'Join the waitlist or sign in as an invited tester. Confirm email, optionally reserve your OS-ID.',
    approval: 'Waitlist: instant signup. Testers: invite-only approval by 31 October.',
    unlocks: ['Founding perks locked in', 'Priority onboarding queue'],
  },
  {
    phase: 1,
    icon: Rocket,
    title: 'Founding launch',
    status: 'launch',
    statusLabel: 'Nov 2026',
    window: 'Go-live window',
    userAction: 'Complete a 15-minute setup — habits, money categories, and focus defaults.',
    approval: 'Founding members onboard first; testers get early beta access.',
    unlocks: [
      { name: 'Life Score', hint: 'Server score across BODY · MIND · DISCIPLINE · MONEY · MOOD' },
    ],
  },
  {
    phase: 2,
    icon: Sparkles,
    title: 'Module rollout',
    status: 'rollout',
    statusLabel: "Dec '26 – Jan '27",
    window: 'Staggered ships',
    userAction: 'Run your daily loop on web. Each module unlocks automatically — no reinstall.',
    approval: 'Active subscribers get modules as they ship; no extra approval step.',
    unlocks: [
      { name: 'Discipline Engine', hint: 'Habits, streak recovery, monthly control loops' },
      { name: 'Money OS', hint: 'Spending clarity tied to your productivity rhythm' },
    ],
  },
  {
    phase: 3,
    icon: Waves,
    title: 'Full OS expansion',
    status: 'expand',
    statusLabel: 'Mid 2027',
    window: 'Next wave',
    userAction: 'Keep logging daily — patterns compound as new surfaces go live.',
    approval: 'Included in Pro and Elite tiers at launch; Explore/Core get preview access.',
    unlocks: [
      { name: 'Sports Briefing', hint: 'Sports context without doomscrolling' },
      { name: 'Android companion', hint: 'Closed testing now · Play listing later' },
    ],
  },
];

export const PRICING = [
  {
    tier: 'Explore',
    tierAccent: 'explore',
    tierIcon: Compass,
    tierTagline: 'Capture the day. Feel the loop.',
    price: '₹0',
    note: 'No card. Journal + Depth + Today — forever free ceiling.',
    startHere: true,
    includes: [
      'Today + Depth meter + daily minimum (3 honest actions)',
      'Journal (free write + evening debrief) · Notes · Calendar',
      'Daily log: sleep, mood, water, movement',
      'Android: quick capture + 1 English Spark / day',
      '1 AI call / day · Reports visible, deep tabs locked',
    ],
    bestFor: 'Anyone testing whether one Life OS sticks',
  },
  {
    tier: 'Core',
    tierAccent: 'core',
    tierIcon: Layers,
    tierTagline: 'Run the operating loop.',
    price: '₹29',
    note: 'Habits, money, focus, journal packs, English — wired.',
    includes: [
      'Everything in Explore',
      'Habits (if–then cues) · Goals · Focus timer · Discipline toolkit',
      'Money ledger + lending · Career pipeline · Lab English (full)',
      'Android-aggressive: Health Connect steps/sleep, offline queue, widgets',
      'Journal packs (expressive 1–3 day cadence) · Ivory Snapshot',
      '10 AI calls / day',
    ],
    bestFor: 'Ambitious builders & daily operators who live in the system',
  },
  {
    tier: 'Pro',
    tierAccent: 'pro',
    tierIcon: Zap,
    tierTagline: 'Household + patterns.',
    price: '₹49',
    discounted: '₹49',
    note: 'Family vault + UPI review + correlations — founding ₹49 (modules as they ship).',
    recommended: true,
    includes: [
      'Everything in Core',
      'Family vault · Documents viewer · People links · expiry reminders (modules as they ship)',
      'Android: UPI payment-alert review queue when available (on-device parse; you Approve)',
      'Wealth AI · What-if · Correlations on Snapshot · Life OS Review PDF',
      'Cloud voice replay (opt-in) · 6 Standard PDFs / month',
      '25 AI calls / day',
    ],
    bestFor: 'People who manage money + family docs in one place',
  },
  {
    tier: 'Elite',
    tierAccent: 'elite',
    tierIcon: Crown,
    tierTagline: 'Full intelligence · two AI pools.',
    price: '₹79',
    discounted: '₹79',
    note: 'Interactive reports + Deep pool — founding ₹79.',
    includes: [
      'Everything in Pro',
      'Interactive Intelligence Report (30/60/90-day)',
      '3 Deep Reports / month · unlimited Standard PDFs',
      'Highest Android priority for new capture surfaces',
      '40 AI calls / day (Deep pool separate)',
    ],
    bestFor: 'Founders & power users who want the full OS',
  },
];

export const STACK_MONTHLY_INR = 1600;

export const ACCESS_PACKAGES = [
  {
    id: 'tester',
    tag: 'VIP invite',
    tagVariant: 'premium',
    title: 'Invited testers',
    deadline: () => 'Register by 31 October',
    perks: [
      { icon: ShieldCheck, text: 'Elite (₹99/mo) free for 12 months — ₹1,188 value' },
      { icon: Rocket, text: 'First access to every beta module before public release' },
      { icon: KeyRound, text: 'Priority OS-ID reservation + direct founder feedback channel' },
      { icon: Sparkles, text: 'Prototype features: Life Score, Discipline Engine, Sports Briefing' },
      { icon: Laptop, text: 'Desktop Life OS + native Android companion during beta' },
      { icon: MessageSquareQuote, text: 'Direct roadmap input — your bugs and ideas ship first' },
    ],
    cta: { label: 'Sign in to register', href: '/login' },
  },
  {
    id: 'waitlist',
    tag: 'Founding member',
    tagVariant: 'founding',
    title: 'Waitlist members',
    deadline: () => 'Join anytime · go-live target end of Nov 2026',
    perks: [
      { icon: Gift, text: 'Launch starter kit — habits, money, and focus setup bundle' },
      { icon: Rocket, text: 'Complimentary Core subscription at go-live' },
      { icon: BadgeCheck, text: 'Pro founding price ₹49/mo (~17% off ₹59) for 12 months after launch' },
      { icon: BadgeCheck, text: 'Elite founding price ₹79/mo (~20% off ₹99) for 12 months after launch' },
      { icon: KeyRound, text: 'OS-ID reservation + priority onboarding waves' },
      { icon: MessageSquareQuote, text: 'Roadmap voting — your ideas shape launch priority' },
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
    caption: 'Single-pane execution: sleep, gym, focus, and expenses converge without app-switching.',
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
    statLabel: 'server score (LIVE)',
    metricBadge: '+19% Momentum',
    caption: 'Server-side correlation engine that reveals which daily habits drive your peak deep-work performance.',
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
    caption: 'Track spending and productivity together in an honest, auditable graph linked directly to people and goals.',
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
      'The offline SQLite sync is rock solid. I commute on the metro with zero signal, log three expenses and my workout minimums, and it syncs without conflicts the moment I reconnect. Completely replaced my messy Notion setup.',
    name: 'Devansh Verma',
    role: 'Backend Engineer · Beta Tester (Pixel 8 Pro)',
    city: 'Bengaluru',
    initials: 'DV',
  },
  {
    quote:
      'The 3-minute evening debrief and quick ledger cut out all my spreadsheet maintenance. Having habits, runway days, and daily sprint priorities on one clean screen keeps me from bouncing between five different apps.',
    name: 'Ananya Sharma',
    role: 'Founding Engineer · Beta Tester',
    city: 'Bengaluru',
    initials: 'AS',
  },
  {
    quote:
      'Lockscreen logging takes under two seconds — no splash spinners or slow loading states. Kept a 14-day streak on daily minimums without feeling penalized if I miss a single habit by five minutes.',
    name: 'Rohit Patel',
    role: 'Product Operations Lead',
    city: 'Ahmedabad',
    initials: 'RP',
  },
  {
    quote:
      'Hardware keystore encryption (AES-256-GCM) and zero telemetry data harvesting were the deciding factors for me. Finally a personal life OS that respects privacy instead of selling productivity analytics.',
    name: 'Karan Mehta',
    role: 'Systems Architect · Beta Tester (Galaxy S23)',
    city: 'Delhi',
    initials: 'KM',
  },
];

export const FAQS = [
  {
    q: 'What is AIIMIN?',
    a: 'AIIMIN is a Personal Life OS — journal, habits, money, calendar, focus, family vault, and practice on one unified graph. Desktop is the command surface with 23 modular systems; Android is the rich native companion for capture, health telemetry, and offline loops. Built for ambitious operators who refuse to duct-tape five fragmented apps together.',
  },
  {
    q: 'How is AIIMIN different from Notion, Obsidian, or generic habit trackers?',
    a: 'Notion and Obsidian are blank note canvases requiring manual formulas and fragile templates. Standalone trackers isolate habits from your money and schedule. In AIIMIN, everything lives on one interconnected life graph: your workout minimums feed your 5D Life Score (Body, Mind, Discipline, Money, Mood), your daily expenses calculate live runway, and your evening debrief closes your entire operating loop — with zero configuration required.',
  },
  {
    q: 'Does AIIMIN work offline without an internet connection?',
    a: 'Yes, 100% offline-first. The native Android companion writes every habit check-in, journal reflection, focus block, and expense directly to an encrypted local SQLCipher SQLite database in under 10 milliseconds. When connectivity restores, an asynchronous delta outbox synchronizes your records to your personal cloud graph conflict-free.',
  },
  {
    q: 'Website vs Android app — what is the difference?',
    a: 'Same account, single unified graph. The desktop website (aiimin.in) is your command center for deep weekly planning, 23 subsystem controls, detailed financial analytics, and dossier reviews. The native Android companion is built for high-cadence execution on the go: lockscreen capture, Focus Shield app blocking (without battery-draining VPNs), biometric lock, and Health Connect sensors. Phone web (/m) stays strictly rapid capture. iOS is not in the current phase as we prioritize mastering Android and desktop first.',
  },
  {
    q: 'Can I download the Android APK right now?',
    a: 'Yes — if you are an invited tester or waitlist member. The optimized native build (~44.2 MB, Android 8.0+) is available directly from the Android section on this page or via /app. We distribute directly during closed device testing to ship rapid improvements without 5-day app store review delays. Google Play Store release will follow after closed testing.',
  },
  {
    q: 'How is my privacy and personal data protected?',
    a: 'Non-negotiable data sovereignty: zero ad tracking, zero telemetry harvesting, and we never sell user data. Master cryptographic keys are generated inside your smartphone hardware keystore (AndroidKeyStore TEE / StrongBox with AES-256-GCM encryption). On the web, data is protected by Postgres Row-Level Security (RLS) with strict per-user isolation. Your private journal reflections are completely excluded from analytics and are never sent to external LLMs. You can export all your data in JSON / CSV or delete your account at any time.',
  },
  {
    q: 'How do I migrate my existing data from Notion, spreadsheets, or other trackers?',
    a: 'AIIMIN provides clean, structured 1-click import utilities for past journal entries, habit streaks, and financial transaction sheets (CSV and JSON). You do not have to start from scratch or manually re-enter your historical logs.',
  },
  {
    q: 'When does AIIMIN launch publicly?',
    a: 'We are targeting end of November 2026 for public go-live. Founding tester registration and discount lock-ins close on 31 October 2026.',
  },
  {
    q: 'What do waitlist members get vs invited testers?',
    a: 'Waitlist members get the Founding Package: complimentary Core subscription at go-live, Pro locked at ₹49/mo (standard ₹59/mo) for 12 months, Elite locked at ₹79/mo (standard ₹99/mo) for 12 months, reserved OS-ID handle, and priority queue onboarding. Invited closed beta testers receive the VIP Package: 12 months of Elite free (₹1,188 value), direct APK drops, experimental lab features, and a direct line to the founder. Registration closes 31 October 2026.',
  },
  {
    q: 'Is the Explore tier free forever?',
    a: 'Yes. Explore is free forever — zero credit card required. Includes private Journal, Daily Minimums, Depth focus timer, and basic mobile capture.',
  },
  {
    q: 'What is an OS-ID handle?',
    a: 'OS-ID is your unique, cryptographically-scoped AIIMIN identifier (e.g., OS-ID: AADI0837). Reserving it on the waitlist form locks your preferred handle to your account before public launch.',
  },
  {
    q: 'How does the referral queue work?',
    a: 'When you join the waitlist, you get a personal referral link. Each peer or teammate who signs up using your link moves you up 5 spots in the onboarding queue.',
  },
];

export const PAGE_META = {
  pageUrl: 'https://aiimin.in/',
  imageUrl: 'https://aiimin.in/og-image-v2.png',
};
