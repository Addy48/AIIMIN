-- Phase 10: Unified Life OS Calendar — Database Migration
-- Run this against your Supabase database

-- Add Life OS fields to existing calendar_events table
ALTER TABLE calendar_events
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS system_type TEXT DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS reminder_minutes INT,
  ADD COLUMN IF NOT EXISTS recurrence_rule JSONB,
  ADD COLUMN IF NOT EXISTS recurrence_parent_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Performance index for date-range queries
CREATE INDEX IF NOT EXISTS idx_cal_user_start ON calendar_events(user_id, start_time);

-- Ensure system_type has valid values
ALTER TABLE calendar_events
  DROP CONSTRAINT IF EXISTS chk_system_type;
ALTER TABLE calendar_events
  ADD CONSTRAINT chk_system_type CHECK (system_type IN ('physical','cognitive','behavior','finance','reflection','general'));
