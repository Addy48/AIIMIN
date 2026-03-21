import React from 'react';

const MobileSaveBar = ({ onSave, saving, lastSaved, isDirty, estimatedXP = 0 }) => (
    <div style={{
        position: 'sticky', bottom: 0, zIndex: 100,
        background: 'var(--bg-primary)', borderTop: '1px solid var(--border)',
        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px',
    }}>
        <button
            onClick={onSave}
            disabled={saving || !isDirty}
            style={{
                flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                fontWeight: 700, fontSize: '14px', cursor: saving || !isDirty ? 'default' : 'pointer',
                background: saving ? 'var(--bg-elevated)' : isDirty ? 'var(--accent)' : 'var(--bg-elevated)',
                color: saving ? 'var(--text-3)' : isDirty ? '#fff' : 'var(--text-3)',
                transition: 'all 0.2s', minHeight: '48px',
                opacity: saving ? 0.6 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
            {saving ? 'Saving...' : isDirty ? (
                <>
                    ⚡ SAVE{estimatedXP > 0 && <span style={{ fontWeight: 500, fontSize: '12px', opacity: 0.9 }}>— earn ~{estimatedXP} XP</span>}
                </>
            ) : 'Saved ✓'}
        </button>
        {lastSaved && (
            <span style={{ fontSize: '10px', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                {lastSaved}
            </span>
        )}
    </div>
);

export default MobileSaveBar;
