import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Sparkles, Leaf } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Numpad from '../components/common/Numpad';

/**
 * AIIMIN Identity & Security Portal
 * 
 * DESIGN: Nordic Calm / Garden Edition
 * THEME: Deep Forest Base (#0A0C0B) + Parchment Text (#E8E6E1)
 */

const ALIASES = {
  'au48': 'aadityaupadhyay10@gmail.com',
  'au4803': 'aadityaupadhyay10@gmail.com',
  'adi': 'aadityaupadhyay10@gmail.com',
};

const resolveEmail = (raw) => ALIASES[raw.trim().toLowerCase()] || raw.trim();

const Login = () => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState(1); // 1 = Identifier, 2 = PIN
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      setError('Identity required.');
      return;
    }
    if (mode === 'signup' && !fullName.trim()) {
      setError('Full name required.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setPin('');
    setError(null);
  };

  const handlePinEntry = (digit) => {
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 6) {
        handleSubmitPin(newPin);
      }
    }
  };

  const handlePinDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handlePinClear = () => {
    setPin('');
  };

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
    } catch (err) {
      setError(err.message || 'Verification failure.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    height: '56px',
    background: 'rgba(255, 255, 255, 0.015)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    color: 'var(--color-text-1)',
    fontFamily: 'var(--font-sans)',
    fontSize: '15px',
    fontWeight: 400,
    padding: '0 20px',
    outline: 'none',
    transition: `all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`,
    textAlign: 'center',
    letterSpacing: '0.04em',
    backdropFilter: 'blur(8px)',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Organic Textures - Animated Mesh */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.15, 0.08],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle at center, var(--color-accent) 0%, transparent 60%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05],
          x: [0, -40, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle at center, var(--color-hero) 0%, transparent 60%)',
          filter: 'blur(100px)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        padding: '24px',
        zIndex: 2,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'rgba(10, 12, 10, 0.65)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: '32px',
            padding: '56px 48px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Brand Signature */}
          <div style={{ marginBottom: '48px', textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '16px',
              color: 'var(--color-accent)'
            }}>
              <Leaf size={16} />
              <span style={{
                font: '500 11px/1 var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                opacity: 0.8
              }}>AIIMIN OS</span>
            </div>
            <h1 style={{
              font: 'var(--text-hero)',
              fontSize: '32px',
              color: 'var(--color-hero)',
              marginBottom: '8px',
              letterSpacing: '-0.02em',
            }}>
              {step === 1 ? (mode === 'login' ? 'Welcome back.' : 'Create Identity.') : 'Secure Access.'}
            </h1>
            <p style={{
              font: 'var(--text-subtext)',
              color: 'var(--color-text-2)',
              fontSize: '13px',
              opacity: 0.6
            }}>
              {step === 1
                ? (mode === 'login' ? 'Enter your registered identity to proceed.' : 'Join the behavior-shaping network.')
                : 'Enter your 6-digit security code.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0, filter: 'blur(8px)', y: 10 },
                  visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { staggerChildren: 0.1 } },
                  exit: { opacity: 0, filter: 'blur(8px)', y: -10, transition: { duration: 0.3 } }
                }}
              >
                <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {mode === 'signup' && (
                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                      <input
                        type="text"
                        placeholder="FULL NAME"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '13px' }}
                        required
                        onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.15)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.015)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </motion.div>
                  )}

                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                    <input
                      type="text"
                      placeholder="USERNAME OR EMAIL"
                      value={identifier.toUpperCase()}
                      onChange={e => setIdentifier(e.target.value)}
                      style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '13px' }}
                      required
                      autoComplete="username"
                      onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.15)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.015)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </motion.div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          color: '#FDA4AF',
                          fontSize: '12px',
                          textAlign: 'center',
                          fontFamily: 'var(--font-mono)',
                          letterSpacing: '0.05em'
                        }}>
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    type="submit"
                    style={{
                      height: '56px',
                      background: 'var(--color-accent)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      marginTop: '8px',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#0e9f6e'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)'; }}
                  >
                    Continue
                  </motion.button>

                  <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-2)',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        textUnderlineOffset: '4px',
                        opacity: 0.6,
                        transition: 'opacity 0.2s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                    >
                      {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -5, filter: 'blur(4px)' }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={{ width: '100%', marginBottom: '32px' }}>
                  <button
                    type="button"
                    onClick={handleBack}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '11px',
                      padding: '0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                    }}
                  >
                    <ArrowLeft size={14} /> Back to Identity
                  </button>
                </div>

                {/* PIN Indicator Dots */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: i === pin.length ? 1.2 : 1,
                        backgroundColor: i < pin.length ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                        boxShadow: i < pin.length ? '0 0 12px var(--color-accent-glow)' : 'none',
                      }}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        border: i < pin.length ? 'none' : '1px solid var(--color-border)',
                      }}
                    />
                  ))}
                </div>

                {loading ? (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
                    <div className="spinner" style={{ width: '32px', height: '32px' }} />
                    <div style={{
                      color: 'var(--color-text-3)',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      Authenticating
                    </div>
                  </div>
                ) : (
                  <>
                    <Numpad
                      onEntry={handlePinEntry}
                      onDelete={handlePinDelete}
                      onClear={handlePinClear}
                      maxLength={6}
                      currentLength={pin.length}
                    />
                    {error && (
                      <div style={{
                        color: 'var(--color-alert-red)',
                        fontSize: '11px',
                        marginTop: '24px',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {error}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Support Footer */}
        <div style={{ marginTop: '24px', textAlign: 'center', opacity: 0.4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-text-3)' }}>
            <Shield size={12} />
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              End-to-End Encrypted Data Repository
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .spinner {
          border: 2px solid var(--color-border);
          border-top-color: var(--color-accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;
