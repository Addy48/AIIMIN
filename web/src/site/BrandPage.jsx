import React from 'react';
import { Check, DownloadSimple, X } from '@phosphor-icons/react';
import Shell, { Mark, Meta, raahi } from './Shell';

const POSES = [
  ['pose_idle_hero', 'Idle', 'Standing by, beside the clock.'],
  ['pose_pointing_hero', 'Pointing', 'Showing the one next thing.'],
  ['pose_listening_hero', 'Listening', 'While you speak a task.'],
  ['pose_noticing_hero', 'Noticing', 'Something changed worth a look.'],
  ['pose_satchel_open_hero', 'Satchel open', 'Filing a payment or a paper.'],
  ['pose_holding_postcard_hero', 'Postcard', 'Your weekly review is ready.'],
  ['pose_nodding_hero', 'Nodding', 'A minimum kept.'],
  ['pose_quiet_celebration_hero', 'Quiet cheer', 'A good day, said softly.'],
  ['pose_settle_hero', 'Settle', 'Winding down for the night.'],
  ['pose_sleeping_hero', 'Sleeping', 'Rests on time, even if you did nothing.'],
];

const YES = [
  ['Morning. 3 minimums today.', 'Numbers before adjectives.'],
  ['Welcome back. No catch-up needed.', 'Every return is a fresh start.'],
  ['Day closed. Rest well.', 'Short. Twelve words at most.'],
  ['Written by Raahi, an AI. Check the numbers.', 'AI is named plainly where it writes.'],
];
const NO = [
  ["You broke your 12-day streak!", 'No streak shaming.'],
  ['You missed 3 tasks yesterday.', 'No guilt, no "you missed".'],
  ['Raahi is sad you left 😢', 'No sad, hungry or needy states.'],
  ['Supercharge your life OS!', 'No hype, no jargon.'],
];

const COLORS = [
  ['Evidence beige', '#F5F3EE', 'Every background'],
  ['Warm ink', '#1A1916', 'Text and primary buttons'],
  ['Sun orange', '#FF6B35', 'Fills only: the sun, now, one accent'],
  ['Orange text', '#C24E20', 'When orange must be read'],
  ['Sand hood', '#EADBC7', "Raahi's hood"],
  ['Terracotta scarf', '#C67A4E', "Raahi's scarf"],
];

