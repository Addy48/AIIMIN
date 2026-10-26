// Run: node --test --experimental-test-module-mocks server/routes/waitlist.test.js
// The database is an in-memory fake and RESEND_API_KEY is cleared, so nothing reaches Supabase or Resend.
import assert from 'node:assert/strict';
import { mock, test } from 'node:test';

process.env.RESEND_API_KEY = '';

const rows = [];
const sent = [];
const fakePool = {
  async query(sql, params = []) {
    const q = sql.replace(/\s+/g, ' ');
    if (q.startsWith('SELECT 1 FROM waitlist_emails WHERE referral_code')) {
      return { rows: rows.filter((r) => r.referral_code === params[0]).map(() => ({ 1: 1 })) };
    }
    if (q.startsWith('INSERT INTO waitlist_emails')) {
      const [email, name, , , source, referral_code, referred_by] = params;
      if (rows.some((r) => r.email === email)) {
        const err = new Error('duplicate key'); err.code = '23505'; err.constraint = 'waitlist_emails_email_key'; throw err;
      }
      rows.push({ email, name, first_name: name, source, referral_code, referred_by, referral_count: 0 });
      return { rows: [] };
    }
    if (q.includes('ROW_NUMBER()')) {
      const i = rows.findIndex((r) => r.email === String(params[0]).toLowerCase());
      return { rows: i < 0 ? [] : [{ position: String(i + 1) }] };
    }
    if (q.startsWith('UPDATE waitlist_emails SET referral_count')) {
      rows.filter((r) => r.referral_code === params[0]).forEach((r) => { r.referral_count += 1; });
      return { rows: [] };
    }
    if (q.startsWith('SELECT referral_code, referral_count') || q.startsWith('SELECT referral_count')) {
      return { rows: rows.filter((r) => r.email === String(params[0]).toLowerCase()) };
    }
    if (q.startsWith('SELECT COUNT(*)')) return { rows: [{ count: rows.length }] };
    throw new Error(`fake pool: unhandled query: ${q.slice(0, 80)}`);
  },
};

mock.module('../lib/db.js', { namedExports: { pool: fakePool, getPool: () => fakePool }, defaultExport: fakePool });
mock.module('../middleware/auth.js', { namedExports: { requireAuth: async (c, next) => next() } });
mock.module('../services/accessService.js', { namedExports: { getOwnerNotifyEmail: () => 'owner@example.test' } });
mock.module('../lib/email.js', {
  namedExports: {
    sendEmail: async (to, templateId, variables) => { sent.push({ to, templateId, variables }); return { stub: true }; },
  },
});

const { default: app } = await import('./waitlist.js');
const { renderWaitlistWelcome, renderWaitlistInvite, isFounding, FOUNDING_SEATS } = await import('../lib/waitlistMail.js');

let ipSeq = 0;
const join = (body) => app.request('/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.0.0.${(ipSeq += 1)}` },
  body: JSON.stringify(body),
});

test('a new signup gets its real position, founding status and one confirmation email', async () => {
  const res = await join({ email: 'Meera@Example.com', source: 'site_v4' });
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.position, 1);
  assert.equal(data.founding, true);
  assert.equal(data.founding_seats, 251);
  assert.match(data.referral_code, /^[A-Z2-9]{6}$/);
  const mail = sent.find((m) => m.templateId === 'waitlist_confirmation');
  assert.equal(mail.to, 'meera@example.com');
  assert.equal(mail.variables.position, 1);
});

test('joining twice does not send a second confirmation', async () => {
  const before = sent.filter((m) => m.templateId === 'waitlist_confirmation').length;
  const data = await (await join({ email: 'meera@example.com' })).json();
  assert.equal(data.already_registered, true);
  assert.equal(data.position, 1);
  assert.equal(sent.filter((m) => m.templateId === 'waitlist_confirmation').length, before);
});

test('a friend who joins with a referral code credits the referrer', async () => {
  const code = rows[0].referral_code;
  await join({ email: 'ravi@example.com', referred_by: code.toLowerCase() });
  assert.equal(rows[0].referral_count, 1);
  assert.equal(rows[1].referred_by, code);
});

test('bad emails and bots are turned away without a row or an email', async () => {
  const n = rows.length; const m = sent.length;
  assert.equal((await join({ email: 'not-an-email' })).status, 400);
  const bot = await join({ email: 'bot@example.com', website: 'spam.example' });
  assert.equal(bot.status, 200);
  assert.equal(rows.length, n);
  assert.equal(sent.length, m);
});

test('position 251 is the last founding seat', () => {
  assert.equal(FOUNDING_SEATS, 251);
  assert.equal(isFounding(251), true);
  assert.equal(isFounding(252), false);
  assert.equal(isFounding(null), false);
});

test('the welcome email reads right for founding and later signups', () => {
  const f = renderWaitlistWelcome({ name: 'Meera Rao', position: 42, referral_code: 'ABC234' });
  assert.equal(f.subject, 'Welcome to AIIMIN, founding member #42');
  assert.match(f.html, /Welcome to AIIMIN, Meera\./);
  assert.match(f.html, /I’m Aaditya/);
  assert.match(f.html, /₹49\.50/);
  assert.match(f.html, /aiimin\.in\/\?ref=ABC234/);
  assert.doesNotMatch(f.html, /Personal OS|OS-ID|Life OS/);

  const late = renderWaitlistWelcome({ position: 1200 });
  assert.equal(late.subject, 'Welcome to AIIMIN');
  assert.match(late.html, /All 251 founding spots are taken/);
  assert.doesNotMatch(late.html, /\?ref=/);

  const esc = renderWaitlistWelcome({ name: '<script>x</script>', position: 3 });
  assert.doesNotMatch(esc.html, /<script>/);
});

test('the invite email links to the install page', () => {
  const inv = renderWaitlistInvite({ name: 'Ravi', position: 300 });
  assert.equal(inv.subject, 'Your AIIMIN invite is ready');
  assert.match(inv.html, /https:\/\/aiimin\.in\/app/);
  assert.doesNotMatch(inv.html, /founding member/);
});
