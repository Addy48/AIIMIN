import React, { useEffect, useState } from 'react';

const DISMISS_KEY = 'aiimin_desktop_nudge_dismissed';

export default function MobileDesktopNudge({ visible, onDismiss }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (localStorage.getItem(DISMISS_KEY) === '1') return;
    setShow(true);
  }, [visible]);

  if (!show) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setShow(false);
    onDismiss?.();
  };

  return (
    <aside className="mobile-desktop-nudge" role="status" aria-live="polite">
      <p>Review your week, habits, and finances on desktop or the Android app.</p>
      <div className="mobile-desktop-nudge__actions">
        <a
          href="https://aiimin.in/overview"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-desktop-nudge__link"
        >
          Open on desktop →
        </a>
        <button type="button" className="mobile-desktop-nudge__dismiss" onClick={dismiss}>
          Dismiss
        </button>
      </div>
    </aside>
  );
}
