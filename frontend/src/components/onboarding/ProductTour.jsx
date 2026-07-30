import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight, Compass, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/productTour.css';

/**
 * Invite / completion flag. Any non-null value = never auto-ask again.
 * Values: `true` (finished), `dismissed` (Not now / X / close).
 * Manual retake from Account / Settings must NOT clear this.
 */
export const TOUR_STORAGE_KEY = 'aiimin_tour_v2_completed';

function readTourFlag() {
  try {
    return localStorage.getItem(TOUR_STORAGE_KEY)
      || localStorage.getItem('aiimin_tour_completed');
  } catch {
    return null;
  }
}

/** Permanently suppress auto-invite. Retake only via Account / Settings. */
function suppressAutoInvite(reason = 'dismissed') {
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, reason);
    // Legacy key: any truthy string blocks old invite paths too.
    localStorage.setItem('aiimin_tour_completed', 'true');
  } catch { /* ignore */ }
}

/**
 * Short Life OS tour — real modules only.
 * Design Read: product coach card · calm · V3 M3 D5 · locked palette
 */
const TOUR_STEPS = [
  {
    target: '/overview',
    chapter: 'Home base',
    title: 'Today is the hub',
    content:
      'Log the day, scan commitments, and jump into tools from one canvas. Everything else exists to feed this view — not distract from it.',
  },
  {
    target: '/habits',
    chapter: 'Consistency',
    title: 'Habits compound',
    content:
      'Track routines you actually keep. Completions feed Later analytics — skip shame chrome; mark what happened.',
  },
  {
    target: '/journal',
    chapter: 'Reflection',
    title: 'Journal stays yours',
    content:
      'Capture mood, voice, and long-form without a second productivity cult. Private by default — use it when the day needs a write.',
  },
  {
    target: '/notes',
    chapter: 'Sources',
    title: 'Notes = references',
    content:
      'PDFs, voice transcripts, lecture paste. Not a second journal — link sources to habits when you confirm it.',
  },
  {
    target: '/discipline',
    chapter: 'Friction',
    title: 'Urge surf, not streak shame',
    content:
      'When the urge hits, ride the timer and log outcome. Patterns beat punishment. Non-clinical coaching language only.',
  },
  {
    target: '/focus',
    chapter: 'Deep work',
    title: 'Focus room',
    content:
      'Pomodoro blocks + ambience when you need locked-in time. Sessions flow into Reports.',
  },
  {
    target: '/reports?tab=patterns',
    chapter: 'Intelligence',
    title: 'Reports + Patterns',
    content:
      'One place for period telemetry, behavioral patterns, and skill tracking. Former Insights live here — Report · Patterns · Skills.',
  },
  {
    target: '/account',
    chapter: 'You',
    title: 'Account & restarts',
    content:
      'Plan and personalization live here. Want this tour again later? Account → Personalization → Start product tour. We will not nag after Not now.',
  },
];

