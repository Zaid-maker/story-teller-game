-- Insert some sample items to get started
INSERT INTO public.items (key, name, description, icon) VALUES
('orb', 'Glowing Orb', 'A mysterious orb that hums with a faint energy.', 'Gem'),
('enchanted_flowers', 'Enchanted Flowers', 'Flowers that shimmer with an otherworldly light.', 'Flower2'),
('flowers', 'Moonpetal Flowers', 'Rare flowers that only bloom in moonlight.', 'Flower'),
('glowing_flower', 'Shrine Flower', 'A single, radiant flower found at a forgotten shrine.', 'Sparkles'),
('old_key', 'Rusted Key', 'An old key that looks like it might open a chest.', 'KeyRound')
ON CONFLICT (key) DO NOTHING;