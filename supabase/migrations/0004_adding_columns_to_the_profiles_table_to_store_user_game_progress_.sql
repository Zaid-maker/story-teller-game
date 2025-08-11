-- Add columns to the profiles table to store game state
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS current_scene_id TEXT DEFAULT 'start',
ADD COLUMN IF NOT EXISTS current_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_inventory JSONB DEFAULT '[]'::jsonb;