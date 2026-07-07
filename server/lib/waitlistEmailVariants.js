/**
 * AIIMIN waitlist confirmation email — light (c6) + dark (Route Y) via prefers-color-scheme.
 * Env: WAITLIST_MEMBER_OFFSET=122 · WAITLIST_DISPLAY_CAP=300 · RESEND_WAITLIST_TEMPLATE_ID
 */

import { darkModeHeadBlock, LOGO_URL } from './waitlistEmailStyles.js';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const BASE = {
  base: '#F0EDE8',
  surface: '#FAFAF9',
  elevated: '#EDE8DF',
  border: '#E2DDD7',
  text1: '#1A1A1A',
  text2: '#4A5340',
  text3: '#9A9186',
  accent: '#1E5C3A',
  accentDark: '#164530',
  accentSoft: '#E8F0EB',
  white: '#FFFFFF',
  siteUrl: 'https://www.aiimin.in',
};

const THEME = {
  heroBg: 'linear-gradient(135deg, #F0EDE8 0%, #E8F0EB 55%, #E8F0EB 100%)',
  heroText: '#164530',
  heroSub: '#4A5340',
  badgeBg: '#164530',
  badgeText: '#FFFFFF',
  osIdBg: '#FFFFFF',
  osIdBorder: '#C5D9CC',
  osIdLabel: '#9A9186',
  osIdText: '#1E5C3A',
  ctaBg: '#1E5C3A',
};

const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600;700&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap';
const FONT_DISPLAY = "'Familjen Grotesk', Georgia, 'Times New Roman', serif";
const FONT_BODY = "'Figtree', system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', Courier, monospace";

export const MEMBER_OFFSET = Number(process.env.WAITLIST_MEMBER_OFFSET || 122);
export const DISPLAY_CAP = Number(process.env.WAITLIST_DISPLAY_CAP || 300);

export function toDisplayMemberNumber(actualPosition) {
  if (actualPosition == null || Number.isNaN(Number(actualPosition))) return null;
  return Number(actualPosition) + MEMBER_OFFSET;
}

function normalizeCtx(v = {}) {
  const firstName = v.name ? escapeHtml(String(v.name).split(' ')[0]) : 'friend';
  const osId = v.reserved_username ? escapeHtml(v.reserved_username) : null;
  const referralCode = v.referral_code ? escapeHtml(v.referral_code) : null;
  const referralUrl = referralCode ? `https://www.aiimin.in/?ref=${referralCode}` : null;

  const rawMember = v.member_number != null ? Number(v.member_number) : null;
  const displayNum = rawMember != null && !Number.isNaN(rawMember) ? rawMember : null;
  const cap = v.total_count != null ? Number(v.total_count) : DISPLAY_CAP;
  const countLabel = displayNum
    ? `Founding member #${displayNum} of ${cap}`
    : 'Founding member';

  return { firstName, osId, referralCode, referralUrl, memberNumber: displayNum, totalCount: cap, countLabel };
}

function emailHeader() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="wl-header" style="margin:0 0 0;padding:0 0 20px;">
    <tr><td style="padding:28px 28px 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="padding-right:12px;vertical-align:middle;">
          <img src="${LOGO_URL}" width="44" height="44" alt="AIIMIN" border="0" style="display:block;border:0;border-radius:10px;">
        </td>
        <td style="vertical-align:middle;text-align:left;">
          <span class="wl-brand" style="font-family:${FONT_DISPLAY};font-size:19px;font-weight:700;letter-spacing:0.3px;color:${BASE.text1};">AIIMIN</span>
          <div class="wl-tag" style="font-family:${FONT_MONO};font-size:10.5px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:${BASE.text3};margin-top:2px;">Personal OS</div>
        </td>
      </tr></table>
    </td></tr>
  </table>`;
}

function emailShell({ preheader, title, bodyHtml, ctaHref, ctaLabel, footerNote }) {
  const pre = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;color:transparent;font-size:1px;line-height:1px;">${escapeHtml(preheader)}</div>`
    : '';

  const cta = ctaHref
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" class="wl-cta" style="margin:28px 0 0;width:100%;">
        <tr><td bgcolor="${THEME.ctaBg}" style="border-radius:9px;background-color:${THEME.ctaBg};text-align:center;">
          <a href="${ctaHref}" style="display:block;padding:15px 32px;font-family:${FONT_DISPLAY};font-size:15px;font-weight:600;color:${BASE.white};text-decoration:none;border-radius:9px;">${escapeHtml(ctaLabel || 'Continue')}</a>
        </td></tr>
      </table>`
    : '';

  const footer = footerNote
    ? `<p class="wl-text" style="margin:16px 0 0;font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:${BASE.text3};text-align:center;">${footerNote}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${darkModeHeadBlock()}
  <title>${escapeHtml(title)}</title>
  <link href="${FONT_LINK}" rel="stylesheet">
