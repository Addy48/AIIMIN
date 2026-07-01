import React, { useState } from 'react';
import { ShippedPrimaryButton } from '../design/ShippedUI';

const API_BASE = process.env.REACT_APP_API_URL || '/api';
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
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'already' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [reservedId, setReservedId] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const sanitized = email.trim().toLowerCase();
    const nameVal = firstName.trim();
    const usernameVal = username.trim().toUpperCase();

    if (!nameVal) {
      setErrorMsg('First name is required');
      setStatus('error');
      return;
    }
    if (!EMAIL_RE.test(sanitized)) {
      setErrorMsg('Enter a valid email');
      setStatus('error');
      return;
    }
    const osIdErr = validateOsId(usernameVal);
    if (osIdErr) {
      setErrorMsg(osIdErr);
      setStatus('error');
      return;
    }

    setLoading(true);
    setStatus(null);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sanitized,
          first_name: nameVal,
          reserved_username: usernameVal,
        }),
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
        setReservedId(data.reserved_username || usernameVal);
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'waitlist_signup', { email: sanitized });
        }
        onSuccess?.();
      }
    } catch {
      setErrorMsg('Network error — try again');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div style={{ maxWidth: 480, textAlign: compact ? 'left' : 'center' }}>
        <p style={{ fontSize: compact ? '14px' : '16px', color: '#A0A0B0', margin: '0 0 8px', lineHeight: 1.6 }}>
          You're on the list. We'll see you in September.
        </p>
        {reservedId && (
          <p style={{ fontSize: compact ? '13px' : '14px', color: '#10b981', margin: 0, fontWeight: 600 }}>
            Your OS-ID is locked: @{reservedId}
          </p>
        )}
      </div>
    );
  }

  if (status === 'already') {
    return (
      <p style={{ fontSize: compact ? '14px' : '16px', color: '#A0A0B0', margin: 0, lineHeight: 1.6 }}>
        You're already registered. See you in September!
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        maxWidth: compact ? '100%' : '520px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: compact ? 'column' : 'row', gap: '10px', width: '100%' }}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          maxLength={100}
          required
          style={{ ...inputStyle, flex: 1 }}
          aria-label="First name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          style={{ ...inputStyle, flex: 1 }}
          aria-label="Email address"
        />
      </div>
      <div style={{ display: 'flex', flexDirection: compact ? 'column' : 'row', gap: '10px', width: '100%', alignItems: compact ? 'stretch' : 'center' }}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.toUpperCase().replace(/[^A-Z0-9@,._\-=+*^$#!]/g, '').slice(0, 8))}
          placeholder="Reserve OS-ID (8 chars)"
          maxLength={8}
          required
          style={{ ...inputStyle, flex: 1, fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.06em' }}
          aria-label="Reserved OS-ID username"
        />
        <ShippedPrimaryButton
          type="submit"
          loading={loading}
          disabled={loading}
          style={{
            height: '48px',
            padding: '0 28px',
            borderRadius: '9999px',
            border: 'none',
            background: '#2563EB',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
            whiteSpace: 'nowrap',
            fontFamily: 'inherit',
            flexShrink: 0,
          }}
        >
          Join the Waitlist
        </ShippedPrimaryButton>
      </div>
      {!compact && (
        <p style={{ margin: 0, fontSize: '12px', color: '#6B6B7B', lineHeight: 1.5 }}>
          Waitlist exclusives: lock your OS-ID, 3 months Core free, early prototypes, priority sports feed.
        </p>
      )}
      {status === 'error' && (
        <p style={{ width: '100%', margin: 0, fontSize: '13px', color: '#EF4444' }}>
          {errorMsg || 'Something went wrong. Try again.'}
        </p>
      )}
    </form>
  );
}

const inputStyle = {
  height: '48px',
  padding: '0 16px',
  borderRadius: '9999px',
  border: '1px solid #323650',
  background: 'rgba(255,255,255,0.04)',
  color: '#EDEDED',
  fontSize: '16px',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};
