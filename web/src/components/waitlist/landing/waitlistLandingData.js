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
import { PLANS, REFERRAL, priceLine } from '../../../marketing/plans';

export const HERO_TRUST_LINE =
  'Reads your bank SMS on your phone and never uploads them. No ads, no loans, no selling data.';

/** Public Android status — single source for waitlist + /app. V2 tester build is live. */
export const ANDROID_APP_STATUS = {
  badge: 'Android beta · closed testing',
  headline: 'The Android app is in beta',
  subhead:
    'Your day, your money and your family\'s papers, in one calm place. Same account as aiimin.in. Not on the Play Store yet: beta testers get it first.',
  detail: 'For Android 12 and newer (installs from Android 8). Join the waitlist to get the beta.',
  points: [
    'Bank SMS become a clear month: read on your phone, nothing booked until you say so',
    'Say it once: tasks, money and notes land in the right place',
    'Documents, expiry reminders and an emergency card for you and your family, offline',
    'Life Score that only ever compares you with you',
    'Steps and screen time fill in by themselves, and stay on your phone',
  ],
  apkUrl: null,
  apkVersion: 'Beta',
  security: 'No ads · no loans · no selling data',
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
    title: 'Join the waitlist',
    status: 'open',
    statusLabel: 'Open now',
    window: 'Today → Oct 2026',
    userAction: 'Join with your email. Optionally reserve your OS-ID and share your link.',
    approval: 'Waitlist: instant. Beta testers: register by 31 October.',
    unlocks: [`${REFERRAL.friendGets} when paid plans start`, 'Referral rewards for every friend who joins'],
  },
  {
    phase: 1,
    icon: Rocket,
    title: 'Android beta in waves',
    status: 'launch',
    statusLabel: 'Nov 2026',
    window: 'Launch window',
    userAction: 'Install the app, bring in your bank messages, add your family\'s papers.',
    approval: 'Testers first, then the waitlist in waves.',
    unlocks: [
      { name: 'Money from your bank SMS', hint: 'Read on your phone; nothing booked until you confirm' },
      { name: 'Today, Vault and the emergency card', hint: 'Your day and your family\'s papers in one place' },
    ],
  },
  {
    phase: 2,
    icon: Sparkles,
    title: 'Plans on sale',
    status: 'rollout',
    statusLabel: "Dec '26 – Jan '27",
    window: 'After the beta',
    userAction: 'Keep using Free, or move to Plus, Pro or Family. Referral rewards start here.',
    approval: 'Same prices in the app and on the web. Nothing you made on Free is ever locked.',
    unlocks: [
      { name: 'Merchant names and what you bought', hint: 'Name the place once; AIIMIN remembers' },
      { name: 'Document versions and vault backups', hint: 'Plus' },
    ],
  },
  {
    phase: 3,
    icon: Waves,
    title: 'More help, more people',
    status: 'expand',
    statusLabel: '2027',
    window: 'Next',
    userAction: 'Your history grows; AIIMIN starts explaining it.',
    approval: 'Arrives in the plans that list it as Coming today.',
    unlocks: [
      { name: 'Patterns and a monthly review', hint: 'Pro' },
      { name: 'Each family member on their own phone', hint: 'Family' },
    ],
  },
];

const PLAN_STYLE = {
  free: { tierAccent: 'explore', tierIcon: Compass, startHere: true, bestFor: 'Anyone running their own day, money and papers' },
  plus: { tierAccent: 'core', tierIcon: Layers, bestFor: 'People who want every month of their history and a household or business ledger' },
  pro: { tierAccent: 'pro', tierIcon: Zap, bestFor: 'People who want AIIMIN to explain patterns and write their reviews' },
  family: { tierAccent: 'elite', tierIcon: Crown, bestFor: 'Households looking after parents, partners and kids' },
};

/** Cards on the waitlist page, built from the one plan list (marketing/plans.js). */
export const PRICING = PLANS.map((p) => ({
  ...PLAN_STYLE[p.id],
  tier: p.name,
  tierTagline: p.promise,
  price: '₹' + p.monthly,
  priceLine: priceLine(p),
  recommended: Boolean(p.recommended),
  note: p.hero,
  includes: [...p.includes, ...p.coming.map((c) => `Coming: ${c}`)],
}));

export const STACK_MONTHLY_INR = 1600;

