import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../data/site.db');

const db = new Database(dbPath);

// Seed profile
db.prepare(`
  INSERT OR REPLACE INTO profile (id, username, bio, avatar_url)
  VALUES (1, 'home', 'A personal digital space, owned and curated by me.', '/images/avatar.jpg')
`).run();

// Seed thoughts
const thoughtsData = [
  { content: 'Building a home on the web that I actually own. No algorithms, no feeds, just presence.', visibility: 'public' },
  { content: 'Noticing how light changes through the afternoon. The ocean today was mercury silver.', visibility: 'public' },
  { content: 'Sometimes the most radical thing is to simply exist outside the platforms.', visibility: 'public' },
  { content: 'Reading: Ivan Illich on convivial tools. Thinking about digital gardening vs platform farming.', visibility: 'public' },
  { content: 'Started experimenting with scan-based textures for the archive. Film grain feels right.', visibility: 'public' },
];

const insertThought = db.prepare('INSERT INTO thoughts (content, visibility) VALUES (?, ?)');
thoughtsData.forEach(t => insertThought.run(t.content, t.visibility));

// Seed collections
const collectionsData = [
  { title: 'Coastal Walks', description: 'Morning and evening explorations', slug: 'coastal-walks' },
  { title: 'Studio Work', description: 'Process and experiments', slug: 'studio-work' },
  { title: 'Archives', description: 'Scanning the past', slug: 'archives' },
];

const insertCollection = db.prepare('INSERT INTO collections (title, description, slug) VALUES (?, ?, ?)');
collectionsData.forEach(c => insertCollection.run(c.title, c.description, c.slug));

// Seed stories
db.prepare(`
  INSERT INTO stories (title, slug, published_at)
  VALUES ('On Building Digital Homes', 'digital-homes', datetime('now'))
`).run();

const storyId = db.prepare('SELECT id FROM stories WHERE slug = ?').get('digital-homes').id;

const storyPages = [
  { story_id: storyId, page_number: 1, layout_type: 'full-bleed', content: JSON.stringify({ text: 'Chapter One', image: '/images/story-1.jpg' }) },
  { story_id: storyId, page_number: 2, layout_type: 'text-only', content: JSON.stringify({ text: 'The web used to feel like building. Now it feels like renting.' }) },
  { story_id: storyId, page_number: 3, layout_type: 'split', content: JSON.stringify({ text: 'What if we owned our corners again?', image: '/images/story-3.jpg' }) },
];

const insertPage = db.prepare('INSERT INTO story_pages (story_id, page_number, layout_type, content) VALUES (?, ?, ?, ?)');
storyPages.forEach(p => insertPage.run(p.story_id, p.page_number, p.layout_type, p.content));

console.log('✅ Database seeded successfully');
console.log(`📝 Created ${thoughtsData.length} thoughts`);
console.log(`📁 Created ${collectionsData.length} collections`);
console.log(`📖 Created 1 story with ${storyPages.length} pages`);

db.close();
