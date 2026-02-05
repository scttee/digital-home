# Photography Features Guide

Complete guide to managing your photo adventures on your digital home.

## What's New

Your site now has a dedicated **Adventures** section for organizing and showcasing your photography from trips and explorations.

### New Features

✅ **Trip/Adventure Organization**
- Group photos by location or journey
- Featured trip highlighting
- Date ranges and locations
- Cover images

✅ **Photo Gallery System**
- Responsive grid layout
- Full-screen lightbox
- Keyboard navigation (arrow keys, ESC, 'i' for info)
- Mobile-friendly

✅ **Photography Metadata**
- Camera and lens info
- Exposure settings (aperture, shutter, ISO)
- Film stock (for analog photography)
- Location tags
- Custom notes

✅ **EXIF Integration Ready**
- Database structure supports full EXIF data
- Easy to extract from images and store

---

## Site Navigation

Your navigation now includes:
- Thoughts (micro-posts)
- **Adventures** ← NEW
- Archive (all media)
- Stories (long-form)
- Connect (about/contact)

---

## How It Works

### Database Structure

**Three new tables:**

1. **`trips`** — Your adventures/journeys
2. **`trip_photos`** — Links photos to trips
3. **`photo_metadata`** — Camera gear, settings, location

These integrate with your existing `media` table.

### Workflow

```
1. Create a trip (adventure)
2. Upload photos to /public/images/trips/
3. Add photos to media table
4. Link photos to trip
5. (Optional) Add EXIF metadata
6. View at /adventures/[trip-slug]
```

---

## Adding Your First Trip

### Step 1: Run the Database Migration

```bash
node scripts/add-photography.js
```

This creates the new tables.

### Step 2: Add Sample Trip

```bash
node scripts/seed-trip.js
```

This creates a sample trip with placeholder images.

### Step 3: Replace with Your Photos

Place your photos in:
```
/public/images/trips/
├── your-trip-cover.jpg
├── photo-1.jpg
├── photo-2.jpg
└── photo-3.jpg
```

---

## Managing Trips (Manual Method)

### Create a Trip

```javascript
import { createTrip } from './src/lib/photography';

createTrip(
  'Iceland Road Trip',           // title
  'iceland-road-trip',           // slug (URL-friendly)
  'Iceland',                     // location
  '2025-03-01',                 // start date
  '2025-03-10',                 // end date
  'Ten days exploring the ring road. Glaciers, waterfalls, endless light.', // description
  '/images/trips/iceland-cover.jpg', // cover image
  true                          // featured (true/false)
);
```

### Add Photos to Trip

```javascript
import { addMedia } from './src/lib/db';
import { addPhotoToTrip, addPhotoMetadata } from './src/lib/photography';

// 1. Add photo to media table
const result = addMedia(
  '/images/trips/iceland-1.jpg',  // file URL
  'Jökulsárlón at sunrise',       // caption
  'Icebergs in glacial lagoon',   // alt text
  'photo',                        // type
  null,                           // metadata (JSON)
  null                            // collection_id
);

const photoId = result.lastInsertRowid;

// 2. Link to trip (get trip ID from database first)
addPhotoToTrip(
  1,        // trip ID
  photoId,  // photo ID
  0,        // position (order in gallery)
  null      // caption override (optional)
);

// 3. Add photo metadata (optional but recommended)
addPhotoMetadata(photoId, {
  camera: 'Sony A7IV',
  lens: 'Sony 24-70mm f/2.8 GM II',
  focalLength: '35mm',
  aperture: 'f/8',
  shutterSpeed: '1/250',
  iso: '100',
  dateTaken: '2025-03-02T06:15:00',
  locationName: 'Jökulsárlón, Iceland',
  latitude: 64.0784,
  longitude: -16.2306,
  filmStock: null,  // for analog photos
  notes: 'Waited 45 minutes for perfect light'
});
```

---

## iPad-Friendly Workflow

Since you're on iPad, here's the easiest way to manage photos:

### Option 1: GitHub Web Editor

1. **Upload photos via GitHub**
   - Go to your repo on github.com
   - Navigate to `/public/images/trips/`
   - Click "Add file" → "Upload files"
   - Drag photos from iPad

2. **Edit database via script**
   - Create a `.js` file in `/scripts/` via GitHub
   - Add trip and photo data
   - Commit changes
   - Cloudflare/Netlify rebuilds automatically

### Option 2: Replit/Codespaces

1. Open project in Replit or GitHub Codespaces
2. Upload photos via file manager
3. Run scripts in terminal
4. Changes deploy automatically

### Option 3: Simple Text File Method

Create a `trips-to-add.txt` file:

```
TRIP: Iceland Road Trip
SLUG: iceland-road-trip
LOCATION: Iceland
DATES: 2025-03-01 to 2025-03-10
DESCRIPTION: Ten days exploring the ring road.
COVER: /images/trips/iceland-cover.jpg
FEATURED: yes

PHOTOS:
- /images/trips/iceland-1.jpg | Jökulsárlón at sunrise | Sony A7IV, 24-70mm @ 35mm, f/8, 1/250, ISO 100
- /images/trips/iceland-2.jpg | Seljalandsfoss waterfall | Sony A7IV, 24-70mm @ 24mm, f/11, 1/60, ISO 400
- /images/trips/iceland-3.jpg | Black sand beach | Sony A7IV, 24-70mm @ 50mm, f/5.6, 1/500, ISO 200
```

