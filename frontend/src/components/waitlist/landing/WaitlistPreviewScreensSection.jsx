import React from 'react';
import {
  CheckCircle,
  Lightning,
  TrendUp,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  Sparkle,
  Wallet,
  Compass,
  ChartBar,
  LockKey,
} from '@phosphor-icons/react';

const WEEK_BARS = [
  { h: 72, d: 'M', active: false },
  { h: 88, d: 'T', active: false },
  { h: 64, d: 'W', active: false },
  { h: 94, d: 'T', active: false },
  { h: 82, d: 'F', active: false },
  { h: 88, d: 'S', active: false },
  { h: 92, d: 'S', active: true },
];

const DIMENSIONS = [
  { name: 'BODY', pct: 88, color: '#10b981', note: 'Gym · 7.4h Sleep' },
  { name: 'MIND', pct: 82, color: '#749dc4', note: '3.5h Deep Focus' },
  { name: 'DISCIPLINE', pct: 90, color: '#ff6b35', note: '3/3 Minimums' },
  { name: 'MONEY', pct: 78, color: '#38bdf8', note: '59% Savings Rate' },
  { name: 'MOOD', pct: 84, color: '#a78bfa', note: 'High Agency' },
];

export default function WaitlistPreviewScreensSection() {
  return (
    <section className="waitlist-section waitlist-section-alt waitlist-screens-section" id="screens">
      <p className="waitlist-section-label">Command surfaces</p>
      <h2>High-density surfaces — zero decorative noise</h2>
      <p className="waitlist-section-copy">
        Explore the primary operating layers: immediate daily execution, multi-dimensional score intelligence, and linked financial provenance.
      </p>

      <div className="waitlist-grid waitlist-grid-3" style={{ gap: '24px', alignItems: 'stretch' }}>
        {/* ── CARD 1: DAILY EXECUTION BOARD ── */}
        <article
          className="waitlist-card waitlist-screen-card"
          style={{
            padding: '0',
            overflow: 'hidden',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 48px rgba(0,0,0,0.4)',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
          }}
        >
          {/* Surface Mock Window */}
          <div style={{ background: '#14161a', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Top Chrome Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ff5f56' }} />
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ffbd2e' }} />
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#27c93f' }} />
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8', marginLeft: '6px', letterSpacing: '0.04em' }}>
                  today_loop.sqlite · AES-256
                </span>
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.14)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle size={12} weight="fill" /> 3/3 MINIMUMS
              </span>
            </div>

            {/* Live Focus Sprint Banner */}
            <div
              style={{
                background: 'rgba(255, 107, 53, 0.08)',
                border: '1px solid rgba(255, 107, 53, 0.25)',
                borderRadius: '8px',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Flame size={15} weight="fill" color="#ff6b35" />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#f8fafc' }}>
                    Focus Sprint: Monorepo Zero-Lag
                  </div>
                  <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                    38:20 / 45:00 · 88% Flow Velocity
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '9px', fontWeight: 800, color: '#ff6b35', background: 'rgba(255, 107, 53, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                ACTIVE
              </span>
            </div>

            {/* Depth & Score Pill */}
            <div
              style={{
                background: '#1c1f26',
                borderRadius: '10px',
                padding: '10px 12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Daily Depth
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', marginTop: '1px' }}>
                  88% <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>Optimal Rhythm</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '28px' }}>
                {WEEK_BARS.map((bar, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div
                      style={{
                        width: '6px',
                        height: `${Math.round(bar.h * 0.28)}px`,
                        borderRadius: '2px',
                        background: bar.active ? '#ff6b35' : '#10b981',
                        boxShadow: bar.active ? '0 0 6px rgba(255, 107, 53, 0.6)' : 'none',
                      }}
                    />
                    <span style={{ fontSize: '7.5px', color: bar.active ? '#ff6b35' : '#64748b', fontWeight: 800 }}>{bar.d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Execution Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { title: 'Morning Gym Minimum', meta: '45m Strength Session', tag: 'BODY', time: '06:30' },
                { title: 'Deep Focus Architecture', meta: '3h 15m System Code', tag: 'MIND', time: '10:15' },
                { title: 'Evening Debrief & Ledger', meta: 'Reconciled & Synced', tag: 'DISCIPLINE', time: '21:00' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 9px',
                    borderRadius: '7px',
                    background: '#1c1f26',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={15} weight="fill" color="#10b981" />
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#f8fafc' }}>{item.title}</div>
                      <div style={{ fontSize: '9px', color: '#94a3b8' }}>{item.meta}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '8.5px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{item.time}</span>
                    <span
                      style={{
                        fontSize: '8px',
                        fontWeight: 800,
                        color: item.tag === 'BODY' ? '#10b981' : item.tag === 'MIND' ? '#749dc4' : '#ff6b35',
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '2px 5px',
                        borderRadius: '4px',
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Streak Counter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2px' }}>
              <span style={{ fontSize: '9.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Flame size={12} weight="fill" color="#ff6b35" /> 21-day uninterrupted loop
              </span>
              <span style={{ fontSize: '9.5px', color: '#10b981', fontWeight: 700 }}>0 sync conflicts</span>
            </div>
          </div>

          {/* Card Caption */}
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-text-1)' }}>
              Daily Execution Board
            </h3>
            <p style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--color-text-2)', margin: 0 }}>
              Single-pane execution: morning gym, deep focus sprints, habit minimums, and evening debriefs converge without app-switching.
            </p>
          </div>
        </article>

        {/* ── CARD 2: 5D LIFE SCORE & CORRELATION LAB ── */}
        <article
          className="waitlist-card waitlist-screen-card"
          style={{
            padding: '0',
            overflow: 'hidden',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 48px rgba(0,0,0,0.4)',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
          }}
        >
          {/* Surface Mock Window */}
          <div style={{ background: '#14161a', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Top Chrome Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ff5f56' }} />
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ffbd2e' }} />
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#27c93f' }} />
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8', marginLeft: '6px', letterSpacing: '0.04em' }}>
                  5D_CORRELATION_ENGINE.v3
                </span>
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#749dc4',
                  background: 'rgba(116, 157, 196, 0.14)',
                  border: '1px solid rgba(116, 157, 196, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Lightning size={12} weight="fill" /> LHS v3.0 LIVE
              </span>
            </div>

            {/* Big Score Header */}
            <div
              style={{
                background: '#1c1f26',
                borderRadius: '10px',
                padding: '10px 12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  5D System Life Score
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', marginTop: '1px' }}>
                  84 <span style={{ fontSize: '11px', color: '#64748b' }}>/ 100</span>{' '}
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>+19% MoM</span>
                </div>
              </div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '3px solid #ff6b35',
                  borderTopColor: '#10b981',
                  borderRightColor: '#38bdf8',
                  borderBottomColor: '#a78bfa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11.5px',
                  fontWeight: 900,
                  color: '#f8fafc',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
                }}
              >
                84
              </div>
            </div>

            {/* 5D Dimension Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {DIMENSIONS.map((dim) => (
                <div key={dim.name} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span style={{ fontWeight: 800, color: dim.color }}>{dim.name}</span>
                    <span style={{ color: '#94a3b8', fontSize: '9px' }}>{dim.note} · <strong style={{ color: '#f8fafc' }}>{dim.pct}%</strong></span>
                  </div>
                  <div style={{ height: '4px', width: '100%', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${dim.pct}%`, background: dim.color, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Correlation Callout */}
            <div
              style={{
                fontSize: '9.5px',
                color: '#cbd5e1',
                background: 'rgba(255, 107, 53, 0.08)',
                border: '1px solid rgba(255, 107, 53, 0.25)',
                padding: '6px 9px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                lineHeight: '1.4',
              }}
            >
              <Sparkle size={13} weight="fill" color="#ff6b35" style={{ flexShrink: 0 }} />
              <span>
                <strong>Insight (r=+0.78):</strong> Morning gym &gt; 40m correlates with <strong>+38% deep focus</strong> and zero afternoon fatigue.
              </span>
            </div>
          </div>

          {/* Card Caption */}
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-text-1)' }}>
              5D Life Score & Correlation Lab
            </h3>
            <p style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--color-text-2)', margin: 0 }}>
              Server-side intelligence model across Body, Mind, Discipline, Money, and Mood that proves which habits directly drive peak output.
            </p>
          </div>
        </article>

        {/* ── CARD 3: MONEY OS & OPEN LOOPS ── */}
        <article
          className="waitlist-card waitlist-screen-card"
          style={{
            padding: '0',
            overflow: 'hidden',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 48px rgba(0,0,0,0.4)',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
          }}
        >
          {/* Surface Mock Window */}
          <div style={{ background: '#14161a', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Top Chrome Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ff5f56' }} />
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ffbd2e' }} />
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#27c93f' }} />
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8', marginLeft: '6px', letterSpacing: '0.04em' }}>
                  money_os_ledger.graph
                </span>
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.14)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ShieldCheck size={12} weight="fill" /> 100% PROVENANCE
              </span>
            </div>

            {/* Financial Velocity Header */}
            <div
              style={{
                background: '#1c1f26',
                borderRadius: '10px',
                padding: '10px 12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Net Worth (Consolidated)
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em', marginTop: '1px' }}>
                  ₹1,87,500 <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>+12.4%</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Runway</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>18.5 mos</div>
              </div>
            </div>

            {/* Linked Transaction & Loops Graph */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { title: 'Lent Rahul (Peer Loan)', amt: '₹500', badge: 'Linked to Goal', color: '#ff6b35' },
                { title: 'AWS & Domain Infra', amt: '₹1,250', badge: 'Fixed Recurring', color: '#749dc4' },
                { title: 'Nutrition & Supplements', amt: '₹1,700', badge: 'Health Investment', color: '#10b981' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 9px',
                    borderRadius: '7px',
                    background: '#1c1f26',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: item.color,
                        boxShadow: `0 0 6px ${item.color}`,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#f8fafc' }}>{item.title}</div>
                      <div style={{ fontSize: '9px', color: '#94a3b8' }}>{item.badge}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#f8fafc' }}>
                    {item.amt}
                  </span>
                </div>
              ))}
            </div>

            {/* Savings & Horizon */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2px' }}>
              <span style={{ fontSize: '9.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendUp size={12} weight="bold" color="#10b981" /> Savings Rate: <strong style={{ color: '#10b981' }}>59%</strong>
              </span>
              <span style={{ fontSize: '9.5px', color: '#38bdf8', fontWeight: 700 }}>FI Target: 8.5 yrs</span>
            </div>
          </div>

          {/* Card Caption */}
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-text-1)' }}>
              Money OS & Open Loops
            </h3>
            <p style={{ fontSize: '13px', lineHeight: '1.55', color: 'var(--color-text-2)', margin: 0 }}>
              Track spending and productivity together in an honest, auditable graph linked directly to people, goals, and freedom runway.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
