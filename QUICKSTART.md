# Quick Start Guide

Get your digital home running in 5 minutes.

## Step 1: Install Dependencies

```bash
cd digital-home
npm install
```

This installs Astro, Svelte, Tailwind, SQLite, and all dependencies.

## Step 2: Initialize Database

```bash
npm run db:init
```

Creates the SQLite database with all required tables.

## Step 3: Add Sample Content

```bash
npm run db:seed
```

Populates the database with example thoughts, collections, and a story.

## Step 4: Start Development Server

```bash
npm run dev
```

Your site is now running at `http://localhost:3000`

## What You'll See

- **Homepage** (`/`): Recent thoughts feed
- **Thoughts** (`/thoughts`): All micro-posts
- **Archive** (`/archive`): Photo collections (empty until you add media)
- **Stories** (`/stories`): Long-form narratives
- **Connect** (`/connect`): Contact and about page

## Next Steps

### Customize Your Profile

Edit the database directly or use this script:

```javascript
// scripts/update-profile.js
import { updateProfile } from '../src/lib/db';

updateProfile(
  'your-username',
  'Your bio goes here',
  '/images/your-avatar.jpg'
);
```

### Add Your First Thought

```javascript
// scripts/add-thought.js
import { addThought } from '../src/lib/db';

addThought(
  "Building my digital home. Day one.",
  "public"
);
```

### Customize Colors

Edit `src/styles/global.css`:

```css
:root {
  --color-sand: #your-color;
  --color-ocean: #your-color;
  /* etc */
}
```

### Add Media

1. Place images in `public/images/`
2. Add to database:

```javascript
import { addMedia } from '../src/lib/db';

addMedia(
  '/images/photo.jpg',
  'Photo caption',
  'Alt text',
  'photo',
  null,
  null // or collection_id
);
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npm run db:init          # Initialize database
npm run db:seed          # Add sample data
```

## Troubleshooting

**"Module not found" errors**
```bash
rm -rf node_modules
npm install
```

**Database errors**
```bash
rm -rf data/site.db
npm run db:init
npm run db:seed
```

**Port already in use**
```bash
# Edit astro.config.mjs
server: { port: 4000 }
```

## File Structure Overview

```
/digital-home
├── src/
│   ├── components/      # Svelte components
│   ├── layouts/         # Page templates
│   ├── pages/           # Routes (becomes URLs)
│   ├── lib/             # Database client
│   └── styles/          # CSS
├── public/              # Static files (images, fonts)
├── data/                # SQLite database
└── scripts/             # Utility scripts
```

## Making It Yours

1. **Update colors** in `src/styles/global.css`
2. **Change fonts** in Google Fonts import
3. **Edit navigation** in `src/layouts/BaseLayout.astro`
4. **Customize components** in `src/components/`
5. **Add your content** via database scripts

## Ready to Deploy?

See `DEPLOYMENT.md` for full deployment guides to:
- Cloudflare Pages (free, 5 min setup)
- Netlify (free, simple)
- Self-hosted VPS (€5/mo, full control)

## Need Help?

Check `README.md` for detailed documentation on:
- Database structure
- Component usage
- Deployment options
- Customization guides
