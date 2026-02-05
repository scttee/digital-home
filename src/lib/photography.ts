import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/site.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// ===== TRIPS =====

export const getTrips = (featuredOnly = false) => {
  const query = featuredOnly
    ? 'SELECT * FROM trips WHERE featured = 1 ORDER BY start_date DESC'
    : 'SELECT * FROM trips ORDER BY start_date DESC';
  return db.prepare(query).all();
};

export const getTripBySlug = (slug) => {
  return db.prepare('SELECT * FROM trips WHERE slug = ?').get(slug);
};

export const createTrip = (title, slug, location, startDate, endDate, description, coverImageUrl, featured = false) => {
  return db.prepare(`
    INSERT INTO trips (title, slug, location, start_date, end_date, description, cover_image_url, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(title, slug, location, startDate, endDate, description, coverImageUrl, featured ? 1 : 0);
};

export const updateTrip = (id, data) => {
  const fields = [];
  const values = [];
  
  if (data.title) { fields.push('title = ?'); values.push(data.title); }
  if (data.location) { fields.push('location = ?'); values.push(data.location); }
  if (data.description) { fields.push('description = ?'); values.push(data.description); }
  if (data.coverImageUrl) { fields.push('cover_image_url = ?'); values.push(data.coverImageUrl); }
  if (data.featured !== undefined) { fields.push('featured = ?'); values.push(data.featured ? 1 : 0); }
  
  values.push(id);
  
  return db.prepare(`UPDATE trips SET ${fields.join(', ')} WHERE id = ?`).run(...values);
};

export const deleteTrip = (id) => {
  return db.prepare('DELETE FROM trips WHERE id = ?').run(id);
};

// ===== TRIP PHOTOS =====

export const getTripPhotos = (tripId) => {
  return db.prepare(`
    SELECT 
      m.*,
      tp.caption_override,
      tp.position,
      pm.camera,
      pm.lens,
      pm.focal_length,
      pm.aperture,
      pm.shutter_speed,
      pm.iso,
      pm.film_stock,
      pm.location_name
    FROM trip_photos tp
    JOIN media m ON tp.media_id = m.id
    LEFT JOIN photo_metadata pm ON m.id = pm.media_id
    WHERE tp.trip_id = ?
    ORDER BY tp.position ASC, m.created_at ASC
  `).all(tripId);
};

export const addPhotoToTrip = (tripId, mediaId, position = 0, captionOverride = null) => {
  return db.prepare(`
    INSERT INTO trip_photos (trip_id, media_id, position, caption_override)
    VALUES (?, ?, ?, ?)
  `).run(tripId, mediaId, position, captionOverride);
};

export const removePhotoFromTrip = (tripId, mediaId) => {
  return db.prepare('DELETE FROM trip_photos WHERE trip_id = ? AND media_id = ?').run(tripId, mediaId);
};

export const reorderTripPhotos = (tripId, photoIds) => {
  const stmt = db.prepare('UPDATE trip_photos SET position = ? WHERE trip_id = ? AND media_id = ?');
  
  photoIds.forEach((mediaId, index) => {
    stmt.run(index, tripId, mediaId);
  });
};

// ===== PHOTO METADATA =====

export const getPhotoMetadata = (mediaId) => {
  return db.prepare('SELECT * FROM photo_metadata WHERE media_id = ?').get(mediaId);
};

export const addPhotoMetadata = (mediaId, metadata) => {
  return db.prepare(`
    INSERT INTO photo_metadata (
      media_id, camera, lens, focal_length, aperture, shutter_speed, iso,
      date_taken, location_name, latitude, longitude, film_stock, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    mediaId,
    metadata.camera || null,
    metadata.lens || null,
    metadata.focalLength || null,
    metadata.aperture || null,
    metadata.shutterSpeed || null,
    metadata.iso || null,
    metadata.dateTaken || null,
    metadata.locationName || null,
    metadata.latitude || null,
    metadata.longitude || null,
    metadata.filmStock || null,
    metadata.notes || null
  );
};

export const updatePhotoMetadata = (mediaId, metadata) => {
  const fields = [];
  const values = [];
  
  Object.entries(metadata).forEach(([key, value]) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    fields.push(`${snakeKey} = ?`);
    values.push(value);
  });
  
  values.push(mediaId);
  
  return db.prepare(`
    UPDATE photo_metadata SET ${fields.join(', ')} WHERE media_id = ?
  `).run(...values);
};

// ===== STATISTICS =====

export const getTripStats = (tripId) => {
  const photoCount = db.prepare('SELECT COUNT(*) as count FROM trip_photos WHERE trip_id = ?').get(tripId);
  
  const cameras = db.prepare(`
    SELECT pm.camera, COUNT(*) as count
    FROM trip_photos tp
    JOIN photo_metadata pm ON tp.media_id = pm.media_id
    WHERE tp.trip_id = ? AND pm.camera IS NOT NULL
    GROUP BY pm.camera
    ORDER BY count DESC
  `).all(tripId);
  
  return {
    photoCount: photoCount.count,
    cameras
  };
};

export default db;
