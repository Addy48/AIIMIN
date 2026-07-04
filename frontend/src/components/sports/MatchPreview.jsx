import React from 'react';

export default function MatchPreview({ preview, previewLoading }) {
  return (
    <div style={{
      background: 'rgba(99, 102, 241, 0.05)',
      border: '1px dashed rgba(99, 102, 241, 0.25)',
      borderRadius: '12px',
      padding: '12px 16px',
      marginTop: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#818CF8' }}>
        AI Arena Preview
      </div>
      <div style={{ fontSize: '13px', color: 'var(--color-text-2)', lineHeight: '1.4' }}>
        {preview || 'Preview not available.'}
        {previewLoading && (
          <span style={{ display: 'block', marginTop: 6, fontSize: 11, color: 'var(--color-text-3)' }}>
            Enhancing with AI...
          </span>
        )}
      </div>
    </div>
  );
}
