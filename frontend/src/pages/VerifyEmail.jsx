import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemedMark from '../components/brand/ThemedMark';
import Wordmark from '../components/brand/Wordmark';

export default function VerifyEmail() {
  const { user, emailVerified, refetchSession, signOut } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--color-base)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 440,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 24,
        padding: '36px 32px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <ThemedMark size={40} />
          <Wordmark size={22} weight={700} />
        </div>
        <div style={{
          width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
          background: 'var(--color-accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Mail size={28} color="var(--color-accent)" />
        </div>
        <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: 'var(--color-text-1)' }}>
          Verify your email
        </h1>
        <p style={{ margin: '0 0 20px', fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-2)' }}>
          We sent a verification link to{' '}
          <strong style={{ color: 'var(--color-text-1)' }}>{user?.email || 'your inbox'}</strong>.
          {' '}Confirm it to save data and use write actions across AIIMIN.
        </p>
        {emailVerified ? (
          <p style={{ color: 'var(--color-success)', fontWeight: 700, marginBottom: 16 }}>Email verified — you can continue.</p>
        ) : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            type="button"
            onClick={() => refetchSession?.()}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px 16px', borderRadius: 12, border: 'none',
              background: 'var(--color-accent)', color: '#fff', fontWeight: 700, cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} /> I verified — refresh
          </button>
          <Link to="/overview" style={{ fontSize: 13, color: 'var(--color-text-2)' }}>Back to overview (read-only)</Link>
          <button type="button" onClick={signOut} style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer', fontSize: 12 }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
