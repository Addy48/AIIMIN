/**
 * HTML email templates (ENG-04) — dark theme, 600px max width.
 */
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const BASE_STYLE = `
  body { margin:0; padding:0; background:#0A0C10; font-family:system-ui,-apple-system,sans-serif; }
  .wrap { max-width:600px; margin:0 auto; padding:32px 24px; }
  .card { background:#111318; border:1px solid #252836; border-radius:12px; padding:28px; }
  h1 { color:#EDEDED; font-size:22px; margin:0 0 12px; }
  p { color:#A1A1AA; font-size:15px; line-height:1.6; margin:0 0 16px; }
  .accent { color:#2563EB; }
  .btn { display:inline-block; background:#2563EB; color:#fff !important; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:700; font-size:14px; }
  .footer { font-size:12px; color:#6B6B7B; margin-top:24px; }
`;

function layout(title, bodyHtml, ctaHref, ctaLabel) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${BASE_STYLE}</style></head>
<body><div class="wrap"><div class="card">
<h1>${title}</h1>
${bodyHtml}
${ctaHref ? `<p><a class="btn" href="${ctaHref}">${ctaLabel || 'Open AIIMIN'}</a></p>` : ''}
<p class="footer">AIIMIN · Built in India · <a href="https://aiimin.in/account?section=notifications" style="color:#6B6B7B">Unsubscribe</a></p>
</div></div></body></html>`;
}

export const EMAIL_TEMPLATES = {
  streak_recovery: (v) => ({
    subject: `Your ${v.streak_days || '—'}-day streak broke. That's okay.`,
    html: layout(
      'Streaks break. What matters is what you do next.',
      `<p>Your ${v.streak_days}-day streak ended yesterday. Most people restart within 48 hours — you're still in that window.</p>
       <p>One tap. Day one again.</p>`,
      'https://aiimin.in/discipline',
      'Start again →',
    ),
  }),
  idle_day3: () => ({
    subject: 'Your habits are waiting.',
    html: layout(
      '3 days away.',
      '<p>You logged in 3 days ago. Your streak data is still here — pick up where you left off.</p>',
      'https://aiimin.in/habits',
      'Mark a habit →',
    ),
  }),
  idle_day7: () => ({
    subject: 'Your life OS is waiting.',
    html: layout(
      'A week without you.',
      '<p>Your dashboard still has your goals, journal entries, and streak history. Nothing was deleted.</p>',
      'https://aiimin.in/overview',
      'Open Overview →',
    ),
  }),
  idle_day14: () => ({
    subject: "Miss you. Here's what you've built.",
    html: layout(
      '14 days.',
      '<p>You built something worth returning to. Your data is safe. Come back when you are ready.</p>',
      'https://aiimin.in/overview',
      'See your stats →',
    ),
  }),
  weekly_digest: (v) => ({
    subject: 'Your week in numbers.',
    html: layout(
      'Weekly digest',
      `<p><strong class="accent">${v.streak_days || 0}-day</strong> discipline streak · <strong>${v.focus_hours || 0}h</strong> deep work · <strong>${v.journal_entries || 0}</strong> journal entries.</p>
       <p>You tracked <strong>${v.habit_count || 0}</strong> habits and spent <strong>₹${v.net_spend || 0}</strong> this week.</p>
       <p>Open the app for your full Life Score breakdown.</p>`,
      'https://aiimin.in/overview',
      'Read digest →',
    ),
  }),
  document_expiry: (v) => ({
    subject: `${v.doc_type || 'Document'} expires in ${v.days_until || '—'} days.`,
    html: layout(
      'Document expiry reminder',
      `<p>${v.member_name}'s <strong>${v.doc_type}</strong> expires on <strong>${v.expiry_date}</strong> (${v.days_until} days).</p>
       <p>Upload a renewal or update the expiry date in Family Vault.</p>`,
      'https://aiimin.in/family',
      'Open Family Vault →',
    ),
  }),
  post_purchase: (v) => ({
    subject: `Welcome to ${v.tier_name || 'Core'}.`,
    html: layout(
      `Welcome to ${v.tier_name || 'Core'}.`,
      '<p>Your upgrade is active. New features are unlocked below your current content — nothing was taken away.</p>',
      'https://aiimin.in/overview',
      'Explore what unlocked →',
    ),
  }),
  waitlist_confirmation: (v) => ({
    subject: "You're on the AIIMIN waitlist ✓",
    html: layout(
      'Spot secured.',
      `<p>Hey ${v.name ? escapeHtml(v.name) : 'there'} — you're in line for early access.</p>
       ${v.reserved_username ? `<p><strong class="accent">Your OS-ID is locked:</strong> @${escapeHtml(v.reserved_username)}</p>` : ''}
       <p>We're building a life OS that connects habits, focus, finance, sports, and AI — so you stop juggling six apps that don't talk to each other.</p>
       <p><strong class="accent">Waitlist perks:</strong></p>
       <ul style="color:#A0A0B0;line-height:1.7;padding-left:20px;">
         <li>OS-ID username reservation (yours at launch)</li>
         <li>Core tier free for 3 months</li>
         <li>Early prototype access before public launch</li>
         <li>Priority sports feed + onboarding</li>
       </ul>`,
      'https://aiimin.in',
      'Explore the landing →',
    ),
  }),
  waitlist_invite: () => ({
    subject: "You're invited to AIIMIN.",
    html: layout(
      'Your early access is ready.',
      '<p>You were approved from the waitlist. Sign in with this email to explore the full dashboard before public launch.</p>',
      'https://aiimin.in/login',
      'Sign in →',
    ),
  }),
  waitlist_owner_notify: (v) => ({
    subject: v.subject || `[AIIMIN] Waitlist activity`,
    html: layout(
      'New waitlist activity',
      v.html || `<p>Email: ${v.email || '—'}</p>`,
    ),
  }),
};

export function renderEmail(templateId, variables = {}) {
  const fn = EMAIL_TEMPLATES[templateId];
  if (!fn) throw new Error(`Unknown email template: ${templateId}`);
  return fn(variables);
}
