import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AndroidLogo, ArrowRight, Check, Copy, DownloadSimple } from '@phosphor-icons/react';
import Shell, { Meta, Phone, raahi } from './Shell';
import JoinForm from './JoinForm';
import { RELEASE, hasDownload } from './release';

// Plain-language versions of the app's own consent text (PRD Part 23). Each one asks first, in the app, before Android does.
const PERMS = [
  ['Bank texts (SMS)', 'Turns payment texts from your bank into entries. OTPs, offers and personal chats are skipped, and nothing leaves your phone.', 'Optional'],
  ['Notifications', 'Reminders you set, plus a few gentle nudges you can switch off.', 'Optional'],
  ['Microphone', "Lets you speak a task instead of typing it. Your phone does the listening; AIIMIN keeps no audio.", 'Optional'],
  ['Steps and sleep', 'Reads steps, sleep and exercise from Health Connect to show your day. Read only, kept on your phone.', 'Optional'],
  ['Screen time', 'Shows how long you spend in apps. Stays on this phone.', 'Optional'],
  ['Fingerprint or face', 'Locks your documents with the same unlock you already use.', 'Optional'],
  ['Internet', 'Only for things you switch on, like sign-in and sync. Never for ads or tracking.', 'Needed'],
];

const SCREENS = [
  ['/site/screens/today.webp', 'Today', 'The time, your day as a gentle arc, the one next thing and your minimums.'],
  ['/site/screens/money.webp', 'Money', 'What you spent against your plan, written down from your bank texts.'],
  ['/site/screens/emerg.webp', 'Vault', 'Papers for everyone you look after, with an emergency card for each.'],
  ['/site/screens/you.webp', 'You', 'Your Life Score, weekly review and every setting in one place.'],
];

/** For people who want to verify the file. Folded away: most testers never need it (PRD W7 still requires it on the page). */
function Verify({ value }) {
  const [ok, setOk] = useState(false);
  return (
    <details className="s-dl__verify">
      <summary>Check the file is genuine (optional)</summary>
      <p>On a laptop, run <code>shasum -a 256</code> on the file. The result must match this code exactly.</p>
      <code className="s-dl__code">{value}</code>
      <button type="button" className="s-btn s-btn--sm s-btn--ghost" style={{ marginTop: 8 }}
        onClick={async () => { try { await navigator.clipboard.writeText(value); setOk(true); setTimeout(() => setOk(false), 1800); } catch { /* ignore */ } }}>
        {ok ? <><Check weight="bold" /> Copied</> : <><Copy /> Copy code</>}
      </button>
    </details>
  );
}

export default function AppPage() {
  const dl = hasDownload();
  return (
    <Shell cta={dl ? <a className="s-btn s-btn--sm" href={RELEASE.url}>Download</a> : undefined}>
      <Meta
        title="AIIMIN for Android · Free beta"
        description="Get the AIIMIN beta on any Android 8+ phone. Four simple install steps, every permission explained in plain words, and all of it optional."
        path="/app"
      />

      <section className="s-wrap s-dl">
        <div>
          <p className="s-pill" style={{ marginBottom: 22 }}><AndroidLogo weight="fill" aria-hidden="true" /> Android · free beta</p>
          <h1>AIIMIN<br />for Android.</h1>
          <p className="s-hero__sub" style={{ maxWidth: '36ch' }}>The whole app on your phone. Beta testers get it first, straight from this site. Play Store comes later.</p>

          <div className="s-dl__card">
            <ul className="s-dl__meta">
              <li><Check weight="bold" aria-hidden="true" /> Free during the beta</li>
              <li><Check weight="bold" aria-hidden="true" /> Any phone on {RELEASE.minAndroid} or newer</li>
              <li><Check weight="bold" aria-hidden="true" /> Works offline</li>
            </ul>
            {dl ? (
              <>
                <a className="s-btn" href={RELEASE.url} style={{ width: '100%' }}><DownloadSimple weight="bold" /> Download AIIMIN{RELEASE.sizeMb ? ` · ${RELEASE.sizeMb} MB` : ''}</a>
                <Verify value={RELEASE.sha256} />
              </>
            ) : (
              <>
                <p className="s-dl__note">The beta opens to founding testers first. Join with your email and we send your download link when your place is ready.</p>
                <JoinForm button="Get the beta" compact />
              </>
            )}
          </div>
        </div>
        <div className="s-stage"><Phone src="/site/screens/money.webp" alt="AIIMIN's Money screen: October spending on pace for the monthly plan" eager /></div>
      </section>

      <section className="s-sec--tight" aria-labelledby="steps-h">
        <div className="s-wrap">
          <h2 id="steps-h" className="s-h2 s-rv" style={{ marginBottom: 40 }}>Install in four easy steps.</h2>
          <ol className="s-steps s-rv">
            <li><b>Get your invite</b><p>Join with your email. When your place opens, the download link lands in your inbox.</p></li>
            <li><b>Download</b><p>Open the link on your phone and tap download. Only use links from aiimin.in.</p></li>
            <li><b>Allow the install</b><p>Android asks once if your browser may install apps. Tap Allow. You can switch it back off after.</p></li>
            <li><b>Open and start small</b><p>Set-up takes about a minute. Every permission asks first, and each one is optional.</p></li>
          </ol>
          <p className="s-small" style={{ marginTop: 28 }}>Updates come from here too. Install the new version over the old one and everything you saved stays put.</p>
        </div>
      </section>

      <section className="s-sec" aria-labelledby="perm-h">
        <div className="s-wrap" style={{ maxWidth: 980 }}>
          <div className="s-rv">
            <h2 id="perm-h" className="s-h2">What it asks for, and why.</h2>
            <p className="s-lede" style={{ marginBottom: 36 }}>The app explains each one in plain words before Android asks. Say no to any of them and the rest keeps working.</p>
          </div>
          <table className="s-perms s-rv">
            <thead><tr><th scope="col">Permission</th><th scope="col">What it is for</th><th scope="col">Needed?</th></tr></thead>
            <tbody>
              {PERMS.map(([p, w, n]) => (
                <tr key={p}><td>{p}</td><td>{w}</td><td><span className={`s-pill ${n === 'Optional' ? 's-pill--ok' : ''}`}>{n}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="s-sec--tight" aria-labelledby="look-h">
        <div className="s-wrap">
          <div className="s-head2 s-rv">
            <h2 id="look-h" className="s-h2">Four tabs. That's all.</h2>
            <p className="s-lede">Every screen below shows sample data. Your app starts empty and fills with your own day.</p>
          </div>
          <div className="s-gallery">
            {SCREENS.map(([src, t, d]) => (
              <figure key={t} className="s-gallery__item s-rv"><Phone src={src} alt={`The ${t} screen`} caption={null} /><figcaption><b>{t}</b>{d}</figcaption></figure>
            ))}
          </div>
        </div>
      </section>

      <section className="s-sec">
        <div className="s-wrap s-close s-rv">
          <img src={raahi('pose_nodding_hero')} alt="" width="768" height="768" loading="lazy" />
          <h2 className="s-h2">Ready when you are.</h2>
          <p className="s-lede" style={{ margin: '0 auto' }}>Join the beta today. It is free, and your place in the queue is saved the moment you join.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link className="s-btn" to="/waitlist#join">Get early access <ArrowRight weight="bold" /></Link>
            <Link className="s-btn s-btn--ghost" to="/privacy">Read the privacy policy</Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
