import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

/**
 * DashboardLayout — Authenticated shell.
 * Compact nav + clean Vercel-style content area.
 * Shows an amber guest-mode banner when user.isGuest === true.
 */
const DashboardLayout = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-base)',
      paddingTop: 'var(--nav-height)',
      color: 'var(--color-text-1)',
    }}>
      <Navbar user={user} />

      {/* ── Guest mode banner ── */}
      {user?.isGuest && (
        <div style={{
          position: 'fixed',
          top: 'var(--nav-height)',
          left: 0,
          right: 0,
          zIndex: 900,
          background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
          color: '#1c1505',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'var(--font-sans)',
          textAlign: 'center',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
        }}>
          <span>👋 You're in guest mode — data is not saved.</span>
          <button
            onClick={() => navigate('/login', { state: { mode: 'signup' } })}
            style={{
              background: 'rgba(0,0,0,0.12)',
              border: 'none',
              borderRadius: '6px',
              padding: '3px 10px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              color: '#1c1505',
              fontFamily: 'var(--font-sans)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Sign up free →
          </button>
        </div>
      )}

      <main style={{
        maxWidth: 'var(--content-max)',
        margin: '0 auto',
        padding: user?.isGuest
          ? 'calc(40px + 38px) var(--content-pad) 80px'
          : '40px var(--content-pad) 80px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - var(--nav-height))',
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
