import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

/*
 * Login — Glassmorphism card on ambient dark background.
 * Alias map lets Aaditya type "au48" instead of full email.
 */

const ALIASES = {
  'au48':    'aadityaupadhyay10@gmail.com',
  'au4803':  'aadityaupadhyay10@gmail.com',
  'adi':     'aadityaupadhyay10@gmail.com',
};

const resolveEmail = (raw) => ALIASES[raw.trim().toLowerCase()] || raw.trim();

const Login = () => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const resolved = resolveEmail(email);
      if (mode === 'signup') {
        await signUpWithEmail(resolved, password, fullName, fullName.split(' ')[0].toLowerCase());
      } else {
        await signInWithEmail(resolved, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
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
      {/* Ambient glows */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: '500px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(43,168,159,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: '400px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(90,154,224,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Glass Card */}
      <div style={{
        width: '380px',
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--r-xl)',
        boxShadow: 'var(--glass-shadow)',
        padding: '40px 36px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
          borderRadius: 'var(--r-pill)',
        }} />

        {/* Brand */}
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <div style={{
            fontSize: '20px',
            fontWeight: 500,
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-1)',
            letterSpacing: '0.18em',
            marginBottom: '6px',
          }}>
            AIIMIN
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--color-text-3)',
            letterSpacing: '0.06em',
          }}>
            Personal operating system
          </div>
        </div>

        {/* Mode toggle */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
            placeholder="Email or alias (au48)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
            required
            autoComplete="username"
            onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'rgba(43,168,159,0.06)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--glass-border-lit)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
          />

          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: '52px' }}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.background = 'rgba(43,168,159,0.06)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--glass-border-lit)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw(p => !p)}
              style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-text-3)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: 0,
              }}
            >
              {showPw ? 'hide' : 'show'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              height: '46px',
              marginTop: '6px',
              background: loading
                ? 'rgba(255,255,255,0.04)'
                : 'linear-gradient(135deg, var(--color-accent), #1d8a82)',
              color: loading ? 'var(--color-text-3)' : '#fff',
              border: 'none',
              borderRadius: 'var(--r-md)',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.04em',
              transition: `all var(--dur-enter) var(--ease)`,
              boxShadow: loading ? 'none' : '0 4px 16px rgba(43,168,159,0.25)',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 6px 20px rgba(43,168,159,0.40)'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.boxShadow = '0 4px 16px rgba(43,168,159,0.25)'; }}
          >
            {loading ? 'Signing in…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-3)' }}>
            Private. No tracking. Your data only.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
