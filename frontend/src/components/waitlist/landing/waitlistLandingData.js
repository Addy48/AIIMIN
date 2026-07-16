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

export const HERO_TRUST_LINE = 'Replaces Notion, Todoist, Headspace, and spreadsheet trackers';

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
    icon: GraduationCap,
    title: 'College students',
    desc: 'Track habits, focus, sleep, and study rhythm in one place.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Early professionals',
    desc: 'Manage money, goals, consistency, and execution without app hopping.',
  },
  {
    icon: Activity,
    title: 'Fitness-focused users',
    desc: 'Connect workouts, recovery, mood, and discipline patterns.',
  },
  {
    icon: ChartColumnBig,
    title: 'Data-driven builders',
    desc: 'Turn daily logs into trends and practical coaching loops.',
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
    window: 'Today → Jul 2026',
    userAction: 'Join the waitlist or sign in as an invited tester. Confirm email, optionally reserve your OS-ID.',
    approval: 'Waitlist: instant signup. Testers: invite-only approval by 31 July.',
    unlocks: ['Founding perks locked in', 'Priority onboarding queue'],
  },
  {
    phase: 1,
    icon: Rocket,
    title: 'Founding launch',
    status: 'launch',
    statusLabel: 'Sep 2026',
    window: 'Go-live window',
    userAction: 'Complete a 15-minute setup — habits, money categories, and focus defaults.',
    approval: 'Founding members onboard first; testers get early beta access.',
    unlocks: [
      { name: 'Life Score', hint: 'Daily execution score across sleep, gym, mood, and focus' },
    ],
  },
  {
    phase: 2,
    icon: Sparkles,
    title: 'Module rollout',
    status: 'rollout',
    statusLabel: 'Oct–Nov 2026',
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
    statusLabel: 'Q1 2027',
    window: 'Next wave',
    userAction: 'Keep logging daily — patterns compound as new surfaces go live.',
    approval: 'Included in Pro and Elite tiers at launch; Explore/Core get preview access.',
    unlocks: [
      { name: 'Spade Briefing', hint: 'Sports context without doomscrolling' },
      { name: 'Native mobile companion', hint: 'Quick logging on the go' },
    ],
  },
];

export const PRICING = [
  {
    tier: 'Explore',
    tierAccent: 'explore',
    tierIcon: Compass,
    tierTagline: 'Log daily. Learn the loop.',
    price: '₹0',
    note: 'Your entry point — no card, no catch.',
    startHere: true,
    includes: [
      'Log sleep, mood, gym, water, and steps daily',
      'Weekly completion ring and basic streak view',
      'Full Life OS view with 30-day history',
      '1 AI call per day',
    ],
    bestFor: 'Anyone curious before committing',
  },
  {
    tier: 'Core',
    tierAccent: 'core',
    tierIcon: Layers,
    tierTagline: 'Run your essentials.',
    price: '₹29',
    note: 'Habits, money, and focus — wired together.',
    includes: [
      'Everything in Explore',
      'Habits, money manager, and Pomodoro focus timer',
      'Weekly pattern insights and review loops',
      'Goals across 8 metrics (daily / weekly / monthly)',
      'Ivory Snapshot · 7-day pulse on Reports',
      '10 AI calls per day',
    ],
    bestFor: 'Students and early professionals building daily systems',
  },
  {
    tier: 'Pro',
    tierAccent: 'pro',
    tierIcon: Zap,
    tierTagline: 'See the patterns.',
    price: '₹59',
    discounted: '₹49',
    note: 'Behavioural analytics that actually connect.',
    recommended: true,
    includes: [
      'Everything in Core',
      'Deeper correlation engine across sleep, mood, and spend',
      'Expanded habit analytics and streak recovery',
      'Folio Life OS PDF reports and export',
      '25 AI calls per day',
    ],
    bestFor: 'Power users who want full behavioural analytics',
  },
  {
    tier: 'Elite',
    tierAccent: 'elite',
    tierIcon: Crown,
    tierTagline: 'Highest AI quota + every module.',
    price: '₹99',
    discounted: '₹79',
    note: 'Priority power tier — every module, highest AI limits.',
    includes: [
      'Everything in Pro',
      '40 AI calls per day (highest quota)',
      'Sports briefing (cricket, football, F1) without doom scrolling',
      'Priority feature queue',
      'Early access to every new module at launch',
    ],
    bestFor: 'Testers and users who want the full life OS',
  },
];

export const STACK_MONTHLY_INR = 1600;

