CREATE TABLE IF NOT EXISTS colleges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  location VARCHAR(120) NOT NULL,
  fees INTEGER NOT NULL,
  rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  overview TEXT NOT NULL,
  rank_band VARCHAR(20) NOT NULL,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);

CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  course_name VARCHAR(200) NOT NULL,
  duration_years INTEGER NOT NULL,
  annual_fees INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS placements (
  id SERIAL PRIMARY KEY,
  college_id INTEGER UNIQUE NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  avg_package_lpa NUMERIC(5, 2) NOT NULL,
  placement_percentage NUMERIC(5, 2) NOT NULL,
  top_recruiters TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);

CREATE INDEX IF NOT EXISTS idx_colleges_name ON colleges USING gin (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_colleges_location ON colleges (location);
CREATE INDEX IF NOT EXISTS idx_colleges_fees ON colleges (fees);
CREATE INDEX IF NOT EXISTS idx_colleges_tags ON colleges USING GIN (tags);
