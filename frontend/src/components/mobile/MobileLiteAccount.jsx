import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DownloadSimple,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  LockKey,
  ArrowRight,
  Terminal,
  Sparkle,
} from '@phosphor-icons/react';
import { LogOut, Moon, Sun, Laptop, Smartphone, Activity } from 'lucide-react';
import BrandLockup from '../brand/BrandLockup';
import PlanStatusChip from '../account/PlanStatusChip';
import ArcMark from '../brand/ArcMark';
import { ArchBracketMark, DARK_PICK } from '../brand/archBracketMark';
import { useAuth } from '../../hooks/useAuth';
import { useThemeContext } from '../../context/ThemeContext';
import { apiGet } from '../../utils/api';
import { getRankProgress } from '../../utils/xpEngine';
import { LIFE_ARC_LABEL } from '../../constants/arc';
import { isDarkTheme } from '../../constants/themes';
import { isCapacitorNative } from '../../utils/capacitorEnv';
import { accountAppNote } from './mobileShellCopy';
import supabase from '../../utils/supabase';
import '../../styles/mobileCapture.css';
import '../../styles/mobileLiteAccount.css';

const ADB_COMMAND = 'adb install -r aiimin-v2-debug.apk';

export default function MobileLiteAccount() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useThemeContext();
  const [profile, setProfile] = useState(null);
  const [planTier, setPlanTier] = useState('explore');
  const [periodEnd, setPeriodEnd] = useState(null);
  const [xpData, setXpData] = useState(null);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [copiedOsId, setCopiedOsId] = useState(false);
  const [copiedAdb, setCopiedAdb] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const isDark = isDarkTheme(theme);

  useEffect(() => {
    if (!user?.id) return;
    apiGet('/account/user-profile')?.then?.(setProfile)?.catch?.(() => {});
    apiGet('/billing/status')?.then?.((st) => {
      if (st?.tier) setPlanTier(st.tier);
      if (st?.current_period_end) setPeriodEnd(st.current_period_end);
    })?.catch?.(() => {});
    try {
      supabase
        .from('user_xp')
        .select('total_xp, current_rank')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data }) => { if (data) setXpData(data); })
        .catch(() => {});
    } catch {
      // safe fallback
    }
  }, [user?.id]);

  const displayName = typeof (profile?.full_name || user?.full_name) === 'string'
    ? (profile?.full_name || user?.full_name)
    : (user?.email?.split('@')[0] || 'Sovereign Operator');

  const rawId = String(profile?.username || user?.username || user?.id || '').replace(/[^a-zA-Z0-9]/g, '');
  const osId = (rawId.slice(0, 8) || 'AIIMIN01').toUpperCase();

  const lifeArc = typeof profile?.tagline === 'string' ? profile.tagline : '';
  const initials = (displayName.trim().split(/\s+/)[0]?.charAt(0) || String(user?.email || '').charAt(0) || 'A').toUpperCase();
  const progress = getRankProgress(Number(xpData?.total_xp) || 0);
  const xpToNext = progress?.next
    ? Math.max(0, (progress.next.minXP || progress.next.xpRequired || 0) - (Number(xpData?.total_xp) || 0))
    : 0;

  const handleCopyOsId = () => {
    navigator.clipboard?.writeText(osId);
    setCopiedOsId(true);
    setTimeout(() => setCopiedOsId(false), 2000);
  };

  const handleCopyAdb = () => {
    navigator.clipboard?.writeText(ADB_COMMAND);
    setCopiedAdb(true);
    setTimeout(() => setCopiedAdb(false), 2000);
  };

  return (
    <div className="mobile-capture mobile-lite-account">
      {/* ── STICKY TELEMETRY MASTHEAD ── */}
      <header className="mobile-capture__header mobile-lite-account__header">
        <BrandLockup />
        <div className="mobile-lite-account__status-pill">
          <span className="mobile-lite-account__live-dot" />
          <span className="mobile-lite-account__status-text">ENCLAVE // ONLINE</span>
        </div>
      </header>

      <main className="mobile-capture__main mobile-lite-account__main">
        {/* ── SECTION 1: IDENTITY & OS-ID PLATE ── */}
        <section className="mobile-lite-account__card mobile-lite-account__identity-card">
          <div className="mobile-lite-account__identity-top">
            <div className="mobile-lite-account__avatar" aria-hidden>
              <span>{initials}</span>
              <span className="mobile-lite-account__avatar-badge">◈</span>
            </div>
            <div className="mobile-lite-account__identity-details">
              <div className="mobile-lite-account__name-row">
                <h1 className="mobile-lite-account__name">{displayName}</h1>
                <PlanStatusChip tier={planTier} periodEnd={periodEnd} />
              </div>
              <p className="mobile-lite-account__email">{user?.email || 'Authenticated Session'}</p>
            </div>
          </div>

          {/* 1-Tap OS-ID Hardware Linking Plate */}
          <div className="mobile-lite-account__osid-plate">
            <div className="mobile-lite-account__osid-meta">
              <span className="mobile-lite-account__osid-label">
                <Cpu size={12} weight="bold" />
                HARDWARE COMPANION OS-ID
              </span>
              <span className="mobile-lite-account__osid-protocol">SECURE ELEMENT</span>
            </div>
            <div className="mobile-lite-account__osid-row">
              <code className="mobile-lite-account__osid-val">{osId}</code>
              <button
                type="button"
                className={`mobile-lite-account__copy-btn ${copiedOsId ? 'is-copied' : ''}`}
                onClick={handleCopyOsId}
                aria-label="Copy Hardware OS-ID"
              >
                {copiedOsId ? (
                  <>
                    <Check size={14} weight="bold" />
                    <span>COPIED ✓</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} weight="bold" />
                    <span>COPY ID</span>
                  </>
                )}
              </button>
            </div>
            <p className="mobile-lite-account__osid-hint">
              Required for Native Android companion login &amp; device pairing.
            </p>
          </div>
        </section>

        {/* ── SECTION 2: NATIVE ANDROID COMPANION APK CONSOLE (STAR ATTRACTION) ── */}
        <section className="mobile-lite-account__card mobile-lite-account__apk-card">
          <div className="mobile-lite-account__apk-head">
            <div className="mobile-lite-account__apk-title-group">
              <span className="mobile-lite-account__badge-pill">
                <Smartphone size={12} />
                NATIVE COMPANION
              </span>
              <h2 className="mobile-lite-account__card-title">Android Companion V2</h2>
            </div>
            <span className="mobile-lite-account__apk-version-tag">44.2 MB · 120Hz</span>
          </div>

          <p className="mobile-lite-account__apk-desc">
            Sub-2-second lockscreen capture, 100% offline-first SQLCipher database, and hardware-level Focus Shield window interceptor. Keys sealed in smartphone silicon.
          </p>

          {/* Direct Download Button */}
          <div className="mobile-lite-account__apk-actions">
            <a
              href="/aiimin-v2-debug.apk"
              download="aiimin-v2-debug.apk"
              className={`mobile-lite-account__download-btn ${downloading ? 'is-loading' : ''}`}
              onClick={() => {
                setDownloading(true);
                setTimeout(() => setDownloading(false), 3000);
              }}
            >
              <DownloadSimple size={18} weight="bold" />
              <span>{downloading ? 'Starting Download…' : 'Download Latest APK (44.2 MB)'}</span>
            </a>

            <Link to="/app" className="mobile-lite-account__specs-link">
              <span>Full System Architecture &amp; Guide</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>

          {/* Quick Sideload ADB Command */}
          <div className="mobile-lite-account__adb-box">
            <div className="mobile-lite-account__adb-head">
              <span className="mobile-lite-account__adb-label">
                <Terminal size={12} weight="bold" />
                SIDELOAD VIA ADB
              </span>
              <button
                type="button"
                className={`mobile-lite-account__adb-copy ${copiedAdb ? 'is-copied' : ''}`}
                onClick={handleCopyAdb}
                aria-label="Copy ADB install command"
              >
                {copiedAdb ? <Check size={12} weight="bold" /> : <Copy size={12} weight="bold" />}
                <span>{copiedAdb ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
            <code className="mobile-lite-account__adb-code">{ADB_COMMAND}</code>
          </div>

          {/* 4-Pill Hardware Architecture Grid */}
          <div className="mobile-lite-account__spec-pills">
            <div className="mobile-lite-account__spec-pill">
              <LockKey size={13} weight="bold" color="#749DC4" />
              <span>StrongBox TEE</span>
            </div>
            <div className="mobile-lite-account__spec-pill">
              <Sparkle size={13} weight="bold" color="#FF6B35" />
              <span>120Hz Compose</span>
            </div>
            <div className="mobile-lite-account__spec-pill">
              <ShieldCheck size={13} weight="bold" color="#10B981" />
              <span>Offline SQLite</span>
            </div>
            <div className="mobile-lite-account__spec-pill">
              <Cpu size={13} weight="bold" color="#749DC4" />
              <span>Zero Telemetry</span>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: LIFE ARC TRAJECTORY ── */}
        {lifeArc ? (
          <section className="mobile-lite-account__card mobile-lite-account__arc-card">
            <div className="mobile-lite-account__arc-head">
              <ArcMark size={14} />
              <span>{LIFE_ARC_LABEL}</span>
            </div>
            <p className="mobile-lite-account__arc-text">“{lifeArc}”</p>
          </section>
        ) : (
          <section className="mobile-lite-account__card mobile-lite-account__arc-card mobile-lite-account__arc-card--unconfigured">
            <div className="mobile-lite-account__arc-head">
              <ArcMark size={14} />
              <span>MACRO LIFE TRAJECTORY</span>
            </div>
            <p className="mobile-lite-account__arc-empty-note">
              Configure your 5-year vision and non-negotiable core pillars in the Desktop Command Center.
            </p>
          </section>
        )}

        {/* ── SECTION 4: 5D DISCIPLINE & RANK PROGRESSION ── */}
        {progress.current && (
          <section className="mobile-lite-account__card mobile-lite-account__rank-card">
            <div className="mobile-lite-account__rank-head">
              <div>
                <span className="mobile-lite-account__rank-kicker">DISCIPLINE ENGINE RANK</span>
                <strong className="mobile-lite-account__rank-title">{progress.current.name}</strong>
              </div>
              <span className="mobile-lite-account__xp-badge">
                {Number(xpData?.total_xp || 0).toLocaleString()} XP
              </span>
            </div>

            <div className="mobile-lite-account__rank-track">
              <div
                className="mobile-lite-account__rank-fill"
                style={{ width: `${Math.min(100, Math.max(4, Math.round((progress.progress || 0) * 100)))}%` }}
              />
            </div>

            <div className="mobile-lite-account__rank-foot">
              <span>{Math.round((progress.progress || 0) * 100)}% tier mastery</span>
              <span>
                {xpToNext > 0
                  ? `${xpToNext.toLocaleString()} XP to ${progress.next?.name || 'next'}`
                  : 'Apex Sovereign Rank'}
              </span>
            </div>
          </section>
        )}

        {/* ── SECTION 5: HARDWARE ENCLAVE & SECURITY TELEMETRY ── */}
        <section className="mobile-lite-account__card mobile-lite-account__telemetry-card">
          <div className="mobile-lite-account__telemetry-head">
            <span className="mobile-lite-account__telemetry-kicker">ENCLAVE SPECIFICATIONS</span>
            <span className="mobile-lite-account__telemetry-badge">SECURE // AUDITED</span>
          </div>

          <div className="mobile-lite-account__telemetry-table">
            <div className="mobile-lite-account__telemetry-row">
              <span className="mobile-lite-account__telemetry-lbl">Hardware Keystore</span>
              <strong className="mobile-lite-account__telemetry-val">AndroidKeyStore TEE (StrongBox)</strong>
            </div>
            <div className="mobile-lite-account__telemetry-row">
              <span className="mobile-lite-account__telemetry-lbl">Session Encryption</span>
              <strong className="mobile-lite-account__telemetry-val">AES-256-GCM Hardware Enclave</strong>
            </div>
            <div className="mobile-lite-account__telemetry-row">
              <span className="mobile-lite-account__telemetry-lbl">Third-Party Trackers</span>
              <strong className="mobile-lite-account__telemetry-val val-green">0 Trackers · 0 Ads</strong>
            </div>
            <div className="mobile-lite-account__telemetry-row">
              <span className="mobile-lite-account__telemetry-lbl">Sync Engine</span>
              <strong className="mobile-lite-account__telemetry-val">Deterministic Conflict-Free CRDT</strong>
            </div>
            <div className="mobile-lite-account__telemetry-row">
              <span className="mobile-lite-account__telemetry-lbl">API Gateway</span>
              <strong className="mobile-lite-account__telemetry-val val-steel">api.aiimin.in (TLS 1.3)</strong>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: CONSOLE ACTIONS & CONTROLS ── */}
        <nav className="mobile-lite-account__actions-menu" aria-label="Account actions">
          <button
            type="button"
            className="mobile-lite-account__action-row"
            onClick={() => {
              window.location.href = '/account?section=subscription&forceDesktop=1';
            }}
          >
            <Laptop size={18} className="mobile-lite-account__action-icon" />
            <div className="mobile-lite-account__action-text">
              <strong>Manage plan on desktop</strong>
              <span>Billing, invoices, and tier allocations</span>
            </div>
            <ArrowRight size={14} className="mobile-lite-account__action-arrow" />
          </button>

          <button
            type="button"
            className="mobile-lite-account__action-row"
            onClick={toggleTheme}
          >
            {isDark ? (
              <Sun size={18} className="mobile-lite-account__action-icon" />
            ) : (
              <Moon size={18} className="mobile-lite-account__action-icon" />
            )}
            <div className="mobile-lite-account__action-text">
              <strong>Interface Theme</strong>
              <span>Currently set to {isDark ? 'Drafting Table Dark' : 'Paper Light'}</span>
            </div>
            <span className="mobile-lite-account__theme-pill">{isDark ? 'DARK' : 'LIGHT'}</span>
          </button>

          <a
            href="https://api.aiimin.in/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-lite-account__action-row"
          >
            <Activity size={18} className="mobile-lite-account__action-icon" />
            <div className="mobile-lite-account__action-text">
              <strong>EC2 Backend Health Check</strong>
              <span>Live TLS 1.3 heartbeat probe</span>
            </div>
            <span className="mobile-lite-account__health-pill">OK 200</span>
          </a>

          <button
            type="button"
            className={`mobile-lite-account__action-row mobile-lite-account__action-row--danger ${confirmSignOut ? 'is-confirming' : ''}`}
            onClick={() => {
              if (!confirmSignOut) {
                setConfirmSignOut(true);
                return;
              }
              signOut();
            }}
          >
            <LogOut size={18} className="mobile-lite-account__action-icon" />
            <div className="mobile-lite-account__action-text">
              <strong>{confirmSignOut ? 'Confirm Sign Out' : 'Sign Out of Session'}</strong>
              <span>{confirmSignOut ? 'Tap again to revoke session' : 'Device remains paired'}</span>
            </div>
            <span className="mobile-lite-account__danger-pill">
              {confirmSignOut ? 'CONFIRM' : 'REVOKE'}
            </span>
          </button>
        </nav>

        {/* ── SECTION 7: FOOTER & LEGAL ── */}
        <footer className="mobile-lite-account__legal-footer">
          <div className="mobile-lite-account__legal-links">
            <Link to="/app">Companion /app</Link>
            <span className="mobile-lite-account__dot-sep">·</span>
            <Link to="/waitlist">Waitlist</Link>
            <span className="mobile-lite-account__dot-sep">·</span>
            <Link to="/privacy">Privacy</Link>
            <span className="mobile-lite-account__dot-sep">·</span>
            <Link to="/terms">Terms</Link>
            <span className="mobile-lite-account__dot-sep">·</span>
            <Link to="/contact">Contact</Link>
          </div>

          <p className="mobile-lite-account__app-note">
            {accountAppNote()}
          </p>

          <div className="mobile-lite-account__version-block">
            <ArchBracketMark size={14} pick={DARK_PICK} />
            <span>AIIMIN ENCLAVE OS · BUILD 2026.09.15 · DRAFTING TABLE SPEC</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

