import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import apiApp from './api/index.js'; // Imports the handler... wait, api/index.js exports a function `handler(req, res)`
// Actually we can just run a simple http server that uses that handler.

import http from 'http';

const server = http.createServer((req, res) => {
    apiApp(req, res);
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
