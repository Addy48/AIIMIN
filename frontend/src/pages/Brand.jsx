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
  { title: 'Absolute Cognitive Clarity', desc: 'Zero decorative fluff. Every pixel, metric, and hotkey serves raw operational leverage and high-bandwidth thinking.' },
  { title: 'High-Velocity Feedback Loops', desc: 'Action creates data; data calculates trajectory; trajectory dictates next move. Shorten the latency between behavior and insight.' },
  { title: 'Behavioral Telemetry', desc: 'Decode hidden biological and execution patterns across sleep, focus depth, mood variance, and capital allocation.' },
  { title: 'Sovereign Data Custody', desc: 'Your historical archive is your intellectual property. Zero third-party training, zero telemetry brokering, complete exportability.' },
  { title: 'Momentum Compounding', desc: 'Build unshakeable habits through velocity metrics, anti-fragile streaks, and contextual execution rituals.' },
  { title: 'Sanctuary Deep Mode', desc: 'When deep focus initiates, all peripheral clutter evaporates. No navigation bars, no pings, no context switching. Just pure output.' },
  { title: 'Multi-Vector Synthesis', desc: 'Unify habits, finances, biological rhythms, milestones, and reflection into a unified personal intelligence layer.' },
  { title: 'Anti-Fragile Discipline', desc: 'Systems engineered to withstand disruptions. Push ruthlessly when momentum peaks; recalibrate instantly when drift begins.' },
  { title: 'Autonomous Calibration', desc: 'Intelligent diagnostics that evolve alongside your capacity, preventing burnout while expanding your peak output ceiling.' },
];

