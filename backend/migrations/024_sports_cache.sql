-- Create sports_cache table for server-side caching of matches and schedules
CREATE TABLE IF NOT EXISTS sports_cache (
    key VARCHAR(50) PRIMARY KEY, -- e.g. 'aggregated_feed', 'f1_standings', etc.
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on key for instant lookups
CREATE INDEX IF NOT EXISTS idx_sports_cache_key ON sports_cache(key);
