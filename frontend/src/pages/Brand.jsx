import React, { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArchBracketMark, pickMarkColors } from '../components/brand/archBracketMark';
import Wordmark from '../components/brand/Wordmark';
import { useAccessGate } from '../hooks/useAccessGate';
import './brandPage.css';

/**
 * LOCKED `/brand` — Human Momentum manifesto.
 * Always light (warm ivory). Cursor ember spotlight kept. No colour-system panel.
 */

const PILLARS = [
  { title: 'Absolute Precision', desc: 'Every interaction is minimal and intentional. No feature bloat, no decorative chrome. Extreme utility only.' },
  { title: 'Feedback Loops', desc: 'Every input produces immediate, visible output. Log behavior → score momentum → extract insight → take action.' },
  { title: 'Behavioral Intelligence', desc: 'Surface deep, invisible patterns. Predict mental drift before it compounds into regression.' },
  { title: 'Data Sovereignty', desc: 'Your behavioural archive never leaves your control. Full export, full ownership, zero harvesting.' },
  { title: 'Momentum Engineering', desc: 'Systems built to compound consistency — intelligent streaks, contextual scores, ritual reinforcement.' },
  { title: 'Deep Mode State', desc: 'When intense focus begins, noise disappears. No sidebar. No notifications. Just you and the work.' },
  { title: 'Dimensional Analysis', desc: 'Correlate sleep, deep focus, mood variance, and spending into one behavioural intelligence layer.' },
  { title: 'Disciplined Growth', desc: 'Stable foundations first. Every feature earns its place through validated momentum generation.' },
  { title: 'Adaptive Interventions', desc: 'The system evolves with your habits. Push when momentum is high. Catch you when you drift.' },
];

const STORAGE = [
  {
    key: 'Where it lives',
    val: (
      <>
        Account data and behavioural logs sit in <strong>Supabase Postgres</strong> with row-level isolation. API traffic runs on our backend host; the app UI ships from <strong>Vercel</strong>.
      </>
    ),
  },
  {
    key: 'What we store',
    val: (
      <>
        Habits, goals, journal, notes, finance, focus sessions, calendar sync metadata, and preferences — tied to your <strong>OS ID</strong>. Not sold. Not used for ads.
      </>
    ),
  },
  {
    key: 'What leaves',
    val: (
      <>
        Google Calendar / YouTube tokens stay <strong>encrypted at rest</strong>. Revoke Google access anytime. Full account deletion removes your archive on request.
      </>
    ),
  },
];

const LEGAL = [
  { to: '/privacy', label: 'Privacy Policy', code: '01' },
  { to: '/terms', label: 'Terms of Service', code: '02' },
  { to: '/data-deletion', label: 'Data Deletion', code: '03' },
  { to: '/security', label: 'Security', code: '04' },
  { to: '/about', label: 'About', code: '05' },
  { to: '/contact', label: 'Contact', code: '06' },
];

const LAYERS = [
  { role: 'Interface', tech: 'React + design tokens', detail: 'Edge-rendered on Vercel — zero-latency UI for daily capture.' },
  { role: 'Compute', tech: 'Express API', detail: 'api.aiimin.in on our EC2 host — intelligence, auth, and sync.' },
  { role: 'Archive', tech: 'Supabase Postgres', detail: 'Row-level security. Your behavioural history stays yours.' },
];

const RAIL = [
  { href: '#problem', label: '01 Problem' },
  { href: '#pillars', label: '02 Pillars' },
  { href: '#storage', label: '03 Storage' },
  { href: '#accountability', label: '04 Accountable' },
  { href: '#roadmap', label: '05 Roadmap' },
  { href: '#architecture', label: '06 Stack' },
];

const WE_ARE = [
  'A Life OS for intent, not engagement',
  'Private behavioural archive you own',
  'Cheap daily capture, honest patterns',
];

const WE_REFUSE = [
  'Ad tracking and data harvesting',
  'Streak shame and wellness theater',
  'Feature bloat that dilutes focus',
];

