import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AirplaneTilt, ArrowRight, Bell, ChatCircleText, Check, DeviceMobile, EyeSlash, FileLock, Lock,
  Microphone, Plus, Receipt, ShieldCheck, Sun, Users, WifiSlash,
} from '@phosphor-icons/react';
import Shell, { Meta, Phone, raahi } from './Shell';
import JoinForm from './JoinForm';
import { PLANS, REFERRAL } from '../marketing/plans';
import { API_URL } from '../utils/api';

// The Today screen's arc, drawn once: the line climbs to "now" and the sun settles on it.
const PAST = 'M 0 300 C 110 296 190 210 290 176';
const FUTURE = 'M 290 176 C 400 140 520 200 620 300';

function DayArc() {
  const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const motion = (
    <animateMotion dur="1.85s" begin="0s" fill="freeze" path={PAST} keyPoints="0;0;1" keyTimes="0;0.14;1" calcMode="spline" keySplines="0 0 1 1;0.16 1 0.3 1" />
  );
  return (
    <svg className="s-arc" viewBox="0 -20 620 340" preserveAspectRatio="xMinYMax meet" aria-hidden="true" data-still={still}>
      <line className="s-arc__ground" x1="0" y1="300" x2="620" y2="300" />
      <path className="s-arc__future" d={FUTURE} pathLength="100" strokeDasharray="0.01 2.4" />
      <path className="s-arc__past" d={PAST} pathLength="1" strokeDasharray="1 1" strokeDashoffset={still ? 0 : 1}>
        {!still && <animate attributeName="stroke-dashoffset" from="1" to="0" dur="1.85s" fill="freeze" keyTimes="0;0.14;1" values="1;1;0" calcMode="spline" keySplines="0 0 1 1;0.16 1 0.3 1" />}
      </path>
      {still ? (
        <circle className="s-arc__sun" cx="290" cy="176" r="14" />
      ) : (
        <g>
          <circle className="s-arc__halo" r="16" />
          <circle className="s-arc__sun" r="14" />
          {motion}
        </g>
      )}
    </svg>
  );
}

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
    title: 'One clear next thing.',
    body: 'Today opens on the clock, your day as an arc, and the one task that matters now. Minimums are the small things you promised yourself: tap to keep one.',
    facts: [
      [Microphone, 'Say it and it becomes a task, a reminder or a note.'],
      [Sun, 'Raahi says good morning once. No streak warnings, ever.'],
      [Bell, 'At most a few nudges a day, all of them yours to switch off.'],
    ],
    screen: '/site/screens/capture.webp', alt: 'The capture sheet over Today: type or speak, then pick task, expense, note, event, journal or document',
    pose: 'pose_pointing_hero',
  },
  {
    time: 'Afternoon',
    title: 'Money that writes itself down.',
    body: 'AIIMIN reads the payment SMS your bank already sends and drafts each entry. You confirm it in a tap and it remembers the place next time.',
    facts: [
      [Receipt, 'Bank messages only. One-time codes and chats are ignored.'],
      [Lock, 'The text is read on your phone and never leaves it.'],
      [Users, 'Split a bill with up to 3 people on Free.'],
    ],
    screen: '/site/screens/money.webp', alt: 'The Money screen: ₹20,525 spent in October against a ₹40,000 plan',
    pose: 'pose_satchel_open_hero',
  },
  {
    time: 'Evening',
    title: "Your family's papers, ready.",
    body: 'Keep Aadhaar, insurance, the car RC and every policy in one place for you and the people you look after. Expiry dates turn into reminders before they matter.',
    facts: [
      [FileLock, 'Files stay on this phone. AIIMIN never uploads them.'],
      [ShieldCheck, 'An emergency card for the day someone needs help.'],
      [WifiSlash, 'Everything opens in airplane mode.'],
    ],
    screen: '/site/screens/vault.webp', alt: "The Vault screen with profiles for Me, Mom, Dad and Riya, and an emergency card",
    pose: 'pose_holding_postcard_hero',
  },
];

const PROMISES = [
  [DeviceMobile, 'It lives on your phone', 'Tasks, money, documents and your journal are stored on the phone first. No account is needed to use them.'],
  [EyeSlash, 'No ads, no trackers', 'There is no ad, analytics or crash-reporting kit inside the app. Nothing about you is sold.'],
  [AirplaneTilt, 'Works offline', 'Capture, reminders and the vault work with no signal at all.'],
  [ChatCircleText, 'Raahi is an AI, and says so', 'When Raahi writes something for you, it is labelled. Fixed lines like greetings are not AI.'],
];

