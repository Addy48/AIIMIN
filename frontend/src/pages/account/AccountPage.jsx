import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiGet } from '../../utils/api';
import ProfileSection from './sections/ProfileSection';
import PersonalizationSection from './sections/PersonalizationSection';
import NotificationsSection from './sections/NotificationsSection';
import PrivacySection from './sections/PrivacySection';
import SubscriptionSection from './sections/SubscriptionSection';
import DataSection from './sections/DataSection';
import LegalSection from './sections/LegalSection';
import DesignSection from './sections/DesignSection';

const SECTIONS = [
  { id: 'profile', label: 'My Profile', helper: 'Identity, location, and completion' },
  { id: 'personalization', label: 'Personalization', helper: 'Themes, nav pins, life modes' },
  { id: 'design', label: 'Design Lab', helper: 'Overview prototypes, themes, UI library' },
  { id: 'notifications', label: 'Notifications', helper: 'Reminders and alerts' },
  { id: 'privacy', label: 'Privacy & Security', helper: 'Access and account safety' },
  { id: 'subscription', label: 'Subscription', helper: 'Plan and billing' },
  { id: 'data', label: 'Data & Export', helper: 'Backups and portability' },
  { id: 'legal', label: 'Legal', helper: 'Policies and terms' },
];

const SECTION_MAP = {
  profile: ProfileSection,
  personalization: PersonalizationSection,
  notifications: NotificationsSection,
  privacy: PrivacySection,
  subscription: SubscriptionSection,
  data: DataSection,
  legal: LegalSection,
  design: DesignSection,
};

export default function AccountPage() {
  const { user, session } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const section = searchParams.get('section') || 'profile';
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!session) return;
    apiGet('/account/user-profile').then(setProfile).catch(() => {});
  }, [session]);

  if (!session) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: 80 }}>
        <h1 className="text-h1">Account</h1>
        <p className="text-body" style={{ color: 'var(--color-text-2)', marginTop: 12 }}>
          Sign in to manage your settings.
        </p>
      </div>
    );
  }

  const ActiveSection = SECTION_MAP[section] || ProfileSection;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const activeMeta = SECTIONS.find((s) => s.id === section) || SECTIONS[0];

  return (
    <div
      className="page-container"
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '292px minmax(0, 860px)',
        gap: isMobile ? 18 : 36,
        minHeight: 'calc(100vh - var(--nav-height))',
        alignItems: 'flex-start',
      }}
    >
      <aside
        className="sidebar"
        style={{
          width: '100%',
          flexShrink: 0,
          background: 'linear-gradient(180deg, var(--color-surface-2), var(--color-surface-1))',
          borderRadius: 18,
          border: '1px solid var(--color-border)',
          padding: isMobile ? '12px' : '16px',
          height: isMobile ? 'auto' : 'fit-content',
          position: isMobile ? 'static' : 'sticky',
          top: 100,
          boxShadow: 'var(--glass-shadow-sm)',
        }}
      >
        {!isMobile && (
          <div style={{ padding: '8px 8px 16px', borderBottom: '1px solid var(--color-border)', marginBottom: 12 }}>
            <p style={{ margin: '0 0 7px', color: 'var(--color-text-1)', fontSize: 13, fontWeight: 850 }}>
              Account settings
            </p>
            <p style={{ margin: 0, color: 'var(--color-text-3)', fontSize: 12, lineHeight: 1.55 }}>
              Your identity, preferences, billing, and privacy controls in one place.
            </p>
          </div>
        )}
        {isMobile ? (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 8px' }}>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSearchParams({ section: s.id })}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: section === s.id ? '1px solid var(--color-border-lit)' : '1px solid var(--color-border)',
                  background: section === s.id ? 'var(--color-surface-3)' : 'transparent',
                  color: section === s.id ? 'var(--color-text-1)' : 'var(--color-text-2)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : (
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SECTIONS.map((s) => {
              const active = section === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSearchParams({ section: s.id })}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 3,
                    width: '100%',
                    textAlign: 'left',
                    padding: '13px 14px',
                    border: `1px solid ${active ? 'var(--color-border-lit)' : 'transparent'}`,
                    borderRadius: 12,
                    background: active ? 'var(--color-surface-3)' : 'transparent',
                    color: active ? 'var(--color-text-1)' : 'var(--color-text-2)',
                    fontSize: 14,
                    fontWeight: active ? 750 : 600,
                    cursor: 'pointer',
                    transition: 'background var(--dur-normal) var(--ease), border-color var(--dur-normal) var(--ease), transform var(--dur-fast) var(--ease)',
                  }}
                >
                  <span style={{ letterSpacing: '-0.01em' }}>{s.label}</span>
                  <span style={{ color: 'var(--color-text-3)', fontSize: 11, fontWeight: 500 }}>
                    {s.helper}
                  </span>
                </button>
              );
            })}
          </nav>
        )}
      </aside>

      <main style={{ minWidth: 0, overflowY: 'auto' }}>
        <div style={{ marginBottom: 20 }}>
          <p className="text-label" style={{ marginBottom: 8, color: 'var(--color-text-3)' }}>
            {activeMeta.label}
          </p>
          <p style={{ margin: 0, color: 'var(--color-text-2)', fontSize: 14, lineHeight: 1.6 }}>
            {activeMeta.helper}
          </p>
        </div>
        <ActiveSection user={user} profile={profile} onProfileUpdate={setProfile} />
      </main>
    </div>
  );
}
