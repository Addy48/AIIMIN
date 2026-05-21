import pg from 'pg';
const { Client } = pg;

const PASSWORDS = [
  "REDACTED_NEON_PASSWORD",
  "REDACTED_DB_PASSWORD",
  "222222",
  "aaditya"
];

async function testPassword(pw) {
  console.log(`\n--- Testing password: ${pw} ---`);
  const client = new Client({
    host: "aws-0-ap-south-1.pooler.supabase.com",
    port: 6543,
    database: "postgres",
    user: "postgres.yubxgftugxbwtywyhcsv",
    password: pw,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log(`✅ SUCCESS! Connected via pooler with password '${pw}'`);
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    await client.end();
    return true;
  } catch (err) {
    console.log(`❌ FAILED:`, err.message);
    return false;
  }
}

async function main() {
  for (const pw of PASSWORDS) {
    const ok = await testPassword(pw);
    if (ok) {
      console.log(`\n🎉 Connection SUCCEEDED! Password is: ${pw}`);
      console.log(`Connection URL: postgresql://postgres.yubxgftugxbwtywyhcsv:${pw}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require`);
      process.exit(0);
    }
  }
  console.log("\n❌ All passwords failed via the pooler.");
  process.exit(1);
}

main();


