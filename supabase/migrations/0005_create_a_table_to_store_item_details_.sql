-- Create a table to define all possible items in the game
CREATE TABLE public.items (
  key TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT -- For storing lucide-react icon names
);

-- Add Row Level Security for the new table
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Items are public" ON public.items FOR SELECT USING (true);