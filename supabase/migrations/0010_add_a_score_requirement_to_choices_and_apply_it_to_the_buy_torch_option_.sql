-- Add a new column to the choices table to store score requirements
ALTER TABLE public.choices
ADD COLUMN score_required INTEGER DEFAULT 0;

-- Set a score requirement of 10 for the torch purchase
UPDATE public.choices
SET score_required = 10
WHERE scene_id = 'village_shop' AND text = 'Buy a torch (costs 10 score)';