import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Numpad from '../components/common/Numpad';

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

  // Transition to PIN step
  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter a username or email.');
      return;
    }
    if (mode === 'signup' && !fullName.trim()) {
      setError('Please enter your full name.');
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
      setError(err.message || 'Authentication failed.');
      setPin(''); // Reset PIN on error
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    height: '46px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--glass-border-lit)',
    borderRadius: 'var(--r-md)',
    color: 'var(--color-text-1)',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    fontWeight: 300,
    padding: '0 14px',
    outline: 'none',
    transition: `border-color var(--dur-enter) var(--ease), background var(--dur-enter) var(--ease)`,
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
      {/* Atmospheric Ambient Glows */}
      <div style={{
        position: 'absolute', top: '-15%', left: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(200,98,26,0.12) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(43,168,159,0.08) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '20%', right: '15%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(245,166,35,0.04) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* Glass Card */}
      <div style={{
        width: '400px',
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 'var(--r-xl)',
        boxShadow: `
          0 24px 48px -12px rgba(0,0,0,0.5),
          inset 0 1px 1px rgba(255,255,255,0.05)
        `,
        padding: '48px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Top accent line - Gold Gradient */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--color-accent), #f5a623, transparent)',
          borderRadius: 'var(--r-pill)',
          opacity: 0.8,
        }} />

        {/* Brand */}
        <div style={{ marginBottom: '36px', textAlign: 'center' }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-1)',
            letterSpacing: '0.25em',
            marginBottom: '8px',
            textShadow: '0 0 20px rgba(200,98,26,0.3)',
          }}>
            AIIMIN
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--color-text-3)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}>
            Behavior-Shaping OS
          </div>
        </div>

        {/* Mode toggle - Only show in Step 1 */}
        {step === 1 && (
          <div style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--r-md)',
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
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: mode === m ? 'var(--color-text-1)' : 'var(--color-text-3)',
                  background: mode === m ? 'var(--glass-bg-strong)' : 'transparent',
                  border: mode === m ? '1px solid var(--glass-border-lit)' : '1px solid transparent',
                  borderRadius: 'var(--r-sm)',
                  cursor: 'pointer',
                  transition: `all var(--dur-enter) var(--ease)`,
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
            background: 'rgba(224,90,90,0.08)',
            border: '1px solid rgba(224,90,90,0.25)',
            borderRadius: 'var(--r-md)',
            marginBottom: '16px',
            fontSize: '13px',
            color: 'var(--color-alert-red)',
          }}>
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mode === 'signup' && (
                  <input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    style={inputStyle}
                    required
                    onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'rgba(43,168,159,0.06)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--glass-border-lit)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                  />
                )}

                <input
                  type="text"
                  placeholder="USERNAME"
                  value={identifier.toUpperCase()}
                  onChange={e => setIdentifier(e.target.value)}
                  style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '0.08em' }}
                  required
                  autoComplete="username"
                  onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'rgba(43,168,159,0.06)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--glass-border-lit)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />

                <button
                  type="submit"
                  style={{
                    height: '46px',
                    marginTop: '6px',
                    background: 'linear-gradient(135deg, var(--color-accent), #1d8a82)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--r-md)',
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'var(--font-sans)',
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                    transition: `all var(--dur-enter) var(--ease)`,
                    boxShadow: '0 4px 16px rgba(43,168,159,0.25)',
                  }}
                >
                  Next
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
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
                    gap: '6px',
                    fontSize: '11px',
                    padding: '0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <div style={{ flex: 1, textAlign: 'center', color: 'var(--color-text-2)', fontSize: '12px', marginRight: '40px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {mode === 'login' ? 'Confirm Identity' : 'Set Security PIN'}
                </div>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px', opacity: 0.5 }}>
                Identity
              </div>
              <div style={{ fontSize: '18px', color: 'var(--color-accent)', marginBottom: '32px', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', fontWeight: 500 }}>
                {identifier.toUpperCase()}
              </div>

              {/* PIN Dots */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: i < pin.length ? 'var(--color-accent)' : 'rgba(255,255,255,0.04)',
                      boxShadow: i < pin.length
                        ? '0 0 15px var(--color-accent-glow), 0 0 5px var(--color-accent)'
                        : 'inset 0 1px 3px rgba(0,0,0,0.4)',
                      border: i < pin.length ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.08)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: i === pin.length ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>

              {loading ? (
                <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
                  <div className="spinner" style={{ width: '48px', height: '48px', borderThickness: '3px' }} />
                  <div style={{ color: 'var(--color-text-3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Decrypting...</div>
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
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-3)' }}>
            Private. No tracking. Your data only.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
