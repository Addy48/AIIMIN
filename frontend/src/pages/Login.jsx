import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Sun, Moon } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Numpad from '../components/common/Numpad';
import Logo from '../components/Logo';
import { useThemeContext } from '../context/ThemeContext';

/**
 * AIIMIN Identity Portal
 * Premium Branding & Theme Awareness
 */

const ALIASES = {
  'au48': 'aadityaupadhyay10@gmail.com',
  'au4803': 'aadityaupadhyay10@gmail.com',
  'adi': 'aadityaupadhyay10@gmail.com',
};

const resolveEmail = (raw) => ALIASES[raw.trim().toLowerCase()] || raw.trim();

const Login = () => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === 'dark';

  const [mode, setMode] = useState('login');
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNext = (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      setError('Identifier required.');
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '40%',
        height: '40%',
        background: 'var(--accent)',
        filter: 'blur(120px)',
        opacity: isDark ? 0.05 : 0.03,
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Theme Toggle */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '10px',
          cursor: 'pointer',
          color: 'var(--text-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </motion.button>

      <div style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        zIndex: 1,
      }}>
        
        {/* Branding */}
        <div style={{ textAlign: 'center' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ 
              display: 'inline-flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px'
            }}
          >
            <Logo size={56} />
            <span style={{ 
              fontSize: '20px', 
              fontWeight: 800, 
              letterSpacing: '0.2em', 
              color: 'var(--text-1)',
              textTransform: 'uppercase',
              marginLeft: '0.2em' // Offset for letter-spacing center
            }}>AIIMIN</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{ 
              fontSize: '28px', 
              fontWeight: 700, 
              letterSpacing: '-0.03em',
              margin: '0 0 10px',
              color: 'var(--text-1)'
            }}
          >
            {step === 1 ? (mode === 'login' ? 'Sign in to Portal' : 'Create Account') : 'Security Verification'}
          </motion.h1>
          
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{ 
              fontSize: '15px', 
              color: 'var(--text-3)',
              margin: 0,
              lineHeight: '1.5'
            }}
          >
            {step === 1 
              ? (mode === 'login' ? 'Use your username or email to continue' : 'Enter your details to join the network') 
              : 'Enter the 6-digit access code linked to your identity'}
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="identifier"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {mode === 'signup' && (
                   <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Aaditya Upadhyay"
                      style={{
                        width: '100%',
                        height: '52px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        color: 'var(--text-1)',
                        padding: '0 18px',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'var(--accent)';
                        e.target.style.boxShadow = '0 0 0 1px var(--accent)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'var(--border)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Username or Email</label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    autoFocus
                    placeholder="e.g. au48"
                    style={{
                      width: '100%',
                      height: '52px',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      color: 'var(--text-1)',
                      padding: '0 18px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = 'var(--accent)';
                      e.target.style.boxShadow = '0 0 0 1px var(--accent)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  style={{
                    height: '52px',
                    background: 'var(--text-1)',
                    color: 'var(--bg-primary)',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '10px',
                    transition: 'opacity 0.2s',
                  }}
                >
                  Continue
                </motion.button>

                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                   <button
                    type="button"
                    onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-3)',
                      fontSize: '14px',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      fontWeight: 500,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = 'var(--text-2)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-3)'}
                  >
                    {mode === 'login' ? (
                      <>Don't have an account? <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign up</span></>
                    ) : (
                      <>Already have an account? <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Log in</span></>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="pin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
               <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    color: 'var(--text-2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginBottom: '32px',
                    padding: '8px 16px',
                    borderRadius: '99px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.background = 'var(--border)'}
                  onMouseLeave={e => e.target.style.background = 'var(--bg-elevated)'}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <div style={{ display: 'flex', gap: '14px', marginBottom: '48px' }}>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={{ 
                        scale: i < pin.length ? 1.2 : 1,
                        background: i < pin.length ? 'var(--accent)' : 'transparent'
                      }}
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        border: `2px solid ${i < pin.length ? 'var(--accent)' : 'var(--border)'}`,
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                  ))}
                </div>

                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <div className="portal-spinner" />
                    <p style={{ color: 'var(--text-3)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '20px' }}>Secure Identity Check</p>
                  </div>
                ) : (
                  <Numpad
                    onEntry={handlePinEntry}
                    onDelete={handlePinDelete}
                    onClear={handlePinClear}
                    maxLength={6}
                    currentLength={pin.length}
                    style={{ color: 'var(--text-1)' }}
                  />
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: 'var(--color-danger)', fontSize: '14px', marginTop: '24px', fontWeight: 500 }}
                  >
                    {error}
                  </motion.div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <div style={{ position: 'fixed', bottom: '32px', textAlign: 'center', width: '100%', opacity: 0.6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-3)' }}>
          <Shield size={14} />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em' }}>SECURE ACCESS PROTOCOL</span>
        </div>
      </div>

      <style>{`
        .portal-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        /* Premium Numpad Adjustments */
        .numpad-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .numpad-grid button {
          background: var(--bg-elevated) !important;
          border: 1px solid var(--border) !important;
          color: var(--text-1) !important;
          width: 72px !important;
          height: 72px !important;
          border-radius: 50% !important;
          font-size: 24px !important;
          font-weight: 600 !important;
          transition: all 0.2s ease !important;
        }
        .numpad-grid button:hover {
          background: var(--border) !important;
          transform: scale(1.05);
        }
        .numpad-grid button:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default Login;
