import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Copy, DownloadSimple } from '@phosphor-icons/react';
import Shell, { Meta, raahi } from './Shell';
import JoinForm from './JoinForm';
import { PLANS } from '../marketing/plans';

// The lines Raahi says in the app (the same ones the home page shows), placed along the day's arc.
const DAY = [
  ['First open', 'Hi Meera. Let’s start small.'],
  ['Morning', 'Morning. 3 minimums today.'],
  ['Back after a week', 'Welcome back. No catch-up needed. Start with today.'],
  ['End of day', 'Day closed. Rest well.'],
];

// Points on the arc for the four stops (viewBox 0 0 1000 170): y = 150 - 130·sin(πx/1000).
const ARC_X = [125, 375, 625, 875];
const arcY = (x) => 150 - 130 * Math.sin((Math.PI * x) / 1000);
const ARC_PATH = `M0 150 ${Array.from({ length: 41 }, (_, i) => { const x = i * 25; return `L${x} ${arcY(x).toFixed(1)}`; }).join(' ')}`;

const NEVER = [
  ['Count your missed days.', 'There are no streaks to lose. Come back after a week and Raahi says “Welcome back”, with nothing to catch up on.'],
  ['Pretend to be a person.', 'Anything Raahi’s AI writes for you is marked “Written by Raahi, an AI. Check the numbers.” Greetings are written by people.'],
  ['Keep talking.', 'One short line when you open the app, then quiet. You can switch Raahi off.'],
];

const BELIEFS = [
  ['Your phone is the vault.', 'Tasks, spending, papers and journal are saved on your phone. No account is needed, and your documents are never uploaded.'],
  ['Small promises beat big plans.', 'Minimums are the few small things you mean to do each day, like a 20-minute walk or 10 pages of a book.'],
  ['Three piles, one place.', 'Your day, your money and your family’s papers sit together, so the next thing that needs you is never in another app.'],
  ['It works without signal.', 'Add things, get reminders and open your papers in airplane mode.'],
];

const LOGOS = [['Logo for light backgrounds', '/logo-symbol.svg', 'Light'], ['Logo for dark backgrounds', '/AIIMIN_logo_dark.svg', 'Dark']];

const BOILERPLATE = 'AIIMIN is an Android app that keeps your day, your money and your family’s papers in one place. Its companion, Raahi, greets you, helps you name what’s next and labels anything it writes as AI. AIIMIN is made in India and is free during the beta.';

const plus = PLANS.find((p) => p.id === 'plus');

function CopyButton({ value, label, children }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1600); } catch { /* no clipboard */ }
  };
  return (
    <button type="button" className="s-bg-copy" onClick={copy} aria-label={done ? `${label} copied` : `Copy ${label}`}>
      {done ? <Check weight="bold" aria-hidden="true" /> : <Copy aria-hidden="true" />}
      {children}
      <span className="s-sr" aria-live="polite">{done ? 'Copied' : ''}</span>
    </button>
  );
}

