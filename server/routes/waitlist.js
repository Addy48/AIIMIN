import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import {
  validateEmail,
  validateRequiredName,
  validateOsId,
  escapeHtml,
} from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { waitlistLimiter, feedbackLimiter } from '../middleware/rateLimiter.js';
import { sendEmail } from '../lib/email.js';
import { getOwnerNotifyEmail } from '../services/accessService.js';

const app = new Hono();

function parseIdList(envVar) {
  return (process.env[envVar] || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

function parseList(envVar) {
  return (process.env[envVar] || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function isOwner(c) {
  const user = c.get('user');
  if (user?.role === 'admin') return true;

  const email = String(user?.email || '').trim().toLowerCase();
  const ownerEmails = parseList('OWNER_EMAILS');
  const devEmails = parseList('DEV_EMAILS');
  if (email && (ownerEmails.includes(email) || devEmails.includes(email))) return true;

  const cognitoSub = c.get('cognitoSub') || user?.cognitoSub;
  const ownerSubs = parseIdList('OWNER_COGNITO_SUBS');
  return Boolean(cognitoSub && ownerSubs.includes(cognitoSub));
}

function ownerForbidden(c) {
  if (isOwner(c)) return null;
  return c.json({ error: 'Forbidden: owner access required' }, 403);
}

function sanitizeEmail(raw) {
  return String(raw || '').trim().toLowerCase();
}

async function isUsernameTaken(username) {
  const normalized = String(username || '').trim().toUpperCase();
  const { rows } = await pool.query(
    `SELECT 1 AS taken FROM waitlist_emails
     WHERE lower(reserved_username) = lower($1)
     UNION ALL
     SELECT 1 FROM users WHERE lower(username) = lower($1)
     LIMIT 1`,
    [normalized],
  );
  return rows.length > 0;
}

async function notifyOwnerWaitlistSignup({ email, firstName, reservedUsername, source }) {
  const ownerEmail = getOwnerNotifyEmail();
  const safeEmail = escapeHtml(email);
  const safeName = escapeHtml(firstName);
  const safeUsername = escapeHtml(reservedUsername);
  const subject = `[AIIMIN Waitlist] New signup: ${email} (@${reservedUsername})`;
  const html = `
    <p><strong>New waitlist signup</strong></p>
    <p>Email: ${safeEmail}</p>
    <p>First name: ${safeName}</p>
    <p>Reserved OS-ID: @${safeUsername}</p>
    <p>Source: ${escapeHtml(source || 'landing_page')}</p>
    <p>Time: ${new Date().toISOString()}</p>
  `;
  try {
    await sendEmail(ownerEmail, 'waitlist_owner_notify', {
      email,
      name: firstName,
      reserved_username: reservedUsername,
      source: source || 'landing_page',
      html,
      subject,
    });
  } catch (err) {
    console.warn('[Waitlist] owner notify failed:', err.message);
  }
}

app.get('/count', async (c) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM waitlist_emails');
    return c.json({ count: rows[0]?.count ?? 0 });
  } catch (err) {
    console.error('[Waitlist] count error:', err.message);
    return c.json({ count: 0 });
  }
});

app.get('/list', requireAuth, async (c) => {
  const forbidden = ownerForbidden(c);
  if (forbidden) return forbidden;

  try {
    const { rows } = await pool.query(
      `SELECT id, email, name, first_name, reserved_username, source, created_at
       FROM waitlist_emails
       ORDER BY created_at DESC`,
    );
    return c.json({ entries: rows || [] });
  } catch (err) {
    console.error('[Waitlist] list error:', err.message);
    return c.json({ error: 'Failed to load waitlist' }, 500);
  }
});

app.post('/approve', requireAuth, async (c) => {
  const forbidden = ownerForbidden(c);
  if (forbidden) return forbidden;

  try {
    const body = await c.req.json();
    const emailCheck = validateEmail(body.email);
    if (!emailCheck.ok) {
      return c.json({ error: emailCheck.error }, 400);
    }
    const email = emailCheck.value;
    const role = body.role === 'dev' ? 'dev' : 'tester';

    await pool.query(
      `INSERT INTO tester_allowlist (email, role, approved_at, approved_by, notes)
       VALUES ($1, $2, NOW(), $3, $4)
       ON CONFLICT (email) DO UPDATE SET
         role = EXCLUDED.role,
         approved_at = NOW(),
         approved_by = EXCLUDED.approved_by`,
      [email, role, c.get('userId'), body.notes || null],
    );

    try {
      await sendEmail(email, 'waitlist_invite', { email });
    } catch (err) {
      console.warn('[Waitlist] invite email failed:', err.message);
    }

    return c.json({ success: true, email, role, message: 'Approved and invite sent.' });
  } catch (err) {
    console.error('[Waitlist] approve error:', err.message);
    return c.json({ error: 'Failed to approve tester' }, 500);
  }
});

/** Public quick feedback from waitlist landing — no auth */
app.post('/feedback', feedbackLimiter, async (c) => {
  try {
    const body = await c.req.json();
    const message = String(body.message || '').trim().slice(0, 2000);
    const sentiment = ['love', 'curious', 'skeptical', 'feature'].includes(body.sentiment)
      ? body.sentiment
      : 'curious';
    const emailRaw = body.email ? sanitizeEmail(body.email) : null;

    if (!message && !emailRaw) {
      return c.json({ error: 'Add a quick note or your email' }, 400);
    }

    if (emailRaw) {
      const emailCheck = validateEmail(emailRaw);
      if (!emailCheck.ok) {
        return c.json({ error: emailCheck.error }, 400);
      }
    }

    await pool.query(
      `INSERT INTO waitlist_feedback (email, sentiment, message, source)
       VALUES ($1, $2, $3, $4)`,
      [emailRaw, sentiment, message || null, body.source || 'landing'],
    ).catch((err) => {
      if (!/does not exist|relation.*waitlist_feedback/i.test(err.message)) throw err;
      console.warn('[Waitlist] waitlist_feedback table missing — logging only');
    });

    const ownerEmail = getOwnerNotifyEmail();
    const subject = `[AIIMIN Feedback] ${sentiment} — waitlist`;
    const html = `
      <p><strong>Waitlist feedback</strong> (${escapeHtml(sentiment)})</p>
      ${emailRaw ? `<p>From: ${escapeHtml(emailRaw)}</p>` : '<p>Anonymous</p>'}
      <p>${escapeHtml(message || '(no message)')}</p>
    `;
    try {
      await sendEmail(ownerEmail, 'waitlist_owner_notify', {
        subject,
        html,
        email: emailRaw || 'anonymous',
      });
    } catch (err) {
      console.warn('[Waitlist] feedback notify failed:', err.message);
    }

    return c.json({ success: true, message: 'Thanks — we read every note.' });
  } catch (err) {
    console.error('[Waitlist] feedback error:', err.message);
    return c.json({ error: 'Failed to send feedback' }, 500);
  }
});

app.post('/', waitlistLimiter, async (c) => {
  try {
    const body = await c.req.json();
    const emailCheck = validateEmail(body.email);
    if (!emailCheck.ok) {
      return c.json({ error: emailCheck.error }, 400);
    }
    const email = emailCheck.value;

    const nameInput = body.first_name ?? body.name;
    const nameCheck = validateRequiredName(nameInput);
    if (!nameCheck.ok) {
      return c.json({ error: nameCheck.error }, 400);
    }
    const firstName = nameCheck.value;

    const usernameCheck = validateOsId(body.reserved_username ?? body.username);
    if (!usernameCheck.ok) {
      return c.json({ error: usernameCheck.error }, 400);
    }
    const reservedUsername = usernameCheck.value;

    if (await isUsernameTaken(reservedUsername)) {
      return c.json({ error: 'That OS-ID is already taken — try another' }, 409);
    }

    const source = String(body.source || 'landing_page').slice(0, 100);
    const interest = String(body.interest || '').trim().slice(0, 200) || null;

    try {
      await pool.query(
        `INSERT INTO waitlist_emails (email, name, first_name, reserved_username, source)
         VALUES ($1, $2, $3, $4, $5)`,
        [email, firstName, firstName, reservedUsername, interest ? `${source}:${interest}` : source],
      );
    } catch (err) {
      if (err.code === '23505') {
        const constraint = String(err.constraint || '');
        if (constraint.includes('reserved_username')) {
          return c.json({ error: 'That OS-ID is already taken — try another' }, 409);
        }
        return c.json({ success: true, already_registered: true, message: "You're already registered." });
      }
      console.error('[Waitlist] insert error:', err.message);
      return c.json({ error: 'Failed to join waitlist' }, 500);
    }

    console.log(`[Waitlist] New signup: ${email} (${firstName}) @${reservedUsername}`);

    try {
      await sendEmail(email, 'waitlist_confirmation', {
        email,
        name: firstName,
        reserved_username: reservedUsername,
      });
    } catch (err) {
      console.warn('[Waitlist] confirmation email failed:', err.message);
    }

    notifyOwnerWaitlistSignup({
      email,
      firstName,
      reservedUsername,
      source,
    }).catch(() => {});

    return c.json({
      success: true,
      message: "You're on the list.",
      reserved_username: reservedUsername,
    });
  } catch (err) {
    console.error('[Waitlist] POST error:', err.message);
    return c.json({ error: 'Failed to join waitlist' }, 500);
  }
});

export default app;
