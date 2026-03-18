import fs from 'fs';
import { pool } from './lib/googleClient.js';

const setupDB = async () => {
    try {
        const schema = fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf-8');
        await pool.query(schema);
        console.log('Database tables created successfully');
    } catch (error) {
        console.error('Error creating database tables:', error);
        process.exit(1);
    } finally {
        await pool.end();
        process.exit(0);
    }
};

setupDB();
