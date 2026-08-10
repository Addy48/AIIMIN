import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { apiPatch } from '../../../utils/api';
import SecuritySection from './SecuritySection';

function PrivacyToggle({ on, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        border: 'none',
        background: on ? '#ff6b35' : 'var(--color-border-lit)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s',
        flexShrink: 0,
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

export default function PrivacySection({ profile, onProfileUpdate }) {
  const { user } = useAuth();
  const [journalOptIn, setJournalOptIn] = useState(profile?.ai_journal_opt_in !== false);
  const [sportsAi, setSportsAi] = useState(profile?.ai_sports_opt_in !== false);

  const save = async (patch) => {
    const updated = await apiPatch('/account/user-profile', patch);
    onProfileUpdate?.(updated);
  };

  return (
    <div>
      <SecuritySection user={user} />

      <section className="card" style={{ padding: 24, marginTop: 8 }}>
        <h2 className="text-h3" style={{ marginBottom: 16 }}>AI & data privacy</h2>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 16 }}>
          <span className="text-body">Allow AI to analyze journal entries</span>
          <PrivacyToggle
            on={journalOptIn}
            onChange={(v) => {
              setJournalOptIn(v);
              save({ ai_journal_opt_in: v });
            }}
          />
        </label>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 16 }}>
          <span className="text-body">Allow AI sports summaries</span>
          <PrivacyToggle
            on={sportsAi}
            onChange={(v) => {
              setSportsAi(v);
              save({ ai_sports_opt_in: v });
            }}
          />
        </label>
        <p className="text-caption">Finance data is never sent to AI.</p>
      </section>
    </div>
  );
}
