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
  'One Life OS — journal, habits, money, focus, and vault. Desktop commands. Android companion in closed testing.';

/** Public Android status — single source for waitlist + /app. No APK download. */
export const ANDROID_APP_STATUS = {
  badge: 'Closed device testing · Play not listed',
  headline: 'Native Android is real — not public yet',
  subhead:
    'Kotlin companion for Today, Capture, Money, Lab, and Config. Same account as the web Life OS. No public APK on this site.',
  detail:
    'Private builds on founder devices now. Invited testers next. Play Store when ready — waitlist hears first.',
  points: [
    'Not a phone-web clone — sensors, share/paste payment alerts, Health Connect',
    'Phone web (/m) stays capture-only until you open desktop or the native app',
    'iOS is not in the current plan',
  ],
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
    icon: Activity,
    title: 'High Performers',
    desc: 'Habits, intense focus blocks, recovery depth, and evening debrief without spreadsheet chaos.',
  },
  {
    icon: Compass,
    title: 'Consistency Builders',
    desc: 'Depth meter + daily minimums: honest momentum, zero streak theater.',
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
    statusLabel: 'Dec 2026 – Jan 2027',
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
      { name: 'Spade Briefing', hint: 'Sports context without doomscrolling' },
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
    tag: 'TODAY SURFACE',
    title: 'Daily execution board',
    stat: '88%',
    statLabel: 'optimal depth',
    metricBadge: '3/3 Minimums Done',
    caption: 'Single-pane execution: sleep, gym, focus, and expenses converge without app-switching.',
    items: [
      { label: 'Morning Workout', value: '45m Gym', done: true },
      { label: 'Deep Focus Block', value: '3h 15m Code', done: true },
      { label: 'Evening Reflection', value: 'Journal Logged', done: true },
    ],
    bars: [72, 88, 64, 91, 78, 85, 88],
  },
  {
    tag: 'INTELLIGENCE ENGINE',
    title: '5D Life Score & Correlation Lab',
    stat: '84 / 100',
    statLabel: 'server score (LIVE)',
    metricBadge: '+19% weekly momentum',
    caption: 'Server-side correlation engine that reveals which daily habits drive your peak deep-work performance.',
    dimensions: [
      { name: 'BODY', pct: 88, color: '#10b981' },
      { name: 'MIND', pct: 82, color: '#749dc4' },
      { name: 'DISCIPLINE', pct: 90, color: '#ff6b35' },
      { name: 'MONEY', pct: 78, color: '#38bdf8' },
      { name: 'MOOD', pct: 84, color: '#a78bfa' },
    ],
    bars: [62, 74, 80, 78, 84, 88, 92],
  },
  {
    tag: 'LINKED GRAPH',
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
    quote: 'My undergrads track sleep and mood in three different apps. A single Life OS with weekly pattern views would make self-regulation labs much easier to run.',
    name: 'Dr. Priya Menon',
    role: 'Assistant Professor, Psychology',
    city: 'Christ University, Bengaluru',
    initials: 'PM',
  },
  {
    quote: 'I juggle engineering sprints, gym sessions, and side projects. One unified screen for habits, money, and focus beats five disjointed SaaS subscriptions.',
    name: 'Ananya Sharma',
    role: 'Software Engineer & Builder',
    city: 'Bengaluru',
    initials: 'AS',
  },
  {
    quote: 'After two years in ops at a fast-growing tech firm, I still reconciled Todoist, Sheets, and a meditation app every Sunday. I wanted one single loop that connects everything.',
    name: 'Rohit Patel',
    role: 'Operations Lead',
    city: 'Ahmedabad',
    initials: 'RP',
  },
  {
    quote: 'We study habit relapse and focus retention in knowledge workers. If streak recovery and correlation views are research-grade, this is far more than another wellness app.',
    name: 'Prof. Rajesh Kulkarni',
    role: 'Associate Professor, Human Development',
    city: 'Savitribai Phule Pune University',
    initials: 'RK',
  },
];

export const FAQS = [
  {
    q: 'What is AIIMIN?',
    a: 'AIIMIN is a Personal Life OS — journal, habits, money, calendar, focus, family vault, and practice on one unified graph. Desktop is the command surface; Android is the rich companion for capture, health, and on-the-go loops. Built for ambitious people who refuse to juggle five separate apps.',
  },
  {
    q: 'Website vs Android app?',
    a: 'Same account, same data. The website (aiimin.in) is the full desktop Life OS — reports, budgets, vault admin, deep editing. The native Android app is a rich companion (Today, Capture, Money, Lab, Config) — not a crippled phone website. It is in closed device testing now; Play Store listing comes later. Status: /app. iOS is not in the current plan. Phone web (/m) stays capture-only.',
  },
  {
    q: 'Can I download the Android APK?',
    a: 'No. We do not host or sideload APKs from aiimin.in. Closed testing stays invite-only. Join the waitlist for founding access and the Play Store announcement. Details: /app.',
  },
  {
    q: 'Why desktop + Android, not phone-web analytics?',
    a: 'Dense analytics need a large screen. Phone web is intentionally capture-only so we never ship a cramped fake dashboard. Android gets the companion experience with sensors, offline queue, and widgets. Open the website on a laptop for command; open Android for the day when your build is ready.',
  },
  {
    q: 'When does AIIMIN launch?',
    a: 'We are targeting end of November 2026. That is a public go-live window, not a hard SLA — the exact date may shift slightly.',
  },
  {
    q: 'What do invited testers get?',
    a: 'The VIP package: Elite free for 12 months (₹1,188 value), first beta access to every module, priority OS-ID, prototype features, and direct founder feedback channel. Register by 31 October.',
  },
  {
    q: 'What do waitlist members get?',
    a: 'The founding member package: launch starter kit, complimentary Core subscription at go-live, Pro at ₹49/mo founding price (~17% off ₹59) for 12 months, Elite at ₹79/mo founding price (~20% off ₹99) for 12 months, OS-ID reservation, and priority onboarding. Core stays at standard ₹29/mo.',
  },
  {
    q: 'Is Explore free?',
    a: 'Yes. Explore stays free forever — including Journal, Depth, and basic Android capture. Waitlist perks apply to complimentary Core and founding Pro/Elite prices.',
  },
  {
    q: 'How do you handle privacy?',
    a: 'We do not sell your life data. Journal is private reflection and stays out of analytics. Export and delete are always available. Optional connections (Calendar, Health, payment alerts) are off until you turn them on, with a plain-language purpose for each. Full details: /privacy and /security.',
  },
  {
    q: 'What is an OS-ID?',
    a: 'OS-ID is your unique AIIMIN handle. You can reserve it on the waitlist form or claim it during invite onboarding.',
  },
  {
    q: 'Can I invite friends?',
    a: 'Yes. Share your referral link after signup — every friend who joins moves you up 5 spots.',
  },
  {
    q: 'How is my data handled?',
    a: 'Only details needed for waitlist and launch communication are stored. No spam, and unsubscribe options are available.',
  },
];

export const PAGE_META = {
  pageUrl: 'https://aiimin.in/',
  imageUrl: 'https://aiimin.in/og-image-v2.png',
};
