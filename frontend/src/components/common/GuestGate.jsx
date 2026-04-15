import React, { createContext, useContext, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus } from 'lucide-react';

/* ── Internal context for gate trigger ── */
const GuestGateContext = createContext(null);

/* ── Provider — wrap at app or route level ── */
export function GuestGateProvider({ children }) {
  const [gateState, setGateState] = useState({ open: false, action: '' });

  const triggerGate = useCallback((action = 'continue') => {
    setGateState({ open: true, action });
  }, []);

  React.useEffect(() => {
    const handleEvent = (e) => triggerGate(e.detail);
    window.addEventListener('guest-gate', handleEvent);
    return () => window.removeEventListener('guest-gate', handleEvent);
  }, [triggerGate]);

  const dismiss = useCallback(() => {
    setGateState({ open: false, action: '' });
  }, []);

  return (
    <GuestGateContext.Provider value={{ triggerGate }}>
      {children}
      <GuestGateOverlay open={gateState.open} action={gateState.action} onDismiss={dismiss} />
    </GuestGateContext.Provider>
  );
}

/* ── Hook ── */
export function useGuestGate() {
  const ctx = useContext(GuestGateContext);
  if (!ctx) {
    // Graceful fallback if used outside provider
    return { triggerGate: () => {} };
  }
  return ctx;
}

/* ── Overlay rendered via portal ── */
function GuestGateOverlay({ open, action, onDismiss }) {
  const navigate = useNavigate();

  if (!open) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="guest-gate-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onDismiss}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            background: 'rgba(0,0,0,0.35)',
            padding: '24px',
          }}
        >
          <motion.div
            key="guest-gate-modal"
            initial={{ scale: 0.9, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '36px 32px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            {/* Dismiss X */}
            <button
              onClick={onDismiss}
              aria-label="Dismiss"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'rgba(0,0,0,0.04)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#555',
              }}
            >
              <X size={14} />
            </button>

            {/* Icon */}
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <LogIn size={24} color="#fff" />
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '20px', fontWeight: 800, color: '#111',
              margin: '0 0 10px', letterSpacing: '-0.02em',
              fontFamily: 'var(--font-sans)',
            }}>
              Sign in to {action}
            </h2>

            {/* Subtitle */}
            <p style={{
              fontSize: '14px', color: '#666', lineHeight: '1.6',
              margin: '0 0 28px', fontFamily: 'var(--font-sans)',
            }}>
              Guest mode is read-only. Create a free account to save your data and unlock all features.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => { onDismiss(); navigate('/login', { state: { mode: 'signup' } }); }}
                style={{
                  height: '48px',
                  background: '#111111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <UserPlus size={15} />
                Create Account — It's Free
              </button>

              <button
                onClick={() => { onDismiss(); navigate('/login'); }}
                style={{
                  height: '44px',
                  background: 'transparent',
                  color: '#444',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Sign In
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ── GuestGate wrapper component ── */
const GuestGate = ({ children, action = 'continue' }) => {
  return (
    <div style={{ position: 'relative' }}>
      {children}
    </div>
  );
};

export default GuestGate;
