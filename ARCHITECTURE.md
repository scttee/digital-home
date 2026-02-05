# System Architecture

Complete technical overview of the Digital Home platform.

## Architecture Philosophy

**Principles**
- Start simple, add complexity only when needed
- Favor file-based systems over complex infrastructure
- Prioritize data ownership and portability
- Build for one user first, scale if necessary

**Core Design Decisions**
- Static-first with dynamic capabilities (Astro hybrid mode)
- SQLite for simplicity and portability
- Svelte islands for interactive UI (minimal JS)
- Modular components for maintainability

---

## Technology Stack

### Frontend Layer

**Astro** (Framework)
- Static site generation with islands architecture
- File-based routing
- Built-in optimizations (image optimization, bundling)
- Hybrid rendering (static + server)

**Svelte** (Interactive Components)
- Lightweight reactive components
- No virtual DOM overhead
- Compile-time optimization
- Used only where interactivity is needed

**Tailwind CSS** (Utility Styles)
- Rapid prototyping
- Consistent spacing/colors via design tokens
- Combined with custom CSS for brand expression

**Custom CSS** (Brand Layer)
- Coastal aesthetic variables
- Zine-inspired interactions
- Typography system
- Animation library

### Data Layer

**SQLite** (Database)
- Zero-config file-based database
- ACID compliant
- Perfect for single-user or small-scale
- Portable (single `.db` file)

**better-sqlite3** (Node Driver)
- Synchronous API (simpler than async)
- High performance
- Used in build and runtime

### Potential Upgrade Paths

**Turso** (Distributed SQLite)
- For edge deployment (Cloudflare/Netlify)
- Same SQL syntax as SQLite
- Global replication
- ~$5/mo after free tier

**libSQL** (Turso Client)
- Drop-in replacement for better-sqlite3
- HTTP/WebSocket protocol
- Edge-compatible

---

## Database Schema

### Core Tables

**profile**
```sql
id              INTEGER PRIMARY KEY
username        TEXT UNIQUE NOT NULL
bio             TEXT
avatar_url      TEXT
theme_preference TEXT
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

Single-row table for user identity.

**thoughts**
```sql
id          INTEGER PRIMARY KEY
content     TEXT NOT NULL
visibility  TEXT CHECK(visibility IN ('public', 'private', 'connections'))
tags        TEXT  -- JSON array as text
created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at  DATETIME
```

Micro-posts. Twitter/X replacement.

**media**
```sql
id              INTEGER PRIMARY KEY
file_url        TEXT NOT NULL
caption         TEXT
alt_text        TEXT
type            TEXT CHECK(type IN ('photo', 'video', 'audio'))
metadata        TEXT  -- JSON: EXIF, location, etc
collection_id   INTEGER
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
FOREIGN KEY (collection_id) REFERENCES collections(id)
```

Visual archive. Instagram replacement.

**collections**
```sql
id                  INTEGER PRIMARY KEY
title               TEXT NOT NULL
description         TEXT
cover_image_url     TEXT
slug                TEXT UNIQUE
created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
```

Grouping for media (albums, series, projects).

**connections**
```sql
id                  INTEGER PRIMARY KEY
name                TEXT
email               TEXT
relationship_type   TEXT  -- friend, professional, romantic-interest
status              TEXT CHECK(status IN ('pending', 'accepted', 'archived'))
note                TEXT
created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
```

Connection/dating layer. Optional feature.

**messages**
```sql
id              INTEGER PRIMARY KEY
connection_id   INTEGER
content         TEXT NOT NULL
read_at         DATETIME
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
FOREIGN KEY (connection_id) REFERENCES connections(id)
```

Simple async messaging system.

**stories**
```sql
id                  INTEGER PRIMARY KEY
title               TEXT NOT NULL
slug                TEXT UNIQUE
cover_image_url     TEXT
published_at        DATETIME
created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
```

Long-form narratives, multi-page essays.

**story_pages**
```sql
id              INTEGER PRIMARY KEY
story_id        INTEGER NOT NULL
page_number     INTEGER NOT NULL
layout_type     TEXT  -- full-bleed, split, text-only, gallery
content         TEXT  -- JSON with flexible structure
FOREIGN KEY (story_id) REFERENCES stories(id)
```

Pages within stories. Supports different layouts.

### Indexes

```sql
CREATE INDEX idx_thoughts_created ON thoughts(created_at DESC);
CREATE INDEX idx_media_collection ON media(collection_id);
CREATE INDEX idx_stories_published ON stories(published_at DESC);
CREATE INDEX idx_messages_connection ON messages(connection_id);
```

Optimize common queries.

---

## Component Architecture

### Layout Hierarchy

```
BaseLayout.astro
└── All pages inherit
    ├── Header (navigation)
    ├── <slot /> (page content)
    └── Footer
