/**
 * Waitlist confirmation email variants — A/B testing gallery.
 * Set WAITLIST_EMAIL_VARIANT=v1..v8 in env, or pass variant in template vars.
 *
 * Brand locks: Familjen Grotesk · Figtree · JetBrains Mono
 * Palette: ink #0A0A0C · ivory #EDE4D3 · forest #1E5C3A · parchment #F0EDE8
 */

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const BRAND = {
  base: '#F0EDE8',
  surface: '#FAFAF9',
  elevated: '#EDE8DF',
  border: '#E2DDD7',
  ink: '#0A0A0C',
  ivory: '#EDE4D3',
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

const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600;700&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap';
const FONT_DISPLAY = "'Familjen Grotesk', Georgia, 'Times New Roman', serif";
const FONT_BODY = "'Figtree', system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', Courier, monospace";

const CONCRETE_PERK = 'Complimentary <strong>Core tier</strong> at launch, <strong>Life Score + XP ranks</strong> from day one, and founding Pro at <strong>₹49/mo</strong> — public users never get this bundle.';

function normalizeCtx(v = {}) {
  const firstName = v.name ? escapeHtml(String(v.name).split(' ')[0]) : 'friend';
  const osId = v.reserved_username ? escapeHtml(v.reserved_username) : null;
  const referralCode = v.referral_code ? escapeHtml(v.referral_code) : null;
  const referralUrl = referralCode ? `https://www.aiimin.in/?ref=${referralCode}` : null;
  const memberNumber = v.member_number != null ? Number(v.member_number) : null;
  const totalCount = v.total_count != null ? Number(v.total_count) : null;
  const countLabel = memberNumber
    ? `Founding member #${memberNumber}${totalCount ? ` of ${totalCount}` : ''}`
    : 'Founding member';

  return { firstName, osId, referralCode, referralUrl, memberNumber, totalCount, countLabel };
}

function emailShell({ preheader, title, bodyHtml, ctaHref, ctaLabel, footerNote, darkCard = false }) {
  const pre = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;color:transparent;font-size:1px;line-height:1px;">${escapeHtml(preheader)}</div>`
    : '';
  const cardBg = darkCard ? BRAND.ink : BRAND.surface;
  const cardColor = darkCard ? BRAND.ivory : BRAND.text1;
  const cardBorder = darkCard ? BRAND.ink : BRAND.border;

  const cta = ctaHref
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0;">
        <tr><td bgcolor="${BRAND.accent}" style="border-radius:10px;background-color:${BRAND.accent};">
          <a href="${ctaHref}" style="display:inline-block;padding:14px 32px;font-family:${FONT_BODY};font-size:14px;font-weight:600;color:${BRAND.white};text-decoration:none;border-radius:10px;">${escapeHtml(ctaLabel || 'Continue')}</a>
        </td></tr>
      </table>`
    : '';

  const footer = footerNote
    ? `<p style="margin:16px 0 0;font-family:${FONT_BODY};font-size:13px;line-height:1.6;color:${darkCard ? 'rgba(237,228,211,0.65)' : BRAND.text3};">${footerNote}</p>`
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
<body style="margin:0;padding:0;background:${BRAND.base};font-family:${FONT_BODY};color:${BRAND.text1};">
${pre}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.base};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
<tr><td style="padding:0 0 20px;text-align:center;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
    <td style="padding-right:12px;vertical-align:middle;"><img src="${BRAND.logoUrl}" width="44" height="44" alt="AIIMIN" style="display:block;border:0;border-radius:12px;"></td>
    <td style="vertical-align:middle;text-align:left;">
      <span style="font-family:${FONT_DISPLAY};font-size:22px;font-weight:700;letter-spacing:-0.04em;color:${BRAND.text1};">AIIMIN</span>
      <div style="font-family:${FONT_BODY};font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.text3};margin-top:2px;">Personal Operating System</div>
    </td>
  </tr></table>
</td></tr>
<tr><td bgcolor="${cardBg}" style="background-color:${cardBg};border:1px solid ${cardBorder};border-radius:16px;padding:32px 28px;box-shadow:0 12px 40px rgba(10,10,12,0.08);">
  <h1 style="margin:0 0 20px;font-family:${FONT_DISPLAY};font-size:28px;font-weight:600;line-height:1.2;color:${cardColor};">${title}</h1>
  ${bodyHtml}
  ${cta}
  ${footer}
</td></tr>
<tr><td style="padding:24px 8px 0;text-align:center;font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:${BRAND.text3};">
  Built in India · <a href="${BRAND.siteUrl}" style="color:${BRAND.accent};text-decoration:none;">aiimin.in</a><br>
  You're receiving this because you joined the AIIMIN waitlist.
</td></tr>
</table></td></tr></table>
</body></html>`;
}

/** Quiet confirmation — system handle on near-black */
function osIdQuiet(osId) {
  if (!osId) return '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 24px;">
    <tr><td bgcolor="${BRAND.ink}" style="background-color:${BRAND.ink};border-radius:10px;padding:14px 18px;text-align:center;">
      <div style="font-family:${FONT_BODY};font-size:9px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:rgba(237,228,211,0.55);margin-bottom:8px;">system identity</div>
      <div style="font-family:${FONT_MONO};font-size:22px;font-weight:600;color:${BRAND.ivory};letter-spacing:0.14em;line-height:1;">@${osId}</div>
    </td></tr>
  </table>`;
}

function countBadge(countLabel, style = 'pill') {
  if (style === 'giant') {
    return `<div style="font-family:${FONT_MONO};font-size:42px;font-weight:600;color:${BRAND.ink};letter-spacing:-0.02em;line-height:1;margin:0 0 8px;">#${escapeHtml(String(countLabel).replace(/^Founding member #/, ''))}</div>`;
  }
  if (style === 'mono') {
    return `<div style="font-family:${FONT_MONO};font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.text3};margin:0 0 16px;">${escapeHtml(countLabel)}</div>`;
  }
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;"><tr>
    <td bgcolor="${BRAND.ink}" style="background-color:${BRAND.ink};border-radius:999px;padding:8px 16px;font-family:${FONT_MONO};font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.ivory};">${escapeHtml(countLabel)}</td>
  </tr></table>`;
}

function heroInk({ countLabel, headline, subline }) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;border-radius:12px;overflow:hidden;">
    <tr><td bgcolor="${BRAND.ink}" style="background-color:${BRAND.ink};padding:22px 24px;">
      <div style="font-family:${FONT_MONO};font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:rgba(237,228,211,0.6);margin-bottom:10px;">${escapeHtml(countLabel)}</div>
      <div style="font-family:${FONT_DISPLAY};font-size:24px;font-weight:600;line-height:1.25;color:${BRAND.ivory};margin-bottom:${subline ? '8px' : '0'};">${headline}</div>
      ${subline ? `<div style="font-family:${FONT_BODY};font-size:13px;line-height:1.55;color:rgba(237,228,211,0.75);">${subline}</div>` : ''}
    </td></tr>
  </table>`;
}

