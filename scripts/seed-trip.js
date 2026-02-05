import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../data/site.db');

const db = new Database(dbPath);

// Seed sample trip
const tripData = {
  title: 'Coastal NSW',
  slug: 'coastal-nsw',
  location: 'New South Wales, Australia',
  start_date: '2025-01-15',
  end_date: '2025-01-22',
  description: 'A week exploring the coastline. Early mornings, golden light, endless ocean. Shot on film and digital.',
  cover_image_url: '/images/trips/coastal-nsw-cover.jpg',
  featured: 1
};

const insertTrip = db.prepare(`
  INSERT INTO trips (title, slug, location, start_date, end_date, description, cover_image_url, featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const result = insertTrip.run(
  tripData.title,
  tripData.slug,
  tripData.location,
  tripData.start_date,
  tripData.end_date,
  tripData.description,
  tripData.cover_image_url,
  tripData.featured
);

const tripId = result.lastInsertRowid;

console.log('✅ Sample trip created');
console.log(`📍 Trip ID: ${tripId}`);
console.log(`🔗 View at: /adventures/${tripData.slug}`);

// Sample photos for the trip (placeholder URLs)
const samplePhotos = [
  {
    file_url: '/images/trips/coastal-1.jpg',
    caption: 'Dawn patrol. First light hitting the water.',
    alt_text: 'Early morning ocean waves',
    type: 'photo'
  },
  {
    file_url: '/images/trips/coastal-2.jpg',
    caption: 'Headland walk. Salt spray and wind.',
    alt_text: 'Coastal headland view',
    type: 'photo'
  },
  {
    file_url: '/images/trips/coastal-3.jpg',
    caption: 'Rock pool reflections at low tide.',
    alt_text: 'Tidal pool with reflections',
    type: 'photo'
  }
];

const insertMedia = db.prepare(`
  INSERT INTO media (file_url, caption, alt_text, type)
  VALUES (?, ?, ?, ?)
`);

const insertTripPhoto = db.prepare(`
  INSERT INTO trip_photos (trip_id, media_id, position)
  VALUES (?, ?, ?)
`);

const insertPhotoMetadata = db.prepare(`
  INSERT INTO photo_metadata (
    media_id, camera, lens, focal_length, aperture, iso, film_stock
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
`);

samplePhotos.forEach((photo, index) => {
  // Add to media table
  const mediaResult = insertMedia.run(
    photo.file_url,
    photo.caption,
    photo.alt_text,
    photo.type
  );
  
  const mediaId = mediaResult.lastInsertRowid;
  
  // Link to trip
  insertTripPhoto.run(tripId, mediaId, index);
  
  // Add sample metadata
  insertPhotoMetadata.run(
    mediaId,
    'Fujifilm X100V', // camera
    'Fixed 23mm f/2', // lens
    '35mm equiv', // focal length
    'f/4', // aperture
    '400', // iso
    null // film_stock
  );
});

console.log(`📸 Added ${samplePhotos.length} photos to trip`);
console.log('');
console.log('To add your own photos:');
console.log('1. Place images in /public/images/trips/');
console.log('2. Update file paths in this script or add via database');
console.log('3. Run: node scripts/seed-trip-photos.js');

db.close();
