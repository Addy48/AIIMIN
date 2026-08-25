import React, { useState } from 'react';
import { apiPatch } from '../../../utils/api';

const GROUPS = {
  ACTIVITY: [
    { key: 'habit_reminder', label: 'Habit reminder' },
    { key: 'discipline_prompt', label: 'Discipline prompt' },
    { key: 'journal_prompt', label: 'Journal prompt' },
    { key: 'focus_suggestions', label: 'Focus suggestions' },
    { key: 'weekly_digest', label: 'Weekly digest' },
  ],
  SPORTS: [
    { key: 'match_starting', label: 'Match starting (30 min before)' },
    { key: 'final_score', label: 'Final score' },
    { key: 'transfer_news', label: 'Transfer news' },
  ],
  FINANCIAL: [
    { key: 'budget_exceeded', label: 'Budget exceeded' },
    { key: 'subscription_detected', label: 'Subscription detected' },
    { key: 'safe_to_spend', label: 'Safe-to-spend daily' },
  ],
  SYSTEM: [
    { key: 'security_alerts', label: 'Security alerts', locked: true },
    { key: 'product_updates', label: 'Product updates' },
    { key: 'tips_guides', label: 'Tips and guides' },
  ],
};

function Toggle({ on, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      aria-label={label}
      onClick={() => !disabled && onChange(!on)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        border: 'none',
        background: on ? 'var(--color-accent)' : 'var(--color-border-lit)',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'background 0.2s',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s',
        }}
      />
    </button>
  );
}

export default function NotificationsSection({ profile, onProfileUpdate }) {
  const prefs = profile?.notification_prefs || {};
  const [savingKey, setSavingKey] = useState(null);
  const [saveError, setSaveError] = useState('');

  const toggle = async (key, val) => {
    setSavingKey(key);
    setSaveError('');
    try {
      const updated = await apiPatch('/account/user-profile', {
        notification_prefs: { ...prefs, [key]: val },
      });
      onProfileUpdate?.(updated);
    } catch {
      setSaveError('Could not save this preference. Try again when you are online.');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div>
      <h1 className="text-h1" style={{ marginBottom: 8 }}>Notifications</h1>
      <p style={{ margin: '0 0 24px', color: 'var(--color-text-2)', fontSize: 14, lineHeight: 1.6 }}>
        Website notifications appear in the bell menu. Urgent reminders are marked in red and include a direct action link; nothing here changes your data.
      </p>
      {saveError && <div role="alert" style={{ marginBottom: 16, padding: '10px 12px', borderRadius: 10, color: '#b91c1c', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: 12 }}>{saveError}</div>}
      {Object.entries(GROUPS).map(([group, items]) => (
        <section key={group} className="card" style={{ padding: 24, marginBottom: 16 }}>
          <h2 className="text-label" style={{ marginBottom: 16 }}>{group}</h2>
          {items.map((item) => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <span className="text-body">{item.label}</span>
              <Toggle
                on={item.locked ? true : prefs[item.key] !== false}
                disabled={item.locked || savingKey === item.key}
                label={`Toggle ${item.label}`}
                onChange={(v) => toggle(item.key, v)}
              />
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
