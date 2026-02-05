import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../data/site.db');

const db = new Database(dbPath);

// Add photography-specific tables
const schema = `
-- Trips/Adventures table for photo series
CREATE TABLE IF NOT EXISTS trips (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  cover_image_url TEXT,
  featured BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced media table additions (if columns don't exist)
-- Run this separately if database already initialized

-- Trip photos junction table
CREATE TABLE IF NOT EXISTS trip_photos (
  id INTEGER PRIMARY KEY,
  trip_id INTEGER NOT NULL,
  media_id INTEGER NOT NULL,
  position INTEGER DEFAULT 0,
  caption_override TEXT,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);

-- Photography metadata table for EXIF data
CREATE TABLE IF NOT EXISTS photo_metadata (
  id INTEGER PRIMARY KEY,
  media_id INTEGER UNIQUE NOT NULL,
  camera TEXT,
  lens TEXT,
  focal_length TEXT,
  aperture TEXT,
  shutter_speed TEXT,
  iso TEXT,
  date_taken DATETIME,
  location_name TEXT,
  latitude REAL,
  longitude REAL,
  film_stock TEXT,
  notes TEXT,
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_featured ON trips(featured DESC, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_trips_date ON trips(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_trip_photos_trip ON trip_photos(trip_id, position);
CREATE INDEX IF NOT EXISTS idx_photo_metadata_media ON photo_metadata(media_id);
`;

db.exec(schema);

console.log('✅ Photography features added to database');
console.log('📸 New tables: trips, trip_photos, photo_metadata');

db.close();