export default function BrandPage() {
  return (
    <Shell>
      <Meta
        title="Meet Raahi · AIIMIN"
        description="Raahi is the small traveller inside AIIMIN: one short line when you open the app, then quiet. What Raahi says, what it never does, and what AIIMIN is built on."
        path="/brand"
      />

      <div className="s-bg">
        <section className="s-wrap s-bg-hero" aria-labelledby="brand-title">
          <div className="s-bg-hero__copy">
            <h1 id="brand-title">Walk your day with Raahi.</h1>
            <p>Raahi means traveller. It is the small companion inside AIIMIN: it greets you when you open the app, points at the one thing that matters next, then goes quiet so you can do it.</p>
            <div className="s-bg-hero__actions">
              <Link className="s-btn" to="/waitlist#join">Get early access <ArrowRight weight="bold" /></Link>
              <Link className="s-bg-link" to="/app">See the Android app</Link>
            </div>
          </div>
          <figure className="s-bg-portrait">
            <img src={raahi('pose_idle_hero')} alt="Raahi, a small traveller in a sand-coloured hood, terracotta scarf and leather satchel" width="768" height="768" fetchPriority="high" />
          </figure>
        </section>

        <section className="s-bg-sec" aria-labelledby="day-title">
          <div className="s-wrap">
            <div className="s-bg-head s-rv">
              <h2 id="day-title">One line at a time.</h2>
              <p>These are the lines Raahi says in the app, from the first time you open it to the end of a day.</p>
            </div>
            <div className="s-bg-day s-rv">
              <svg className="s-bg-day__arc" viewBox="0 0 1000 170" preserveAspectRatio="none" aria-hidden="true">
                <path className="s-bg-day__ground" d="M0 150 L1000 150" />
                <path className="s-bg-day__path" d={ARC_PATH} pathLength="1" />
              </svg>
              <ol className="s-bg-day__stops">
                {DAY.map(([when, line], i) => (
                  <li key={when} style={{ '--y': (arcY(ARC_X[i]) / 170).toFixed(3), '--i': i }}>
                    <i className="s-bg-day__dot" aria-hidden="true" />
                    <span className="s-bg-day__when">{when}</span>
                    <q>{line}</q>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="s-bg-sec" aria-labelledby="never-title">
          <div className="s-wrap">
            <div className="s-bg-head s-rv">
              <h2 id="never-title">What Raahi won’t do.</h2>
              <p>A companion that nags is one more thing to manage. Raahi is built to stay out of the way.</p>
            </div>
            <ul className="s-bg-never s-rv">
              {NEVER.map(([t, d]) => (
                <li key={t}><h3>{t}</h3><p>{d}</p></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="s-bg-sec" aria-labelledby="beliefs-title">
          <div className="s-wrap">
            <div className="s-bg-head s-rv">
              <h2 id="beliefs-title">What AIIMIN is built on.</h2>
              <p>Four decisions that shape every screen, and how each one shows up in the app today.</p>
            </div>
            <dl className="s-bg-beliefs s-rv">
              {BELIEFS.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}
            </dl>
          </div>
        </section>

        <section className="s-bg-sec" aria-labelledby="money-title">
          <div className="s-wrap">
            <div className="s-bg-money s-rv">
              <h2 id="money-title">How AIIMIN pays its way.</h2>
              <div>
                <p>The Free plan stays free for as long as you like. Paid plans start later, from ₹{plus.monthly} a month, and are billed through Google Play. Nothing renews without telling you first.</p>
                <p>There is no ad or tracking code inside the app, and nothing about you is sold.</p>
                <Link className="s-bg-link" to="/waitlist#plans">Compare the plans <ArrowRight weight="bold" /></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="s-bg-sec" aria-labelledby="press-title">
          <div className="s-wrap">
            <div className="s-bg-press s-rv">
              <div>
                <h2 id="press-title">Writing about AIIMIN?</h2>
                <p>Logo files, a short description and a direct line for questions: <a href="mailto:support@aiimin.in">support@aiimin.in</a></p>
              </div>
              <div className="s-bg-press__actions">
                {LOGOS.map(([name, href, short]) => (
                  <a key={href} className="s-btn s-btn--ghost s-btn--sm" href={href} download aria-label={`Download ${name} (SVG)`}>
                    <DownloadSimple weight="bold" aria-hidden="true" /> {short} logo
                  </a>
                ))}
                <CopyButton value={BOILERPLATE} label="short description">Copy description</CopyButton>
              </div>
            </div>
          </div>
        </section>

        <section className="s-bg-sec s-bg-sec--last" aria-labelledby="brand-close-title">
          <div className="s-wrap">
            <div className="s-cta s-rv">
              <div>
                <h2 id="brand-close-title" className="s-h2">Start small. Keep going.</h2>
                <p>Early access to the Android beta is free. No card needed.</p>
              </div>
              <JoinForm button="Get early access" compact />
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
