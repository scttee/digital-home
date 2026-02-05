import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../data/site.db');

const db = new Database(dbPath);

// Export all data to JSON
const data = {
  profile: db.prepare('SELECT * FROM profile WHERE id = 1').get(),
  thoughts: db.prepare('SELECT * FROM thoughts ORDER BY created_at DESC').all(),
  media: db.prepare('SELECT * FROM media ORDER BY created_at DESC').all(),
  collections: db.prepare('SELECT * FROM collections ORDER BY created_at DESC').all(),
  stories: db.prepare('SELECT * FROM stories WHERE published_at IS NOT NULL ORDER BY published_at DESC').all(),
  storyPages: db.prepare('SELECT * FROM story_pages ORDER BY story_id, page_number').all(),
  trips: db.prepare('SELECT * FROM trips ORDER BY start_date DESC').all(),
  tripPhotos: db.prepare(`
    SELECT 
      tp.*,
      m.file_url,
      m.caption,
      m.alt_text,
      m.type,
      pm.camera,
      pm.lens,
      pm.focal_length,
      pm.aperture,
      pm.shutter_speed,
      pm.iso,
      pm.film_stock,
      pm.location_name
    FROM trip_photos tp
    LEFT JOIN media m ON tp.media_id = m.id
    LEFT JOIN photo_metadata pm ON m.id = pm.media_id
    ORDER BY tp.trip_id, tp.position
  `).all(),
};

// Write to public directory so it's included in build
const outputPath = join(__dirname, '../src/data/site-data.json');
writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log('✅ Database exported to JSON');
console.log(`📍 Location: ${outputPath}`);
console.log(`📊 Exported:`);
console.log(`   - ${data.thoughts.length} thoughts`);
console.log(`   - ${data.media.length} media items`);
console.log(`   - ${data.collections.length} collections`);
console.log(`   - ${data.trips.length} trips`);
console.log(`   - ${data.stories.length} stories`);

db.close();