/** Brand-surface summary — enforceable via linked Privacy / Terms / Deletion / Security. */
const HARD_COMMITMENTS = [
  { title: 'No sale of personal data', body: 'We do not sell, rent, or commercially transfer your personal data to third parties.' },
  { title: 'No ads / no tracking pixels', body: 'No advertising cookies, marketing scripts, or behavioural ad profiles on the platform.' },
  { title: 'Google Limited Use', body: 'Google API data is used only to show your own data in your dashboard — not ads, not model training, not third-party transfer.' },
  { title: 'Humans do not browse your Google data', body: 'No human reads your Google-connected data except at your explicit request for support, or as required by law.' },
  { title: 'Your content stays yours', body: 'Goals, journal, notes, and logs you enter remain your property. We only process them to run the Service.' },
  { title: 'Minimum OAuth scopes', body: 'Calendar / YouTube / Drive integrations are read-oriented. You can revoke Google access anytime.' },
];

const USER_RIGHTS = [
  { title: 'Access', body: 'Request a copy of the personal data we hold about you.' },
  { title: 'Correction', body: 'Update profile and account details in Settings / dashboard.' },
  { title: 'Deletion', body: 'Delete account in-app or request wipe — active purge immediate; backups within 30 days.' },
  { title: 'Revoke Google', body: 'Remove AIIMIN from Google Account Permissions — Google features cut off immediately.' },
  { title: 'Export / leave', body: 'Stop using the Service anytime. Deletion path is documented and linked below.' },
  { title: 'Complain', body: 'Email founders for privacy, security, or policy disputes. We respond as the operator of record.' },
];

const HOLD_US = [
  {
    step: '01',
    title: 'Delete your archive',
    body: 'Settings → Delete Account, or email a deletion request. Active data purged; backups cleared within 30 days.',
    to: '/data-deletion',
    label: 'Data deletion policy',
  },
  {
    step: '02',
    title: 'Cut Google access',
    body: 'Revoke AIIMIN in Google Account Permissions. That kills Calendar / YouTube / Drive tokens for us.',
    href: 'https://myaccount.google.com/permissions',
    label: 'Google permissions',
    external: true,
  },
  {
    step: '03',
    title: 'Open a formal request',
    body: 'Privacy, correction, access, security incident, or dispute — write founders@aiimin.in with a clear subject.',
    href: 'mailto:founders@aiimin.in',
    label: 'Email founders',
  },
  {
    step: '04',
    title: 'Read the binding pages',
    body: 'Privacy, Terms, Security, and Deletion are the enforceable documents. This page is a summary, not a substitute.',
    to: '/privacy',
    label: 'Privacy Policy',
  },
];

const SCOPES = [
  { scope: 'openid / email / profile', use: 'Sign-in identity only' },
  { scope: 'calendar.readonly (+ events read)', use: 'Show your schedule — we do not create/edit/delete events' },
  { scope: 'youtube.readonly', use: 'Show your YouTube activity — no posts or deletes' },
  { scope: 'drive.readonly (optional)', use: 'Notes folder watch — read only, never write to Drive' },
];

const DISCLAIMERS = [
  {
    title: 'Not medical / clinical advice',
    body: 'AIIMIN is a productivity Life OS. Insights are behavioural patterns from your logs — not diagnosis, therapy, or clinical claims.',
  },
  {
    title: 'Service “as is”',
    body: 'Per Terms: no warranty of uninterrupted or error-free operation. Downtime or bugs may happen; we work to fix them.',
  },
  {
    title: 'Liability limits',
    body: 'To the maximum extent allowed by law, indirect / consequential damages (including data or productivity loss) are limited as stated in Terms.',
  },
  {
    title: 'Governing law',
    body: 'Terms are governed by the laws of India. Disputes: competent courts in Uttar Pradesh, India.',
  },
];

