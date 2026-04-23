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

const LS_KEY = 'aiimin_remembered_id';

/* ── AIIMIN Logo mark — amber square with A ─────────────── */
const LoginLogo = () => (
  <div style={{
    width: '56px',
    height: '56px',
    background: 'var(--color-logo-bg)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 18px',
    boxShadow: '0 4px 16px rgba(185,122,74,0.30)',
  }}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      {/* A letter */}
      <path
        d="M14 4L5 22H8.5L10.5 17H17.5L19.5 22H23L14 4Z"
        fill="white"
        fillOpacity="0.95"
      />
      {/* Counter of A (cutout) */}
      <path d="M11.8 14L14 9L16.2 14Z" fill="var(--color-logo-bg)" />
      {/* Small leaf on top */}
      <path
        d="M14 2C14 2 17 5 14 8C11 5 14 2 14 2Z"
        fill="white"
        fillOpacity="0.80"
      />
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   Login
═══════════════════════════════════════════════════════════ */
const Login = () => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const { theme, toggleTheme } = useThemeContext();

  const [mode, setMode] = useState('login');
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [remembered, setRemembered] = useState(false);

  /* Load remembered username */
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) { setIdentifier(saved); setRemembered(true); }
  }, []);

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) { setError('Enter your username or email.'); return; }
    if (mode === 'signup' && !fullName.trim()) { setError('Enter your full name.'); return; }
    setError(null);
    setStep(2);
  };

  const handleBack = () => { setStep(1); setPin(''); setError(null); };

  const handlePinEntry = useCallback((digit) => {
    setPin(prev => {
      if (prev.length >= 6) return prev;
      const next = prev + digit;
      if (next.length === 6) setTimeout(() => handleSubmitPin(next), 80);
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
      if (remembered) { localStorage.setItem(LS_KEY, identifier.trim().toLowerCase()); }
      else { localStorage.removeItem(LS_KEY); }
    } catch (err) {
      setError(err.message || 'Wrong PIN. Try again.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  /* ── Styles ─────────────────────────────── */
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
    }}>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        style={{
          position: 'fixed', top: '18px', right: '18px',
          width: '36px', height: '36px',
          borderRadius: '10px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-2)',
          fontSize: '15px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100,
          transition: 'border-color 150ms ease',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-lit)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
      >
        {theme === 'dark' ? '☀' : '◐'}
      </button>

      {/* Login card */}
      <div style={{
        width: '360px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '20px',
        boxShadow: 'var(--glass-shadow)',
        padding: '44px 36px 36px',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <LoginLogo />
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
            Your behavior-shaping OS
          </div>
        </div>

        {/* Mode switcher — step 1 only */}
        {step === 1 && (
          <div style={{
            display: 'flex', gap: '4px',
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
                  flex: 1, padding: '8px 0',
                  font: '500 12px/1 var(--font-sans)',
                  letterSpacing: '0.01em',
                  color: mode === m ? '#fff' : 'var(--color-text-3)',
                  background: mode === m ? 'var(--color-accent)' : 'transparent',
                  border: 'none',
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
            background: 'var(--color-drought-bg, rgba(201,64,64,0.07))',
            border: '1px solid rgba(201,64,64,0.20)',
            borderRadius: '10px',
            marginBottom: '14px',
            font: '400 13px/1.4 var(--font-sans)',
            color: 'var(--color-alert-red)',
          }}>
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ── Step 1: identifier ────────────────────────── */}
          {step === 1 && (
            <motion.form
              key="s1"
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
                placeholder="Username or email"
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
                display: 'flex', alignItems: 'center', gap: '8px',
                cursor: 'pointer',
                font: '400 13px/1 var(--font-sans)',
                color: 'var(--color-text-2)',
                userSelect: 'none',
              }}>
                <input
                  type="checkbox"
                  checked={remembered}
                  onChange={e => setRemembered(e.target.checked)}
                  style={{ accentColor: 'var(--color-accent)', width: '14px', height: '14px', cursor: 'pointer' }}
                />
                Remember me
              </label>

              <button
                type="submit"
                style={{
                  height: '44px', marginTop: '4px',
                  background: 'var(--color-accent)',
                  color: '#fff', border: 'none',
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

          {/* ── Step 2: PIN ───────────────────────────────── */}
          {step === 2 && (
            <motion.div
              key="s2"
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
                  background: 'none', border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-3)',
                  font: '400 13px/1 var(--font-sans)',
                  padding: 0, marginBottom: '20px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                ← Back
              </button>

              {/* Who */}
              <div style={{ font: '400 11px/1 var(--font-mono)', color: 'var(--color-text-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                signing in as
              </div>
              <div style={{ font: '500 15px/1 var(--font-sans)', color: 'var(--color-accent)', marginBottom: '24px' }}>
                {identifier}
              </div>

              {/* PIN dots */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{
                    width: '11px', height: '11px',
                    borderRadius: '50%',
                    background: i < pin.length ? 'var(--color-accent)' : 'transparent',
                    border: `2px solid ${i < pin.length ? 'var(--color-accent)' : 'var(--color-border-lit)'}`,
                    transition: 'background 150ms ease, border-color 150ms ease',
                  }} />
                ))}
              </div>

              {/* Numpad or spinner */}
              {loading ? (
                <div style={{ height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                  <div className="spinner" style={{ width: '36px', height: '36px' }} />
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
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span style={{ font: '400 11px/1 var(--font-sans)', color: 'var(--color-text-3)' }}>
            Private · No tracking · Your data only
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
