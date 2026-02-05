# Cloudflare Pages Deployment (Fixed)

## The Fix

Changed from `hybrid` mode to `static` mode and created a JSON-based data system that works on Cloudflare Pages.

## How It Works Now

**Development** (your computer):
- Uses SQLite database directly
- Full read/write capabilities
- All database functions work

**Production** (Cloudflare Pages):
- Exports database to JSON during build
- Static site with all data pre-rendered
- Fast, free, works perfectly

## Quick Deploy Steps

### 1. Prepare Database Locally

```bash
# Initialize and seed database
npm run db:init
npm run db:seed

# Add your photography
node scripts/add-photography.js
node scripts/seed-trip.js

# Export to JSON (happens automatically on build, but you can test)
npm run export-data
```

This creates `src/data/site-data.json` with all your content.

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit with data"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/digital-home.git
git push -u origin main
```

### 3. Deploy to Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Click "Create a project"
3. Connect GitHub account
4. Select `digital-home` repository
5. Configure:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click "Save and Deploy"

### 4. Done!

Your site will be live at `https://your-project.pages.dev`

## Adding New Content

### Option 1: Local Computer

```bash
# 1. Add content to database locally
node scripts/add-my-content.js

# 2. Export to JSON
npm run export-data

# 3. Commit and push
git add src/data/site-data.json
git commit -m "Add new content"
git push

# 4. Cloudflare auto-rebuilds (2-3 minutes)
```

### Option 2: Edit JSON Directly (iPad-Friendly!)

Since your data is now in a JSON file, you can edit it directly on iPad via GitHub:

1. Go to your repo on github.com
2. Navigate to `src/data/site-data.json`
3. Click "Edit" (pencil icon)
4. Add your content:

```json
{
  "thoughts": [
    {
      "id": 1,
      "content": "Your new thought here",
      "visibility": "public",
      "tags": "[\"tag1\", \"tag2\"]",
      "created_at": "2025-02-05T12:00:00.000Z"
    }
  ],
  "trips": [
    {
      "id": 1,
      "title": "Your Trip",
      "slug": "your-trip",
      "location": "Location",
      "start_date": "2025-02-01",
      "description": "Description here",
      "cover_image_url": "/images/trips/cover.jpg",
      "featured": 1
    }
  ]
}
```

5. Commit changes
6. Cloudflare rebuilds automatically

## Adding Photos (iPad Method)

### Step 1: Upload Images

1. Go to your GitHub repo
2. Navigate to `/public/images/trips/`
3. Click "Add file" → "Upload files"
4. Upload your photos
5. Commit

### Step 2: Add Trip Data

1. Edit `src/data/site-data.json`
2. Add trip entry
3. Add photo entries in `tripPhotos` array

Example:

```json
{
  "trips": [
    {
      "id": 1,
      "title": "Coastal Walk",
      "slug": "coastal-walk",
      "location": "NSW Coast",
      "start_date": "2025-02-05",
      "cover_image_url": "/images/trips/coastal/cover.jpg",
      "featured": 1
    }
  ],
  "tripPhotos": [
    {
      "trip_id": 1,
      "file_url": "/images/trips/coastal/photo1.jpg",
      "caption": "Morning light on the water",
      "camera": "Fujifilm X100V",
      "lens": "23mm f/2",
      "aperture": "f/4",
      "iso": "400"
    }
  ]
}
```

3. Commit → Auto-deploys

## Development vs Production

### Development (Local)

```bash
npm run dev
```

- Uses SQLite database
- Fast iteration
- Full database features

### Build (Production)

```bash
npm run build
```

- Runs `export-to-json.js` first
- Converts SQLite → JSON
- Builds static site

## Folder Structure

```
digital-home/
├── data/
│   └── site.db              ← SQLite (development only)
├── src/
│   ├── data/
│   │   └── site-data.json   ← JSON export (for production)
│   ├── lib/
│   │   ├── db.ts            ← SQLite loader (dev)
│   │   ├── db-static.ts     ← JSON loader (production)
│   │   ├── photography.ts   ← SQLite (dev)
│   │   └── photography-static.ts ← JSON (production)
│   └── pages/               ← Now use -static loaders
└── scripts/
    └── export-to-json.js    ← Runs before build
```

## Custom Domain

1. In Cloudflare Pages dashboard
2. Go to Custom domains
3. Click "Set up a custom domain"
4. Enter your domain (e.g., `yourdomain.com`)
5. Follow DNS instructions
6. SSL certificate auto-generated

## Troubleshooting

**Build fails with "cannot find module site-data.json"**
- Run `npm run export-data` locally first
- Commit the generated `src/data/site-data.json`
- Push to GitHub

**Empty site after deploy**
- Check `src/data/site-data.json` has content
- Run `npm run db:seed` locally
- Run `npm run export-data`
- Commit and push

**Photos not showing**
- Ensure photos are in `/public/images/`
- Paths in JSON match actual file locations
- Case-sensitive (use lowercase)

## Benefits of This Approach

✅ **Free hosting** — Cloudflare Pages free tier
✅ **Fast** — Static site, edge cached
✅ **iPad-friendly** — Edit JSON on GitHub
✅ **Portable** — Own your data
✅ **Simple** — No server to manage
✅ **Scalable** — Can handle traffic spikes

## When You Grow

If you want dynamic features later (forms, comments, real-time):
- Add Cloudflare Workers (serverless functions)
- Use Turso (edge SQLite database)
- Keep same codebase, just change loaders

But for now, this static approach is perfect.

## Cost

- Cloudflare Pages: **Free**
- Custom domain: **$12/year**
- Total: **$1/month**

---

Your site is now ready to deploy! The build error is fixed.
