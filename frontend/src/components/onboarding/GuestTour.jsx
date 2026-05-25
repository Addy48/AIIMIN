import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X, ChevronRight, ChevronLeft, UserPlus, LogIn,
  BarChart2, Target, BookOpen, Zap, Briefcase,
  DollarSign, Calendar, FlaskConical, Brain,
  User, Minus, MapPin, Sparkles, Shield
} from 'lucide-react';

const TOUR_KEY = 'aiimin_tour_seen_v2';

const STEPS = [
  {
    route: '/overview',
    icon: Sparkles,
    color: '#1E4A32',
    bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    tag: 'YOUR LIFE OS',
    title: 'Welcome to AIIMIN 👋',
    description: 'AIIMIN is your personal life operating system — a private dashboard that centralises your daily habits, goals, journal, finance, focus sessions, and career planning in one calm, intelligent space.',
    features: ['100% private & personal', 'AI-powered insights', 'No subscriptions — free to explore'],
  },
  {
    route: '/overview',
    icon: BarChart2,
    color: '#6366f1',
    bg: 'linear-gradient(135deg, #ede9fe 0%, #c7d2fe 100%)',
    tag: 'TODAY DASHBOARD',
    title: 'Day Control Centre',
    description: 'Every morning starts here. See your mood, energy & focus scores, active habits, upcoming events, productivity streaks, and your AI-generated daily pulse — all at a glance.',
    features: ['Daily mood & energy tracker', 'Habit streak overview', 'Operational pulse widget'],
  },
  {
    route: '/habits',
    icon: Target,
    color: '#10b981',
    bg: 'linear-gradient(135deg, #d1fae5 0%, #bbf7d0 100%)',
    tag: 'HABITS',
    title: 'Habit Tracking System',
    description: 'Build consistency that compounds. Create daily, weekly or custom habits, track streaks, earn milestones, and visualise your long-term consistency with heatmaps.',
    features: ['Daily & weekly habit cadence', 'Streak milestones & badges', 'Consistency heatmap calendar'],
  },
  {
    route: '/goals',
    icon: Target,
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    tag: 'GOALS',
    title: 'Goals & Milestones',
    description: 'Turn abstract ambitions into structured results. Set long-term life goals, define key results, break them into actionable tasks, and track completion progress over time.',
    features: ['Long-term goal frameworks', 'Sub-task breakdowns', 'Progress % tracking'],
  },
  {
    route: '/journal',
    icon: BookOpen,
    color: '#ec4899',
    bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    tag: 'JOURNAL',
    title: 'Daily Journal & Reflection',
    description: 'Build deep self-awareness. Log morning intentions, evening gratitude entries, rate your daily productivity and focus, and maintain a permanent record of your mental journey.',
    features: ['Morning & evening entries', 'Productivity & focus scoring', 'Permanent searchable log'],
  },
  {
    route: '/focus',
    icon: Zap,
    color: '#f97316',
    bg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    tag: 'FOCUS ROOM',
    title: 'Deep Focus & Pomodoro',
    description: 'Lock into flow state. Custom Pomodoro sessions, ambient soundscapes (Lofi, Rain, White Noise, Fireplace), distraction blocking, and complete session history tracking.',
    features: ['Custom Pomodoro timer', '5 ambient sound modes', 'Session history & analytics'],
  },
  {
    route: '/finance',
    icon: DollarSign,
    color: '#0ea5e9',
    bg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    tag: 'FINANCE',
    title: 'Wealth & Finance Ledger',
    description: 'Take full control of your money. Log transactions, build budgets, track live Gold/Silver/Mutual Fund prices, visualise spending patterns, and get AI-powered financial summaries.',
    features: ['Income & expense tracking', 'Live market asset prices', 'Monthly budget planning'],
  },
  {
    route: '/placements',
    icon: Briefcase,
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
    tag: 'CAREER',
    title: 'Placement & ATS Analyzer',
    description: 'Supercharge your career prep. Kanban board for job applications, interview stage tracking, ATS resume scanner with match scoring, keyword gap analysis, and company research.',
    features: ['Kanban job tracker', 'ATS resume match score', 'Interview stage pipeline'],
  },
  {
    route: '/calendar',
    icon: Calendar,
    color: '#14b8a6',
    bg: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
    tag: 'CALENDAR',
    title: 'Unified Calendar View',
    description: 'All your time in one place. Google Calendar sync displays your real events alongside AIIMIN tasks, deadlines, and focus sessions — fully unified in a clean, responsive calendar.',
    features: ['Google Calendar sync', 'Tasks & deadlines merged', 'Month, week & day views'],
  },
  {
    route: '/lab',
    icon: FlaskConical,
    color: '#d946ef',
    bg: 'linear-gradient(135deg, #fae8ff 0%, #f0abfc 100%)',
    tag: 'LABS',
    title: 'Self-Improvement Lab',
    description: 'Train your core attributes like an RPG character. Live typing speed tests, verbal practice logs, reading tracking, and structured identity affirmations — all in one lab environment.',
    features: ['Typing speed & accuracy WPM', 'Speaking practice logs', 'Identity & affirmation builder'],
  },
  {
    route: '/overview',
    icon: User,
    color: '#1E4A32',
    bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    tag: 'ACCOUNT ACCESS',
    title: 'Save Your Progress',
    description: 'You\'re currently in Guest Mode — you can explore everything freely, but data will not be saved. Create a free account to unlock full data persistence, AI insights, and sync.',
    features: ['Free account in 30 seconds', 'Google Sign-In supported', 'All your data stays private'],
    isAuthStep: true,
  },
];

