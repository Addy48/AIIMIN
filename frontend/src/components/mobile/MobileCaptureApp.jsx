import React from 'react';
import { Link } from 'react-router-dom';
import BrandLockup from '../brand/BrandLockup';
import DailyLogForm from '../DailyLogForm';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/mobileCapture.css';

/**
 * Phone web capture shell — intentionally limited.
 * Full Life OS lives on iPad / desktop (and upcoming native app).
 */
export default function MobileCaptureApp() {
  const { user } = useAuth();

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
            Log the day here. Full Life OS — insights, pipelines, focus room — opens on iPad or desktop.
            A native phone app is coming.
          </p>
        </section>

        <section className="mobile-capture__card" aria-label="Daily log">
          {user ? (
            <DailyLogForm user={user} />
          ) : (
            <p className="mobile-capture__sub">
              <Link to="/login">Sign in</Link> to save today’s log.
            </p>
          )}
        </section>
      </main>

      <footer className="mobile-capture__footer">
        <Link to="/account" className="mobile-capture__link">Account</Link>
        <span aria-hidden>·</span>
        <span className="mobile-capture__muted">Web capture only</span>
      </footer>
    </div>
  );
}
