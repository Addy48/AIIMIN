import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { trackEvent } from '../../hooks/usePageAnalytics';

const TIER_FEATURES = {
  core: [
    'Discipline engine with urge tracking',
    'All 5 journal modes + AI emotion tags',
    'Finance safe-to-spend + SIP planner',
    'Personalized sports feed',
    'Lab cognitive benchmarks',
  ],
  pro: [
    'Everything in Core',
    'Weekly AI life review emails',
    'Family vault document storage',
    'Advanced finance what-if simulator',
    'Priority support',
  ],
};

const TRY_NOW = {
  core: [
    { label: 'Log an urge', path: '/discipline' },
    { label: 'Write in journal', path: '/journal?mode=free' },
    { label: 'Check safe-to-spend', path: '/finance' },
  ],
  pro: [
    { label: 'Run cognitive benchmark', path: '/lab' },
    { label: 'Upload a document', path: '/family' },
    { label: 'Customize overview', path: '/account?section=personalization' },
  ],
};

/**
 * UX-15 — shown once after tier upgrade when prev_tier !== subscription_tier.
 */
export default function PostPurchaseModal() {
  const navigate = useNavigate();
  const { profile, update: updateProfile } = useUserProfile();
  const reduceMotion = useReducedMotion();
  const [dismissing, setDismissing] = useState(false);

  const tier = profile?.subscription_tier || 'explore';
  const prevTier = profile?.prev_tier || 'explore';
  const show = tier !== 'explore' && prevTier !== tier && !dismissing;

  React.useEffect(() => {
    if (show) trackEvent('upgrade_completed', { tier, prev_tier: prevTier });
  }, [show, tier, prevTier]);

  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
  const features = TIER_FEATURES[tier] || TIER_FEATURES.core;
  const actions = TRY_NOW[tier] || TRY_NOW.core;

  const dismiss = async (path) => {
    setDismissing(true);
    try {
      await updateProfile({ prev_tier: tier });
    } catch {
      /* non-blocking */
    }
    if (path) navigate(path);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(10, 12, 16, 0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          {!reduceMotion && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0.6 }}
              animate={{ scale: [0.6, 1.15, 1], opacity: [0.6, 0.3, 0] }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: 280,
                height: 280,
                borderRadius: '50%',
                border: '2px solid #2563EB',
                pointerEvents: 'none',
              }}
            />
          )}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="card"
            style={{
              maxWidth: 440,
              width: '100%',
              padding: 32,
              background: 'var(--color-surface-3)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              borderRadius: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Sparkles size={20} style={{ color: '#2563EB' }} />
              <span className="text-label" style={{ color: '#2563EB' }}>Upgrade complete</span>
            </div>
            <h2 className="text-h1" style={{ margin: '0 0 8px', color: 'var(--color-text-1)' }}>
              Welcome to {tierLabel}.
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-2)', marginBottom: 24 }}>
              Here&apos;s what just unlocked:
            </p>
            <ul style={{ margin: '0 0 28px', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {features.map((f) => (
                <li key={f} className="text-sm" style={{ color: 'var(--color-text-1)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#10B981', fontWeight: 800 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="text-label" style={{ marginBottom: 12 }}>Try this now</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {actions.map(({ label, path }) => (
                <button
                  key={path}
                  type="button"
                  onClick={() => dismiss(path)}
                  className="btn-action"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface-2)',
                    color: 'var(--color-text-1)',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  {label}
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => dismiss('/overview')}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', fontSize: 12, cursor: 'pointer', width: '100%' }}
            >
              Continue to Overview
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
