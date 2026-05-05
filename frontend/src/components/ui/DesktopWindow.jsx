import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const DesktopWindow = ({
  title,
  subtitle,
  children,
  onClose,
  width = '980px',
  height = 'auto',
  maxHeight = '88vh',
  bodyStyle = {},
  contentStyle = {},
}) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        background: 'rgba(24, 24, 22, 0.54)',
        backdropFilter: 'blur(16px) saturate(120%)',
        WebkitBackdropFilter: 'blur(16px) saturate(120%)',
        ...bodyStyle,
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
        style={{
          width,
          height,
          maxWidth: 'min(96vw, 1320px)',
          maxHeight,
          background: 'var(--color-base)',
          border: '1px solid rgba(31, 32, 29, 0.16)',
          borderRadius: '18px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 32px 90px rgba(21, 22, 19, 0.34)',
          color: 'var(--color-text-1)',
          ...contentStyle,
        }}
      >
        <header
          style={{
            minHeight: '58px',
            display: 'grid',
            gridTemplateColumns: '120px minmax(0, 1fr) 120px',
            alignItems: 'center',
            gap: '16px',
            padding: '0 18px',
            background: 'linear-gradient(180deg, #fbfaf7 0%, #efede7 100%)',
            borderBottom: '1px solid rgba(31, 32, 29, 0.16)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              aria-label="Close window"
              onClick={onClose}
              style={{
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.12)',
                background: '#ff5f57',
                cursor: 'pointer',
                padding: 0,
                display: 'block',
              }}
            />
          </div>

          <div style={{ textAlign: 'center', minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#2b2c28', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ marginTop: '3px', fontSize: '11px', fontWeight: 600, color: '#7a766d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {subtitle}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '13px', height: '13px' }} />
          </div>
        </header>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {children}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default DesktopWindow;
