import { serve } from '@hono/node-server';
import { honoApp } from './api/index.js';

serve({
  fetch: honoApp.fetch,
  port: 8787
}, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
})