</head>
<body class="wl-body" style="margin:0;padding:0;background-color:${BASE.base};font-family:${FONT_BODY};color:${BASE.text1};">
${pre}
<table role="presentation" class="wl-outer" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BASE.base};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" class="wl-frame" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:${BASE.surface};border:1px solid ${BASE.border};border-radius:14px;overflow:hidden;">
<tr><td>
  ${emailHeader()}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="padding:0 28px 8px;">
      <h1 class="wl-h1" style="margin:0 0 22px;font-family:${FONT_DISPLAY};font-size:30px;font-weight:600;line-height:1.15;color:${BASE.text1};">${title}</h1>
      ${bodyHtml}
      ${cta}
      ${footer}
    </td>
  </tr></table>
</td></tr>
<tr><td class="wl-footer" style="padding:20px 28px 28px;text-align:center;border-top:1px solid ${BASE.border};font-family:${FONT_BODY};font-size:11.5px;line-height:1.6;color:${BASE.text3};">
  Built in India · <a href="${BASE.siteUrl}" style="color:${BASE.accent};text-decoration:none;">aiimin.in</a><br>
  You're receiving this because you joined the AIIMIN waitlist.
</td></tr>
</table></td></tr></table>
</body></html>`;
}

function heroBand({ countLabel, headline, subline }) {
  return `<table role="presentation" class="wl-hero" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;border-radius:10px;overflow:hidden;border:1px solid ${BASE.border};">
    <tr><td bgcolor="${BASE.base}" style="background:${THEME.heroBg};padding:24px 26px;">
      <table role="presentation" class="wl-badge-count" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px;"><tr>
        <td bgcolor="${THEME.badgeBg}" style="background-color:${THEME.badgeBg};border-radius:20px;padding:6px 12px;font-family:${FONT_MONO};font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:${THEME.badgeText};">${escapeHtml(countLabel)}</td>
      </tr></table>
      <div class="wl-hero-title" style="font-family:${FONT_DISPLAY};font-size:21px;font-weight:600;line-height:1.3;color:${THEME.heroText};margin-bottom:10px;">${headline}</div>
      ${subline ? `<div class="wl-hero-sub wl-text" style="font-family:${FONT_BODY};font-size:14.5px;line-height:1.6;color:${THEME.heroSub};">${subline}</div>` : ''}
    </td></tr>
  </table>`;
}

export function osIdBlock(osId) {
  if (!osId) return '';
  return `<table role="presentation" class="wl-osid" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr><td bgcolor="${THEME.osIdBg}" style="background-color:${THEME.osIdBg};border:1px solid ${THEME.osIdBorder};border-radius:10px;padding:22px;text-align:center;">
      <div class="wl-osid-label" style="font-family:${FONT_MONO};font-size:10px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${THEME.osIdLabel};margin-bottom:8px;">Your identity on AIIMIN</div>
      <div class="wl-osid-handle" style="font-family:${FONT_MONO};font-size:24px;font-weight:500;color:${THEME.osIdText};letter-spacing:0.06em;line-height:1;">@${osId}</div>
      <div class="wl-osid-sub wl-text" style="font-family:${FONT_BODY};font-size:12px;line-height:1.5;color:${BASE.text3};margin-top:8px;">Locked to this email · ships at launch</div>
    </td></tr>
  </table>`;
}

function perksBlock() {
  return `<table role="presentation" class="wl-box" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;border:1px solid ${BASE.border};border-radius:10px;overflow:hidden;">
    <tr class="wl-box-lbl"><td style="padding:12px 20px;font-family:${FONT_MONO};font-size:10.5px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:${BASE.text3};background:${BASE.elevated};border-bottom:1px solid ${BASE.border};">What you locked in</td></tr>
    <tr class="wl-box-body"><td style="padding:16px 20px;font-family:${FONT_BODY};font-size:14px;line-height:1.9;color:${BASE.text2};">
      <div><b class="wl-text-strong" style="color:${BASE.text1};font-weight:600;">Core tier</b> — complimentary at launch</div>
      <div><b class="wl-text-strong" style="color:${BASE.text1};font-weight:600;">Life Score + XP</b> — your days start keeping score</div>
      <div><b class="wl-text-strong" style="color:${BASE.text1};font-weight:600;">Founding Pro</b> — ₹49/mo locked (public pays ₹59)</div>
    </td></tr>
  </table>`;
}

function timelineBlock() {
  const step = (n, t, d) => `<tr class="wl-step-row" style="border-bottom:1px solid ${BASE.border};">
    <td class="wl-step-num" style="padding:12px 0;width:28px;vertical-align:top;font-family:${FONT_MONO};font-size:11px;color:${BASE.accent};">${n}</td>
    <td style="padding:12px 0 12px 16px;vertical-align:top;">
      <div class="wl-step-title" style="font-family:${FONT_BODY};font-size:14.5px;font-weight:600;color:${BASE.text1};margin-bottom:4px;">${t}</div>
      <div class="wl-step-desc wl-text" style="font-family:${FONT_BODY};font-size:13px;line-height:1.5;color:${BASE.text3};">${d}</div>
    </td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 26px;">
    <tr><td class="wl-section-lbl" style="font-family:${FONT_MONO};font-size:10.5px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:${BASE.text3};padding-bottom:14px;">What happens next</td></tr>
    ${step('01', 'You\'re in the first 300', 'Founding pricing and Core access — locked to this email.')}
    ${step('02', '31 July', 'Tester keys go out. Activate before then for complimentary Elite, one year.')}
    ${step('03', 'September', 'Launch. You hear from us before anyone on the public feed.')}
  </table>`;
}

export function referralBlock(referralUrl) {
  if (!referralUrl) return '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 0;">
    <tr><td><div class="wl-divider" style="height:1px;background:${BASE.border};margin:0 0 26px;"></div></td></tr>
    <tr><td class="wl-referral-title" style="font-family:${FONT_BODY};font-size:15px;font-weight:600;color:${BASE.text1};padding-bottom:8px;">Help shape what we build</td></tr>
    <tr><td class="wl-referral-text wl-text" style="font-family:${FONT_BODY};font-size:13.5px;line-height:1.6;color:${BASE.text2};padding-bottom:14px;">Founding members can invite people who'll actually use a Personal OS — not to inflate a list, but to find the right co-builders.</td></tr>
    <tr><td><div class="wl-referral-link" style="font-family:${FONT_MONO};font-size:12.5px;color:${BASE.accent};border:1px solid ${BASE.border};background:${BASE.surface};padding:12px 16px;border-radius:8px;word-break:break-all;">${referralUrl}</div></td></tr>
  </table>`;
}

