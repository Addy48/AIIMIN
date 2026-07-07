/**
 * AIIMIN waitlist confirmation email — v8 final.
 * Color themes: c1–c6 (preview via scripts/preview-waitlist-emails.mjs)
 * Env: WAITLIST_EMAIL_THEME=c1 · WAITLIST_MEMBER_OFFSET=122 · WAITLIST_DISPLAY_CAP=500
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
  logoBg: '#23503B',
  white: '#FFFFFF',
  logoUrl: 'https://aiimin.in/AIIMIN_logo.svg',
  siteUrl: 'https://www.aiimin.in',
};

/** Website-native color combos for v8 */
export const COLOR_THEMES = {
  c1: {
    id: 'c1',
    name: 'Forest Classic',
    tagline: 'Site default — deep green hero, parchment base',
    heroBg: '#164530',
    heroText: '#FFFFFF',
    heroSub: 'rgba(255,255,255,0.78)',
    badgeBg: '#1E5C3A',
    badgeText: '#FFFFFF',
    osIdBg: '#E8F0EB',
    osIdBorder: '#C5D9CC',
    osIdLabel: '#9A9186',
    osIdText: '#164530',
    perkBorder: '#1E5C3A',
    ctaBg: '#1E5C3A',
  },
  c2: {
    id: 'c2',
    name: 'Mint Wash',
    tagline: 'Light green hero — soft, airy, native to Nordic UI',
    heroBg: '#E8F0EB',
    heroText: '#164530',
    heroSub: '#4A5340',
    badgeBg: '#164530',
    badgeText: '#FFFFFF',
    osIdBg: '#FAFAF9',
    osIdBorder: '#C5D9CC',
    osIdLabel: '#9A9186',
    osIdText: '#1E5C3A',
    perkBorder: '#1E5C3A',
    ctaBg: '#1E5C3A',
  },
  c3: {
    id: 'c3',
    name: 'Parchment Edge',
    tagline: 'White card + green left stripe — Linear-clean',
    heroBg: '#FAFAF9',
    heroText: '#1A1A1A',
    heroSub: '#4A5340',
    badgeBg: '#E8F0EB',
    badgeText: '#164530',
    osIdBg: '#F0EDE8',
    osIdBorder: '#E2DDD7',
    osIdLabel: '#9A9186',
    osIdText: '#1E5C3A',
    perkBorder: '#1E5C3A',
    ctaBg: '#164530',
    heroBorder: '4px solid #1E5C3A',
  },
  c4: {
    id: 'c4',
    name: 'Grove Logo',
    tagline: 'Logo green #23503B — matches AIIMIN mark',
    heroBg: '#23503B',
    heroText: '#FFFFFF',
    heroSub: 'rgba(255,255,255,0.75)',
    badgeBg: '#1E5C3A',
    badgeText: '#FFFFFF',
    osIdBg: '#E8F0EB',
    osIdBorder: '#1E5C3A',
    osIdLabel: '#4A5340',
    osIdText: '#164530',
    perkBorder: '#23503B',
    ctaBg: '#23503B',
  },
  c5: {
    id: 'c5',
    name: 'Elevated Nordic',
    tagline: 'Warm elevated #EDE8DF hero — waitlist card feel',
    heroBg: '#EDE8DF',
    heroText: '#1A1A1A',
    heroSub: '#4A5340',
    badgeBg: '#1E5C3A',
    badgeText: '#FFFFFF',
    osIdBg: '#FAFAF9',
    osIdBorder: '#E2DDD7',
    osIdLabel: '#9A9186',
    osIdText: '#1E5C3A',
    perkBorder: '#1E5C3A',
    ctaBg: '#1E5C3A',
  },
  c6: {
    id: 'c6',
    name: 'Gradient Grove',
    tagline: 'Parchment → mint gradient hero — landing page tint',
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
    heroUseGradient: true,
  },
};

const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600;700&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap';
const FONT_DISPLAY = "'Familjen Grotesk', Georgia, 'Times New Roman', serif";
const FONT_BODY = "'Figtree', system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', Courier, monospace";

