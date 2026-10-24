import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AndroidLogo, ArrowRight, Check, Copy, DownloadSimple } from '@phosphor-icons/react';
import Shell, { Meta, Phone, raahi } from './Shell';
import JoinForm from './JoinForm';
import { RELEASE, hasDownload } from './release';

// Each line is the app's own consent text (PRD Part 23), shortened only where noted.
const PERMS = [
  ['Bank SMS', 'Reads messages from banks to draft your payments. Skips one-time codes, offers and personal chats. The text never leaves your phone.', 'Optional'],
  ['Notifications', 'Reminders you set and a few gentle nudges you can turn off. No guilt, no streak warnings.', 'Optional'],
  ['Microphone', "Turns your voice into text with your phone's own speech recogniser. AIIMIN keeps no audio.", 'Optional'],
  ['Health Connect', 'Steps, sleep, resting heart rate and exercise, to show your day. Read only, kept on the phone.', 'Optional'],
  ['Usage access', 'How long apps are open, for your screen time. On this phone only.', 'Optional'],
  ['Fingerprint', "Locks the vault with your phone's own fingerprint or face unlock.", 'Optional'],
  ['Internet', 'Only for things you switch on, like sign-in and sync. Never for ads or tracking.', 'Needed'],
];

const SCREENS = [
  ['/site/screens/today.webp', 'Today', 'The time, your day as an arc, the one next thing and your minimums.'],
  ['/site/screens/money.webp', 'Money', 'Spending against your plan, drafted from bank SMS on the phone.'],
  ['/site/screens/vault.webp', 'Vault', "Everyone's papers, with an emergency card and expiry reminders."],
  ['/site/screens/you.webp', 'You', 'Life Score, patterns, weekly review and every setting.'],
];

function Sha({ value }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="s-dl__sha">
      SHA-256 checksum
      <code>{value}</code>
      <button type="button" className="s-btn s-btn--sm s-btn--ghost" style={{ marginTop: 8 }}
        onClick={async () => { try { await navigator.clipboard.writeText(value); setOk(true); setTimeout(() => setOk(false), 1800); } catch { /* ignore */ } }}>
        {ok ? <><Check weight="bold" /> Copied</> : <><Copy /> Copy checksum</>}
      </button>
    </div>
  );
}

export default function AppPage() {
  const dl = hasDownload();
  return (
    <Shell cta={dl ? <a className="s-btn s-btn--sm" href={RELEASE.url}>Download</a> : undefined}>
      <Meta
        title="AIIMIN for Android · Beta"
        description="Install the AIIMIN beta on Android 8 or newer: a signed file from aiimin.in with its SHA-256 checksum, clear install steps and every permission explained."
        path="/app"
      />

      <section className="s-wrap s-dl">
        <div>
          <p className="s-pill" style={{ marginBottom: 22 }}><AndroidLogo weight="fill" aria-hidden="true" /> Android · closed beta</p>
          <h1>AIIMIN<br />for Android.</h1>
          <p className="s-hero__sub" style={{ maxWidth: '38ch' }}>The whole app, on your phone. Testers install a signed file from this page. Play Store comes later.</p>

          <div className="s-dl__card">
            <dl className="s-dl__meta">
              <div><dt>Version</dt><dd className="num">{RELEASE.version}</dd></div>
              <div><dt>Needs</dt><dd>{RELEASE.minAndroid}+</dd></div>
              <div><dt>Size</dt><dd className="num">{RELEASE.sizeMb ? `${RELEASE.sizeMb} MB` : 'At release'}</dd></div>
            </dl>
            {dl ? (
              <>
                <a className="s-btn" href={RELEASE.url} style={{ width: '100%' }}><DownloadSimple weight="bold" /> Download the APK</a>
                <Sha value={RELEASE.sha256} />
              </>
            ) : (
              <>
                <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 14 }}>
                  The signed beta file opens to founding testers first. Join with your email and the download link and its checksum come to you.
                </p>
                <JoinForm button="Get the beta" compact />
              </>
            )}
          </div>
        </div>
        <div className="s-dl__phones" aria-hidden="false">
          <Phone src="/site/screens/money.webp" alt="AIIMIN Money screen" tag={null} eager />
          <Phone src="/site/screens/today.webp" alt="AIIMIN Today screen" tag="Sample data" eager />
        </div>
      </section>

      <section className="s-sec--tight" aria-labelledby="steps-h">
        <div className="s-wrap">
          <h2 id="steps-h" className="s-h2 s-rv" style={{ marginBottom: 40 }}>Install in four steps.</h2>
          <ol className="s-steps s-rv">
            <li><b>Download</b><p>Get the file from this page only. Links shared elsewhere may not be ours.</p></li>
            <li><b>Check the code</b><p>On a laptop run <code>shasum -a 256 aiimin.apk</code>. It must match the checksum above, letter for letter.</p></li>
            <li><b>Allow this install</b><p>Android asks once whether your browser or Files app may install apps. Allow it, then switch it off again after.</p></li>
            <li><b>Open AIIMIN</b><p>Raahi takes about a minute to set things up. Every permission asks first, and each one is optional.</p></li>
          </ol>
          <p className="s-small" style={{ marginTop: 28 }}>Updates come from this page too, each with its own checksum. Install the new file over the old one and your data stays. Nothing installs by itself.</p>
        </div>
      </section>

      <section className="s-sec" aria-labelledby="perm-h">
        <div className="s-wrap" style={{ maxWidth: 980 }}>
          <div className="s-rv">
            <h2 id="perm-h" className="s-h2">What it asks for, and why.</h2>
            <p className="s-lede" style={{ marginBottom: 36 }}>The app explains each permission in these words just before Android asks. Say no to any of them and the rest keeps working.</p>
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
            <p className="s-lede">Screens from the beta with a sample profile. Your app starts empty and fills with your own day.</p>
          </div>
          <div className="s-gallery">
            {SCREENS.map(([src, t, d]) => (
              <figure key={t} className="s-rv"><Phone src={src} alt={`The ${t} screen`} tag={null} /><figcaption><b>{t}</b>{d}</figcaption></figure>
            ))}
          </div>
        </div>
      </section>

      <section className="s-sec">
        <div className="s-wrap s-close s-rv">
          <img src={raahi('pose_nodding_hero')} alt="" width="768" height="768" loading="lazy" />
          <h2 className="s-h2">On a phone right now?</h2>
          <p className="s-lede" style={{ margin: '0 auto' }}>The website is a companion for a laptop. On your phone, AIIMIN is the app.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link className="s-btn" to="/waitlist#join">Join the beta <ArrowRight weight="bold" /></Link>
            <Link className="s-btn s-btn--ghost" to="/privacy">Read the privacy policy</Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
