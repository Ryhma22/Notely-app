-- Lisää is_favorite-sarake notes-tauluun
ALTER TABLE notes ADD COLUMN IF NOT EXISTS is_favorite boolean DEFAULT false;
