import express from 'express';
import { google } from 'googleapis';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Setup Google OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage' // Special redirect URI for frontend code exchange
);

// Middleware to mock/extract local user (since it's an MVP)
const requireAuth = (req, res, next) => {
    // In production, parse JWT from headers.
    // Assuming frontend sends ?userId=... for this MVP step.
    const userId = req.headers['x-user-id'] || req.query.userId || req.body.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: missing user id' });
    }
    req.userId = userId;
    next();
};

/**
 * Exchange Authorization Code for Refresh/Access Tokens
 */
router.post('/auth', requireAuth, async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: 'Missing authorization code' });

        const { tokens } = await oauth2Client.getToken(code);

        // Save tokens in database
        await pool.query(`
            INSERT INTO user_oauth_tokens (user_id, provider, access_token, refresh_token, expiry_date)
            VALUES ($1, 'youtube', $2, $3, $4)
            ON CONFLICT (user_id, provider) 
            DO UPDATE SET 
                access_token = EXCLUDED.access_token,
                refresh_token = COALESCE(EXCLUDED.refresh_token, user_oauth_tokens.refresh_token),
                expiry_date = EXCLUDED.expiry_date,
                updated_at = NOW()
        `, [req.userId, tokens.access_token, tokens.refresh_token, tokens.expiry_date]);

        res.json({ success: true });
    } catch (error) {
        console.error('YouTube Auth Error:', error);
        res.status(500).json({ error: 'Failed to exchange tokens' });
    }
});

/**
 * Helper to get an authenticated YouTube client for a user
 */
const getYoutubeClient = async (userId) => {
    const result = await pool.query(
        'SELECT access_token, refresh_token, expiry_date FROM user_oauth_tokens WHERE user_id = $1 AND provider = $2',
        [userId, 'youtube']
    );

    if (result.rows.length === 0) {
        throw new Error('User has not connected YouTube');
    }

    const { access_token, refresh_token, expiry_date } = result.rows[0];

    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    client.setCredentials({
        access_token,
        refresh_token,
        expiry_date: Number(expiry_date)
    });

    // Handle token refresh if expired
    if (expiry_date && Date.now() > expiry_date) {
        const { credentials } = await client.refreshAccessToken();
        await pool.query(`
            UPDATE user_oauth_tokens
            SET access_token = $1, expiry_date = $2, updated_at = NOW()
            WHERE user_id = $3 AND provider = 'youtube'
        `, [credentials.access_token, credentials.expiry_date, userId]);
    }

    return google.youtube({ version: 'v3', auth: client });
};

/**
 * Get User's Playlists
 */
router.get('/playlists', requireAuth, async (req, res) => {
    try {
        const youtube = await getYoutubeClient(req.userId);
        const response = await youtube.playlists.list({
            part: 'snippet,contentDetails',
            mine: true,
            maxResults: 50
        });

        // Map to custom friendly format
        const playlists = response.data.items.map(item => ({
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.medium?.url,
            videoCount: item.contentDetails.itemCount
        }));

        res.json(playlists);
    } catch (error) {
        console.error('Fetch Playlists Error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch playlists' });
    }
});

/**
 * Get Videos in a Playlist
 */
router.get('/playlist/:id/videos', requireAuth, async (req, res) => {
    try {
        const youtube = await getYoutubeClient(req.userId);
        const { id } = req.params;

        const response = await youtube.playlistItems.list({
            part: 'snippet,contentDetails',
            playlistId: id,
            maxResults: 50
        });

        const videos = response.data.items
            .filter(item => item.snippet.resourceId.videoId)
            .map(item => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails?.default?.url,
                channel: item.snippet.videoOwnerChannelTitle
            }));

        res.json(videos);
    } catch (error) {
        console.error('Fetch Playlist Videos Error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch videos' });
    }
});

export default router;
