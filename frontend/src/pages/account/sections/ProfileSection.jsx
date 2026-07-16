import React, { useState } from 'react';
import { Copy, Lock } from 'lucide-react';
import RankLadder from '../../../components/gamification/RankLadder';
import useFieldSave, { FieldSaveIndicator } from '../../../hooks/useFieldSave';
import { apiPatch } from '../../../utils/api';
import toast from '../../../utils/toast';

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

export default function ProfileSection({ user, profile, onProfileUpdate }) {
  const [name, setName] = useState(user?.full_name || '');
  const [tagline, setTagline] = useState(profile?.tagline || '');
  const [location, setLocation] = useState(profile?.location || '');
  const osId = (profile?.username || user?.username || '').toUpperCase();
  const hasOsId = osId.length === 8;

  const copyOsId = async () => {
    if (!hasOsId) return;
    try {
      await navigator.clipboard.writeText(osId);
      toast.success('OS-ID copied');
    } catch {
      toast.error('Could not copy OS-ID');
    }
  };

  const { status: nameStatus, save: saveName } = useFieldSave(async (v) => {
    await apiPatch('/account/profile', { full_name: v });
  });

  const { status: tagStatus, save: saveTagline } = useFieldSave(async (v) => {
    const updated = await apiPatch('/account/user-profile', { tagline: v });
    onProfileUpdate?.(updated);
  });

  const fields = [
    { label: 'OS-ID', value: osId, done: hasOsId },
    { label: 'Name', value: profile?.full_name || user?.full_name, done: !!(profile?.full_name || user?.full_name) },
    { label: 'Tagline', value: profile?.tagline, done: !!profile?.tagline },
    { label: 'Location', value: profile?.location, done: !!profile?.location },
    { label: 'Avatar', value: user?.avatar_url, done: !!user?.avatar_url },
  ];
  const strength = Math.round((fields.filter((f) => f.done).length / fields.length) * 100);
  const initials = (profile?.full_name || user?.full_name || user?.email || 'A')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
            <p style={{ margin: '8px 0 0', color: 'var(--color-text-2)', fontSize: 14, lineHeight: 1.55 }}>
              {profile?.tagline || tagline || 'Add a short line that tells future you what this operating system is built around.'}
            </p>
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

      <section
        style={{
          ...cardStyle,
          padding: '22px 24px',
          background: 'linear-gradient(135deg, var(--color-surface-2) 0%, var(--color-surface-1) 55%, rgba(255, 107, 53, 0.08) 100%)',
          border: '1px solid var(--color-border)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -40,
            right: -20,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,53,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 6px', color: 'var(--color-accent)', fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              OS-ID · Permanent handle
            </p>
            <p style={{ margin: '0 0 14px', color: 'var(--color-text-2)', fontSize: 13, lineHeight: 1.55, maxWidth: 420 }}>
              Your unique 8-character identity on AIIMIN. Chosen once at signup — cannot be changed.
            </p>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 999,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface-1)',
              color: 'var(--color-text-3)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            <Lock size={12} />
            Locked
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
            flexWrap: 'wrap',
            padding: '16px 18px',
            borderRadius: 14,
            border: '1px solid rgba(255, 107, 53, 0.35)',
            background: 'var(--color-surface-1)',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                fontSize: hasOsId ? 32 : 22,
                fontWeight: 800,
                letterSpacing: hasOsId ? '0.22em' : '0.04em',
                color: hasOsId ? 'var(--color-text-1)' : 'var(--color-text-3)',
                lineHeight: 1.1,
              }}
            >
              {hasOsId ? osId : 'NOT SET'}
            </div>
            <p style={{ margin: '8px 0 0', color: 'var(--color-text-3)', fontSize: 12 }}>
              {hasOsId ? 'Use OS-ID + 6-digit PIN to sign in anywhere.' : 'Complete onboarding to claim your OS-ID.'}
            </p>
          </div>
          {hasOsId && (
            <button
              type="button"
              onClick={copyOsId}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface-2)',
                color: 'var(--color-text-1)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Copy size={15} />
              Copy
            </button>
          )}
        </div>
      </section>

      <section style={{ ...cardStyle, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'flex-start', marginBottom: 22 }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--color-text-1)', fontSize: 18, letterSpacing: '-0.015em' }}>
              Profile details
            </h2>
            <p style={{ margin: '6px 0 0', color: 'var(--color-text-3)', fontSize: 13, lineHeight: 1.5 }}>
              Small identity details make insights, exports, and account recovery clearer.
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

        <label style={{ display: 'grid', gap: 8, marginTop: 18 }}>
          <span className="text-label">Tagline (max 80)</span>
          <input
            value={tagline}
            maxLength={80}
            onChange={(e) => setTagline(e.target.value)}
            onBlur={() => saveTagline(tagline)}
            className={tagStatus === 'saved' ? 'field-saved' : ''}
            placeholder="One line about you"
            style={fieldStyle}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <FieldSaveIndicator status={tagStatus} />
            <span className="text-caption">{tagline.length}/80</span>
          </div>
        </label>

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

      <section style={{ ...cardStyle, padding: '22px 24px', marginTop: 20 }}>
        <h2 className="text-h3" style={{ marginBottom: 4 }}>Life ranks</h2>
        <p className="text-caption" style={{ marginBottom: 16 }}>XP auto-collects when you save your day, finish focus, or log money.</p>
        <RankLadder />
      </section>
    </div>
  );
}
