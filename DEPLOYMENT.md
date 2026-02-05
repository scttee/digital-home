# Deployment Guide

## Option 1: Cloudflare Pages (Recommended)

**Pros**: Free tier, edge CDN, zero egress, integrated Workers
**Cost**: Free for most personal sites

### Steps

1. **Prepare repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-url>
   git push -u origin main
   ```

2. **Connect to Cloudflare**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com)
   - Click "Create a project"
   - Connect your GitHub account
   - Select your repository

3. **Configure build**
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output: `dist`

4. **Deploy**
   - Click "Save and Deploy"
   - Your site will be live at `<project>.pages.dev`

5. **Custom domain** (optional)
   - Add custom domain in Pages settings
   - Update DNS records as instructed

### Database Considerations

SQLite in `/data` won't persist across deployments on Cloudflare Pages. Options:

**A) Use Turso (Distributed SQLite)**
```bash
npm install @libsql/client
```

Update `src/lib/db.ts`:
```typescript
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

**B) Static generation only**
- Generate all pages at build time
- No dynamic database queries
- Content changes require rebuilds

---

## Option 2: Netlify

**Pros**: Simple setup, good DX, free tier
**Cost**: Free for hobby projects

### Steps

1. Push to GitHub (same as above)

2. Import to Netlify
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import existing project"
   - Connect GitHub repo

3. Configure
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Deploy

4. Custom domain
   - Add domain in site settings
   - Configure DNS

### Database Options

Same as Cloudflare: Use Turso or build-time generation.

---

## Option 3: Self-Hosted VPS

**Pros**: Complete control, permanent storage, cost-effective
**Cost**: €5-10/month

### Recommended Providers

- [Hetzner](https://hetzner.com) (€4.50/mo, Germany)
- [Digital Ocean](https://digitalocean.com) ($6/mo, US)
- [Linode](https://linode.com) ($5/mo, global)

### Setup with Coolify (Easiest)

[Coolify](https://coolify.io) is self-hosted Vercel/Netlify alternative.

1. **Provision VPS**
   - Ubuntu 22.04 LTS
   - 2GB RAM minimum
   - 20GB storage

2. **Install Coolify**
   ```bash
   ssh root@your-server-ip
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```

3. **Access Coolify**
   - Visit `http://your-server-ip:8000`
   - Complete setup wizard

4. **Deploy site**
   - Add GitHub repository
   - Configure build: `npm run build`
   - Output: `dist`
   - Deploy

5. **SSL Certificate**
   - Coolify handles this automatically via Let's Encrypt
   - Just point your domain to the server IP

### Manual Setup (Advanced)

If you want full control without Coolify:

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Upload to server**
   ```bash
   scp -r dist/* root@your-server:/var/www/digital-home/
   ```

3. **Install Nginx**
   ```bash
   ssh root@your-server
   apt update && apt install nginx
   ```

4. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/digital-home
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/digital-home;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

5. **Enable site**
   ```bash
   ln -s /etc/nginx/sites-available/digital-home /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```

6. **SSL with Certbot**
   ```bash
   apt install certbot python3-certbot-nginx
   certbot --nginx -d yourdomain.com
   ```

7. **Database persistence**
   - Copy `/data/site.db` to server
   - Store at `/var/www/digital-home-data/site.db`
   - Database survives deployments

### Automated Deployments

Use GitHub Actions to deploy on push:

```yaml
# .github/workflows/deploy.yml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install and build
        run: |
          npm install
          npm run build
      
      - name: Deploy to server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          source: "dist/*"
          target: "/var/www/digital-home"
```

---

## Option 4: Dokku (Self-Hosted PaaS)

[Dokku](https://dokku.com) is like Heroku but self-hosted.

1. **Install Dokku on VPS**
   ```bash
   wget https://dokku.com/install/v0.30.0/bootstrap.sh
   sudo bash bootstrap.sh
   ```

2. **Create app**
   ```bash
   dokku apps:create digital-home
   ```

3. **Deploy via Git**
   ```bash
   git remote add dokku dokku@your-server:digital-home
   git push dokku main
   ```

4. **SSL**
   ```bash
   dokku letsencrypt:enable digital-home
   ```

---

## Database Strategies

### For Static Hosts (Cloudflare/Netlify)

**Option A: Turso (Recommended)**
- Distributed SQLite
- Edge locations
- Free tier: 9GB storage, 500 locations
- [Setup guide](https://docs.turso.tech/quickstart)

**Option B: Build-time only**
- Pre-render all content
- No runtime database queries
- Simplest but least flexible

### For VPS/Self-Hosted

**Option A: Local SQLite (Easiest)**
- Keep database on server filesystem
- Backup with cron job
- Works perfectly for personal use

**Option B: Managed Database**
- [PlanetScale](https://planetscale.com) (MySQL)
- [Neon](https://neon.tech) (PostgreSQL)
- [Supabase](https://supabase.com) (PostgreSQL)

---

## Media Storage

### For Static Hosts

**Cloudflare R2**
- S3-compatible
- Zero egress fees
- 10GB free storage
- $0.015/GB after

**Self-hosted MinIO**
- Install on VPS
- S3-compatible API
- Complete ownership

### For VPS

Store in `/var/www/digital-home/public/uploads`

Serve via Nginx with caching headers.

---

## Backup Strategy

### Automated Daily Backups

```bash
#!/bin/bash
# /usr/local/bin/backup-digital-home.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
DB_PATH="/var/www/digital-home-data/site.db"

# Backup database
cp "$DB_PATH" "$BACKUP_DIR/site_$DATE.db"

# Keep only last 30 days
find "$BACKUP_DIR" -name "site_*.db" -mtime +30 -delete
```

Add to crontab:
```bash
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-digital-home.sh
```

---

## Cost Comparison

| Provider | Setup | Monthly Cost | Complexity |
|----------|-------|--------------|------------|
| **Cloudflare Pages** | 5 min | Free | Low |
| **Netlify** | 5 min | Free | Low |
| **Hetzner VPS** | 1 hour | €4.50 | Medium |
| **Coolify on VPS** | 30 min | €4.50 | Low |
| **Dokku on VPS** | 1 hour | €5 | Medium |

---

## Recommendation

**For most people**: Start with **Cloudflare Pages + Turso**
- Easiest setup
- Free
- Scales globally
- Migrate to VPS later if needed

**For complete ownership**: **Hetzner VPS + Coolify**
- Still simple
- Full control
- Cheap
- Your data, your server
