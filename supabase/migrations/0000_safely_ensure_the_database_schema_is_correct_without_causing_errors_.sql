-- Add a column to store the ending scene ID for each score, if it doesn't already exist.
ALTER TABLE public.game_scores
ADD COLUMN IF NOT EXISTS ending_scene_id TEXT;

-- Check if the foreign key constraint exists before adding it, to prevent errors.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_constraint
    WHERE  conname = 'fk_ending_scene'
    AND    conrelid = 'public.game_scores'::regclass
  ) THEN
    ALTER TABLE public.game_scores
    ADD CONSTRAINT fk_ending_scene
    FOREIGN KEY (ending_scene_id) REFERENCES public.scenes(id) ON DELETE SET NULL;
  END IF;
END;
$$;