export const ACCESS_PACKAGES = [
  {
    id: 'tester',
    tag: 'VIP invite',
    tagVariant: 'premium',
    title: 'Invited testers',
    deadline: () => 'Register by 31 July',
    perks: [
      { icon: ShieldCheck, text: 'Elite (₹99/mo) free for 12 months — ₹1,188 value' },
      { icon: Rocket, text: 'First access to every beta module before public release' },
      { icon: KeyRound, text: 'Priority OS-ID reservation + direct founder feedback channel' },
      { icon: Sparkles, text: 'Prototype features: Life Score, Discipline Engine, Sports Briefing' },
      { icon: Laptop, text: 'Desktop Life OS + mobile logging companion during beta' },
      { icon: MessageSquareQuote, text: 'Direct roadmap input — your bugs and ideas ship first' },
    ],
    cta: { label: 'Sign in to register', href: '/login' },
  },
  {
    id: 'waitlist',
    tag: 'Founding member',
    tagVariant: 'founding',
    title: 'Waitlist members',
    deadline: () => 'Join anytime · live target end of Sept 2026',
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
    title: 'Daily execution board',
    stat: '8/10',
    statLabel: 'metrics logged',
    caption: 'Sleep, focus, gym, mood, and wins mapped to one day view.',
    bars: [72, 88, 64, 91, 78],
  },
  {
    title: 'Pattern dashboard',
    stat: '+17%',
    statLabel: 'weekly consistency',
    caption: 'See what behavior patterns correlate with your best weeks.',
    bars: [45, 52, 61, 58, 74],
  },
  {
    title: 'Money + focus sync',
    stat: '₹3.2k',
    statLabel: 'monthly clarity',
    caption: 'Track spending and productivity together in one loop.',
    bars: [38, 44, 49, 55, 62],
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
    quote: 'I juggle internship prep, gym, and a part-time tutoring gig. One screen for habits, money, and focus beats five subscriptions on a student budget.',
    name: 'Ananya Sharma',
    role: 'Final-year B.Tech, Computer Science',
    city: 'VIT Vellore',
    initials: 'AS',
  },
  {
    quote: 'After two years in ops at a mid-size IT firm, I still reconcile Todoist, Sheets, and a meditation app every Sunday. I want one loop that respects Indian pricing.',
    name: 'Rohit Patel',
    role: 'Operations Analyst',
    city: 'Ahmedabad',
    initials: 'RP',
  },
  {
    quote: 'We study habit relapse in young adults. If streak recovery and correlation views are research-grade, this is more than another wellness app.',
    name: 'Prof. Rajesh Kulkarni',
    role: 'Associate Professor, Human Development',
    city: 'Savitribai Phule Pune University',
    initials: 'RK',
  },
];

export const FAQS = [
  {
    q: 'What is AIIMIN?',
    a: 'AIIMIN is a personal life operating system — one dashboard where you track habits, sleep, mood, money, focus sessions, and daily wins. It connects the dots across your behaviour so you see patterns, not just logs. Built for Indian students and early professionals who want one system instead of five separate apps.',
  },
  {
    q: 'What is the website vs the mobile app?',
    a: 'Right now, AIIMIN is a desktop web dashboard at aiimin.in — the full analytics experience with charts, correlations, and multi-panel layouts. A native mobile companion app for quick on-the-go logging is in active development. Join the waitlist from any device; use the full Life OS on your laptop when we launch.',
  },
  {
    q: 'Why is AIIMIN desktop-first?',
    a: 'The Life OS is data-dense — weekly pattern charts, money analytics, and correlation views need screen space to be useful. We optimised for laptops and desktops so nothing feels cramped. A native mobile app for quick logging is coming; until then, join the waitlist on your phone and open AIIMIN on your laptop for the full experience.',
  },
  {
    q: 'When does AIIMIN launch?',
    a: 'We are targeting end of September 2026. The exact date may shift slightly, but that is our public go-live window.',
  },
  {
    q: 'What do invited testers get?',
    a: 'The VIP package: Elite free for 12 months (₹1,188 value), first beta access to every module, priority OS-ID, prototype features, and direct founder feedback channel. Register by 31 July.',
  },
  {
    q: 'What do waitlist members get?',
    a: 'The founding member package: launch starter kit, complimentary Core subscription at go-live, Pro at ₹49/mo founding price (~17% off ₹59) for 12 months, Elite at ₹79/mo founding price (~20% off ₹99) for 12 months, OS-ID reservation, and priority onboarding. Core stays at standard ₹29/mo.',
  },
  {
    q: 'Is Explore free?',
    a: 'Yes. Explore stays free forever. Waitlist perks apply to complimentary Core, the Pro founding price (₹49/mo), and the Elite founding price (₹79/mo) — not to Core list price.',
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