const PROCESSORS = [
  { name: 'Supabase', role: 'Postgres + auth', href: 'https://supabase.com/privacy' },
  { name: 'Vercel', role: 'Frontend hosting', href: 'https://vercel.com/legal/privacy-policy' },
  { name: 'Google APIs', role: 'Calendar / YouTube / Drive you connect', href: 'https://policies.google.com/privacy' },
  { name: 'EC2 API host', role: 'api.aiimin.in compute', to: '/security' },
];

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <div className={`brand-reveal brand-reveal--delay-${delay} ${className}`.trim()} data-brand-reveal>
      {children}
    </div>
  );
}

export default function Brand() {
  const rootRef = useRef(null);
  const markColors = useMemo(() => pickMarkColors(true), []);
  const { canAccessApp } = useAccessGate();
  const backTo = canAccessApp ? '/overview' : '/';
  const enterTo = canAccessApp ? '/overview' : '/login';
  const accessTo = canAccessApp ? '/overview' : '/';

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    root.classList.add('brand-manifesto--ready');

    const nodes = root.querySelectorAll('[data-brand-reveal]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sectionIds = RAIL.map((r) => r.href.slice(1));
    const railLinks = root.querySelectorAll('[data-brand-rail]');

    if (reduce) {
      nodes.forEach((n) => n.classList.add('is-in'));
    } else {
      nodes.forEach((n) => n.classList.add('is-pending'));
    }

    const io = reduce
      ? null
      : new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove('is-pending');
              entry.target.classList.add('is-in');
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
      );

    if (io) nodes.forEach((n) => io.observe(n));

    const sectionIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          railLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        });
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: 0 },
    );

    sectionIds.forEach((id) => {
      const el = root.querySelector(`#${id}`);
      if (el) sectionIo.observe(el);
    });

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      root.style.setProperty('--bm-progress', String(Math.min(1, Math.max(0, p))));
    };

    const onMove = (e) => {
      if (reduce) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      root.style.setProperty('--bm-spot-x', `${x.toFixed(2)}%`);
      root.style.setProperty('--bm-spot-y', `${y.toFixed(2)}%`);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      if (io) io.disconnect();
      sectionIo.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div className="brand-manifesto" ref={rootRef} data-surface="light">
      <div className="brand-manifesto__progress" aria-hidden="true" />

      <div className="brand-manifesto__atmosphere" aria-hidden="true">
        <div className="brand-manifesto__veil" />
        <div className="brand-manifesto__grid" />
        <div className="brand-manifesto__bloom" />
        <div className="brand-manifesto__bloom brand-manifesto__bloom--mid" />
        <div className="brand-manifesto__bloom brand-manifesto__bloom--low" />
        <div className="brand-manifesto__grain" />
      </div>

      <div className="brand-manifesto__shell">
        <nav className="brand-manifesto__rail" aria-label="Manifesto sections">
          {RAIL.map((item) => (
            <a key={item.href} href={item.href} data-brand-rail>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="brand-manifesto__main">
          <nav className="brand-manifesto__nav" aria-label="Brand navigation">
            <Link to={backTo} className="brand-manifesto__back">
              <span className="brand-manifesto__back-chip" aria-hidden="true">←</span>
              {canAccessApp ? 'Back to Today' : 'Back to Waitlist'}
            </Link>
            <div className="brand-manifesto__nav-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <a href="mailto:founders@aiimin.in">Contact</a>
              <Link to={enterTo} className="brand-manifesto__cta">
                {canAccessApp ? 'Enter System' : 'Sign in'}
              </Link>
            </div>
          </nav>

          <header className="brand-manifesto__hero">
            <div className="brand-manifesto__hero-copy">
              <Reveal>
                <div className="brand-manifesto__mark-stage">
                  <div className="brand-manifesto__mark-ring brand-manifesto__mark-ring--outer" aria-hidden="true" />
                  <div className="brand-manifesto__mark-ring" aria-hidden="true" />
                  <div className="brand-manifesto__mark-wrap">
                    <ArchBracketMark size={92} withChip colors={markColors} />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={1}>
                <Wordmark size={44} color="var(--bm-ink)" className="brand-manifesto__wordmark" />
              </Reveal>

              <Reveal delay={1}>
                <p className="brand-manifesto__eyebrow">Behavioural operating system</p>
              </Reveal>

              <Reveal delay={2}>
                <h1 className="brand-manifesto__title">
                  The infrastructure for
                  {' '}
                  <em>human momentum</em>
                  .
                </h1>
              </Reveal>

              <Reveal delay={2}>
                <p className="brand-manifesto__lede">
                  Not another dashboard. AIIMIN is a Life OS that shapes reality through intelligent feedback loops,
                  extreme privacy, and ritual-based design — built for students and early-career builders under real cognitive load.
                </p>
              </Reveal>

              <Reveal delay={3}>
                <div className="brand-manifesto__hero-actions">
                  <Link to={accessTo} className="brand-manifesto__cta brand-manifesto__cta--accent">
                    {canAccessApp ? 'Open Today' : 'Get access'}
                  </Link>
                  <a href="#accountability" className="brand-manifesto__cta brand-manifesto__cta--ghost">
                    Hold us accountable
                  </a>
                </div>
              </Reveal>

              <a href="#problem" className="brand-manifesto__scroll-cue">
                <span aria-hidden="true" />
                Scroll the manifesto
              </a>
            </div>

            <Reveal delay={2}>
              <aside className="brand-manifesto__hero-panel" aria-label="Brand stance">
                <div className="brand-stance__row brand-stance__row--yes">
                  <p className="brand-stance__label">We are</p>
                  <ul className="brand-stance__list">
                    {WE_ARE.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div className="brand-stance__row brand-stance__row--no">
                  <p className="brand-stance__label">We refuse</p>
                  <ul className="brand-stance__list">
                    {WE_REFUSE.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <p className="brand-stance__quote">
                  Capture stays cheap. Patterns stay honest. The archive stays yours.
                </p>
              </aside>
            </Reveal>
          </header>

          <section className="brand-section" id="problem">
            <Reveal>
              <div className="brand-section__head">
                <div>
                  <p className="brand-section__index">01 — Problem</p>
                  <h2 className="brand-section__title">We optimize for intent.</h2>
                </div>
                <p className="brand-section__desc">
                  Modern software optimizes for engagement. Filing cabinets dressed as productivity. You need an engine.
                </p>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="brand-problem">
                <div className="brand-problem__copy">
                  <p>
                    The average professional loses hours a day to context switching, low-friction entertainment, and interface traps.
                    Current tools hold data but do not shape behaviour.
                  </p>
                  <p>
                    <strong>AIIMIN flips the paradigm.</strong>
                    {' '}
                    Every pixel enforces constraints, visualizes momentum, and removes friction between thought and action.
                  </p>
                </div>
                <div className="brand-stats" role="list">
                  {[
                    { metric: '90+', label: 'Minute deep sessions' },
                    { metric: 'Zero', label: 'Algorithmic distractions' },
                    { metric: '100%', label: 'Private & encrypted' },
                  ].map((s) => (
                    <div className="brand-stats__row" role="listitem" key={s.label}>
                      <div className="brand-stats__metric">{s.metric}</div>
                      <div className="brand-stats__label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </section>

          <section className="brand-section" id="pillars">
            <Reveal>
              <div className="brand-section__head">
                <div>
                  <p className="brand-section__index">02 — Thesis</p>
                  <h2 className="brand-section__title">Nine pillars of momentum.</h2>
                </div>
                <p className="brand-section__desc">
                  We do not follow standard UX conventions. We follow psychological principles. Every feature must pass the momentum test.
                </p>
              </div>
            </Reveal>

            <ol className="brand-pillars">
              {PILLARS.map((p, i) => (
                <Reveal key={p.title} delay={i % 3}>
                  <li className="brand-pillars__item">
                    <div className="brand-pillars__num">{String(i + 1).padStart(2, '0')}</div>
                    <div>
                      <h3 className="brand-pillars__title">{p.title}</h3>
                      <p className="brand-pillars__desc">{p.desc}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </section>

          <section className="brand-section" id="storage">
            <Reveal>
              <div className="brand-section__head">
                <div>
                  <p className="brand-section__index">03 — Storage</p>
                  <h2 className="brand-section__title">Where your life archive lives.</h2>
                </div>
                <p className="brand-section__desc">
                  Storage is part of the brand promise — not a footer afterthought.
                </p>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="brand-ledger">
                {STORAGE.map((row) => (
                  <div className="brand-ledger__row" key={row.key}>
                    <div className="brand-ledger__key">{row.key}</div>
                    <p className="brand-ledger__val">{row.val}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>

          <section className="brand-section" id="accountability">
            <Reveal>
              <div className="brand-section__head">
                <div>
                  <p className="brand-section__index">04 — Accountability</p>
                  <h2 className="brand-section__title">Everything you can hold us to.</h2>
                </div>
                <p className="brand-section__desc">
                  Commitments, rights, escalation paths, scopes, processors, and limits — summarized here, binding on the linked policy pages.
                  If we break a promise below, you have concrete ways to act.
                </p>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="brand-account__banner">
                <p>
                  <strong>Operator of record:</strong>
                  {' '}
                  AIIMIN · contact
                  {' '}
                  <a href="mailto:founders@aiimin.in">founders@aiimin.in</a>
                  {' '}
                  · site
                  {' '}
                  <a href="https://www.aiimin.in" target="_blank" rel="noopener noreferrer">www.aiimin.in</a>
                  .
                  Policies last updated for Privacy / Terms: May 25, 2026 (see pages for exact dates).
                </p>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h3 className="brand-account__subhead">Hard commitments</h3>
              <div className="brand-account__grid">
                {HARD_COMMITMENTS.map((c) => (
                  <article className="brand-account__card" key={c.title}>
                    <h4>{c.title}</h4>
                    <p>{c.body}</p>
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h3 className="brand-account__subhead">Your rights</h3>
              <div className="brand-account__grid">
                {USER_RIGHTS.map((r) => (
                  <article className="brand-account__card brand-account__card--right" key={r.title}>
                    <h4>{r.title}</h4>
                    <p>{r.body}</p>
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h3 className="brand-account__subhead">How to claim / escalate</h3>
              <div className="brand-account__steps">
                {HOLD_US.map((s) => (
                  <article className="brand-account__step" key={s.step}>
                    <div className="brand-account__step-num">{s.step}</div>
                    <div>
                      <h4>{s.title}</h4>
                      <p>{s.body}</p>
                      {s.external ? (
                        <a href={s.href} target="_blank" rel="noopener noreferrer" className="brand-account__link">
                          {s.label}
                          {' '}
                          ↗
                        </a>
                      ) : s.href ? (
                        <a href={s.href} className="brand-account__link">{s.label}</a>
                      ) : (
                        <Link to={s.to} className="brand-account__link">{s.label}</Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h3 className="brand-account__subhead">Google scopes we request</h3>
              <div className="brand-ledger">
                {SCOPES.map((row) => (
                  <div className="brand-ledger__row" key={row.scope}>
                    <div className="brand-ledger__key">{row.scope}</div>
                    <p className="brand-ledger__val">{row.use}</p>
                  </div>
                ))}
              </div>
              <p className="brand-account__note">
                Full Limited Use language:
                {' '}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google API Services User Data Policy
                </a>
                .
              </p>
            </Reveal>

            <Reveal delay={1}>
              <h3 className="brand-account__subhead">Infrastructure processors</h3>
              <div className="brand-account__processors">
                {PROCESSORS.map((p) => (
                  p.to ? (
                    <Link key={p.name} to={p.to} className="brand-account__processor">
                      <strong>{p.name}</strong>
                      <span>{p.role}</span>
                    </Link>
                  ) : (
                    <a
                      key={p.name}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brand-account__processor"
                    >
                      <strong>{p.name}</strong>
                      <span>{p.role}</span>
                    </a>
                  )
                ))}
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h3 className="brand-account__subhead">Limits &amp; disclaimers (so you know the edges)</h3>
              <div className="brand-account__grid">
                {DISCLAIMERS.map((d) => (
                  <article className="brand-account__card brand-account__card--edge" key={d.title}>
                    <h4>{d.title}</h4>
                    <p>{d.body}</p>
                  </article>
                ))}
              </div>
              <p className="brand-account__note">
                Full warranty and liability language lives in
                {' '}
                <Link to="/terms">Terms of Service</Link>
                . Brand page does not replace it.
              </p>
            </Reveal>

            <Reveal delay={1}>
              <h3 className="brand-account__subhead">Binding documents</h3>
              <div className="brand-legal-stack brand-legal-stack--wide">
                {LEGAL.map((l) => (
                  <Link key={l.to} to={l.to}>
                    {l.label}
                    <span>{l.code}</span>
                  </Link>
                ))}
              </div>
            </Reveal>
          </section>

          <section className="brand-section" id="roadmap">
            <Reveal>
              <div className="brand-section__head">
                <div>
                  <p className="brand-section__index">05 — Roadmap</p>
                  <h2 className="brand-section__title">The trajectory.</h2>
                </div>
                <p className="brand-section__desc">
                  Foundation first. Proactive intelligence when the archive is deep enough to deserve it.
                </p>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="brand-timeline">
                <article className="brand-timeline__phase">
                  <div className="brand-timeline__tag">
                    <i />
                    Phase 1 · Foundation
                  </div>
                  <h3>Behavioral aggregation</h3>
                  <p>
                    A high-performance behaviour-tracking OS: focus, streaks, mood, money, calendar, and YouTube context —
                    powered by a commitment engine and weekly intelligence.
                  </p>
                </article>
                <article className="brand-timeline__phase brand-timeline__phase--future">
                  <div className="brand-timeline__tag">
                    <i />
                    Phase 2 · Horizons
                  </div>
                  <h3>Proactive intelligence</h3>
                  <p>
                    Drift detection before setbacks compound. Contextual interventions from your unique activity signatures —
                    with cross-device ritual sync and offline-first architecture.
                  </p>
                </article>
              </div>
            </Reveal>
          </section>

          <section className="brand-section" id="architecture">
            <Reveal>
              <div className="brand-section__head">
                <div>
                  <p className="brand-section__index">06 — Architecture</p>
                  <h2 className="brand-section__title">Technical infrastructure.</h2>
                </div>
                <p className="brand-section__desc">
                  Three layers. One promise: your behavioural archive stays under your control.
                </p>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="brand-stack">
                {LAYERS.map((layer) => (
                  <div className="brand-stack__layer" key={layer.role}>
                    <div className="brand-stack__role">{layer.role}</div>
                    <div>
                      <h3 className="brand-stack__tech">{layer.tech}</h3>
                      <p className="brand-stack__detail">{layer.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>

          <section className="brand-close">
            <Reveal>
              <h2 className="brand-close__title">Build momentum. Keep the archive yours.</h2>
              <p className="brand-close__copy">
                AIIMIN is for people who want signal over noise — capture that stays cheap, patterns that stay honest,
                and a system that never farms your life for ads.
              </p>
              <div className="brand-close__actions">
                <Link to={canAccessApp ? '/overview' : '/'} className="brand-manifesto__cta brand-manifesto__cta--accent">
                  {canAccessApp ? 'Return to Today' : 'Join the waitlist'}
                </Link>
                <Link to="/privacy" className="brand-manifesto__cta brand-manifesto__cta--ghost">
                  Read Privacy Policy
                </Link>
              </div>
            </Reveal>
          </section>

          <footer className="brand-manifesto__footer">
            <Link to={backTo} className="brand-manifesto__footer-brand">
              <ArchBracketMark size={26} withChip colors={markColors} />
              AIIMIN System
            </Link>
            <div className="brand-manifesto__footer-links">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/data-deletion">Deletion</Link>
              <Link to="/security">Security</Link>
              <p className="brand-manifesto__footer-meta">Behavioural OS · © 2026</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
