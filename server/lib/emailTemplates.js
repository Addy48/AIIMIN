/**
 * HTML email templates — Nordic waitlist brand (parchment + forest ink).
 * Fonts: Familjen Grotesk (display) + Figtree (body) with safe fallbacks.
 */
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const BRAND = {
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

const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600;700&family=Figtree:wght@400;500;600&display=swap';
const FONT_DISPLAY = "'Familjen Grotesk', Georgia, 'Times New Roman', serif";
const FONT_BODY = "'Figtree', system-ui, -apple-system, 'Segoe UI', sans-serif";

function formatSignedUpAt(iso) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso || '—';
  }
}

function waitlistLayout({
  preheader = '',
  eyebrow = '',
  title,
  bodyHtml,
  ctaHref,
  ctaLabel,
  footerNote,
}) {
  const preheaderBlock = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;opacity:0;color:transparent;font-size:1px;line-height:1px;">${escapeHtml(preheader)}</div>`
    : '';

  const eyebrowBlock = eyebrow
    ? `<p style="margin:0 0 8px;font-family:${FONT_BODY};font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.accent};">${escapeHtml(eyebrow)}</p>`
    : '';

  const ctaBlock = ctaHref
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0;">
        <tr>
          <td style="border-radius:10px;background:${BRAND.accent};">
            <a href="${ctaHref}" style="display:inline-block;padding:14px 28px;font-family:${FONT_BODY};font-size:14px;font-weight:600;color:${BRAND.white};text-decoration:none;border-radius:10px;">${escapeHtml(ctaLabel || 'Open AIIMIN')}</a>
          </td>
        </tr>
      </table>`
    : '';

  const footerExtra = footerNote
    ? `<p style="margin:16px 0 0;font-family:${FONT_BODY};font-size:13px;line-height:1.6;color:${BRAND.text3};">${footerNote}</p>`
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
${preheaderBlock}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.base};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
        <tr>
          <td style="padding:0 0 20px;text-align:center;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
              <tr>
                <td style="padding-right:12px;vertical-align:middle;">
                  <img src="${BRAND.logoUrl}" width="44" height="44" alt="AIIMIN" style="display:block;border:0;border-radius:12px;">
                </td>
                <td style="vertical-align:middle;text-align:left;">
                  <span style="font-family:${FONT_DISPLAY};font-size:22px;font-weight:700;letter-spacing:-0.04em;color:${BRAND.text1};">AIIMIN</span>
                  <div style="font-family:${FONT_BODY};font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.text3};margin-top:2px;">Personal Operating System</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:16px;padding:32px 28px;box-shadow:0 12px 40px rgba(26,26,26,0.06);">
            ${eyebrowBlock}
            <h1 style="margin:0 0 20px;font-family:${FONT_DISPLAY};font-size:28px;font-weight:600;line-height:1.2;color:${BRAND.text1};">${title}</h1>
            ${bodyHtml}
            ${ctaBlock}
            ${footerExtra}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 8px 0;text-align:center;font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:${BRAND.text3};">
            Built in India · <a href="${BRAND.siteUrl}" style="color:${BRAND.accent};text-decoration:none;">aiimin.in</a>
            <br>You're receiving this because you interacted with the AIIMIN waitlist.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function perkRow(label, detail, highlight = false) {
  const bg = highlight ? `background:${BRAND.accentSoft};border-radius:10px;` : '';
  return `<tr>
    <td style="padding:12px 10px;border-bottom:1px solid ${BRAND.border};vertical-align:top;${bg}">
      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${BRAND.accent};margin-right:10px;vertical-align:middle;"></span>
      <strong style="font-family:${FONT_BODY};font-size:14px;color:${BRAND.text1};">${escapeHtml(label)}</strong>
      <div style="margin:4px 0 0 18px;font-family:${FONT_BODY};font-size:13px;line-height:1.5;color:${BRAND.text2};">${detail}</div>
    </td>
  </tr>`;
}

function lifeScoreTeaser() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px;border:1px solid #C5D9CC;border-radius:14px;overflow:hidden;background:linear-gradient(180deg, ${BRAND.accentSoft} 0%, ${BRAND.surface} 100%);">
    <tr><td style="padding:16px 18px 10px;font-family:${FONT_BODY};font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.text3};">What you're unlocking</td></tr>
    <tr><td style="padding:0 18px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="33%" style="padding:8px;text-align:center;background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:10px;">
            <div style="font-family:${FONT_DISPLAY};font-size:22px;font-weight:700;color:${BRAND.accent};">82</div>
            <div style="font-size:10px;color:${BRAND.text3};text-transform:uppercase;letter-spacing:0.06em;">Life Score</div>
          </td>
          <td width="4"></td>
          <td width="33%" style="padding:8px;text-align:center;background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:10px;">
            <div style="font-family:${FONT_DISPLAY};font-size:22px;font-weight:700;color:${BRAND.accent};">1</div>
            <div style="font-size:10px;color:${BRAND.text3};text-transform:uppercase;letter-spacing:0.06em;">Screen</div>
          </td>
          <td width="4"></td>
          <td width="33%" style="padding:8px;text-align:center;background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:10px;">
            <div style="font-family:${FONT_DISPLAY};font-size:22px;font-weight:700;color:${BRAND.accent};">₹0</div>
            <div style="font-size:10px;color:${BRAND.text3};text-transform:uppercase;letter-spacing:0.06em;">To start</div>
          </td>
        </tr>
      </table>
      <p style="margin:12px 0 0;font-family:${FONT_BODY};font-size:13px;line-height:1.55;color:${BRAND.text2};">Habits, money, focus, mood, sleep — wired into one daily loop. Not five apps. One command layer.</p>
    </td></tr>
  </table>`;
}

