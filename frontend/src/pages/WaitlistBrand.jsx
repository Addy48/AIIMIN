import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { ArchBracketMark, pickMarkColors } from '../components/brand/archBracketMark';
import Wordmark from '../components/brand/Wordmark';
import useWaitlistSurfaceTheme from '../hooks/useWaitlistSurfaceTheme';
import '../styles/waitlistLanding.css';
import './brandPage.css';

export default function WaitlistBrand() {
  const { isLight, toggleWaitlistTheme } = useWaitlistSurfaceTheme();

  return (
    <div className="brand-page waitlist-page waitlist-brand-page" data-waitlist-surface="brand">
      <header className="brand-nav" aria-label="Brand navigation">
        <div className="brand-nav-inner">
          <Link to="/" className="brand-lockup-link" aria-label="Back to AIIMIN waitlist">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to waitlist</span>
          </Link>
          <button
            type="button"
            className="waitlist-btn waitlist-btn-ghost waitlist-btn-theme"
            onClick={toggleWaitlistTheme}
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {isLight ? <Moon size={15} /> : <Sun size={15} />}
            <span>{isLight ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </header>

      <main className="brand-main brand-main--story">
        <section className="brand-hero brand-hero--minimal">
          <div className="brand-logo-showcase">
            <ArchBracketMark size={88} withChip colors={pickMarkColors(isLight, { variant: 'light' })} />
            <Wordmark size={42} color="var(--color-text-1)" className="brand-hero-wordmark" />
          </div>
          <p className="brand-kicker">Personal Life OS</p>
        </section>

        <section className="brand-story-section">
          <p className="waitlist-section-label">The name</p>
          <h2>What AIIMIN means</h2>
          <p className="brand-story-copy">
            <strong>AIIMIN</strong> is shorthand for a personal operating system — your daily command layer for habits,
            money, focus, and mood. The name reads like &ldquo;aim in&rdquo;: aim inward, aim with intention, run one
            coherent system instead of five disconnected apps.
          </p>
          <p className="brand-story-copy">
            It is built for Indian students and early professionals who want structure without corporate bloat —
            a single screen that compounds momentum over time.
          </p>
        </section>

        <section className="brand-story-section">
          <p className="waitlist-section-label">The mark</p>
          <h2>What the logo represents</h2>
          <div className="brand-mark-explainer">
            <div className="brand-mark-visual">
              <ArchBracketMark size={120} withChip colors={pickMarkColors(isLight, { variant: 'light' })} />
            </div>
            <div className="brand-mark-copy">
              <p>
                The <strong>arch bracket</strong> frames upward momentum — structured growth inside a clear boundary.
              </p>
              <p>
                The nested <strong>triangles</strong> point toward a single focal dot: one daily target, one dashboard,
                one place to log and review.
              </p>
              <p>
                The <strong>ember dot</strong> is the accent of action — the small win you log today that compounds
                into a streak, a rank, and a clearer picture of your week.
              </p>
              <p className="brand-mark-note">
                Editor Pick (light) is the canonical mark for the website, waitlist, and product UI.
              </p>
            </div>
          </div>
        </section>

        <section className="brand-story-cta">
          <Link to="/" className="waitlist-btn waitlist-btn-primary">Join the waitlist</Link>
          <Link to="/privacy" className="brand-inline-link">Privacy policy</Link>
        </section>
      </main>

      <footer className="brand-footer brand-footer--minimal">
        <Wordmark size={18} color="var(--color-text-2)" />
        <p>© {new Date().getFullYear()} AIIMIN</p>
      </footer>
    </div>
  );
}
