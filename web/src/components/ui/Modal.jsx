import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = '500px', hideCloseButton = false }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '24px',
            overflowY: 'auto'
          }}
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              background: 'var(--color-surface, #ffffff)', // Fallback for light mode if variables not set
              border: '1px solid var(--color-border, #e5e7eb)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: maxWidth,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 48px rgba(0,0,0,0.2), 0 0 0 1px var(--color-border, rgba(0,0,0,0.05))',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
          >
            {/* Header */}
            {title && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '24px 32px',
                borderBottom: '1px solid var(--color-border, #e5e7eb)'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-1, #111827)', margin: 0 }}>
                  {title}
                </h2>
                {!hideCloseButton && (
                  <button 
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    style={{
                      background: 'var(--color-elevated, #f3f4f6)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '44px',
                      height: '44px',
                      minWidth: '44px',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--color-text-2, #4b5563)',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                      marginLeft: '16px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-border, #e5e7eb)';
                      e.currentTarget.style.color = 'var(--color-text-1, #111827)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--color-elevated, #f3f4f6)';
                      e.currentTarget.style.color = 'var(--color-text-2, #4b5563)';
                    }}
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div style={{ padding: '32px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
              {children}
            </div>
            {footer && (
              <div style={{
                padding: '16px 32px 24px',
                borderTop: '1px solid var(--color-border, #e5e7eb)',
                flexShrink: 0,
                background: 'var(--color-surface, #ffffff)',
              }}>
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
