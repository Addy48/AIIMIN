import React, { useEffect, useId, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { API_URL } from '../../utils/api';
import '../../styles/waitlistLanding.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OS_ID_RE = /^[A-Z0-9@,._\-=+*^$#!]+$/;

function validateOsId(value) {
  const v = value.trim().toUpperCase();
  if (v.length !== 8) return 'OS-ID must be exactly 8 characters';
  if (!OS_ID_RE.test(v)) return 'Invalid characters in OS-ID';
  if ((v.match(/[0-9]/g) || []).length > 4) return 'Max 4 numbers in OS-ID';
  return null;
}

export default function WaitlistForm({ compact = false, onSuccess }) {
  const formId = useId();
  const firstNameId = `${formId}-first-name`;
  const emailId = `${formId}-email`;
  const osIdToggleId = `${formId}-osid-toggle`;
  const osIdInputId = `${formId}-osid`;
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [reserveNow, setReserveNow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'already' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [reservedId, setReservedId] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [osTouched, setOsTouched] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (status !== 'success') return undefined;
    setCelebrate(true);
    if (typeof window !== 'undefined' && typeof window.navigator?.vibrate === 'function') {
      window.navigator.vibrate(30);
    }
    const timer = setTimeout(() => setCelebrate(false), 1400);
    return () => clearTimeout(timer);
  }, [status]);

  const submit = async (e) => {
    e.preventDefault();
    const sanitized = email.trim().toLowerCase();
    const nameVal = firstName.trim();
    const usernameVal = username.trim().toUpperCase();

    if (!EMAIL_RE.test(sanitized)) {
      setErrorMsg('Enter a valid email');
      setStatus('error');
      return;
    }

    if (reserveNow && usernameVal) {
      const osIdErr = validateOsId(usernameVal);
      if (osIdErr) {
        setErrorMsg(osIdErr);
        setStatus('error');
        return;
      }
    }

    setLoading(true);
    setStatus(null);
    setErrorMsg('');

    try {
      const payload = {
        email: sanitized,
        source: 'landing_page_v2',
      };
      if (nameVal) payload.first_name = nameVal;
      if (reserveNow && usernameVal) payload.reserved_username = usernameVal;

      const res = await fetch(`${API_URL}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong');
        setStatus('error');
        return;
      }

      if (data.already_registered) {
        setStatus('already');
      } else {
        setStatus('success');
        setReservedId(data.reserved_username || usernameVal || '');
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'waitlist_signup', { email: sanitized });
        }
        onSuccess?.();
      }
    } catch {
      setErrorMsg('Network error - try again');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className={`waitlist-form-message ${compact ? 'waitlist-form-message-compact' : ''}`}>
        {celebrate && (
          <div className="waitlist-success-burst" aria-hidden="true">
            <span>✨</span>
            <span>🎉</span>
            <span>⭐</span>
          </div>
        )}
        <p className="waitlist-form-success-title">
          <CheckCircle2 size={16} />
          You are on the list.
        </p>
        <p className="waitlist-form-success-copy">We will email you as soon as early access opens.</p>
        {reservedId && (
          <p className="waitlist-form-success-id">
            Your OS-ID is locked: @{reservedId}
          </p>
        )}
        {!reservedId && <p className="waitlist-form-note">You can claim your OS-ID in the invite flow later.</p>}
      </div>
    );
  }

  if (status === 'already') {
    return (
      <p className={`waitlist-form-message ${compact ? 'waitlist-form-message-compact' : ''}`}>
        You are already registered. We will notify you before launch.
      </p>
    );
  }

  const emailHasError = emailTouched && !EMAIL_RE.test(email.trim().toLowerCase());
  const osHasError = reserveNow && osTouched && username && !!validateOsId(username);

  return (
    <form onSubmit={submit} className={`waitlist-form ${compact ? 'waitlist-form-compact' : ''}`}>
      <div className={`waitlist-form-row waitlist-form-row-top ${compact ? 'waitlist-form-row-stack' : ''}`}>
        <div className="waitlist-field">
          <label htmlFor={firstNameId} className="waitlist-label">
            First name <span>(optional)</span>
          </label>
          <input
            id={firstNameId}
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Arnav"
            maxLength={100}
            className="waitlist-input"
            aria-label="First name"
          />
        </div>
        <div className="waitlist-field">
          <label htmlFor={emailId} className="waitlist-label">
            Email <span>(required)</span>
          </label>
          <input
            id={emailId}
            type="email"
            value={email}
            onBlur={() => setEmailTouched(true)}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status) setStatus(null);
            }}
            placeholder="arnav.desai@mail.com"
            required
            className={`waitlist-input ${emailHasError ? 'waitlist-input-error' : ''}`}
            aria-label="Email address"
          />
        </div>
      </div>

      <label className="waitlist-inline-check" htmlFor={osIdToggleId}>
        <input
          id={osIdToggleId}
          type="checkbox"
          checked={reserveNow}
          onChange={(e) => setReserveNow(e.target.checked)}
        />
        Reserve my 8-character OS-ID now
      </label>

      {reserveNow && (
        <div className="waitlist-field">
          <label htmlFor={osIdInputId} className="waitlist-label">
            Preferred OS-ID <span>(optional)</span>
          </label>
          <input
            id={osIdInputId}
            type="text"
            value={username}
            onBlur={() => setOsTouched(true)}
            onChange={(e) => setUsername(e.target.value.toUpperCase().replace(/[^A-Z0-9@,._\-=+*^$#!]/g, '').slice(0, 8))}
            placeholder="NEXUS42"
            maxLength={8}
            className={`waitlist-input waitlist-input-id ${osHasError ? 'waitlist-input-error' : ''}`}
            aria-label="Reserved OS-ID username"
          />
          <p className="waitlist-field-hint">
            Exactly 8 characters. Letters, numbers, and symbols allowed. Max 4 numbers.
          </p>
        </div>
      )}

      <button type="submit" disabled={loading} className="waitlist-submit-btn">
        <Sparkles size={14} />
        {loading ? 'Saving your spot...' : 'Get early access'}
      </button>

      {!compact && (
        <p className="waitlist-form-note">
          No spam. Unsubscribe anytime. Waitlist members unlock the best launch package at go-live.
        </p>
      )}

      {emailHasError && <p className="waitlist-form-error">Enter a valid email address.</p>}
      {osHasError && <p className="waitlist-form-error">{validateOsId(username)}</p>}
      {status === 'error' && (
        <p className="waitlist-form-error">
          {errorMsg || 'Something went wrong. Try again.'}
        </p>
      )}

      {!compact && (
        <p className="waitlist-form-meta">
          Already invited? <a href="/login">Sign in</a>
        </p>
      )}
    </form>
  );
}
