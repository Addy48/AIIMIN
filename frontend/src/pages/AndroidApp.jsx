import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Smartphone, Monitor, Shield, Radio } from 'lucide-react';
import Wordmark from '../components/brand/Wordmark';
import '../styles/appPage.css';

/**
 * Public `/app` — Android companion status.
 * No APK hosting. Waitlist + Play announcement path only.
 */

const STATUS = [
  {
    label: 'Now',
    title: 'Closed device testing',
    body: 'Native Android V3 (Kotlin) is in private testing on founder devices — Today, Capture, Money, Lab, Config.',
  },
  {
    label: 'Next',
    title: 'Invited tester wave',
    body: 'VIP testers (register by 30 Sep 2026) get companion builds before public listing.',
  },
  {
    label: 'Public',
    title: 'Play Store listing',
    body: 'No public APK, no sideload link on this site. When Play opens, waitlist members hear first.',
  },
];

const SURFACES = [
  { name: 'Today', hint: 'Day sheet · steps · screen · score' },
  { name: 'Capture', hint: 'Log · voice · scan · journal' },
  { name: 'Money', hint: 'Ledger · share/paste payment alerts' },
  { name: 'Lab', hint: 'Correlations from your own phone day' },
  { name: 'Config', hint: 'Theme · connections · export pack' },
];

export default function AndroidApp() {
  return (
    <div className="app-page">
      <Helmet>
        <title>AIIMIN Android — Status &amp; access</title>
        <meta
          name="description"
          content="AIIMIN native Android companion: closed device testing now, Play Store later. No public APK. Join the waitlist for founding access."
        />
        <link rel="canonical" href="https://aiimin.in/app" />
        <meta property="og:title" content="AIIMIN Android — closed testing" />
        <meta
          property="og:description"
          content="Native Android Life OS companion in private testing. Web command center at aiimin.in. No APK download here."
        />
        <meta property="og:url" content="https://aiimin.in/app" />
      </Helmet>

      <header className="app-page__top">
        <Link to="/" className="app-page__brand" aria-label="AIIMIN home">
          <Wordmark size={22} color="currentColor" />
        </Link>
        <nav className="app-page__nav">
          <Link to="/">Waitlist</Link>
          <Link to="/brand">Brand</Link>
          <Link to="/login">Sign in</Link>
        </nav>
      </header>

      <main>
        <section className="app-page__hero">
          <p className="app-page__eyebrow">Android companion</p>
          <h1>
            Native app.
            <span className="app-page__hero-em"> Not a phone website.</span>
          </h1>
          <p className="app-page__lede">
            Same account as the desktop Life OS. Built for capture, health, money review, and the day loop —
            while dense reports stay on laptop. <strong>No APK on this site.</strong>
          </p>
          <div className="app-page__cta-row">
            <a href="/#waitlist-join" className="app-page__btn app-page__btn--primary">
              Join waitlist
            </a>
            <Link to="/m" className="app-page__btn app-page__btn--ghost">
              Phone web · capture only
            </Link>
          </div>
          <p className="app-page__status-pill" role="status">
            <Radio size={14} aria-hidden />
            Status · Closed device testing · Play not listed
          </p>
        </section>

        <section className="app-page__grid" aria-label="Access path">
          {STATUS.map((row) => (
            <article key={row.label} className="app-page__card">
              <p className="app-page__card-label">{row.label}</p>
              <h2>{row.title}</h2>
              <p>{row.body}</p>
            </article>
          ))}
        </section>

        <section className="app-page__surfaces">
          <div className="app-page__surfaces-head">
            <Smartphone size={18} aria-hidden />
            <h2>What the companion is for</h2>
          </div>
          <ul>
            {SURFACES.map((s) => (
              <li key={s.name}>
                <strong>{s.name}</strong>
                <span>{s.hint}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="app-page__split">
          <article>
            <Monitor size={18} aria-hidden />
            <h2>Desktop web</h2>
            <p>
              Full Life OS at <a href="https://aiimin.in">aiimin.in</a> — reports, budgets, vault, deep editing.
              That is the command surface.
            </p>
          </article>
          <article>
            <Shield size={18} aria-hidden />
            <h2>Privacy posture</h2>
            <p>
              No SMS inbox permission. Payment alerts only via share, paste, or opt-in notification access —
              you approve before anything hits the ledger. Details in{' '}
              <Link to="/privacy">Privacy</Link>.
            </p>
          </article>
        </section>

        <section className="app-page__bottom-cta">
          <h2>Want the Play drop?</h2>
          <p>
            Reserve waitlist access. Founding perks lock at signup. We do not publish sideload APKs from the website.
          </p>
          <a href="/#waitlist-join" className="app-page__btn app-page__btn--primary">
            Reserve my spot
          </a>
        </section>
      </main>

      <footer className="app-page__foot">
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/security">Security</Link>
        <Link to="/contact">Contact</Link>
      </footer>
    </div>
  );
}
