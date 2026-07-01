#!/usr/bin/env node
/**
 * Waitlist — owner/tester env setup helper.
 *
 * Usage:
 *   node scripts/setup-owner-tier.js --email you@aiimin.in [--tier elite]
 */
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

function parseArgs(argv) {
  const out = { email: null, tier: 'elite' };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--email' && argv[i + 1]) {
      out.email = argv[++i];
    } else if (arg === '--tier' && argv[i + 1]) {
      out.tier = argv[++i];
    }
  }
  return out;
}

function printEnvBlock(email) {
  console.log('\n# ── Waitlist access (copy into .env + Vercel/EC2) ──');
  console.log('WAITLIST_MODE=true');
  console.log('REACT_APP_WAITLIST_MODE=true');
  console.log(`DEV_EMAILS=${email}`);
  console.log(`REACT_APP_DEV_EMAILS=${email}`);
  console.log(`OWNER_EMAILS=${email}`);
  console.log('# Comma-separated tester emails:');
  console.log('TESTER_EMAILS=');
  console.log('REACT_APP_TESTER_EMAILS=');
  console.log('');
}

async function patchOwnerTier({ email, tier }) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('DATABASE_URL not set — skipping subscription_tier patch.');
    return;
  }

  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  const client = await pool.connect();

  try {
    const byEmail = await client.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [email]);
    const userId = byEmail.rows[0]?.id;
    if (!userId) {
      console.warn(`No users row for ${email} — tier patch skipped.`);
      return;
    }

    await client.query(
      `INSERT INTO user_profiles (user_id, subscription_tier, prev_tier)
       VALUES ($1, $2, 'explore')
       ON CONFLICT (user_id) DO UPDATE
       SET subscription_tier = EXCLUDED.subscription_tier`,
      [userId, tier],
    );

    console.log(`✅ Set subscription_tier=${tier} for user ${userId}`);
  } finally {
    client.release();
    await pool.end();
  }
}

const { email, tier } = parseArgs(process.argv);

if (!email) {
  console.log(`Waitlist env helper

Required:
  --email you@aiimin.in   Owner/dev email for allowlist bypass

Optional:
  --tier elite            subscription_tier to set (default: elite)

Documented env vars:
  WAITLIST_MODE / REACT_APP_WAITLIST_MODE
  DEV_EMAILS / REACT_APP_DEV_EMAILS
  TESTER_EMAILS / REACT_APP_TESTER_EMAILS
  OWNER_EMAILS
`);
  process.exit(1);
}

printEnvBlock(email);
patchOwnerTier({ email, tier }).catch((err) => {
  console.error('Tier patch failed:', err.message);
  process.exit(1);
});
