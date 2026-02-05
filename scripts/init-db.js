import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../data/site.db');

const db = new Database(dbPath);

// Create tables
const schema = `
-- Identity & Profile
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  theme_preference TEXT DEFAULT 'coastal',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Thoughts (micro-posts)
CREATE TABLE IF NOT EXISTS thoughts (
  id INTEGER PRIMARY KEY,
  content TEXT NOT NULL,
  visibility TEXT CHECK(visibility IN ('public', 'private', 'connections')) DEFAULT 'public',
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME
);

-- Visual Archive (photos/media)
CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY,
  file_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  type TEXT CHECK(type IN ('photo', 'video', 'audio')) DEFAULT 'photo',
  metadata TEXT,
  collection_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (collection_id) REFERENCES collections(id)
);

CREATE TABLE IF NOT EXISTS collections (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  slug TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Connections (optional relationship layer)
CREATE TABLE IF NOT EXISTS connections (
  id INTEGER PRIMARY KEY,
  name TEXT,
  email TEXT,
  relationship_type TEXT,
  status TEXT CHECK(status IN ('pending', 'accepted', 'archived')) DEFAULT 'pending',
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Messages (simple async inbox)
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY,
  connection_id INTEGER,
  content TEXT NOT NULL,
  read_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (connection_id) REFERENCES connections(id)
);

-- Interactive Stories (zine-style multi-page narratives)
CREATE TABLE IF NOT EXISTS stories (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  cover_image_url TEXT,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS story_pages (
  id INTEGER PRIMARY KEY,
  story_id INTEGER NOT NULL,
  page_number INTEGER NOT NULL,
  layout_type TEXT DEFAULT 'standard',
  content TEXT,
  FOREIGN KEY (story_id) REFERENCES stories(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_thoughts_created ON thoughts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_collection ON media(collection_id);
CREATE INDEX IF NOT EXISTS idx_stories_published ON stories(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_connection ON messages(connection_id);
`;

db.exec(schema);

console.log('✅ Database initialized successfully');
console.log(`📍 Location: ${dbPath}`);

db.close();
