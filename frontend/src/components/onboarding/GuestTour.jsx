import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X, UserPlus, ChevronRight, ChevronLeft,
  BarChart2, Target, BookOpen, Zap, Briefcase,
  DollarSign, Globe, FlaskConical, Calendar, Brain, Sparkles
} from 'lucide-react';

const TOUR_KEY = 'aiimin_tour_seen';

const STEPS = [
  {
    icon: Sparkles,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg,#fef3c7,#fde68a)',
    title: 'Welcome to AIIMIN 👋',
    description: 'Your personal life OS. Explore freely — sign up in 30 seconds to save your progress.',
    highlight: 'Free to explore',
  },
  {
    icon: BarChart2,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
    title: 'Day Control Dashboard',
    description: 'All your daily metrics at a glance — habits, mood, energy, and focus, all in one view.',
    highlight: 'Your command center',
  },
  {
    icon: Target,
    color: '#10b981',
    gradient: 'linear-gradient(135deg,#d1fae5,#a7f3d0)',
    title: 'Goals & Habits',
    description: 'Build streaks, set milestones, and turn abstract ambitions into daily actions.',
    highlight: 'Build consistency',
  },
  {
    icon: BookOpen,
    color: '#ec4899',
    gradient: 'linear-gradient(135deg,#fce7f3,#fbcfe8)',
    title: 'Journal & Reflection',
    description: 'Morning intentions, evening gratitude, daily productivity scores — all in your permanent log.',
    highlight: 'Know yourself',
  },
  {
    icon: Zap,
    color: '#f97316',
    gradient: 'linear-gradient(135deg,#ffedd5,#fed7aa)',
    title: 'Deep Focus Room',
    description: 'Pomodoro timer, ambient soundscapes, distraction blocking — lock into flow state.',
    highlight: 'Enter flow state',
  },
  {
    icon: DollarSign,
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg,#e0f2fe,#bae6fd)',
    title: 'Finance & Wealth',
    description: 'Track spending, investments, Gold, Mutual Funds, and global equities in one place.',
    highlight: 'Control your money',
  },
  {
    icon: Briefcase,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
    title: 'ATS Resume Analyzer',
    description: 'Paste a job description and get your match score, missing keywords, and AI coaching.',
    highlight: 'Land the job',
  },
  {
    icon: Brain,
    color: '#14b8a6',
    gradient: 'linear-gradient(135deg,#ccfbf1,#99f6e4)',
    title: 'AI Insights Engine',
    description: 'Discover hidden patterns across your behavior, finance, and productivity over time.',
    highlight: 'Data-driven clarity',
  },
];

