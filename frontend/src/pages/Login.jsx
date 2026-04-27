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
    height: '52px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--r-md)',
    color: 'var(--color-text-1)',
    fontFamily: 'var(--font-sans)',
    fontSize: '15px',
    fontWeight: 300,
    padding: '0 18px',
    outline: 'none',
    transition: `all var(--dur-enter) var(--ease)`,
    textAlign: 'center',
    letterSpacing: '0.02em',
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
      {/* Background Organic Textures - Very subtle */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '40%',
        height: '40%',
        background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)',
        opacity: 0.15,
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        padding: '24px',
        zIndex: 2,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--r-xl)',
            padding: '56px 48px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
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
                initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 5, filter: 'blur(4px)' }}
                transition={{ duration: 0.4 }}
              >
                <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {mode === 'signup' && (
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        style={inputStyle}
                        required
                        onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.background = 'rgba(255,255,255,0.02)'; }}
                      />
                    </div>
                  )}

                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="USERNAME OR EMAIL"
                      value={identifier.toUpperCase()}
                      onChange={e => setIdentifier(e.target.value)}
                      style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '13px' }}
                      required
                      autoComplete="username"
                      onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.background = 'rgba(255,255,255,0.02)'; }}
                    />
                  </div>

                  {error && (
                    <div style={{
                      color: 'var(--color-alert-red)',
                      fontSize: '12px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      marginTop: '4px'
                    }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    style={{
                      height: '52px',
                      background: 'var(--color-accent)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 'var(--r-md)',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      marginTop: '8px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#4d6e58'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    Continue
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-2)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        textUnderlineOffset: '4px',
                        opacity: 0.6
                      }}
                    >
                      {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
                    </button>
                  </div>
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
