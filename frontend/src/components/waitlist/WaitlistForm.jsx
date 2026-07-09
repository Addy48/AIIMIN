import React, { useEffect, useId, useMemo, useState } from 'react';
import { CheckCircle2, Sparkles, BadgeCheck } from 'lucide-react';
import { API_URL } from '../../utils/api';
import { suggestOsIdFromName } from '../../utils/osId';
import WaitlistQuickFeedback from './WaitlistQuickFeedback';
import '../../styles/waitlistLanding.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OS_ID_RE = /^[A-Z0-9@,._\-=+*^$#!]+$/;
const WAITLIST_STORAGE_KEY = 'aiimin_waitlist';
const REFERRAL_STORAGE_KEY = 'aiimin_waitlist_ref';

function validateOsId(value) {
  const v = value.trim().toUpperCase();
  if (v.length !== 8) return 'OS-ID must be exactly 8 characters';
  if (!OS_ID_RE.test(v)) return 'Invalid characters in OS-ID';
  if ((v.match(/[0-9]/g) || []).length > 4) return 'Max 4 numbers in OS-ID';
  return null;
}

function readStoredSignup() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(WAITLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSignup(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify({
    email: data.email || '',
    name: data.name || '',
    referralCode: data.referralCode || '',
    referralCount: data.referralCount ?? 0,
    reservedId: data.reservedId || '',
    signedUpAt: new Date().toISOString(),
  }));
}

function clearStoredSignup() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(WAITLIST_STORAGE_KEY);
}

function captureReferralFromUrl() {
  if (typeof window === 'undefined') return '';
  const ref = new URLSearchParams(window.location.search).get('ref');
  if (ref) {
    sessionStorage.setItem(REFERRAL_STORAGE_KEY, ref.trim().toUpperCase());
    return ref.trim().toUpperCase();
  }
  return sessionStorage.getItem(REFERRAL_STORAGE_KEY) || '';
}

function buildReferralUrl(code) {
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://aiimin.in';
  return `${base}/?ref=${encodeURIComponent(code)}`;
}

