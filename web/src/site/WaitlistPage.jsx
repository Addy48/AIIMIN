import React, { useEffect, useState } from 'react';
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
    body: 'Your bank already texts you after every payment. AIIMIN turns those texts into entries, you tap once to confirm, and it remembers the shop next time.',
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
    body: 'Aadhaar, insurance, the car RC and every policy, for you and the people you look after. Expiry dates turn into reminders before they become a problem.',
    facts: [
      [FileLock, 'Files stay on this phone. AIIMIN never uploads them.'],
      [ShieldCheck, 'An emergency card with blood group, allergies and who to call.'],
      [WifiSlash, 'Everything opens without internet.'],
    ],
    screen: '/site/screens/emerg.webp', alt: "Meera's emergency card: blood group, allergies, medicines, doctor and a call button for her brother",
  },
];

const PROMISES = [
  [DeviceMobile, 'It lives on your phone', 'Tasks, money, documents and your journal are saved on your phone. You do not even need an account.'],
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
  ['Which phones does it work on?', <p key="a">Android phones on Android 8 or newer, which covers almost every phone sold since 2018. There is no iPhone app yet.</p>],
  ['Does AIIMIN read my messages?', <><p key="a">Only if you say yes, and only texts from banks. OTPs, offers and personal chats are skipped. The text is read on your phone and is never sent anywhere.</p><p key="b">You can switch it off any time, and the rest of the app keeps working.</p></>],
  ['Is my data safe?', <p key="a">Your data stays on your phone. Sensitive documents are locked with a key only your phone holds. Backups go only where you choose, protected by a passphrase you set. <Link to="/privacy">Read the privacy policy</Link>.</p>],
  ['Who is Raahi?', <p key="a">Raahi is the small traveller who keeps you company through the day, and the name on everything the app's AI writes. Raahi never guilts you, and you can switch Raahi off. <Link to="/brand">Meet Raahi</Link>.</p>],
  ['How do I install it?', <p key="a">When your invite is ready we email you a link. Open it on your phone, tap download, allow the install once, and you are in. The <Link to="/app">Android app page</Link> shows each step. Play Store comes later.</p>],
  ['Can I delete everything?', <p key="a">Yes, in one tap from Settings › Privacy. Uninstalling the app removes everything stored on your phone. <Link to="/data-deletion">How deletion works</Link>.</p>],
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
        description="One calm Android app for your day, your money and your family's papers. Spends write themselves from your bank texts, papers stay on your phone, and there are no ads. Free beta."
        path="/waitlist"
      />

      <section className="s-hero">
        <div className="s-wrap s-hero__grid">
          <div className="s-hero__copy">
            <h1>Know what's<br />next<span className="s-dot">.</span></h1>
            <p className="s-hero__sub">Your day, your money and your family's papers in one calm Android app. <strong>Start small. Keep going.</strong></p>
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
            <img className="s-hero__raahi" src={raahi('pose_idle_hero')} alt="Raahi, a small traveller in a sand hood and orange scarf" width="768" height="768" />
            <Phone src="/site/screens/today.webp" alt="AIIMIN's Today screen: the time, the day as an arc, the one next task and daily minimums" eager />
          </div>
        </div>
      </section>

      <section className="s-sec" aria-labelledby="day-h">
        <div className="s-wrap">
          <div className="s-head2 s-rv">
            <h2 id="day-h" className="s-h2">One app for the three things that pile up.</h2>
            <p className="s-lede">No dashboard to babysit. AIIMIN shows the one thing that matters right now, then gets out of your way.</p>
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
                <div className="s-stage s-rv"><Phone src={m.screen} alt={m.alt} /></div>
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
                <p className="s-plan__name">{p.name}{p.recommended && <small>Most picked</small>}</p>
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
            <div style={{ marginTop: 28 }}><JoinForm button="Save my place" compact /></div>
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
        <div className="s-wrap" style={{ maxWidth: 900 }}>
          <h2 id="faq-h" className="s-h2 s-rv" style={{ marginBottom: 36 }}>Questions, answered.</h2>
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
          <p className="s-lede" style={{ margin: 0 }}>Takes ten seconds. Just your email, and one invite when your place is ready.</p>
          <JoinForm button="Get early access" compact />
        </div>
      </section>
    </Shell>
  );
}
