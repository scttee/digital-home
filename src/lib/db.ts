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

export const updateProfile = (username: string, bio: string, avatarUrl: string) => {
  return db.prepare('UPDATE profile SET username = ?, bio = ?, avatar_url = ? WHERE id = 1')
    .run(username, bio, avatarUrl);
};

// Thoughts queries
export const getThoughts = (limit = 50, visibility = 'public') => {
  return db.prepare('SELECT * FROM thoughts WHERE visibility = ? ORDER BY created_at DESC LIMIT ?')
    .all(visibility, limit);
};

export const getThoughtById = (id: number) => {
  return db.prepare('SELECT * FROM thoughts WHERE id = ?').get(id);
};

export const addThought = (content: string, visibility = 'public', tags: string | null = null) => {
  return db.prepare('INSERT INTO thoughts (content, visibility, tags) VALUES (?, ?, ?)')
    .run(content, visibility, tags);
};

export const updateThought = (id: number, content: string) => {
  return db.prepare('UPDATE thoughts SET content = ?, updated_at = datetime("now") WHERE id = ?')
    .run(content, id);
};

export const deleteThought = (id: number) => {
  return db.prepare('DELETE FROM thoughts WHERE id = ?').run(id);
};

// Media queries
export const getMediaByCollection = (collectionId: number) => {
  return db.prepare('SELECT * FROM media WHERE collection_id = ? ORDER BY created_at DESC')
    .all(collectionId);
};

export const getAllMedia = (limit = 100) => {
  return db.prepare('SELECT * FROM media ORDER BY created_at DESC LIMIT ?').all(limit);
};

export const addMedia = (fileUrl: string, caption: string, altText: string, type: string, metadata: string | null, collectionId: number) => {
  return db.prepare(
    'INSERT INTO media (file_url, caption, alt_text, type, metadata, collection_id) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(fileUrl, caption, altText, type, metadata, collectionId);
};

// Collections queries
export const getCollections = () => {
  return db.prepare('SELECT * FROM collections ORDER BY created_at DESC').all();
};

export const getCollectionBySlug = (slug: string) => {
  return db.prepare('SELECT * FROM collections WHERE slug = ?').get(slug);
};

export const createCollection = (title: string, description: string, slug: string, coverImageUrl: string) => {
  return db.prepare('INSERT INTO collections (title, description, slug, cover_image_url) VALUES (?, ?, ?, ?)')
    .run(title, description, slug, coverImageUrl);
};

// Connections queries
export const getConnections = (status = 'accepted') => {
  return db.prepare('SELECT * FROM connections WHERE status = ? ORDER BY created_at DESC')
    .all(status);
};

export const addConnection = (name: string, email: string, relationshipType: string, note: string) => {
  return db.prepare('INSERT INTO connections (name, email, relationship_type, note) VALUES (?, ?, ?, ?)')
    .run(name, email, relationshipType, note);
};

export const updateConnectionStatus = (id: number, status: string) => {
  return db.prepare('UPDATE connections SET status = ? WHERE id = ?').run(status, id);
};

// Messages queries
export const getMessages = (connectionId: number, limit = 50) => {
  return db.prepare('SELECT * FROM messages WHERE connection_id = ? ORDER BY created_at DESC LIMIT ?')
    .all(connectionId, limit);
};

export const getUnreadMessages = () => {
  return db.prepare('SELECT * FROM messages WHERE read_at IS NULL ORDER BY created_at DESC').all();
};

export const addMessage = (connectionId: number, content: string) => {
  return db.prepare('INSERT INTO messages (connection_id, content) VALUES (?, ?)')
    .run(connectionId, content);
};

export const markMessageRead = (id: number) => {
  return db.prepare('UPDATE messages SET read_at = datetime("now") WHERE id = ?').run(id);
};

// Stories queries
export const getStories = () => {
  return db.prepare('SELECT * FROM stories WHERE published_at IS NOT NULL ORDER BY published_at DESC').all();
};

export const getStoryBySlug = (slug: string) => {
  return db.prepare('SELECT * FROM stories WHERE slug = ?').get(slug);
};

export const getStoryPages = (storyId: number) => {
  return db.prepare('SELECT * FROM story_pages WHERE story_id = ? ORDER BY page_number ASC')
    .all(storyId);
};

export const createStory = (title: string, slug: string, coverImageUrl: string) => {
  return db.prepare('INSERT INTO stories (title, slug, cover_image_url) VALUES (?, ?, ?)')
    .run(title, slug, coverImageUrl);
};

export const publishStory = (id: number) => {
  return db.prepare('UPDATE stories SET published_at = datetime("now") WHERE id = ?').run(id);
};

export default db;
