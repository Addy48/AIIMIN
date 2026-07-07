import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ChartColumnBig,
  ChevronDown,
  Gift,
  GraduationCap,
  KeyRound,
  Laptop,
  MessageSquareQuote,
  Rocket,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
  Activity,
  UserPlus,
  Waves,
  Check,
} from 'lucide-react';
import useWaitlistSurfaceTheme from '../hooks/useWaitlistSurfaceTheme';
import { API_URL } from '../utils/api';
import WaitlistForm from '../components/waitlist/WaitlistForm';
import WaitlistSocialProof from '../components/waitlist/WaitlistSocialProof';
import Wordmark from '../components/brand/Wordmark';
import { ArchBracketMark, EDITOR_PICK } from '../components/brand/archBracketMark';
import '../styles/waitlistLanding.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const HERO_FEATURES = [
  'One dashboard for habits, money, focus, and mood — no app hopping.',
  'Founding perks: complimentary Core + Pro at ₹49/mo for 12 months.',
  'Reserve your unique 8-character OS-ID before launch.',
];

const TRUST_TOOLS = ['Notion', 'Todoist', 'Headspace', 'Excel trackers'];

const PERSONAS = [
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

const HOW_IT_WORKS = [
  {
    icon: UserPlus,
    title: 'Join the waitlist',
    desc: 'Sign up in under 20 seconds, then confirm your email.',
  },
  {
    icon: Sparkles,
    title: 'Set up your systems',
    desc: 'At launch, configure habits, money, and focus modules in ~15 minutes.',
  },
  {
    icon: Waves,
    title: 'Build momentum daily',
    desc: 'Use the dashboard every day — patterns emerge and you level up.',
  },
];

const PRICING = [
  {
    tier: 'Explore',
    tierAccent: 'explore',
    price: '₹0',
    note: 'Start here',
    freeNote: 'Always free. No card needed.',
    startHere: true,
    summary: ['Daily tracking', 'Starter analytics'],
    includes: [
      'Log sleep, mood, gym, water, and steps daily',
      'Weekly completion ring and basic streak view',
      'Single dashboard with 30-day history',
      'Community help centre',
    ],
    bestFor: 'Anyone curious before committing',
  },
  {
    tier: 'Core',
    tierAccent: 'core',
    price: '₹29',
    note: 'Essential daily systems — habits, money, and focus.',
    summary: ['Habits + money + focus', 'Weekly insights + reviews'],
    includes: [
      'Everything in Explore',
      'Habits, money manager, and Pomodoro focus timer',
      'Weekly pattern insights and review loops',
      'Goals across 8 metrics (daily / weekly / monthly)',
      'Mobile data collection + desktop analytics',
    ],
    bestFor: 'Students and early professionals building daily systems',
  },
  {
    tier: 'Pro',
    tierAccent: 'pro',
    price: '₹59',
    discounted: '₹49',
    note: 'Most popular — full behavioural analytics.',
    highlight: true,
    popularBadgeLabel: 'Most popular · Founding ₹49',
    waitlistBadge: true,
    waitlistBadgeLabel: 'FOUNDING PRICE',
    summary: ['Deeper analytics', 'Expanded modules'],
    includes: [
      'Everything in Core',
      'Deeper correlation engine across sleep, mood, and spend',
      'Expanded habit analytics and streak recovery',
      'Monthly PDF-style reports and export',
      'Family vault module (shared goals)',
    ],
    bestFor: 'Power users who want full behavioural analytics',
  },
  {
    tier: 'Elite',
    tierAccent: 'elite',
    price: '₹99',
    discounted: '₹79',
    note: 'Priority power tier',
    waitlistBadge: true,
    waitlistBadgeLabel: 'FOUNDING PRICE',
    summary: ['Priority queue', 'Highest limits'],
    includes: [
      'Everything in Pro',
      'Unlimited AI coaching and insight depth',
      'Sports briefing (cricket, football, F1) without doom scrolling',
      'Priority feature queue and highest API limits',
      'Early access to every new module at launch',
    ],
    bestFor: 'Testers and users who want the full life OS, no limits',
  },
];

const COMPARISON_MAX_PRICE = 1600;

const COMPARISON_ROWS = [
  { label: 'Notion + Todoist + Headspace', priceInr: 1600, priceLabel: '₹1,600/mo', combined: true },
  { label: 'Notion Personal', priceInr: 650, priceLabel: '₹650/mo' },
  { label: 'Headspace', priceInr: 550, priceLabel: '₹550/mo' },
  { label: 'Todoist Pro', priceInr: 400, priceLabel: '₹400/mo' },
];

const AIIMIN_TIER_ROWS = [
  { tier: 'Explore', label: 'AIIMIN Explore', price: '₹0', tierLevel: 0 },
  { tier: 'Core', label: 'AIIMIN Core', price: '₹29/mo', tierLevel: 1 },
  {
    tier: 'Pro',
    label: 'AIIMIN Pro',
    listPrice: '₹59',
    foundingPrice: '₹49/mo',
    tierLevel: 2,
    highlight: true,
  },
  {
    tier: 'Elite',
    label: 'AIIMIN Elite',
    listPrice: '₹99',
    foundingPrice: '₹79/mo',
    tierLevel: 3,
  },
];

const ACCESS_PACKAGES = [
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

const ROADMAP_MODULES = [
  { icon: '✅', name: 'Life Score', date: 'Sep 2026', status: 'done', tooltip: 'Track sleep, food, gym, mood, and focus daily.' },
  { icon: '🔨', name: 'Discipline Engine', date: 'Oct 2026', status: 'building', tooltip: 'Daily habits, streak recovery, and monthly control.' },
  { icon: '🔨', name: 'Money OS', date: 'Nov 2026', status: 'building', tooltip: 'Spending and productivity in one app.' },
  { icon: '📋', name: 'Spade Briefing', date: 'Q1 2027', status: 'planned', tooltip: 'Context and content without doomscrolling.' },
];

const PREVIEW_SCREENS = [
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

const TESTIMONIALS = [
  {
    quote: 'My students juggle six apps for habits, sleep, and focus. One connected dashboard would change how we teach self-regulation.',
    name: 'Dr. Meera Iyer',
    role: 'Professor, Cognitive Science',
    city: 'IIT Bombay',
    initials: 'MI',
  },
  {
    quote: 'I run experiments on my own discipline data. A weekly pattern view that links mood, sleep, and spend is exactly what I need.',
    name: 'Arnav Desai',
    role: 'Final-year CS, BITS Pilani',
    city: 'Goa',
    initials: 'AD',
  },
  {
    quote: 'At an early-stage startup you cannot afford fragmented tools. I want money clarity and focus sessions in one loop.',
    name: 'Kavya Srinivasan',
    role: 'Product Lead, Series A',
    city: 'Hyderabad',
    initials: 'KS',
  },
  {
    quote: 'I study habit relapse in young adults. If this nails streak recovery and weekly reviews, it is a serious research-grade tool.',
    name: 'Prof. Vikram Hegde',
    role: 'Behavioural Science, IIM Bangalore',
    city: 'Bengaluru',
    initials: 'VH',
  },
];

const FAQS = [
  {
    q: 'What is AIIMIN?',
    a: 'AIIMIN is a personal life operating system — one dashboard where you track habits, sleep, mood, money, focus sessions, and daily wins. It connects the dots across your behaviour so you see patterns, not just logs. Built for Indian students and early professionals who want one system instead of five separate apps.',
  },
  {
    q: 'What is the website vs the mobile app?',
    a: 'Right now, AIIMIN is a desktop web dashboard at aiimin.in — the full analytics experience with charts, correlations, and multi-panel layouts. A native mobile companion app for quick on-the-go logging is in active development. Join the waitlist from any device; use the full dashboard on your laptop when we launch.',
  },
  {
    q: 'Why is AIIMIN desktop-first?',
    a: 'The dashboard is data-dense — weekly pattern charts, money analytics, and correlation views need screen space to be useful. We optimised for laptops and desktops so nothing feels cramped. A native mobile app for quick logging is coming; until then, join the waitlist on your phone and open AIIMIN on your laptop for the full experience.',
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

function comparisonBarWidth(priceInr) {
  if (priceInr <= 0) return '0%';
  return `${(priceInr / COMPARISON_MAX_PRICE) * 100}%`;
}

function ExternalPriceComparison() {
  return (
    <div className="price-comparison-external">
      <h3 className="comparison-title">How AIIMIN compares to other apps</h3>
      <div
        className="comparison-chart"
        role="img"
        aria-label="Monthly price comparison against common productivity apps in India, approximate 2026 pricing"
      >
        {COMPARISON_ROWS.map((row) => {
          const barWidth = comparisonBarWidth(row.priceInr);
          return (
            <div
              key={row.label}
              className={`comparison-row ${row.combined ? 'combined' : ''}`}
            >
              <span className="comparison-label">{row.label}</span>
              <div className="comparison-track" aria-hidden="true">
                {row.priceInr > 0 && (
                  <div className="comparison-fill" style={{ width: barWidth }} />
                )}
              </div>
              <span className="comparison-price">{row.priceLabel}</span>
            </div>
          );
        })}
      </div>
      <p className="comparison-caption">
        India monthly pricing, approximate July 2026. Bars scale proportionally on a single axis — no minimum-width adjustments.
      </p>
    </div>
  );
}

function AiiminTierPriceList() {
  return (
    <div className="aiimin-tier-list">
      <h3 className="comparison-title">AIIMIN tiers at a glance</h3>
      <ul className="aiimin-tier-rows" aria-label="AIIMIN monthly tier prices">
        {AIIMIN_TIER_ROWS.map((row) => (
          <li
            key={row.tier}
            className={`aiimin-tier-row aiimin-tier-level-${row.tierLevel} ${row.highlight ? 'aiimin-tier-row-highlight' : ''}`}
          >
            <span className="aiimin-tier-label">{row.label}</span>
            <span className="aiimin-tier-price">
              {row.foundingPrice ? (
                <>
                  <span className="aiimin-tier-list-price">{row.listPrice}</span>
                  <strong className="aiimin-tier-founding-price">{row.foundingPrice}</strong>
                  <span className="aiimin-tier-founding-note">waitlist founding</span>
                </>
              ) : (
                <strong>{row.price}</strong>
              )}
            </span>
          </li>
        ))}
      </ul>
      <p className="comparison-caption">
        Listed at actual monthly prices — no bar chart so tier gaps stay honest. Pro and Elite founding prices apply to waitlist members at launch.
      </p>
    </div>
  );
}

function PriceComparisonSection() {
  return (
    <div className="price-comparison">
      <ExternalPriceComparison />
      <AiiminTierPriceList />
    </div>
  );
}

function ThemeToggle({ isLight, onToggle }) {
  return (
    <div className="waitlist-theme-segment" role="group" aria-label="Theme">
      <button
        type="button"
        className={`waitlist-theme-segment-btn ${isLight ? 'active' : ''}`}
        onClick={() => { if (!isLight) onToggle(); }}
        aria-pressed={isLight}
        aria-label="Light mode"
      >
        <Sun size={14} />
        Light
      </button>
      <button
        type="button"
        className={`waitlist-theme-segment-btn ${!isLight ? 'active' : ''}`}
        onClick={() => { if (isLight) onToggle(); }}
        aria-pressed={!isLight}
        aria-label="Dark mode"
      >
        <Moon size={14} />
        Dark
      </button>
    </div>
  );
}

function HeroBrandLockup({ markSize = 32, wordmarkSize = 28 }) {
  return (
    <Link to="/brand" className="hero-brand-lockup" aria-label="Explore AIIMIN brand guidelines">
      <ArchBracketMark size={markSize} withChip colors={EDITOR_PICK} className="hero-brand-mark" />
      <Wordmark size={wordmarkSize} color="var(--color-text-1)" />
    </Link>
  );
}

const PREVIEW_PILLS = ['Daily tracking', 'Pattern view', 'Life score'];

function HeroPreviewMock() {
  return (
    <div className="waitlist-hero-preview waitlist-desktop-only">
      <div className="hero-preview-pills" aria-hidden="true">
        {PREVIEW_PILLS.map((label, index) => (
          <span key={label} className={`hero-preview-pill ${index === 0 ? 'active' : ''}`}>{label}</span>
        ))}
      </div>
      <div className="hero-mock-dashboard" aria-label="Dashboard preview mockup">
        <div className="hero-mock-chrome">
          <span className="hero-mock-dot" />
          <span className="hero-mock-dot" />
          <span className="hero-mock-dot" />
        </div>
        <div className="hero-mock-body">
          <div className="hero-mock-sidebar">
            <span className="hero-mock-nav-item active" />
            <span className="hero-mock-nav-item" />
            <span className="hero-mock-nav-item" />
            <span className="hero-mock-nav-item" />
          </div>
          <div className="hero-mock-main">
            <div className="hero-mock-header">
              <span className="hero-mock-title" />
              <span className="hero-mock-pill" />
            </div>
            <div className="hero-mock-stats">
              <div className="hero-mock-stat-card"><span className="hero-mock-stat-value">82%</span><span className="hero-mock-stat-label">Life score</span></div>
              <div className="hero-mock-stat-card"><span className="hero-mock-stat-value">7.2h</span><span className="hero-mock-stat-label">Sleep</span></div>
              <div className="hero-mock-stat-card"><span className="hero-mock-stat-value">8/10</span><span className="hero-mock-stat-label">Logged</span></div>
            </div>
            <div className="hero-mock-chart-wrap">
              <p className="hero-mock-chart-y">Daily completion %</p>
              <div className="hero-mock-chart">
                {[68, 82, 74, 91, 78, 85, 88].map((h, i) => (
                  <span key={`bar-${i}`} className="hero-mock-bar" style={{ height: `${h}%` }} />
                ))}
              </div>
              <p className="hero-mock-chart-axis">Last 7 days</p>
            </div>
          </div>
        </div>
      </div>
      <p className="preview-caption">Daily completion trend — habits, sleep, and focus in one view.</p>
    </div>
  );
}

function MobilePreviewMock() {
  return (
    <div className="mobile-preview-mock" aria-label="Mobile logging preview mockup">
      <div className="mobile-mock-header">
        <span className="mobile-mock-ring" />
        <span className="mobile-mock-streak">🔥 12</span>
      </div>
      <div className="mobile-mock-rows">
        {['Sleep', 'Gym', 'Mood', 'Steps', 'Focus'].map((label) => (
          <div key={label} className="mobile-mock-row">
            <span className="mobile-mock-label">{label}</span>
            <span className="mobile-mock-check" />
          </div>
        ))}
      </div>
      <div className="mobile-mock-save">Save day</div>
    </div>
  );
}

class WaitlistErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err) {
    // eslint-disable-next-line no-console
    console.error('[WaitlistLanding] render error:', err);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="waitlist-fallback">
        <h1>Waitlist page is loading again</h1>
        <p>Something broke while rendering. Please refresh once.</p>
        <a href="/">Reload waitlist</a>
      </div>
    );
  }
}

function WaitlistLandingContent() {
  const { isLight, toggleWaitlistTheme } = useWaitlistSurfaceTheme();
  const [count, setCount] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedPricing, setSelectedPricing] = useState(null);
  const [stickyHidden, setStickyHidden] = useState(false);
  const faqRef = useRef(null);
  const footerRef = useRef(null);

  const pageUrl = 'https://aiimin.in/';
  const imageUrl = 'https://aiimin.in/og-image-v2.png';

  const launchStructuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AIIMIN',
    description: 'A data-dense personal dashboard for daily accountability, behavioral insights, money tracking, and habit building. Built for Indian students and early professionals.',
    url: 'https://aiimin.in',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Desktop Web',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '0',
      highPrice: '99',
      priceCurrency: 'INR',
      offerCount: '4',
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      geographicArea: { '@type': 'Country', name: 'India' },
    },
    author: { '@type': 'Organization', name: 'AIIMIN', url: 'https://aiimin.in' },
  }), []);

  const fetchCount = async () => {
    try {
      const response = await fetch(`${API_URL}/waitlist/count`);
      const data = await response.json();
      setCount(typeof data.count === 'number' ? data.count : 0);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  useEffect(() => {
    const targets = [faqRef.current, footerRef.current].filter(Boolean);
    if (!targets.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const shouldHide = entries.some((entry) => entry.isIntersecting);
        setStickyHidden(shouldHide);
      },
      { threshold: 0.08 },
    );

    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="waitlist-page" id="top">
      <Helmet>
        <title>AIIMIN — Personal Life OS | Join the Waitlist</title>
        <meta
          name="description"
          content="AIIMIN is a data-dense personal dashboard for Indian students and young professionals. Track habits, money, focus, and mood in one screen. Join the waitlist — launching September 2026."
        />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AIIMIN — Life OS from ₹0, Pro founding ₹49/mo" />
        <meta
          property="og:description"
          content="Track habits, money, focus, and mood in one dashboard. Explore free, Core ₹29/mo, Pro ₹49 founding price, Elite ₹79 for waitlist. Built for Indian students."
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIIMIN — Life OS from ₹0, Pro founding ₹49/mo" />
        <meta
          name="twitter:description"
          content="Track habits, money, focus, and mood in one dashboard. Explore free, Core ₹29/mo, Pro ₹49 founding price, Elite ₹79 for waitlist. Built for Indian students."
        />
        <meta name="twitter:image" content={imageUrl} />
        <script type="application/ld+json">{JSON.stringify(launchStructuredData)}</script>
      </Helmet>

      <section className="waitlist-mobile-only mobile-hero-context">
        <div className="mobile-hero-topbar">
          <HeroBrandLockup markSize={28} wordmarkSize={22} />
          <ThemeToggle isLight={isLight} onToggle={toggleWaitlistTheme} />
        </div>
        <div className="waitlist-desktop-notice" role="note">
          <Laptop size={18} className="waitlist-desktop-notice-icon" aria-hidden="true" />
          <div>
            <p className="waitlist-desktop-notice-title">Built for laptop &amp; desktop</p>
            <p className="waitlist-desktop-notice-copy">
              Join the waitlist on your phone. The full dashboard opens on your laptop — native mobile app in development.
            </p>
          </div>
        </div>
        <span className="hero-exclusive-badge">✦ Exclusive early access</span>
        <h1>
          <span className="hero-headline-lead">Your habits, <strong className="hero-serif">money</strong>, focus, and mood.</span>
          <br />
          <span className="line-two"><strong>One screen.</strong> Every day.</span>
        </h1>
        <p>
          AIIMIN is your personal Life OS for Indian students and early professionals.
          Desktop-first — join now, use the full dashboard on your laptop at launch.
        </p>
        <div className="mobile-preview-wrap">
          <MobilePreviewMock />
        </div>
      </section>

      <header className="waitlist-hero">
        <div className="waitlist-hero-orbit" aria-hidden="true" />
        <div className="waitlist-hero-glow" aria-hidden="true" />
        <div className="waitlist-hero-floatbar waitlist-desktop-only">
          <ThemeToggle isLight={isLight} onToggle={toggleWaitlistTheme} />
        </div>
        <div className="waitlist-hero-row waitlist-hero-split">
          <motion.div
            className="waitlist-hero-copy waitlist-desktop-only"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <motion.div className="hero-brand-row" custom={0} variants={fadeUp}>
              <HeroBrandLockup />
            </motion.div>
            <motion.span className="hero-exclusive-badge" custom={1} variants={fadeUp}>
              ✦ Exclusive early access
            </motion.span>
            <motion.h1 className="hero-headline" custom={2} variants={fadeUp}>
              <span className="hero-headline-lead">
                Your habits, <strong className="hero-serif">money</strong>, focus, and mood.
              </span>
              <span className="line-two"><strong>One screen.</strong> Every day.</span>
            </motion.h1>
            <motion.p className="hero-subhead" custom={3} variants={fadeUp}>
              AIIMIN is a data-dense personal Life OS — track behaviour, see patterns, and compound momentum without five separate apps.
            </motion.p>
            <motion.ul className="hero-feature-list" custom={4} variants={fadeUp}>
              {HERO_FEATURES.map((feature) => (
                <li key={feature}>
                  <span className="hero-feature-check" aria-hidden="true"><Check size={14} strokeWidth={2.5} /></span>
                  {feature}
                </li>
              ))}
            </motion.ul>
            <motion.div custom={5} variants={fadeUp}>
              <WaitlistSocialProof count={count} />
            </motion.div>
            <motion.div className="hero-trust-strip" custom={6} variants={fadeUp} aria-label="Replaces common tool stacks">
              <span className="hero-trust-label">Replaces stacks like</span>
              {TRUST_TOOLS.map((tool) => (
                <span key={tool} className="hero-trust-pill">{tool}</span>
              ))}
            </motion.div>
            <motion.div className="founder-signal" custom={7} variants={fadeUp}>
              <span>
                Built by <strong>Aaditya Upadhyay</strong> · B.Tech CSE, Manipal · Personal project · launching Sept 2026
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="waitlist-hero-side"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
          >
            <div className="waitlist-hero-form-wrap" id="waitlist-join">
              <div className="waitlist-hero-form">
                <p className="waitlist-mobile-form-title waitlist-mobile-only">Join the waitlist — founding member perks at launch</p>
                <WaitlistForm variant="hero" onSuccess={fetchCount} showUrgency />
              </div>
              <div className="waitlist-mobile-only waitlist-mobile-social">
                <WaitlistSocialProof count={count} />
              </div>
              <div className="founder-signal waitlist-mobile-only">
                <span>
                  Built by <strong>Aaditya Upadhyay</strong> · B.Tech CSE, Manipal · Personal project · launching Sept 2026
                </span>
              </div>
            </div>
            <HeroPreviewMock />
          </motion.div>
        </div>
      </header>

      <main className="waitlist-main">
        <section className="waitlist-mobile-only waitlist-mobile-essentials">
          <ul className="waitlist-mobile-perk-list">
            <li>⏰ Tester cutoff: 31 July</li>
            <li>📅 Go-live: end of September 2026</li>
          </ul>
        </section>

        <section className="waitlist-section waitlist-desktop-only">
          <p className="waitlist-section-label">Who this is for</p>
          <h2>Built for people who want one system to run their life</h2>
          <div className="waitlist-grid waitlist-grid-4">
            {PERSONAS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  custom={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  className="waitlist-card"
                >
                  <Icon size={18} className="waitlist-card-icon" />
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="waitlist-section pricing-section waitlist-desktop-only">
          <p className="waitlist-section-label">Pricing</p>
          <h2>Four tiers — from free Explore to full Elite</h2>
          <p className="waitlist-section-copy">
            Most productivity stacks cost ₹500–₹1,600/month across separate apps.
            AIIMIN bundles habits, money, focus, and mood from ₹0 — with Pro at ₹49/mo founding price for waitlist members.
          </p>
          <div className="waitlist-pricing-grid">
            {PRICING.map((item, index) => (
              <motion.button
                key={item.tier}
                type="button"
                custom={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                className={`waitlist-pricing-card waitlist-pricing-tier-${item.tierAccent} ${item.highlight ? 'waitlist-pricing-highlight' : ''} ${selectedPricing === item.tier ? 'waitlist-pricing-active' : ''}`}
                onClick={() => setSelectedPricing(item.tier)}
                aria-pressed={selectedPricing === item.tier}
              >
                {item.startHere && <span className="waitlist-popular-badge">Start here</span>}
                {item.popularBadgeLabel && (
                  <span className="waitlist-popular-badge">{item.popularBadgeLabel}</span>
                )}
                {item.waitlistBadge && <div className="waitlist-badge">{item.waitlistBadgeLabel || 'WAITLIST PERK'}</div>}
                <h3>{item.tier}</h3>
                {item.discounted ? (
                  <div className="tier-price">
                    <span className="price-original">{item.price}</span>
                    <span className="price-discounted">{item.discounted}</span>
                    <span className="tier-price-period">/mo for waitlist members</span>
                  </div>
                ) : (
                  <p className="waitlist-price tier-price">{item.price}</p>
                )}
                {item.freeNote && <p className="tier-free-note">{item.freeNote}</p>}
                <p className="waitlist-pricing-note">{item.note}</p>
                <ul className="waitlist-pricing-list">
                  {item.summary.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <span className="waitlist-pricing-tap">
                  Tap to see full breakdown
                  <ChevronDown size={14} aria-hidden="true" />
                </span>
              </motion.button>
            ))}
          </div>
          {selectedPricing && (() => {
            const active = PRICING.find((p) => p.tier === selectedPricing);
            if (!active) return null;
            return (
              <motion.div
                key={active.tier}
                className="waitlist-pricing-detail"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="waitlist-pricing-tabs" role="tablist" aria-label="Pricing tier breakdown">
                  {PRICING.map((tier) => (
                    <button
                      key={tier.tier}
                      type="button"
                      role="tab"
                      aria-selected={selectedPricing === tier.tier}
                      className={`waitlist-pricing-tab ${selectedPricing === tier.tier ? 'waitlist-pricing-tab-active' : ''}`}
                      onClick={() => setSelectedPricing(tier.tier)}
                    >
                      {tier.tier}
                    </button>
                  ))}
                </div>
                <div className="waitlist-pricing-detail-head">
                  <h3>{active.tier}: what you get</h3>
                  <p>Best for: {active.bestFor}</p>
                </div>
                <ul className="waitlist-pricing-detail-list">
                  {active.includes.map((line) => (
                    <li key={line}><BadgeCheck size={14} /> {line}</li>
                  ))}
                </ul>
              </motion.div>
            );
          })()}
          <PriceComparisonSection />
        </section>

        <section className="waitlist-section waitlist-desktop-only">
          <p className="waitlist-section-label">How it works</p>
          <h2>Three steps from signup to momentum</h2>
          <div className="waitlist-grid waitlist-grid-3">
            {HOW_IT_WORKS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.title}
                  custom={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  className="waitlist-card waitlist-step-card"
                >
                  <span className="waitlist-step-index">0{index + 1}</span>
                  <Icon size={18} className="waitlist-card-icon" />
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="waitlist-section waitlist-section-alt waitlist-desktop-only">
          <p className="waitlist-section-label">What you will get</p>
          <h2>Real screens, not abstract promises</h2>
          <div className="waitlist-grid waitlist-grid-3">
            {PREVIEW_SCREENS.map((screen, index) => (
              <motion.article
                key={screen.title}
                custom={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.28 }}
                className="waitlist-card waitlist-screen-card"
              >
                <p className="waitlist-screen-title">{screen.title}</p>
                <div className="waitlist-screen-stat">
                  <strong>{screen.stat}</strong>
                  <span>{screen.statLabel}</span>
                </div>
                <div className="waitlist-screen-bars" aria-hidden="true">
                  {screen.bars.map((h) => (
                    <span key={`${screen.title}-${h}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <p>{screen.caption}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="waitlist-section waitlist-access-tiers waitlist-desktop-only">
          <p className="waitlist-section-label">Early access</p>
          <h2>Two paths in — testers get the VIP package</h2>
          <p className="waitlist-section-copy">
            Invited testers and waitlist members get different packages. Pick the path that matches how you arrived.
          </p>
          <div className="path-timeline">
            <div className="timeline-step active"><span className="step-number">1</span><span className="step-label">Now: Sign up</span></div>
            <div className="timeline-connector" />
            <div className="timeline-step"><span className="step-number">2</span><span className="step-label">Launch: Onboard</span></div>
            <div className="timeline-connector" />
            <div className="timeline-step"><span className="step-number">3</span><span className="step-label">Day 1: Dashboard</span></div>
          </div>
          <div className="waitlist-tier-compare">
            {ACCESS_PACKAGES.map((pkg, index) => (
              <motion.article
                key={pkg.id}
                className={`waitlist-tier-card waitlist-tier-card-${pkg.id} ${pkg.tagVariant === 'premium' ? 'waitlist-tier-card-premium' : ''}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
              >
                <span className={`waitlist-tier-tag waitlist-tier-tag-${pkg.tagVariant}`}>{pkg.tag}</span>
                <h3>{pkg.title}</h3>
                <p className="waitlist-tier-deadline">{pkg.deadline()}</p>
                <ul className="waitlist-tier-list">
                  {pkg.perks.map((perk) => {
                    const Icon = perk.icon;
                    return (
                      <li key={perk.text}>
                        <Icon size={14} />
                        {perk.text}
                      </li>
                    );
                  })}
                </ul>
                {pkg.cta.href.startsWith('/') ? (
                  <Link to={pkg.cta.href} className="waitlist-btn waitlist-btn-primary waitlist-tier-cta">
                    {pkg.cta.label}
                  </Link>
                ) : (
                  <a href={pkg.cta.href} className="waitlist-btn waitlist-btn-primary waitlist-tier-cta">
                    <Sparkles size={15} />
                    {pkg.cta.label}
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        </section>

        <section className="waitlist-section roadmap-section waitlist-desktop-only">
          <p className="waitlist-section-label">Roadmap</p>
          <h2>What ships and when</h2>
          <p className="waitlist-section-copy">We ship in modules. Each is tested before the next begins.</p>
          <div className="roadmap-bar">
            {ROADMAP_MODULES.map((mod, index) => (
              <React.Fragment key={mod.name}>
                {index > 0 && <div className="roadmap-connector" />}
                <div className={`roadmap-module ${mod.status}`} data-tooltip={mod.tooltip} tabIndex={0}>
                  <span className="module-icon">{mod.icon}</span>
                  <span className="module-name">{mod.name}</span>
                  <span className="module-date">{mod.date}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className="waitlist-section waitlist-testimonials waitlist-desktop-only">
          <p className="waitlist-section-label">Early voices</p>
          <h2>What testers are saying</h2>
          <div className="waitlist-grid waitlist-grid-2 waitlist-testimonial-grid">
            {TESTIMONIALS.map((item, index) => (
              <motion.article
                key={item.name}
                custom={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="waitlist-card waitlist-quote-card"
              >
                <MessageSquareQuote size={18} className="waitlist-card-icon" />
                <p className="waitlist-quote-text">&ldquo;{item.quote}&rdquo;</p>
                <div className="waitlist-quote-author">
                  <span className="waitlist-quote-avatar">{item.initials}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.role} · {item.city}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="waitlist-section waitlist-faq-wrap faq-section" ref={faqRef}>
          <p className="waitlist-section-label">FAQ</p>
          <h2>Questions before joining?</h2>
          <div className="waitlist-faq-list">
            {FAQS.map((faq, index) => (
              <article key={faq.q} className="waitlist-faq-item">
                <button
                  type="button"
                  className="waitlist-faq-trigger"
                  onClick={() => setOpenFaq((prev) => (prev === index ? -1 : index))}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`waitlist-faq-icon ${openFaq === index ? 'waitlist-faq-icon-open' : ''}`}
                  />
                </button>
                {openFaq === index && <p className="waitlist-faq-answer">{faq.a}</p>}
              </article>
            ))}
          </div>
        </section>

        <section className="waitlist-section waitlist-secondary-cta">
          <h2>Join the waitlist — founding member perks at launch</h2>
          <p className="waitlist-section-copy">
            Starter kit, complimentary Core, Pro founding ₹49/mo, and Elite founding ₹79/mo. Invited testers get the VIP package — sign in instead.
          </p>
          <div className="waitlist-secondary-cta-form">
            <WaitlistForm compact onSuccess={fetchCount} showFeatureVote={false} />
          </div>
          <a href="#top" className="waitlist-back-top">
            Back to hero <ArrowRight size={14} />
          </a>
        </section>
      </main>

      <footer className="waitlist-footer" ref={footerRef}>
        <Link to="/brand" className="waitlist-footer-brand" aria-label="Explore AIIMIN brand">
          <Wordmark size={22} color="var(--color-text-1)" />
        </Link>
        <p>Built by Aaditya Upadhyay · India-first life OS for students and early professionals.</p>
        <nav>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Sign in</Link>
        </nav>
      </footer>

      <a
        href="#waitlist-join"
        className={`waitlist-mobile-cta waitlist-btn waitlist-btn-primary sticky-cta ${stickyHidden ? 'hidden' : ''}`}
      >
        <Sparkles size={15} />
        Reserve my spot
      </a>
    </div>
  );
}

export default function WaitlistLanding() {
  return (
    <WaitlistErrorBoundary>
      <WaitlistLandingContent />
    </WaitlistErrorBoundary>
  );
}
