import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Brain,
  BriefcaseBusiness,
  CalendarClock,
  ChartColumnBig,
  ChevronDown,
  Clock3,
  Gift,
  GraduationCap,
  KeyRound,
  Landmark,
  Lock,
  Laptop,
  MessageSquareQuote,
  Rocket,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
  Target,
  UserPlus,
  Wallet,
  Waves,
  Zap,
} from 'lucide-react';
import useTheme from '../hooks/useTheme';
import { API_URL } from '../utils/api';
import WaitlistForm from '../components/waitlist/WaitlistForm';
import WaitlistQuickFeedback from '../components/waitlist/WaitlistQuickFeedback';
import Wordmark from '../components/brand/Wordmark';
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

const VALUE_PILLARS = [
  {
    icon: Target,
    title: 'Track your full day',
    desc: 'Habits, sleep, mood, money, and focus linked in a single timeline.',
  },
  {
    icon: Brain,
    title: 'See patterns quickly',
    desc: 'AI surfaces what improves your weeks and what quietly breaks momentum.',
  },
  {
    icon: Zap,
    title: 'Level up consistently',
    desc: 'Streak systems and review loops help you recover fast and keep growing.',
  },
];

const HOW_IT_WORKS = [
  {
    icon: UserPlus,
    title: 'Join waitlist',
    desc: 'Sign up in under 20 seconds. Email is enough to reserve your spot.',
  },
  {
    icon: Sparkles,
    title: 'Set up your systems',
    desc: 'Habits, focus, money, and growth modules are unlocked in guided waves.',
  },
  {
    icon: Waves,
    title: 'Improve with feedback loops',
    desc: 'Get weekly pattern insights so you can iterate faster and stay consistent.',
  },
];

const LAUNCH_TARGET = '2026-09-30T23:59:59+05:30';
const TESTER_DEADLINE = '2026-07-31T23:59:59+05:30';

const LAUNCH_PHASES = [
  {
    phase: 'Now',
    title: 'Tester registration',
    desc: 'Personally invited testers claim the VIP package — Elite free for a year plus full beta access. Window closes 31 July.',
    badge: 'Invite only',
  },
  {
    phase: 'Aug',
    title: 'Waitlist onboarding',
    desc: 'Waitlist members get the founding kit, Core subscription, and Elite discount at public launch.',
    badge: 'Waitlist priority',
  },
  {
    phase: 'Sept',
    title: 'Go-live target',
    desc: 'We are targeting end of September 2026 for public launch. Exact date may shift slightly.',
    badge: 'Everyone',
  },
];

const SNEAK_PEEKS = [
  {
    stage: 'Wave 01',
    title: 'Life Score',
    desc: 'One score across sleep, habits, focus, and mood.',
    eta: 'Beta rollout',
  },
  {
    stage: 'Wave 02',
    title: 'Discipline Engine',
    desc: 'Relapse-safe streak recovery and momentum planning.',
    eta: 'Beta rollout',
  },
  {
    stage: 'Wave 03',
    title: 'Money OS',
    desc: 'Simple student-first spend tracking and monthly control.',
    eta: 'Launch window',
  },
  {
    stage: 'Wave 04',
    title: 'Sports Briefing',
    desc: 'Cricket, football, and F1 context without doom scrolling.',
    eta: 'Launch window',
  },
];

const WAITLIST_PERKS = [
  {
    icon: Gift,
    title: 'Launch starter kit',
    desc: 'Curated onboarding bundle to set up habits, money, and focus from day one.',
    featured: true,
  },
  {
    icon: Rocket,
    title: 'Complimentary Core subscription',
    desc: 'Full Core tier included at launch so you start with the complete daily OS.',
    featured: true,
  },
  {
    icon: BadgeCheck,
    title: '40% off Elite for 12 months',
    desc: 'Founding discount on our highest tier — the best deal we will ever offer publicly.',
    featured: true,
  },
  {
    icon: KeyRound,
    title: 'Reserve your OS-ID',
    desc: 'Lock your 8-character handle before public release.',
  },
  {
    icon: Sparkles,
    title: 'Priority invite waves',
    desc: 'Onboard before open registration fills up.',
  },
  {
    icon: MessageSquareQuote,
    title: 'Shape the roadmap',
    desc: 'Your feedback decides what ships in the first launch waves.',
  },
];