const STORAGE = [
  {
    key: 'Where it lives',
    val: (
      <>
        Account data and encrypted behavioural ledgers reside in dedicated <strong>Supabase PostgreSQL</strong> clusters with cryptographic row-level isolation. Edge routing runs on <strong>Vercel</strong>; backend intelligence executes on our isolated EC2 compute nodes.
      </>
    ),
  },
  {
    key: 'What we store',
    val: (
      <>
        Habits, quantifiable goals, journal logs, notes, financial records, focus metrics, calendar metadata, and system preferences — keyed strictly to your <strong>OS-ID</strong>. Never sold. Never used for ad targeting.
      </>
    ),
  },
  {
    key: 'Data custody',
    val: (
      <>
        OAuth tokens for Google Calendar, YouTube, and Drive remain <strong>encrypted at rest</strong>. Revoke provider access at any second. Request complete account purge for permanent cryptographic erasure.
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
  { role: 'Interface Layer', tech: 'React 19 + High-Density Design Engine', detail: 'Edge-distributed on Vercel with zero-latency input pipelines and instantaneous telemetry capture.' },
  { role: 'Intelligence Layer', tech: 'Node / Express Dedicated Services', detail: 'api.aiimin.in on dedicated EC2 nodes — orchestrating synchronization, token security, and scheduled analytics.' },
  { role: 'Sovereign Archive', tech: 'Supabase PostgreSQL + Cryptographic RLS', detail: 'Row-level security isolation ensuring complete data sovereignty. Your behavioral history remains yours.' },
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
  'A sovereign Life OS built for human momentum',
  'Private behavioral archive with zero harvesting',
  'Frictionless daily telemetry & high-density signal',
];

const WE_REFUSE = [
  'Attention extraction, ad networks, & surveillance telemetry',
  'Streak theater, artificial vanity badges, & guilt loops',
  'Shallow productivity bloat that degrades cognitive output',
];

/** Brand-surface summary — enforceable via linked Privacy / Terms / Deletion / Security. */
const HARD_COMMITMENTS = [
  { title: 'Zero personal data sale', body: 'We never sell, rent, monetize, or commercially transfer your telemetry or personal records to any third party.' },
  { title: 'Zero ad tracking & surveillance', body: 'No marketing trackers, third-party advertising scripts, or behavioral profiling pixels anywhere across the platform.' },
  { title: 'Strict Google Limited Use', body: 'Google API data is processed strictly to render your own dashboard. Never used for model training, advertising, or external transfers.' },
  { title: 'Zero human data browsing', body: 'No human accesses your connected Google data or private logs, except upon your explicit support request or lawful court order.' },
  { title: 'Absolute content ownership', body: 'Your goals, journal entries, financial ledgers, and logs remain your sole intellectual property. We process them solely to power the OS.' },
  { title: 'Least-privilege OAuth scopes', body: 'All external integrations (Calendar, YouTube, Drive) operate under minimal read-oriented permissions. Revocable anytime.' },
];

const USER_RIGHTS = [
  { title: 'Access & Portability', body: 'Obtain a full machine-readable export of all behavioral and telemetry data associated with your identity.' },
  { title: 'Instant Correction', body: 'Update, rectify, or purge profile details, goals, and logged variables directly within the application.' },
  { title: 'Cryptographic Deletion', body: 'Trigger an immediate active data purge in-app or via verified request. Backup copies are purged within 30 days.' },
  { title: 'OAuth Severance', body: 'Instantly revoke Google integrations from Google Account security settings to terminate token access immediately.' },
  { title: 'Unconditional Exit', body: 'Terminate your account and export your entire historical ledger at any time with zero lock-in or retention hurdles.' },
  { title: 'Founder Escalation', body: 'Direct escalation channel to company founders for privacy inquiries, data requests, or operational disputes.' },
];

const HOLD_US = [
  {
    step: '01',
    title: 'Delete your archive',
    body: 'Settings → Delete Account, or submit a formal wipe request. Active data purged immediately; backups purged within 30 days.',
    to: '/data-deletion',
    label: 'Data deletion policy',
  },
  {
    step: '02',
    title: 'Sever Google permissions',
    body: 'Revoke AIIMIN inside Google Account Permissions to immediately invalidate all OAuth tokens for Calendar, YouTube, and Drive.',
    href: 'https://myaccount.google.com/permissions',
    label: 'Google permissions',
    external: true,
  },
  {
    step: '03',
    title: 'Export complete ledger',
    body: 'Download your entire behavioral history, daily logs, habit trends, and focus metrics in portable JSON format anytime.',
    to: '/data-deletion',
    label: 'Data export guide',
  },
  {
    step: '04',
    title: 'Report security findings',
    body: 'Responsible disclosures and data vulnerability reports receive priority engineering response and mitigation within 24 hours.',
    to: '/security',
    label: 'Security policy',
  },
  {
    step: '05',
    title: 'Founder direct escalation',
    body: 'For privacy grievances, compliance verification, or account disputes — email founders@aiimin.in for direct operator review.',
    href: 'mailto:founders@aiimin.in',
    label: 'Email founders',
  },
  {
    step: '06',
    title: 'Inspect binding contracts',
    body: 'Our Privacy Policy, Terms of Service, Security Architecture, and Subprocessor list are the binding governing documents.',
    to: '/privacy',
    label: 'Privacy & Legal',
  },
];

const SCOPES = [
  { scope: 'openid / email / profile', use: 'Cryptographic authentication & account identity only' },
  { scope: 'calendar.readonly (+ events read)', use: 'Synchronize your schedule — strictly read-only, never creates or alters events' },
  { scope: 'youtube.readonly', use: 'Index study and focus session media — never publishes, comments, or deletes' },
  { scope: 'drive.readonly (optional)', use: 'Synchronize Obsidian / markdown notes folder — strictly read-only access' },
];

const DISCLAIMERS = [
  {
    title: 'Not clinical or medical advice',
    body: 'AIIMIN provides behavioral productivity telemetry and self-directed analytics — never medical diagnosis, psychiatric care, therapy, or clinical claims.',
  },
  {
    title: 'High availability & uptime',
    body: 'Built on high-availability cloud infrastructure. Service is provided "as is" without warranty of uninterrupted, zero-latency, or error-free continuous operation.',
  },
  {
    title: 'Absolute data sovereignty',
    body: 'You retain 100% ownership of your logged behavioral data. Export your entire historical archive in standard open formats anytime.',
  },
  {
    title: 'Third-party integrations',
    body: 'Connected services (Google Calendar, YouTube, Drive) operate under least-privilege OAuth scopes and are subject to provider availability and API terms.',
  },
  {
    title: 'Liability limitations',
    body: 'To the fullest extent permitted by applicable law, direct, indirect, and consequential damages (including productivity loss) are limited as stated in Terms.',
  },
  {
    title: 'Governing jurisdiction',
    body: 'Terms of Service are governed by the laws of India. Legal disputes are subject to the exclusive jurisdiction of competent courts in Uttar Pradesh, India.',
  },
];

const PROCESSORS = [
  { name: 'Supabase', role: 'PostgreSQL DB + Auth Engine', href: 'https://supabase.com/privacy' },
  { name: 'Vercel', role: 'Edge Application Distribution', href: 'https://vercel.com/legal/privacy-policy' },
  { name: 'Google Cloud APIs', role: 'Read-only OAuth Integrations', href: 'https://policies.google.com/privacy' },
  { name: 'EC2 API Host', role: 'api.aiimin.in Compute & Sync', to: '/security' },
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
    const mqResult = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    const reduce = mqResult?.matches ?? false;
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

    let spotRaf = 0;
    const onMove = (e) => {
      if (reduce) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      if (spotRaf) cancelAnimationFrame(spotRaf);
      spotRaf = requestAnimationFrame(() => {
        root.style.setProperty('--bm-spot-x', `${x.toFixed(2)}%`);
        root.style.setProperty('--bm-spot-y', `${y.toFixed(2)}%`);
        spotRaf = 0;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      if (io) io.disconnect();
      sectionIo.disconnect();
      if (spotRaf) cancelAnimationFrame(spotRaf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div className="brand-manifesto" ref={rootRef} data-surface="light">
      <div className="brand-manifesto__progress" aria-hidden="true" />

      <div className="brand-manifesto__atmosphere" aria-hidden="true">
        <div className="brand-manifesto__veil" />
        <div className="brand-manifesto__spot" />
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
                  AIIMIN is an intelligent Life Operating System engineered for builders, operators, and high performers.
                  We turn daily telemetry into compounding momentum through high-density signal, ruthless feedback loops, and sovereign local-first privacy.
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
                  Telemetry without friction. Insights without theater. An archive owned entirely by you.
                </p>
              </aside>
            </Reveal>
          </header>

          <section className="brand-section" id="problem">
            <Reveal>
              <div className="brand-section__head">
                <div>
                  <p className="brand-section__index">01 — Problem</p>
                  <h2 className="brand-section__title">Engineered for execution, not retention.</h2>
                </div>
                <p className="brand-section__desc">
                  Modern software is engineered to capture and monetize your attention. Most &ldquo;productivity&rdquo; tools are bloated filing cabinets that induce cognitive exhaustion.
                </p>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="brand-problem">
                <div className="brand-problem__copy">
                  <p>
                    Ambitious operators hemorrhage peak cognitive hours across fragmented tools, performative streak trackers, and interfaces engineered for dopamine extraction. Passive tools store notes; they never catalyze execution.
                  </p>
                  <p>
                    <strong>AIIMIN is an execution engine.</strong>
                    {' '}
                    Every architectural layer enforces deep focus, exposes invisible behavioral leakage, and converts daily consistency into compounding momentum.
                  </p>
                </div>
                <div className="brand-stats" role="list">
                  {[
                    { metric: '0%', label: 'Attention harvesting & ad trackers' },
                    { metric: 'Sub-50ms', label: 'Telemetry logging & command response' },
                    { metric: '100%', label: 'Sovereign row-level encrypted data' },
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
                  We reject superficial UX trends in pursuit of raw cognitive leverage. Every system mechanic is engineered to maximize human output.
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
                  Data custody is a foundational architectural contract — not an obscure legal afterthought.
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
                  Operational commitments, sovereign user rights, instant escalation paths, verified API scopes, and clear liability boundaries — summarized with complete transparency.
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
                  Solid foundation first. Autonomous intelligence synthesized as the behavioral archive deepens.
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
                  <h3>Execution engine &amp; multi-vector graph</h3>
                  <p>
                    A high-performance behavioral OS unifying focus telemetry, streaks, biometrics, financial allocation, and calendar intelligence into a live command surface. Web command center with companion mobile capture (
                    <Link to="/app">/app</Link>
                    ).
                  </p>
                </article>
                <article className="brand-timeline__phase brand-timeline__phase--future">
                  <div className="brand-timeline__tag">
                    <i />
                    Phase 2 · Horizons
                  </div>
                  <h3>Autonomous intelligence &amp; predictive synthesis</h3>
                  <p>
                    Preemptive behavioral drift detection before stagnation compounds. Contextual interventions synthesized from unique multi-month activity signatures, local-first ML edge models, and seamless cross-platform synchronization.
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
                  Three isolated infrastructure layers. One immutable guarantee: your behavioral archive is sovereign and uncompromised.
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
              <h2 className="brand-close__title">Build unshakeable momentum. Own your archive.</h2>
              <p className="brand-close__copy">
                AIIMIN is engineered for ambitious individuals who prioritize signal over spectacle — instantaneous daily capture, honest behavioral feedback, and an infrastructure that never monetizes your attention.
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
            <Link to={backTo} className="brand-manifesto__footer-brand" aria-label="Return from Brand to application">
              <ArchBracketMark size={26} withChip colors={markColors} />
              <span className="brand-manifesto__footer-brand-text">AIIMIN SYSTEM</span>
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
