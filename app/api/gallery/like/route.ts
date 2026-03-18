CREATE OR REPLACE FUNCTION increment_likes(item_id uuid)
RETURNS integer AS $$
DECLARE
  new_likes integer;
BEGIN
  UPDATE gallery_items
  SET likes = likes + 1
  WHERE id = item_id
  RETURNING likes INTO new_likes;
  RETURN new_likes;
END;
$$ LANGUAGE plpgsql;