function founderClosing() {
  return `<p class="wl-sign wl-text" style="font-family:${FONT_BODY};font-size:14px;line-height:1.7;color:${BASE.text2};margin:26px 0 20px;">
    Thanks for believing in AIIMIN this early. You're among the first people shaping what it becomes, and that means more than you might think. If you have an idea, a question, or feedback, just reply to this email — I read every message.<br><br>
    <span class="wl-sign-name" style="font-weight:600;color:${BASE.text1};">— Aaditya</span>
  </p>`;
}

function renderV8(ctx) {
  const { firstName, osId, referralUrl, countLabel, memberNumber } = ctx;
  return {
    subject: memberNumber
      ? `#${memberNumber} — ${firstName}, it starts here`
      : `${firstName}, it starts here`,
    html: emailShell({
      preheader: `You're in the first 300. Core free at launch · Life Score · founding Pro ₹49/mo.`,
      title: 'It starts here.',
      bodyHtml: `
        ${heroBand({
          countLabel,
          headline: 'You\'re becoming one of the people shaping AIIMIN.',
          subline: `${firstName}, thanks for showing up before the crowd. Your future self will point at today.`,
        })}
        <p class="wl-text" style="font-family:${FONT_BODY};font-size:15px;line-height:1.7;color:${BASE.text2};margin:0 0 24px;">
          You weren't looking for another app. You were looking for a Personal OS — sleep, gym, mood, money, and focus in one loop that tells the truth about your days.
        </p>
        ${perksBlock()}
        ${osIdBlock(osId)}
        ${timelineBlock()}
        ${referralBlock(referralUrl)}
        ${founderClosing()}`,
      ctaHref: referralUrl || BASE.siteUrl,
      ctaLabel: referralUrl ? 'Invite someone who gets it →' : 'Visit AIIMIN →',
      footerNote: 'Got a tester invite? Register by <strong>31 July</strong> for complimentary Elite for one year.',
    }),
    theme: 'c6+dark',
    themeName: 'Gradient Grove + Dark Route Y',
  };
}

export function buildWaitlistResendVariables(v = {}) {
  const ctx = normalizeCtx(v);
  const ctaHref = ctx.referralUrl || BASE.siteUrl;
  return {
    COUNT_LABEL: ctx.countLabel,
    GREETING: ctx.firstName,
    HERO_SUBLINE: `${ctx.firstName}, thanks for showing up before the crowd. Your future self will point at today.`,
    OSID_HTML: ctx.osId ? osIdBlock(ctx.osId) : '',
    REFERRAL_HTML: ctx.referralUrl ? referralBlock(ctx.referralUrl) : '',
    CTA_URL: ctaHref,
    CTA_LABEL: ctx.referralUrl ? 'Invite someone who gets it →' : 'Visit AIIMIN →',
    MEMBER_NUM: ctx.memberNumber != null ? String(ctx.memberNumber) : '',
  };
}

export function renderWaitlistConfirmation(v = {}) {
  const ctx = normalizeCtx(v);
  return { ...renderV8(ctx), variant: 'v8' };
}
