-- Add new items for the cave quest
INSERT INTO public.items (key, name, description, icon)
VALUES
  ('torch', 'Torch', 'Lights up dark and spooky places.', 'Flame'),
  ('glowing_crystal', 'Glowing Crystal', 'A mysterious crystal that hums with energy.', 'Gem')
ON CONFLICT (key) DO NOTHING;

-- Add new achievement for the cave quest
INSERT INTO public.achievements (key, name, description, icon)
VALUES
  ('CAVE_EXPLORER', 'Cave Explorer', 'You braved the depths of the mysterious cave.', 'Mountain')
ON CONFLICT (key) DO NOTHING;

-- Add new scenes, ensuring all referenced scenes exist
INSERT INTO public.scenes (id, text, score, gives, grants_achievement)
VALUES
  -- Ensure village_square exists before we try to add choices to it
  ('village_square', 'The square is lively, with villagers going about their day. A path leads towards a dark forest, and a shop is nearby.', 0, NULL, NULL),
  ('village_shop', 'You enter a dusty shop. An old merchant eyes you from behind the counter. A torch for sale hangs on the wall.', 0, NULL, NULL),
  ('cave_entrance', 'You stand at the mouth of a dark, foreboding cave. A chill wind emanates from within, carrying faint whispers. It is too dark to see without a light source.', 0, NULL, NULL),
  ('cave_tunnel', 'With your torch held high, you venture into the cave. The tunnel is narrow and damp. It splits into two paths ahead.', 5, NULL, NULL),
  ('cave_chamber_bats', 'You take the left path and stumble into a large chamber. Suddenly, a swarm of bats descends from the ceiling, their screeches echoing loudly! You scramble back the way you came in a panic.', -10, NULL, NULL),
  ('cave_treasure_open', 'You take the right path and it opens into a small, quiet chamber. In the center, a single treasure chest sits on a pedestal. You open it to find a large, glowing crystal!', 50, 'glowing_crystal', 'CAVE_EXPLORER'),
  ('buy_torch', 'You purchase a sturdy torch. This should be useful.', -10, 'torch', NULL)
ON CONFLICT (id) DO NOTHING;

-- Add a unique constraint to prevent duplicate choices, if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'choices_scene_id_text_key' AND conrelid = 'public.choices'::regclass
  ) THEN
    ALTER TABLE public.choices ADD CONSTRAINT choices_scene_id_text_key UNIQUE (scene_id, text);
  END IF;
END;
$$;

-- Add new choices for the cave quest, letting the database generate the ID
INSERT INTO public.choices (scene_id, next_scene_id, text, requires)
VALUES
  -- Connect the existing 'start' scene to the new content
  ('start', 'village_square', 'Go to the village square.', NULL),
  -- Choices from the village square
  ('village_square', 'village_shop', 'Visit the village shop.', NULL),
  ('village_square', 'cave_entrance', 'Explore the mysterious cave at the edge of the forest.', NULL),
  ('village_square', 'start', 'Return to the main entrance.', NULL), -- A way back
  -- Choices for the shop
  ('village_shop', 'buy_torch', 'Buy a torch (costs 10 score)', NULL),
  ('village_shop', 'village_square', 'Leave the shop.', NULL),
  ('buy_torch', 'village_square', 'Return to the village square.', NULL),
  -- Choices for the cave
  ('cave_entrance', 'cave_tunnel', 'Enter the cave with your torch.', 'torch'),
  ('cave_entrance', 'village_square', 'Turn back to the village square.', NULL),
  ('cave_tunnel', 'cave_chamber_bats', 'Take the left path.', NULL),
  ('cave_tunnel', 'cave_treasure_open', 'Take the right path.', NULL),
  ('cave_chamber_bats', 'cave_entrance', 'Flee back to the entrance!', NULL),
  ('cave_treasure_open', 'village_square', 'Take the crystal and return to the village.', NULL)
ON CONFLICT (scene_id, text) DO NOTHING;