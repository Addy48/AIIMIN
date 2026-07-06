import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { ArchBracketMark, EDITOR_PICK } from '../components/brand/archBracketMark';
import Wordmark from '../components/brand/Wordmark';
import useWaitlistSurfaceTheme from '../hooks/useWaitlistSurfaceTheme';
import '../styles/waitlistLanding.css';
import './brandPage.css';

const BRAND_COLORS = [
  { label: 'Forest', value: '#1B4332', bg: '#1B4332' },
  { label: 'Accent', value: '#2D6A4F', bg: '#2D6A4F' },
  { label: 'Ember', value: '#FF6B35', bg: '#FF6B35' },
  { label: 'Parchment', value: '#EDE4D3', bg: '#EDE4D3' },
  { label: 'Ink', value: '#14171A', bg: '#14171A' },
  { label: 'Mist', value: '#6B7280', bg: '#6B7280' },
];

const PILLARS = [
  { title: 'One screen', desc: 'Habits, money, focus, mood, and wins in a single daily loop — no app hopping.' },
  { title: 'Pattern intelligence', desc: 'Weekly insights connect sleep, spend, and consistency so you act on signal, not noise.' },
  { title: 'Privacy first', desc: 'Your behavioural archive stays yours. No ads, no tracking pixels, no data harvesting.' },
  { title: 'India-first pricing', desc: 'Explore free forever. Core at ₹29/mo. Pro founding price ₹49/mo for waitlist members.' },
];

const COMPLIANCE = [
  'Google API Limited Use Policy compliant',
  'Read-only calendar and YouTube access',
  'OAuth tokens encrypted at rest',
  'User data deletion on request',
  'HTTPS end-to-end encryption',
  'Revoke Google access anytime',
];

export default function WaitlistBrand() {
  const { isLight, toggleWaitlistTheme } = useWaitlistSurfaceTheme();

  return (
    <div className="brand-page waitlist-page waitlist-brand-page" data-waitlist-surface="brand">
      <header className="brand-nav" aria-label="Brand navigation">
        <div className="brand-nav-inner">
          <Link to="/" className="brand-lockup-link" aria-label="Back to AIIMIN waitlist">
            <ArchBracketMark size={36} withChip colors={EDITOR_PICK} className="brand-nav-mark" />
            <Wordmark size={22} color="var(--color-text-1)" />
          </Link>
          <div className="brand-nav-actions">
            <button
              type="button"
              className="waitlist-btn waitlist-btn-ghost waitlist-btn-theme"
              onClick={toggleWaitlistTheme}
              aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {isLight ? <Moon size={15} /> : <Sun size={15} />}
              <span>{isLight ? 'Dark' : 'Light'}</span>
            </button>
            <Link to="/privacy" className="brand-nav-link">Privacy</Link>
            <Link to="/login" className="waitlist-btn waitlist-btn-outline brand-nav-cta">Enter system</Link>
          </div>
        </div>
      </header>

      <main className="brand-main">
        <section className="brand-hero">
          <div className="brand-hero-lockup">
            <ArchBracketMark size={96} withChip colors={EDITOR_PICK} />
          </div>
          <Wordmark size={48} color="var(--color-text-1)" className="brand-hero-wordmark" />
          <p className="brand-kicker">Personal Life OS</p>
          <h1>
            Your habits, money, focus, and mood.
            <br />
            <span className="brand-hero-accent">One system. Every day.</span>
          </h1>
          <p className="brand-hero-copy">
            AIIMIN is a data-dense personal dashboard built for Indian students and early professionals.
            Track behaviour, see patterns, and compound momentum — without five separate apps.
          </p>
          <div className="brand-hero-links">
            <Link to="/" className="waitlist-btn waitlist-btn-primary">Join the waitlist</Link>
            <a href="mailto:founders@aiimin.in" className="waitlist-btn waitlist-btn-ghost">Contact founders</a>
          </div>
        </section>

        <section className="brand-section">
          <p className="waitlist-section-label">Identity</p>
          <h2>Logo &amp; wordmark</h2>
          <p className="brand-section-copy">
            The arch bracket mark represents upward momentum and structured growth.
            Pair it with the Bodoni Moda wordmark — never stretch, recolour the ember dot, or place on busy photography.
          </p>
          <div className="brand-logo-grid">
            <div className="brand-logo-card brand-logo-card--light">
              <ArchBracketMark size={72} withChip colors={EDITOR_PICK} />
              <Wordmark size={24} color="#14171A" />
              <span className="brand-logo-label">Light / Editor pick</span>
            </div>
            <div className="brand-logo-card brand-logo-card--dark">
              <ArchBracketMark size={72} withChip colors={EDITOR_PICK} />
              <Wordmark size={24} color="#EDE4D3" />
              <span className="brand-logo-label">Dark surfaces</span>
            </div>
            <div className="brand-logo-card brand-logo-card--mark">
              <img src="/AIIMIN_logo.svg" alt="AIIMIN logo asset" width={72} height={72} />
              <span className="brand-logo-label">OAuth asset · AIIMIN_logo.svg</span>
            </div>
          </div>
        </section>

        <section className="brand-section">
          <p className="waitlist-section-label">Palette</p>
          <h2>Forest green system</h2>
          <p className="brand-section-copy">
            Nordic parchment backgrounds, forest green accents, and ember orange for emphasis — aligned with the waitlist and product UI.
          </p>
          <div className="brand-color-row">
            {BRAND_COLORS.map((c) => (
              <div key={c.label} className="brand-color-chip">
                <div className="brand-color-swatch" style={{ background: c.bg }} />
                <span className="brand-color-name">{c.label}</span>
                <span className="brand-color-value">{c.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="brand-section">
          <p className="waitlist-section-label">Product thesis</p>
          <h2>Four pillars</h2>
          <div className="brand-pillar-grid">
            {PILLARS.map((p) => (
              <article key={p.title} className="waitlist-card brand-pillar-card">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="brand-section">
          <p className="waitlist-section-label">Compliance</p>
          <h2>Google API &amp; privacy</h2>
          <p className="brand-section-copy">
            AIIMIN uses Google APIs strictly to display the authenticated user&apos;s own data inside their private dashboard.
            All use is read-only and governed by the{' '}
            <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
              Google API Services User Data Policy
            </a>.
          </p>
          <ul className="brand-compliance-list">
            {COMPLIANCE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="brand-legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/data-deletion">Data Deletion</Link>
            <Link to="/security">Security</Link>
            <Link to="/brand/system">Product system brand</Link>
          </div>
        </section>
      </main>

      <footer className="brand-footer">
        <div className="brand-footer-lockup">
          <ArchBracketMark size={28} withChip colors={EDITOR_PICK} />
          <Wordmark size={18} color="var(--color-text-2)" />
        </div>
        <p>Built by Aaditya Upadhyay · B.Tech CSE, Manipal · © {new Date().getFullYear()} AIIMIN</p>
      </footer>
    </div>
  );
}
