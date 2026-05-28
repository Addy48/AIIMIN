import { pool } from './server/lib/db.js';
async function test() {
    try {
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
        console.log("Users columns:", res.rows.map(r => r.column_name));
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
test();