export const ACCESS_PACKAGES = [
  {
    id: 'tester',
    tag: 'Beta tester',
    tagVariant: 'premium',
    title: 'Beta testers',
    deadline: () => 'Register by 31 October',
    perks: [
      { icon: ShieldCheck, text: '1 year of Pro free when paid plans start' },
      { icon: Rocket, text: 'The Android beta before anyone else' },
      { icon: KeyRound, text: 'Your OS-ID reserved' },
      { icon: MessageSquareQuote, text: 'A direct line to the founder: your bug reports and requests come first' },
    ],
    cta: { label: 'Sign in to register', href: '/login' },
  },
  {
    id: 'waitlist',
    tag: 'Founding member',
    tagVariant: 'founding',
    title: 'Waitlist members',
    deadline: () => 'Open now · launch planned for November 2026',
    perks: [
      { icon: Gift, text: `${REFERRAL.friendGets} when paid plans start` },
      { icon: UserPlus, text: `Invite 3 friends: ${REFERRAL.tiers[1].reward}` },
      { icon: BadgeCheck, text: `Invite 10 friends: ${REFERRAL.tiers[2].reward}` },
      { icon: KeyRound, text: 'Optional OS-ID reservation and an early place in the onboarding waves' },
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

/**
 * Real beta feedback only, with the person's permission (first name + city). The earlier six quotes
 * couldn't be traced to real testers, so they were removed (master plan §1C).
 */
export const TESTIMONIALS = [];

export const FAQS = [
  {
    q: 'What is AIIMIN?',
    a: "One calm app for your day, your money and your family's papers. Tasks, voice capture, focus and a journal; money that fills itself from your bank SMS; documents, expiry reminders and an emergency card for the people you look after. It only ever compares you with you.",
  },
  {
    q: 'Does AIIMIN upload my SMS?',
    a: "No. Bank messages are read and parsed on your phone. OTPs, offers and personal messages are skipped. Payments wait in Review and nothing is booked until you confirm it. You can choose which banks and amounts count.",
  },
  {
    q: 'How is it different from a money app or a to-do app?',
    a: 'Money apps stop at money, to-do apps stop at tasks. AIIMIN keeps your day, your money and your papers in one place, so a bill, the task to pay it and the document behind it sit together.',
  },
  {
    q: 'Does it work offline?',
    a: 'Yes. Everything is saved on your phone first. Sync with aiimin.in is optional and happens when you are online.',
  },
  {
    q: 'Which phones does it work on?',
    a: 'Android 12 and newer is the target: phones from the last four or five years, small or large, and foldables. It installs from Android 8. The website works in any modern browser, including Safari on iPhone. There is no iPhone app yet.',
  },
  {
    q: 'Can I get the Android app now?',
    a: 'It is in closed beta. Join the waitlist and beta testers get it first. It will come to the Play Store after the beta.',
  },
  {
    q: 'What does it cost?',
    a: `Free is free for as long as you like. Plus is ${priceLine(PLANS[1])}, Pro is ${priceLine(PLANS[2])}, Family is ${priceLine(PLANS[3])}. Features marked "Coming" are planned and not included yet. Prices include GST.`,
  },
  {
    q: 'What do waitlist members and beta testers get?',
    a: `Waitlist members get ${REFERRAL.friendGets} when paid plans start, plus referral rewards. Beta testers who register by 31 October get 1 year of Pro free and the Android beta first.`,
  },
  {
    q: 'How do referrals work?',
    a: `You get a personal link. A friend who joins with it gets ${REFERRAL.friendGets}. You: ${REFERRAL.tiers.map((t) => `${t.friends} friend${t.friends === 1 ? '' : 's'}, ${t.reward.charAt(0).toLowerCase() + t.reward.slice(1)}`).join('; ')}. ${REFERRAL.rules}`,
  },
  {
    q: 'What happens to my data if I stop paying?',
    a: 'Nothing is deleted. Features beyond Free pause; your history, documents and notes stay. You can export everything or delete your account at any time.',
  },
  {
    q: 'When does AIIMIN launch?',
    a: 'The plan is November 2026. Beta tester registration closes on 31 October 2026.',
  },
];

export const PAGE_META = {
  pageUrl: 'https://aiimin.in/',
  imageUrl: 'https://aiimin.in/og-image-v2.png',
};
