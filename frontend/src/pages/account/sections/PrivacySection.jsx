import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { apiPatch } from '../../../utils/api';
import SecuritySection from './SecuritySection';

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
