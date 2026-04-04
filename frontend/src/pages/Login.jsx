import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

/*
 * Login — Flat, dark, minimal.
 * No gradients. No decorative circles. No glassmorphism.
 * Design spec: #0C0E0B bg, #141614 card, DM Mono brand, teal CTA.
 */

/* Alias map: shorthand → real email */
const ALIASES = {
  'au48':           'aadityaupadhyay10@gmail.com',
  'au4803':         'aadityaupadhyay10@gmail.com',
  'adi':            'aadityaupadhyay10@gmail.com',
};

const resolveEmail = (raw) => {
  const key = raw.trim().toLowerCase();
  return ALIASES[key] || key;
};

const Login = () => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode]           = useState('login');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [fullName, setFullName]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const resolvedEmail = resolveEmail(email);

      if (mode === 'signup') {
        await signUpWithEmail(resolvedEmail, password, fullName, fullName.split(' ')[0].toLowerCase());
      } else {
        await signInWithEmail(resolvedEmail, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = {
    width: '100%',
    height: '44px',
    background: 'var(--color-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: '0',
    color: 'var(--color-text-1)',
    font: 'var(--text-body)',
    fontFamily: 'var(--font-sans)',
    padding: '0 14px',
    outline: 'none',
    transition: `border-color var(--dur-enter) var(--ease)`,
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
      <div style={{
        width: '360px',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: '48px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
      }}>

        {/* Brand */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            font: '500 18px/1 var(--font-mono)',
            color: 'var(--color-text-1)',
            letterSpacing: '0.12em',
            marginBottom: '6px',
          }}>
            AIIMIN
          </div>
          <div className="text-subtext">Personal operating system</div>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex',
          gap: '0',
          marginBottom: '28px',
          borderBottom: '1px solid var(--color-border)',
        }}>
          {['login', 'signup'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); }}
              style={{
                flex: 1,
                padding: '10px 0',
                font: '500 11px/1 var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: mode === m ? 'var(--color-text-1)' : 'var(--color-text-3)',
                background: 'transparent',
                border: 'none',
                borderBottom: mode === m ? '1px solid var(--color-accent)' : '1px solid transparent',
                cursor: 'pointer',
                transition: `color var(--dur-enter) var(--ease), border-color var(--dur-enter) var(--ease)`,
                marginBottom: '-1px',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '10px 12px',
            background: 'var(--color-elevated)',
            borderLeft: '3px solid var(--color-alert-red)',
            marginBottom: '20px',
          }}>
            <span className="text-subtext" style={{ color: 'var(--color-alert-red)' }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              style={inputBase}
              required
              onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
          )}

          <input
            type="text"
            placeholder="Email or alias (e.g. au48)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputBase}
            required
            autoComplete="username"
            onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          />

          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...inputBase, paddingRight: '44px' }}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw(p => !p)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-3)',
                font: '12px var(--font-mono)',
                padding: 0,
                lineHeight: 1,
              }}
            >
              {showPw ? 'hide' : 'show'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              height: '44px',
              background: loading ? 'var(--color-elevated)' : 'var(--color-accent)',
              color: loading ? 'var(--color-text-3)' : 'var(--color-base)',
              border: 'none',
              font: '500 13px/1 var(--font-sans)',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              transition: `background var(--dur-enter) var(--ease)`,
              letterSpacing: '0.04em',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#259990'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--color-accent)'; }}
          >
            {loading ? 'Signing in...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Footer note */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
          <span className="text-subtext">Private. No tracking. Your data only.</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
