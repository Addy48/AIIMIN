import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Moon, Sun } from 'lucide-react';
import BrandLockup from '../brand/BrandLockup';
import PlanStatusChip from '../account/PlanStatusChip';
import ArcMark from '../brand/ArcMark';
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

export default function MobileLiteAccount() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useThemeContext();
  const [profile, setProfile] = useState(null);
  const [planTier, setPlanTier] = useState('explore');
  const [periodEnd, setPeriodEnd] = useState(null);
  const [xpData, setXpData] = useState(null);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const isDark = isDarkTheme(theme);

  useEffect(() => {
    if (!user?.id) return;
    apiGet('/account/user-profile').then(setProfile).catch(() => {});
    apiGet('/billing/status').then((st) => {
      if (st?.tier) setPlanTier(st.tier);
      if (st?.current_period_end) setPeriodEnd(st.current_period_end);
    }).catch(() => {});
    supabase
      .from('user_xp')
      .select('total_xp, current_rank')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => { if (data) setXpData(data); });
  }, [user?.id]);

  const displayName = profile?.full_name || user?.full_name || 'User';
  const osId = (profile?.username || user?.username || '').toUpperCase();
  const lifeArc = profile?.tagline || '';
  const initials = (displayName.trim().split(/\s+/)[0]?.charAt(0) || 'A').toUpperCase();
  const progress = getRankProgress(xpData?.total_xp || 0);
  const xpToNext = progress.next ? Math.max(0, progress.next.minXP - (xpData?.total_xp || 0)) : 0;

  return (
    <div className="mobile-capture mobile-lite-account">
      <header className="mobile-capture__header">
        <BrandLockup />
        <p className="mobile-capture__eyebrow">Account</p>
      </header>

      <main className="mobile-capture__main">
        <section className="mobile-lite-account__identity">
          <div className="mobile-lite-account__avatar" aria-hidden>{initials}</div>
          <div className="mobile-lite-account__identity-body">
            <h1>{displayName}</h1>
            <p className="mobile-lite-account__osid">{osId || '— — — — — — — —'}</p>
            <PlanStatusChip tier={planTier} periodEnd={periodEnd} />
          </div>
        </section>

        {lifeArc ? (
          <section className="mobile-lite-account__arc">
            <div className="mobile-lite-account__arc-head">
              <ArcMark size={14} />
              <span>{LIFE_ARC_LABEL}</span>
            </div>
            <p className="mobile-lite-account__arc-text">{lifeArc}</p>
          </section>
        ) : null}

        {progress.current && (
          <section className="mobile-lite-account__rank">
            <strong>{progress.current.name}</strong>
            <span>
              {xpToNext > 0
                ? `${xpToNext.toLocaleString()} XP to ${progress.next?.name || 'next'}`
                : 'Top rank'}
            </span>
            <div className="mobile-lite-account__rank-bar">
              <div style={{ width: `${Math.round((progress.progress || 0) * 100)}%` }} />
            </div>
          </section>
        )}

        <nav className="mobile-lite-account__actions" aria-label="Account actions">
          <button
            type="button"
            className="mobile-lite-account__action"
            onClick={() => {
              window.location.href = '/account?section=subscription&forceDesktop=1';
            }}
          >
            Manage plan on desktop
          </button>
          <button type="button" className="mobile-lite-account__action" onClick={toggleTheme}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            Theme — {isDark ? 'Dark' : 'Light'}
          </button>
          <button
            type="button"
            className="mobile-lite-account__action"
            onClick={() => {
              if (!confirmSignOut) {
                setConfirmSignOut(true);
                return;
              }
              signOut();
            }}
          >
            <LogOut size={18} />
            {confirmSignOut ? 'Tap again to sign out' : 'Sign out'}
          </button>
        </nav>

        <footer className="mobile-lite-account__legal">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </footer>

        <p className="mobile-lite-account__app-note">
          {accountAppNote()}
        </p>
        {isCapacitorNative() && (
          <p className="mobile-lite-account__app-note mobile-lite-account__app-note--muted">
            v1.0.0 · capture shell
          </p>
        )}
      </main>
    </div>
  );
}
