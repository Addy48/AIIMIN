import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const DesktopWindow = ({
  title,
  subtitle,
  children,
  onClose,
  width = '620px',
  height = 'auto',
  maxHeight = '85vh',
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
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        ...bodyStyle,
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
        style={{
          width,
          height,
          maxWidth: 'min(94vw, 680px)',
          maxHeight,
          background: 'var(--color-base, #111)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          color: 'var(--color-text-1)',
          ...contentStyle,
        }}
      >
        {/* Header — dark, consistent with site theme */}
        <header
          style={{
            minHeight: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '0 16px 0 20px',
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}
        >
          {/* Title */}
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--color-text-1)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontFamily: 'var(--font-sans, inherit)',
            }}>
              {title}
            </div>
            {subtitle && (
              <div style={{
                marginTop: '2px',
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--color-text-3)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: 'var(--font-mono, monospace)',
              }}>
                {subtitle}
              </div>
            )}
          </div>

          {/* Close button — prominent X */}
          <button
            type="button"
            aria-label="Close window"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.05)',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-3)',
              flexShrink: 0,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = 'var(--color-text-3)';
            }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </header>

        {/* Body — scrollable */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {children}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default DesktopWindow;
