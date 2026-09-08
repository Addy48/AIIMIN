import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { useAuth } from '../hooks/useAuth';

export default function NotFound() {
  const navigate = useNavigate();
  const { session } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#f4f4f6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(24px, 4vw, 48px)',
        textAlign: 'center',
        fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
      }}
    >
      <SEO
        title="404 — Surface Not Found | AIIMIN"
        description="The requested surface does not exist in the AIIMIN Life OS matrix."
        canonicalPath="/404"
        noIndex={true}
      />

      <div
        style={{
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#ff6b35',
          backgroundColor: 'rgba(255, 107, 53, 0.08)',
          border: '1px solid rgba(255, 107, 53, 0.25)',
          padding: '4px 12px',
          borderRadius: '4px',
          marginBottom: '20px',
        }}
      >
        ERR_404_SURFACE_NOT_FOUND
      </div>

      <h1
        style={{
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: '#ffffff',
          margin: '0 0 12px 0',
          lineHeight: 1.15,
        }}
      >
        Surface Not Found
      </h1>

      <p
        style={{
          fontSize: '15px',
          lineHeight: 1.6,
          color: '#a1a1aa',
          maxWidth: '460px',
          margin: '0 0 32px 0',
        }}
      >
        The coordinate you requested does not exist in this Life OS matrix. Check the URL for typographical errors or navigate back to the command center.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to={session ? '/overview' : '/'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '11px 22px',
            backgroundColor: '#ff6b35',
            color: '#000000',
            fontWeight: 700,
            fontSize: '13px',
            borderRadius: '6px',
            textDecoration: 'none',
            transition: 'opacity 0.15s ease',
          }}
        >
          {session ? 'Back to Dashboard' : 'Return to Home'}
        </Link>

        <Link
          to="/#waitlist-join"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '11px 20px',
            backgroundColor: '#08090c',
            color: '#f4f4f6',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            fontWeight: 600,
            fontSize: '13px',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          Join Waitlist
        </Link>

        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '11px 20px',
            backgroundColor: '#08090c',
            color: '#71717a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontWeight: 600,
            fontSize: '13px',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Step Back
        </button>
      </div>
    </div>
  );
}