function perkConcrete() {
  return `<p style="font-family:${FONT_BODY};font-size:14px;line-height:1.65;color:${BRAND.text2};margin:0 0 20px;padding:14px 16px;background:${BRAND.elevated};border-radius:10px;border-left:3px solid ${BRAND.accent};">${CONCRETE_PERK}</p>`;
}

function referralBlock(referralUrl, tone = 'action') {
  if (!referralUrl) return '';
  if (tone === 'minimal') {
    return `<p style="font-family:${FONT_BODY};font-size:13px;line-height:1.6;color:${BRAND.text3};margin:24px 0 0;">Share: <a href="${referralUrl}" style="font-family:${FONT_MONO};font-size:12px;color:${BRAND.accent};text-decoration:none;">${referralUrl}</a></p>`;
  }
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;">
    <tr><td style="padding:0 0 10px;font-family:${FONT_BODY};font-size:14px;font-weight:600;color:${BRAND.text1};">Bring one person who'd get it</td></tr>
    <tr><td style="font-family:${FONT_BODY};font-size:13px;line-height:1.55;color:${BRAND.text2};padding-bottom:12px;">Early Superhuman users grew by sharing with one friend. Your founding link:</td></tr>
    <tr><td><a href="${referralUrl}" style="display:block;padding:11px 14px;background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:8px;font-family:${FONT_MONO};font-size:11px;color:${BRAND.text2};text-decoration:none;word-break:break-all;text-align:center;">${referralUrl}</a></td></tr>
  </table>`;
}

function founderNote() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;border-top:1px solid ${BRAND.border};padding-top:20px;">
    <tr><td style="font-family:${FONT_BODY};font-size:13px;font-weight:600;color:${BRAND.text1};padding-bottom:6px;">— Aaditya, founder</td></tr>
    <tr><td style="font-family:${FONT_BODY};font-size:14px;line-height:1.7;color:${BRAND.text2};">One screen. One honest read on your day. Reply anytime — it reaches me directly.</td></tr>
  </table>`;
}

