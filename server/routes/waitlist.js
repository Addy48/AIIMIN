import { Hono } from 'hono';
import { pool } from '../lib/db.js';
import {
  validateEmail,
  validateName,
  validateOsId,
  escapeHtml,
} from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { waitlistLimiter, feedbackLimiter } from '../middleware/rateLimiter.js';
import { sendEmail } from '../lib/email.js';
import { getOwnerNotifyEmail } from '../services/accessService.js';
import { toDisplayMemberNumber, DISPLAY_CAP } from '../lib/waitlistEmailVariants.js';

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

const REFERRAL_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateReferralCode() {
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += REFERRAL_ALPHABET[Math.floor(Math.random() * REFERRAL_ALPHABET.length)];
  }
  return code;
}

async function createUniqueReferralCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = generateReferralCode();
    const { rows } = await pool.query(
      'SELECT 1 FROM waitlist_emails WHERE referral_code = $1 LIMIT 1',
      [code],
    );
    if (!rows.length) return code;
  }
  throw new Error('Failed to generate referral code');
}

async function getWaitlistPosition(email) {
  const { rows } = await pool.query(
    `SELECT position FROM (
       SELECT email,
              ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) AS position
       FROM waitlist_emails
     ) ranked
     WHERE lower(email) = lower($1)
     LIMIT 1`,
    [email],
  );
  return rows[0]?.position ?? null;
}

