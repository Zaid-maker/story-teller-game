-- Insert some sample achievements to get started
INSERT INTO public.achievements (key, name, description, icon) VALUES
('GAME_START', 'The Adventure Begins', 'Start your first quest.', 'Play'),
('FOUND_ORB', 'Orb Collector', 'Acquire the mysterious glowing orb.', 'Gem'),
('HIGH_SCORE_50', 'Seasoned Adventurer', 'Achieve a score of 50 or more.', 'Star'),
('FOREST_ENDING', 'Forest Explorer', 'You survived the Whispering Woods.', 'Trees')
ON CONFLICT (key) DO NOTHING;