Then run a parser script (we can create this) to import.

---

## Photo Organization Tips

### Folder Structure

```
/public/images/
├── trips/
│   ├── iceland-2025/
│   │   ├── cover.jpg
│   │   ├── day1-sunrise.jpg
│   │   ├── day2-waterfall.jpg
│   │   └── ...
│   ├── coastal-nsw/
│   │   └── ...
│   └── ...
├── archive/
│   └── (general photos)
└── ...
```

### Naming Convention

Use descriptive, chronological names:
```
2025-03-01-jokulsarlon-sunrise.jpg
2025-03-02-seljalandsfoss.jpg
2025-03-03-black-sand-beach.jpg
```

### File Sizes

For web display:
- **Cover images**: 1920×1080px, 200-500KB
- **Gallery photos**: 2048px longest side, 300-800KB
- **Lightbox**: 2560px longest side, 500KB-1MB

Use online tools like TinyPNG or ImageOptim before uploading.

---

## EXIF Extraction (Optional)

To automatically extract EXIF data from your photos:

### Using ExifTool (command line)

```bash
# Install
brew install exiftool  # macOS
apt install libimage-exiftool-perl  # Linux

# Extract
exiftool -json your-photo.jpg

# Batch extract
exiftool -json -r /path/to/photos/ > exif-data.json
```

### Using Node.js (automated)

We can create a script that:
1. Reads all images in `/public/images/trips/`
2. Extracts EXIF data
3. Populates database automatically

Would you like this script created?

---

## Display Features

### Trip Index Page (`/adventures`)

Shows:
- Featured trips (large cards)
- All trips in grid
- Cover images
- Locations and dates

### Trip Detail Page (`/adventures/[slug]`)

Shows:
- Hero image with trip title
- Location and date range
- Description
- Photo count
- Camera gear used
- Full photo gallery
- Lightbox with metadata

### Lightbox Features

**Keyboard shortcuts:**
- `←` / `→` — Navigate photos
- `ESC` — Close
- `i` — Toggle metadata panel

**Metadata display:**
- Camera body
- Lens
- Focal length
- Aperture
- Shutter speed
- ISO
- Film stock (if analog)
- Location

---

## Example: Complete Workflow

Let's say you just returned from Tasmania:

### 1. Prepare Photos

```bash
# On computer before uploading
cd ~/Desktop/tasmania-trip/
# Resize and optimize
for img in *.jpg; do
  convert "$img" -resize 2048x2048\> -quality 85 "web-$img"
done
```

### 2. Upload to GitHub

- Go to repo → `/public/images/trips/`
- Create folder `tasmania-2025`
- Upload photos

### 3. Create Trip Data File

Create `/scripts/add-tasmania-trip.js`:

```javascript
import Database from 'better-sqlite3';
const db = new Database('./data/site.db');

const trip = db.prepare(`
  INSERT INTO trips (title, slug, location, start_date, end_date, description, cover_image_url, featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'Wild Tasmania',
  'wild-tasmania',
  'Tasmania, Australia',
  '2025-02-10',
  '2025-02-17',
  'A week in the wilderness. Cradle Mountain, Wineglass Bay, and everything between.',
  '/images/trips/tasmania-2025/cover.jpg',
  1
);

console.log('Trip created:', trip.lastInsertRowid);
db.close();
```

### 4. Commit and Push

```bash
git add .
git commit -m "Add Tasmania trip"
git push
```

### 5. Auto-Deploy

Cloudflare/Netlify sees the push and rebuilds your site.

### 6. View Live

Visit `yourdomain.com/adventures/wild-tasmania`

---

## Future Enhancements

Want to add:
- **Map integration** — Show trip route on map
- **Weather data** — Conditions during shoot
- **Export to Instagram** — Auto-format for social
- **Photo comparison** — Before/after or film/digital
- **Print shop** — Sell prints directly
- **RSS feed** — Subscribe to new adventures

---

## Quick Reference

### New Routes

- `/adventures` — All trips
- `/adventures/[slug]` — Individual trip

### New Components

- `PhotoGallery.svelte` — Gallery with lightbox

### New Database Functions

```javascript
// Trips
getTrips()
getTripBySlug(slug)
createTrip(...)
updateTrip(id, data)
deleteTrip(id)

// Photos
getTripPhotos(tripId)
addPhotoToTrip(tripId, mediaId, position, caption)
removePhotoFromTrip(tripId, mediaId)
reorderTripPhotos(tripId, photoIds)

// Metadata
getPhotoMetadata(mediaId)
addPhotoMetadata(mediaId, metadata)
updatePhotoMetadata(mediaId, metadata)

// Stats
getTripStats(tripId)
```

### Scripts

- `scripts/add-photography.js` — Create tables
- `scripts/seed-trip.js` — Sample trip data

---

## Support

**Need help?**
- Check `/ARCHITECTURE.md` for technical details
- See `/DEPLOYMENT.md` for hosting
- Database schema in `/scripts/add-photography.js`

**Want automated tools?**
- EXIF extraction script
- Batch photo uploader
- Trip import from JSON
- Instagram export formatter

Let me know what would help your workflow most.

---

Your photography now has a proper home. Document your adventures with intention.
