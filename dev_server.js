import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });

import apiApp from './api/index.js';
import http from 'http';

const server = http.createServer((req, res) => {
    apiApp(req, res);
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});

