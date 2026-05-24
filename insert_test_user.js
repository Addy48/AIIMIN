import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
async function main() {
    try {
        const { rows: inserted } = await pool.query(
            `INSERT INTO users (id, email, full_name, username, onboarding_stage, role)
             VALUES ($1, $2, $3, $4, 0, 'user')
             ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email
             RETURNING role, onboarding_stage, username`,
            ['86110912-abf8-4f78-9856-04b162786da2', 'au48@aiimin.com', 'Aaditya', 'AU48']
        );
        console.log("Inserted:", inserted);
    } catch (e) {
        console.error("Error:", e.message);
    }
    process.exit(0);
}
main();
