import fs from 'fs';
import { pool } from './lib/googleClient.js';

const runSchema = async () => {
    try {
        const schema = fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf-8');
        await pool.query(schema);
        console.log('Schema created successfully');
    } catch (error) {
        console.error('Error creating schema:', error);
    } finally {
        await pool.end();
        process.exit();
    }
};

runSchema();