const GuestTour = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(TOUR_KEY);
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(t);
    }
  }, []);

  const goToStep = useCallback((idx) => {
    setNavigating(true);
    setStep(idx);
    const target = STEPS[idx].route;
    if (location.pathname !== target) {
      navigate(target);
    }
    setTimeout(() => setNavigating(false), 400);
  }, [navigate, location.pathname]);

  const handleNext = () => {
    if (step < STEPS.length - 1) goToStep(step + 1);
    else handleDone();
  };

  const handlePrev = () => {
    if (step > 0) goToStep(step - 1);
  };

  const handleDone = () => {
    sessionStorage.setItem(TOUR_KEY, '1');
    setVisible(false);
  };

  const handleSignUp = () => {
    handleDone();
    navigate('/login', { state: { mode: 'signup' } });
  };

  const handleSignIn = () => {
    handleDone();
    navigate('/login');
  };

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  // ── Collapsed pill ──────────────────────────────────────────────
  const Pill = (
    <motion.button
      key="pill"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      onClick={() => setCollapsed(false)}
      style={{
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: '#111',
        color: '#fff',
        border: '1.5px solid rgba(255,255,255,0.12)',
        borderRadius: '100px',
        padding: '10px 18px 10px 12px',
        fontSize: '13px',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
        fontFamily: 'var(--font-sans)',
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{
        width: '9px', height: '9px', borderRadius: '50%',
        background: current.color,
        boxShadow: `0 0 0 3px ${current.color}40`,
        flexShrink: 0,
        animation: 'aiimin-pulse 2s infinite',
      }} />
      Explore AIIMIN
      <span style={{
        background: 'rgba(255,255,255,0.14)',
        borderRadius: '100px',
        padding: '2px 9px',
        fontSize: '11px',
        fontWeight: 800,
      }}>
        {step + 1}/{STEPS.length}
      </span>
    </motion.button>
  );

  // ── Full panel ──────────────────────────────────────────────────
  const Panel = (
    <motion.div
      key="panel"
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      style={{
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        zIndex: 9000,
        width: '320px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: '22px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.07)',
        overflow: 'hidden',
      }}>

        {/* ── Hero banner ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`hero-${step}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            style={{ background: current.bg, padding: '20px 20px 18px', position: 'relative' }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={10} color={current.color} strokeWidth={2.5} />
                <span style={{
                  fontSize: '10px', fontWeight: 800, color: current.color,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                  {current.tag}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => setCollapsed(true)} style={iconBtn('#00000010', '#00000060')} title="Minimise">
                  <Minus size={12} />
                </button>
                <button onClick={handleDone} style={iconBtn('#00000010', '#00000060')} title="Close">
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Icon + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                flexShrink: 0,
                animation: 'aiimin-float 3s ease-in-out infinite',
              }}>
                <Icon size={22} color={current.color} strokeWidth={2.5} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#111', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
                {current.title}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Body ── */}
        <div style={{ padding: '16px 20px 20px' }}>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.div key={`body-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.65, margin: '0 0 14px', }}>
                {current.description}
              </p>

              {/* Feature bullets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                {current.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: current.color, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '12px', color: '#444', fontWeight: 500 }}>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Auth step special UI */}
          {current.isAuthStep && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              <div style={{
                background: '#fff8e1', border: '1px solid #fde68a', borderRadius: '10px',
                padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px',
              }}>
                <Shield size={14} color='#d97706' />
                <span style={{ fontSize: '12px', color: '#92400e', fontWeight: 600, lineHeight: 1.4 }}>
                  You're in Guest Mode — data won't be saved
                </span>
              </div>
              <button onClick={handleSignUp} style={{
                width: '100%', padding: '11px', borderRadius: '11px', border: 'none',
                background: '#111', color: '#fff', fontSize: '13px', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              }}>
                <UserPlus size={14} /> Create Free Account
              </button>
              <button onClick={handleSignIn} style={{
                width: '100%', padding: '10px', borderRadius: '11px',
                border: '1.5px solid #e5e7eb', background: '#fff',
                color: '#111', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              }}>
                <LogIn size={14} /> Sign In
              </button>
            </div>
          )}

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '14px' }}>
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                title={s.tag}
                style={{
                  width: i === step ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === step ? current.color : (i < step ? '#d1d5db' : '#e5e7eb'),
                  border: 'none', padding: 0, cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrev}
              disabled={step === 0}
              style={{
                width: '38px', height: '38px', borderRadius: '11px',
                border: '1.5px solid #e5e7eb', background: 'transparent',
                cursor: step === 0 ? 'not-allowed' : 'pointer',
                opacity: step === 0 ? 0.3 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444',
                flexShrink: 0, transition: 'opacity 0.2s',
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={isLast ? handleDone : handleNext}
              style={{
                flex: 1, height: '38px', borderRadius: '11px', border: 'none',
                background: current.color, color: '#fff',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                boxShadow: `0 4px 16px ${current.color}44`,
                letterSpacing: '-0.01em', transition: 'background 0.25s, box-shadow 0.25s',
              }}
            >
              {isLast ? 'Finish Tour' : (<>Next: {STEPS[step + 1].tag} <ChevronRight size={14} /></>)}
            </button>
          </div>

          {/* Step counter */}
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, letterSpacing: '0.04em' }}>
              {step + 1} of {STEPS.length} • {current.tag}
            </span>
            {!current.isAuthStep && (
              <> · <button onClick={handleSignUp} style={{
                background: 'none', border: 'none', fontSize: '11px', color: '#9ca3af',
                cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '2px', padding: 0,
              }}>Sign up free</button></>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes aiimin-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.35); }
        }
        @keyframes aiimin-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {visible && (collapsed ? Pill : Panel)}
    </AnimatePresence>
  );
};

// Tiny helper for icon buttons
const iconBtn = (bg, color) => ({
  background: bg, border: 'none', borderRadius: '8px',
  width: '26px', height: '26px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', color,
});

export default GuestTour;