const CONCRETE_PERK = 'Complimentary <strong>Core tier</strong> at launch, <strong>Life Score + XP ranks</strong> from day one, and founding Pro at <strong>₹49/mo</strong> — public users never get this bundle.';

export const MEMBER_OFFSET = Number(process.env.WAITLIST_MEMBER_OFFSET || 122);
export const DISPLAY_CAP = Number(process.env.WAITLIST_DISPLAY_CAP || 500);

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

function resolveTheme(v) {
  const id = String(v.color_theme || process.env.WAITLIST_EMAIL_THEME || 'c1').toLowerCase();
  return COLOR_THEMES[id] || COLOR_THEMES.c1;
}

function emailShell(theme, { preheader, title, bodyHtml, ctaHref, ctaLabel, footerNote }) {
  const pre = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;color:transparent;font-size:1px;line-height:1px;">${escapeHtml(preheader)}</div>`
    : '';

  const cta = ctaHref
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0;">
        <tr><td bgcolor="${theme.ctaBg}" style="border-radius:10px;background-color:${theme.ctaBg};">
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

function heroBand(theme, { countLabel, headline, subline }) {
  const bgStyle = theme.heroUseGradient
    ? `background:${theme.heroBg};`
    : `background-color:${theme.heroBg};`;
  const border = theme.heroBorder ? `border-left:${theme.heroBorder};` : '';
  const bgcolor = theme.heroUseGradient ? BASE.base : theme.heroBg;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;border-radius:12px;overflow:hidden;border:1px solid ${BASE.border};${border}">
    <tr><td bgcolor="${bgcolor}" style="${bgStyle}padding:22px 24px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px;"><tr>
        <td bgcolor="${theme.badgeBg}" style="background-color:${theme.badgeBg};border-radius:999px;padding:7px 14px;font-family:${FONT_MONO};font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${theme.badgeText};">${escapeHtml(countLabel)}</td>
      </tr></table>
      <div style="font-family:${FONT_DISPLAY};font-size:24px;font-weight:600;line-height:1.25;color:${theme.heroText};margin-bottom:${subline ? '8px' : '0'};">${headline}</div>
      ${subline ? `<div style="font-family:${FONT_BODY};font-size:14px;line-height:1.55;color:${theme.heroSub};">${subline}</div>` : ''}
    </td></tr>
  </table>`;
}

function osIdBlock(theme, osId) {
  if (!osId) return '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 24px;">
    <tr><td bgcolor="${theme.osIdBg}" style="background-color:${theme.osIdBg};border:1px solid ${theme.osIdBorder};border-radius:10px;padding:14px 18px;text-align:center;">
      <div style="font-family:${FONT_BODY};font-size:9px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${theme.osIdLabel};margin-bottom:8px;">your AIIMIN identity</div>
      <div style="font-family:${FONT_MONO};font-size:20px;font-weight:600;color:${theme.osIdText};letter-spacing:0.12em;line-height:1;">@${osId}</div>
    </td></tr>
  </table>`;
}

function perkConcrete(theme) {
  return `<p style="font-family:${FONT_BODY};font-size:14px;line-height:1.65;color:${BASE.text2};margin:0 0 20px;padding:14px 16px;background:${BASE.elevated};border-radius:10px;border-left:3px solid ${theme.perkBorder};">${CONCRETE_PERK}</p>`;
}

function timelineBlock() {
  const step = (n, t, d, on) => `<tr>
    <td style="padding:0 0 14px;width:28px;vertical-align:top;font-family:${FONT_MONO};font-size:11px;color:${on ? BASE.accent : BASE.text3};">${n}</td>
    <td style="padding:0 0 14px 8px;vertical-align:top;">
      <div style="font-family:${FONT_BODY};font-size:13px;font-weight:600;color:${on ? BASE.text1 : BASE.text2};">${t}</div>
      <div style="font-family:${FONT_BODY};font-size:12px;line-height:1.5;color:${BASE.text3};margin-top:2px;">${d}</div>
    </td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;">
    <tr><td colspan="2" style="font-family:${FONT_BODY};font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${BASE.text3};padding-bottom:12px;">What happens next</td></tr>
    ${step('01', 'Locked in', 'Core tier + Life Score ship to your cohort before public launch.', true)}
    ${step('02', '31 July', 'Tester keys for invited cohort — Elite free 1 year if you activate.')}
    ${step('03', 'September', 'Public launch. You get access before the feed sees it.')}
  </table>`;
}

function referralBlock(referralUrl) {
  if (!referralUrl) return '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;">
    <tr><td style="padding:0 0 10px;font-family:${FONT_BODY};font-size:14px;font-weight:600;color:${BASE.text1};">Bring one person who'd get it</td></tr>
    <tr><td style="font-family:${FONT_BODY};font-size:13px;line-height:1.55;color:${BASE.text2};padding-bottom:12px;">Share your founding link — early Superhuman users grew one invite at a time.</td></tr>
    <tr><td><a href="${referralUrl}" style="display:block;padding:11px 14px;background:${BASE.surface};border:1px solid ${BASE.border};border-radius:8px;font-family:${FONT_MONO};font-size:11px;color:${BASE.text2};text-decoration:none;word-break:break-all;text-align:center;">${referralUrl}</a></td></tr>
  </table>`;
}

function founderNote() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;border-top:1px solid ${BASE.border};padding-top:20px;">
    <tr><td style="font-family:${FONT_BODY};font-size:13px;font-weight:600;color:${BASE.text1};padding-bottom:6px;">— Aaditya, founder</td></tr>
    <tr><td style="font-family:${FONT_BODY};font-size:14px;line-height:1.7;color:${BASE.text2};">One screen. One honest read on your day. Reply anytime — it reaches me directly.</td></tr>
  </table>`;
}

function renderV8(ctx, theme) {
  const { firstName, osId, referralUrl, countLabel, memberNumber } = ctx;
  return {
    subject: memberNumber
      ? `#${memberNumber} — ${firstName}, your AIIMIN founding spot is locked`
      : `${firstName} — your AIIMIN founding spot is locked`,
    html: emailShell(theme, {
      preheader: 'Core tier free · Life Score from day one · founding Pro ₹49/mo — first 500 only.',
      title: 'It starts here.',
      bodyHtml: `
        ${heroBand(theme, {
          countLabel,
          headline: 'It starts here.',
          subline: `${firstName}, your Personal OS journey begins before public launch.`,
        })}
        ${perkConcrete(theme)}
        ${osIdBlock(theme, osId)}
        ${timelineBlock()}
        ${referralBlock(referralUrl)}
        ${founderNote()}`,
      ctaHref: referralUrl || BASE.siteUrl,
      ctaLabel: referralUrl ? 'Share your founding link →' : 'Explore AIIMIN →',
      footerNote: 'Tester invite? Register by <strong>31 July</strong> for complimentary Elite for one year.',
    }),
    theme: theme.id,
    themeName: theme.name,
  };
}

export const COLOR_THEME_IDS = Object.keys(COLOR_THEMES);

export function getColorThemeMeta() {
  return COLOR_THEME_IDS.map((id) => ({
    id,
    name: COLOR_THEMES[id].name,
    tagline: COLOR_THEMES[id].tagline,
  }));
}

export function renderWaitlistConfirmation(v = {}) {
  const theme = resolveTheme(v);
  const ctx = normalizeCtx(v);
  const result = renderV8(ctx, theme);
  return { ...result, variant: 'v8' };
}

export function renderAllColorThemes(sampleVars = {}) {
  const defaults = {
    name: 'Aaditya',
    reserved_username: 'AU10',
    referral_code: 'FOUND01',
    member_number: 145,
    total_count: DISPLAY_CAP,
    ...sampleVars,
  };
  return COLOR_THEME_IDS.map((id) => {
    const theme = COLOR_THEMES[id];
    const rendered = renderWaitlistConfirmation({ ...defaults, color_theme: id });
    return {
      id,
      name: theme.name,
      tagline: theme.tagline,
      subject: rendered.subject,
      html: rendered.html,
    };
  });
}
