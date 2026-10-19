import React from 'react';
import { Link } from 'react-router-dom';
import {
  DownloadSimple,
  ShieldCheck,
  ArrowRight,
  LockKey,
  CheckCircle,
  Check,
  Lightning,
  DeviceMobile,
  Flame,
  Fingerprint,
  Cpu,
  WifiSlash,
  Sparkle,
  Wallet,
  Plus,
} from '@phosphor-icons/react';
import { ArchBracketMark, DARK_PICK } from '../../brand/archBracketMark';

export default function WaitlistAndroidSection() {
  return (
    <section className="waitlist-section waitlist-android-section" id="android-app" aria-labelledby="android-app-heading">
      <p className="waitlist-section-label">Native Companion</p>
      <h2 id="android-app-heading">Fast mobile capture. Zero bloated web wrappers.</h2>
      <p className="waitlist-section-copy">
        Desktop is your command center for deep planning and weekly reviews. The Android companion logs habits, expenses, and quick notes in under two seconds — built with 100% native Kotlin and Jetpack Compose, offline SQLite sync, and AES-256 hardware keystore encryption.
      </p>

      <div
        className="waitlist-android-deck"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'stretch',
          marginTop: '32px',
        }}
      >
        {/* Left Column: Technical Subsystems & Architecture */}
        <div
          className="waitlist-android-tech-col"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
          }}
        >
          <div>
            <div className="waitlist-android-spec-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.14)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '99px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                Native Android V2 · Closed Beta
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                v2.0.4 · API 35 · 120Hz
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Instant Capture', val: 'Lockscreen logging in <2s · zero launch lag', icon: Lightning, color: '#ff6b35' },
                { label: 'Biometric Vault', val: 'AES-256-GCM hardware keystore · keys isolated in StrongBox TEE', icon: LockKey, color: '#10b981' },
                { label: 'Autonomous Engine', val: '100% offline-first SQLite · zero-loss auto-sync', icon: WifiSlash, color: '#749dc4' },
                { label: 'Zero Ad Tracking', val: 'No analytics SDKs · no third-party data brokers · private on-device logs', icon: ShieldCheck, color: '#38bdf8' },
              ].map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: '#1c1f26',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <row.icon size={18} weight="duotone" color={row.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>{row.label}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>{row.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '20px' }}>
            {['Jetpack Compose 1.7', 'Room SQLite 2.6', 'Android Keystore TEE', 'Coroutines Flow'].map((chip, i) => (
              <span
                key={i}
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#cbd5e1',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Middle Column: Sleek Phone UI Frame Mockup */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
          }}
        >
          {/* Flagship Titanium Phone Chassis */}
          <div
            style={{
              width: '100%',
              maxWidth: '286px',
              borderRadius: '32px',
              border: '3px solid #2a2e39',
              background: '#0e1015',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Phone Top Punch-Hole & Status Bar */}
            <div
              style={{
                height: '28px',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '9.5px',
                fontWeight: 800,
                color: '#94a3b8',
                background: '#090a0d',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <span>09:41</span>
              {/* Punch-hole Camera */}
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#000', border: '1px solid #1e293b' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                <ShieldCheck size={11} weight="fill" /> AES-256
              </span>
            </div>

            {/* Tactical Sovereign OS-ID Hardware Passport */}
            <div style={{ padding: '10px 12px', background: 'linear-gradient(145deg, #181B22 0%, #101217 100%)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Card Topbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.08em', color: '#A1A8B8', textTransform: 'uppercase' }}>
                    OPERATOR // ADTY·SYS·01
                  </span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontFamily: 'var(--font-mono)', fontSize: '7.5px', fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1.5px 5px', borderRadius: '4px' }}>
                  <Fingerprint size={9} weight="bold" />
                  <span>STRONGBOX TEE</span>
                </div>
              </div>

              {/* Main Identity Matrix */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ position: 'relative', width: '26px', height: '26px', borderRadius: '6px', background: 'linear-gradient(135deg, #242933 0%, #161920 100%)', border: '1px solid rgba(255, 255, 255, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                  <ArchBracketMark size={14} pick={DARK_PICK} />
                  <span style={{ position: 'absolute', top: '-1px', right: '-1px', width: '4px', height: '4px', background: '#FF6B35', borderRadius: '0 0 0 2px' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <strong style={{ fontSize: '11px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Aaditya Upadhyay
                    </strong>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', fontWeight: 800, color: '#FF6B35', background: 'rgba(255, 107, 53, 0.15)', border: '1px solid rgba(255, 107, 53, 0.35)', padding: '0.5px 3.5px', borderRadius: '3px' }}>
                      FOUNDER
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '7.5px', color: '#8E98A8' }}>
                    <span style={{ color: '#749DC4' }}>0x8F3D…41C7</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span style={{ color: '#10B981' }}>SQLCipher 2.6</span>
                  </div>
                </div>

                {/* Score HUD */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px', flexShrink: 0 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '2px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1px 5px', borderRadius: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 800, color: '#10B981' }}>84</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', fontWeight: 700, color: '#6EE7B7' }}>LHS</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', fontWeight: 700, color: '#FF6B35' }}>+14% DEPTH</span>
                </div>
              </div>

              {/* Micro Telemetry Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 6px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'var(--font-mono)', fontSize: '7px' }}>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>DEPTH</span>
                  <strong style={{ color: '#E2E8F0', fontWeight: 700 }}>88%</strong>
                </div>
                <div style={{ width: '1px', height: '7px', background: 'rgba(255, 255, 255, 0.08)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'var(--font-mono)', fontSize: '7px' }}>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>LATENCY</span>
                  <strong style={{ color: '#10B981', fontWeight: 700 }}>0.8ms</strong>
                </div>
                <div style={{ width: '1px', height: '7px', background: 'rgba(255, 255, 255, 0.08)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'var(--font-mono)', fontSize: '7px' }}>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>OUTBOX</span>
                  <strong style={{ color: '#FF6B35', fontWeight: 700 }}>4 READY</strong>
                </div>
              </div>
            </div>

            {/* 1-Tap Quick Action Bar */}
            <div style={{ padding: '8px 12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', background: '#101217', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <div style={{ background: 'rgba(255, 107, 53, 0.1)', border: '1px solid rgba(255, 107, 53, 0.35)', borderRadius: '6px', padding: '5px 4px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Plus size={9} weight="bold" color="#ff6b35" />
                <span style={{ fontSize: '8px', fontWeight: 700, color: '#ff6b35' }}>EXPENSE</span>
              </div>
              <div style={{ background: '#181b22', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '5px 4px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Lightning size={9} weight="fill" color="#10b981" />
                <span style={{ fontSize: '8px', fontWeight: 700, color: '#cbd5e1' }}>FOCUS</span>
              </div>
              <div style={{ background: '#181b22', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '5px 4px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Check size={9} weight="bold" color="#749dc4" />
                <span style={{ fontSize: '8px', fontWeight: 700, color: '#94a3b8' }}>MINIMUM</span>
              </div>
            </div>

            {/* Mobile Quick Habit Rows */}
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', background: '#14171d' }}>
              {[
                { title: 'Morning Gym Minimum', meta: '45m Workout · Logged 06:30', done: true, tag: 'BODY' },
                { title: 'Deep Work Sprint', meta: '3h 15m Code · Logged 10:15', done: true, tag: 'MIND' },
                { title: 'UPI Reimbursement', meta: 'Lent Rahul ₹500 (Linked)', done: true, tag: 'MONEY' },
                { title: 'Evening Debrief', meta: 'Journal & Ledger Synced', done: true, tag: 'DISCIPLINE' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: '#1c1f26',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#f8fafc' }}>{item.title}</span>
                    <span style={{ fontSize: '8.5px', color: '#94a3b8' }}>{item.meta}</span>
                  </div>
                  <CheckCircle size={16} weight="fill" color="#10b981" style={{ filter: 'drop-shadow(0 2px 6px rgba(16, 185, 129, 0.35))' }} />
                </div>
              ))}

              {/* Instant Settle CTA Button */}
              <div
                style={{
                  marginTop: '4px',
                  padding: '9px',
                  borderRadius: '8px',
                  background: 'linear-gradient(180deg, #ff6b35 0%, #ea580c 100%)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 800,
                  textAlign: 'center',
                  boxShadow: '0 4px 14px rgba(255, 107, 53, 0.5)',
                  letterSpacing: '0.02em',
                }}
              >
                Settle to Offline SQLite Graph
              </div>
            </div>

            {/* Android Gesture Bar */}
            <div style={{ height: '14px', background: '#0e1015', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '48px', height: '3px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.25)' }} />
            </div>
          </div>
        </div>

        {/* Right Column: Download & Checksum Console */}
        <div
          className="waitlist-android-dl-col"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                BUILD: v2.0.4-release
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                ~44.2 MB (ARM64)
              </span>
            </div>

            <a
              href="/app"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                background: 'linear-gradient(180deg, #ff6b35 0%, #ea580c 100%)',
                color: '#fff',
                fontSize: '13.5px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(255, 107, 53, 0.45)',
                marginBottom: '12px',
                transition: 'transform 0.15s ease',
              }}
            >
              <DownloadSimple size={18} weight="bold" /> Download Latest APK (~44 MB)
            </a>

            <Link
              to="/app"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: '#1c1f26',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Full Architecture & Specs <ArrowRight size={14} />
            </Link>

            {/* Verified Cryptographic Integrity Box */}
            <div
              style={{
                marginTop: '18px',
                padding: '14px',
                borderRadius: '10px',
                background: '#16181e',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#10b981' }}>
                <ShieldCheck size={14} weight="fill" /> Verified Cryptographic Integrity
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#94a3b8', lineHeight: '1.6' }}>
                <li>StrongBox TEE Hardware Keystore (Keys stay in silicon)</li>
                <li>100% Private On-Device Processing · Zero Cloud SMS</li>
                <li>Zero-VPN Focus Shield · Tamper-Resistant Signed Binary</li>
              </ul>
            </div>
          </div>

          <p style={{ margin: '16px 0 0', fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> Sideloadable release build for verified testers.
          </p>
        </div>
      </div>
    </section>
  );
}
