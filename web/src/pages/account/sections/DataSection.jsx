import React, { useState } from 'react';
import { apiDelete, apiGet, apiPost } from '../../../utils/api';
import toast from '../../../utils/toast';

const WIPE_PHRASE = 'WIPE ALL DATA';

/** Clear client life-data caches; keep theme / session prefs. */
function clearClientLifeCaches() {
  const keep = /^(aiimin_theme|aiimin-theme|theme|better-auth)/i;
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (key.startsWith('aiimin_') && !keep.test(key)) toRemove.push(key);
  }
  toRemove.forEach((key) => localStorage.removeItem(key));
}

export default function DataSection() {
  const [confirmText, setConfirmText] = useState('');
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [wipeText, setWipeText] = useState('');
  const [showWipeSheet, setShowWipeSheet] = useState(false);
  const [wiping, setWiping] = useState(false);

  const download = async () => {
    try {
      const data = await apiGet('/account/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aiimin-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export downloaded.');
    } catch {
      toast.error('Export failed. Try again.');
    }
  };

  const wipeLifeData = async () => {
    if (wipeText !== WIPE_PHRASE || wiping) return;
    setWiping(true);
    const tid = toast.loading('Wiping life data…');
    try {
      await apiPost('/account/wipe-life-data', { confirm: WIPE_PHRASE });
      clearClientLifeCaches();
      toast.update(tid, 'All life data cleared. Account kept — fresh start.', 'success');
      setShowWipeSheet(false);
      setWipeText('');
      setTimeout(() => window.location.assign('/overview'), 900);
    } catch (err) {
      toast.update(tid, err?.message || 'Wipe failed', 'error');
    } finally {
      setWiping(false);
    }
  };

  const deleteAccount = async () => {
    if (confirmText !== 'DELETE') return;
    try {
      await apiDelete('/account', { confirm: 'DELETE' });
      toast.success('Account deleted.');
      window.location.href = '/login';
    } catch {
      toast.error('Something went wrong. Try again.');
    }
  };

  return (
    <div>
      <h1 className="text-h1" style={{ marginBottom: 24 }}>Data & Export</h1>

      <section className="card" style={{ padding: 24, marginBottom: 20 }}>
        <p className="text-body" style={{ marginBottom: 16 }}>Download all your data as JSON.</p>
        <button
          type="button"
          onClick={download}
          style={{ padding: '12px 20px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}
        >
          Download all my data
        </button>
      </section>

      <section className="card" style={{ padding: 24, marginBottom: 20, borderColor: 'rgba(239,68,68,0.25)' }}>
        <h2 className="text-h3" style={{ marginBottom: 12 }}>Reset life data (keep account)</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-2)', marginBottom: 16 }}>
          Deletes habits, journals, goals, money, calendar, family, lab, discipline, and related logs for this login.
          Use this on the seed/demo account to start fresh without creating a new user. Login stays.
        </p>
        {!showWipeSheet ? (
          <button
            type="button"
            onClick={() => setShowWipeSheet(true)}
            style={{
              padding: '12px 20px',
              background: 'rgba(239,68,68,0.08)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Wipe all life data
          </button>
        ) : (
          <div
            style={{
              marginTop: 8,
              padding: 16,
              borderRadius: 12,
              border: '1px solid rgba(239,68,68,0.35)',
              background: 'rgba(239,68,68,0.06)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--color-text-2)', marginBottom: 12 }}>
              Type <strong>{WIPE_PHRASE}</strong> to confirm. Cannot undo.
            </p>
            <input
              value={wipeText}
              onChange={(e) => setWipeText(e.target.value)}
              placeholder={WIPE_PHRASE}
              style={{
                width: '100%',
                padding: 12,
                marginBottom: 12,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface-3)',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={wipeLifeData}
                disabled={wipeText !== WIPE_PHRASE || wiping}
                style={{
                  padding: '12px 20px',
                  background: 'var(--color-danger, #ef4444)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 700,
                  cursor: wipeText === WIPE_PHRASE && !wiping ? 'pointer' : 'not-allowed',
                  opacity: wipeText === WIPE_PHRASE && !wiping ? 1 : 0.5,
                }}
              >
                {wiping ? 'Wiping…' : 'Confirm wipe'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowWipeSheet(false);
                  setWipeText('');
                }}
                style={{
                  padding: '12px 20px',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--color-text-2)',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="card" style={{ padding: 24, borderColor: 'var(--color-border)' }}>
        <h2 className="text-h3" style={{ marginBottom: 12 }}>Account deletion</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-2)', marginBottom: 16 }}>
          Permanent and irreversible. Export your data first if you need a copy.
        </p>
        {!showDeleteSheet ? (
          <button
            type="button"
            onClick={() => setShowDeleteSheet(true)}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              color: 'var(--color-text-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Manage account deletion
          </button>
        ) : (
          <div
            style={{
              marginTop: 8,
              padding: 16,
              borderRadius: 12,
              border: '1px solid rgba(239,68,68,0.35)',
              background: 'rgba(239,68,68,0.06)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--color-text-2)', marginBottom: 12 }}>
              This permanently deletes your account and all data. Type DELETE to confirm.
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              style={{
                width: '100%',
                padding: 12,
                marginBottom: 12,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface-3)',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={deleteAccount}
                disabled={confirmText !== 'DELETE'}
                style={{
                  padding: '12px 20px',
                  background: 'var(--color-danger, #ef4444)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontWeight: 700,
                  cursor: confirmText === 'DELETE' ? 'pointer' : 'not-allowed',
                  opacity: confirmText === 'DELETE' ? 1 : 0.5,
                }}
              >
                Delete my account
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteSheet(false);
                  setConfirmText('');
                }}
                style={{
                  padding: '12px 20px',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--color-text-2)',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
