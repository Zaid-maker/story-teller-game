CREATE OR REPLACE FUNCTION get_user_rank(p_user_id UUID)
RETURNS TABLE(rank BIGINT, score INT) AS $$
BEGIN
  RETURN QUERY
  SELECT s.rank, s.score
  FROM (
    SELECT
      user_id,
      score,
      RANK() OVER (ORDER BY score DESC) as rank
    FROM public.game_scores
  ) s
  WHERE s.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;