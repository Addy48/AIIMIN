import pg from 'pg';
const { Pool } = pg;

const neonUrl = "postgresql://REDACTED:REDACTED@ep-REDACTED.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString: neonUrl,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    console.log('Connecting to Neon database...');
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log(`Found ${tablesRes.rows.length} tables in Neon.`);
    
    for (const row of tablesRes.rows) {
      const tableName = row.table_name;
      try {
        const countRes = await pool.query(`SELECT COUNT(*) as cnt FROM "${tableName}";`);
        const rowCount = parseInt(countRes.rows[0].cnt, 10);
        if (rowCount > 0) {
          console.log(`Table: ${tableName} -> ${rowCount} rows`);
        }
      } catch (e) {
        // Table might not exist or be accessible
      }
    }
  } catch (err) {
    console.error('Error querying Neon:', err);
  } finally {
    await pool.end();
  }
}

main();
