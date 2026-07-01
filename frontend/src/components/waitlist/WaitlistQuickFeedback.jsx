import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Wordmark from '../brand/Wordmark';
import { ShippedPrimaryButton } from '../design/ShippedUI';
import { useAuth } from '../../hooks/useAuth';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const SENTIMENTS = [
  { id: 'love', label: '🔥 Love it', color: '#10b981' },
  { id: 'curious', label: '🤔 Curious', color: '#2563EB' },
  { id: 'feature', label: '💡 Feature idea', color: '#f59e0b' },
];

export default function WaitlistQuickFeedback({ compact = false }) {
  const [sentiment, setSentiment] = useState('curious');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    if (!message.trim() && !email.trim()) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/waitlist/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentiment,
          message: message.trim(),
          email: email.trim() || undefined,
          source: 'landing_quick',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus('success');
      setMessage('');
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <p style={{ fontSize: '14px', color: '#10b981', margin: 0, textAlign: 'center' }}>
        Got it — thank you. We read every note.
      </p>
    );
  }

  return (
    <form onSubmit={submit} style={{ width: '100%', maxWidth: compact ? 420 : 520, margin: '0 auto' }}>
      <p style={{ fontSize: '13px', color: '#6B6B7B', margin: '0 0 12px', textAlign: 'center' }}>
        One tap — tell us what you want from a life OS
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 }}>
        {SENTIMENTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSentiment(s.id)}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: sentiment === s.id ? `1px solid ${s.color}` : '1px solid #323650',
              background: sentiment === s.id ? `${s.color}22` : 'transparent',
              color: sentiment === s.id ? s.color : '#A0A0B0',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Optional: one line on what you'd track…"
        maxLength={280}
        style={inputStyle}
      />
      {!compact && (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (optional — if you want a reply)"
          style={{ ...inputStyle, marginTop: 8 }}
        />
      )}
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <ShippedPrimaryButton
          type="submit"
          loading={loading}
          disabled={loading || (!message.trim() && !email.trim())}
          style={btnStyle}
        >
          Send feedback
        </ShippedPrimaryButton>
      </div>
      {status === 'error' && (
        <p style={{ color: '#EF4444', fontSize: 12, textAlign: 'center', marginTop: 8 }}>Try again in a moment.</p>
      )}
    </form>
  );
}

const inputStyle = {
  width: '100%',
  height: 44,
  padding: '0 16px',
  borderRadius: 12,
  border: '1px solid #323650',
  background: 'rgba(255,255,255,0.04)',
  color: '#EDEDED',
  fontSize: 15,
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const btnStyle = {
  height: 44,
  padding: '0 24px',
  borderRadius: 999,
  border: 'none',
  background: '#2563EB',
  color: '#fff',
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

/** Full-screen for signed-in users without access */
export function WaitlistPendingScreen() {
  const { user, signOut } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-base, #0A0C10)',
      color: '#EDEDED',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      textAlign: 'center',
    }}>
      <Wordmark style={{ marginBottom: 24 }} />
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, marginBottom: 12 }}
      >
        You're on the waitlist
      </motion.h1>
      <p style={{ color: '#A0A0B0', maxWidth: 420, lineHeight: 1.6, marginBottom: 8 }}>
        Signed in as <strong style={{ color: '#EDEDED' }}>{user?.email}</strong>.
        We're letting in testers in small waves before September launch.
      </p>
      <p style={{ color: '#6B6B7B', fontSize: 14, maxWidth: 400, marginBottom: 32 }}>
        Got an invite? It may take a minute after approval. Otherwise — you're in line. Core tier free for 3 months at launch.
      </p>
      <div style={{ width: '100%', maxWidth: 480, marginBottom: 32 }}>
        <WaitlistQuickFeedback compact />
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={{ color: '#2563EB', fontSize: 14, textDecoration: 'none' }}>← Back to landing</Link>
        <button
          type="button"
          onClick={() => signOut?.()}
          style={{ background: 'none', border: 'none', color: '#6B6B7B', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
