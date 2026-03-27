import { pool } from './lib/googleClient.js';

const listTables = async () => {
    try {
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
        console.log(res.rows.map(r => r.table_name));
    } catch (error) {
        console.error('Error listing tables:', error);
    } finally {
        await pool.end();
        process.exit();
    }
};

listTables();