const reduceMotion =
  typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function ProductTour() {
  const navigate = useNavigate();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const endTour = useCallback((finished = true) => {
    setIsOpen(false);
    setInviteOpen(false);
    // Always suppress auto-invite — Esc / scrim / Skip / Finish all count as "don't ask again".
    suppressAutoInvite(finished ? 'true' : 'dismissed');
  }, []);

  const dismissInvite = useCallback(() => {
    setInviteOpen(false);
    suppressAutoInvite('dismissed');
  }, []);

  const startTour = useCallback(() => {
    setInviteOpen(false);
    // From first second of engagement, never auto-invite again (refresh mid-tour included).
    suppressAutoInvite('dismissed');
    setIsOpen(true);
    setCurrentStep(0);
    navigate(TOUR_STEPS[0].target);
  }, [navigate]);

  const goToStep = useCallback((index) => {
    const i = Math.max(0, Math.min(TOUR_STEPS.length - 1, index));
    setCurrentStep(i);
    navigate(TOUR_STEPS[i].target);
  }, [navigate]);

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) goToStep(currentStep + 1);
    else endTour(true);
  };

  const prevStep = () => {
    if (currentStep > 0) goToStep(currentStep - 1);
  };

  useEffect(() => {
    // Any prior choice (finish OR Not now) → never auto-invite again.
    if (readTourFlag()) return undefined;
    const t = setTimeout(() => setInviteOpen(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Manual retake: do NOT clear opt-out — otherwise Esc would bring invite back next load.
    window.startProductTour = () => {
      startTour();
    };
    const onForce = () => window.startProductTour?.();
    window.addEventListener('aiimin:start-tour', onForce);
    return () => {
      delete window.startProductTour;
      window.removeEventListener('aiimin:start-tour', onForce);
    };
  }, [startTour]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') endTour(false);
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        nextStep();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- step handlers close over currentStep
  }, [isOpen, currentStep, endTour]);

  const step = TOUR_STEPS[currentStep];
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;
  const motionProps = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
      initial: { opacity: 0, y: 16, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 12, scale: 0.98 },
      transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
    };

  return (
    <AnimatePresence>
      {inviteOpen && !isOpen && (
        <motion.div
          key="invite"
          role="dialog"
          aria-label="Product tour invitation"
          className="ptour-invite"
          {...motionProps}
        >
          <div className="ptour-invite__accent" aria-hidden />
          <div className="ptour-invite__body">
            <p className="ptour-invite__kicker">New here?</p>
            <p className="ptour-invite__title">Eight stops. Real modules only.</p>
            <p className="ptour-invite__sub">
              Today → capture → discipline → focus → Reports (patterns included). Skip anytime.
            </p>
            <div className="ptour-invite__actions">
              <button type="button" className="ptour-btn ptour-btn--primary" onClick={startTour}>
                <Compass size={14} aria-hidden />
                Start tour
              </button>
              <button type="button" className="ptour-btn ptour-btn--ghost" onClick={dismissInvite}>
                Not now
              </button>
            </div>
          </div>
          <button
            type="button"
            className="ptour-invite__dismiss"
            aria-label="Dismiss tour invite"
            onClick={dismissInvite}
          >
            <X size={16} />
          </button>
        </motion.div>
      )}

      {isOpen && (
        <div className="ptour-layer" role="dialog" aria-modal="true" aria-labelledby="ptour-title">
          <button
            type="button"
            className="ptour-scrim"
            aria-label="Close tour"
            onClick={() => endTour(false)}
          />
          <motion.div key={currentStep} className="ptour-card" {...motionProps}>
            <div className="ptour-card__meta">
              <span className="ptour-card__chapter">{step.chapter}</span>
              <span className="ptour-card__count">
                {currentStep + 1} / {TOUR_STEPS.length}
              </span>
            </div>
            <div className="ptour-progress" aria-hidden>
              <div className="ptour-progress__fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="ptour-dots" aria-hidden>
              {TOUR_STEPS.map((_, i) => (
                <button
                  key={TOUR_STEPS[i].target}
                  type="button"
                  className={`ptour-dots__dot${i === currentStep ? ' is-active' : ''}${i < currentStep ? ' is-done' : ''}`}
                  onClick={() => goToStep(i)}
                  tabIndex={-1}
                />
              ))}
            </div>
            <h2 id="ptour-title" className="ptour-card__title">{step.title}</h2>
            <p className="ptour-card__body">{step.content}</p>
            <div className="ptour-card__nav">
              <button type="button" className="ptour-btn ptour-btn--ghost" onClick={() => endTour(true)}>
                Skip
              </button>
              <div className="ptour-card__nav-right">
                {currentStep > 0 && (
                  <button type="button" className="ptour-btn ptour-btn--ghost" onClick={prevStep}>
                    <ArrowLeft size={14} aria-hidden />
                    Back
                  </button>
                )}
                <button type="button" className="ptour-btn ptour-btn--primary" onClick={nextStep}>
                  {currentStep === TOUR_STEPS.length - 1 ? (
                    <>Finish <Check size={14} aria-hidden /></>
                  ) : (
                    <>Next <ChevronRight size={14} aria-hidden /></>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
