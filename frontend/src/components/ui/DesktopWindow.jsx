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
  maxWidth = 'min(94vw, 680px)',
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
          maxWidth,
          maxHeight,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px var(--border)',
          color: 'var(--text-1)',
          ...contentStyle,
        }}
      >
        {/* Header — dark, consistent with site theme */}
        <header
          style={{
            minHeight: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '24px 32px 20px',
            background: 'transparent',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          {/* Title */}
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 800,
              color: 'var(--text-1)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontFamily: 'var(--font-sans, inherit)',
            }}>
              {title}
            </div>
            {subtitle && (
              <div style={{
                marginTop: '4px',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-3)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: 'var(--font-mono, monospace)',
              }}>
                {subtitle}
              </div>
            )}
          </div>

          {/* Close button — Back to Lab */}
          <button
            type="button"
            aria-label="Back to Lab"
            onClick={onClose}
            style={{
              height: '36px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'var(--bg-elevated)',
              cursor: 'pointer',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-1)',
              fontSize: '13px',
              fontWeight: 700,
              flexShrink: 0,
              transition: 'all 0.15s',
              gap: '6px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-card)';
              e.currentTarget.style.borderColor = 'var(--color-accent)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--bg-elevated)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <span>Back to Lab</span>
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
