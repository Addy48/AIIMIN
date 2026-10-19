import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, HelpCircle } from 'lucide-react';

/**
 * ConfirmDialog — branded replacement for window.confirm() / window.prompt().
 * Rendered imperatively via utils/confirm.js so call sites stay a one-liner:
 *   const ok = await confirm('Delete this?');
 *   const ok = await confirm({ title: 'Wipe data', danger: true, requireText: 'delete me' });
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  requireText,
  onConfirm,
  onCancel,
}) {
  const [typed, setTyped] = useState('');
  const inputRef = useRef(null);
  const confirmDisabled = Boolean(requireText) && typed !== requireText;

  useEffect(() => {
    if (open) {
      setTyped('');
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter' && !requireText && !confirmDisabled) onConfirm();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, confirmDisabled, requireText, onConfirm, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onCancel}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 'var(--z-modal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 400,
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--r-xl)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: danger ? 'var(--color-danger-dim)' : 'var(--color-accent-dim)',
                color: danger ? 'var(--color-danger)' : 'var(--color-accent)',
              }}>
                {danger ? <AlertTriangle size={18} /> : <HelpCircle size={18} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 id="confirm-dialog-title" style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--color-text-1)', fontFamily: 'var(--font-sans)' }}>
                  {title || (danger ? 'Are you sure?' : 'Confirm action')}
                </h2>
                {message && (
                  <p id="confirm-dialog-message" style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.55, color: 'var(--color-text-2)' }}>
                    {message}
                  </p>
                )}
              </div>
            </div>

            {requireText && (
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="confirm-dialog-input" style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  Type <strong style={{ color: 'var(--color-text-1)' }}>{requireText}</strong> to confirm
                </label>
                <input
                  id="confirm-dialog-input"
                  ref={inputRef}
                  type="text"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  autoComplete="off"
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    border: '1px solid var(--color-border)', background: 'var(--color-elevated)',
                    color: 'var(--color-text-1)', fontSize: 14,
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                type="button"
                ref={requireText ? undefined : inputRef}
                onClick={onCancel}
                style={{
                  padding: '9px 16px', borderRadius: 8, fontSize: 13.5, fontWeight: 600,
                  border: '1px solid var(--color-border)', background: 'transparent',
                  color: 'var(--color-text-2)', cursor: 'pointer',
                }}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={confirmDisabled}
                style={{
                  padding: '9px 16px', borderRadius: 8, fontSize: 13.5, fontWeight: 700,
                  border: 'none', cursor: confirmDisabled ? 'not-allowed' : 'pointer',
                  opacity: confirmDisabled ? 0.5 : 1,
                  background: danger ? 'var(--color-danger)' : 'var(--color-accent)',
                  color: '#fff',
                }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