const LINES = [
  ['First open', "Hi Meera. Let's start small."],
  ['Morning', 'Morning. 3 minimums today.'],
  ['Back after a week', 'Welcome back. No catch-up needed. Start with today.'],
  ['End of day', 'Day closed. Rest well.'],
];

const FAQ = [
  ['Is it really free?', <p key="a">Yes, during the beta. Prices are shown so you know what comes later, but no payment is taken and nothing charges itself, ever. When paid plans start, every tester gets 14 days' notice in the app.</p>],
  ['Which phones does it work on?', <p key="a">Android 8 and newer. There is no iPhone app yet. The website is a companion for a laptop, not a phone app.</p>],
  ['Does AIIMIN read my messages?', <><p key="a">Only if you allow it, and only messages from banks. One-time codes, offers and personal chats are skipped. The text is read on your phone and is never sent anywhere.</p><p key="b">You can turn it off any time in Settings, and the app still works without it.</p></>],
  ['Where are my documents stored?', <p key="a">In the app's private storage on your phone. Sensitive ones are encrypted with a key held by your phone. Backups go only to a folder you choose, encrypted with your passphrase.</p>],
  ['Who is Raahi?', <p key="a">Raahi is the small traveller who walks your day with you, and the name on everything the app's AI writes. Raahi has no sad face, never guilts you, and can be switched off. <Link to="/brand">Meet Raahi</Link>.</p>],
  ['How do I install it?', <p key="a">Testers get the app as a signed file from aiimin.in, with the code to check it. The <Link to="/app">Android app page</Link> has the steps. Play Store comes later.</p>],
  ['Can I delete everything?', <p key="a">Yes. Erase is in Settings › Privacy, and data that lives only on your phone goes with the app. <Link to="/data-deletion">How deletion works</Link>.</p>],
];

const inr = (n) => '₹' + n.toLocaleString('en-IN');

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
        description="A calm Android app for your day, your money and your family's papers. It lives on your phone, reads bank SMS on the phone, and never shows ads. Join the free beta."
        path="/waitlist"
      />

      <section className="s-hero">
        <div className="s-wrap s-hero__grid">
          <div style={{ paddingBottom: 'clamp(24px, 6vw, 110px)' }}>
            <h1>Know what's<br />next<span className="s-dot">.</span></h1>
            <p className="s-hero__sub">Your day, your money and your family's papers, on your phone. <strong>Start small. Keep going.</strong></p>
            <JoinForm id="join" />
            <div className="s-hero__beta">
              <span><Check weight="bold" /> Android 8+</span>
              <span><Check weight="bold" /> Free during the beta</span>
              {count && <span className="num"><Check weight="bold" /> {count.toLocaleString('en-IN')} people waiting</span>}
            </div>
          </div>
          <div className="s-hero__stage">
            <DayArc />
            <img className="s-hero__raahi" src={raahi('pose_idle_hero')} alt="Raahi, a small traveller in a sand hood and orange scarf" width="768" height="768" fetchpriority="high" />
            <Phone src="/site/screens/today.webp" alt="AIIMIN's Today screen" eager />
          </div>
        </div>
      </section>

      <section className="s-sec" aria-labelledby="day-h">
        <div className="s-wrap">
          <div className="s-head2 s-rv">
            <h2 id="day-h" className="s-h2">One app for the three things that pile up.</h2>
            <p className="s-lede">Not a dashboard to manage. AIIMIN shows the one thing that matters now, then gets out of the way.</p>
          </div>
          <div className="s-day">
            {MOMENTS.map((m) => (
              <article key={m.time} className="s-moment">
                <div className="s-rv">
                  <p className="s-moment__time"><i aria-hidden="true" />{m.time}</p>
                  <h3>{m.title}</h3>
                  <p>{m.body}</p>
                  <ul className="s-facts">
                    {m.facts.map(([I, t]) => <li key={t}><I aria-hidden="true" />{t}</li>)}
                  </ul>
                </div>
                <div className="s-moment__art s-rv">
                  <Phone src={m.screen} alt={m.alt} />
                  <img className="s-moment__raahi" src={raahi(m.pose)} alt="" width="768" height="768" loading="lazy" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="s-sec--tight" aria-labelledby="trust-h">
        <div className="s-wrap">
          <div className="s-ink s-rv">
            <span className="s-ink__sun" aria-hidden="true" />
            <h2 id="trust-h" className="s-h2">What's yours stays on your phone.</h2>
            <p className="s-lede">Each line below is how the app is built today, not a plan. The <Link to="/privacy" style={{ color: '#fff' }}>privacy policy</Link> says the same in full.</p>
            <div className="s-promises">
              {PROMISES.map(([I, b, s]) => (
                <div key={b} className="s-promise"><I aria-hidden="true" /><div><b>{b}</b><span>{s}</span></div></div>
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
            <p className="s-ai"><b>Plainly:</b> Raahi is also the name on the app's AI. Anything it writes for you says "Written by Raahi, an AI. Check the numbers." Greetings are fixed lines, written by people.</p>
            <p style={{ marginTop: 24 }}><Link className="s-btn s-btn--ghost" to="/brand">More about Raahi <ArrowRight weight="bold" /></Link></p>
          </div>
        </div>
      </section>

      <section className="s-sec" id="plans" aria-labelledby="plans-h" style={{ scrollMarginTop: 80 }}>
        <div className="s-wrap">
          <div className="s-head2 s-rv">
            <h2 id="plans-h" className="s-h2">Free now. Fair prices later.</h2>
            <p className="s-lede">The same four plans as the app. A plan lists only what works today; what is still being built sits under "Coming next".</p>
          </div>
          <div className="s-plans s-rv">
            {PLANS.map((p) => (
              <div key={p.id} className="s-plan" data-rec={!!p.recommended}>
                <p className="s-plan__name">{p.name}{p.recommended && <small>Most picked</small>}</p>
                <p className="s-plan__price num">{p.monthly ? inr(p.monthly) : '₹0'}<span>{p.monthly ? ' / month' : ' forever'}</span></p>
                <p className="s-plan__year num">{p.yearly ? `or ${inr(p.yearly)} a year` : ''}</p>
                <p className="s-plan__hero">{p.hero}</p>
                <ul>{p.includes.map((i) => <li key={i}><Check weight="bold" aria-hidden="true" />{i}</li>)}</ul>
                {p.coming?.length > 0 && <p className="s-plan__soon"><b>Coming next:</b> {p.coming.join(' · ')}</p>}
              </div>
            ))}
          </div>
          <div className="s-beta">
            <span><b style={{ color: 'var(--ink)' }}>Beta: free for now. No payment is taken.</b></span>
            <span>When billing starts it goes through Google Play. Nothing auto-charges.</span>
          </div>
        </div>
      </section>

      <section className="s-sec" aria-labelledby="found-h">
        <div className="s-wrap s-found">
          <div className="s-rv">
            <h2 id="found-h" className="s-h2">Be one of the first 500.</h2>
            <p className="s-lede">Founding testers shape the app on real phones. Tell us what breaks and what you would change.</p>
            <div className="s-founding">
              <strong>50%</strong>
              <p>off any paid plan, for life, for the first 500 testers. It starts when paid plans do.</p>
            </div>
            <div style={{ marginTop: 28 }}><JoinForm button="Save my place" compact /></div>
          </div>
          <div className="s-rv">
            <h3 style={{ fontSize: 26, marginBottom: 8 }}>Invite friends, both of you win.</h3>
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
        <div className="s-wrap" style={{ maxWidth: 900 }}>
          <h2 id="faq-h" className="s-h2 s-rv" style={{ marginBottom: 36 }}>Questions.</h2>
          <div className="s-faq">
            {FAQ.map(([q, a]) => (
              <details key={q}><summary>{q}<Plus aria-hidden="true" /></summary><div>{a}</div></details>
            ))}
          </div>
        </div>
      </section>

      <section className="s-sec">
        <div className="s-wrap s-close s-rv">
          <img src={raahi('pose_quiet_celebration_hero')} alt="" width="768" height="768" loading="lazy" />
          <h2 className="s-h2">Start small. Keep going.</h2>
          <JoinForm button="Join the beta" compact />
        </div>
      </section>
    </Shell>
  );
}
