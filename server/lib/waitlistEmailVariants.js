/**
 * AIIMIN waitlist confirmation email — v8 / theme c6 (Gradient Grove) — production final.
 * Env: WAITLIST_MEMBER_OFFSET=122 · WAITLIST_DISPLAY_CAP=300 · RESEND_WAITLIST_TEMPLATE_ID
 */

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
  logoUrl: 'https://aiimin.in/AIIMIN_logo.svg',
  siteUrl: 'https://www.aiimin.in',
};

/** Production theme — Gradient Grove (matches waitlist landing tint) */
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
  perkBorder: '#1E5C3A',
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

function emailShell({ preheader, title, bodyHtml, ctaHref, ctaLabel, footerNote }) {
  const pre = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;color:transparent;font-size:1px;line-height:1px;">${escapeHtml(preheader)}</div>`
    : '';

  const cta = ctaHref
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0;">
        <tr><td bgcolor="${THEME.ctaBg}" style="border-radius:10px;background-color:${THEME.ctaBg};">
          <a href="${ctaHref}" style="display:inline-block;padding:14px 32px;font-family:${FONT_BODY};font-size:14px;font-weight:600;color:${BASE.white};text-decoration:none;border-radius:10px;">${escapeHtml(ctaLabel || 'Continue')}</a>
        </td></tr>
      </table>`
    : '';

  const footer = footerNote
    ? `<p style="margin:16px 0 0;font-family:${FONT_BODY};font-size:13px;line-height:1.6;color:${BASE.text3};">${footerNote}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(title)}</title>
  <link href="${FONT_LINK}" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${BASE.base};font-family:${FONT_BODY};color:${BASE.text1};">
${pre}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BASE.base};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
<tr><td style="padding:0 0 20px;text-align:center;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
    <td style="padding-right:12px;vertical-align:middle;"><img src="${BASE.logoUrl}" width="44" height="44" alt="AIIMIN" style="display:block;border:0;border-radius:12px;"></td>
    <td style="vertical-align:middle;text-align:left;">
      <span style="font-family:${FONT_DISPLAY};font-size:22px;font-weight:700;letter-spacing:-0.04em;color:${BASE.text1};">AIIMIN</span>
      <div style="font-family:${FONT_BODY};font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:${BASE.text3};margin-top:2px;">Personal OS</div>
    </td>
  </tr></table>
</td></tr>
<tr><td bgcolor="${BASE.surface}" style="background-color:${BASE.surface};border:1px solid ${BASE.border};border-radius:16px;padding:32px 28px;box-shadow:0 12px 40px rgba(30,92,58,0.06);">
  <h1 style="margin:0 0 20px;font-family:${FONT_DISPLAY};font-size:28px;font-weight:600;line-height:1.2;color:${BASE.text1};">${title}</h1>
  ${bodyHtml}
  ${cta}
  ${footer}
</td></tr>
<tr><td style="padding:24px 8px 0;text-align:center;font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:${BASE.text3};">
  Built in India · <a href="${BASE.siteUrl}" style="color:${BASE.accent};text-decoration:none;">aiimin.in</a><br>
  You're receiving this because you joined the AIIMIN waitlist.
</td></tr>
</table></td></tr></table>
</body></html>`;
}

function heroBand({ countLabel, headline, subline }) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;border-radius:12px;overflow:hidden;border:1px solid ${BASE.border};">
    <tr><td bgcolor="${BASE.base}" style="background:${THEME.heroBg};padding:22px 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px;"><tr>
        <td bgcolor="${THEME.badgeBg}" style="background-color:${THEME.badgeBg};border-radius:999px;padding:7px 14px;font-family:${FONT_MONO};font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${THEME.badgeText};">${escapeHtml(countLabel)}</td>
      </tr></table>
      <div style="font-family:${FONT_DISPLAY};font-size:22px;font-weight:600;line-height:1.3;color:${THEME.heroText};margin-bottom:${subline ? '8px' : '0'};">${headline}</div>
      ${subline ? `<div style="font-family:${FONT_BODY};font-size:14px;line-height:1.6;color:${THEME.heroSub};">${subline}</div>` : ''}
    </td></tr>
  </table>`;
}