function timelineBlock() {
  const step = (n, t, d, on) => `<tr>
    <td style="padding:0 0 14px;width:28px;vertical-align:top;font-family:${FONT_MONO};font-size:11px;color:${on ? BRAND.accent : BRAND.text3};">${n}</td>
    <td style="padding:0 0 14px 8px;vertical-align:top;">
      <div style="font-family:${FONT_BODY};font-size:13px;font-weight:600;color:${on ? BRAND.text1 : BRAND.text2};">${t}</div>
      <div style="font-family:${FONT_BODY};font-size:12px;line-height:1.5;color:${BRAND.text3};margin-top:2px;">${d}</div>
    </td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;">
    <tr><td colspan="2" style="font-family:${FONT_BODY};font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.text3};padding-bottom:12px;">What happens next</td></tr>
    ${step('01', 'Locked in', CONCRETE_PERK.replace(/<[^>]+>/g, ''), true)}
    ${step('02', '31 July', 'Tester keys for invited cohort — Elite free 1 year if you activate.')}
    ${step('03', 'September', 'Public launch. You get access before the feed sees it.')}
  </table>`;
}

/** ─── Variants ─── */

const variants = {
  v1: {
    id: 'v1',
    name: 'Noir System',
    tagline: 'Critique rec: ink hero, mono OS-ID, green CTA only',
    render(ctx) {
      const { firstName, osId, referralUrl, countLabel } = ctx;
      return {
        subject: `${firstName} — ${countLabel}`,
        html: emailShell({
          preheader: 'Core tier free at launch · Life Score from day one · founding Pro ₹49/mo',
          title: "You're on the inside.",
          bodyHtml: `
            ${heroInk({ countLabel, headline: `${firstName}, you're in.`, subline: 'Before public launch. Before the feed.' })}
            ${perkConcrete()}
            ${osIdQuiet(osId)}
            ${timelineBlock()}
            ${referralBlock(referralUrl)}
            ${founderNote()}`,
          ctaHref: referralUrl || BRAND.siteUrl,
          ctaLabel: referralUrl ? 'Share your founding link →' : 'Explore AIIMIN →',
        }),
      };
    },
  },

  v2: {
    id: 'v2',
    name: 'Linear Minimal',
    tagline: 'White space, thin rules, one accent line',
    render(ctx) {
      const { firstName, osId, referralUrl, countLabel } = ctx;
      return {
        subject: `Founding access · ${countLabel}`,
        html: emailShell({
          preheader: 'Complimentary Core + Life Score engine ships to your cohort first.',
          title: `${firstName}.`,
          bodyHtml: `
            ${countBadge(countLabel, 'mono')}
            <p style="font-family:${FONT_BODY};font-size:15px;line-height:1.7;color:${BRAND.text2};margin:0 0 6px;">You joined before public launch.</p>
            <p style="font-family:${FONT_BODY};font-size:14px;line-height:1.65;color:${BRAND.text2};margin:0 0 20px;border-bottom:1px solid ${BRAND.border};padding-bottom:20px;">${CONCRETE_PERK}</p>
            ${osId ? `<p style="margin:0 0 20px;font-family:${FONT_MONO};font-size:13px;color:${BRAND.text3};letter-spacing:0.08em;">@${osId} <span style="font-family:${FONT_BODY};color:${BRAND.text3};">· locked</span></p>` : ''}
            ${referralBlock(referralUrl, 'minimal')}
            ${founderNote()}`,
          ctaHref: referralUrl || BRAND.siteUrl,
          ctaLabel: 'Share founding link →',
        }),
      };
    },
  },

  v3: {
    id: 'v3',
    name: 'Cron Timeline',
    tagline: 'Process-forward, count in badge, timeline dominant',
    render(ctx) {
      const { firstName, osId, referralUrl, countLabel } = ctx;
      return {
        subject: `${countLabel} — AIIMIN founding cohort`,
        html: emailShell({
          preheader: 'Three steps between you and launch. Step 1 is done.',
          title: 'Access confirmed.',
          bodyHtml: `
            ${countBadge(countLabel)}
            <p style="font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.text2};margin:0 0 18px;">${firstName}, your cohort gets <strong>Core free</strong> and <strong>Life Score</strong> before anyone on the public waitlist.</p>
            ${timelineBlock()}
            ${osIdQuiet(osId)}
            ${referralBlock(referralUrl)}
            ${founderNote()}`,
          ctaHref: referralUrl || BRAND.siteUrl,
          ctaLabel: 'Invite one friend →',
        }),
      };
    },
  },

  v4: {
    id: 'v4',
    name: 'Superhuman Exclusivity',
    tagline: 'Concrete perk first, referral as hero CTA',
    render(ctx) {
      const { firstName, osId, referralUrl, countLabel, memberNumber } = ctx;
      return {
        subject: memberNumber ? `You're #${memberNumber} on the AIIMIN founding list` : `${firstName} — you're in`,
        html: emailShell({
          preheader: 'Core tier complimentary at launch. Founding Pro locked at ₹49/mo.',
          title: 'Founding access unlocked.',
          bodyHtml: `
            ${perkConcrete()}
            ${countBadge(countLabel)}
            <p style="font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.text1};margin:0 0 18px;font-weight:500;">${firstName} — you're not on a generic waitlist. You're in the cohort that shapes the product.</p>
            ${osIdQuiet(osId)}
            <p style="font-family:${FONT_BODY};font-size:13px;line-height:1.6;color:${BRAND.text2};margin:20px 0 0;">Superhuman grew by invites. Share with one person who'd actually log their day.</p>
            ${founderNote()}`,
          ctaHref: referralUrl || BRAND.siteUrl,
          ctaLabel: referralUrl ? 'Send your invite link →' : 'Open AIIMIN →',
        }),
      };
    },
  },

  v5: {
    id: 'v5',
    name: 'Arc Contrast',
    tagline: 'Display type hero, parchment + ink OS-ID only',
    render(ctx) {
      const { firstName, osId, referralUrl, countLabel } = ctx;
      return {
        subject: `${firstName} — welcome to the founding cohort`,
        html: emailShell({
          preheader: countLabel,
          title: 'The honest daily loop.',
          bodyHtml: `
            <p style="font-family:${FONT_DISPLAY};font-size:20px;line-height:1.35;color:${BRAND.text1};margin:0 0 16px;font-weight:600;">${firstName}, you got in early.</p>
            ${countBadge(countLabel, 'mono')}
            <p style="font-family:${FONT_BODY};font-size:14px;line-height:1.7;color:${BRAND.text2};margin:0 0 20px;">${CONCRETE_PERK}</p>
            ${osIdQuiet(osId)}
            ${timelineBlock()}
            ${referralBlock(referralUrl, 'minimal')}
            ${founderNote()}`,
          ctaHref: referralUrl || BRAND.siteUrl,
          ctaLabel: 'Share →',
        }),
      };
    },
  },

  v6: {
    id: 'v6',
    name: 'On Deck Cohort',
    tagline: 'Community cohort framing, numbered membership',
    render(ctx) {
      const { firstName, osId, referralUrl, countLabel, memberNumber } = ctx;
      return {
        subject: memberNumber ? `Cohort member #${memberNumber} — AIIMIN` : `${firstName} — AIIMIN cohort`,
        html: emailShell({
          preheader: 'Your cohort: Core free · Life Score · founding pricing locked.',
          title: `Welcome, cohort member.`,
          bodyHtml: `
            ${heroInk({ countLabel, headline: `Hey ${firstName}.`, subline: 'You\'re building the first wave with us.' })}
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;">
              <tr><td style="padding:10px 0;border-bottom:1px solid ${BRAND.border};font-family:${FONT_BODY};font-size:13px;color:${BRAND.text2};"><strong style="color:${BRAND.text1};">Core tier</strong> — complimentary at launch</td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid ${BRAND.border};font-family:${FONT_BODY};font-size:13px;color:${BRAND.text2};"><strong style="color:${BRAND.text1};">Life Score</strong> — daily ring + XP from day one</td></tr>
              <tr><td style="padding:10px 0;font-family:${FONT_BODY};font-size:13px;color:${BRAND.text2};"><strong style="color:${BRAND.text1};">Founding Pro</strong> — ₹49/mo locked (public: ₹59)</td></tr>
            </table>
            ${osIdQuiet(osId)}
            ${referralBlock(referralUrl)}
            ${founderNote()}`,
          ctaHref: referralUrl || BRAND.siteUrl,
          ctaLabel: 'Grow your cohort →',
        }),
      };
    },
  },

  v7: {
    id: 'v7',
    name: 'Robinhood Number',
    tagline: 'Giant member number as hero moment',
    render(ctx) {
      const { firstName, osId, referralUrl, memberNumber, countLabel } = ctx;
      const num = memberNumber || '—';
      return {
        subject: `You're #${num} · AIIMIN founding list`,
        html: emailShell({
          preheader: 'Core free at launch. Life Score + founding Pro ₹49/mo.',
          title: "You're in.",
          bodyHtml: `
            <div style="font-family:${FONT_MONO};font-size:42px;font-weight:600;color:${BRAND.ink};letter-spacing:-0.02em;line-height:1;margin:0 0 8px;">#${num}</div>
            <p style="font-family:${FONT_BODY};font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.text3};margin:0 0 20px;">${escapeHtml(countLabel)}</p>
            <p style="font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.text2};margin:0 0 18px;">${firstName} — ${CONCRETE_PERK.replace(/<[^>]+>/g, '')}</p>
            ${osIdQuiet(osId)}
            ${founderNote()}`,
          ctaHref: referralUrl || BRAND.siteUrl,
          ctaLabel: referralUrl ? 'Share your link →' : 'Visit AIIMIN →',
        }),
      };
    },
  },

  v8: {
    id: 'v8',
    name: 'Hybrid Recommended',
    tagline: 'Ink + ivory + mono OS-ID + count + concrete perk + green CTA only',
    render(ctx) {
      const { firstName, osId, referralUrl, countLabel, memberNumber } = ctx;
      return {
        subject: memberNumber
          ? `#${memberNumber} — ${firstName}, your AIIMIN founding spot is locked`
          : `${firstName} — your AIIMIN founding spot is locked`,
        html: emailShell({
          preheader: 'Core tier free · Life Score from day one · founding Pro ₹49/mo — cohort only.',
          title: 'Welcome to the inside.',
          bodyHtml: `
            ${heroInk({ countLabel, headline: `${firstName}, you're in.`, subline: null })}
            ${perkConcrete()}
            ${osIdQuiet(osId)}
            ${timelineBlock()}
            ${referralBlock(referralUrl)}
            ${founderNote()}`,
          ctaHref: referralUrl || BRAND.siteUrl,
          ctaLabel: referralUrl ? 'Share your founding link →' : 'Explore AIIMIN →',
          footerNote: 'Tester invite? Register by <strong>31 July</strong> for complimentary Elite for one year.',
        }),
      };
    },
  },
};

export const WAITLIST_VARIANT_IDS = Object.keys(variants);
export const WAITLIST_VARIANTS = variants;

export function getWaitlistVariantMeta() {
  return WAITLIST_VARIANT_IDS.map((id) => ({
    id,
    name: variants[id].name,
    tagline: variants[id].tagline,
  }));
}

export function renderWaitlistConfirmation(v = {}) {
  const variantId = String(v.variant || process.env.WAITLIST_EMAIL_VARIANT || 'v8').toLowerCase();
  const key = variants[variantId] ? variantId : 'v8';
  const ctx = normalizeCtx(v);
  const result = variants[key].render(ctx);
  return { ...result, variant: key, variantName: variants[key].name };
}

export function renderAllWaitlistVariants(sampleVars = {}) {
  const defaults = {
    name: 'Aaditya',
    reserved_username: 'AU10',
    referral_code: 'FOUND01',
    member_number: 142,
    total_count: 500,
    ...sampleVars,
  };
  return WAITLIST_VARIANT_IDS.map((id) => ({
    ...getWaitlistVariantMeta().find((m) => m.id === id),
    ...renderWaitlistConfirmation({ ...defaults, variant: id }),
  }));
}
