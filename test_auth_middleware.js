import { requireAuth } from './server/middleware/auth.js';
const c = {
    req: {
        raw: { headers: new Headers() },
        header: () => undefined,
        query: () => 'valid_token'
    },
    json: (data, status) => { console.log('JSON RETURN:', status, data); return { status, data }; },
    set: (key, val) => { console.log('SET:', key, val); }
};
const next = async () => { console.log('NEXT CALLED'); };
requireAuth(c, next).catch(console.error).finally(() => process.exit(0));