function buildWhatsAppShare(code) {
  const url = buildReferralUrl(code);
  const text = `I just joined the AIIMIN waitlist — habits, money, focus, and mood in one dashboard. Built for Indian students. Explore free · Core ₹29/mo · Pro founding ₹49/mo · Elite ₹79 for waitlist. ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

function buildTwitterShare(code) {
  const url = buildReferralUrl(code);
  const text = `I just joined the AIIMIN waitlist — habits, money, focus, and mood in one dashboard. Built for Indian students. ${url}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

function ConfirmationPanel({
  email,
  firstName,
  referralCode,
  reservedId,
  confirmationEmailSent,
  compact,
  showFeatureVote = true,
  onReset,
}) {
  const [copied, setCopied] = useState(false);
  const [voteOpen, setVoteOpen] = useState(false);
  const referralUrl = referralCode ? buildReferralUrl(referralCode) : 'https://aiimin.in';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`confirmation-panel ${compact ? 'confirmation-panel-compact' : ''}`} role="status" aria-live="polite">
      <div className="confirmation-icon-wrap">
        <CheckCircle2 size={40} className="confirmation-check" />
      </div>
      <span className="confirmation-founder-pill">Founding member · perks locked</span>
      <h3>
        You&apos;re in, <span className="user-name">{firstName || 'friend'}</span>.
      </h3>
      <p className="next-step">
        {confirmationEmailSent === false
          ? 'You\'re on the list — save your referral link below. (Confirmation email could not be sent — check spam or try again in a few minutes.)'
          : 'Check your inbox — we sent your founding perks and referral link.'}
      </p>

      {reservedId ? (
        <div className="confirmation-osid-locked">
          <span className="confirmation-osid-label">Your OS-ID</span>
          <span className="confirmation-osid-value">@{reservedId}</span>
          <span className="confirmation-osid-note">Locked to this email at launch</span>
        </div>
      ) : (
        <p className="confirmation-osid-skipped">No OS-ID reserved — you can claim one when you&apos;re invited.</p>
      )}

      <div className="confirmation-perks">
        <p className="confirmation-perks-title">Locked in at launch</p>
        <ul className="confirmation-perks-list">
          <li><BadgeCheck size={14} /> Complimentary Core tier</li>
          <li><BadgeCheck size={14} /> Pro at ₹49/mo founding rate</li>
          <li><BadgeCheck size={14} /> Elite at ₹79/mo founding rate</li>
        </ul>
      </div>

      <hr className="confirmation-divider" />

      <p className="share-prompt">Share AIIMIN — unlock founding bonuses</p>
      <p className="share-sub">Every friend who joins through your link strengthens your founding package.</p>
      <div className="share-buttons">
        <a
          href={referralCode ? buildWhatsAppShare(referralCode) : 'https://wa.me/?text=https%3A%2F%2Faiimin.in'}
          className="share-btn whatsapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on WhatsApp
        </a>
        <button type="button" className="share-btn copy-link" onClick={copyLink}>
          {copied ? 'Link copied' : 'Copy link'}
        </button>
        <a
          href={referralCode ? buildTwitterShare(referralCode) : 'https://twitter.com/intent/tweet?text=https%3A%2F%2Faiimin.in'}
          className="share-btn twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on X
        </a>
      </div>

      <hr className="confirmation-divider" />

      <div className="while-you-wait">
        <p>While you wait:</p>
        {showFeatureVote && (
          <button
            type="button"
            className="while-you-wait-link"
            onClick={() => setVoteOpen((v) => !v)}
          >
            → Tell us what to build first
          </button>
        )}
        <a
          href="https://twitter.com/aiimin_in"
          className="while-you-wait-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          → Follow development on X
        </a>
      </div>

      {voteOpen && (
        <div className="confirmation-vote-panel">
          <WaitlistQuickFeedback compact />
        </div>
      )}

      {onReset && (
        <button type="button" className="confirmation-reset-link" onClick={onReset}>
          Use a different email
        </button>
      )}
    </div>
  );
}

