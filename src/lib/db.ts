import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/site.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Profile queries
export const getProfile = () => {
  return db.prepare('SELECT * FROM profile WHERE id = 1').get();
};

export const updateProfile = (username, bio, avatarUrl) => {
  return db.prepare('UPDATE profile SET username = ?, bio = ?, avatar_url = ? WHERE id = 1')
    .run(username, bio, avatarUrl);
};

// Thoughts queries
export const getThoughts = (limit = 50, visibility = 'public') => {
  return db.prepare('SELECT * FROM thoughts WHERE visibility = ? ORDER BY created_at DESC LIMIT ?')
    .all(visibility, limit);
};

export const getThoughtById = (id) => {
  return db.prepare('SELECT * FROM thoughts WHERE id = ?').get(id);
};

export const addThought = (content, visibility = 'public', tags = null) => {
  return db.prepare('INSERT INTO thoughts (content, visibility, tags) VALUES (?, ?, ?)')
    .run(content, visibility, tags);
};

export const updateThought = (id, content) => {
  return db.prepare('UPDATE thoughts SET content = ?, updated_at = datetime("now") WHERE id = ?')
    .run(content, id);
};

export const deleteThought = (id) => {
  return db.prepare('DELETE FROM thoughts WHERE id = ?').run(id);
};

// Media queries
export const getMediaByCollection = (collectionId) => {
  return db.prepare('SELECT * FROM media WHERE collection_id = ? ORDER BY created_at DESC')
    .all(collectionId);
};

export const getAllMedia = (limit = 100) => {
  return db.prepare('SELECT * FROM media ORDER BY created_at DESC LIMIT ?').all(limit);
};

export const addMedia = (fileUrl, caption, altText, type, metadata, collectionId) => {
  return db.prepare(
    'INSERT INTO media (file_url, caption, alt_text, type, metadata, collection_id) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(fileUrl, caption, altText, type, metadata, collectionId);
};

// Collections queries
export const getCollections = () => {
  return db.prepare('SELECT * FROM collections ORDER BY created_at DESC').all();
};

export const getCollectionBySlug = (slug) => {
  return db.prepare('SELECT * FROM collections WHERE slug = ?').get(slug);
};

export const createCollection = (title, description, slug, coverImageUrl) => {
  return db.prepare('INSERT INTO collections (title, description, slug, cover_image_url) VALUES (?, ?, ?, ?)')
    .run(title, description, slug, coverImageUrl);
};

// Connections queries
export const getConnections = (status = 'accepted') => {
  return db.prepare('SELECT * FROM connections WHERE status = ? ORDER BY created_at DESC')
    .all(status);
};

export const addConnection = (name, email, relationshipType, note) => {
  return db.prepare('INSERT INTO connections (name, email, relationship_type, note) VALUES (?, ?, ?, ?)')
    .run(name, email, relationshipType, note);
};

export const updateConnectionStatus = (id, status) => {
  return db.prepare('UPDATE connections SET status = ? WHERE id = ?').run(status, id);
};

// Messages queries
export const getMessages = (connectionId, limit = 50) => {
  return db.prepare('SELECT * FROM messages WHERE connection_id = ? ORDER BY created_at DESC LIMIT ?')
    .all(connectionId, limit);
};

export const getUnreadMessages = () => {
  return db.prepare('SELECT * FROM messages WHERE read_at IS NULL ORDER BY created_at DESC').all();
};

export const addMessage = (connectionId, content) => {
  return db.prepare('INSERT INTO messages (connection_id, content) VALUES (?, ?)')
    .run(connectionId, content);
};

export const markMessageRead = (id) => {
  return db.prepare('UPDATE messages SET read_at = datetime("now") WHERE id = ?').run(id);
};

// Stories queries
export const getStories = () => {
  return db.prepare('SELECT * FROM stories WHERE published_at IS NOT NULL ORDER BY published_at DESC').all();
};

export const getStoryBySlug = (slug) => {
  return db.prepare('SELECT * FROM stories WHERE slug = ?').get(slug);
};

export const getStoryPages = (storyId) => {
  return db.prepare('SELECT * FROM story_pages WHERE story_id = ? ORDER BY page_number ASC')
    .all(storyId);
};

export const createStory = (title, slug, coverImageUrl) => {
  return db.prepare('INSERT INTO stories (title, slug, cover_image_url) VALUES (?, ?, ?)')
    .run(title, slug, coverImageUrl);
};

export const publishStory = (id) => {
  return db.prepare('UPDATE stories SET published_at = datetime("now") WHERE id = ?').run(id);
};

export default db;