```

### Page Types

**Static Pages** (pre-rendered at build)
- Homepage (`/`)
- Thoughts index (`/thoughts`)
- Archive index (`/archive`)
- Stories index (`/stories`)
- Connect (`/connect`)

**Dynamic Pages** (can be static or server-rendered)
- Story detail (`/stories/[slug]`)
- Collection detail (`/archive/[slug]`)

### Interactive Components (Svelte)

**ThoughtCard.svelte**
- Displays single thought
- Hover animations
- Tag rendering
- Used in: Homepage, Thoughts page

**MediaGrid.svelte**
- Photo grid with lightbox
- Lazy loading
- Keyboard navigation
- Used in: Archive, Collections

**MessageInbox.svelte** (future)
- Message list
- Real-time updates (optional)
- Used in: Connect/Messages

### Styling Strategy

**Global Styles** (`src/styles/global.css`)
- CSS variables (colors, spacing, fonts)
- Reset/normalize
- Base typography
- Utility classes
- Animation keyframes

**Component Styles** (Scoped in `.astro` or `.svelte`)
- Layout-specific styles
- Component-specific animations
- Scoped to prevent bleeding

**Tailwind** (Utility-first)
- Rapid layout construction
- Responsive utilities
- Used sparingly, CSS preferred for brand expression

---

## Routing & Navigation

Astro file-based routing:

```
/src/pages/
├── index.astro           → /
├── thoughts.astro        → /thoughts
├── archive.astro         → /archive
├── stories.astro         → /stories
├── connect.astro         → /connect
└── stories/
    └── [slug].astro      → /stories/:slug
```

### Navigation Structure

```
Header
├── Logo (links to /)
└── Nav Links
    ├── Thoughts
    ├── Archive
    ├── Stories
    └── Connect
```

Simple, linear navigation. No dropdown menus or complexity.

---

## Data Flow

### Static Generation (Build Time)

```
Build Process
├── Read database
├── Query data for each page
├── Generate static HTML
└── Output to /dist
```

All pages can be pre-rendered with data from database at build time.

### Hybrid Mode (Runtime)

```
Request
├── Static assets served from CDN
└── Dynamic routes query database
    └── Return HTML
```

For features like real-time messaging or form submissions.

### Database Queries

All database operations abstracted in `/src/lib/db.ts`:

```typescript
// Example query
export const getThoughts = (limit = 50) => {
  return db.prepare(
    'SELECT * FROM thoughts WHERE visibility = "public" ORDER BY created_at DESC LIMIT ?'
  ).all(limit);
};
```

**Why this pattern?**
- Single source of truth for queries
- Easy to swap database later
- Type-safe with TypeScript
- Testable

---

## Asset Management

### Images

**Development**
- Store in `/public/images/`
- Reference as `/images/photo.jpg`

**Production Options**

**A) Self-hosted**
- Keep in `/public/images/`
- Serve via Nginx with caching

**B) Cloudflare R2**
- Upload to R2 bucket
- Update `file_url` in database
- Zero egress costs

**C) External CDN**
- Cloudinary, Imgix, etc
- Image transformations
- Automatic optimization

### Fonts

Currently using Google Fonts (Inter, Lora, IBM Plex Mono).

**For production:**
- Self-host fonts in `/public/fonts/`
- Update CSS to use local files
- Better privacy + performance

### Textures

Paper grain, scanned elements stored in `/public/textures/`.

Applied via CSS:
```css
background-image: url('/textures/paper-grain.png');
mix-blend-mode: multiply;
opacity: 0.05;
```

---

## Performance Strategy

### Build Optimizations

**Astro Built-ins**
- Automatic image optimization
- CSS/JS bundling and minification
- Code splitting
- Partial hydration (islands)

**Custom Optimizations**
- Lazy load images (`loading="lazy"`)
- Intersection Observer for animations
- Minimal JavaScript (Svelte only where needed)

### Runtime Performance

**Database**
- Indexed queries
- WAL mode for concurrency
- Prepared statements (cached)

**Caching**
- Static assets cached at edge (CDN)
- Database queries cached in production
- Browser caching via headers

---

## Security Considerations

### Current (Static Site)

Minimal attack surface:
- No server-side runtime
- No user authentication (yet)
- No form processing
- Just static HTML/CSS/JS

### Future (With Forms/Auth)

**Forms**
- CSRF protection
- Rate limiting
- Input validation
- Sanitize all user input

**Authentication** (if added)
- Lucia for session management
- HTTP-only cookies
- Secure password hashing (Argon2)

**Database**
- Parameterized queries (already doing)
- No raw SQL from user input
- Backup strategy

---

## Deployment Architecture

### Option 1: Static Edge (Cloudflare Pages)

```
User Request
└→ Cloudflare Edge
   └→ Cached HTML (if exists)
   └→ Origin (if cache miss)
      └→ Return static HTML
