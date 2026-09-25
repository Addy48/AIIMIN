import React, { useState } from 'react';
import {
  Compass,
  ChartBar,
  Wallet,
  Lightning,
  ShieldCheck,
  CheckCircle,
  Sparkle,
  Flame,
  ArrowsClockwise,
  SquaresFour,
  Eye,
  SlidersHorizontal,
} from '@phosphor-icons/react';

const WEEK_BARS = [
  { h: 72, d: 'M', active: false },
  { h: 88, d: 'T', active: false },
  { h: 68, d: 'W', active: false },
  { h: 94, d: 'T', active: false },
  { h: 82, d: 'F', active: false },
  { h: 88, d: 'S', active: false },
  { h: 92, d: 'S', active: true },
];

const DIMENSIONS = [
  { name: 'BODY', pct: 88, color: '#10b981', note: 'Gym · 7.4h Sleep' },
  { name: 'MIND', pct: 82, color: '#749dc4', note: '3.5h Deep Code' },
  { name: 'DISCIPLINE', pct: 90, color: '#ff6b35', note: '3/3 Minimums' },
  { name: 'MONEY', pct: 78, color: '#38bdf8', note: '59% Savings' },
  { name: 'MOOD', pct: 84, color: '#a78bfa', note: 'High Agency' },
];

