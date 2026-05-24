import * as dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

async function test() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // We can't do GRANT BYPASSRLS using supabase-js client directly (no raw sql)
  // Let's connect using the postgres connection string if we have it? No, we don't.
  // Wait, does dashboard_app have bypass rls? Let's check roles.
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const { rows } = await pool.query("SELECT rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin, rolreplication, rolbypassrls FROM pg_roles WHERE rolname = 'dashboard_app'");
    console.log("Role info:", rows);
  } catch (e) {
    console.log("Pool error:", e);
  }
}
test();
