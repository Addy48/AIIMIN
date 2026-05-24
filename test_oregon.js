import pg from 'pg';
const { Client } = pg;

const CONFIGS = [
  {
    name: "postgres with REDACTED_DB_PASSWORD",
    user: "postgres.yubxgftugxbwtywyhcsv",
    password: "REDACTED_DB_PASSWORD"
  },
  {
    name: "postgres with REDACTED_NEON_PASSWORD",
    user: "postgres.yubxgftugxbwtywyhcsv",
    password: "REDACTED_NEON_PASSWORD"
  },
  {
    name: "postgres with 222222",
    user: "postgres.yubxgftugxbwtywyhcsv",
    password: "222222"
  },
  {
    name: "dashboard_app with REDACTED_DB_PASSWORD",
    user: "dashboard_app.yubxgftugxbwtywyhcsv",
    password: "REDACTED_DB_PASSWORD"
  }
];

async function testConfig(cfg) {
  console.log(`\nTesting: ${cfg.name}`);
  const client = new Client({
    host: "aws-0-us-west-2.pooler.supabase.com",
    port: 6543,
    database: "postgres",
    user: cfg.user,
    password: cfg.password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000
  });

  try {
    await client.connect();
    console.log(`✅ SUCCESS! Connected to ${cfg.name}`);
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    await client.end();
    return true;
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
    return false;
  }
}

async function main() {
  for (const cfg of CONFIGS) {
    const ok = await testConfig(cfg);
    if (ok) {
      console.log(`\n🎉 Connection succeeded with config: ${cfg.name}`);
      console.log(`DATABASE_URL=postgresql://${cfg.user}:${cfg.password}@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require`);
      process.exit(0);
    }
  }
  console.log("\n❌ All credentials failed for Oregon pooler.");
  process.exit(1);
}

main();
