import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X, ChevronRight, ChevronLeft, UserPlus, LogIn,
  BarChart2, Target, BookOpen, Zap, Briefcase,
  DollarSign, Calendar, FlaskConical,
  User, Minus, Sparkles
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

const TOUR_POS_KEY = 'aiimin_tour_pos_v1';

const GuestTour = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const getInitialPos = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(TOUR_POS_KEY));
      if (saved && typeof saved.x === 'number') return saved;
    } catch {}
    return { x: 0, y: 0 };
  };

  const [pos, setPos] = useState(getInitialPos);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);

  const handleDragEnd = useCallback((_, info) => {
    const newPos = { x: pos.x + info.offset.x, y: pos.y + info.offset.y };
    setPos(newPos);
    localStorage.setItem(TOUR_POS_KEY, JSON.stringify(newPos));
    setTimeout(() => setIsDragging(false), 100);
  }, [pos]);

  useEffect(() => {
    const seen = sessionStorage.getItem(TOUR_KEY);
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(t);
    }
  }, []);

  const goToStep = useCallback((idx) => {
    setStep(idx);
    const target = STEPS[idx].route;
    if (location.pathname !== target) {
      navigate(target);
    }
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
      drag
      dragMomentum={false}
      dragElastic={0.08}
      dragConstraints={constraintsRef}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      onClick={() => { if (!isDragging) setCollapsed(false); }}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(15, 15, 15, 0.85)',
        backdropFilter: 'blur(16px)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '100px',
        padding: '10px 18px 10px 12px',
        fontSize: '12px',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        fontFamily: 'var(--font-sans)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: current.color,
        boxShadow: `0 0 8px ${current.color}`,
        flexShrink: 0,
        animation: 'aiimin-pulse 2s infinite',
      }} />
      Explore Tour
      <span style={{
        background: 'rgba(255,255,255,0.12)',
        borderRadius: '100px',
        padding: '2px 8px',
        fontSize: '10px',
        fontWeight: 800,
      }}>
        {step + 1}/{STEPS.length}
      </span>
    </motion.button>
  );
 
  // ── Horizontal Glassmorphic Bottom Dock ──
  const Panel = (
    <motion.div
      key="panel"
      initial={{ opacity: 0, y: 50, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        x: '-50%',
        zIndex: 9000,
        width: 'min(580px, 94vw)',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'auto',
      }}
    >
      {/* 1. Tooltip info card sitting on top of the dock */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`info-${step}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '9px', fontWeight: 800, color: current.color,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              background: `${current.color}15`, padding: '2px 8px', borderRadius: '4px'
            }}>
              {current.tag}
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
              <button onClick={() => setCollapsed(true)} style={iconBtn('var(--bg-elevated)', 'var(--text-3)')} title="Minimise">
                <Minus size={11} />
              </button>
              <button onClick={handleDone} style={iconBtn('var(--bg-elevated)', 'var(--text-3)')} title="Close">
                <X size={11} />
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginTop: '4px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px',
              background: current.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              flexShrink: 0,
            }}>
              <Icon size={20} color={current.color} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-1)', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                {current.title}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.55, margin: 0 }}>
                {current.description}
              </p>
            </div>
          </div>

          {/* Special Auth Prompt */}
          {current.isAuthStep && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
              <button onClick={handleSignUp} style={{
                flex: 1, padding: '8px 12px', borderRadius: '8px', border: 'none',
                background: 'var(--accent)', color: '#fff', fontSize: '11px', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
              }}>
                <UserPlus size={12} /> Create Free Account
              </button>
              <button onClick={handleSignIn} style={{
                padding: '8px 12px', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                color: 'var(--text-1)', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
              }}>
                <LogIn size={12} /> Sign In
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 2. Sleek horizontal dock bar */}
      <div style={{
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--border)',
        borderRadius: '99px',
        padding: '8px 12px 8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        height: '48px',
      }}>
        {/* Left Section: Progress Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: current.color,
            boxShadow: `0 0 6px ${current.color}`
          }} />
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
            {step + 1} of {STEPS.length}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            • {current.tag}
          </span>
        </div>

        {/* Center Section: Dots */}
        <div style={{ display: 'flex', gap: '4px', margin: '0 16px' }}>
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              style={{
                width: i === step ? '12px' : '4px',
                height: '4px',
                borderRadius: '2px',
                background: i === step ? current.color : 'var(--border)',
                border: 'none', padding: 0, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>

        {/* Right Section: Actions */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            onClick={handlePrev}
            disabled={step === 0}
            style={{
              width: '28px', height: '28px', borderRadius: '50%',
              border: '1px solid var(--border)', background: 'var(--bg-elevated)',
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              opacity: step === 0 ? 0.3 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-2)',
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={isLast ? handleDone : handleNext}
            style={{
              padding: '0 14px', height: '28px', borderRadius: '99px', border: 'none',
              background: current.color, color: '#fff',
              fontSize: '11px', fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              boxShadow: `0 2px 8px ${current.color}33`,
            }}
          >
            {isLast ? 'Finish' : (<>Next <ChevronRight size={12} /></>)}
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <div ref={constraintsRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 8999 }} />
      <AnimatePresence>
        {visible && (collapsed ? Pill : Panel)}
      </AnimatePresence>
    </>
  );
};

// Tiny helper for icon buttons
const iconBtn = (bg, color) => ({
  background: bg, border: 'none', borderRadius: '8px',
  width: '26px', height: '26px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', color,
});

export default GuestTour;
