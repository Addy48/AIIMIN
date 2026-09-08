import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import TabRail from './TabRail';
import BottomNav from './BottomNav';
import CommandPalette from '../system/CommandPalette';
import ArcGuard from '../system/ArcGuard';
import { useDeviceTier } from '../../hooks/useDeviceTier';
import SEO from '../common/SEO';

const ROUTE_META = {
  '/overview': {
    title: 'Overview · Life Score & Trajectory',
    description: 'Real-time Life Score radar, trajectory projection, daily habits, quick capture, and recent transactions.',
  },
  '/insights': {
    title: 'Behavioral Insights & Correlated Signals',
    description: 'Correlations between sleep, focus duration, habit consistency, and daily mood.',
  },
  '/calendar': {
    title: 'Calendar & Daily Trajectory',
    description: 'Chronological timeline of daily entries, habit streaks, and scheduled events.',
  },
  '/sports': {
    title: 'Sports & Active Telemetry',
    description: 'Match fixtures, active sports tracking, and physical performance logging.',
  },
  '/journal': {
    title: 'Mindset & Daily Reflection',
    description: 'Multi-mode journal with mood rating, reflections, voice notes, and emotional trajectory.',
  },
  '/finance': {
    title: 'Finance & Wealth Telemetry',
    description: 'Net worth tracking, monthly income/expense velocity, and automated transaction ledger.',
  },
  '/settings': {
    title: 'Settings & Data Controls',
    description: 'Manage personal preferences, notifications, theme engine, and data backups.',
  },
  '/lab': {
    title: 'Behavioral Intelligence Lab',
    description: 'Advanced behavioral experimentation, vocal biomarkers, and hypothesis testing.',
  },
  '/placements': {
    title: 'Career & Placement Kanban',
    description: 'Interview pipeline, resume vault, and career opportunity management.',
  },
  '/habits': {
    title: 'Atomic Habits & Consistency',
    description: 'Track daily habits, streak momentum, and weekly completion matrices.',
  },
  '/goals': {
    title: 'Strategic Goals & Milestones',
    description: 'Active, at-risk, and achieved goals with granular milestone tracking.',
  },
  '/identity': {
    title: 'Identity & Core Operating Rules',
    description: 'Personal mission statement, non-negotiable principles, and behavioral guidelines.',
  },
  '/notes': {
    title: 'Notes & Second Brain Archive',
    description: 'Encrypted personal knowledge base, markdown notes, and fast capture cards.',
  },
  '/discipline': {
    title: 'Discipline & Impulse Control',
    description: 'Real-time urge delay timer, trigger taxonomy, and friction tracking.',
  },
  '/focus': {
    title: 'Deep Focus Room',
    description: 'Distraction-free Pomodoro session room with ambient soundscapes.',
  },
  '/family': {
    title: 'Family Vital Records Vault',
    description: 'Secure, encrypted repository for family medical, insurance, and emergency details.',
  },
  '/account': {
    title: 'Account Profile & Membership',
    description: 'Manage subscription tier, OS-ID identifier, and account security credentials.',
  },
  '/reports': {
    title: 'Life Performance Reports',
    description: 'Weekly and monthly comprehensive life telemetry reviews and trend breakdowns.',
  },
};

/**
 * DashboardLayout — Authenticated shell for iPad + desktop Life OS.
 * Phone browsers are redirected to /m (capture-only).
 */
const DashboardLayout = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPhone, isTablet } = useDeviceTier();

  const currentMeta = ROUTE_META[location.pathname] || {
    title: 'Dashboard',
    description: 'AIIMIN personal Life OS dashboard surface.',
  };

  return (
    <div
      className={`dashboard-layout${isTablet ? ' dashboard-layout--rail' : ''}`}
      style={{
      minHeight: '100vh',
      background: 'var(--color-base)',
      paddingTop: 'var(--nav-height)',
      color: 'var(--color-text-1)',
    }}>
      <SEO
        title={currentMeta.title}
        description={currentMeta.description}
        canonicalPath={location.pathname}
        noIndex={true}
      />
      <Navbar user={user} />
      {isTablet && <TabRail />}
      <CommandPalette />

      {/* ── Sleek Guest Mode Floating Banner ── */}
      {user?.isGuest && (
        <div className="guest-banner-wrapper">
          <style>{`
            .guest-banner-wrapper {
              position: fixed;
              bottom: 32px;
              left: 50%;
              transform: translateX(-50%);
              z-index: 900;
              animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .guest-banner {
              background: rgba(10, 10, 10, 0.75);
              backdrop-filter: blur(24px);
              -webkit-backdrop-filter: blur(24px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              color: #F2EBDA;
              font-family: var(--font-sans);
              border-radius: 99px;
              padding: 8px 12px 8px 20px;
              display: flex;
              align-items: center;
              gap: 16px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1);
            }
            .guest-banner-dot {
              width: 8px; height: 8px; border-radius: 50%; background: #F5A623; box-shadow: 0 0 12px #F5A623;
              position: relative;
            }
            .guest-banner-dot::after {
              content: ''; position: absolute; inset: -4px; border-radius: 50%;
              border: 1px solid rgba(245, 166, 35, 0.5); animation: pulseDot 2s infinite;
            }
            .guest-banner-text { letter-spacing: 0.02em; font-size: 14px; font-weight: 600; white-space: nowrap; }
            .guest-banner-divider { width: 1px; height: 18px; background: rgba(255,255,255,0.15); }
            .guest-banner-subtext { color: #A1A1AA; font-size: 13px; font-weight: 400; display: none; white-space: nowrap; }
            @media (min-width: 600px) { .guest-banner-subtext { display: inline; } }
            .guest-banner-btn {
              background: #F2EBDA;
              border: none;
              border-radius: 99px;
              padding: 8px 18px;
              font-size: 13px;
              font-weight: 700;
              cursor: pointer;
              color: #111;
              font-family: var(--font-sans);
              text-decoration: none;
              white-space: nowrap;
              transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
              box-shadow: 0 2px 8px rgba(242, 235, 218, 0.2);
            }
            .guest-banner-btn:hover { transform: scale(1.05) translateY(-1px); background: #ffffff; box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3); }
            @keyframes slideUp { from { transform: translate(-50%, 100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
            @keyframes pulseDot { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
          `}</style>
          <div className="guest-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="guest-banner-dot" />
              <span className="guest-banner-text">Guest Mode</span>
            </div>
            <div className="guest-banner-divider" />
            <span className="guest-banner-subtext">Data will not be saved</span>
            <button
              onClick={() => navigate('/login')}
              className="guest-banner-btn"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      )}

      <main className="dashboard-layout__main" style={{
        width: '100%',
        padding: 'var(--content-pad) var(--content-pad) 120px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - var(--nav-height))',
      }}>
        <ArcGuard>
          <Outlet />
        </ArcGuard>
      </main>

      {!isPhone && <BottomNav />}

    </div>
  );
};

export default DashboardLayout;