export default function BrandPage() {
  return (
    <Shell>
      <Meta
        title="Raahi & the AIIMIN brand"
        description="Meet Raahi, the small traveller who is the face and voice of AIIMIN. Poses, tone of voice, colours, type, the AIIMIN mark and a press kit."
        path="/brand"
      />

      <section className="s-wrap s-bhero">
        <div>
          <h1>Raahi.</h1>
          <p className="s-hero__sub" style={{ maxWidth: '36ch' }}>
            Raahi means traveller. A small walker in a sand hood and an orange scarf who keeps you company through the day. Raahi is the face of AIIMIN, and the name on everything its AI writes.
          </p>
          <p style={{ color: 'var(--muted)', maxWidth: '44ch' }}>
            Not a pet to feed, not a coach to please. Raahi has no sad state and never asks for anything. If you do nothing today, Raahi simply sleeps on time.
          </p>
        </div>
        <div className="s-bhero__art"><img src={raahi('scene_holding_lantern')} alt="Raahi holding a lantern at night" width="571" height="640" fetchPriority="high" /></div>
      </section>

      <section className="s-sec--tight" aria-labelledby="poses-h">
        <div className="s-wrap">
          <div className="s-head2 s-rv">
            <h2 id="poses-h" className="s-h2">Ten poses, one calm mood.</h2>
            <p className="s-lede">Each pose has one job in the app. Quiet mode plays at most three small moves a day; Off hides the art and keeps the voice; reduce motion stops it all.</p>
          </div>
          <div className="s-poses">
            {POSES.map(([f, n, d]) => (
              <figure key={f} className="s-pose s-rv">
                <img src={raahi(f)} alt={`Raahi, ${n.toLowerCase()}`} width="768" height="768" loading="lazy" />
                <figcaption><b>{n}</b>{d}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="s-sec" aria-labelledby="tone-h">
        <div className="s-wrap">
          <div className="s-head2 s-rv">
            <h2 id="tone-h" className="s-h2">How Raahi talks.</h2>
            <p className="s-lede">One tone for the app, the website and every email: short, calm, no guilt. The first name appears at most once a day.</p>
          </div>
          <div className="s-tone s-rv">
            <div>
              <h3><Check weight="bold" style={{ color: 'var(--done)' }} aria-hidden="true" /> Raahi says</h3>
              <ul>{YES.map(([l, w]) => <li key={l}>"{l}"<small>{w}</small></li>)}</ul>
            </div>
            <div className="s-tone__no">
              <h3><X weight="bold" style={{ color: 'var(--accent-text)' }} aria-hidden="true" /> Raahi never says</h3>
              <ul>{NO.map(([l, w]) => <li key={l}>"{l}"<small>{w}</small></li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="s-sec--tight" aria-labelledby="mark-h">
        <div className="s-wrap">
          <div className="s-head2 s-rv">
            <h2 id="mark-h" className="s-h2">The mark.</h2>
            <p className="s-lede">An arch for the day, a peak for the climb, and the sun at the point of now. The wordmark is set in Bodoni Moda; it is the only place that face is used.</p>
          </div>
          <div className="s-marks s-rv">
            <div className="s-markcard">
              <div className="s-markcard__art"><Mark size={120} title="AIIMIN mark" /></div>
              <div className="s-markcard__body"><div><b>Symbol</b>App icon, favicon, small spaces</div><a className="s-btn s-btn--sm s-btn--ghost" href="/logo-symbol.svg" download><DownloadSimple /> SVG</a></div>
            </div>
            <div className="s-markcard">
              <div className="s-markcard__art"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}><Mark size={64} /><span className="s-word" style={{ fontSize: 44 }}>AIIMIN</span></span></div>
              <div className="s-markcard__body"><div><b>Lockup</b>Headers, press, slides</div><a className="s-btn s-btn--sm s-btn--ghost" href="/AIIMIN_logo.svg" download><DownloadSimple /> SVG</a></div>
            </div>
            <div className="s-markcard">
              <div className="s-markcard__art s-markcard__art--ink"><span style={{ display: 'grid', justifyItems: 'center', gap: 10 }}><span className="s-word" style={{ fontSize: 40, color: '#fff' }}>AIIMIN</span><span style={{ fontFamily: 'var(--display)', fontSize: 18, color: '#BDB6AA' }}>Start small. Keep going.</span></span></div>
              <div className="s-markcard__body"><div><b>On ink</b>With the logo line</div><a className="s-btn s-btn--sm s-btn--ghost" href="/AIIMIN_logo_dark.svg" download><DownloadSimple /> SVG</a></div>
            </div>
          </div>
        </div>
      </section>

      <section className="s-sec--tight" aria-labelledby="color-h">
        <div className="s-wrap">
          <div className="s-head2 s-rv">
            <h2 id="color-h" className="s-h2">Colour.</h2>
            <p className="s-lede">Light only. Beige and ink do the work; orange is the sun and appears once per screen. No gradients, no purple, no red for alarm.</p>
          </div>
          <div className="s-swatches s-rv">
            {COLORS.map(([n, h, u]) => (
              <div key={h} className="s-swatch"><i style={{ background: h }} /><div><b>{n}</b><code>{h}</code><br />{u}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="s-sec--tight" aria-labelledby="type-h">
        <div className="s-wrap">
          <h2 id="type-h" className="s-h2 s-rv" style={{ marginBottom: 40 }}>Type.</h2>
          <dl className="s-type s-rv">
            <div><dt><b>Funnel Display</b>Headings, the clock, numbers</dt><dd style={{ fontFamily: 'var(--display)', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>12:32 Know what's next.</dd></div>
            <div><dt><b>Golos Text</b>Everything you read</dt><dd style={{ fontSize: 20, maxWidth: '52ch' }}>Your day, your money and your family's papers, on your phone. Bank messages are read on the phone and never leave it.</dd></div>
            <div><dt><b>Bodoni Moda</b>The wordmark only</dt><dd><span className="s-word" style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>AIIMIN</span></dd></div>
          </dl>
        </div>
      </section>

      <section className="s-sec" aria-labelledby="press-h">
        <div className="s-wrap">
          <div className="s-head2 s-rv">
            <h2 id="press-h" className="s-h2">For press and friends.</h2>
            <p className="s-lede">Use the files as they are. For anything else, write to <a href="mailto:support@aiimin.in">support@aiimin.in</a>.</p>
          </div>
          <div className="s-rules s-rv">
            <ul>
              <li><b>Say it like this</b><p>AIIMIN, in capitals. "An Android app for your day, your money and your family's papers." Raahi, never "the AI mascot".</p></li>
              <li><b>Keep the art whole</b><p>Don't recolour, crop or redraw Raahi, give it new expressions, or show it sad. Leave room around the mark.</p></li>
              <li><b>Stay honest</b><p>Describe only what the beta does today. Prices are in the plans; the beta is free and takes no payment.</p></li>
            </ul>
          </div>
        </div>
      </section>
    </Shell>
  );
}