async function applyReferralBonus(referrerCode) {
  if (!referrerCode) return;
  const normalized = String(referrerCode).trim().toUpperCase();
  if (!normalized) return;
  await pool.query(
    `UPDATE waitlist_emails
     SET referral_count = referral_count + 1
     WHERE referral_code = $1`,
    [normalized],
  ).catch((err) => {
    if (!/referral_count|referral_code/i.test(err.message)) throw err;
  });
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

async function notifyOwnerWaitlistSignup({
  email,
  firstName,
  reservedUsername,
  source,
  event = 'signup',
}) {
  const ownerEmail = getOwnerNotifyEmail();
  let totalCount = null;
  try {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM waitlist_emails');
    totalCount = rows[0]?.count ?? null;
  } catch {
  }
  try {
    await sendEmail(ownerEmail, 'waitlist_owner_notify', {
      type: 'signup',
      event,
      email,
      name: firstName,
      reserved_username: reservedUsername,
      source: source || 'landing_page',
      signed_up_at: new Date().toISOString(),
      total_count: totalCount,
    });
  } catch (err) {
    console.warn('[Waitlist] owner notify failed:', err.message);
  }
}

async function sendWaitlistConfirmation({ email, firstName, reservedUsername, referralCode }) {
  let memberNumber = null;
  try {
    const position = await getWaitlistPosition(email);
    memberNumber = toDisplayMemberNumber(position);
  } catch {
    // non-fatal
  }
  try {
    await sendEmail(email, 'waitlist_confirmation', {
      email,
      name: firstName,
      reserved_username: reservedUsername,
      referral_code: referralCode,
      member_number: memberNumber,
      total_count: DISPLAY_CAP,
    });
    return true;
  } catch (err) {
    console.error('[Waitlist] confirmation email failed:', { email, error: err.message });
    return false;
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
      `INSERT INTO tester_allowlist (email, role, tier, invited_by)
       VALUES ($1, $2, 'elite', $3)
       ON CONFLICT (email) DO UPDATE SET
         role = EXCLUDED.role,
         tier = EXCLUDED.tier,
         invited_by = COALESCE(EXCLUDED.invited_by, tester_allowlist.invited_by)`,
      [email, role, c.get('userId')],
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
    try {
      await sendEmail(ownerEmail, 'waitlist_owner_notify', {
        type: 'feedback',
        sentiment,
        email: emailRaw || 'anonymous',
        message: message || '(no message)',
        source: body.source || 'landing',
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
    const nameCheck = validateName(nameInput);
    const firstName = nameCheck.value;

    const usernameInput = body.reserved_username ?? body.username;
    let reservedUsername = null;
    if (usernameInput != null && String(usernameInput).trim() !== '') {
      const usernameCheck = validateOsId(usernameInput);
      if (!usernameCheck.ok) {
        return c.json({ error: usernameCheck.error }, 400);
      }
      reservedUsername = usernameCheck.value;
    }

    if (reservedUsername && await isUsernameTaken(reservedUsername)) {
      return c.json({ error: 'That OS-ID is already taken — try another' }, 409);
    }

    const source = String(body.source || 'landing_page').slice(0, 100);
    const interest = String(body.interest || '').trim().slice(0, 200) || null;
    const referredByRaw = body.referred_by ?? body.ref ?? null;
    const referredBy = referredByRaw
      ? String(referredByRaw).trim().toUpperCase().slice(0, 12)
      : null;

    let referralCode;
    try {
      referralCode = await createUniqueReferralCode();
    } catch (err) {
      console.error('[Waitlist] referral code error:', err.message);
      referralCode = null;
    }

    try {
      await pool.query(
        `INSERT INTO waitlist_emails (
           email, name, first_name, reserved_username, source, referral_code, referred_by
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          email,
          firstName,
          firstName,
          reservedUsername,
          interest ? `${source}:${interest}` : source,
          referralCode,
          referredBy,
        ],
      );
    } catch (err) {
      if (err.code === '23505') {
        const constraint = String(err.constraint || '');
        if (constraint.includes('reserved_username')) {
          return c.json({ error: 'That OS-ID is already taken — try another' }, 409);
        }

        let attachedUsername = null;
        let osIdJustAttached = false;
        if (reservedUsername) {
          const { rows: existingRows } = await pool.query(
            'SELECT reserved_username, first_name, name FROM waitlist_emails WHERE lower(email) = lower($1) LIMIT 1',
            [email],
          );
          const existingUsername = existingRows[0]?.reserved_username;
          if (existingUsername) {
            attachedUsername = existingUsername;
          } else if (await isUsernameTaken(reservedUsername)) {
            return c.json({ error: 'That OS-ID is already taken — try another' }, 409);
          } else {
            await pool.query(
              'UPDATE waitlist_emails SET reserved_username = $1 WHERE lower(email) = lower($2)',
              [reservedUsername, email],
            );
            attachedUsername = reservedUsername;
            osIdJustAttached = true;
          }
        }

        const { rows } = await pool.query(
          'SELECT referral_code, referral_count, reserved_username, first_name, name FROM waitlist_emails WHERE lower(email) = lower($1) LIMIT 1',
          [email],
        ).catch(() => ({ rows: [] }));
        const resolvedUsername = attachedUsername || rows[0]?.reserved_username || null;
        const resolvedName = firstName || rows[0]?.first_name || rows[0]?.name || null;
        const resolvedReferralCode = rows[0]?.referral_code || null;

        let confirmationEmailSent = false;
        if (osIdJustAttached && resolvedUsername) {
          confirmationEmailSent = await sendWaitlistConfirmation({
            email,
            firstName: resolvedName,
            reservedUsername: resolvedUsername,
            referralCode: resolvedReferralCode,
          });
        }

        return c.json({
          success: true,
          already_registered: true,
          message: osIdJustAttached ? 'OS-ID locked.' : "You're already registered.",
          referral_code: resolvedReferralCode,
          referral_count: rows[0]?.referral_count ?? 0,
          reserved_username: resolvedUsername,
          confirmation_email_sent: confirmationEmailSent,
        });
      }
      if (/referral_code|referred_by/i.test(err.message)) {
        await pool.query(
          `INSERT INTO waitlist_emails (email, name, first_name, reserved_username, source)
           VALUES ($1, $2, $3, $4, $5)`,
          [email, firstName, firstName, reservedUsername, interest ? `${source}:${interest}` : source],
        );
      } else {
        console.error('[Waitlist] insert error:', err.message);
        return c.json({ error: 'Failed to join waitlist' }, 500);
      }
    }

    if (referredBy) {
      await applyReferralBonus(referredBy).catch((err) => {
        console.warn('[Waitlist] referral bonus failed:', err.message);
      });
    }

    let referralCount = 0;
    if (referralCode) {
      const { rows } = await pool.query(
        'SELECT referral_count FROM waitlist_emails WHERE lower(email) = lower($1) LIMIT 1',
        [email],
      ).catch(() => ({ rows: [] }));
      referralCount = rows[0]?.referral_count ?? 0;
    }

    console.log(`[Waitlist] New signup: ${email} (${firstName || 'no-name'}) ${reservedUsername ? `@${reservedUsername}` : '(no-osid)'}`);

    const confirmationEmailSent = await sendWaitlistConfirmation({
      email,
      firstName,
      reservedUsername,
      referralCode,
    });

    notifyOwnerWaitlistSignup({
      email,
      firstName,
      reservedUsername,
      source,
      event: 'signup',
    }).catch(() => {});

    return c.json({
      success: true,
      message: "You're on the list.",
      reserved_username: reservedUsername,
      referral_code: referralCode,
      referral_count: referralCount,
      confirmation_email_sent: confirmationEmailSent,
    });
  } catch (err) {
    console.error('[Waitlist] POST error:', err.message);
    return c.json({ error: 'Failed to join waitlist' }, 500);
  }
});

export default app;
