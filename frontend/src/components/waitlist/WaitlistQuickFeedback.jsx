import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, Send, Sparkles } from 'lucide-react';
import Wordmark from '../brand/Wordmark';
import { useAuth } from '../../hooks/useAuth';
import { API_URL } from '../../utils/api';
import '../../styles/waitlistLanding.css';

const SENTIMENTS = [
  { id: 'love', label: 'Love it', tone: 'positive' },
  { id: 'curious', label: 'Curious', tone: 'info' },
  { id: 'feature', label: 'Feature idea', tone: 'warning' },
];

const FEATURE_AREAS = [
  'Habits & streaks',
  'Money tracking',
  'Focus & Pomodoro',
  'Sleep analytics',
  'Sports briefing',
  'Weekly reviews',
];

const PROMPT_STARTERS = [
  'One dashboard for gym, sleep, and study streaks',
  'Student-friendly money tracking with monthly caps',
  'Cricket + F1 context without opening 5 apps',
  'A weekly life score that tells me what to fix next',
];

export default function WaitlistQuickFeedback({ compact = false }) {
  const [sentiment, setSentiment] = useState('curious');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedArea, setSelectedArea] = useState('');
  const [usedStarters, setUsedStarters] = useState([]);

  const appendStarter = (text) => {
    setMessage((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return `${text}.`;
      if (trimmed.includes(text)) return prev;
      return `${trimmed}\n\nAlso: ${text.toLowerCase()}.`;
    });
    setUsedStarters((prev) => (prev.includes(text) ? prev : [...prev, text]));
    setStatus(null);
  };

  const submit = async (e) => {
    e?.preventDefault();
    if (!message.trim() && !email.trim()) return;
    setLoading(true);
    setStatus(null);
    try {
      const composed = selectedArea && message.trim()
        ? `[${selectedArea}] ${message.trim()}`
        : message.trim();

      const res = await fetch(`${API_URL}/waitlist/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentiment,
          message: composed,
          email: email.trim() || undefined,
          source: 'landing_quick',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus('success');
      setMessage('');
      setSelectedArea('');
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="waitlist-feedback-success-card">
        <Sparkles size={18} />
        <p>Got it — your note is in the launch queue.</p>
        <small>We read every response and rank features by waitlist demand.</small>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`waitlist-feedback-form ${compact ? 'waitlist-feedback-form-compact' : ''}`}>
      {!compact && (
        <div className="waitlist-feedback-priority">
          <Lightbulb size={15} />
          <span>Top requests right now: habits, money clarity, and weekly pattern insights.</span>
        </div>
      )}

      <p className="waitlist-feedback-hint">
        Pick a vibe, write freely — or tap an idea starter below to add to your note (edit anything).
      </p>

      <div className="waitlist-feedback-sentiments">
        {SENTIMENTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSentiment(s.id)}
            className={`waitlist-feedback-chip ${sentiment === s.id ? `waitlist-feedback-chip-active waitlist-feedback-chip-${s.tone}` : ''}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {!compact && (
        <div className="waitlist-feedback-areas">
          {FEATURE_AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setSelectedArea((prev) => (prev === area ? '' : area))}
              className={`waitlist-feedback-area ${selectedArea === area ? 'waitlist-feedback-area-active' : ''}`}
            >
              {area}
            </button>
          ))}
        </div>
      )}

      {!compact && (
        <div className="waitlist-feedback-suggestions">
          <p className="waitlist-feedback-starter-label">Idea starters — tap to add, not replace</p>
          {PROMPT_STARTERS.map((starter) => (
            <button
              key={starter}
              type="button"
              className={`waitlist-feedback-suggestion ${usedStarters.includes(starter) ? 'waitlist-feedback-suggestion-used' : ''}`}
              onClick={() => appendStarter(starter)}
            >
              + {starter}
            </button>
          ))}
        </div>
      )}

      <div className="waitlist-field">
        <label htmlFor="waitlist-feedback-message" className="waitlist-label">
          Your idea <span>(optional but powerful)</span>
        </label>
        <textarea
          id="waitlist-feedback-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write anything — habits, money, focus, sports, whatever you need from your life OS."
          maxLength={280}
          rows={compact ? 2 : 3}
          className="waitlist-textarea"
        />
        <p className="waitlist-field-hint">{message.length}/280 characters</p>
      </div>

      {!compact && (
        <div className="waitlist-field">
          <label htmlFor="waitlist-feedback-email" className="waitlist-label">
            Email <span>(optional — for follow-up)</span>
          </label>
          <input
            id="waitlist-feedback-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="meera.iyer@mail.com"
            className="waitlist-input"
          />
        </div>
      )}

      <div className="waitlist-feedback-cta">
        <button
          type="submit"
          disabled={loading || (!message.trim() && !email.trim())}
          className="waitlist-submit-btn"
        >
          <Send size={14} />
          {loading ? 'Sending...' : 'Send to launch team'}
        </button>
      </div>

      {!compact && (
        <p className="waitlist-feedback-footnote">
          Your note helps decide which modules ship first in August and September waves.
        </p>
      )}

      {status === 'error' && (
        <p className="waitlist-feedback-error">Try again in a moment.</p>
      )}
    </form>
  );
}

/** Full-screen for signed-in users without access */
export function WaitlistPendingScreen() {
  const { user, signOut } = useAuth();

  return (
    <div className="waitlist-pending-screen">
      <div className="waitlist-pending-logo">
        <Wordmark />
      </div>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="waitlist-pending-title"
      >
        You're on the waitlist
      </motion.h1>
      <p className="waitlist-pending-copy">
        Signed in as <strong>{user?.email}</strong>.
        We're letting in testers in small waves before end-of-September launch.
      </p>
      <p className="waitlist-pending-note">
        Got an invite? Register by 31 July for the VIP tester package — Elite free for a year plus full beta access. Waitlist members get the founding kit, Core subscription, and Elite discount at launch.
      </p>
      <div className="waitlist-pending-feedback">
        <WaitlistQuickFeedback compact />
      </div>
      <div className="waitlist-pending-links">
        <Link to="/" className="waitlist-pending-link">← Back to landing</Link>
        <button
          type="button"
          onClick={() => signOut?.()}
          className="waitlist-pending-signout"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
