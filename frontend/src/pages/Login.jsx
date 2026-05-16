import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Sun, Moon, User } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Numpad from '../components/common/Numpad';
import Logo from '../components/Logo';
import { useThemeContext } from '../context/ThemeContext';

/**
 * AIIMIN Identity Portal v3
 * - Remembers last identifier in localStorage
 * - Shake animation on wrong PIN
 * - Clean geometric background (no colored glow blobs)
 * - Proper dark/light mode throughout
 */

const STORAGE_KEY = 'aiimin_last_id';

const ALIASES = {
  'au48':   'aadityaupadhyay10@gmail.com',
  'au4803': 'aadityaupadhyay10@gmail.com',
  'adi':    'aadityaupadhyay10@gmail.com',
};

const resolveEmail = (raw) => ALIASES[raw.trim().toLowerCase()] || raw.trim();

/* ── Subtle grid-line background ── */
const GridBg = ({ isDark }) => (
  <div style={{
    position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
    backgroundImage: isDark
      ? 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)'
      : 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
  }} />
);

const Login = () => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === 'dark';

  const [mode, setMode]       = useState('login');
  const [step, setStep]       = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [savedId, setSavedId] = useState('');
  const [fullName, setFullName] = useState('');
  const [pin, setPin]         = useState('');
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake]     = useState(false);

  /* Load remembered identifier on mount */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSavedId(stored);
      setIdentifier(stored);
    }
  }, []);

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) { setError('Identifier required.'); return; }
    if (mode === 'signup' && !fullName.trim()) { setError('Full name required.'); return; }
    setError(null);
    setStep(2);
  };

  const handleBack = () => { setStep(1); setPin(''); setError(null); };

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const handlePinEntry = (digit) => {
    if (loading) return;
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 6) handleSubmitPin(newPin);
    }
  };

  const handlePinDelete = () => { if (!loading) setPin(prev => prev.slice(0, -1)); };
  const handlePinClear  = () => { if (!loading) setPin(''); };

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
      /* Save identifier on successful sign-in */
      localStorage.setItem(STORAGE_KEY, identifier.trim());
    } catch (err) {
      setError(err.message || 'Verification failure. Try again.');
      setPin('');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const clearSavedId = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedId('');
    setIdentifier('');
  };

  /* ── Shared input style ── */
  const inputStyle = {
    width: '100%', height: '52px', boxSizing: 'border-box',
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'}`,
    borderRadius: '12px',
    color: isDark ? '#EDEDED' : '#111111',
    padding: '0 18px',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-1)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <GridBg isDark={isDark} />

      {/* Theme Toggle */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={toggleTheme}
        style={{
          position: 'absolute', top: '24px', right: '24px',
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: '10px', padding: '10px', cursor: 'pointer',
          color: 'var(--text-2)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 10,
        }}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </motion.button>

      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '32px', zIndex: 1 }}>

        {/* ── Branding ── */}
        <div style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginBottom: '28px' }}
          >
            <Logo size={52} />
            <span style={{
              fontSize: '18px', fontWeight: 800, letterSpacing: '0.25em',
              color: isDark ? '#FFFFFF' : '#111111',
              textTransform: 'uppercase', fontFamily: 'var(--font-sans)',
            }}>
              AIIMIN
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 8px', color: isDark ? '#EDEDED' : '#111111' }}
          >
            {step === 1
              ? (mode === 'login' ? 'Welcome back' : 'Create account')
              : 'Enter your PIN'}
          </motion.h1>

          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{ fontSize: '14px', color: 'var(--text-3)', margin: 0, lineHeight: '1.5' }}
          >
            {step === 1
              ? (mode === 'login' ? 'Sign in to your personal OS' : 'Join the AIIMIN network')
              : `Verifying identity for ${identifier}`}
          </motion.p>
        </div>

        {/* ── Saved identifier chip ── */}
        <AnimatePresence>
          {step === 1 && savedId && mode === 'login' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: isDark ? 'rgba(34,197,94,0.06)' : 'rgba(30,92,58,0.06)',
                border: `1px solid ${isDark ? 'rgba(34,197,94,0.2)' : 'rgba(30,92,58,0.2)'}`,
                borderRadius: '12px', padding: '10px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={14} color={isDark ? '#22C55E' : '#1E5C3A'} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#22C55E' : '#1E5C3A' }}>
                  {savedId}
                </span>
              </div>
              <button
                onClick={clearSavedId}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-sans)' }}
              >
                Not you?
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Steps ── */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mode === 'signup' && (
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input
                      type="text" required value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Aaditya Upadhyay"
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 1px var(--accent)'; }}
                      onBlur={e  => { e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Username or Email</label>
                  <input
                    type="text" required value={identifier} autoFocus
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="e.g. au48"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 1px var(--accent)'; }}
                    onBlur={e  => { e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ color: 'var(--color-danger)', fontSize: '13px', fontWeight: 500 }}>
                    {error}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  type="submit"
                  style={{
                    height: '52px', marginTop: '4px',
                    background: isDark ? '#EDEDED' : '#111111',
                    color: isDark ? '#111111' : '#FFFFFF',
                    border: 'none', borderRadius: '12px',
                    fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'var(--font-sans)', transition: 'opacity 0.2s',
                  }}
                >
                  Continue →
                </motion.button>

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                  >
                    {mode === 'login'
                      ? <>New here? <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Create account</span></>
                      : <>Have an account? <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</span></>}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}
            >
              <button
                onClick={handleBack}
                style={{
                  alignSelf: 'flex-start',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: '99px', padding: '6px 14px',
                  fontSize: '12px', fontWeight: 600, color: 'var(--text-2)',
                  cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}
              >
                <ArrowLeft size={13} /> Back
              </button>

              {/* PIN dots */}
              <motion.div
                animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
                transition={{ duration: 0.45 }}
                style={{ display: 'flex', gap: '16px' }}
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: i < pin.length ? 1.25 : 1,
                      background: i < pin.length
                        ? (shake ? '#EF4444' : 'var(--accent)')
                        : 'transparent',
                    }}
                    transition={{ duration: 0.15 }}
                    style={{
                      width: '14px', height: '14px', borderRadius: '50%',
                      border: `2px solid ${i < pin.length ? (shake ? '#EF4444' : 'var(--accent)') : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)')}`,
                    }}
                  />
                ))}
              </motion.div>

              {loading ? (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <div className="aiimin-spinner" />
                  <p style={{ color: 'var(--text-3)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '16px' }}>
                    Verifying...
                  </p>
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

              {error && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#EF4444', fontSize: '13px', fontWeight: 500, textAlign: 'center' }}>
                  {error}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={{ position: 'fixed', bottom: '24px', textAlign: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-3)' }}>
          <Shield size={12} />
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Secure Access Protocol
          </span>
        </div>
      </div>

      <style>{`
        .aiimin-spinner {
          width: 28px; height: 28px; margin: 0 auto;
          border: 2.5px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: aiimin-spin 0.7s linear infinite;
        }
        @keyframes aiimin-spin { to { transform: rotate(360deg); } }

        .numpad-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .numpad-grid button {
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'} !important;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} !important;
          color: ${isDark ? '#EDEDED' : '#111111'} !important;
          width: 70px !important; height: 70px !important;
          border-radius: 50% !important;
          font-size: 22px !important; font-weight: 600 !important;
          transition: all 0.15s ease !important;
          cursor: pointer !important;
          font-family: var(--font-sans) !important;
        }
        .numpad-grid button:hover {
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'} !important;
          transform: scale(1.05);
        }
        .numpad-grid button:active { transform: scale(0.92) !important; }
      `}</style>
    </div>
  );
};

const labelStyle = {
  fontSize: '11px', color: 'var(--text-3)', fontWeight: 600,
  display: 'block', marginBottom: '8px',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  fontFamily: 'var(--font-sans)',
};

export default Login;
