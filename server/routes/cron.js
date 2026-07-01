/**
 * Cron endpoints — protect with CRON_SECRET header.
 * Vercel Cron or external scheduler hits these.
 */
import { Hono } from 'hono';
import { runStreakRecoveryEmails, runIdleUserEmails } from '../services/reEngagementService.js';
import { runWeeklyDigestEmails } from '../services/weeklyDigestService.js';
import { runDocumentExpiryEmails } from '../services/documentExpiryService.js';

const app = new Hono();

function authorizeCron(c) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== 'production';
  return c.req.header('authorization') === `Bearer ${secret}`;
}

app.get('/re-engagement', async (c) => {
  if (!authorizeCron(c)) return c.json({ error: 'Unauthorized' }, 401);

  const [streak, idle, digest, expiry] = await Promise.all([
    runStreakRecoveryEmails(),
    runIdleUserEmails(),
    runWeeklyDigestEmails(),
    runDocumentExpiryEmails(),
  ]);

  return c.json({ streak_recovery: streak, idle, weekly_digest: digest, document_expiry: expiry, ts: Date.now() });
});

app.get('/health', (c) => c.json({ ok: true }));

export default app;