function osIdBlock(osId) {
  if (!osId) return '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 22px;">
    <tr><td bgcolor="${THEME.osIdBg}" style="background-color:${THEME.osIdBg};border:1px solid ${THEME.osIdBorder};border-radius:10px;padding:14px 18px;text-align:center;">
      <div style="font-family:${FONT_BODY};font-size:9px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${THEME.osIdLabel};margin-bottom:8px;">your identity on AIIMIN</div>
      <div style="font-family:${FONT_MONO};font-size:20px;font-weight:600;color:${THEME.osIdText};letter-spacing:0.12em;line-height:1;">@${osId}</div>
      <div style="font-family:${FONT_BODY};font-size:12px;line-height:1.5;color:${BASE.text3};margin-top:8px;">Locked to this email · ships at launch</div>
    </td></tr>
  </table>`;
}

function perksBlock() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;border:1px solid ${BASE.border};border-radius:12px;overflow:hidden;">
    <tr><td style="padding:14px 16px;font-family:${FONT_BODY};font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${BASE.text3};background:${BASE.elevated};">What you locked in</td></tr>
    <tr><td style="padding:14px 16px;border-top:1px solid ${BASE.border};font-family:${FONT_BODY};font-size:14px;line-height:1.65;color:${BASE.text2};">
      <strong style="color:${BASE.text1};">Core tier</strong> — complimentary at launch<br>
      <strong style="color:${BASE.text1};">Life Score + XP</strong> — your days start keeping score<br>
      <strong style="color:${BASE.text1};">Founding Pro</strong> — ₹49/mo locked (public pays ₹59)
    </td></tr>
  </table>`;
}

function timelineBlock() {
  const step = (n, t, d) => `<tr>
    <td style="padding:0 0 12px;width:28px;vertical-align:top;font-family:${FONT_MONO};font-size:11px;color:${BASE.accent};">${n}</td>
    <td style="padding:0 0 12px 8px;vertical-align:top;">
      <div style="font-family:${FONT_BODY};font-size:13px;font-weight:600;color:${BASE.text1};">${t}</div>
      <div style="font-family:${FONT_BODY};font-size:12px;line-height:1.5;color:${BASE.text3};margin-top:2px;">${d}</div>
    </td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 0;">
    <tr><td colspan="2" style="font-family:${FONT_BODY};font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${BASE.text3};padding-bottom:12px;">What happens next</td></tr>
    ${step('01', 'You\'re in the first 300', 'Founding pricing and Core access — locked to this email.')}
    ${step('02', '31 July', 'Tester keys go out. Activate before then for complimentary Elite, one year.')}
    ${step('03', 'September', 'Launch. You hear from us before anyone on the public feed.')}
  </table>`;
}

function referralBlock(referralUrl) {
  if (!referralUrl) return '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;padding-top:20px;border-top:1px solid ${BASE.border};">
    <tr><td style="font-family:${FONT_BODY};font-size:15px;font-weight:600;color:${BASE.text1};padding-bottom:8px;">Help shape what we build</td></tr>
    <tr><td style="font-family:${FONT_BODY};font-size:14px;line-height:1.65;color:${BASE.text2};padding-bottom:14px;">Founding members can invite people who'll actually use a Personal OS — not to inflate a list, but to find the right co-builders.</td></tr>
    <tr><td><a href="${referralUrl}" style="display:block;padding:11px 14px;background:${BASE.surface};border:1px solid ${BASE.border};border-radius:8px;font-family:${FONT_MONO};font-size:11px;color:${BASE.text2};text-decoration:none;word-break:break-all;text-align:center;">${referralUrl}</a></td></tr>
  </table>`;
}

function founderClosing() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;border-top:1px solid ${BASE.border};padding-top:22px;">
    <tr><td style="font-family:${FONT_BODY};font-size:14px;line-height:1.75;color:${BASE.text2};">
      Thanks for believing in AIIMIN this early. You're among the first people shaping what it becomes, and that means more than you might think. If you have an idea, a question, or feedback, just reply to this email — I read every message.
    </td></tr>
    <tr><td style="font-family:${FONT_BODY};font-size:13px;font-weight:600;color:${BASE.text1};padding-top:14px;">— Aaditya</td></tr>
  </table>`;
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
        <p style="font-family:${FONT_BODY};font-size:15px;line-height:1.7;color:${BASE.text2};margin:0 0 18px;">
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
    theme: 'c6',
    themeName: 'Gradient Grove',
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
