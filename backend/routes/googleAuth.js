/**
 * routes/googleAuth.js
 *
 * Consolidated Google OAuth 2.0 flow for AIIMIN.
 * Refactored for Hono / Cloudflare Workers.
 */
import { Hono } from 'hono';
import { google } from 'googleapis';
import { supabase } from '../lib/db.js';
import { supabaseAdmin } from '../supabase.js';
import { encrypt } from '../lib/crypto.js';
import { requireAuth } from '../middleware/auth.js';

const app = new Hono();

const STATE_TTL_MS = 10 * 60 * 1000;

const SCOPES = [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/youtube.readonly',
];

const createOAuthClient = () => new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL || 'https://api.aiimin.in/api/google/auth/callback'
);

app.get('/auth/google', async (c) => {
    const client = createOAuthClient();
    const state = crypto.randomUUID().replace(/-/g, '');
    const expiresAt = new Date(Date.now() + STATE_TTL_MS).toISOString();

    await supabase.from('oauth_states').upsert({ state, is_login: true, expires_at: expiresAt });

    const authUrl = client.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: SCOPES, state });
    return c.redirect(authUrl);
});

app.get('/auth/init', requireAuth, async (c) => {
    const userId = c.get('userId');
    const client = createOAuthClient();
    const state = crypto.randomUUID().replace(/-/g, '');
    const expiresAt = new Date(Date.now() + STATE_TTL_MS).toISOString();

    await supabase.from('oauth_states').upsert({ state, user_id: userId, is_login: false, expires_at: expiresAt });

    const authUrl = client.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: SCOPES, state });
    return c.redirect(authUrl);
});

app.get('/auth/callback', async (c) => {
    const { code, state, error: googleError } = c.req.query();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (googleError) {
        return c.redirect(`${frontendUrl}/auth/callback?status=error&reason=${encodeURIComponent(googleError)}`);
    }

    const { data: stateData, error: stateErr } = await supabase
        .from('oauth_states')
        .delete()
        .eq('state', state)
        .select()
        .maybeSingle();

    if (stateErr || !stateData || new Date(stateData.expires_at) < new Date()) {
        return c.redirect(`${frontendUrl}/auth/callback?status=error&reason=invalid_or_expired_state`);
    }

    try {
        const client = createOAuthClient();
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: 'v2', auth: client });
        const userInfo = await oauth2.userinfo.get();
        const email = userInfo.data.email;

        let userId = stateData.user_id;

        if (stateData.is_login) {
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email,
                email_confirm: true,
                user_metadata: { full_name: userInfo.data.name, avatar_url: userInfo.data.picture }
            });

            if (createError) {
                const { data: existing } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
                if (existing) userId = existing.id;
            } else {
                userId = newUser.user.id;
            }
        }

        if (userId) {
            const accessEnc = encrypt(tokens.access_token);
            const refreshEnc = tokens.refresh_token ? encrypt(tokens.refresh_token) : null;

            await supabase.from('user_oauth_tokens').upsert({
                user_id: userId,
                provider: 'google',
                access_token_enc: accessEnc,
                refresh_token_enc: refreshEnc,
                expiry_date: tokens.expiry_date,
                scope: tokens.scope || '',
                last_refresh_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,provider' });
        }

        if (stateData.is_login) {
            const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
                type: 'magiclink',
                email: email,
                options: { redirectTo: `${frontendUrl}/auth/callback` }
            });
            if (linkError) throw linkError;
            return c.redirect(linkData.properties.action_link);
        }

        return c.redirect(`${frontendUrl}/auth/callback?status=success`);
    } catch (err) {
        console.error('[googleAuth/callback] Error:', err);
        return c.redirect(`${frontendUrl}/auth/callback?status=error&reason=exchange_failed`);
    }
});

app.post('/auth/disconnect', requireAuth, async (c) => {
    const userId = c.get('userId');
    await supabase.from('user_oauth_tokens').delete().eq('user_id', userId).eq('provider', 'google');
    return c.json({ success: true });
});

export default app;
