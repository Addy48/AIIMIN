import React, { useState, useCallback, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import { ArchBracketMark, DARK_PICK } from '../components/brand/archBracketMark';
import { apiGet, apiPost } from '../utils/api';

const IS_WAITLIST_MODE = process.env.REACT_APP_WAITLIST_MODE === 'true';

/* Email vs OS-ID share one field — classify carefully (OS-ID charset includes @). */
function isEmailIdentifier(val) {
  const v = String(val || '').trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return true;
  if (/@[a-z0-9][a-z0-9.-]*\./i.test(v)) return true;
  if (/@[a-z0-9.-]{3,}$/i.test(v)) return true;
  return false;
}

function isCompleteOsId(val) {
  const v = String(val || '').trim().toUpperCase();
  if (!v || isEmailIdentifier(v)) return false;
  if (v.length !== 8) return false;
  if (!/^[A-Z0-9@,._\-=+*^$#!]+$/.test(v)) return false;
  if ((v.match(/[0-9]/g) || []).length > 4) return false;
  return true;
}

function normalizeLoginIdentifier(raw) {
  const v = String(raw || '');
  if (isEmailIdentifier(v) || (v.includes('@') && v.length > 8)) {
    return v.trim().toLowerCase();
  }
  return v.toUpperCase().replace(/[^A-Z0-9@,._\-=+*^$#!]/g, '').slice(0, 8);
}

function validateUsername(val) {
  if (!val) return 'OS-ID cannot be empty.';
  if (val.length !== 8) return 'OS-ID must be exactly 8 characters long.';
  if (!/^[A-Z0-9@,._\-=+*^$#!]+$/.test(val)) return 'Only letters, numbers, and @,._-=+*^$#! are allowed.';
  if ((val.match(/[0-9]/g) || []).length > 4) return 'Maximum 4 digits allowed.';
  return null;
}

/* ─────────────────────────────────────────────
   GOOGLE LOGO SVG
───────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
  </svg>
);

/* ─────────────────────────────────────────────
   STEP INDICATOR (signup 4-step progress)
───────────────────────────────────────────── */
const StepIndicator = ({ currentStep, totalSteps = 4 }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: '32px' }}>
    {Array.from({ length: totalSteps }, (_, i) => {
      const n = i + 1;
      const done = n < currentStep;
      const active = n === currentStep;
      return (
        <React.Fragment key={n}>
          <motion.div
            initial={false}
            animate={{
              background: done ? 'var(--color-accent)' : active ? '#fff' : 'transparent',
              borderColor: done ? 'var(--color-accent)' : active ? 'var(--color-accent)' : 'var(--color-border)',
              scale: active ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, position: 'relative', zIndex: 1,
            }}
          >
            {done ? (
              <Check size={14} color="#fff" strokeWidth={3} />
            ) : (
              <span style={{
                fontSize: '13px', fontWeight: 700,
                color: active ? 'var(--color-accent)' : 'var(--color-text-3)',
                fontFamily: 'var(--font-sans)',
              }}>{n}</span>
            )}
          </motion.div>
          {n < totalSteps && (
            <div style={{
              height: '2px', width: '40px', flexShrink: 0,
              background: n < currentStep ? 'var(--color-accent)' : 'var(--color-border)',
              transition: 'background 0.4s ease',
            }} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* Mask OS-ID / email for PIN step — privacy + friendlier copy */
function maskIdentity(raw) {
  const v = String(raw || '').trim();
  if (!v) return 'your account';
  if (isEmailIdentifier(v)) {
    const [user, domain] = v.split('@');
    if (!domain) return 'your account';
    const u = user.length <= 2 ? `${user[0] || '*'}*` : `${user.slice(0, 2)}***`;
    return `${u}@${domain}`;
  }
  if (v.length >= 6) return `${v.slice(0, 2)}****${v.slice(-2)}`;
  if (v.length >= 3) return `${v.slice(0, 1)}****${v.slice(-1)}`;
  return 'your account';
}

/* ─────────────────────────────────────────────
   PIN DOTS — filled CSS circles (never text bullets),
   active slot ring, equal gap, high-contrast empty
───────────────────────────────────────────── */
const PinDots = ({ length, value = '', shake }) => {
  const filledCount = value.length;
  const activeIndex = Math.min(filledCount, length - 1);
  return (
    <motion.div
      role="group"
      aria-label={`PIN entry, ${filledCount} of ${length} digits entered`}
      aria-live="polite"
      animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
      className="pin-dots"
    >
      {Array.from({ length }, (_, i) => {
        const filled = i < filledCount;
        const active = !filled && i === filledCount && filledCount < length;
        const err = shake && filled;
        return (
          <motion.div
            key={i}
            aria-hidden="true"
            className={[
              'pin-dot-slot',
              filled ? 'is-filled' : '',
              active ? 'is-active' : '',
              err ? 'is-error' : '',
            ].filter(Boolean).join(' ')}
            animate={{ scale: filled ? 1.04 : active ? 1.02 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            {filled ? <span className="pin-dot-mask" /> : null}
          </motion.div>
        );
      })}
      {/* activeIndex kept for future caret; slot styles drive focus */}
      <span className="sr-only">{filledCount} of {length}, next slot {activeIndex + 1}</span>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   PIN NUMPAD — full 3×4 grid; bottom: Clear | 0 | Del
───────────────────────────────────────────── */
const PinNumpad = ({ onEntry, onDelete, onClear }) => {
  const keys = [
    { k: '1', type: 'digit' },
    { k: '2', type: 'digit' },
    { k: '3', type: 'digit' },
    { k: '4', type: 'digit' },
    { k: '5', type: 'digit' },
    { k: '6', type: 'digit' },
    { k: '7', type: 'digit' },
    { k: '8', type: 'digit' },
    { k: '9', type: 'digit' },
    { k: 'Clear', type: 'clear' },
    { k: '0', type: 'digit' },
    { k: 'Del', type: 'del' },
  ];
  return (
    <div className="pin-numpad" role="group" aria-label="PIN keypad">
      {keys.map(({ k, type }) => (
        <button
          key={k}
          type="button"
          className={`pin-numpad-btn${type !== 'digit' ? ` is-${type}` : ''}`}
          aria-label={
            type === 'del' ? 'Delete last digit'
              : type === 'clear' ? 'Clear PIN'
                : `Digit ${k}`
          }
          onClick={() => {
            if (type === 'del') onDelete();
            else if (type === 'clear') onClear();
            else onEntry(k);
          }}
        >
          {k}
        </button>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   SHARED STYLES
───────────────────────────────────────────── */
const inputBase = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '14px 16px',
  background: 'var(--color-elevated)',
  border: '1.5px solid var(--color-border)',
  borderRadius: '14px',
  fontSize: '16px',
  color: 'var(--color-text-1)',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const labelBase = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 700,
  color: 'var(--color-text-1)',
  marginBottom: '8px',
  fontFamily: 'var(--font-sans)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

/* ─────────────────────────────────────────────
   PRIMARY BUTTON
───────────────────────────────────────────── */
const PrimaryBtn = ({ children, onClick, disabled, type = 'submit', loading }) => (
  <motion.button
    whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
    whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
    onClick={onClick}
    disabled={disabled || loading}
    type={type}
    style={{
      width: '100%',
      background: (disabled || loading) ? 'color-mix(in srgb, var(--color-accent) 50%, transparent)' : 'var(--color-accent)',
      color: '#fff',
      border: 'none',
      borderRadius: '14px',
      padding: '15px',
      fontWeight: 700,
      fontSize: '15px',
      cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-sans)',
      boxShadow: (disabled || loading) ? 'none' : '0 8px 24px color-mix(in srgb, var(--color-accent) 30%, transparent)',
      transition: 'all 0.2s',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    }}
  >
    {loading ? (
      <>
        <span className="login-spinner" />
        <span>Loading…</span>
      </>
    ) : children}
  </motion.button>
);

/* ─────────────────────────────────────────────
   GOOGLE BUTTON
───────────────────────────────────────────── */
const GoogleBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="login-google-btn"
    style={{
      width: '100%',
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '14px',
      padding: '14px',
      fontSize: '15px',
      fontWeight: 600,
      color: 'var(--color-text-1)',
      fontFamily: 'var(--font-sans)',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
      transition: 'background 0.2s, border-color 0.2s',
    }}
  >
    <GoogleIcon />
    Continue with Google
  </button>
);

/* ─────────────────────────────────────────────
   OR DIVIDER
───────────────────────────────────────────── */
const Divider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
    <span style={{ fontSize: '12px', color: 'var(--color-text-1)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>or</span>
    <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
  </div>
);

/* ─────────────────────────────────────────────
   INPUT with focus highlight
   Native <input> + label/aria-label required for a11y tree.
   Fake placeholder overlays + placeholder=" " made Selfloop/AT
   drop the field (no textbox role with a usable name).
───────────────────────────────────────────── */
const Field = ({ label, placeholder, id: idProp, name, 'aria-label': ariaLabelProp, type = 'text', ...props }) => {
  const reactId = useId();
  // Prefer stable name-based ids — React useId ":" tokens break some AT/label maps.
  const id = idProp || (name ? `login-field-${name}` : reactId);
  const [focused, setFocused] = useState(false);
  const accessibleName = ariaLabelProp || label || placeholder || 'Input';
  return (
    <div>
      {label && (
        <label htmlFor={id} style={labelBase}>{label}</label>
      )}
      <input
        {...props}
        id={id}
        name={name || id}
        type={type}
        placeholder={placeholder}
        aria-label={accessibleName}
        style={{
          ...inputBase,
          borderColor: focused ? 'var(--color-accent)' : 'var(--color-border)',
          boxShadow: focused ? '0 0 0 3px color-mix(in srgb, var(--color-accent) 15%, transparent)' : 'none',
          ...(props.style || {}),
        }}
        onFocus={e => { setFocused(true); props.onFocus && props.onFocus(e); }}
        onBlur={e => { setFocused(false); props.onBlur && props.onBlur(e); }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   ERROR MESSAGE
───────────────────────────────────────────── */
const ErrorMsg = ({ msg }) =>
  msg ? (
    <motion.p
      role="alert"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="login-error-msg"
    >
      {msg}
    </motion.p>
  ) : null;

/* ─────────────────────────────────────────────
   BACK BUTTON — matches numpad surface weight
───────────────────────────────────────────── */
const BackBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="login-back-btn"
    aria-label="Back"
  >
    <ArrowLeft size={16} strokeWidth={2.5} /> Back
  </button>
);

/* ─────────────────────────────────────────────
   STEP ANIMATION VARIANTS
───────────────────────────────────────────── */
/* Slide only — never animate opacity (opacity:0 removes inputs from a11y tree). */
const stepVariants = {
  enter: { x: 40, opacity: 1 },
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } },
  exit: { x: -40, opacity: 1, transition: { duration: 0.2 } },
};
const stepVariantsBack = {
  enter: { x: -40, opacity: 1 },
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } },
  exit: { x: 40, opacity: 1, transition: { duration: 0.2 } },
};

/* ─────────────────────────────────────────────
   INITIALIZING SCREEN (post-signup)
───────────────────────────────────────────── */
const InitializingScreen = ({ stage }) => {
  const steps = [
    'Allocating Neural Core',
    'Provisioning Security Vault',
    'Configuring Advanced Analytics',
    'Finalizing Access Protocol',
  ];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px', minHeight: '360px', width: '100%' }}
    >
      <div style={{ position: 'relative', width: '56px', height: '56px' }}>
        <div style={{ position: 'absolute', inset: 0, border: '3px solid var(--color-border)', borderRadius: '50%' }} />
        <div className="login-spinner-ring" />
      </div>
      <div>
        <h2 style={{ margin: '0 0 20px', fontSize: '22px', fontWeight: 800, color: 'var(--color-text-1)', textAlign: 'center', fontFamily: 'var(--font-serif)' }}>
          Initializing System
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {steps.map((s, i) => {
            const done = stage > i;
            const active = stage === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0.2 }}
                animate={{ opacity: stage >= i ? 1 : 0.2 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <motion.div
                  animate={{ background: done ? 'var(--color-accent)' : 'var(--color-elevated)' }}
                  style={{ width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid var(--color-border)' }}
                >
                  {done && <Check size={10} color="#fff" />}
                </motion.div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: done ? 'var(--color-text-1)' : active ? 'var(--color-text-2)' : 'var(--color-text-3)', fontFamily: 'var(--font-sans)' }}>
                  {s}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   MAIN LOGIN COMPONENT
───────────────────────────────────────────── */
const Login = () => {
  const { signInWithUsername, signUpWithUsername, signInWithGoogle } = useAuth();
  const { setForcedTheme } = useThemeContext();
  const navigate = useNavigate();

  // ── State ──
  const [mode, setMode]               = useState('login'); // 'login' | 'signup' | 'forgot'
  const [step, setStep]               = useState(1);
  const [direction, setDirection]     = useState(1);      // 1=forward, -1=backward
  const [identifier, setIdentifier]   = useState('');
  const [fullName, setFullName]       = useState('');
  const [email, setEmail]             = useState('');
  const [usernameVal, setUsernameVal] = useState('');
  const [pin, setPin]                 = useState('');
  const [confirmPin, setConfirmPin]   = useState('');
  const osIdAutoKeyRef = React.useRef('');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [error, setError]             = useState(null);
  const [loading, setLoading]         = useState(false);
  const [loadingText, setLoadingText] = useState('Verifying...');
  const [shake, setShake]             = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [initStage, setInitStage]     = useState(0);
  const [forgotSent, setForgotSent]   = useState(false);

  useEffect(() => {
    setForcedTheme('normal'); // Force Light theme on the Login page
    return () => setForcedTheme(null);
  }, [setForcedTheme]);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setLoadingText('Waking up secure servers (may take ~50s)...');
      }, 3500);
    } else {
      setLoadingText('Verifying...');
    }
    return () => clearTimeout(timer);
  }, [loading]);

  // ── Helpers ──


  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setStep(1); setDirection(1);
    setIdentifier(''); setFullName(''); setEmail('');
    setUsernameVal(''); setPin(''); setConfirmPin('');
    setForgotIdentifier(''); setForgotSent(false); setError(null);
  };

  // ── Nav handlers ──
  const handleNext = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    if (mode === 'login') {
      if (!identifier.trim()) { setError('Identifier required.'); return; }
      // Email must look complete; OS-ID must be exactly 8 valid chars
      if (isEmailIdentifier(identifier)) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())) {
          setError('Enter a valid email.'); return;
        }
      } else if (!isCompleteOsId(identifier)) {
        setError('Enter a full 8-character OS-ID, or a complete email.'); return;
      }
      setDirection(1); setStep(2);
    } else if (mode === 'forgot') {
      if (!forgotIdentifier.trim()) { setError('Username or Email required.'); return; }
      setLoading(true);
      try {
        let email = forgotIdentifier.trim().toLowerCase();
        if (!email.includes('@')) {
          const resolved = await apiGet(`/auth/resolve?identifier=${encodeURIComponent(forgotIdentifier.trim())}`, { auth: false });
          email = resolved?.email || email;
        }
        await apiPost('/auth/request-password-reset', {
          email,
          redirectTo: `${window.location.origin}/login?reset=1`,
        }, { auth: false });
        setForgotSent(true);
      } catch (err) {
        setForgotSent(true);
      } finally {
        setLoading(false);
      }
    } else {
      if (!fullName.trim()) { setError('Full name required.'); return; }
      if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError('Enter a valid email or leave blank.'); return;
      }
      setDirection(1); setStep(2);
    }
  };

  const handleBack = () => {
    setError(null);
    if (mode === 'login') {
      setDirection(-1); setStep(1); setPin('');
    } else if (mode === 'forgot') {
      setMode('login'); setStep(1); setForgotIdentifier(''); setForgotSent(false);
    } else {
      if (step === 2) { setDirection(-1); setStep(1); }
      else if (step === 3) { setDirection(-1); setStep(2); setPin(''); }
      else if (step === 4) { setDirection(-1); setStep(3); setConfirmPin(''); }
    }
  };

  // ── Auth ──
  const handleSubmitLogin = useCallback(async (finalPin) => {
    setError(null); setLoading(true);
    try {
      await signInWithUsername(identifier.trim(), finalPin);
      navigate('/overview');
    } catch (err) {
      const status = err?.status || err?.response?.status;
      const raw = String(err?.message || '');
      let msg = raw || 'Verification failure. Try again.';
      if (status === 429 || /too many|rate limit|429/i.test(raw)) {
        msg = 'Too many attempts. Wait a few minutes, then try again.';
      } else if (/invalid|credential|unauthorized|incorrect|wrong/i.test(raw)) {
        msg = 'Incorrect PIN. Check and try again.';
      }
      setError(msg);
      setPin(''); triggerShake(); setLoading(false);
    }
  }, [identifier, navigate, signInWithUsername, triggerShake]);

  const handleSubmitSignup = useCallback(async (finalConfirmPin) => {
    if (pin !== finalConfirmPin) {
      setError('PINs do not match. Re-verify.');
      setConfirmPin(''); triggerShake(); return;
    }
    setError(null);
    setInitializing(true);
    setTimeout(() => setInitStage(1), 1000);
    setTimeout(() => setInitStage(2), 2500);
    setTimeout(() => setInitStage(3), 4000);
    try {
      const regUser = usernameVal.toUpperCase();
      const authEmail = email.trim() || `${regUser.toLowerCase()}@aiimin.com`;
      await signUpWithUsername(regUser, pin, fullName.trim(), authEmail);
      setTimeout(() => { window.location.href = '/overview'; }, 5000);
    } catch (err) {
      setInitializing(false); setInitStage(0);
      setError(err.message || 'Signup failed. Try again.');
      setConfirmPin(''); setStep(3); setDirection(-1); setPin(''); triggerShake(); setLoading(false);
    }
  }, [email, fullName, pin, signUpWithUsername, triggerShake, usernameVal]);

  // ── PIN handlers ──
  const handlePinEntryRef = React.useRef();
  const handlePinDeleteRef = React.useRef();

  const handlePinEntry = useCallback((digit) => {
    if (loading) return;
    if (mode === 'login') {
      setPin(p => {
        if (p.length < 6) {
          const np = p + digit;
          if (np.length === 6) setTimeout(() => handleSubmitLogin(np), 0);
          return np;
        }
        return p;
      });
    } else {
      if (step === 3) {
        setPin(p => {
          if (p.length < 6) {
            const np = p + digit;
            if (np.length === 6) { setTimeout(() => { setDirection(1); setStep(4); }, 0); }
            return np;
          }
          return p;
        });
      } else if (step === 4) {
        setConfirmPin(c => {
          if (c.length < 6) {
            const nc = c + digit;
            if (nc.length === 6) setTimeout(() => handleSubmitSignup(nc), 0);
            return nc;
          }
          return c;
        });
      }
    }
  }, [loading, mode, step, handleSubmitLogin, handleSubmitSignup]);

  const handlePinDelete = useCallback(() => {
    if (loading) return;
    if (mode === 'login') setPin(p => p.slice(0, -1));
    else {
      if (step === 3) setPin(p => p.slice(0, -1));
      else if (step === 4) setConfirmPin(c => c.slice(0, -1));
    }
  }, [loading, mode, step]);

  const handlePinClear = useCallback(() => {
    if (loading) return;
    if (mode === 'login') setPin('');
    else if (step === 3) setPin('');
    else if (step === 4) setConfirmPin('');
  }, [loading, mode, step]);

  useEffect(() => {
    handlePinEntryRef.current = handlePinEntry;
    handlePinDeleteRef.current = handlePinDelete;
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isPinScreen =
        (mode === 'login' && step === 2) ||
        (mode === 'signup' && (step === 3 || step === 4));

      if (!isPinScreen) return;
      if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Escape') return;
      if (e.repeat) return;

      e.preventDefault();

      if (e.key === 'Backspace') {
        if (handlePinDeleteRef.current) handlePinDeleteRef.current();
      } else if (e.key === 'Escape') {
        handlePinClear();
      } else {
        if (handlePinEntryRef.current) handlePinEntryRef.current(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, step, handlePinClear]);

  // ── Username step ──
  // (isEmailIdentifier / isCompleteOsId / normalizeLoginIdentifier / validateUsername are module-scope)

  const handleUsernameNext = async (e) => {
    if (e) e.preventDefault();
    const validationError = validateUsername(usernameVal);
    if (validationError) { setError(validationError); return; }
    setError(null); setLoading(true);
    try {
      const data = await apiGet(`/auth/resolve?identifier=${encodeURIComponent(usernameVal.trim())}`, { auth: false });
      if (data && data.email) setError('OS-ID is already taken.');
      else { setDirection(1); setStep(3); }
    } catch (err) {
      // 404 means OS-ID is available — proceed to next step
      if (err.status === 404 || (err.response && err.response.status === 404)) {
        setDirection(1); setStep(3);
      } else {
        setError('Error checking OS-ID. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9@,._\-=+*^$#!]/g, '');
    if (val.length <= 8) setUsernameVal(val);
  };

  // Auto-advance login when OS-ID hits 8 valid chars (PIN-like). Never for email.
  useEffect(() => {
    if (mode !== 'login' || step !== 1 || loading) return undefined;
    if (!isCompleteOsId(identifier)) return undefined;
    const t = setTimeout(() => {
      setError(null);
      setDirection(1);
      setStep(2);
    }, 80);
    return () => clearTimeout(t);
  }, [identifier, mode, step, loading]);

  // Auto-check signup OS-ID when 8 valid chars entered
  useEffect(() => {
    if (mode !== 'signup' || step !== 2 || loading) return undefined;
    if (!isCompleteOsId(usernameVal)) return undefined;
    if (osIdAutoKeyRef.current === usernameVal) return undefined;
    osIdAutoKeyRef.current = usernameVal;
    const t = setTimeout(() => {
      handleUsernameNext();
    }, 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once per unique 8-char OS-ID
  }, [usernameVal, mode, step, loading]);

  // ── Signup step indicator step number ──
  // step 1=info, 2=username, 3=pin, 4=confirm
  const signupIndicatorStep = step;

  /* ───── RENDER ───── */
  return (
    <div className="login-root">
      {/* ─── LEFT PANEL ─── */}
      <div className="login-left">
        {/* Radial glow overlay */}
        <div className="login-left-glow" />

        {/* Logo */}
        <div className="login-left-logo">
          <Link to="/" className="login-brand-link" aria-label="AIIMIN home">
            <ArchBracketMark size={40} withChip colors={DARK_PICK} />
            <span className="login-wordmark-white">AIIMIN</span>
          </Link>
        </div>

        {/* Center tagline — sentence case; spaces stay in DOM (no br-merge OCR) */}
        <div className="login-left-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="login-left-tagline"
          >
            <span className="login-tagline-line">The personal operating</span>
            <span className="login-tagline-line">system for the ambitious.</span>
          </motion.h2>
        </div>

        {/* Feature pills — no decorative ✦; full descriptors; padded off edge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="login-left-pills"
        >
          {['Finance & Goals', 'Habits & Discipline', 'Journal & Focus'].map(p => (
            <span key={p} className="login-pill">{p}</span>
          ))}
        </motion.div>
      </div>

      {/* RIGHT: Form Panel */}
      <div className="login-right" style={{ position: 'relative' }}>
        <div className="login-form-wrap">
          {/* Wordmark only when left panel hidden (mobile) — avoid duplicate brand */}
          <div className="login-form-brand">
            <Link to="/" className="login-brand-link" aria-label="AIIMIN home">
              <span className="login-wordmark-brand">AIIMIN</span>
            </Link>
          </div>

          {initializing ? (
            <InitializingScreen stage={initStage} />
          ) : (
            <>
              {/* Step indicator for signup */}
              {mode === 'signup' && (
                <StepIndicator currentStep={signupIndicatorStep} totalSteps={4} />
              )}

              {/* Form heading */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${mode}-${step}-heading`}
                  variants={direction > 0 ? stepVariants : stepVariantsBack}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ marginBottom: '28px' }}
                >
                  <h1 style={{
                    margin: '0 0 8px',
                    fontSize: '26px', fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: 'var(--color-text-1)',
                    fontFamily: 'var(--font-serif)',
                    lineHeight: 1.2,
                  }}>
                    {mode === 'login' ? (
                      step === 1 ? 'Welcome back' : 'Enter your PIN'
                    ) : mode === 'forgot' ? (
                      forgotSent ? 'Check your inbox' : 'Reset Access'
                    ) : (
                      step === 1 ? 'Create account' :
                      step === 2 ? 'Choose an OS-ID' :
                      step === 3 ? 'Set a PIN' : 'Confirm your PIN'
                    )}
                  </h1>
                  <p className="login-form-sub">
                    {mode === 'login' ? (
                      step === 1 ? 'Access your intelligent workspace' : `Enter your 6-digit PIN for ${maskIdentity(identifier)}`
                    ) : mode === 'forgot' ? (
                      forgotSent ? 'A recovery link has been sent.' : 'We\'ll send a recovery link to your email.'
                    ) : (
                      step === 1 ? 'Join AIIMIN and elevate your operations.' :
                      step === 2 ? 'Your unique OS-ID across the network.' :
                      step === 3 ? 'Choose a secure 6-digit access PIN.' : 'Re-enter your PIN to confirm.'
                    )}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* ── FORMS ── */}
              <AnimatePresence mode="wait">
                {/* ───── FORGOT FLOW ───── */}
                {mode === 'forgot' && (
                  forgotSent ? (
                    <motion.div
                      key="forgot-done"
                      variants={stepVariants} initial="enter" animate="center" exit="exit"
                      style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}
                    >
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={28} color="var(--color-accent)" />
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-2)', fontFamily: 'var(--font-sans)', lineHeight: 1.6 }}>
                        If an account with <strong style={{ color: 'var(--color-text-1)' }}>{forgotIdentifier}</strong> exists, a secure recovery link has been transmitted.
                      </p>
                      <button
                        onClick={handleBack}
                        style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0 }}
                      >
                        ← Return to login
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="forgot-step1"
                      variants={stepVariants} initial="enter" animate="center" exit="exit"
                    >
                      <BackBtn onClick={handleBack} />
                      <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Field
                          label="OS-ID / Email"
                          type="text"
                          required
                          autoFocus
                          name="forgot-identifier"
                          value={forgotIdentifier}
                          onChange={e => setForgotIdentifier(e.target.value)}
                          placeholder="Enter OS-ID or email"
                          aria-label="OS-ID / EMAIL"
                          autoComplete="username"
                        />
                        <ErrorMsg msg={error} />
                        <PrimaryBtn>Send Recovery Link →</PrimaryBtn>
                      </form>
                    </motion.div>
                  )
                )}

                {/* ───── LOGIN FLOW ───── */}
                {mode === 'login' && step === 1 && (
                  <motion.div
                    key="login-s1"
                    variants={direction > 0 ? stepVariants : stepVariantsBack}
                    initial="enter" animate="center" exit="exit"
                  >
                    <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <Field
                        label="OS-ID / Email"
                        type="text"
                        required
                        autoFocus
                        name="identifier"
                        value={identifier}
                        onChange={(e) => setIdentifier(normalizeLoginIdentifier(e.target.value))}
                        autoCapitalize="none"
                        autoComplete="username"
                        autoCorrect="off"
                        spellCheck="false"
                        placeholder="8-char OS-ID or email"
                        aria-label="OS-ID / EMAIL"
                        maxLength={isEmailIdentifier(identifier) || identifier.includes('@') ? 254 : 8}
                        style={{
                          textTransform: isEmailIdentifier(identifier) || identifier.includes('@') ? 'none' : 'uppercase',
                          letterSpacing: isCompleteOsId(identifier) ? '0.12em' : undefined,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      />
                      <p style={{ margin: '-8px 0 0', fontSize: '12px', color: 'var(--color-text-2)', fontFamily: 'var(--font-sans)', lineHeight: 1.4 }}>
                        {isEmailIdentifier(identifier)
                          ? 'Email detected — press Continue when ready.'
                          : identifier.length > 0
                            ? `OS-ID ${identifier.length}/8 — auto-continues at 8 characters.`
                            : 'OS-ID auto-continues at 8 chars. Email needs @ and domain.'}
                      </p>
                      <ErrorMsg msg={error} />
                      <PrimaryBtn>Continue →</PrimaryBtn>
                      <Divider />
                      <GoogleBtn onClick={async () => {
                        try { await signInWithGoogle(); } catch (_) { /* surfaced via toast */ }
                      }} />
                      <div className="login-account-row">
                        <span className="login-account-prompt">Don't have an account?</span>
                        <button type="button" onClick={toggleMode} className="login-text-cta">
                          Sign up
                        </button>
                      </div>
                      {IS_WAITLIST_MODE && (
                        <p style={{ margin: '12px 0 0', fontSize: '13px', color: 'var(--color-text-3)', fontFamily: 'var(--font-sans)', textAlign: 'center' }}>
                          Not on the tester list?{' '}
                          <Link to="/" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>
                            Join the waitlist
                          </Link>
                        </p>
                      )}
                    </form>
                  </motion.div>
                )}

                {mode === 'login' && step === 2 && (
                  <motion.div
                    key="login-s2"
                    variants={direction > 0 ? stepVariants : stepVariantsBack}
                    initial="enter" animate="center" exit="exit"
                    className="login-pin-step"
                  >
                    <BackBtn onClick={handleBack} />
                    <PinDots length={6} value={pin} shake={shake} />
                    {loading ? (
                      <div style={{ padding: '24px', textAlign: 'center' }}>
                        <span className="login-spinner-lg" />
                        <p style={{ color: 'var(--color-text-1)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '14px', fontFamily: 'var(--font-sans)' }}>
                          {loadingText}
                        </p>
                      </div>
                    ) : (
                      <PinNumpad
                        onEntry={handlePinEntry}
                        onDelete={handlePinDelete}
                        onClear={handlePinClear}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setStep(1); setError(null); }}
                      className="login-forgot-link"
                    >
                      Forgot PIN?
                    </button>
                    <ErrorMsg msg={error} />
                  </motion.div>
                )}

                {/* ───── SIGNUP FLOW ───── */}
                {mode === 'signup' && step === 1 && (
                  <motion.div
                    key="signup-s1"
                    variants={direction > 0 ? stepVariants : stepVariantsBack}
                    initial="enter" animate="center" exit="exit"
                  >
                    <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <Field
                        label="Full Name"
                        type="text"
                        required
                        autoFocus
                        name="fullName"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="e.g. Hashmatullah Kumar"
                        aria-label="Full Name"
                        autoComplete="name"
                      />
                      <Field
                        label="Recovery Email (Optional)"
                        type="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value.trim().toLowerCase())}
                        placeholder="you@example.com"
                        aria-label="Recovery Email"
                        autoCapitalize="none"
                        autoComplete="email"
                        spellCheck="false"
                      />
                      <ErrorMsg msg={error} />
                      <PrimaryBtn>Continue →</PrimaryBtn>
                      <Divider />
                      <GoogleBtn onClick={async () => {
                        try { await signInWithGoogle(); } catch (_) { /* surfaced via toast */ }
                      }} />
                      <div className="login-account-row">
                        <span className="login-account-prompt">Already have an account?</span>
                        <button type="button" onClick={toggleMode} className="login-text-cta">
                          Sign in
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {mode === 'signup' && step === 2 && (
                  <motion.div
                    key="signup-s2"
                    variants={direction > 0 ? stepVariants : stepVariantsBack}
                    initial="enter" animate="center" exit="exit"
                  >
                    <BackBtn onClick={handleBack} />
                    <form onSubmit={handleUsernameNext} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <Field
                        label="OS-ID"
                        type="text"
                        required
                        autoFocus
                        name="username"
                        value={usernameVal}
                        onChange={handleUsernameChange}
                        placeholder="e.g. HASMAT99"
                        aria-label="OS-ID"
                        autoComplete="username"
                        style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
                      />
                      {/* Validation hints */}
                      <div style={{ padding: '14px 16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-3)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                          Requirements
                        </div>
                        <ValidationRow
                          ok={usernameVal.length === 8}
                          label={`Exactly 8 characters (${usernameVal.length}/8)`}
                        />
                        <ValidationRow
                          ok={(usernameVal.match(/[0-9]/g) || []).length <= 4}
                          label={`Max 4 numbers (${(usernameVal.match(/[0-9]/g) || []).length}/4)`}
                        />
                        <ValidationRow
                          ok={usernameVal.length > 0 && /^[A-Z0-9@,._\-=+*^$#!]+$/i.test(usernameVal)}
                          label="Letters, numbers, @,._-=+*^$#! only"
                        />
                      </div>
                      <ErrorMsg msg={error} />
                      <PrimaryBtn disabled={!(usernameVal.length === 8 && (usernameVal.match(/[0-9]/g) || []).length <= 4 && /^[A-Z0-9@,._\-=+*^$#!]+$/i.test(usernameVal))} loading={loading}>Continue →</PrimaryBtn>
                    </form>
                  </motion.div>
                )}

                {mode === 'signup' && step === 3 && (
                  <motion.div
                    key="signup-s3"
                    variants={direction > 0 ? stepVariants : stepVariantsBack}
                    initial="enter" animate="center" exit="exit"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}
                  >
                    <BackBtn onClick={handleBack} />
                    <PinDots length={6} value={pin} shake={shake} />
                    <PinNumpad onEntry={handlePinEntry} onDelete={handlePinDelete} onClear={handlePinClear} />
                    <ErrorMsg msg={error} />
                  </motion.div>
                )}

                {mode === 'signup' && step === 4 && (
                  <motion.div
                    key="signup-s4"
                    variants={direction > 0 ? stepVariants : stepVariantsBack}
                    initial="enter" animate="center" exit="exit"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}
                  >
                    <BackBtn onClick={handleBack} />
                    <PinDots length={6} value={confirmPin} shake={shake} />
                    {loading ? (
                      <div style={{ padding: '24px', textAlign: 'center' }}>
                        <span className="login-spinner-lg" />
                        <p style={{ color: 'var(--color-text-1)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '14px', fontFamily: 'var(--font-sans)' }}>
                          Creating account…
                        </p>
                      </div>
                    ) : (
                      <PinNumpad onEntry={handlePinEntry} onDelete={handlePinDelete} onClear={handlePinClear} />
                    )}
                    <ErrorMsg msg={error} />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {/* ─── STYLES ─── */}
      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .login-root {
          display: flex;
          min-height: 100vh;
          overflow: hidden;
        }

        /* LEFT */
        .login-left {
          width: 40%;
          min-height: 100vh;
          flex-shrink: 0;
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 48px 48px 112px 56px;
          box-sizing: border-box;
          overflow: hidden;
          background: color-mix(in srgb, var(--color-accent) 90%, #000 10%);
          background-image: radial-gradient(
            ellipse 80% 60% at 30% 40%,
            color-mix(in srgb, var(--color-accent) 60%, #fff 10%) 0%,
            color-mix(in srgb, var(--color-accent) 85%, #000 15%) 50%,
            color-mix(in srgb, var(--color-accent) 40%, #000 60%) 100%
          );
        }

        .login-left-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(0,0,0,0.3) 0%, transparent 60%);
        }

        .login-left-logo {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }

        .login-brand-link {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }

        .login-brand-link:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 4px;
          border-radius: 8px;
        }

        .login-wordmark-white {
          font-family: var(--font-serif);
          font-size: 22px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.04em;
          opacity: 0.95;
        }

        .login-left-center {
          flex: 1;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 2;
          padding-bottom: 24px;
        }

        .login-left-tagline {
          font-family: var(--font-serif);
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin: 0;
          opacity: 0.97;
        }

        .login-tagline-line {
          display: block;
        }

        .login-left-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          position: relative;
          z-index: 2;
          padding-bottom: 8px;
        }

        .login-pill {
          display: inline-flex;
          align-items: center;
          padding: 10px 16px;
          border-radius: 99px;
          background: rgba(0, 0, 0, 0.42);
          border: 1px solid rgba(255, 255, 255, 0.45);
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          font-family: var(--font-sans);
          letter-spacing: 0.01em;
          backdrop-filter: blur(10px);
        }

        /* RIGHT */
        .login-right {
          flex: 1;
          min-height: 100vh;
          background: var(--color-base);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
          box-sizing: border-box;
          overflow-y: auto;
        }

        .login-form-wrap {
          width: 100%;
          max-width: 420px;
        }

        .login-form-wrap input::placeholder {
          color: var(--color-text-1);
          opacity: 0.55;
        }

        .login-form-brand {
          display: none;
          margin-bottom: 32px;
        }

        .login-form-sub {
          margin: 0;
          font-size: 14px;
          color: #1a1a1a;
          font-family: var(--font-sans);
          line-height: 1.5;
          font-weight: 600;
        }

        .login-wordmark-brand {
          font-family: var(--font-serif);
          font-size: 24px;
          font-weight: 900;
          color: var(--color-text-1);
          letter-spacing: -0.04em;
        }

        .login-account-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 8px;
        }

        .login-account-prompt {
          font-size: 14px;
          color: var(--color-text-1);
          font-family: var(--font-sans);
          font-weight: 500;
        }

        /* Real 44×44+ chip — no negative-margin fake hit area */
        .login-text-cta {
          background: color-mix(in srgb, var(--color-accent) 12%, var(--color-surface));
          border: 1.5px solid var(--color-accent);
          border-radius: 12px;
          color: var(--color-accent);
          font-weight: 700;
          cursor: pointer;
          font-size: 14px;
          font-family: var(--font-sans);
          text-decoration: none;
          min-height: 44px;
          min-width: 88px;
          padding: 10px 18px;
          margin: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .login-text-cta:hover {
          background: color-mix(in srgb, var(--color-accent) 20%, var(--color-surface));
        }
        .login-text-cta:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }

        .login-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
          min-height: 48px;
          cursor: pointer;
          font-family: var(--font-sans);
          margin-bottom: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          transition: background 0.15s, border-color 0.15s;
        }
        .login-back-btn:hover {
          background: var(--color-elevated);
          border-color: var(--color-accent);
        }

        .login-pin-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
          width: 100%;
        }

        .login-forgot-link {
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: 14px;
          color: #1a1a1a;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          font-family: var(--font-sans);
          min-height: 48px;
          min-width: 160px;
          padding: 12px 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .login-forgot-link:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        .login-error-msg {
          margin: 4px 0 0;
          font-size: 14px;
          color: #991b1b;
          font-weight: 700;
          font-family: var(--font-sans);
          text-align: center;
          line-height: 1.45;
          padding: 12px 14px;
          background: #fef2f2;
          border: 1.5px solid #fecaca;
          border-radius: 12px;
          width: 100%;
          box-sizing: border-box;
        }

        /* PIN dots */
        .pin-dots {
          display: flex;
          gap: 14px;
          justify-content: center;
          width: 100%;
        }

        .pin-dot-slot {
          width: 46px;
          height: 56px;
          border-radius: 12px;
          border: 2.5px solid #4b5563;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }

        .pin-dot-slot.is-filled {
          border-color: var(--color-accent);
          background: #ffffff;
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 28%, transparent);
        }

        .pin-dot-slot.is-active {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 28%, transparent);
          animation: pin-slot-pulse 1.2s ease-in-out infinite;
        }

        .pin-dot-slot.is-error {
          border-color: #991b1b;
          box-shadow: 0 0 0 2px color-mix(in srgb, #991b1b 25%, transparent);
        }

        .pin-dot-mask {
          display: block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #1a1a1a;
        }

        .pin-dot-slot.is-error .pin-dot-mask {
          background: #991b1b;
        }

        @keyframes pin-slot-pulse {
          0%, 100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 22%, transparent); }
          50% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--color-accent) 35%, transparent); }
        }

        /* Numpad — full 3×4 including Clear | 0 | Del */
        .pin-numpad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
        }

        .pin-numpad-btn {
          height: 64px;
          width: 100%;
          border-radius: 14px;
          border: 1.5px solid var(--color-border);
          background: #ffffff;
          font-size: 22px;
          font-weight: 600;
          color: #1a1a1a;
          min-width: 44px;
          min-height: 64px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-sans);
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          transition: background 0.15s, transform 0.1s;
          box-sizing: border-box;
        }

        .pin-numpad-btn.is-del,
        .pin-numpad-btn.is-clear {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .pin-numpad-btn:hover {
          background: var(--color-elevated) !important;
        }
        .pin-numpad-btn:active {
          transform: scale(0.93);
        }
        .pin-numpad-btn:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }

        /* Google button hover */
        .login-google-btn:hover {
          background: var(--color-elevated) !important;
          border-color: var(--color-accent) !important;
        }

        /* Spinners */
        .login-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: login-spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        .login-spinner-lg {
          display: block;
          width: 32px;
          height: 32px;
          margin: 0 auto;
          border: 3px solid var(--color-border);
          border-top-color: var(--color-accent);
          border-radius: 50%;
          animation: login-spin 0.7s linear infinite;
        }

        .login-spinner-ring {
          position: absolute;
          inset: 0;
          border: 3px solid transparent;
          border-top-color: var(--color-accent);
          border-radius: 50%;
          animation: login-spin 0.8s linear infinite;
        }

        @keyframes login-spin {
          to { transform: rotate(360deg); }
        }

        /* Mobile: hide left panel; show form brand */
        @media (max-width: 900px) {
          .login-left {
            display: none;
          }
          .login-right {
            min-height: 100vh;
          }
          .login-form-brand {
            display: block;
          }
        }

        /* Tablets: tighten */
        @media (max-width: 1100px) and (min-width: 901px) {
          .login-left {
            padding: 40px 36px 80px;
          }
        }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────────
   VALIDATION ROW helper
───────────────────────────────────────────── */
const ValidationRow = ({ ok, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
    {ok
      ? <Check size={13} color="var(--color-accent)" />
      : <X size={13} color="#ef4444" />}
    <span style={{ color: ok ? 'var(--color-text-1)' : 'var(--color-text-3)', fontFamily: 'var(--font-sans)' }}>{label}</span>
  </div>
);

export default Login;
