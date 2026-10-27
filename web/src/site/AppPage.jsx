import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AndroidLogo, Check, Copy, DownloadSimple } from '@phosphor-icons/react';
import Shell, { Meta, Phone } from './Shell';
import JoinForm from './JoinForm';
import { RELEASE, hasDownload } from './release';
import { FOUNDING } from '../marketing/plans';

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
  ['/site/screens/today.webp', 'Today', 'Your day, the next task and the daily minimums you choose.'],
  ['/site/screens/money.webp', 'Money', 'Your spending against the plan, with entries drafted from bank texts.'],
  ['/site/screens/vault.webp', 'Vault', 'Papers for each person you look after, with the ones about to expire on top.'],
  ['/site/screens/emerg.webp', 'Emergency card', 'Blood group, allergies, medicines and who to call. It opens even when the vault is locked.'],
];

/** For people who want to verify the file. Folded away: most testers never need it (PRD W7 still requires it on the page). */
function Verify({ value }) {
  const [ok, setOk] = useState(false);
  return (
    <details className="s-dl__verify">
      <summary>Verify the download (optional)</summary>
      <p>For an advanced check, compare the file's SHA-256 value with this code. Most people can skip this step.</p>
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
        title="AIIMIN for Android · Beta"
        description="Get the AIIMIN beta on an Android phone running Android 8 or later. See how to install it and what each permission is for."
        path="/app"
      />

      <section className="s-wrap s-dl">
        <div className="s-dl__copy">
          <p className="s-pill s-dl__pill"><AndroidLogo weight="fill" aria-hidden="true" /> Android · beta</p>
          <h1>AIIMIN<br />for Android.</h1>
          <p className="s-hero__sub" style={{ maxWidth: '40ch' }}>Today, Money and your family's Vault on one phone, ready even in airplane mode. The Play Store version follows the beta.</p>
        </div>

        <div className="s-dl__card">
          <ul className="s-dl__meta">
            <li><Check weight="bold" aria-hidden="true" /> First {FOUNDING.seats} testers keep 50% off, for life</li>
            <li><Check weight="bold" aria-hidden="true" /> Any phone on {RELEASE.minAndroid} or newer</li>
          </ul>
          {dl ? (
            <>
              <a className="s-btn" href={RELEASE.url} style={{ width: '100%' }}><DownloadSimple weight="bold" /> Download AIIMIN{RELEASE.sizeMb ? ` · ${RELEASE.sizeMb} MB` : ''}</a>
              <Verify value={RELEASE.sha256} />
            </>
          ) : (
            <>
              <p className="s-dl__note">Join with your email. We’ll send your download link when it’s your turn.</p>
              <JoinForm button="Get early access" compact />
            </>
          )}
        </div>

        <div className="s-stage"><Phone src="/site/screens/money.webp" alt="AIIMIN's Money screen: October spending on pace for the monthly plan" eager /></div>
      </section>

      <section className="s-sec--tight" aria-labelledby="steps-h">
        <div className="s-wrap">
          <h2 id="steps-h" className="s-h2 s-rv" style={{ marginBottom: 40 }}>Install in four easy steps.</h2>
          <ol className="s-steps s-rv">
            <li><b>Get your invite</b><p>Join with your email. We’ll send the download link when it’s your turn.</p></li>
            <li><b>Download</b><p>Open the link on your phone and tap download. Only use links from aiimin.in.</p></li>
            <li><b>Allow the install</b><p>Android will ask if your browser can install apps. Tap Allow to continue; you can turn this off afterwards.</p></li>
            <li><b>Open and start small</b><p>Set-up takes about a minute. AIIMIN explains each permission before asking, and optional permissions can be skipped.</p></li>
          </ol>
          <p className="s-small" style={{ marginTop: 28 }}>Updates come from here too. Install the new version over the old one and everything you saved stays put.</p>
        </div>
      </section>

      <section className="s-sec" aria-labelledby="perm-h">
        <div className="s-wrap">
          <div className="s-head2 s-rv">
            <h2 id="perm-h" className="s-h2">What it asks for, and why.</h2>
            <p className="s-lede">The app explains each one in plain words before Android asks. Say no to any of them and the rest keeps working.</p>
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
            <h2 id="look-h" className="s-h2">What you’ll open every day.</h2>
            <p className="s-lede">Every screen below shows sample data. Your app starts empty and fills with your own day.</p>
          </div>
          <p className="s-gallery-hint">Swipe to see all four screens</p>
          <div className="s-gallery" role="region" aria-label="AIIMIN app screen gallery" tabIndex={0}>
            {SCREENS.map(([src, t, d]) => (
              <figure key={t} className="s-gallery__item s-rv"><Phone src={src} alt={`The ${t} screen`} caption={null} /><figcaption><b>{t}</b>{d}</figcaption></figure>
            ))}
          </div>
        </div>
      </section>

      <section className="s-sec">
        <div className="s-wrap">
          <div className="s-cta s-rv">
            <div>
              <h2 className="s-h2">Ready when you are.</h2>
              <p>Claim a founding spot. We’ll email your download link when it’s your turn. <Link to="/privacy">Read the privacy policy</Link></p>
            </div>
            <JoinForm button="Get early access" compact />
          </div>
        </div>
      </section>
    </Shell>
  );
}
