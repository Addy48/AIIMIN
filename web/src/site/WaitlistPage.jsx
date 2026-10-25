import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AirplaneTilt, ArrowRight, ChatCircleText, Check, DeviceMobile, EyeSlash, FileLock, Lock,
  Microphone, Plus, Timer, Receipt, ShieldCheck, Sun, Users, WifiSlash,
} from '@phosphor-icons/react';
import Shell, { Meta, Phone, raahi } from './Shell';
import JoinForm from './JoinForm';
import { PLANS, REFERRAL } from '../marketing/plans';
import { API_URL } from '../utils/api';

// The opening-screen motif (PRD Part 26): one sun rises once behind the phone. Reduced motion: already risen.
function useCount() {
  const [n, setN] = useState(null);
  useEffect(() => {
    let live = true;
    fetch(`${API_URL}/waitlist/count`).then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live && typeof d?.count === 'number' && d.count >= 25) setN(d.count); })
      .catch(() => {});
    return () => { live = false; };
  }, []);
  return n;
}

const MOMENTS = [
  {
    time: 'Morning',
    title: 'Wake up to one clear next thing.',
    body: 'Today opens on the one task that matters right now. Tap Focus and give it 25 quiet minutes. Your daily minimums, small promises like a 20-minute walk, sit just below.',
    facts: [
      [Microphone, 'Say it out loud and it becomes a task, a reminder or a note.'],
      [Sun, 'One short good morning from Raahi. No guilt trips, no streaks to lose.'],
      [Timer, 'A focus timer from 15 to 90 minutes for that one thing.'],
    ],
    screen: '/site/screens/focus.webp', alt: 'The Focus screen: a 25-minute timer for "Call the CA about advance tax"',
  },
  {
    time: 'Afternoon',
    title: 'Your spending, written down for you.',
    body: 'When your bank sends a payment text, AIIMIN can draft it as an expense on your phone. Review and confirm it, and AIIMIN can remember the shop next time.',
    facts: [
      [Receipt, 'Only bank texts. OTPs, offers and personal chats are skipped.'],
      [Lock, 'Read on your phone. The text never leaves it.'],
      [Users, 'Split a bill with up to 3 people on the free plan.'],
    ],
    screen: '/site/screens/money.webp', alt: 'The Money screen: ₹18,420 spent in October, on pace for a ₹40,000 plan',
  },
  {
    time: 'Evening',
    title: "Family papers, ready when you need them.",
    body: 'Keep identity documents, insurance and the car RC, plus emergency details for the people you look after. Set expiry reminders for the dates that matter.',
    facts: [
      [FileLock, 'Files stay on this phone. AIIMIN never uploads them.'],
      [ShieldCheck, 'An emergency card with blood group, allergies and who to call.'],
      [WifiSlash, 'Everything opens without internet.'],
    ],
    screen: '/site/screens/emerg.webp', alt: "Meera's emergency card: blood group, allergies, medicines, doctor and a call button for her brother",
  },
];

const PROMISES = [
  [DeviceMobile, 'It lives on your phone', 'Your tasks, spending, papers and journal are saved on this phone. No account is needed.'],
  [EyeSlash, 'No ads, ever', 'There is no ad or tracking code inside the app. Nothing about you is sold.'],
  [AirplaneTilt, 'Works without signal', 'Add things, get reminders and open your papers in airplane mode.'],
  [ChatCircleText, 'AI that says it is AI', 'When Raahi writes something for you, it is clearly labelled. Greetings are written by people.'],
];

const LINES = [
  ['First open', "Hi Meera. Let's start small."],
  ['Morning', 'Morning. 3 minimums today.'],
  ['Back after a week', 'Welcome back. No catch-up needed. Start with today.'],
  ['End of day', 'Day closed. Rest well.'],
];