const ACCESS_PACKAGES = [
  {
    id: 'tester',
    tag: 'VIP invite',
    tagVariant: 'premium',
    title: 'Invited testers',
    deadline: (days) => `Register by 31 July · ${days} days left`,
    perks: [
      { icon: ShieldCheck, text: 'Elite (₹99/mo) free for 12 months — ₹1,188 value' },
      { icon: Rocket, text: 'First access to every beta module before public release' },
      { icon: KeyRound, text: 'Priority OS-ID reservation + direct founder feedback channel' },
      { icon: Sparkles, text: 'Prototype features: Life Score, Discipline Engine, Sports Briefing' },
      { icon: BadgeCheck, text: 'Priority support queue throughout the beta year' },
    ],
    cta: { label: 'Sign in to register', href: '/login', variant: 'primary' },
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
      { icon: BadgeCheck, text: '40% off Elite for 12 months after launch' },
      { icon: KeyRound, text: 'OS-ID reservation + priority onboarding waves' },
      { icon: MessageSquareQuote, text: 'Roadmap voting — your ideas shape launch priority' },
    ],
    cta: { label: 'Join waitlist', href: '#waitlist-join', variant: 'primary' },
  },
];

const PRICING = [
  {
    tier: 'Explore',
    price: 'Free',
    note: 'Try the core flow',
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
    price: '₹25/mo',
    note: 'Best for most users',
    highlight: true,
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
    price: '₹61/mo',
    note: 'Advanced systems',
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
    price: '₹99/mo',
    note: 'Priority power tier',
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

const CAMPUS_STRIP = ['BITS Pilani', 'IIT Delhi', 'NIT Trichy', 'Manipal', 'VIT', 'Ashoka'];

const AFTER_SIGNUP = [
  {
    step: '01',
    title: 'Instant confirmation',
    desc: 'You get a waitlist email with your perk breakdown and launch timeline.',
  },
  {
    step: '02',
    title: 'Priority beta invites',
    desc: 'Waitlist members onboard in waves through August as slots open.',
  },
  {
    step: '03',
    title: 'Launch by end of September',
    desc: 'Starter kit, Core subscription, and Elite discount unlock at go-live.',
  },
];

const FAQS = [
  {
    q: 'What is AIIMIN?',
    a: 'AIIMIN is a personal life OS that combines habits, focus, money, and growth in one connected dashboard.',
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
    a: 'The founding member package: launch starter kit, complimentary Core at go-live, 40% off Elite for 12 months, OS-ID reservation, and priority onboarding.',
  },
  {
    q: 'Is Explore free?',
    a: 'Yes. Explore stays free forever. Waitlist and tester perks apply to paid tiers at launch.',
  },
  {
    q: 'What is an OS-ID?',
    a: 'OS-ID is your unique AIIMIN handle. You can reserve it on the waitlist form or claim it during invite onboarding.',
  },
  {
    q: 'Can I use AIIMIN on my phone?',
    a: 'The full dashboard is built for laptop and desktop. It tracks dense daily data — habits, money, focus, and analytics — which does not work well in a mobile browser. A native mobile app is in development. Join the waitlist here; use a computer when your invite arrives.',
  },
  {
    q: 'Can I invite friends?',
    a: 'Yes. We are adding referral priority waves during the invite rollout.',
  },
  {
    q: 'How is my data handled?',
    a: 'Only details needed for waitlist and launch communication are stored. No spam, and unsubscribe options are available.',
  },
];

function computeDaysToLaunch(targetIsoDate) {
  const now = new Date();
  const target = new Date(targetIsoDate);
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
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
  const { setForcedTheme } = useTheme();
  const [count, setCount] = useState(null);
  const [displayCount, setDisplayCount] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedPricing, setSelectedPricing] = useState('Core');
  const [daysToTesterDeadline, setDaysToTesterDeadline] = useState(() => computeDaysToLaunch(TESTER_DEADLINE));
  const [waitlistTheme, setWaitlistTheme] = useState(() => {
    if (typeof window === 'undefined') return 'nordic';
    return localStorage.getItem('aiimin-waitlist-theme') || 'nordic';
  });

  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://aiimin.in';
  const imageUrl = typeof window !== 'undefined' ? `${window.location.origin}/AIIMIN_logo.svg` : 'https://aiimin.in/AIIMIN_logo.svg';

  const launchStructuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AIIMIN Waitlist',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    url: pageUrl,
    image: imageUrl,
    description: 'Join AIIMIN waitlist to get early access to habits, focus, money, and growth systems.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
  }), [imageUrl, pageUrl]);

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
    setDaysToTesterDeadline(computeDaysToLaunch(TESTER_DEADLINE));
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiimin-waitlist-theme', waitlistTheme);
    }
    setForcedTheme(waitlistTheme);
    return () => setForcedTheme(null);
  }, [waitlistTheme, setForcedTheme]);

  useEffect(() => {
    if (typeof count !== 'number') return;
    const from = 0;
    const to = count;
    const duration = 900;
    let rafId = null;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - ((1 - progress) ** 3);
      setDisplayCount(Math.round(from + (to - from) * eased));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [count]);

  return (
    <div className="waitlist-page" id="top">
      <Helmet>
        <title>AIIMIN - Join the Waitlist for Your Personal Life OS</title>
        <meta
          name="description"
          content="Track habits, focus, money, and growth in one connected life dashboard. Join the AIIMIN waitlist for early access."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AIIMIN - Join the Waitlist for Your Personal Life OS" />
        <meta
          property="og:description"
          content="Track habits, focus, money, and growth in one connected life dashboard. Join the AIIMIN waitlist for early access."
        />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIIMIN - Join the Waitlist for Your Personal Life OS" />
        <meta
          name="twitter:description"
          content="Track habits, focus, money, and growth in one connected life dashboard. Join the AIIMIN waitlist for early access."
        />
        <meta name="twitter:image" content={imageUrl} />
        <script type="application/ld+json">{JSON.stringify(launchStructuredData)}</script>
      </Helmet>

      <header className="waitlist-nav" aria-label="Site navigation">
        <div className="waitlist-nav-inner">
          <a href="#top" className="waitlist-nav-brand" aria-label="AIIMIN home">
            <Wordmark size={24} color="var(--color-text-1)" />
          </a>
          <div className="waitlist-nav-actions">
            <button
              type="button"
              className="waitlist-btn waitlist-btn-ghost waitlist-btn-theme"
              onClick={() => setWaitlistTheme((prev) => (prev === 'nordic' ? 'vercel' : 'nordic'))}
              aria-label={waitlistTheme === 'nordic' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {waitlistTheme === 'nordic' ? <Moon size={15} /> : <Sun size={15} />}
              <span>{waitlistTheme === 'nordic' ? 'Dark' : 'Light'}</span>
            </button>
            <a href="#waitlist-join" className="waitlist-btn waitlist-btn-primary">
              <Sparkles size={15} />
              Join waitlist
            </a>
          </div>
        </div>
      </header>

      <div className="waitlist-mobile-only waitlist-desktop-notice" role="note">
        <Laptop size={20} className="waitlist-desktop-notice-icon" />
        <div>
          <p className="waitlist-desktop-notice-title">Built for laptop &amp; desktop</p>
          <p className="waitlist-desktop-notice-copy">
            AIIMIN tracks dense daily data — habits, money, focus, and deep analytics. The full dashboard is not supported on mobile browsers. A native mobile app is in development. You can join the waitlist here; use a computer when your invite arrives.
          </p>
        </div>
      </div>

      <header className="waitlist-hero">
        <div className="waitlist-hero-glow" aria-hidden="true" />
        <div className="waitlist-hero-grid">
          <motion.div className="waitlist-hero-copy" initial="hidden" animate="visible" variants={fadeUp}>
            <motion.div custom={0} variants={fadeUp}>
              <Wordmark size={34} color="var(--color-text-1)" />
            </motion.div>
            <motion.p className="waitlist-kicker" custom={1} variants={fadeUp}>
              Built for Indian students and early professionals
            </motion.p>
            <motion.h1 className="waitlist-title" custom={2} variants={fadeUp}>
              Stop juggling apps.
              <span> Run your life</span>
              {' '}from one place.
            </motion.h1>
            <motion.p className="waitlist-subtitle" custom={3} variants={fadeUp}>
              Invited testers unlock the VIP package — Elite free for a year plus full beta access. Waitlist members get the founding kit, Core subscription, and Elite discount at launch.
            </motion.p>
            <motion.div className="waitlist-hero-pills" custom={4} variants={fadeUp}>
              <span className="waitlist-pill"><CalendarClock size={14} /> Live by end of Sept 2026</span>
              <span className="waitlist-pill waitlist-pill-accent"><ShieldCheck size={14} /> Testers: VIP perks</span>
              <span className="waitlist-pill"><Clock3 size={14} /> {daysToTesterDeadline}d left for testers</span>
            </motion.div>
          </motion.div>

          <div className="waitlist-hero-side">
            <motion.div className="waitlist-hero-form" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.55 }}>
              <WaitlistForm onSuccess={fetchCount} />
              <p className="waitlist-count">
                {count === null ? (
                  <span className="waitlist-count-skeleton" aria-hidden="true" />
                ) : (
                  `${displayCount.toLocaleString()} people already joined early access.`
                )}
              </p>
              <p className="waitlist-login-link">
                Already invited? <Link to="/login">Sign in</Link>
              </p>
            </motion.div>

            <motion.div className="waitlist-preview-card waitlist-desktop-only" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.5 }}>
              <div className="waitlist-mock-browser">
                <span /><span /><span />
                <p>aiimin.in/overview</p>
              </div>
              <p className="waitlist-preview-label">Live product preview</p>
              <h3>Your life dashboard in one view</h3>
              <div className="waitlist-preview-metrics">
                <div><span>Consistency</span><strong>82%</strong></div>
                <div><span>Focus Sessions</span><strong>19</strong></div>
                <div><span>Money Clarity</span><strong>+12%</strong></div>
              </div>
              <div className="waitlist-preview-chart" aria-hidden="true">
                {[48, 62, 55, 74, 68, 82, 76].map((h) => (
                  <span key={h} style={{ height: `${h}%` }} />
                ))}
              </div>
              <p className="waitlist-preview-footnote">Full dashboard access unlocks in invite wave 1.</p>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="waitlist-main">
        <section className="waitlist-mobile-only waitlist-mobile-essentials">
          <p className="waitlist-section-label">Early access</p>
          <h2>Join now — use desktop later</h2>
          <ul className="waitlist-mobile-perk-list">
            <li><ShieldCheck size={15} /> <strong>Testers:</strong> Elite free 1 year · register by 31 July</li>
            <li><Gift size={15} /> <strong>Waitlist:</strong> starter kit + Core + 40% off Elite</li>
            <li><CalendarClock size={15} /> Go-live target: end of September 2026</li>
          </ul>
          <p className="waitlist-mobile-essentials-note">
            Already invited? <Link to="/login">Sign in on desktop</Link> to register.
          </p>
        </section>

        <section className="waitlist-section waitlist-campus-strip waitlist-desktop-only">
          <p className="waitlist-section-label">Built for campus life</p>
          <h2>Students across India are already lining up</h2>
          <div className="waitlist-campus-logos">
            {CAMPUS_STRIP.map((campus) => (
              <span key={campus} className="waitlist-campus-badge">{campus}</span>
            ))}
          </div>
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

        <section className="waitlist-section waitlist-section-alt waitlist-desktop-only">
          <p className="waitlist-section-label">Why AIIMIN exists</p>
          <h2>Stop juggling 10 apps for one life</h2>
          <p className="waitlist-section-copy">
            AIIMIN connects tracking, reflection, and execution so your data turns into action.
          </p>
          <div className="waitlist-grid waitlist-grid-3">
            {VALUE_PILLARS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  custom={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
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

        <section className="waitlist-section waitlist-desktop-only">
          <p className="waitlist-section-label">Launch timeline</p>
          <h2>Two paths in — one product out</h2>
          <p className="waitlist-section-copy">
            Testers and waitlist members get different packages. Pick the path that matches how you arrived here.
          </p>
          <div className="waitlist-phase-grid">
            {LAUNCH_PHASES.map((item, index) => (
              <motion.article
                key={item.title}
                custom={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="waitlist-phase-card"
              >
                <span className="waitlist-phase-badge">{item.badge}</span>
                <span className="waitlist-phase-label">{item.phase}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="waitlist-section waitlist-section-alt waitlist-desktop-only">
          <p className="waitlist-section-label">Product roadmap</p>
          <h2>Shipping in waves before go-live</h2>
          <p className="waitlist-section-copy">
            We ship in waves so each module is tested with real usage before broad release.
          </p>
          <div className="waitlist-timeline">
            {SNEAK_PEEKS.map((item, index) => (
              <motion.article
                key={item.title}
                custom={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                className="waitlist-timeline-item"
              >
                <span className="waitlist-timeline-dot" />
                <div className="waitlist-timeline-body">
                  <span className="waitlist-stage">{item.stage}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <small>{item.eta}</small>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="waitlist-section waitlist-access-tiers waitlist-desktop-only">
          <p className="waitlist-section-label">Who gets what</p>
          <h2>Two paths in — testers get the VIP package</h2>
          <p className="waitlist-section-copy">
            Invited testers get the highest-value perks including Elite free for a year. Waitlist members get the founding member bundle at public launch.
          </p>
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
                <p className="waitlist-tier-deadline">
                  {typeof pkg.deadline === 'function' ? pkg.deadline(daysToTesterDeadline) : pkg.deadline}
                </p>
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
                    {pkg.id === 'waitlist' && <Sparkles size={15} />}
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

        <section className="waitlist-section waitlist-section-alt waitlist-desktop-only">
          <p className="waitlist-section-label">Waitlist perks breakdown</p>
          <h2>Everything waitlist members unlock at launch</h2>
          <div className="waitlist-grid waitlist-grid-2">
            {WAITLIST_PERKS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  custom={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  className={`waitlist-card ${item.featured ? 'waitlist-perk-featured' : ''}`}
                >
                  {item.featured && <span className="waitlist-perk-badge">Launch perk</span>}
                  <Icon size={18} className="waitlist-card-icon" />
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="waitlist-section waitlist-after-signup waitlist-desktop-only">
          <p className="waitlist-section-label">What happens next</p>
          <h2>From signup to your first dashboard session</h2>
          <div className="waitlist-after-grid">
            {AFTER_SIGNUP.map((item, index) => (
              <motion.article
                key={item.step}
                custom={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="waitlist-after-card"
              >
                <span className="waitlist-after-step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="waitlist-section waitlist-desktop-only">
          <p className="waitlist-section-label">India-first pricing</p>
          <h2>Transparent tiers from day one</h2>
          <p className="waitlist-section-copy">Tap any tier to see exactly what is included.</p>
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
                className={`waitlist-pricing-card ${item.highlight ? 'waitlist-pricing-highlight' : ''} ${selectedPricing === item.tier ? 'waitlist-pricing-active' : ''}`}
                onClick={() => setSelectedPricing(item.tier)}
                aria-pressed={selectedPricing === item.tier}
              >
                {item.highlight && <span className="waitlist-popular-badge">Most popular</span>}
                <h3>{item.tier}</h3>
                <p className="waitlist-price">{item.price}</p>
                <p className="waitlist-pricing-note">{item.note}</p>
                <ul className="waitlist-pricing-list">
                  {item.summary.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <span className="waitlist-pricing-tap">Tap to see full breakdown</span>
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
                <div className="waitlist-pricing-detail-head">
                  <h3>{active.tier} — what you get</h3>
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
        </section>

        <section className="waitlist-section waitlist-proof-strip waitlist-desktop-only">
          <div className="waitlist-proof-item"><BadgeCheck size={16} /> Built in India for students and early professionals</div>
          <div className="waitlist-proof-item"><Wallet size={16} /> India-first pricing from ₹25/month</div>
          <div className="waitlist-proof-item"><Lock size={16} /> Privacy-first signup and communication</div>
        </section>

        <section className="waitlist-section waitlist-testimonials waitlist-desktop-only">
          <p className="waitlist-section-label">Early voices</p>
          <h2>What early users say they need</h2>
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
                  <p className="waitlist-quote-text">“{item.quote}”</p>
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

        <section className="waitlist-section waitlist-feedback-wrap waitlist-desktop-only">
          <div className="waitlist-feedback-layout">
            <div className="waitlist-feedback-intro">
              <p className="waitlist-section-label">Help shape the launch</p>
              <h2>Tell us what your life OS should do first</h2>
              <p className="waitlist-section-copy">
                Your feedback becomes a launch priority score. We ship what the waitlist asks for most.
              </p>
              <ul className="waitlist-feedback-benefits">
                <li><Sparkles size={14} /> Feature votes influence August and September waves</li>
                <li><BadgeCheck size={14} /> Anonymous by default — email only if you want follow-up</li>
                <li><Rocket size={14} /> Top requests get public roadmap updates</li>
              </ul>
            </div>
            <div className="waitlist-feedback-panel">
              <WaitlistQuickFeedback />
            </div>
          </div>
        </section>

        <section className="waitlist-section waitlist-faq-wrap">
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

        <section className="waitlist-section waitlist-secondary-cta" id="waitlist-join">
          <h2>Join the waitlist — founding member perks at launch</h2>
          <p className="waitlist-section-copy">
            Starter kit, complimentary Core, and 40% off Elite. Invited testers get the VIP package — sign in instead.
          </p>
          <div className="waitlist-secondary-cta-form">
            <WaitlistForm compact onSuccess={fetchCount} />
          </div>
          <a href="#top" className="waitlist-back-top">
            Back to hero <ArrowRight size={14} />
          </a>
        </section>
      </main>

      <footer className="waitlist-footer">
        <Wordmark size={22} color="var(--color-text-1)" />
        <p>Built in India for students and early professionals.</p>
        <nav>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Sign in</Link>
        </nav>
        <p className="waitlist-footer-social">
          <Landmark size={14} /> AIIMIN is designed around the Indian student and early-career context.
        </p>
      </footer>

      <a href="#waitlist-join" className="waitlist-mobile-cta waitlist-btn waitlist-btn-primary">
        <Sparkles size={15} />
        Join waitlist
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
