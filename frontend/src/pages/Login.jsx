import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Check, X } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Numpad from '../components/common/Numpad';
import Logo from '../components/Logo';

/**
 * AIIMIN Identity Portal v3
 * - Clean geometric background (no colored glow blobs)
 * - Multi-stage sign-up wizard (Email & Name -> Username Selection -> PIN -> PIN Verify)
 * - visual uppercase transformation for usernames
 * - Strict username rules: max 4 letters, max 2 numbers, symbols allowed, exactly 8 characters
 * - Zero remembered or pre-filled logins (blank fields always)
 */

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
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const isDark = false;

  const [mode, setMode]             = useState('login'); // 'login' or 'signup'
  const [step, setStep]             = useState(1);       // login: 1=id, 2=pin; signup: 1=email/name, 2=username, 3=pin, 4=pinVerify
  const [identifier, setIdentifier] = useState('');      // Email or Username for Login
  const [fullName, setFullName]     = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [usernameVal, setUsernameVal] = useState('');
  const [pin, setPin]               = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError]           = useState(null);
  const [loading, setLoading]       = useState(false);
  const [shake, setShake]           = useState(false);

  // Clear inputs when changing mode
  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setStep(1);
    setIdentifier('');
    setFullName('');
    setSignupEmail('');
    setUsernameVal('');
    setPin('');
    setConfirmPin('');
    setError(null);
  };

  const handleNext = (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (mode === 'login') {
      if (!identifier.trim()) { setError('Identifier required.'); return; }
      setStep(2);
    } else {
      // Signup Stage 1: Email & Full Name
      if (!signupEmail.trim()) { setError('Email required.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) { setError('Enter a valid email address.'); return; }
      if (!fullName.trim()) { setError('Full name required.'); return; }
      setStep(2);
    }
  };

  const handleBack = () => {
    setError(null);
    if (mode === 'login') {
      setStep(1);
      setPin('');
    } else {
      if (step > 1) {
        if (step === 2) {
          setStep(1);
        } else if (step === 3) {
          setStep(2);
          setPin('');
        } else if (step === 4) {
          setStep(3);
          setConfirmPin('');
        }
      }
    }
  };

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const handlePinEntry = (digit) => {
    if (loading) return;
    if (mode === 'login') {
      if (pin.length < 6) {
        const newPin = pin + digit;
        setPin(newPin);
        if (newPin.length === 6) handleSubmitLogin(newPin);
      }
    } else {
      // Signup Mode
      if (step === 3) {
        if (pin.length < 6) {
          const newPin = pin + digit;
          setPin(newPin);
          if (newPin.length === 6) {
            setStep(4);
          }
        }
      } else if (step === 4) {
        if (confirmPin.length < 6) {
          const newConfirm = confirmPin + digit;
          setConfirmPin(newConfirm);
          if (newConfirm.length === 6) handleSubmitSignup(newConfirm);
        }
      }
    }
  };

  const handlePinDelete = () => {
    if (loading) return;
    if (mode === 'login') {
      setPin(prev => prev.slice(0, -1));
    } else {
      if (step === 3) {
        setPin(prev => prev.slice(0, -1));
      } else if (step === 4) {
        setConfirmPin(prev => prev.slice(0, -1));
      }
    }
  };

  const handlePinClear = () => {
    if (loading) return;
    if (mode === 'login') {
      setPin('');
    } else {
      if (step === 3) {
        setPin('');
      } else if (step === 4) {
        setConfirmPin('');
      }
    }
  };

  const handleSubmitLogin = async (finalPin) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(identifier.trim(), finalPin);
    } catch (err) {
      setError(err.message || 'Verification failure. Try again.');
      setPin('');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSignup = async (finalConfirmPin) => {
    if (pin !== finalConfirmPin) {
      setError('PINs do not match. Re-verify.');
      setConfirmPin('');
      triggerShake();
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await signUpWithEmail(signupEmail.trim(), pin, fullName.trim(), usernameVal.trim());
    } catch (err) {
      setError(err.message || 'Signup failed. Try again.');
      setConfirmPin('');
      setStep(3); // Send them back to enter PIN
      setPin('');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // Username validation constraints checks
  const uLettersCount = (usernameVal.match(/[A-Z]/g) || []).length;
  const uNumbersCount = (usernameVal.match(/[0-9]/g) || []).length;
  const isUsernameValid = usernameVal.length === 8 && uLettersCount <= 4 && uNumbersCount <= 2;

  const handleUsernameNext = (e) => {
    if (e) e.preventDefault();
    if (!isUsernameValid) {
      setError('Username does not meet the strict requirements.');
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleUsernameChange = (e) => {
    const val = e.target.value.toUpperCase();
    if (val.length <= 8) {
      setUsernameVal(val);
    }
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
      background: '#f6f3ec',
      color: '#1f201d',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <GridBg isDark={false} />

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
            {mode === 'login' ? (
              step === 1 ? 'Welcome back' : 'Enter your PIN'
            ) : (
              step === 1 ? 'Create account' :
              step === 2 ? 'Choose Username' :
              step === 3 ? 'Set up PIN' : 'Verify PIN'
            )}
          </motion.h1>

          <motion.p
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{ fontSize: '14px', color: 'var(--text-3)', margin: 0, lineHeight: '1.5' }}
          >
            {mode === 'login' ? (
              step === 1 ? 'Sign in to your personal OS' : `Verifying identity for ${identifier}`
            ) : (
              step === 1 ? 'Join the AIIMIN network' :
              step === 2 ? 'Visually uppercase, strict 8-char constraint' :
              step === 3 ? 'Choose a secure 6-digit PIN' : 'Confirm your 6-digit PIN'
            )}
          </motion.p>
        </div>

        {/* ── Steps ── */}
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            /* ==================== LOGIN FLOW ==================== */
            step === 1 ? (
              <motion.div
                key="login-step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Username or Email</label>
                    <input
                      type="text" required value={identifier} autoFocus
                      onChange={e => {
                        const val = e.target.value;
                        setIdentifier(val.includes('@') ? val : val.toUpperCase());
                      }}
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      placeholder="Enter username or email"
                      style={{
                        ...inputStyle,
                        textTransform: identifier.includes('@') ? 'none' : 'uppercase'
                      }}
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
                      onClick={toggleMode}
                      style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                    >
                      New here? <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Create account</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    style={{
                      height: '48px',
                      background: 'rgba(255,255,255,0.45)',
                      color: '#111111',
                      border: '1px solid rgba(0,0,0,0.12)',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-sans)'
                    }}
                  >
                    Continue with Google
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="login-step2"
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
                    isDark={false}
                  />
                )}

                {error && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    style={{ color: '#EF4444', fontSize: '13px', fontWeight: 500, textAlign: 'center' }}>
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )
          ) : (
            /* ==================== SIGNUP FLOW ==================== */
            step === 1 ? (
              /* Signup Stage 1: Email & Full Name */
              <motion.div
                key="signup-step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Email Address (Mail ID)</label>
                    <input
                      type="email" required value={signupEmail} autoFocus
                      onChange={e => setSignupEmail(e.target.value)}
                      placeholder="Enter email address"
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 1px var(--accent)'; }}
                      onBlur={e  => { e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

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
                    Continue to Username Selection →
                  </motion.button>

                  <div style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={toggleMode}
                      style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                    >
                      Already have an account? <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : step === 2 ? (
              /* Signup Stage 2: Username selection with validation visualizer */
              <motion.div
                key="signup-step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleUsernameNext} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <button
                    type="button"
                    onClick={handleBack}
                    style={{
                      alignSelf: 'flex-start',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'rgba(0,0,0,0.04)',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: '99px', padding: '6px 14px',
                      fontSize: '12px', fontWeight: 600, color: 'var(--text-2)',
                      cursor: 'pointer', fontFamily: 'var(--font-sans)', marginBottom: '8px', width: 'fit-content'
                    }}
                  >
                    <ArrowLeft size={13} /> Back
                  </button>

                  <div>
                    <label style={labelStyle}>Create Username</label>
                    <input
                      type="text" required value={usernameVal} autoFocus
                      onChange={handleUsernameChange}
                      placeholder="e.g. A@B12C-D"
                      style={{ ...inputStyle, textTransform: 'uppercase', fontStyle: 'normal', letterSpacing: '0.05em' }}
                      onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 1px var(--accent)'; }}
                      onBlur={e  => { e.target.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* Visual constraint rules checklist */}
                  <div style={{
                    padding: '16px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px',
                    display: 'flex', flexDirection: 'column', gap: '10px'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-3)', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '6px' }}>
                      Username Constraints
                    </div>
                    {/* Character limit */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: usernameVal.length === 8 ? '#16a34a' : 'var(--text-2)' }}>
                        {usernameVal.length === 8 ? <Check size={13} /> : <X size={13} style={{ color: '#ef4444' }} />}
                        <span>Exactly 8 characters</span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: usernameVal.length === 8 ? '#16a34a' : 'var(--text-3)' }}>
                        {usernameVal.length} / 8
                      </span>
                    </div>

                    {/* Letters limit */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: uLettersCount <= 4 ? '#16a34a' : '#ef4444' }}>
                        {uLettersCount <= 4 ? <Check size={13} /> : <X size={13} />}
                        <span>At most 4 letters (A-Z)</span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: uLettersCount <= 4 ? '#16a34a' : '#ef4444' }}>
                        {uLettersCount} / 4
                      </span>
                    </div>

                    {/* Numbers limit */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: uNumbersCount <= 2 ? '#16a34a' : '#ef4444' }}>
                        {uNumbersCount <= 2 ? <Check size={13} /> : <X size={13} />}
                        <span>At most 2 numbers (0-9)</span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: uNumbersCount <= 2 ? '#16a34a' : '#ef4444' }}>
                        {uNumbersCount} / 2
                      </span>
                    </div>

                    {/* Symbols context */}
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', fontStyle: 'italic', marginTop: '2px' }}>
                      Remainder can be any special symbols (e.g. @, #, $, -, _, !, etc.)
                    </div>
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
                    disabled={!isUsernameValid}
                    style={{
                      height: '52px', marginTop: '4px',
                      background: isUsernameValid ? '#111111' : 'rgba(0,0,0,0.1)',
                      color: isUsernameValid ? '#FFFFFF' : 'rgba(0,0,0,0.3)',
                      border: 'none', borderRadius: '12px',
                      fontSize: '15px', fontWeight: 700, cursor: isUsernameValid ? 'pointer' : 'not-allowed',
                      fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
                    }}
                  >
                    Continue to PIN Registration →
                  </motion.button>
                </form>
              </motion.div>
            ) : step === 3 ? (
              /* Signup Stage 3: PIN registration */
              <motion.div
                key="signup-step3"
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
                    background: 'rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '99px', padding: '6px 14px',
                    fontSize: '12px', fontWeight: 600, color: 'var(--text-2)',
                    cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  }}
                >
                  <ArrowLeft size={13} /> Back
                </button>

                {/* PIN dots */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: i < pin.length ? 1.25 : 1,
                        background: i < pin.length ? 'var(--accent)' : 'transparent',
                      }}
                      transition={{ duration: 0.15 }}
                      style={{
                        width: '14px', height: '14px', borderRadius: '50%',
                        border: `2px solid ${i < pin.length ? 'var(--accent)' : 'rgba(0,0,0,0.2)'}`,
                      }}
                    />
                  ))}
                </div>

                <Numpad
                  onEntry={handlePinEntry}
                  onDelete={handlePinDelete}
                  onClear={handlePinClear}
                  maxLength={6}
                  currentLength={pin.length}
                  isDark={false}
                />

                {error && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    style={{ color: '#EF4444', fontSize: '13px', fontWeight: 500, textAlign: 'center' }}>
                    {error}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* Signup Stage 4: PIN verification */
              <motion.div
                key="signup-step4"
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
                    background: 'rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '99px', padding: '6px 14px',
                    fontSize: '12px', fontWeight: 600, color: 'var(--text-2)',
                    cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  }}
                >
                  <ArrowLeft size={13} /> Back
                </button>

                {/* PIN dots with shake animation for mismatches */}
                <motion.div
                  animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
                  transition={{ duration: 0.45 }}
                  style={{ display: 'flex', gap: '16px' }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: i < confirmPin.length ? 1.25 : 1,
                        background: i < confirmPin.length
                          ? (shake ? '#EF4444' : 'var(--accent)')
                          : 'transparent',
                      }}
                      transition={{ duration: 0.15 }}
                      style={{
                        width: '14px', height: '14px', borderRadius: '50%',
                        border: `2px solid ${i < confirmPin.length ? (shake ? '#EF4444' : 'var(--accent)') : 'rgba(0,0,0,0.2)'}`,
                      }}
                    />
                  ))}
                </motion.div>

                {loading ? (
                  <div style={{ padding: '24px', textAlign: 'center' }}>
                    <div className="aiimin-spinner" />
                    <p style={{ color: 'var(--text-3)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '16px' }}>
                      Registering and setting up OS...
                    </p>
                  </div>
                ) : (
                  <Numpad
                    onEntry={handlePinEntry}
                    onDelete={handlePinDelete}
                    onClear={handlePinClear}
                    maxLength={6}
                    currentLength={confirmPin.length}
                    isDark={false}
                  />
                )}

                {error && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    style={{ color: '#EF4444', fontSize: '13px', fontWeight: 500, textAlign: 'center' }}>
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )
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