const GuestTour = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const pulseRef = useRef(null);

  useEffect(() => {
    const seen = sessionStorage.getItem(TOUR_KEY);
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  const handleSkip = () => {
    sessionStorage.setItem(TOUR_KEY, '1');
    setVisible(false);
  };

  const handlePrev = () => {
    setHasInteracted(true);
    setStep(s => Math.max(0, s - 1));
  };

  const handleNext = () => {
    setHasInteracted(true);
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleSkip();
    }
  };

  const handleDotClick = (i) => {
    setHasInteracted(true);
    setStep(i);
  };

  const handleCreateAccount = () => {
    handleSkip();
    navigate('/login', { state: { mode: 'signup' } });
  };

  const toggleCollapse = () => setCollapsed(c => !c);

  const current = STEPS[step];
  const Icon = current.icon;
  const isLastStep = step === STEPS.length - 1;

  // Collapsed pill trigger button
  const CollapsedPill = (
    <motion.button
      key="pill"
      initial={{ opacity: 0, scale: 0.8, x: 40 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 40 }}
      onClick={toggleCollapse}
      style={{
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        zIndex: 8880,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#111',
        color: '#fff',
        border: '1.5px solid rgba(255,255,255,0.15)',
        borderRadius: '100px',
        padding: '10px 18px 10px 12px',
        fontSize: '13px',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        fontFamily: 'var(--font-sans)',
        letterSpacing: '-0.01em',
      }}
    >
      {/* Animated dot */}
      <span style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: current.color,
        boxShadow: `0 0 0 3px ${current.color}33`,
        animation: 'pulse-dot 2s infinite',
        display: 'inline-block',
        flexShrink: 0,
      }} />
      <span>Explore AIIMIN</span>
      <span style={{
        background: 'rgba(255,255,255,0.12)',
        borderRadius: '100px',
        padding: '2px 8px',
        fontSize: '11px',
        fontWeight: 800,
      }}>{step + 1}/{STEPS.length}</span>
    </motion.button>
  );

  return (
    <>
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      <AnimatePresence>
        {visible && (
          <>
            {collapsed ? (
              CollapsedPill
            ) : (
              <motion.div
                key="tour-panel"
                initial={{ opacity: 0, x: 60, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.94 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'fixed',
                  bottom: '90px',
                  right: '20px',
                  zIndex: 8880,
                  width: '320px',
                }}
              >
                {/* Main card */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '22px',
                  boxShadow: '0 12px 48px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.07)',
                }}>
                  {/* Hero banner */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        background: current.gradient,
                        padding: '24px 20px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        position: 'relative',
                      }}
                    >
                      {/* Top controls */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{
                          background: 'rgba(0,0,0,0.08)',
                          borderRadius: '100px',
                          padding: '3px 10px',
                          fontSize: '10px',
                          fontWeight: 800,
                          color: 'rgba(0,0,0,0.6)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          fontFamily: 'var(--font-mono, monospace)',
                        }}>
                          {current.highlight}
                        </span>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            onClick={toggleCollapse}
                            style={{
                              background: 'rgba(0,0,0,0.06)',
                              border: 'none',
                              borderRadius: '8px',
                              width: '26px', height: '26px',
                              cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'rgba(0,0,0,0.45)',
                            }}
                            title="Minimize"
                          >
                            <span style={{ fontSize: '10px', fontWeight: 900 }}>—</span>
                          </button>
                          <button
                            onClick={handleSkip}
                            style={{
                              background: 'rgba(0,0,0,0.06)',
                              border: 'none',
                              borderRadius: '8px',
                              width: '26px', height: '26px',
                              cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'rgba(0,0,0,0.45)',
                            }}
                            title="Close"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Icon */}
                      <div style={{
                        width: '52px', height: '52px',
                        borderRadius: '16px',
                        background: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        animation: 'float-card 3s ease-in-out infinite',
                      }}>
                        <Icon size={24} color={current.color} strokeWidth={2.5} />
                      </div>

                      {/* Title */}
                      <div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 800,
                          color: '#111',
                          letterSpacing: '-0.02em',
                          lineHeight: 1.25,
                          fontFamily: 'var(--font-sans)',
                        }}>
                          {current.title}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Body */}
                  <div style={{ padding: '16px 20px 20px' }}>
                    {/* Description */}
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={step + '-desc'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          fontSize: '13px',
                          color: '#555',
                          lineHeight: '1.6',
                          margin: '0 0 16px',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        {current.description}
                      </motion.p>
                    </AnimatePresence>

                    {/* Progress dots */}
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginBottom: '16px' }}>
                      {STEPS.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleDotClick(i)}
                          style={{
                            width: i === step ? '20px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            background: i === step ? current.color : 'rgba(0,0,0,0.12)',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                          }}
                        />
                      ))}
                    </div>

                    {/* Navigation buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handlePrev}
                        disabled={step === 0}
                        style={{
                          width: '38px', height: '38px',
                          borderRadius: '11px',
                          border: '1.5px solid rgba(0,0,0,0.1)',
                          background: 'transparent',
                          cursor: step === 0 ? 'not-allowed' : 'pointer',
                          opacity: step === 0 ? 0.3 : 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#444',
                          flexShrink: 0,
                          transition: 'opacity 0.2s',
                        }}
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {isLastStep ? (
                        <button
                          onClick={handleCreateAccount}
                          style={{
                            flex: 1, height: '38px',
                            borderRadius: '11px',
                            border: 'none',
                            background: '#111',
                            color: '#fff',
                            fontSize: '13px', fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-sans)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          <UserPlus size={14} /> Create Free Account
                        </button>
                      ) : (
                        <button
                          onClick={handleNext}
                          style={{
                            flex: 1, height: '38px',
                            borderRadius: '11px',
                            border: 'none',
                            background: current.color,
                            color: '#fff',
                            fontSize: '13px', fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-sans)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            boxShadow: `0 4px 16px ${current.color}44`,
                            letterSpacing: '-0.01em',
                            transition: 'background 0.2s, box-shadow 0.2s',
                          }}
                        >
                          Next <ChevronRight size={14} />
                        </button>
                      )}
                    </div>

                    {/* Footer CTA */}
                    {!isLastStep && (
                      <div style={{ textAlign: 'center', marginTop: '12px' }}>
                        <button
                          onClick={handleCreateAccount}
                          style={{
                            background: 'none', border: 'none',
                            fontSize: '12px', color: '#888', cursor: 'pointer',
                            fontFamily: 'var(--font-sans)',
                            textDecoration: 'underline',
                            textUnderlineOffset: '2px',
                          }}
                        >
                          Skip tour & sign up now
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step counter outside card */}
                <div style={{
                  textAlign: 'center',
                  marginTop: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'rgba(0,0,0,0.35)',
                  fontFamily: 'var(--font-mono, monospace)',
                  letterSpacing: '0.06em',
                }}>
                  {step + 1} of {STEPS.length} features
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GuestTour;
