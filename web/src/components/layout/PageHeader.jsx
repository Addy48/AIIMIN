import React from 'react';

const PageHeader = ({ title, subtitle, icon, rightContent }) => {
  return (
    <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {icon && (
          <div style={{
            width: '64px', height: '64px', borderRadius: '20px',
            background: 'linear-gradient(135deg, var(--color-accent), #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', color: '#fff', flexShrink: 0,
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
          }}>
            {icon}
          </div>
        )}
        <div>
          {subtitle && (
            <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-accent)', marginBottom: '4px' }}>
              {subtitle}
            </div>
          )}
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-1)', margin: 0, letterSpacing: '-0.03em', fontFamily: 'var(--font-serif)' }}>
            {title}
          </h1>
        </div>
      </div>
      {rightContent && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {rightContent}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
