import React, { useState } from 'react';
import { apiDelete, apiGet } from '../../../utils/api';
import toast from '../../../utils/toast';

export default function DataSection() {
  const [confirmText, setConfirmText] = useState('');

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
          className="btn-action"
          style={{ padding: '12px 20px', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}
        >
          Download all my data
        </button>
        <p className="text-caption" style={{ marginTop: 12 }}>Server region: Mumbai, India</p>
      </section>

      <section className="card" style={{ padding: 24, borderColor: 'var(--color-danger)' }}>
        <h2 className="text-h3" style={{ color: 'var(--color-danger)', marginBottom: 12 }}>Delete account</h2>
        <p className="text-sm" style={{ color: 'var(--color-text-2)', marginBottom: 16 }}>
          This permanently deletes your account and all data. Type DELETE to confirm.
        </p>
        <input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="DELETE"
          style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface-3)' }}
        />
        <button
          type="button"
          onClick={deleteAccount}
          disabled={confirmText !== 'DELETE'}
          style={{ padding: '12px 20px', background: 'var(--color-danger)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: confirmText === 'DELETE' ? 'pointer' : 'not-allowed', opacity: confirmText === 'DELETE' ? 1 : 0.5 }}
        >
          Delete my account
        </button>
      </section>
    </div>
  );
}