```

**Pros**: Global CDN, free tier, simple
**Cons**: Database must be external (Turso)

### Option 2: Self-Hosted (VPS)

```
User Request
└→ Domain DNS
   └→ VPS (Nginx)
      └→ Static files OR
      └→ Astro SSR (for dynamic routes)
          └→ Query local SQLite
          └→ Return HTML
```

**Pros**: Full control, local database, cheap
**Cons**: Single point of failure, manual updates

### Option 3: Hybrid (Static + Edge Functions)

```
User Request
├→ Static pages (Cloudflare CDN)
└→ Dynamic routes (Cloudflare Workers)
   └→ Query Turso (SQLite edge)
   └→ Return HTML
```

**Pros**: Best of both worlds
**Cons**: More complex, vendor dependency

---

## Future Extensions

### Potential Modules

**RSS Feed**
- Generate XML from thoughts/stories
- Subscribe via feed reader

**Webmentions**
- Receive comments from other sites
- Store in `webmentions` table

**ActivityPub**
- Federate with Mastodon/fediverse
- Complex but achievable

**Search**
- Full-text search (SQLite FTS5)
- Instant search UI (Svelte)

**Analytics**
- Privacy-friendly (Plausible, Umami)
- Self-hosted option

**Comments**
- Optional discussion system
- Could use webmentions or custom

### Database Migrations

When schema changes:

```javascript
// scripts/migrate.js
db.exec(`
  ALTER TABLE thoughts ADD COLUMN featured BOOLEAN DEFAULT 0;
`);
```

Version migrations with timestamps.

---

## Testing Strategy

### Manual Testing (Current)

- Visual regression (compare screenshots)
- Cross-browser testing
- Mobile responsive testing
- Load database with real content

### Automated Testing (Future)

**Unit Tests**
- Database functions (`/src/lib/db.ts`)
- Component logic (Svelte)

**Integration Tests**
- Page rendering
- Database queries
- Form submissions

**E2E Tests**
- Playwright or Cypress
- User flows (browse → read → connect)

---

## Monitoring & Maintenance

### Backups

**Database**
```bash
# Daily backup script
cp /var/www/digital-home-data/site.db \
   /root/backups/site_$(date +%Y%m%d).db
```

**Media**
- Sync `/public/images/` to external storage
- Cloudflare R2, S3, or local backup drive

### Monitoring

**Uptime**
- UptimeRobot (free)
- Ping endpoint every 5 minutes

**Logs**
- Nginx access/error logs
- Rotate daily (`logrotate`)

**Performance**
- Google Lighthouse (monthly)
- Core Web Vitals

### Updates

**Dependencies**
```bash
npm outdated
npm update
```

**Security**
```bash
npm audit
npm audit fix
```

Run quarterly or when vulnerabilities reported.

---

## Cost Breakdown

**Cloudflare Pages + Turso**
- Cloudflare Pages: Free
- Turso: Free (9GB, 500 locations)
- Domain: $12/year
- **Total: $1/month**

**Self-Hosted (Hetzner VPS)**
- VPS: €4.50/month
- Domain: $12/year
- **Total: €5.50/month**

**Time Investment**
- Initial setup: 2-4 hours
- Monthly maintenance: 30 minutes
- Content creation: Your time

---

## Decision Tree

**Choose Static (Cloudflare/Netlify) if:**
- Want simplest deployment
- Don't need real-time features
- Happy with external database (Turso)
- Want global CDN

**Choose Self-Hosted (VPS) if:**
- Want complete data ownership
- Need local SQLite database
- Comfortable with server management
- Want to learn infrastructure

**Choose Hybrid if:**
- Need real-time AND static
- Want edge performance
- Okay with vendor dependency
- Have complex requirements

---

## Summary

This architecture balances simplicity, ownership, and scalability.

**Start simple**: SQLite + Cloudflare Pages
**Scale when needed**: Turso or VPS
**Always own your data**: Portable database + git repo

The system is designed to grow with you, not lock you in.
