/**
 * routes/youtube.js
 *
 * YouTube integration — read-only playlist access.
 * Uses shared googleClient for token management.
 */
import express from 'express';
import { getYouTubeClient, getIntegrationStatus } from '../lib/googleClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /youtube/status
 * Integration health — no token values exposed.
 */
router.get('/status', requireAuth, async (req, res) => {
    try {
        const status = await getIntegrationStatus(req.userId, 'google');
        const hasYoutubeScope = status.scopes?.some(s => s.includes('youtube'));
        res.json({
            connected: status.connected && hasYoutubeScope,
            error: status.error,
            lastRefresh: status.lastRefresh,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /youtube/playlists
 * Returns user's YouTube playlists (titles + thumbnails).
 * Watch history and viewing data are never accessed.
 */
router.get('/playlists', requireAuth, async (req, res) => {
    try {
        const youtube = await getYouTubeClient(req.userId);
        const response = await youtube.playlists.list({
            part: 'snippet,contentDetails',
            mine: true,
            maxResults: 50,
        });

        const playlists = (response.data.items || []).map(item => ({
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.medium?.url,
            videoCount: item.contentDetails.itemCount,
        }));

        res.json(playlists);
    } catch (err) {
        const code = err.code || 'UNKNOWN';
        const status = code === 'NOT_CONNECTED' ? 400 : 500;
        res.status(status).json({ error: err.message, code });
    }
});

/**
 * GET /youtube/playlist/:id/videos
 * Returns videos in a specific playlist.
 */
router.get('/playlist/:id/videos', requireAuth, async (req, res) => {
    try {
        const youtube = await getYouTubeClient(req.userId);
        const response = await youtube.playlistItems.list({
            part: 'snippet,contentDetails',
            playlistId: req.params.id,
            maxResults: 50,
        });

        const videos = (response.data.items || [])
            .filter(item => item.snippet?.resourceId?.videoId)
            .map(item => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails?.default?.url,
                channel: item.snippet.videoOwnerChannelTitle,
            }));

        res.json(videos);
    } catch (err) {
        const code = err.code || 'UNKNOWN';
        const status = code === 'NOT_CONNECTED' ? 400 : 500;
        res.status(status).json({ error: err.message, code });
    }
});

export default router;
