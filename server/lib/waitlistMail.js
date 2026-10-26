/**
 * Waitlist emails in the public site's look (web/src/site/site.css): evidence beige, warm ink, one orange.
 * Plain tables and inline styles so Gmail, Outlook and Apple Mail render the same; no web fonts are required.
 *
 * Prices and the founding offer mirror web/src/marketing/plans.js (copied from the Android app). Change them
 * there first, then here.
 */

export const FOUNDING_SEATS = 251;
const FOUNDING_OFF = 0.5;
const PRO_MONTHLY = 99;
const SITE = 'https://aiimin.in';

const C = {
  base: '#F5F3EE',
  surface: '#FBFAF7',
  border: '#DEDAD2',
  ink: '#1A1916',
  muted: '#625E57',
  faint: '#8A8478',
  accent: '#FF6B35',
  accentText: '#C24E20',
  accentSoft: '#F6E5DA',
};
const DISPLAY = "'Funnel Display', 'Golos Text', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const BODY = "'Golos Text', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const MARK = "'Bodoni Moda', Didot, Georgia, 'Times New Roman', serif";

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const inr = (n) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
const firstName = (name) => (name ? String(name).trim().split(/\s+/)[0] : '');

/** A real position (1-based row in signup order) is founding while it is inside the first FOUNDING_SEATS. */
export function isFounding(position) {
  const n = Number(position);
  return Number.isInteger(n) && n >= 1 && n <= FOUNDING_SEATS;
}

function referralLink(code) {
  return code ? `${SITE}/?ref=${encodeURIComponent(code)}` : null;
}

