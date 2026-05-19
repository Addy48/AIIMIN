import { updateSportsCache } from '../services/sportsCacheService.js';

/**
 * Scheduled Lambda Handler for SST Cron Task.
 * Refreshes the Neon PostgreSQL cache for ESPN, CricAPI, and Jolpi sports feeds.
 */
export const handler = async (event) => {
  console.log('[Cron] Scheduled sports fetcher job started at:', new Date().toISOString());
  try {
    const data = await updateSportsCache();
    console.log('[Cron] Sports cache successfully refreshed.');
    return { 
      status: 'success',
      timestamp: new Date().toISOString(),
      keys: Object.keys(data)
    };
  } catch (err) {
    console.error('[Cron] Sports fetcher job execution failed:', err);
    return {
      status: 'error',
      message: err.message
    };
  }
};
