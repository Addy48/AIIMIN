import React, { useState, useEffect } from 'react';
import { Lock, ChevronDown } from 'lucide-react';
import RankLadder from '../../../components/gamification/RankLadder';
import ArcEditor from '../../../components/profile/ArcEditor';
import useFieldSave, { FieldSaveIndicator } from '../../../hooks/useFieldSave';
import { apiPatch } from '../../../utils/api';
import { LIFE_ARC_LABEL, ARC_TAGLINE } from '../../../constants/arc';
import ArcMark from '../../../components/brand/ArcMark';
import PlanStatusChip from '../../../components/account/PlanStatusChip';
import '../../../styles/subscriptionSection.css';

const fieldStyle = {
  width: '100%',
  padding: '13px 14px',
  borderRadius: 12,
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface-1)',
  color: 'var(--color-text-1)',
  font: '500 14px/1.4 var(--font-sans)',
  outline: 'none',
  transition: 'border-color var(--dur-normal) var(--ease), background-color var(--dur-normal) var(--ease)',
};

const cardStyle = {
  border: '1px solid var(--color-border)',
  borderRadius: 18,
  background: 'var(--color-surface-2)',
};

export default function ProfileSection({
  user,
  profile,
  onProfileUpdate,
  planTier = 'explore',
  periodEnd = null,
  onOpenSubscription,
}) {
  const [name, setName] = useState(user?.full_name || '');
  const [lifeArc, setLifeArc] = useState(profile?.tagline || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [ranksOpen, setRanksOpen] = useState(false);
  const osId = (profile?.username || user?.username || '').toUpperCase();
  const hasOsId = osId.length === 8;
  const activeLifeArc = profile?.tagline || lifeArc;

  useEffect(() => {
    setLifeArc(profile?.tagline || '');
  }, [profile?.tagline]);

  const { status: nameStatus, save: saveName } = useFieldSave(async (v) => {
    await apiPatch('/account/profile', { full_name: v });
  });

  const { status: lifeArcStatus, save: saveLifeArc } = useFieldSave(async (v) => {
    const updated = await apiPatch('/account/user-profile', { tagline: v });
    onProfileUpdate?.(updated);
  });

  const fields = [
    { label: 'OS-ID', value: osId, done: hasOsId },
    { label: 'Name', value: profile?.full_name || user?.full_name, done: !!(profile?.full_name || user?.full_name) },
    { label: 'Life Arc', value: profile?.tagline, done: !!profile?.tagline?.trim() },
    { label: 'Location', value: profile?.location, done: !!profile?.location },
    { label: 'Avatar', value: user?.avatar_url, done: !!user?.avatar_url },
  ];
  const strength = Math.round((fields.filter((f) => f.done).length / fields.length) * 100);
  const displayName = profile?.full_name || user?.full_name || '';
  const initials = (displayName.trim().split(/\s+/)[0]?.charAt(0) || user?.email?.charAt(0) || 'A').toUpperCase();

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <section style={{ ...cardStyle, padding: 24, overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr) auto', gap: 18, alignItems: 'center' }}>
          <div
            aria-hidden="true"
            style={{
              width: 74,
              height: 74,
              borderRadius: 20,
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, var(--color-logo-bg), var(--color-card-dark-green))',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              fontWeight: 850,
              letterSpacing: '-0.04em',
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: '0 0 7px', color: 'var(--color-text-3)', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Identity profile
            </p>
            <h1 style={{ margin: 0, color: 'var(--color-text-1)', fontFamily: 'var(--font-display)', fontSize: 34, lineHeight: 1.05, letterSpacing: '-0.035em' }}>
              {profile?.full_name || user?.full_name || 'Guest User'}
            </h1>

            <div
              style={{
                marginTop: 10,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
                padding: '6px 10px 6px 12px',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface-1)',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-3)' }}>
                OS-ID
              </span>
              <span
                className="profile-os-id"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  fontVariantNumeric: 'tabular-nums',
                  color: hasOsId ? 'var(--color-text-1)' : 'var(--color-text-3)',
                }}
              >
                {hasOsId ? osId : '— — — — — — — —'}
              </span>
              {hasOsId && (
                <span
                  title="Permanent — cannot be changed"
                  style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--color-text-3)' }}
                >
                  <Lock size={12} />
                </span>
              )}
            </div>

            <PlanStatusChip
              tier={planTier}
              periodEnd={periodEnd}
              onClick={() => onOpenSubscription?.()}
            />

            <div
              style={{
                marginTop: 12,
                padding: '10px 12px',
                borderRadius: 12,
                border: `1px solid ${activeLifeArc?.trim() ? 'color-mix(in srgb, var(--color-accent) 28%, var(--color-border))' : 'var(--color-border)'}`,
                background: activeLifeArc?.trim() ? 'var(--color-accent-dim)' : 'var(--color-surface-1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <ArcMark size={16} />
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-3)' }}>
                  {LIFE_ARC_LABEL}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  color: activeLifeArc?.trim() ? 'var(--color-text-1)' : 'var(--color-text-3)',
                  fontSize: 14,
                  lineHeight: 1.55,
                  fontStyle: activeLifeArc?.trim() ? 'normal' : 'italic',
                  fontWeight: activeLifeArc?.trim() ? 600 : 400,
                }}
              >
                {activeLifeArc?.trim() || ARC_TAGLINE}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-1)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em' }}>
              {strength}%
            </div>
            <div style={{ color: 'var(--color-text-3)', fontSize: 12, fontWeight: 700 }}>complete</div>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ height: 8, borderRadius: 999, background: 'var(--color-surface-4)', overflow: 'hidden' }}>
            <div style={{ width: `${strength}%`, height: '100%', borderRadius: 999, background: 'var(--color-success)', transition: 'width var(--dur-progress) var(--ease)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginTop: 14 }}>
            {fields.map((field) => (
              <div
                key={field.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 10px',
                  borderRadius: 12,
                  border: '1px solid var(--color-border)',
                  background: field.done ? 'var(--color-success-dim)' : 'var(--color-surface-1)',
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: field.done ? 'var(--color-success)' : 'var(--color-text-3)' }} />
                <span style={{ color: field.done ? 'var(--color-text-1)' : 'var(--color-text-2)', fontSize: 12, fontWeight: 750 }}>
                  {field.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...cardStyle, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'flex-start', marginBottom: 22 }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--color-text-1)', fontSize: 18, letterSpacing: '-0.015em' }}>
              Profile details
            </h2>
            <p style={{ margin: '6px 0 0', color: 'var(--color-text-3)', fontSize: 13, lineHeight: 1.5 }}>
              Identity fields that shape your Arc — Daily, Weekly, and Life.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          <label style={{ display: 'grid', gap: 8 }}>
            <span className="text-label">Display name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => saveName(name)}
              className={nameStatus === 'saved' ? 'field-saved' : ''}
              style={fieldStyle}
            />
            <FieldSaveIndicator status={nameStatus} />
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span className="text-label">Location</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={async () => {
                const updated = await apiPatch('/account/user-profile', { location });
                onProfileUpdate?.(updated);
              }}
              placeholder="City, country"
              style={fieldStyle}
            />
          </label>
        </div>

        <div style={{ marginTop: 20 }}>
        <ArcEditor
          value={lifeArc}
          onChange={setLifeArc}
          onSave={saveLifeArc}
          saveStatus={lifeArcStatus}
        />
        </div>

        <label style={{ display: 'grid', gap: 8, marginTop: 18 }}>
          <span className="text-label">Email</span>
          <input
            value={user?.email || ''}
            readOnly
            style={{ ...fieldStyle, opacity: 0.72, cursor: 'not-allowed' }}
          />
          <span style={{ color: 'var(--color-text-3)', fontSize: 12 }}>Managed by your sign-in provider.</span>
        </label>
      </section>

      <section style={{ ...cardStyle, padding: '16px 24px 20px' }}>
        <button
          type="button"
          onClick={() => setRanksOpen((v) => !v)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2 className="text-h3" style={{ marginBottom: 4 }}>Life ranks</h2>
            <p className="text-caption" style={{ margin: 0 }}>
              Earn XP from daily logs, focus sessions, and money tracking.
            </p>
          </div>
          <ChevronDown
            size={18}
            color="var(--color-text-3)"
            style={{ transform: ranksOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}
          />
        </button>
        <RankLadder compact={!ranksOpen} />
      </section>
    </div>
  );
}
