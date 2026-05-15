import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth.js';
import { getCachedSports, updateSportsCache } from '../services/sportsCacheService.js';

const sportsRoutes = new Hono();

// ==========================================
// SPORTS SCOREBOARD CACHE ENDPOINT
// ==========================================

sportsRoutes.get('/', requireAuth, async (c) => {
  try {
    const cachedFeed = await getCachedSports();
    return c.json(cachedFeed);
  } catch (err) {
    console.error('[SportsRoute] Error fetching sports cache:', err);
    return c.json({ error: 'Failed to retrieve cached sports scores', message: err.message }, 500);
  }
});

// Force refresh sports cache endpoint (manual trigger or testing)
sportsRoutes.post('/refresh', requireAuth, async (c) => {
  try {
    const freshFeed = await updateSportsCache();
    return c.json({ success: true, data: freshFeed });
  } catch (err) {
    console.error('[SportsRoute] Error forcing refresh of sports cache:', err);
    return c.json({ error: 'Failed to refresh sports cache', message: err.message }, 500);
  }
});

export default sportsRoutes;
