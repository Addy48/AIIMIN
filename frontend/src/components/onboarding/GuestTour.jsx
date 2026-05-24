import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, UserPlus } from 'lucide-react';

const TOUR_KEY = 'aiimin_tour_seen';

const STEPS = [
  {
    title: 'Welcome to AIIMIN 👋',
    description: 'Your personal OS for tracking life. Explore freely — sign up to save your progress.',
  },
  {
    title: 'Overview Dashboard',
    description: 'See all your daily metrics at a glance. Tasks, habits, finance, and more.',
  },
  {
    title: 'Finance Tracker',
    description: 'Track income, expenses, and get AI-powered insights on your spending patterns.',
  },
  {
    title: 'ATS Resume Analyzer',
    description: 'Paste a job description and upload your resume to get a match score and tailored bullets.',
  },
  {
    title: 'Ready to save your work?',
    description: 'Create a free account in 30 seconds. Your data stays private and secure.',
  },
];

const GuestTour = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = sessionStorage.getItem(TOUR_KEY);
    if (!seen) {
      // Small delay so the dashboard has time to render
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const handleSkip = () => {
    sessionStorage.setItem(TOUR_KEY, '1');
    setVisible(false);
  };

  const handlePrev = () => {
    setStep(s => Math.max(0, s - 1));
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleSkip();
    }
  };

  const handleCreateAccount = () => {
    handleSkip();
    navigate('/login', { state: { mode: 'signup' } });
  };

  const isLastStep = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="guest-tour"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 8888,
            width: '100%',
            maxWidth: '420px',
            padding: '0 16px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            border: '1px solid rgba(0,0,0,0.06)',
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Step counter */}
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#999',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono, monospace)',
              }}>
                {step + 1} / {STEPS.length}
              </div>

              {/* Progress dots */}
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === step ? '18px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      background: i === step ? '#111' : 'rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>

              {/* Skip / X */}
              <button
                onClick={handleSkip}
                aria-label="Skip tour"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#aaa',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 6px',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <X size={13} /> Skip
              </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
              >
                <div style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#111',
                  marginBottom: '6px',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '-0.01em',
                }}>
                  {STEPS[step].title}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.55',
                  fontFamily: 'var(--font-sans)',
                }}>
                  {STEPS[step].description}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Prev */}
              <button
                onClick={handlePrev}
                disabled={step === 0}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  background: 'transparent',
                  cursor: step === 0 ? 'not-allowed' : 'pointer',
                  opacity: step === 0 ? 0.35 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#444',
                  flexShrink: 0,
                }}
              >
                <ChevronLeft size={16} />
              </button>

              {/* Next / Create Account */}
              {isLastStep ? (
                <button
                  onClick={handleCreateAccount}
                  style={{
                    flex: 1,
                    height: '36px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#111',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <UserPlus size={14} />
                  Create Account
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  style={{
                    flex: 1,
                    height: '36px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#111',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  Next <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GuestTour;
