-- Update scenes to grant achievements when a player enters them
UPDATE public.scenes SET grants_achievement = 'FOUND_ORB' WHERE gives = 'orb';
UPDATE public.scenes SET grants_achievement = 'FOREST_ENDING' WHERE id = 'end_forest_good';