function detailRow(label, value) {
  return `<tr>
    <td style="padding:10px 14px;border-bottom:1px solid ${BRAND.border};font-family:${FONT_BODY};font-size:13px;color:${BRAND.text3};width:38%;">${escapeHtml(label)}</td>
    <td style="padding:10px 14px;border-bottom:1px solid ${BRAND.border};font-family:${FONT_BODY};font-size:14px;font-weight:500;color:${BRAND.text1};">${value}</td>
  </tr>`;
}

function legacyLayout(title, bodyHtml, ctaHref, ctaLabel) {
  return waitlistLayout({ title, bodyHtml, ctaHref, ctaLabel });
}

export const EMAIL_TEMPLATES = {
  streak_recovery: (v) => ({
    subject: `Your ${v.streak_days || '—'}-day streak broke. That's okay.`,
    html: legacyLayout(
      'Streaks break. What matters is what you do next.',
      `<p style="font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.text2};margin:0 0 16px;">Your ${escapeHtml(String(v.streak_days))}-day streak ended yesterday. Most people restart within 48 hours — you're still in that window.</p>
       <p style="font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.text2};margin:0;">One tap. Day one again.</p>`,
      'https://aiimin.in/discipline',
      'Start again →',
    ),
  }),
  idle_day3: () => ({
    subject: 'Your habits are waiting.',
    html: legacyLayout(
      '3 days away.',
      `<p style="font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.text2};margin:0;">You logged in 3 days ago. Your streak data is still here — pick up where you left off.</p>`,
      'https://aiimin.in/habits',
      'Mark a habit →',
    ),
  }),
  idle_day7: () => ({
    subject: 'Your life OS is waiting.',
    html: legacyLayout(
      'A week without you.',
      `<p style="font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.text2};margin:0;">Your dashboard still has your goals, journal entries, and streak history. Nothing was deleted.</p>`,
      'https://aiimin.in/overview',
      'Open Overview →',
    ),
  }),
  idle_day14: () => ({
    subject: "Miss you. Here's what you've built.",
    html: legacyLayout(
      '14 days.',
      `<p style="font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.text2};margin:0;">You built something worth returning to. Your data is safe. Come back when you are ready.</p>`,
      'https://aiimin.in/overview',
      'See your stats →',
    ),
  }),
  weekly_digest: (v) => ({
    subject: 'Your week in numbers.',
    html: legacyLayout(
      'Weekly digest',
      `<p style="font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.text2};margin:0 0 16px;"><strong style="color:${BRAND.accent};">${escapeHtml(String(v.streak_days || 0))}-day</strong> discipline streak · <strong>${escapeHtml(String(v.focus_hours || 0))}h</strong> deep work · <strong>${escapeHtml(String(v.journal_entries || 0))}</strong> journal entries.</p>
       <p style="font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.text2};margin:0;">You tracked <strong>${escapeHtml(String(v.habit_count || 0))}</strong> habits and spent <strong>₹${escapeHtml(String(v.net_spend || 0))}</strong> this week.</p>`,
      'https://aiimin.in/overview',
      'Read digest →',
    ),
  }),
  document_expiry: (v) => ({
    subject: `${v.doc_type || 'Document'} expires in ${v.days_until || '—'} days.`,
    html: legacyLayout(
      'Document expiry reminder',
      `<p style="font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.text2};margin:0;">${escapeHtml(v.member_name)}'s <strong>${escapeHtml(v.doc_type)}</strong> expires on <strong>${escapeHtml(v.expiry_date)}</strong> (${escapeHtml(String(v.days_until))} days).</p>`,
      'https://aiimin.in/family',
      'Open Family Vault →',
    ),
  }),
  post_purchase: (v) => ({
    subject: `Welcome to ${v.tier_name || 'Core'}.`,
    html: legacyLayout(
      `Welcome to ${escapeHtml(v.tier_name || 'Core')}.`,
      `<p style="font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.text2};margin:0;">Your upgrade is active. New features are unlocked below your current content — nothing was taken away.</p>`,
      'https://aiimin.in/overview',
      'Explore what unlocked →',
    ),
  }),

  waitlist_confirmation: (v) => {
    const name = v.name ? escapeHtml(v.name) : 'there';
    const firstName = v.name ? escapeHtml(v.name.split(' ')[0]) : 'friend';
    const referralCode = v.referral_code ? escapeHtml(v.referral_code) : null;
    const referralUrl = referralCode ? `https://www.aiimin.in/?ref=${referralCode}` : null;
    const osId = v.reserved_username ? escapeHtml(v.reserved_username) : null;

    const foundingBadge = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
          <tr>
            <td style="background:linear-gradient(90deg, ${BRAND.accent} 0%, ${BRAND.accentDark} 100%);border-radius:999px;padding:9px 18px;font-family:${FONT_BODY};font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.white};">
              ✦ Founding member — perks locked
            </td>
          </tr>
        </table>`;

    const osIdBlock = osId
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;background:linear-gradient(135deg, ${BRAND.accentSoft} 0%, ${BRAND.elevated} 100%);border:1px solid #C5D9CC;border-radius:14px;">
          <tr><td style="padding:18px 20px;text-align:center;">
            <div style="font-family:${FONT_BODY};font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.text3};margin-bottom:8px;">Your OS-ID is locked</div>
            <div style="font-family:${FONT_DISPLAY};font-size:30px;font-weight:700;color:${BRAND.accent};letter-spacing:0.04em;">@${osId}</div>
            <div style="font-family:${FONT_BODY};font-size:13px;line-height:1.55;color:${BRAND.text2};margin-top:10px;">Ships with your account at launch. Nobody else can claim this handle.</div>
          </td></tr>
        </table>`
      : '';

    const referralBlock = referralUrl
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 0;background:${BRAND.elevated};border:1px solid ${BRAND.border};border-radius:14px;">
          <tr><td style="padding:18px 20px;">
            <div style="font-family:${FONT_BODY};font-size:14px;font-weight:600;color:${BRAND.text1};margin-bottom:6px;">Your founding link</div>
            <div style="font-family:${FONT_BODY};font-size:13px;line-height:1.55;color:${BRAND.text2};margin-bottom:12px;">Share AIIMIN with one friend who'd actually use it. Every signup through your link strengthens your founding package.</div>
            <a href="${referralUrl}" style="display:inline-block;padding:10px 14px;background:${BRAND.surface};border:1px solid ${BRAND.border};border-radius:8px;font-family:monospace;font-size:12px;font-weight:500;color:${BRAND.accent};text-decoration:none;word-break:break-all;">${referralUrl}</a>
          </td></tr>
        </table>`
      : '';

    const bodyHtml = `
      ${foundingBadge}
      <p style="font-family:${FONT_BODY};font-size:17px;line-height:1.6;color:${BRAND.text1};margin:0 0 8px;font-weight:600;">
        ${firstName}, you're in.
      </p>
      <p style="font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${BRAND.text2};margin:0 0 20px;">
        You just secured a spot on the AIIMIN founding waitlist — the personal Life OS built for Indian students who are tired of juggling Notion, spreadsheets, and guilt.
      </p>
      ${lifeScoreTeaser()}
      ${osIdBlock}
      <p style="font-family:${FONT_BODY};font-size:14px;font-weight:600;color:${BRAND.text1};margin:0 0 10px;">Locked in at launch</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;">
        ${perkRow('Complimentary Core', 'Full Core tier at go-live — <strong>waitlist only</strong>, never offered again.', true)}
        ${perkRow('Founding Pro — ₹49/mo', '12 months at founding rate (list ₹59). Behavioural analytics that connect.')}
        ${perkRow('Founding Elite — ₹79/mo', '12 months at founding rate (list ₹99). Every module, highest limits.')}
        ${perkRow('Life Score + streaks', 'Your daily completion ring, XP ranks, and pattern insights — from day one.')}
        ${perkRow('September 2026', 'You hear from us <strong>before</strong> public launch. Early testers get first keys.')}
      </table>
      ${referralBlock}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;padding:16px 18px;background:${BRAND.elevated};border-radius:12px;border-left:4px solid ${BRAND.accent};">
        <tr><td>
          <p style="font-family:${FONT_BODY};font-size:14px;line-height:1.65;color:${BRAND.text2};margin:0;">
            <strong style="color:${BRAND.text1};">From the builder</strong><br>
            I built AIIMIN because I needed one screen that told the truth about my day — not another app to maintain. Reply to this email; it reaches me directly.
            <br><br>— Aaditya
          </p>
        </td></tr>
      </table>`;

    return {
      subject: `${firstName}, your AIIMIN founding spot is locked ✦`,
      html: waitlistLayout({
        preheader: 'Complimentary Core at launch + founding pricing. One screen for habits, money, focus, and mood.',
        eyebrow: 'Founding access',
        title: 'Welcome to the inside.',
        bodyHtml,
        ctaHref: referralUrl || BRAND.siteUrl,
        ctaLabel: referralUrl ? 'Share your founding link' : 'Back to AIIMIN',
        footerNote: 'Invited testers: register by <strong>31 July</strong> for Elite free for one year.',
      }),
    };
  },

  waitlist_osid_locked: (v) => {
    const name = v.name ? escapeHtml(v.name) : 'there';
    const osId = escapeHtml(v.reserved_username || '');

    return {
      subject: `Your OS-ID is locked — @${v.reserved_username}`,
      html: waitlistLayout({
        preheader: `@${v.reserved_username} is reserved for your email at launch.`,
        eyebrow: 'OS-ID locked',
        title: 'Handle secured.',
        bodyHtml: `
          <p style="font-family:${FONT_BODY};font-size:16px;line-height:1.65;color:${BRAND.text2};margin:0 0 20px;">
            Hey ${name} — your personal OS-ID is now locked to this email.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;background:linear-gradient(135deg, ${BRAND.accentSoft} 0%, ${BRAND.elevated} 100%);border:1px solid #C5D9CC;border-radius:14px;">
            <tr><td style="padding:20px;text-align:center;">
              <div style="font-family:${FONT_DISPLAY};font-size:32px;font-weight:700;color:${BRAND.accent};">@${osId}</div>
            </td></tr>
          </table>
          <p style="font-family:${FONT_BODY};font-size:14px;line-height:1.6;color:${BRAND.text2};margin:0;">
            This handle ships with your account when AIIMIN launches. No one else can claim it.
          </p>`,
        ctaHref: BRAND.siteUrl,
        ctaLabel: 'Back to the waitlist',
      }),
    };
  },

  waitlist_invite: () => ({
    subject: "You're invited to AIIMIN — early access is ready",
    html: waitlistLayout({
      preheader: 'Your tester invite is active. Sign in to explore the full dashboard.',
      eyebrow: 'Early access',
      title: 'Your invite is ready.',
      bodyHtml: `<p style="font-family:${FONT_BODY};font-size:16px;line-height:1.65;color:${BRAND.text2};margin:0 0 16px;">
        You were approved from the waitlist. Sign in with this email to explore habits, money, focus, and the full dashboard before public launch.
      </p>
      <p style="font-family:${FONT_BODY};font-size:14px;line-height:1.6;color:${BRAND.text2};margin:0;padding:14px 16px;background:${BRAND.elevated};border-radius:12px;border:1px solid ${BRAND.border};">
        Tester registration closes <strong>31 July</strong>. Elite tier is complimentary for one year when you activate before the deadline.
      </p>`,
      ctaHref: 'https://www.aiimin.in/login',
      ctaLabel: 'Sign in to AIIMIN',
    }),
  }),

  waitlist_owner_notify: (v) => {
    if (v.html && !v.type) {
      return {
        subject: v.subject || '[AIIMIN] Waitlist activity',
        html: waitlistLayout({
          eyebrow: 'Admin alert',
          title: 'Waitlist activity',
          bodyHtml: v.html,
        }),
      };
    }

    if (v.type === 'feedback') {
      const sentiment = escapeHtml(v.sentiment || 'note');
      const fromLine = v.email && v.email !== 'anonymous'
        ? escapeHtml(v.email)
        : 'Anonymous';
      return {
        subject: v.subject || `[AIIMIN] Waitlist feedback · ${sentiment}`,
        html: waitlistLayout({
          preheader: `New waitlist feedback (${sentiment})`,
          eyebrow: 'Feedback',
          title: 'Someone left a note.',
          bodyHtml: `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;margin:0 0 20px;">
              ${detailRow('Sentiment', `<span style="color:${BRAND.accent};font-weight:600;">${sentiment}</span>`)}
              ${detailRow('From', fromLine)}
              ${detailRow('Source', escapeHtml(v.source || 'landing'))}
            </table>
            <p style="font-family:${FONT_BODY};font-size:15px;line-height:1.7;color:${BRAND.text2};margin:0;padding:16px 18px;background:${BRAND.elevated};border-radius:12px;border:1px solid ${BRAND.border};">
              ${escapeHtml(v.message || '(no message)')}
            </p>`,
          ctaHref: BRAND.siteUrl,
          ctaLabel: 'Open waitlist',
        }),
      };
    }

    const safeEmail = escapeHtml(v.email || '—');
    const safeName = escapeHtml(v.name || '—');
    const safeUsername = v.reserved_username ? escapeHtml(v.reserved_username) : null;
    const isOsIdEvent = v.event === 'osid_reserved';

    return {
      subject: v.subject || (isOsIdEvent
        ? `[AIIMIN] OS-ID locked · ${v.email} (@${v.reserved_username})`
        : safeUsername
          ? `[AIIMIN] New signup · ${v.email} (@${v.reserved_username})`
          : `[AIIMIN] New signup · ${v.email}`),
      html: waitlistLayout({
        preheader: isOsIdEvent
          ? `${v.email} locked OS-ID @${v.reserved_username}.`
          : 'New person joined the AIIMIN founding waitlist.',
        eyebrow: isOsIdEvent ? 'OS-ID' : 'Waitlist',
        title: isOsIdEvent ? 'OS-ID reserved' : 'New founding signup',
        bodyHtml: `
          <p style="font-family:${FONT_BODY};font-size:15px;line-height:1.6;color:${BRAND.text2};margin:0 0 20px;">
            ${isOsIdEvent
              ? 'A waitlist member just locked their personal handle after signup.'
              : 'Someone just joined the founding waitlist.'}
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;">
            ${detailRow('Email', `<a href="mailto:${safeEmail}" style="color:${BRAND.accent};text-decoration:none;">${safeEmail}</a>`)}
            ${detailRow('First name', safeName)}
            ${detailRow('OS-ID', safeUsername ? `<span style="font-family:${FONT_DISPLAY};color:${BRAND.accent};font-weight:600;">@${safeUsername}</span>` : `<span style="color:${BRAND.text3};">Not claimed yet</span>`)}
            ${detailRow('Source', escapeHtml(v.source || 'landing_page'))}
            ${detailRow(isOsIdEvent ? 'Reserved at' : 'Signed up', formatSignedUpAt(v.signed_up_at))}
          </table>`,
        ctaHref: BRAND.siteUrl,
        ctaLabel: 'View landing page',
      }),
    };
  },
};

export function renderEmail(templateId, variables = {}) {
  const fn = EMAIL_TEMPLATES[templateId];
  if (!fn) throw new Error(`Unknown email template: ${templateId}`);
  return fn(variables);
}