function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${C.ink}" style="border-radius:12px;">
    <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 22px;font-family:${BODY};font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:12px;">${escapeHtml(label)}</a>
  </td></tr></table>`;
}

function steps(items) {
  return items.map(([title, text], i) => `
    <tr>
      <td width="40" valign="top" style="padding:0 0 18px;">
        <div style="width:28px;height:28px;border-radius:14px;background:${i === items.length - 1 ? C.accent : C.surface};border:1px solid ${i === items.length - 1 ? C.accent : C.border};font-family:${DISPLAY};font-size:14px;font-weight:600;line-height:28px;text-align:center;color:${C.ink};">${i + 1}</div>
      </td>
      <td valign="top" style="padding:3px 0 18px;font-family:${BODY};font-size:15px;line-height:1.55;color:${C.muted};">
        <b style="color:${C.ink};font-weight:600;">${title}</b><br>${text}
      </td>
    </tr>`).join('');
}

function layout({ preheader, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>AIIMIN</title>
</head>
<body style="margin:0;padding:0;background:${C.base};color:${C.ink};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${escapeHtml(preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.base}" style="background:${C.base};">
<tr><td align="center" style="padding:32px 16px 40px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
    <tr><td style="padding:0 4px 20px;">
      <a href="${SITE}" style="text-decoration:none;color:${C.ink};">
        <span style="display:inline-block;width:10px;height:10px;border-radius:5px;background:${C.accent};margin-right:8px;vertical-align:middle;"></span><span style="font-family:${MARK};font-size:20px;font-weight:700;letter-spacing:0.08em;vertical-align:middle;">AIIMIN</span>
      </a>
    </td></tr>
    <tr><td bgcolor="${C.surface}" style="background:${C.surface};border:1px solid ${C.border};border-radius:22px;padding:36px 32px 32px;">
      ${bodyHtml}
    </td></tr>
    <tr><td style="padding:22px 8px 0;font-family:${BODY};font-size:12.5px;line-height:1.6;color:${C.faint};">
      You are getting this because this email joined the AIIMIN beta list at aiimin.in. Replies reach the AIIMIN team.<br>
      AIIMIN · An Android app for your day, your money and your family’s papers · Made in India
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

/** Heading + paragraph pair used by the story sections. */
const section = (title, text) => `
  <div style="font-family:${DISPLAY};font-size:19px;font-weight:600;line-height:1.3;color:${C.ink};margin:30px 0 8px;">${title}</div>
  <div style="font-family:${BODY};font-size:16px;line-height:1.65;color:${C.muted};">${text}</div>`;

/** Plain-HTML picture of the idea: scattered apps on the left, one calm place on the right, the sun between. */
const RAIL = `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 6px;"><tr>
    <td width="68%" valign="middle"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="3" bgcolor="${C.ink}" style="height:3px;font-size:0;line-height:0;border-radius:2px;">&nbsp;</td></tr></table></td>
    <td width="20" valign="middle" align="center"><div style="width:18px;height:18px;border-radius:9px;background:${C.accent};margin:0 4px;font-size:0;line-height:0;">&nbsp;</div></td>
    <td valign="middle"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="3" bgcolor="${C.border}" style="height:3px;font-size:0;line-height:0;border-radius:2px;">&nbsp;</td></tr></table></td>
  </tr></table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 4px;"><tr>
    <td width="60%" valign="top" style="font-family:${BODY};font-size:13px;line-height:1.45;color:${C.faint};">A to-do app, a bank app, a chat full of photos of your papers</td>
    <td valign="top" align="right" style="font-family:${BODY};font-size:13px;line-height:1.45;color:${C.ink};font-weight:600;">One calm app on your phone</td>
  </tr></table>`;

const QUOTES = ['spent 240 on lunch', 'call the CA about advance tax', 'pay the electricity bill friday 6pm'];
const quoteBlock = `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 0;"><tr>
    <td width="3" bgcolor="${C.border}" style="background:${C.border};font-size:0;">&nbsp;</td>
    <td style="padding:2px 0 2px 16px;font-family:${BODY};font-size:15.5px;line-height:1.75;color:${C.faint};">${QUOTES.map((q) => `“${escapeHtml(q)}”`).join('<br>')}</td>
  </tr></table>`;

/**
 * Sent once, right after someone joins. Written as a short letter from the founder, in the voice of the site.
 * @param {{ name?: string, position?: number|null, referral_code?: string|null }} v
 */
export function renderWaitlistWelcome(v = {}) {
  const name = firstName(v.name);
  const pos = Number(v.position) || null;
  const founding = isFounding(pos);
  const ref = referralLink(v.referral_code);
  const hi = name ? `Welcome to AIIMIN, ${escapeHtml(name)}.` : 'Welcome to AIIMIN.';

  const subject = founding ? `Welcome to AIIMIN, founding member #${pos}` : 'Welcome to AIIMIN';
  const preheader = founding
    ? `You’re #${pos} of ${FOUNDING_SEATS} and keep 50% off for life. Here is what AIIMIN is and why I built it.`
    : 'Here is what AIIMIN is, why I built it, and what happens next.';

  const badge = founding
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;"><tr><td bgcolor="${C.accentSoft}" style="background:${C.accentSoft};border-radius:16px;padding:20px 22px;">
        <div style="font-family:${BODY};font-size:13px;font-weight:600;color:${C.accentText};margin:0 0 6px;">Founding member</div>
        <div style="font-family:${DISPLAY};font-size:38px;font-weight:650;line-height:1;letter-spacing:-0.03em;color:${C.ink};">#${pos} <span style="font-size:17px;font-weight:500;color:${C.muted};letter-spacing:0;">of ${FOUNDING_SEATS}</span></div>
        <div style="font-family:${BODY};font-size:15px;line-height:1.55;color:${C.ink};margin:10px 0 0;">You keep 50% off any paid plan for as long as you stay on it. Pro is ${inr(PRO_MONTHLY)} a month; yours is <b>${inr(PRO_MONTHLY * (1 - FOUNDING_OFF))}</b>.</div>
      </td></tr></table>`
    : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;"><tr><td style="border:1px solid ${C.border};border-radius:16px;padding:18px 22px;font-family:${BODY};font-size:15px;line-height:1.55;color:${C.muted};">
        <b style="color:${C.ink};font-family:${DISPLAY};font-size:20px;">${pos ? `#${pos.toLocaleString('en-IN')} on the list.` : 'You are on the list.'}</b><br>All ${FOUNDING_SEATS} founding spots are taken, and you still get the Android beta before the public.
      </td></tr></table>`;

  const referral = ref
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:34px 0 0;"><tr><td style="border-top:1px solid ${C.border};padding:24px 0 0;">
        <div style="font-family:${DISPLAY};font-size:19px;font-weight:600;color:${C.ink};margin:0 0 8px;">Want to move up the queue?</div>
        <div style="font-family:${BODY};font-size:16px;line-height:1.65;color:${C.muted};margin:0 0 10px;">Each friend who joins with your link gets a month of Plus on us. Bring 3 and you get 3 months of Plus; bring 10 for a year of Pro.</div>
        <div style="font-family:${BODY};font-size:15px;font-weight:600;"><a href="${escapeHtml(ref)}" style="color:${C.accentText};text-decoration:underline;">${escapeHtml(ref.replace('https://', ''))}</a></div>
      </td></tr></table>`
    : '';

  const body = `
    <h1 style="margin:0 0 18px;font-family:${DISPLAY};font-size:30px;font-weight:600;line-height:1.15;letter-spacing:-0.02em;color:${C.ink};">${hi}</h1>
    <div style="font-family:${BODY};font-size:16px;line-height:1.65;color:${C.muted};">
      <p style="margin:0 0 14px;">I’m Aaditya. I built AIIMIN, and you’re one of the first people on its list, so here is a short catch-up on what it is and why.</p>
      <p style="margin:0;">Your day, your money and your family’s papers all matter at the same moment, yet they live in different places. A to-do app, a bank app, a chat full of photos of the car RC and the insurance policy. When something is due, the thing you need is always in the other one.</p>
    </div>
    ${RAIL}
    <div style="font-family:${BODY};font-size:16px;line-height:1.65;color:${C.muted};margin:14px 0 0;">So AIIMIN puts all three in one calm Android app, and keeps them on your phone.</div>
    ${badge}
    ${section('Your day opens on one thing', 'Today shows the one task that matters right now, with a focus timer for it and a few small daily “minimums”, like a 20-minute walk. Say a task out loud, or type it the way you’d text yourself:')}
    ${quoteBlock}
    ${section('Your money fills itself in', 'If you say yes, AIIMIN reads payment texts from your bank and drafts each one as an expense. You review it, and it remembers the shop next time. OTPs, offers and personal chats are skipped, and the text is read on your phone and never uploaded.')}
    ${section('Your family’s papers are ready when it matters', 'Keep IDs, policies and the car RC for everyone you look after, with a reminder before each one expires and an emergency card with blood group, allergies and who to call. The files stay on your phone.')}
    ${section('It’s early', `This is a beta, so some things will break or feel odd. When they do, reply to this email and it reaches me. Your invite link comes to this address when it’s your turn, and you can see how install works at <a href="${SITE}/app" style="color:${C.accentText};text-decoration:underline;">aiimin.in/app</a>.`)}
    ${referral}
    <div style="font-family:${BODY};font-size:16px;line-height:1.65;color:${C.muted};margin:34px 0 0;">Thanks for being here this early.</div>
    <div style="font-family:${DISPLAY};font-size:18px;font-weight:600;color:${C.ink};margin:14px 0 0;">Aaditya</div>
    <div style="font-family:${BODY};font-size:13.5px;color:${C.faint};margin:2px 0 0;">Founder, AIIMIN</div>`;

  const html = layout({ preheader, bodyHtml: body });

  const text = [
    hi,
    'I’m Aaditya. I built AIIMIN, and you’re one of the first people on its list.',
    founding
      ? `You’re founding member #${pos} of ${FOUNDING_SEATS}: you keep 50% off any paid plan for life.`
      : pos ? `You’re #${pos} on the list. You still get the Android beta before the public.` : 'You are on the list.',
    'AIIMIN puts your day, your money and your family’s papers in one calm Android app, and keeps them on your phone.',
    'Today: the one task that matters now, a focus timer and small daily minimums. Say a task out loud or type it like a text.',
    'Money: with your yes, bank payment texts become expenses you review. Read on your phone, never uploaded; OTPs, offers and chats are skipped.',
    'Vault: IDs, policies and an emergency card for your family, with expiry reminders. Files stay on your phone.',
    'It’s a beta. If something breaks, reply to this email and it reaches me. Your invite link comes to this address when it’s your turn.',
    ref ? `Your link (each friend gets a month of Plus): ${ref}` : '',
    '— Aaditya, Founder, AIIMIN',
  ].filter(Boolean).join('\n\n');

  return { subject, html, text };
}

