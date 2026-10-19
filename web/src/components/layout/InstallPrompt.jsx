import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

const VISIT_KEY = 'aiimin_page_visits';
const DISMISS_KEY = 'aiimin_install_dismissed';

/**
 * MOB-07 — PWA install banner after 3 page visits.
 */
export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(DISMISS_KEY)) return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const visits = Number(localStorage.getItem(VISIT_KEY) || 0) + 1;
    localStorage.setItem(VISIT_KEY, String(visits));

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    if (visits >= 3 && (ios || deferredPrompt)) {
      setVisible(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, [deferredPrompt]);

  useEffect(() => {
    const visits = Number(localStorage.getItem(VISIT_KEY) || 0);
    if (visits >= 3 && !localStorage.getItem(DISMISS_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  const install = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      dismiss();
    }
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        style={{
          position: 'fixed',
          bottom: 72,
          left: 16,
          right: 16,
          zIndex: 850,
          maxWidth: 480,
          margin: '0 auto',
        }}
      >
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '14px 16px',
            background: 'var(--color-surface-3)',
            border: '1px solid var(--color-border)',
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          }}
        >
          <Download size={20} style={{ color: '#2563EB', flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--color-text-1)', marginBottom: 4 }}>
              Install AIIMIN
            </div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-2)', lineHeight: 1.45 }}>
              {isIOS && !deferredPrompt
                ? 'Tap Share, then "Add to Home Screen" for quick access.'
                : 'Add to your home screen for faster daily logging.'}
            </p>
            {deferredPrompt && (
              <button
                type="button"
                onClick={install}
                className="btn-primary"
                style={{ marginTop: 10, padding: '8px 14px', borderRadius: 8, border: 'none', background: '#2563EB', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
              >
                Install now
              </button>
            )}
          </div>
          <button type="button" onClick={dismiss} aria-label="Dismiss install prompt" style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
