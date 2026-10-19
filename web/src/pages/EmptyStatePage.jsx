import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkle, ArrowLeft, Tray, ListChecks, Wallet, Compass } from '@phosphor-icons/react';
import SEO from '../components/common/SEO';
import Wordmark from '../components/brand/Wordmark';

const PREVIEW_SUBSYSTEMS = [
  { id: 'general', label: 'Command Matrix', icon: Compass, title: 'No Signals in Buffer', desc: 'The active processing queue is completely clear. No pending items, notifications, or unresolved triggers.' },
  { id: 'habits', label: 'Habit Engine', icon: ListChecks, title: 'Zero Habits Configured', desc: 'No recursive execution loops found for today. Define your core non-negotiable rituals in the command center.' },
  { id: 'finance', label: 'Money Protocol', icon: Wallet, title: 'Clean Ledger', desc: 'No transactions logged in the active billing window. Connect your accounts or log manual cash transactions.' },
  { id: 'inbox', label: 'Capture Queue', icon: Tray, title: 'Inbox Zero Maintained', desc: 'All incoming notes, quick captures, and voice memos have been processed and filed into permanent knowledge.' },
];

export default function EmptyStatePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const current = PREVIEW_SUBSYSTEMS.find((s) => s.id === activeTab) || PREVIEW_SUBSYSTEMS[0];
  const Icon = current.icon;

  return (
    <div className="empty-state-page" style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#f4f4f6',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 'clamp(20px, 4vw, 40px)',
      fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
      boxSizing: 'border-box',
    }}>
      <SEO
        title="Empty State Protocol — AIIMIN Life OS"
        description="Clean slate empty state preview for the AIIMIN Life OS command center."
        canonicalPath="/empty"
        noIndex={true}
      />

      {/* Top Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        paddingBottom: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} aria-label="AIIMIN Home">
          <Wordmark size={22} color="#f4f4f6" />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '4px 10px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#a1a1aa',
          }}>
            State: Idle / Buffer Empty
          </span>
          <Link
            to="/login"
            style={{
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#ff6b35',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 107, 53, 0.3)',
              background: 'rgba(255, 107, 53, 0.08)',
            }}
          >
            Tester Sign in →
          </Link>
        </div>
      </header>

      {/* Main Empty State Content */}
      <main style={{
        maxWidth: '680px',
        width: '100%',
        margin: 'auto',
        textAlign: 'center',
        padding: '48px 16px',
      }}>
        {/* Subsystem Tabs */}
        <div style={{
          display: 'inline-flex',
          gap: '6px',
          padding: '4px',
          background: '#08090c',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '36px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {PREVIEW_SUBSYSTEMS.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => setActiveTab(sub.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '7px',
                border: 'none',
                background: activeTab === sub.id ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                color: activeTab === sub.id ? '#ffffff' : '#71717a',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {/* Big Clean Graphic Icon */}
        <div style={{
          width: '84px',
          height: '84px',
          margin: '0 auto 24px',
          borderRadius: '20px',
          background: 'radial-gradient(circle at center, rgba(255, 107, 53, 0.15) 0%, rgba(8, 9, 12, 0.8) 100%)',
          border: '1px solid rgba(255, 107, 53, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 32px rgba(255, 107, 53, 0.08)',
        }}>
          <Icon size={40} weight="duotone" color="#ff6b35" />
        </div>

        {/* Status Tag */}
        <div style={{
          display: 'inline-block',
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#ff6b35',
          background: 'rgba(255, 107, 53, 0.08)',
          border: '1px solid rgba(255, 107, 53, 0.25)',
          padding: '4px 12px',
          borderRadius: '4px',
          marginBottom: '16px',
        }}>
          SYS_EMPTY_STATE // {current.id.toUpperCase()}
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 4vw, 36px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: '#ffffff',
          margin: '0 0 12px',
        }}>
          {current.title}
        </h1>

        <p style={{
          fontSize: '15px',
          lineHeight: 1.6,
          color: '#a1a1aa',
          margin: '0 auto 32px',
          maxWidth: '480px',
        }}>
          {current.desc}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/#waitlist-join"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#ff6b35',
              color: '#000000',
              fontWeight: 700,
              fontSize: '13.5px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'transform 0.15s ease, background 0.15s ease',
            }}
          >
            <Sparkle size={16} weight="fill" />
            Join the Waitlist
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: '#0a0c10',
              color: '#f4f4f6',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontWeight: 600,
              fontSize: '13.5px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} weight="bold" />
            Go Back
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12.5px',
        color: '#71717a',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <span>AIIMIN Personal Life OS · Clean Slate Architecture</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Home</Link>
          <Link to="/app" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Android</Link>
          <Link to="/contact" style={{ color: '#a1a1aa', textDecoration: 'none' }}>Contact</Link>
        </div>
      </footer>
    </div>
  );
}