const FAQ = [
  ['Is it really free?', <p key="a">Yes. The beta is free, and the Free plan stays free after it. Paid plans start later; no card is asked for and nothing charges by itself. Every tester hears 14 days before paid plans begin.</p>],
  ['Which phones does it work on?', <p key="a">AIIMIN works on Android phones running Android 8 or later. There is no iPhone app yet.</p>],
  ['Does AIIMIN read my messages?', <><p key="a">Only if you say yes, and only texts from banks. OTPs, offers and personal chats are skipped. The text is read on your phone and is never sent anywhere.</p><p key="b">You can switch it off any time, and the rest of the app keeps working.</p></>],
  ['Is my data safe?', <p key="a">Your data stays on your phone. Sensitive documents are locked with a key only your phone holds. If you set up a backup, it is encrypted with your passphrase and saved to a folder you choose. <Link to="/privacy">Read the privacy policy</Link>.</p>],
  ['Who is Raahi?', <p key="a">Raahi is the small traveller who keeps you company through the day, and the name on everything the app's AI writes. Raahi never guilts you, and you can switch Raahi off. <Link to="/brand">Meet Raahi</Link>.</p>],
  ['How do I install it?', <p key="a">When your invite is ready we email you a link. Open it on your phone, tap download, allow the install once, and you are in. The <Link to="/app">Android app page</Link> shows each step. Play Store comes later.</p>],
  ['Can I delete everything?', <p key="a">Yes, in one tap from Settings › Privacy. Uninstalling the app removes everything stored on your phone. <Link to="/data-deletion">How deletion works</Link>.</p>],
];

const inr = (n) => '₹' + n.toLocaleString('en-IN');

/**
 * Desktop: the three moments scroll past one pinned phone, which changes screen as each moment reaches the middle of
 * the viewport. Phones get the swipe gallery above instead (the pinned stage is hidden under 821px).
 */
function Story() {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const refs = useRef([]);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.dataset.i)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    refs.current.forEach((el) => el && io.observe(el));
    setReady(true);
    return () => io.disconnect();
  }, []);
  return (
    <div className="s-story" data-ready={ready}>
      <div className="s-story__steps">
        {MOMENTS.map((m, i) => (
          <article key={m.time} className="s-moment" data-i={i} data-active={i === active} ref={(el) => { refs.current[i] = el; }}>
            <p className="s-moment__time"><i aria-hidden="true" />{m.time}</p>
            <h3>{m.title}</h3>
            <p>{m.body}</p>
            <ul className="s-facts">
              {m.facts.map(([I, t]) => <li key={t}><I aria-hidden="true" />{t}</li>)}
            </ul>
          </article>
        ))}
      </div>
      <div className="s-story__stage">
        <div className="s-story__pin">
          <div className="s-stage">
            <figure className="s-device">
              <div className="s-phone">
                <div className="s-phone__screen">
                  {MOMENTS.map((m, i) => (
                    <img key={m.time} src={m.screen} alt={i === active ? m.alt : ''} aria-hidden={i !== active} width="1440" height="2960" loading="lazy" decoding="async" data-on={i === active} />
                  ))}
                </div>
              </div>
            </figure>
          </div>
          <div className="s-story__dots" role="group" aria-label="Jump to a moment">
            {MOMENTS.map((m, i) => (
              <button key={m.time} type="button" data-on={i === active} aria-pressed={i === active}
                onClick={() => refs.current[i]?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })}>
                {m.time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WaitlistPage() {
  const count = useCount();
  const [line, setLine] = useState(0);
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => {
      setOut(true);
      setTimeout(() => { setLine((l) => (l + 1) % LINES.length); setOut(false); }, 350);
    }, 3600);
    return () => clearInterval(t);
  }, []);

  return (
    <Shell>
      <Meta
        title="AIIMIN · Know what's next"
        description="One calm Android app for your day, your spending and your family's papers. Bank texts help fill in expenses; your documents stay on your phone. Join the free beta."
        path="/waitlist"
      />

      <section className="s-hero">
        <div className="s-wrap s-hero__grid">
          <div className="s-hero__copy">
            <h1>Know what's<br />next<span className="s-dot">.</span></h1>
            <p className="s-hero__sub">Your day, your money and your family's papers in one calm Android app. Your bank texts become a clear month, read and kept on your phone.</p>
          </div>
          <div className="s-hero__actions">
            <JoinForm id="join" button="Get early access" />
            <div className="s-hero__beta">
              <span><Check weight="bold" /> Free during the beta</span>
              <span><Check weight="bold" /> No card needed</span>
              <span><Check weight="bold" /> Android 8 and up</span>
              {count && <span className="num"><Check weight="bold" /> {count.toLocaleString('en-IN')} people waiting</span>}
            </div>
          </div>
          <div className="s-hero__stage">
            <span className="s-hero__sun" aria-hidden="true" />
            <Phone src="/site/screens/today.webp" alt="AIIMIN's Today screen: the day as an arc, the next task and daily minimums" eager />
          </div>
        </div>
      </section>

      <section className="s-sec" aria-labelledby="day-h">
        <div className="s-wrap">
          <div className="s-head2 s-rv">
            <h2 id="day-h" className="s-h2">One app for the three things that pile up.</h2>
            <p className="s-lede">AIIMIN brings the next thing that matters into view, then leaves room for the rest of your day.</p>
          </div>
          <div className="s-moment-gallery-wrap">
            <p className="s-gallery-hint">Swipe to see 3 sample screens</p>
            <div className="s-moment-gallery" aria-label="Sample app screens">
              {MOMENTS.map((m) => (
                <div key={m.time} className="s-moment-gallery__item">
                  <Phone src={m.screen} alt={m.alt} caption={m.time} />
                </div>
              ))}
            </div>
          </div>
          <Story />
        </div>
      </section>

      <section className="s-sec--tight" aria-labelledby="trust-h">
        <div className="s-wrap">
          <div className="s-ink s-rv">
            <span className="s-ink__sun" aria-hidden="true" />
            <h2 id="trust-h" className="s-h2">What's yours stays on your phone.</h2>
            <p className="s-lede">This is how the app works today, not a promise for later. The <Link to="/privacy" style={{ color: '#fff' }}>privacy policy</Link> says the same in full.</p>
            <div className="s-promises">
              {PROMISES.map(([I, b, t]) => (
                <div key={b} className="s-promise"><I aria-hidden="true" /><div><b>{b}</b><span>{t}</span></div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="s-sec" aria-labelledby="raahi-h">
        <div className="s-wrap s-raahi">
          <div className="s-raahi__art s-rv">
            <img src={raahi('scene_sitting_sunset')} alt="Raahi sitting on a hill, watching the sun set" width="640" height="579" loading="lazy" />
            <p className="s-bubble" data-out={out} aria-live="polite">{LINES[line][1]}</p>
          </div>
          <div className="s-rv">
            <h2 id="raahi-h" className="s-h2">Meet Raahi.</h2>
            <p className="s-lede">Raahi means traveller. It walks your day beside the clock, says one short line when you open the app, and rests when you do. No sad faces, no guilt, no streaks to lose.</p>
            <ul className="s-lines">
              {LINES.map(([w, l]) => <li key={w}><em>{w}</em><b>"{l}"</b></li>)}
            </ul>
            <p className="s-ai"><b>Plainly:</b> Raahi is also the name on the app's AI. Anything it writes for you is marked "Written by Raahi, an AI. Check the numbers."</p>
            <p style={{ marginTop: 24 }}><Link className="s-btn s-btn--ghost" to="/brand">More about Raahi <ArrowRight weight="bold" /></Link></p>
          </div>
        </div>
      </section>

      <section className="s-sec" id="plans" aria-labelledby="plans-h" style={{ scrollMarginTop: 80 }}>
        <div className="s-wrap">
          <div className="s-head2 s-rv">
            <h2 id="plans-h" className="s-h2">Free now. Fair prices later.</h2>
            <p className="s-lede">The Free plan stays free. Paid plans start later, from under ₹2 a day, and each one lists only what works today.</p>
          </div>
          <div className="s-plans s-rv">
            {PLANS.map((p) => (
              <div key={p.id} className="s-plan" data-rec={!!p.recommended}>
                <p className="s-plan__name">{p.name}{p.recommended && <small>Recommended</small>}</p>
                <p className="s-plan__price num">{p.monthly ? inr(p.monthly) : '₹0'}<span>{p.monthly ? ' / month' : ' forever'}</span></p>
                <p className="s-plan__year num">{p.yearly ? `or ${inr(p.yearly)} a year` : 'No card, no catch'}</p>
                <p className="s-plan__hero">{p.hero}</p>
                <ul>{p.includes.map((i) => <li key={i}><Check weight="bold" aria-hidden="true" />{i}</li>)}</ul>
                {p.coming?.length > 0 && <p className="s-plan__soon"><b>Coming next:</b> {p.coming.join(' · ')}</p>}
              </div>
            ))}
          </div>
          <div className="s-beta">
            <span><b style={{ color: 'var(--ink)' }}>Beta: free for now. No payment is taken.</b></span>
            <span>When paid plans start, billing goes through Google Play. Nothing renews without telling you.</span>
          </div>
        </div>
      </section>

      <section className="s-sec" aria-labelledby="found-h">
        <div className="s-wrap s-found">
          <div className="s-rv">
            <h2 id="found-h" className="s-h2">Be one of the first 500.</h2>
            <p className="s-lede">Founding testers use AIIMIN first and help shape it. Tell us what breaks and what you would change.</p>
            <div className="s-founding">
              <strong>50%</strong>
              <p>off any paid plan, for life, for the first 500 testers. It starts when paid plans do.</p>
            </div>
            <div style={{ marginTop: 28 }}><JoinForm button="Get early access" compact /></div>
          </div>
          <div className="s-rv">
            <h3 className="s-found__h3">Bring a friend. You both win.</h3>
            <p style={{ color: 'var(--muted)', marginBottom: 18 }}>Each friend who joins with your link gets {REFERRAL.friendGets}.</p>
            <ol className="s-ladder">
              {REFERRAL.tiers.map((t) => (
                <li key={t.friends}><span className="s-ladder__n num">{t.friends}</span><div><b>{t.friends === 1 ? '1 friend' : `${t.friends} friends`}</b><span>{t.reward}</span></div></li>
              ))}
            </ol>
            <p className="s-small">{REFERRAL.rules} We show you how many friends joined, never who.</p>
          </div>
        </div>
      </section>

      <section className="s-sec--tight" aria-labelledby="faq-h">
        <div className="s-wrap s-faq-wrap">
          <div className="s-faq-wrap__head s-rv">
            <h2 id="faq-h" className="s-h2">Questions, answered.</h2>
            <p className="s-lede">Something else? Write to <a href="mailto:support@aiimin.in">support@aiimin.in</a>.</p>
          </div>
          <div className="s-faq">
            {FAQ.map(([q, a]) => (
              <details key={q}><summary>{q}<Plus aria-hidden="true" /></summary><div>{a}</div></details>
            ))}
          </div>
        </div>
      </section>

      <section className="s-sec">
        <div className="s-wrap">
          <div className="s-cta s-rv">
            <div>
              <h2 className="s-h2">Start small. Keep going.</h2>
              <p>Just your email. We’ll invite you when it’s your turn.</p>
            </div>
            <JoinForm button="Get early access" compact />
          </div>
        </div>
      </section>
    </Shell>
  );
}
