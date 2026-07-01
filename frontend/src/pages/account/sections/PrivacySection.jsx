import React, { useState } from 'react';
import { apiPatch } from '../../../utils/api';

export default function PrivacySection({ profile, onProfileUpdate }) {
  const [journalOptIn, setJournalOptIn] = useState(profile?.ai_journal_opt_in !== false);
  const [sportsAi, setSportsAi] = useState(profile?.ai_sports_opt_in !== false);

  const save = async (patch) => {
    const updated = await apiPatch('/account/user-profile', patch);
    onProfileUpdate?.(updated);
  };

  return (
    <div>
      <h1 className="text-h1" style={{ marginBottom: 24 }}>Privacy & Security</h1>

      <section className="card" style={{ padding: 24, marginBottom: 16 }}>
        <h2 className="text-h3" style={{ marginBottom: 12 }}>Security</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-2)', marginBottom: 8 }}>
          Authentication is managed through your sign-in provider. Use your profile menu for password and 2FA settings.
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-3)' }}>
          Google: connected · Sessions: managed by auth provider
        </p>
      </section>

      <section className="card" style={{ padding: 24 }}>
        <h2 className="text-h3" style={{ marginBottom: 16 }}>AI & data privacy</h2>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span className="text-body">Allow AI to analyze journal entries</span>
          <input
            type="checkbox"
            checked={journalOptIn}
            onChange={(e) => {
              setJournalOptIn(e.target.checked);
              save({ ai_journal_opt_in: e.target.checked });
            }}
          />
        </label>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span className="text-body">Allow AI sports summaries</span>
          <input
            type="checkbox"
            checked={sportsAi}
            onChange={(e) => {
              setSportsAi(e.target.checked);
              save({ ai_sports_opt_in: e.target.checked });
            }}
          />
        </label>
        <p className="text-caption">Finance data is never sent to AI.</p>
      </section>
    </div>
  );
}
