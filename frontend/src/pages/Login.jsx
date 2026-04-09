import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import Numpad from '../components/common/Numpad';
import { useThemeContext } from '../context/ThemeContext';

/* ── Alias resolver ─────────────────────────────────────── */
const ALIASES = {
  'au48': 'aadityaupadhyay10@gmail.com',
  'au4803': 'aadityaupadhyay10@gmail.com',
  'adi': 'aadityaupadhyay10@gmail.com',
};
const resolveEmail = (raw) => ALIASES[raw.trim().toLowerCase()] || raw.trim();

/* ── LocalStorage key ───────────────────────────────────── */
const LS_KEY = 'aiimin_remembered_id';

/* ── Small leaf logo ────────────────────────────────────── */
const Logo = () => (
  <div style={{
    width: '42px', height: '42px',
    background: 'var(--color-accent)',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
    flexShrink: 0,
  }}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2C6.5 2 4 5 4 9C4 13 6.5 16.5 10 18C13.5 16.5 16 13 16 9C16 5 13.5 2 10 2Z"
        fill="white" fillOpacity="0.95" />
      <line x1="10" y1="10" x2="10" y2="18" stroke="white" strokeWidth="1.4" strokeOpacity="0.4" />
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   Login page
═══════════════════════════════════════════════════════════ */
const Login = () => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const { theme, toggleTheme } = useThemeContext();

  const [mode, setMode] = useState('login');
  const [step, setStep] = useState(1);        // 1 = identifier, 2 = PIN
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [remembered, setRemembered] = useState(false);    // remember-me checkbox

  /* Load remembered username on mount */
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      setIdentifier(saved);
      setRemembered(true);
    }
  }, []);

  /* Step 1 → Step 2 */
  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) { setError('Please enter a username or email.'); return; }
    if (mode === 'signup' && !fullName.trim()) { setError('Please enter your full name.'); return; }
    setError(null);
    setStep(2);
  };

  const handleBack = () => { setStep(1); setPin(''); setError(null); };

  /* PIN entry */
  const handlePinEntry = useCallback((digit) => {
    setPin(prev => {
      if (prev.length >= 6) return prev;
      const next = prev + digit;
      if (next.length === 6) {
        setTimeout(() => handleSubmitPin(next), 60);
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier, mode, fullName, remembered]);

  const handlePinDelete = () => setPin(p => p.slice(0, -1));
  const handlePinClear = () => setPin('');

  const handleSubmitPin = async (finalPin) => {
    setError(null);
    setLoading(true);
    try {
      const resolved = resolveEmail(identifier);
      if (mode === 'signup') {
        await signUpWithEmail(resolved, finalPin, fullName, fullName.split(' ')[0].toLowerCase());
      } else {
        await signInWithEmail(resolved, finalPin);
      }
      /* Persist identifier if remember checked */
      if (remembered) {
        localStorage.setItem(LS_KEY, identifier.trim().toLowerCase());
      } else {
        localStorage.removeItem(LS_KEY);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Check your PIN.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  /* ── Shared input style ────────────────────────────────── */
  const inp = {
    width: '100%',
    height: '44px',
    background: 'var(--color-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    color: 'var(--color-text-1)',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    fontWeight: 400,
    padding: '0 14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 150ms ease',
  };

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
    }}>

      {/* Theme toggle — top right corner */}
      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        style={{
          position: 'fixed', top: '16px', right: '16px',
          width: '36px', height: '36px',
          borderRadius: '10px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-2)',
          fontSize: '15px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100,
        }}
      >
        {theme === 'dark' ? '☀' : '◐'}
      </button>

      {/* Card */}
      <div style={{
        width: '380px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '20px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '40px 36px 36px',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Logo />
          <div style={{
            font: '500 18px/1 var(--font-sans)',
            color: 'var(--color-text-1)',
            letterSpacing: '-0.01em',
          }}>
            aiimin
          </div>
          <div style={{
            font: '400 12px/1 var(--font-sans)',
            color: 'var(--color-text-3)',
            marginTop: '6px',
          }}>
            Behavior-Shaping OS
          </div>
        </div>

        {/* Mode switcher — step 1 only */}
        {step === 1 && (
          <div style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '20px',
            background: 'var(--color-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '3px',
          }}>
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  fontSize: '12px',
                  fontWeight: 500,
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.02em',
                  color: mode === m ? 'var(--color-text-1)' : 'var(--color-text-3)',
                  background: mode === m ? 'var(--color-surface)' : 'transparent',
                  border: mode === m ? '1px solid var(--color-border)' : '1px solid transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(224,90,90,0.07)',
            border: '1px solid rgba(224,90,90,0.2)',
            borderRadius: '10px',
            marginBottom: '16px',
            font: '400 13px/1.4 var(--font-sans)',
            color: 'var(--color-alert-red)',
          }}>
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ── Step 1: Identifier ─────────────────────────── */}
          {step === 1 && (
            <motion.form
              key="step1"
              onSubmit={handleNext}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {mode === 'signup' && (
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  style={inp}
                  onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                />
              )}

              <input
                type="text"
                placeholder="Username"
                value={identifier}
                onChange={e => setIdentifier(e.target.value.toLowerCase())}
                style={inp}
                autoComplete="username"
                autoFocus
                onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              />

              {/* Remember me */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                font: '400 13px/1 var(--font-sans)',
                color: 'var(--color-text-2)',
                userSelect: 'none',
              }}>
                <input
                  type="checkbox"
                  checked={remembered}
                  onChange={e => setRemembered(e.target.checked)}
                  style={{ accentColor: 'var(--color-accent)', width: '14px', height: '14px' }}
                />
                Remember my username
              </label>

              <button
                type="submit"
                style={{
                  height: '44px',
                  marginTop: '4px',
                  background: 'var(--color-accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  font: '500 14px/1 var(--font-sans)',
                  cursor: 'pointer',
                  transition: 'opacity 150ms ease',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Continue →
              </button>
            </motion.form>
          )}

          {/* ── Step 2: PIN ────────────────────────────────── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {/* Back */}
              <button
                type="button"
                onClick={handleBack}
                style={{
                  alignSelf: 'flex-start',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-3)',
                  font: '400 13px/1 var(--font-sans)',
                  padding: '0',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                ← Back
              </button>

              {/* Who */}
              <div style={{
                font: '500 10px/1 var(--font-mono)',
                color: 'var(--color-text-3)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}>
                Signing in as
              </div>
              <div style={{
                font: '500 15px/1 var(--font-sans)',
                color: 'var(--color-accent)',
                marginBottom: '28px',
                letterSpacing: '-0.01em',
              }}>
                {identifier.toLowerCase()}
              </div>

              {/* PIN dots */}
              <div style={{ display: 'flex', gap: '14px', marginBottom: '28px' }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{
                    width: '12px', height: '12px',
                    borderRadius: '50%',
                    background: i < pin.length ? 'var(--color-accent)' : 'var(--color-border)',
                    border: i < pin.length ? 'none' : '1px solid var(--color-border-lit)',
                    transition: 'background 200ms ease, transform 100ms ease',
                    transform: i === pin.length - 1 ? 'scale(1.2)' : 'scale(1)',
                  }} />
                ))}
              </div>

              {/* Numpad or spinner */}
              {loading ? (
                <div style={{
                  height: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                }}>
                  <div className="spinner" style={{ width: '40px', height: '40px' }} />
                  <span style={{ font: '400 12px/1 var(--font-sans)', color: 'var(--color-text-3)' }}>
                    Verifying...
                  </span>
                </div>
              ) : (
                <Numpad
                  onEntry={handlePinEntry}
                  onDelete={handlePinDelete}
                  onClear={handlePinClear}
                  maxLength={6}
                  currentLength={pin.length}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <span style={{ font: '400 11px/1 var(--font-sans)', color: 'var(--color-text-3)' }}>
            Private. No tracking. Your data only.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
