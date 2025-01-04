-- Add timezone column to birth_charts table
ALTER TABLE birth_charts
ADD COLUMN timezone text;

-- Update existing records to use calculated timezone
UPDATE birth_charts
SET timezone = (
  CASE
    WHEN longitude < -172.5 THEN 'Etc/GMT+12'
    WHEN longitude < -157.5 THEN 'Etc/GMT+11'
    WHEN longitude < -142.5 THEN 'Etc/GMT+10'
    WHEN longitude < -127.5 THEN 'Etc/GMT+9'
    WHEN longitude < -112.5 THEN 'Etc/GMT+8'
    WHEN longitude < -97.5 THEN 'Etc/GMT+7'
    WHEN longitude < -82.5 THEN 'Etc/GMT+6'
    WHEN longitude < -67.5 THEN 'Etc/GMT+5'
    WHEN longitude < -52.5 THEN 'Etc/GMT+4'
    WHEN longitude < -37.5 THEN 'Etc/GMT+3'
    WHEN longitude < -22.5 THEN 'Etc/GMT+2'
    WHEN longitude < -7.5 THEN 'Etc/GMT+1'
    WHEN longitude < 7.5 THEN 'UTC'
    WHEN longitude < 22.5 THEN 'Etc/GMT-1'
    WHEN longitude < 37.5 THEN 'Etc/GMT-2'
    WHEN longitude < 52.5 THEN 'Etc/GMT-3'
    WHEN longitude < 67.5 THEN 'Etc/GMT-4'
    WHEN longitude < 82.5 THEN 'Etc/GMT-5'
    WHEN longitude < 97.5 THEN 'Etc/GMT-6'
    WHEN longitude < 112.5 THEN 'Etc/GMT-7'
    WHEN longitude < 127.5 THEN 'Etc/GMT-8'
    WHEN longitude < 142.5 THEN 'Etc/GMT-9'
    WHEN longitude < 157.5 THEN 'Etc/GMT-10'
    WHEN longitude < 172.5 THEN 'Etc/GMT-11'
    ELSE 'Etc/GMT-12'
  END
);

-- Add comment explaining the timezone column
COMMENT ON COLUMN birth_charts.timezone IS 'IANA timezone identifier for the birth location';