export default function HeroPreviewMock() {
  const [viewMode, setViewMode] = useState('image'); // 'image' | 'interactive'
  const [activeHotspot, setActiveHotspot] = useState('score');

  return (
    <div className="waitlist-hero-preview" style={{ width: '100%', marginTop: '16px' }}>
      <div
        className="hero-mock-dashboard"
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '0 28px 70px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.06)',
          background: '#14161b',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Chrome Top Header Bar */}
        <div
          style={{
            height: '38px',
            background: '#0f1115',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          {/* Traffic Lights & Pro Tier Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#ff6b35',
                  background: 'rgba(255, 107, 53, 0.12)',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                PRO TIER PREVIEW
              </span>
              <span style={{ fontSize: '10.5px', color: '#cbd5e1', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                5D Command Center
              </span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '2px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <button
              type="button"
              onClick={() => setViewMode('image')}
              style={{
                fontSize: '9.5px',
                fontWeight: 700,
                color: viewMode === 'image' ? '#fff' : '#94a3b8',
                background: viewMode === 'image' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                border: 'none',
                padding: '2px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Eye size={11} weight="bold" /> High-Res View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('interactive')}
              style={{
                fontSize: '9.5px',
                fontWeight: 700,
                color: viewMode === 'interactive' ? '#fff' : '#94a3b8',
                background: viewMode === 'interactive' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                border: 'none',
                padding: '2px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <SlidersHorizontal size={11} weight="bold" /> Interactive Deck
            </button>
          </div>

          {/* Realtime Live Sync Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '9.5px',
              color: '#10b981',
              fontWeight: 700,
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '2px 8px',
              borderRadius: '99px',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981',
                display: 'inline-block',
              }}
            />
            <span>0ms SYNC · LHS 84</span>
          </div>
        </div>

        {/* View Content */}
        {viewMode === 'image' ? (
          /* High-Res Hero Image View */
          <div style={{ position: 'relative', background: '#101216', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <img
                src="/images/aiimin_dashboard_hero.png"
                alt="AIIMIN Desktop Life OS Command Center - 5D Life Score, Focus Sprint, and Habits Checklist"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                }}
                loading="eager"
              />
            </div>

            {/* Micro Feature Highlights Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                padding: '10px 14px',
                background: '#0d0f13',
                borderTop: '1px solid rgba(255, 255, 255, 0.07)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff6b35', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#f8fafc' }}>5D Life Score (84)</span>
                  <span style={{ fontSize: '8px', color: '#94a3b8' }}>Body · Mind · Discipline · Money · Mood</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#f8fafc' }}>Focus Sprint (38m)</span>
                  <span style={{ fontSize: '8px', color: '#94a3b8' }}>Real-time velocity & distraction shield</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#749dc4', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#f8fafc' }}>Daily Verified Minimums</span>
                  <span style={{ fontSize: '8px', color: '#94a3b8' }}>3/3 actions · morning gym & deep code</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#f8fafc' }}>7-Day Consistency</span>
                  <span style={{ fontSize: '8px', color: '#94a3b8' }}>Offline SQLite · zero merge conflicts</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Interactive Deck Mode */
          <div style={{ display: 'flex' }}>
            {/* Sidebar Rail */}
            <div
              style={{
                width: '42px',
                background: '#111317',
                borderRight: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 0',
                gap: '14px',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  background: '#ff6b35',
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 2px 10px rgba(255, 107, 53, 0.5)',
                }}
              >
                <Compass size={14} weight="bold" />
              </div>
              <div style={{ color: '#64748b' }}><ChartBar size={15} /></div>
              <div style={{ color: '#64748b' }}><Wallet size={15} /></div>
              <div style={{ color: '#64748b' }}><Lightning size={15} /></div>
              <div style={{ color: '#64748b' }}><ShieldCheck size={15} /></div>
            </div>

            {/* Main View Area */}
            <div style={{ flex: 1, padding: '14px 16px', background: '#16181c', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Header Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#749dc4' }}>
                    TODAY COMMAND CENTER
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', marginTop: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Optimal Rhythm · 88% Depth</span>
                    <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.12)', padding: '1px 6px', borderRadius: '4px' }}>
                      +14.2% MoM
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.14)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#10b981',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '99px',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle size={12} weight="fill" /> 3/3 MINIMUMS DONE
                </div>
              </div>

              {/* 5D Dimensions Micro-Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '5px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                {DIMENSIONS.map((dim) => (
                  <div
                    key={dim.name}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      padding: '3px 6px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '8px', fontWeight: 800, color: dim.color }}>{dim.name}</span>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: '#f8fafc' }}>{dim.pct}%</span>
                    </div>
                    <div style={{ height: '3px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${dim.pct}%`, background: dim.color, borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* 3 KPI Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div style={{ background: '#1c1f26', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '9px 11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>84</div>
                    <Sparkle size={13} weight="fill" color="#10b981" />
                  </div>
                  <div style={{ fontSize: '8.5px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.04em' }}>
                    5D LIFE SCORE
                  </div>
                </div>
                <div style={{ background: '#1c1f26', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '9px 11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#f8fafc', lineHeight: 1 }}>7.4h</div>
                    <span style={{ fontSize: '9px', color: '#10b981', fontWeight: 700 }}>92%</span>
                  </div>
                  <div style={{ fontSize: '8.5px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.04em' }}>
                    RESTFUL SLEEP
                  </div>
                </div>
                <div style={{ background: '#1c1f26', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '9px 11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#ff6b35', lineHeight: 1 }}>3.5h</div>
                    <Flame size={13} weight="fill" color="#ff6b35" />
                  </div>
                  <div style={{ fontSize: '8.5px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.04em' }}>
                    DEEP FOCUS
                  </div>
                </div>
              </div>

              {/* Split Row: Verified Loops + Mini 7-Day Consistency Chart */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '8px' }}>
                {/* Daily Loops */}
                <div style={{ background: '#1c1f26', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div style={{ fontSize: '8.5px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    DAILY VERIFIED LOOPS
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10.5px', color: '#f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={13} weight="fill" color="#10b981" />
                      <span>Morning Gym Minimum</span>
                    </div>
                    <span style={{ fontSize: '8px', fontWeight: 700, color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', padding: '1px 5px', borderRadius: '3px' }}>06:30</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10.5px', color: '#f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={13} weight="fill" color="#10b981" />
                      <span>Deep System Architecture</span>
                    </div>
                    <span style={{ fontSize: '8px', fontWeight: 700, color: '#749dc4', background: 'rgba(116, 157, 196, 0.12)', padding: '1px 5px', borderRadius: '3px' }}>10:15</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10.5px', color: '#f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={13} weight="fill" color="#38bdf8" />
                      <span>₹420 Lent Rahul (Linked)</span>
                    </div>
                    <span style={{ fontSize: '8px', fontWeight: 700, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '1px 5px', borderRadius: '3px' }}>PEER</span>
                  </div>
                </div>

                {/* 7-Day Consistency Bars */}
                <div style={{ background: '#1c1f26', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                      7-DAY RHYTHM
                    </span>
                    <span style={{ fontSize: '8px', color: '#10b981', fontWeight: 700 }}>Optimal</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', height: '36px', gap: '4px', paddingTop: '2px' }}>
                    {WEEK_BARS.map((bar, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', height: '100%', justifyContent: 'flex-end' }}>
                        <div
                          style={{
                            width: '100%',
                            height: `${bar.h}%`,
                            background: bar.active ? '#ff6b35' : '#10b981',
                            borderRadius: '2px',
                            boxShadow: bar.active ? '0 0 8px rgba(255, 107, 53, 0.6)' : 'none',
                          }}
                        />
                        <span style={{ fontSize: '7.5px', color: bar.active ? '#ff6b35' : '#64748b', fontWeight: 800 }}>{bar.d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Subsystem Status Line */}
        <div
          style={{
            height: '26px',
            background: '#0d0e12',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            fontSize: '9.5px',
            color: '#94a3b8',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={12} color="#ff6b35" weight="fill" /> 21-day uninterrupted daily loop
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
            <ShieldCheck size={12} color="#10b981" weight="fill" /> StrongBox TEE · 100% Offline SQLite
          </span>
        </div>
      </div>

      <p className="preview-caption" style={{ marginTop: '10px', textAlign: 'center', fontSize: '11.5px', color: 'var(--color-text-3)', lineHeight: '1.5' }}>
        AIIMIN Desktop Command Center · <strong>Pro tier preview</strong> showing 5D Life Score & correlation insights (Explore tier includes Today board, daily minimums & private journal from ₹0).
      </p>
    </div>
  );
}