export default function WaitlistForm({
  compact = false,
  variant = 'default',
  onSuccess,
  showUrgency = true,
  showFeatureVote = true,
}) {
  const formId = useId();
  const firstNameId = `${formId}-first-name`;
  const emailId = `${formId}-email`;
  const osIdId = `${formId}-os-id`;
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [osId, setOsId] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const referredBy = useMemo(() => captureReferralFromUrl(), []);
  const osIdSuggestion = useMemo(() => suggestOsIdFromName(firstName), [firstName]);
  const osIdPreview = osId.trim().toUpperCase() || osIdSuggestion;

  useEffect(() => {
    const stored = readStoredSignup();
    if (stored?.signedUpAt) {
      setConfirmation(stored);
      setStatus('returning');
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const sanitized = email.trim().toLowerCase();
    const nameVal = firstName.trim();

    if (!EMAIL_RE.test(sanitized)) {
      setErrorMsg('Enter a valid email');
      setStatus('error');
      return;
    }

    const osIdVal = osId.trim().toUpperCase();
    if (osIdVal) {
      const osIdErr = validateOsId(osIdVal);
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
      if (osIdVal) payload.reserved_username = osIdVal;
      if (referredBy) payload.referred_by = referredBy;

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

      const nextConfirmation = {
        email: sanitized,
        name: nameVal || 'friend',
        referralCode: data.referral_code || '',
        referralCount: data.referral_count ?? 0,
        reservedId: data.reserved_username || '',
        confirmationEmailSent: data.confirmation_email_sent !== false,
      };

      if (data.already_registered) {
        setConfirmation({
          ...nextConfirmation,
          name: nameVal || nextConfirmation.name,
          referralCode: data.referral_code || nextConfirmation.referralCode,
          reservedId: data.reserved_username || nextConfirmation.reservedId,
        });
        setStatus('already');
      } else {
        setConfirmation(nextConfirmation);
        setStatus('success');
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'waitlist_signup', { email: sanitized });
        }
        onSuccess?.();
      }
      persistSignup(nextConfirmation);
    } catch {
      setErrorMsg('Network error - try again');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const resetSignup = () => {
    clearStoredSignup();
    setConfirmation(null);
    setStatus(null);
    setEmail('');
    setFirstName('');
    setOsId('');
    setErrorMsg('');
    setEmailTouched(false);
  };

  if ((status === 'success' || status === 'already' || status === 'returning') && confirmation) {
    if (status === 'already') {
      return (
        <div className={`waitlist-form-message ${compact ? 'waitlist-form-message-compact' : ''}`}>
          <p className="waitlist-form-success-title">
            <CheckCircle2 size={16} />
            Welcome back — you&apos;re already on the list.
          </p>
          <ConfirmationPanel
            firstName={confirmation.name}
            email={confirmation.email}
            referralCode={confirmation.referralCode}
            reservedId={confirmation.reservedId}
            confirmationEmailSent={confirmation.confirmationEmailSent}
            compact={compact}
            showFeatureVote={showFeatureVote}
            onReset={resetSignup}
          />
        </div>
      );
    }
    return (
      <ConfirmationPanel
        firstName={confirmation.name}
        email={confirmation.email}
        referralCode={confirmation.referralCode}
        reservedId={confirmation.reservedId}
        confirmationEmailSent={confirmation.confirmationEmailSent}
        compact={compact}
        showFeatureVote={showFeatureVote}
        onReset={resetSignup}
      />
    );
  }

  const emailHasError = emailTouched && !EMAIL_RE.test(email.trim().toLowerCase());

  return (
    <form onSubmit={submit} className={`waitlist-form ${compact ? 'waitlist-form-compact' : ''} ${variant === 'hero' ? 'waitlist-form-hero' : ''}`}>
      {variant === 'hero' && !compact && (
        <div className="waitlist-form-hero-head">
          <span className="waitlist-form-badge">Launching Sept 2026</span>
          <h2 className="waitlist-form-heading">Join the waitlist</h2>
          <p className="waitlist-form-lead">
            Founding member perks at launch — complimentary Core, Pro at ₹49/mo, Elite at ₹79/mo.
          </p>
        </div>
      )}
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
            placeholder="you@example.com"
            required
            className={`waitlist-input ${emailHasError ? 'waitlist-input-error' : ''}`}
            aria-label="Email address"
          />
        </div>
      </div>

      <div className="waitlist-field waitlist-field-osid">
        <label htmlFor={osIdId} className="waitlist-label waitlist-label-osid">
          OS-ID <span className="waitlist-label-optional">optional · exclusive</span>
        </label>
        <div className="waitlist-osid-row">
          <span className="waitlist-osid-prefix" aria-hidden="true">@</span>
          <input
            id={osIdId}
            type="text"
            value={osId}
            onChange={(e) => {
              setOsId(e.target.value.toUpperCase().replace(/[^A-Z0-9@,._\-=+*^$#!]/g, '').slice(0, 8));
              if (status) setStatus(null);
            }}
            placeholder={osIdSuggestion}
            maxLength={8}
            className="waitlist-input waitlist-input-id waitlist-input-osid"
            aria-label="OS-ID handle (optional)"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <p className="waitlist-osid-preview">
          Preview: <strong>@{osIdPreview}</strong>
          <span className="waitlist-osid-preview-meta"> · 8 chars · max 4 digits</span>
        </p>
      </div>

      <button type="submit" disabled={loading} className="waitlist-submit-btn">
        <Sparkles size={14} />
        {loading ? 'Joining...' : 'Join the waitlist'}
      </button>

      {showUrgency && (
        <p className="urgency-line">
          ⏰ Tester registration closes <strong>31 July</strong> · Waitlist stays open until launch
        </p>
      )}

      {!compact && (
        <p className="waitlist-form-note">
          No spam. Unsubscribe anytime. Waitlist members unlock the best launch package at go-live.
        </p>
      )}

      {emailHasError && <p className="waitlist-form-error">Enter a valid email address.</p>}
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
