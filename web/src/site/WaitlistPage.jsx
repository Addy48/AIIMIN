import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AirplaneTilt, ArrowRight, ChatCircleText, Check, DeviceMobile, EyeSlash, FileLock, Lock,
  Microphone, Plus, Timer, Receipt, ShieldCheck, Sun, Users, WifiSlash, Browser, ChartLineUp, DownloadSimple,
} from '@phosphor-icons/react';
import Shell, { Meta, Phone, raahi } from './Shell';
import JoinForm from './JoinForm';
import { PLANS, REFERRAL, FOUNDING, REGIONS, foundingPrice, money, regionPrice } from '../marketing/plans';
import useRegion from './useRegion';
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
      [Users, 'Split a bill with the people you share costs with.'],
    ],
    screen: '/site/screens/spend.webp', alt: "October's biggest payments, each drafted from a bank text: Ola ₹1,860, Myntra ₹1,340, Café Goodluck ₹1,260, then spending by category",
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
    screen: '/site/screens/vault.webp', alt: "The Vault for Meera's family: a profile for each person, an emergency card, and a car insurance policy that ends in 11 days",
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
  ['What is AIIMIN?', <p key="a">One app for your day, your money and your family's papers. Plan the day and keep a few small habits, see where your money went from your bank texts, and keep documents with their expiry dates. It lives on your Android phone, and the website is its bigger screen.</p>],
  ['How do I get it?', <p key="a">Join the list with your email. Invites go out in small groups, and we email you an install link when yours is ready. Each friend who joins with your link moves you up the queue.</p>],
  ['How do I install it?', <p key="a">When your invite is ready we email you a link. Open it on your phone, tap download, allow the install once, and you are in. The <Link to="/app">Android app page</Link> shows each step. Play Store comes later.</p>],
  ['Which phones does it work on?', <p key="a">AIIMIN works on Android phones running Android 8 or later. There is no iPhone app yet. The website works in any modern browser.</p>],
  ['Do I need an account?', <p key="a">Not to start. Everything you add is saved on the phone. You need an account only for things that go beyond one phone, like using the website.</p>],
  ['Does AIIMIN read my messages?', <><p key="a">Only if you say yes, and only texts from banks. OTPs, offers and personal chats are skipped. The text is read on your phone and is never sent anywhere.</p><p key="b">You can switch it off any time, and the rest of the app keeps working.</p></>],
  ['Is my data safe?', <p key="a">Your data stays on your phone. Sensitive documents are locked with a key only your phone holds. If you set up a backup, it is encrypted with your passphrase and saved to a folder you choose. <Link to="/privacy">Read the privacy policy</Link>.</p>],
  ['Are there ads? Do you sell data?', <p key="a">No to both. There is no ad or tracking code in the app or on the website, and nothing about you is sold.</p>],
  ['Does it work without internet?', <p key="a">Yes. You can add things, get reminders and open your papers in airplane mode. The internet is needed only for things you switch on, like sign-in and sync.</p>],
  ['Who is Raahi?', <p key="a">Raahi is the small traveller who keeps you company through the day, and the name on everything the app's AI writes, so you always know what AI wrote. Raahi never guilts you, and you can switch Raahi off. <Link to="/brand">Meet Raahi</Link>.</p>],
  ['How does Family work?', <p key="a">One plan for you and up to 5 others. Each person uses their own phone and has their own private space.</p>],
  ['What does it cost?', <p key="a">In India, Plus is ₹59 a month, Pro ₹119 and Family ₹199, billed through Google Play, with about 40% off when you pay yearly. Other countries pay a local price, shown in the plans above. The first {FOUNDING.seats} testers keep 50% off any of them for life. A Free plan covers the essentials for one person, with no time limit. Testers pay nothing during the beta and hear 14 days before paid plans begin.</p>],
  ['Why are prices different by country?', <p key="a">We price for what things cost where you live. The plans above show the price for your country, and Google Play charges you in your own money.</p>],
  ['Can I cancel?', <p key="a">Any time, in Google Play. You keep the plan until the end of the period you paid for. If you stop paying, nothing is deleted: you move to Free, and anything above the Free limits stays readable and can be exported.</p>],
  ['Do you offer refunds?', <p key="a">Yes. If you are unhappy within 7 days of your first payment on a plan, write to <a href="mailto:support@aiimin.in">support@aiimin.in</a>. Approved refunds reach you in 5 to 7 working days. <Link to="/refunds">Refund policy</Link>.</p>],
  ['Can I delete everything?', <p key="a">Yes, in one tap from Settings › Privacy. Uninstalling the app removes everything stored on your phone. <Link to="/data-deletion">How deletion works</Link>.</p>],
];

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
            <ul className="s-facts s-rv s-stagger">
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

// The hero walks one sample day: the Today screen at four real times, with the sun moving behind the phone.
const DAY = [
  { key: 'morning', label: 'Morning', time: '8:44 am', alt: 'Today at 8:44 in the morning: the day arc just begun, and the next task, Call the CA about advance tax' },
  { key: 'afternoon', label: 'Afternoon', time: '1:05 pm', alt: 'Today at 1:05 in the afternoon: the day arc climbing, with the line All clear, Raahi is resting, and the three minimums below' },
  { key: 'evening', label: 'Evening', time: '6:50 pm', alt: 'Today at 6:50 in the evening: the day arc past its peak, with Walk 20 minutes as the next minimum' },
  { key: 'night', label: 'Night', time: '10:15 pm', alt: 'Today at 10:15 at night: the day arc almost finished, with three minimums still open' },
];

// Day progress p runs 0 (morning) to 3 (night). One rAF loop eases the painted value toward the target and writes
// opacity and transforms straight to the elements, so scrolling never re-renders React and never steps.
const SUN_KF = [[-0.35, -0.75, 1.55], [0, -0.6, 1.05], [1, 0, -0.04], [2, 0.6, 1.05], [2.7, 0.82, 1.5]];
const SUN_RGB = [[255, 154, 110], [255, 107, 53], [228, 103, 58]];
const DAY_SCROLL_SHARE = 0.8; // Keep the night screen pinned for a short final scroll after the moon has risen.
const sstep = (t) => t * t * (3 - 2 * t);
const lerpN = (a, b, t) => a + (b - a) * t;
const clampN = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
function sunAt(p) {
  let k = 0;
  while (k < SUN_KF.length - 2 && p > SUN_KF[k + 1][0]) k += 1;
  const [p0, x0, y0] = SUN_KF[k]; const [p1, x1, y1] = SUN_KF[k + 1];
  const t = sstep(clampN((p - p0) / (p1 - p0), 0, 1));
  return [lerpN(x0, x1, t), lerpN(y0, y1, t)];
}
function sunColor(p) {
  const f = clampN(p, 0, 2); const k = Math.min(1, Math.floor(f)); const t = f - k;
  return SUN_RGB[k].map((c, n) => Math.round(lerpN(c, SUN_RGB[k + 1][n], t))).join(',');
}

function HeroDay() {
  const [i, setI] = useState(0);
  const ref = useRef(null);
  const sunRef = useRef(null);
  const moonRef = useRef(null);
  const imgs = useRef([]);
  const st = useRef({ cur: -0.35, target: 0, raf: 0, last: 0, shown: -1, still: false, narrow: false, w: 0, heroVisibility: 1 });

  const paint = useCallback((p) => {
    const s = st.current;
    const base = Math.min(DAY.length - 1, Math.max(0, Math.floor(p)));
    const frac = clampN(p - base, 0, 1);
    const moonScale = 1.08;
    imgs.current.forEach((im, n) => {
      if (!im) return;
      im.style.opacity = n === base ? '1' : n === base + 1 ? String(sstep(clampN((frac - 0.38) / 0.24, 0, 1))) : '0';
    });
    const sun = sunRef.current; const moon = moonRef.current;
    if (sun && moon) {
      if (!s.w) s.w = sun.offsetWidth / 0.6 || 300;
      const k = s.narrow ? 0.83 : 1;
      const [x, y] = sunAt(p);
      const so = p < 0 ? clampN(1 + p / 0.35, 0, 1) : clampN(1 - (p - 2) / 0.6, 0, 1);
      sun.style.transform = `translate3d(${(x * k * s.w).toFixed(1)}px, ${(y * s.w).toFixed(1)}px, 0)`;
      sun.style.opacity = so.toFixed(3);
      sun.style.backgroundColor = `rgb(${sunColor(p)})`;
      const warmth = clampN(1 - Math.abs(y + 0.04) / 2.4, 0.22, 1);
      sun.style.boxShadow = `0 0 ${(s.w * (0.16 + warmth * 0.16)).toFixed(1)}px ${(s.w * 0.04).toFixed(1)}px rgba(255,107,53,${(0.12 + warmth * 0.18).toFixed(3)})`;
      const m = sstep(clampN((p - 2.35) / 0.65, 0, 1));
      const sc = moonScale;
      // CSS anchors the moon to the phone's outer left edge; scroll only moves it vertically.
      const ty = 0.5 * s.w * (1 - m);
      moon.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0) scale(${sc})`;
      const moonLife = s.heroVisibility;
      moon.style.opacity = (m * moonLife).toFixed(3);
    }
    const near = Math.round(clampN(p, 0, DAY.length - 1));
    const rail = ref.current?.querySelector('.s-dayrail');
    if (rail) {
      rail.querySelectorAll('button').forEach((button, n) => {
        button.style.setProperty('--fill', String(clampN(p - n, 0, 1)));
      });
    }
    if (near !== s.shown) { s.shown = near; setI(near); }
  }, []);

  const tick = useCallback((now) => {
    const s = st.current;
    const dt = Math.min(64, now - (s.last || now)); s.last = now;
    const d = s.target - s.cur;
    if (s.still || Math.abs(d) < 0.0007) { s.cur = s.target; paint(s.cur); s.raf = 0; s.last = 0; return; }
    s.cur += d * (1 - Math.exp(-dt / 70));
    paint(s.cur);
    s.raf = requestAnimationFrame(tick);
  }, [paint]);
  const go = useCallback((p) => {
    const s = st.current; s.target = p;
    if (!s.raf) s.raf = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    const s = st.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    s.still = reduceMotion.matches;
    s.narrow = window.matchMedia('(max-width: 520px)').matches;
    if (s.still) s.cur = 0;
    go(0);
    const onMotionChange = () => {
      s.still = reduceMotion.matches;
      if (s.still) {
        if (s.raf) cancelAnimationFrame(s.raf);
        s.raf = 0; s.last = 0; s.cur = s.target; paint(s.cur);
      } else if (Math.abs(s.target - s.cur) >= 0.0007) go(s.target);
    };
    const onResize = () => { s.w = 0; s.narrow = window.matchMedia('(max-width: 520px)').matches; paint(s.cur); };
    reduceMotion.addEventListener('change', onMotionChange);
    window.addEventListener('resize', onResize);
    return () => { reduceMotion.removeEventListener('change', onMotionChange); window.removeEventListener('resize', onResize); cancelAnimationFrame(s.raf); s.raf = 0; };
  }, [go, paint]);

  // On phones, only the Today stage pins while its own scroll track scrubs the day. The rest of the page stays in flow.
  useEffect(() => {
    const sec = ref.current && ref.current.closest('.s-hero');
    const track = ref.current && ref.current.closest('.s-hero__scroll');
    const mq = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const mobile = window.matchMedia('(max-width: 900px)');
    if (!sec) return undefined;
    const prog = () => {
      const r = sec.getBoundingClientRect();
      const viewportHeight = Math.max(1, window.innerHeight);
      const visibleHeight = Math.max(1, Math.min(r.height, viewportHeight));
      const visible = clampN(Math.min(r.bottom, viewportHeight) - Math.max(r.top, 0), 0, visibleHeight);
      st.current.heroVisibility = visible / visibleHeight;
      if (mobile.matches && track) {
        const trackRect = track.getBoundingClientRect();
        const trackTop = trackRect.top + window.scrollY;
        const trackBottom = trackRect.bottom + window.scrollY;
        const stickyTop = Number.parseFloat(window.getComputedStyle(ref.current).top) || 72;
        const start = trackTop - stickyTop;
        const travel = Math.max(1, trackBottom - trackTop - ref.current.offsetHeight);
        const dayProgress = clampN((window.scrollY - start) / (travel * DAY_SCROLL_SHARE), 0, 1);
        return dayProgress * (DAY.length - 1);
      }
      const grid = sec.querySelector('.s-hero__grid');
      if (grid) {
        const stickyTop = Number.parseFloat(window.getComputedStyle(grid).top) || 64;
        const sectionTop = r.top + window.scrollY;
        const gridTop = sectionTop + (Number.parseFloat(window.getComputedStyle(sec).paddingTop) || 0);
        const sectionBottom = r.bottom + window.scrollY;
        const start = gridTop - stickyTop;
        const travel = Math.max(1, sectionBottom - grid.offsetHeight - start);
        const dayProgress = clampN((window.scrollY - start) / (travel * DAY_SCROLL_SHARE), 0, 1);
        return dayProgress * (DAY.length - 1);
      }
      return 0;
    };
    const onScroll = () => { go(prog()); };
    const sync = () => {
      if (mq.matches) { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); }
      else window.removeEventListener('scroll', onScroll);
    };
    sync();
    mq.addEventListener('change', sync);
    mobile.addEventListener('change', onScroll);
    return () => { mq.removeEventListener('change', sync); mobile.removeEventListener('change', onScroll); window.removeEventListener('scroll', onScroll); };
  }, [go]);

  const pick = (n) => go(n);
  return (
    <div className="s-hero__stage s-dayhero" data-phase={DAY[i].key} ref={ref}>
      <span className="s-hero__sun" ref={sunRef} aria-hidden="true" />
      <figure className="s-device">
      <span className="s-hero__moon" ref={moonRef} aria-hidden="true">
      <svg viewBox="0 0 100 100" width="100%" height="100%" focusable="false">
        <defs>
          <radialGradient id="today-moon-face" cx="31%" cy="27%" r="78%">
            <stop offset="0" stopColor="#fff4e2" />
            <stop offset=".36" stopColor="#e5ded2" />
            <stop offset=".72" stopColor="#b4b8bd" />
            <stop offset="1" stopColor="#737f8e" />
          </radialGradient>
          <radialGradient id="today-moon-warmth" cx="24%" cy="48%" r="75%">
            <stop offset="0" stopColor="#ffc28f" stopOpacity=".42" />
            <stop offset=".56" stopColor="#f0a477" stopOpacity=".16" />
            <stop offset="1" stopColor="#f0a477" stopOpacity="0" />
          </radialGradient>
          <clipPath id="today-moon-clip"><circle cx="50" cy="50" r="45" /></clipPath>
        </defs>
        <circle cx="50" cy="50" r="44" fill="url(#today-moon-face)" />
        <circle cx="50" cy="50" r="44" fill="url(#today-moon-warmth)" />
        <circle cx="50" cy="50" r="44" fill="none" stroke="#fff0db" strokeOpacity=".42" strokeWidth=".9" />
        <g clipPath="url(#today-moon-clip)">
          <ellipse cx="60" cy="42" rx="20" ry="16" fill="#475362" fillOpacity=".075" />
          <ellipse cx="39" cy="49" rx="8" ry="5" fill="#45515f" fillOpacity=".09" />
          <ellipse cx="62" cy="69" rx="12" ry="8" fill="#45515f" fillOpacity=".075" />
          <g fill="#4d5967" fillOpacity=".085" stroke="#fff5e7" strokeOpacity=".18" strokeWidth=".8">
            <circle cx="35" cy="35" r="5.2" />
            <circle cx="73" cy="47" r="3.6" />
            <circle cx="43" cy="71" r="2.7" />
          </g>
          <g fill="none" stroke="#414b57" strokeOpacity=".16" strokeWidth=".8">
            <circle cx="35" cy="35" r="3" />
            <circle cx="73" cy="47" r="2" />
          </g>
        </g>
      </svg>
      </span>
        <div className="s-phone">
          <div className="s-phone__screen">
            {DAY.map((d, n) => (
              <img key={d.key} ref={(el) => { imgs.current[n] = el; }} src={`/site/screens/day-${d.key}.webp`} alt={n === i ? d.alt : ''} aria-hidden={n !== i}
                width="760" height="1562" style={{ opacity: n === 0 ? 1 : 0 }}
                loading="eager" fetchPriority={n === 0 ? 'high' : undefined} decoding="async" />
            ))}
          </div>
        </div>
      </figure>
      <div className="s-dayrail" role="group" aria-label="One sample day">
        {DAY.map((d, n) => (
          <button key={d.key} type="button" aria-pressed={n === i} onClick={() => pick(n)}>
            <span className="s-dayrail__bar" aria-hidden="true"><i key={`${i}-${n}`} /></span>
            <b>{d.label}</b><span className="num">{d.time}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Set to a screenshot of the web view (demo profile only) when it is ready; until then the frame shows the promise. */
const DESK_SHOT = null;
const WEB = [
  [ChartLineUp, 'Your month on a big screen', 'Charts and spending from your phone, laid out for a laptop. Free shows 3 months; Plus shows all of it.'],
  [Browser, 'Private, and off until you want it', 'Sync with aiimin.in stays off until you switch it on. Plus links up to 4 browsers.'],
  [DownloadSimple, 'Export any time', 'Take your data out as a file whenever you like, on every plan.'],
];

function WebCompanion() {
  return (
    <section className="s-sec" aria-labelledby="web-h">
      <div className="s-wrap s-web">
        <div className="s-web__copy s-rv">
          <h2 id="web-h" className="s-h2">Your phone, with a bigger screen.</h2>
          <p className="s-lede">AIIMIN lives on your phone. With the public launch, you can open the same month at aiimin.in on a laptop when you want room to think.</p>
          <ul className="s-web__list s-rv s-stagger">
            {WEB.map(([I, b, t]) => <li key={b}><I aria-hidden="true" /><div><b>{b}</b><span>{t}</span></div></li>)}
          </ul>
        </div>
        <figure className="s-browser s-rv" aria-label={DESK_SHOT ? 'AIIMIN on the web' : undefined}>
          <div className="s-browser__bar" aria-hidden="true"><i /><i /><i /><span>aiimin.in</span></div>
          {DESK_SHOT
            ? <img src={DESK_SHOT} alt="AIIMIN on the web: the month's spending and charts for the sample profile" loading="lazy" />
            : (
              <div className="s-browser__soon">
                <span className="s-browser__sun" aria-hidden="true" />
                <p><b>The web view is getting its own look.</b> First screens arrive with the public launch.</p>
              </div>
            )}
        </figure>
      </div>
    </section>
  );
}

const PAID = PLANS.filter((p) => p.monthly > 0);
const FREE = PLANS.find((p) => p.monthly === 0);
const BEST_FOR = {
  plus: 'For one person who wants every month of their history and every ledger.',
  pro: 'Everything in Plus today. Each Pro feature listed below arrives at no extra cost as it ships.',
  family: 'For the person who looks after everyone’s papers, money and plans.',
};
const saving = (r) => Math.round((1 - r.yearly / (r.monthly * 12)) * 100);
const maxSaving = (region) => Math.max(...PAID.map((p) => saving(regionPrice(p, region))));

function Plans({ reg }) {
  const [yearly, setYearly] = useState(false);
  const { region } = reg;
  const m = (n) => money(n, region);
  return (
    <section className="s-sec" id="plans" aria-labelledby="plans-h">
      <div className="s-wrap">
        <div className="s-plans-head s-rv">
          <div>
            <h2 id="plans-h" className="s-h2">Pay for what it does for you.</h2>
            <p className="s-lede">Each plan lists only what works in the app today. Billing goes through Google Play, and nothing renews without telling you first.</p>
          </div>
          <div className="s-plans-ctl">
            <label className="s-region">
              <span>Prices for</span>
              <select value={region} onChange={(e) => reg.choose(e.target.value)} aria-label="Where you live">
                {Object.entries(REGIONS).map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}
              </select>
            </label>
            <div className="s-bill" role="group" aria-label="Billing period">
              <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)}>Monthly</button>
              <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)}>Yearly <small>save up to {maxSaving(region)}%</small></button>
            </div>
          </div>
        </div>
        <div className="s-plans s-rv s-stagger">
          {PAID.map((p) => {
            const rp = regionPrice(p, region);
            const price = yearly ? rp.yearly : rp.monthly;
            return (
              <article key={p.id} className="s-plan" data-rec={!!p.recommended}>
                <header>
                  <p className="s-plan__name">{p.name}{p.recommended && <small>Recommended</small>}</p>
                  <p className="s-plan__promise">{p.promise}</p>
                </header>
                <p className="s-plan__price num">{m(price)}<span>{yearly ? ' / year' : ' / month'}</span></p>
                <p className="s-plan__year num">{yearly ? `${m(Math.round(rp.yearly / 12 * 100) / 100)} a month, ${saving(rp)}% less than monthly` : `or ${m(rp.yearly)} a year`}</p>
                <p className="s-plan__found num"><b>{m(foundingPrice(price))}</b> for founding members</p>
                <p className="s-plan__hero">{BEST_FOR[p.id]}</p>
                <ul>{p.includes.map((i) => <li key={i}><Check weight="bold" aria-hidden="true" />{i}</li>)}</ul>
                {p.coming?.length > 0 && <p className="s-plan__soon"><b>Coming next:</b> {p.coming.join(' · ')}</p>}
              </article>
            );
          })}
        </div>
        <div className="s-plan-free s-rv">
          <p><b>Starting out on your own?</b> The {FREE.name} plan covers the essentials for one person: Today, Money from your bank texts, and papers for you and 2 family profiles.</p>
          <a className="s-link" href="#join">Get early access <ArrowRight weight="bold" aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}

function Founding({ count, reg }) {
  const left = count != null ? Math.max(FOUNDING.seats - count, 0) : null;
  const full = left === 0;
  const pro = PLANS.find((p) => p.id === 'pro');
  const fam = PLANS.find((p) => p.id === 'family');
  return (
    <section className="s-sec--tight" aria-labelledby="found-h">
      <div className="s-wrap">
        <div className="s-offer s-rv">
          <div className="s-offer__main">
            <h2 id="found-h" className="s-h2">{full ? `All ${FOUNDING.seats} founding spots are taken.` : 'Founding members pay half. For life.'}</h2>
            <p className="s-lede">{full
              ? 'Join the list to get the beta as soon as there is room.'
              : `The first ${FOUNDING.seats} testers keep 50% off any paid plan for as long as they stay on it. You test AIIMIN before anyone else and tell us what to fix.`}</p>
            {!full && (
              <dl className="s-offer__prices">
                {[pro, fam].map((p) => (
                  <div key={p.id}>
                    <dt>{p.name}</dt>
                    <dd className="num"><s>{money(regionPrice(p, reg.region).monthly, reg.region)}</s> <b>{money(foundingPrice(regionPrice(p, reg.region).monthly), reg.region)}</b><span> / month</span></dd>
                  </div>
                ))}
              </dl>
            )}
            {left != null && !full && (
              <div className="s-offer__meter">
                <span className="num"><b>{count.toLocaleString('en-IN')}</b> of {FOUNDING.seats} founding spots claimed</span>
                <i style={{ '--fill': `${Math.min(count / FOUNDING.seats, 1) * 100}%` }} aria-hidden="true" />
              </div>
            )}
            <div className="s-offer__form"><JoinForm button={full ? 'Get early access' : 'Claim my founding spot'} compact /></div>
          </div>
          <div className="s-offer__ref">
            <h3 className="s-found__h3">Invite friends. Earn Plus and Pro.</h3>
            <p>Each friend who joins with your link gets {REFERRAL.friendGets}, and you move up the queue.</p>
            <ol className="s-ladder s-rv s-stagger">
              {REFERRAL.tiers.map((t) => (
                <li key={t.friends}><span className="s-ladder__n num">{t.friends}</span><div><b>{t.friends === 1 ? '1 friend' : `${t.friends} friends`}</b><span>{t.reward}</span></div></li>
              ))}
            </ol>
            <p className="s-small">{REFERRAL.rules} We show you how many friends joined, never who.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WaitlistPage() {
  const count = useCount();
  const reg = useRegion();
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
        description="One calm Android app for your day, your spending and your family's papers. Bank texts help fill in expenses; your documents stay on your phone. Founding members pay half, for life."
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
              <span><Check weight="bold" /> First {FOUNDING.seats} members pay half, for life</span>
              <span><Check weight="bold" /> Android 8 and up</span>
              {count && <span className="num"><Check weight="bold" /> {count.toLocaleString('en-IN')} people waiting</span>}
            </div>
          </div>
          <div className="s-hero__scroll">
            <HeroDay />
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
            <div className="s-moment-gallery" role="region" aria-label="Sample app screens" tabIndex={0}>
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
            <div className="s-promises s-rv s-stagger">
              {PROMISES.map(([I, b, t]) => (
                <div key={b} className="s-promise"><I aria-hidden="true" /><div><b>{b}</b><span>{t}</span></div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WebCompanion />

      <section className="s-sec" aria-labelledby="raahi-h">
        <div className="s-wrap s-raahi">
          <div className="s-raahi__art s-rv">
            <img src={raahi('scene_sitting_sunset')} alt="Raahi sitting on a hill, watching the sun set" width="640" height="579" loading="lazy" />
            <p className="s-bubble" data-out={out}>{LINES[line][1]}</p>
          </div>
          <div className="s-rv">
            <h2 id="raahi-h" className="s-h2">Meet Raahi.</h2>
            <p className="s-lede">Raahi means traveller. It walks through your day with you, says one short line when you open the app, and rests when you do. No sad faces, no guilt, no streaks to lose.</p>
            <ul className="s-lines s-rv s-stagger">
              {LINES.map(([w, l]) => <li key={w}><em>{w}</em><b>"{l}"</b></li>)}
            </ul>
            <p className="s-ai"><b>Plainly:</b> Raahi is also the name on the app's AI. Anything it writes for you is marked "Written by Raahi, an AI. Check the numbers."</p>
            <p style={{ marginTop: 24 }}><Link className="s-btn s-btn--ghost" to="/brand">More about Raahi <ArrowRight weight="bold" /></Link></p>
          </div>
        </div>
      </section>

      <Plans reg={reg} />

      <Founding count={count} reg={reg} />

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
              <p>Join with just your email. The first {FOUNDING.seats} keep half price for life.</p>
            </div>
            <JoinForm button="Get early access" compact />
          </div>
        </div>
      </section>
    </Shell>
  );
}
