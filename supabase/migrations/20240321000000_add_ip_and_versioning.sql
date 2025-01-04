-- Add IP address tracking for birth charts
ALTER TABLE birth_charts
ADD COLUMN IF NOT EXISTS ip_address text,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Add versioning for interpretations
ALTER TABLE interpretations
ADD COLUMN IF NOT EXISTS version integer DEFAULT 1 NOT NULL,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
ADD COLUMN IF NOT EXISTS previous_version_id uuid REFERENCES interpretations(id);

-- Add unique constraint to prevent duplicate charts
ALTER TABLE birth_charts
ADD CONSTRAINT unique_birth_chart 
UNIQUE (user_id, birth_date, birth_time, birth_place, latitude, longitude)
WHERE user_id IS NOT NULL;

-- Add unique constraint for anonymous users based on IP
ALTER TABLE birth_charts
ADD CONSTRAINT unique_anonymous_birth_chart
UNIQUE (ip_address, birth_date, birth_time, birth_place, latitude, longitude)
WHERE user_id IS NULL;

-- Add index for faster duplicate detection
CREATE INDEX IF NOT EXISTS idx_birth_charts_duplicate_check
ON birth_charts (birth_date, birth_time, birth_place, latitude, longitude)
WHERE user_id IS NULL;

-- Add function to cleanup failed/incomplete saves older than 24 hours
CREATE OR REPLACE FUNCTION cleanup_incomplete_saves() RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete incomplete birth charts older than 24 hours
  DELETE FROM birth_charts
  WHERE created_at < NOW() - INTERVAL '24 hours'
  AND (
    sun_sign IS NULL OR
    moon_sign IS NULL OR
    ascendant_sign IS NULL
  );
  
  -- Delete orphaned interpretations
  DELETE FROM interpretations i
  WHERE NOT EXISTS (
    SELECT 1 FROM birth_charts b
    WHERE b.id = i.birth_chart_id
  );
END;
$$;

-- Create a scheduled job to run cleanup daily
SELECT cron.schedule(
  'cleanup-incomplete-saves',
  '0 0 * * *', -- Run at midnight every day
  'SELECT cleanup_incomplete_saves()'
);
