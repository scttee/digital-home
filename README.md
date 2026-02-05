# Digital Home

A personal website that replaces social media platforms. Built for ownership, intentionality, and creative expression.

## Features

**Identity & Archive Module**
- Profile management
- Visual media archive with collections
- Lightbox viewing experience

**Social Feed Module**
- Micro-blogging (thoughts)
- Tag-based organization
- Chronological display

**Connection Module**
- Contact form
- Personal introduction
- Interest showcase

**Interactive Stories**
- Multi-page narratives
- Zine-style layouts
- Long-form content

## Tech Stack

- **Frontend**: Astro + Svelte + Tailwind CSS
- **Database**: SQLite (via better-sqlite3)
- **Styling**: Custom CSS with coastal aesthetic
- **Deployment**: Cloudflare Pages, Netlify, or self-hosted

## Setup

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Initialize database
npm run db:init

# Seed with sample data
npm run db:seed

# Start dev server
npm run dev
```

Visit `http://localhost:3000`

### Database Management

The database is located at `/data/site.db`

**Initialize fresh database:**
```bash
npm run db:init
```

**Add sample content:**
```bash
npm run db:seed
```

**Backup database:**
```bash
cp data/site.db data/site.backup.db
```

## Project Structure

```
/digital-home
├── /src
│   ├── /components       # Svelte interactive components
│   ├── /layouts          # Astro page layouts
│   ├── /pages            # Routes (file-based)
│   ├── /lib              # Database client & utilities
│   └── /styles           # Global CSS
├── /public               # Static assets
├── /data                 # SQLite database
├── /scripts              # Database initialization
└── /content              # Markdown stories
```

## Customization

### Colors

Edit `src/styles/global.css` to change the coastal palette:

```css
:root {
  --color-sand: #e8dcc4;
  --color-dune: #c4b5a0;
  --color-stone: #8b7e74;
  --color-ocean: #5a7d8c;
  --color-deep: #2c4a52;
  --color-offwhite: #f9f7f4;
}
```

### Typography

Replace Google Fonts imports in `global.css` with your preferred typefaces.

### Content

Edit database records directly or create a simple admin interface using the database functions in `src/lib/db.ts`.

## Deployment

### Cloudflare Pages

1. Push to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables if needed

### Netlify

1. Push to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Self-Hosted (VPS)

1. Build project: `npm run build`
2. Copy `dist/` folder to server
3. Serve with Nginx/Caddy
4. Set up SSL with Certbot

**Example Nginx config:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/digital-home/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

## Adding Content

### New Thought

```javascript
import { addThought } from './src/lib/db';

addThought(
  "Your thought content here",
  "public", // or "private"
  JSON.stringify(["tag1", "tag2"])
);
```

### New Media

```javascript
import { addMedia } from './src/lib/db';

addMedia(
  "/images/photo.jpg",
  "Photo caption",
  "Alt text description",
  "photo",
  JSON.stringify({ camera: "Film" }),
  1 // collection_id
);
```

### New Story

Stories are created in the database and can have multiple pages with different layouts.

## Design Philosophy

**Coastal Aesthetic**
- Natural color palette inspired by sand, stone, and ocean
- Soft brutalist typography with editorial restraint
- Paper grain texture overlay
- Zine-like layering and borders

**Interaction Patterns**
- Layered card hover effects
- Staggered fade-in animations
- Rotated elements for visual interest
- Smooth, editorial easing curves

**Technical Approach**
- File-based database for portability
- Progressive enhancement
- Minimal JavaScript (Svelte islands)
- Static-first with dynamic capabilities

## License

Personal use. Modify freely for your own digital home.

## Support

For issues or questions, refer to:
- [Astro Docs](https://docs.astro.build)
- [Svelte Docs](https://svelte.dev/docs)
- [SQLite Docs](https://sqlite.org/docs.html)
