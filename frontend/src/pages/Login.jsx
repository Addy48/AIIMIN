import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Command } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Numpad from '../components/common/Numpad';

/**
 * AIIMIN Identity Portal
 * Vercel-Inspired Minimalist Aesthetic
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
      background: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
      }}>
        
        {/* Branding */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex', 
            background: '#fff', 
            color: '#000', 
            padding: '12px', 
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <Command size={32} strokeWidth={2.5} />
          </div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 600, 
            letterSpacing: '-0.02em',
            margin: '0 0 8px' 
          }}>
            {step === 1 ? (mode === 'login' ? 'Sign in to AIIMIN' : 'Create your account') : 'Security Verification'}
          </h1>
          <p style={{ 
            fontSize: '14px', 
            color: '#888',
            margin: 0 
          }}>
            {step === 1 
              ? (mode === 'login' ? 'Use your username or email to continue' : 'Enter your details to join the network') 
              : 'Enter the 6-digit access code linked to your identity'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="identifier"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mode === 'signup' && (
                   <div>
                    <label style={{ fontSize: '12px', color: '#888', fontWeight: 500, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        height: '48px',
                        background: '#000',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#fff',
                        padding: '0 16px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#fff'}
                      onBlur={e => e.target.style.borderColor = '#333'}
                    />
                  </div>
                )}
                
                <div>
                  <label style={{ fontSize: '12px', color: '#888', fontWeight: 500, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username or Email</label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      height: '48px',
                      background: '#000',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#fff',
                      padding: '0 16px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#fff'}
                    onBlur={e => e.target.style.borderColor = '#333'}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    height: '48px',
                    background: '#fff',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '8px',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.opacity = 0.9}
                  onMouseLeave={e => e.target.style.opacity = 1}
                >
                  Continue
                </button>

                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                   <button
                    type="button"
                    onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#888',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                  >
                    {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="pin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
               <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#888',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    marginBottom: '32px',
                    padding: 0
                  }}
                >
                  <ArrowLeft size={14} /> Back
                </button>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '48px' }}>
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: i < pin.length ? '#fff' : 'transparent',
                        border: '1px solid #333',
                        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                  ))}
                </div>

                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <div className="vercel-spinner" />
                    <p style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '16px' }}>Authenticating</p>
                  </div>
                ) : (
                  <Numpad
                    onEntry={handlePinEntry}
                    onDelete={handlePinDelete}
                    onClear={handlePinClear}
                    maxLength={6}
                    currentLength={pin.length}
                    style={{ color: '#fff' }}
                  />
                )}

                {error && (
                  <div style={{ color: '#ff4d4d', fontSize: '13px', marginTop: '24px' }}>
                    {error}
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ position: 'fixed', bottom: '32px', textAlign: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#444' }}>
          <Shield size={14} />
          <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.02em' }}>SECURE ACCESS PROTOCOL</span>
        </div>
      </div>

      <style>{`
        .vercel-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        /* Custom Numpad Styles for Vercel Look */
        .numpad-grid button {
          background: transparent !important;
          border: 1px solid transparent !important;
          color: #fff !important;
          font-weight: 500 !important;
        }
        .numpad-grid button:hover {
          background: rgba(255,255,255,0.05) !important;
          border-color: #333 !important;
        }
      `}</style>
    </div>
  );
};

export default Login;
