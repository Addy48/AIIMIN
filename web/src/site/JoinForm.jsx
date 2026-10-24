import React, { useEffect, useId, useState } from 'react';
import { ArrowRight, Check, Copy, WhatsappLogo } from '@phosphor-icons/react';
import { API_URL } from '../utils/api';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const KEY = 'aiimin_waitlist_signup';

const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } };
const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* private window */ } };

function refFromUrl() {
  try {
    const r = new URLSearchParams(window.location.search).get('ref');
    return r && /^[A-Za-z0-9_-]{3,32}$/.test(r) ? r : null;
  } catch { return null; }
}

/** Email only (PRD 32.7 W2). Nothing is sent to analytics: the old form passed the email to gtag. */
export default function JoinForm({ id, button = 'Join the beta', compact = false }) {
  const inputId = useId();
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | busy | error | done
  const [msg, setMsg] = useState('');
  const [done, setDone] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { const s = read(); if (s?.email) { setDone(s); setState('done'); } }, []);
  useEffect(() => {
    const on = () => { const s = read(); if (s?.email) { setDone(s); setState('done'); } };
    window.addEventListener('aiimin:joined', on);
    return () => window.removeEventListener('aiimin:joined', on);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) { setState('error'); setMsg('That email looks incomplete. Check it and try again.'); return; }
    setState('busy'); setMsg('');
    try {
      const payload = { email: clean, source: 'site_v4' };
      const ref = refFromUrl();
      if (ref) payload.referred_by = ref;
      const res = await fetch(`${API_URL}/waitlist`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState('error');
        setMsg(res.status === 429 ? 'Too many tries from here. Wait a minute, then try again.' : (data.error || 'We could not add you just now. Try again in a minute.'));
        return;
      }
      const v = { email: clean, code: data.referral_code || '', count: data.referral_count ?? 0, again: !!data.already_registered };
      save(v); setDone(v); setState('done');
      window.dispatchEvent(new Event('aiimin:joined'));
    } catch {
      setState('error'); setMsg('No connection. Check your internet and try again.');
    }
  };

  if (state === 'done' && done) {
    const link = done.code ? `https://aiimin.in/?ref=${encodeURIComponent(done.code)}` : 'https://aiimin.in';
    const share = `https://wa.me/?text=${encodeURIComponent(`I'm testing AIIMIN, a calm Android app for your day, money and family papers. Join with my link and get 1 month of Plus free: ${link}`)}`;
    const copy = async () => { try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* no clipboard */ } };
    return (
      <div className="s-done" id={id} role="status">
        <h3>{done.again ? 'You are already on the list.' : 'You are in. Check your email.'}</h3>
        <p>We will write to <b style={{ color: 'var(--ink)' }}>{done.email}</b> when your invite is ready. {done.code ? 'Share your link: each friend who joins moves you up the queue.' : ''}</p>
        {done.code && (
          <>
            <div className="s-done__link">
              <code>{link.replace('https://', '')}</code>
              <button type="button" className="s-btn s-btn--sm s-btn--ghost" onClick={copy}>{copied ? <><Check weight="bold" /> Copied</> : <><Copy /> Copy</>}</button>
            </div>
            <div className="s-done__share">
              <a className="s-btn s-btn--sm" href={share} target="_blank" rel="noopener noreferrer"><WhatsappLogo weight="fill" /> Share on WhatsApp</a>
            </div>
            {done.count > 0 && <p className="num" style={{ marginTop: 12 }}>{done.count} {done.count === 1 ? 'friend has' : 'friends have'} joined with your link.</p>}
          </>
        )}
        <p style={{ marginTop: 14, fontSize: 13 }}>
          Not you? <button type="button" onClick={() => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } setDone(null); setState('idle'); setEmail(''); }} style={{ border: 0, background: 'none', padding: 0, font: 'inherit', textDecoration: 'underline', cursor: 'pointer', color: 'inherit' }}>Use another email</button>
        </p>
      </div>
    );
  }

  return (
    <form className="s-join" id={id} onSubmit={submit} noValidate>
      <label htmlFor={inputId} className="s-sr">Email address</label>
      <div className="s-join__row" data-error={state === 'error'}>
        <input id={inputId} type="email" inputMode="email" autoComplete="email" placeholder="you@email.com" value={email}
          onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
          aria-invalid={state === 'error'} aria-describedby={`${inputId}-n`} required />
        <button className="s-btn" type="submit" disabled={state === 'busy'}>
          {state === 'busy' ? 'Adding you…' : <>{button} <ArrowRight weight="bold" /></>}
        </button>
      </div>
      {state === 'error'
        ? <p className="s-join__err" id={`${inputId}-n`} role="alert">{msg}</p>
        : !compact && <p className="s-join__note" id={`${inputId}-n`}>Email only. One invite email, no newsletter. Free during the beta.</p>}
    </form>
  );
}
