import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLockup from '../brand/BrandLockup';
import DailyLogForm from '../DailyLogForm';
import MobileDesktopNudge from './MobileDesktopNudge';
import { useAuth } from '../../hooks/useAuth';
import { captureFooterLabel, captureHeroCopy } from './mobileShellCopy';
import '../../styles/mobileCapture.css';

/**
 * Phone web capture shell — intentionally limited.
 * Full Life OS lives on iPad / desktop (and upcoming native app).
 */
export default function MobileCaptureApp() {
  const { user } = useAuth();
  const [showNudge, setShowNudge] = useState(false);
  const [appendSnippet, setAppendSnippet] = useState(null);

  return (
    <div className="mobile-capture">
      <header className="mobile-capture__header">
        <BrandLockup />
        <p className="mobile-capture__eyebrow">Capture</p>
      </header>

      <main className="mobile-capture__main">
        <section className="mobile-capture__hero">
          <h1 className="mobile-capture__title">Today</h1>
          <p className="mobile-capture__sub">
            {captureHeroCopy()}
          </p>
        </section>

        <div className="mobile-capture__chips" role="group" aria-label="Quick capture presets">
          <span className="mobile-capture__chip-label">QUICK:</span>
          <button
            type="button"
            className="mobile-capture__chip"
            onClick={() => setAppendSnippet({ text: 'Paid ', id: Date.now() })}
          >
            + Expense
          </button>
          <button
            type="button"
            className="mobile-capture__chip"
            onClick={() => setAppendSnippet({ text: 'Done: ', id: Date.now() })}
          >
            + Habit
          </button>
          <button
            type="button"
            className="mobile-capture__chip"
            onClick={() => setAppendSnippet({ text: 'Note: ', id: Date.now() })}
          >
            + Note
          </button>
          <button
            type="button"
            className="mobile-capture__chip"
            onClick={() => setAppendSnippet({ text: 'Felt ', id: Date.now() })}
          >
            + Mood
          </button>
        </div>

        <section className="mobile-capture__card" aria-label="Daily log">
          {user ? (
            <DailyLogForm
              user={user}
              enableOfflineQueue
              appendJournalSnippet={appendSnippet}
              onSuccess={() => setShowNudge(true)}
            />
          ) : (
            <p className="mobile-capture__sub">
              <Link to="/login">Sign in</Link> to save today’s log.
            </p>
          )}
        </section>

        <MobileDesktopNudge visible={showNudge} onDismiss={() => setShowNudge(false)} />
      </main>

      <footer className="mobile-capture__footer mobile-capture__footer--shell">
        <span className="mobile-capture__muted">{captureFooterLabel()}</span>
      </footer>
    </div>
  );
}
