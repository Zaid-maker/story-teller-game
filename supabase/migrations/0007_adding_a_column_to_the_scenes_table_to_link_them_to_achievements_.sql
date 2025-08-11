-- Add a column to link a scene to an achievement it grants
ALTER TABLE public.scenes
ADD COLUMN IF NOT EXISTS grants_achievement TEXT REFERENCES public.achievements(key) ON DELETE SET NULL;