/**
 * Sent when the owner approves someone from the list.
 * @param {{ name?: string, position?: number|null, download_url?: string|null }} v
 */
export function renderWaitlistInvite(v = {}) {
  const name = firstName(v.name);
  const founding = isFounding(v.position);
  const href = v.download_url || `${SITE}/app`;
  const subject = 'Your AIIMIN invite is ready';
  const html = layout({
    preheader: 'Open this on your Android phone to install the beta.',
    bodyHtml: `
      <h1 style="margin:0 0 10px;font-family:${DISPLAY};font-size:32px;font-weight:600;line-height:1.1;letter-spacing:-0.02em;color:${C.ink};">Your turn${name ? `, ${escapeHtml(name)}` : ''}.</h1>
      <p style="margin:0 0 26px;font-family:${BODY};font-size:16px;line-height:1.6;color:${C.muted};">The AIIMIN beta is ready for you. Open this email on your Android phone and follow the steps.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${steps([
          ['Download', 'Tap the button below. Only use links from aiimin.in.'],
          ['Allow the install', 'Android asks once if your browser can install apps. Tap Allow; you can turn it off afterwards.'],
          ['Open and start small', 'Set-up takes about a minute. Every permission is explained before Android asks.'],
          ['Tell us what to fix', 'Shake your phone on any screen to send a note with a screenshot of it, or just reply to this email.'],
        ])}
      </table>
      ${founding ? `<p style="margin:4px 0 24px;padding:14px 16px;border-radius:12px;background:${C.accentSoft};font-family:${BODY};font-size:14.5px;line-height:1.55;color:${C.ink};">You are a founding member: your 50% off any paid plan is already saved to this email.</p>` : ''}
      ${button(href, 'Get the Android app')}`,
  });
  const text = `Your turn${name ? `, ${name}` : ''}. The AIIMIN beta is ready. Open this on your Android phone: ${href}`;
  return { subject, html, text };
}
