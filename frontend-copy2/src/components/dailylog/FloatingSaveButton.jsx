import React from 'react';

/**
 * FloatingSaveButton — Sticky save button that appears when form is dirty.
 */
const FloatingSaveButton = ({ isDirty, loading, onSave }) => {
    if (!isDirty) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '32px',
            right: 'max(32px, calc((100vw - var(--max-width)) / 2 + 32px))',
            zIndex: 9999,
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
            <button
                onClick={onSave}
                disabled={loading}
                style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 22px', background: 'var(--bg-card)',
                    border: '1px solid var(--border-accent)', borderRadius: '30px',
                    boxShadow: '0 8px 18px rgba(0,0,0,0.2), 0 0 0 1px rgba(245,166,35,0.15)',
                    color: 'var(--text-1)', fontWeight: 700, fontSize: '13px',
                    cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.transform = 'none'; }}
            >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="animate-ping" style={{ position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: '#f5a623', opacity: 0.7 }}></div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f5a623', position: 'relative' }}></div>
                </div>
                {loading ? 'Saving...' : 'Save Log'}
            </button>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default FloatingSaveButton;
