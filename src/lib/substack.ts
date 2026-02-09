import Parser from 'rss-parser';

// Update this URL to match your Substack publication
// Format: https://yourname.substack.com/feed
const SUBSTACK_FEED_URL = 'https://scttee.substack.com/feed';

export interface SubstackPost {
  title: string;
  link: string;
  date: string;
  excerpt: string;
  image: string | null;
}

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  try {
    const parser = new Parser({
      customFields: {
        item: ['content:encoded'],
      },
    });
    const feed = await parser.parseURL(SUBSTACK_FEED_URL);

    return (feed.items || []).map(item => {
      const content = (item as any)['content:encoded'] || item.content || '';
      const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
      const image = imgMatch ? imgMatch[1] : null;

      const rawExcerpt = item.contentSnippet || item.content || '';
      const excerpt = rawExcerpt.replace(/<[^>]*>/g, '').slice(0, 200);

      return {
        title: item.title || 'Untitled',
        link: item.link || '#',
        date: item.pubDate || item.isoDate || '',
        excerpt: excerpt ? excerpt + (excerpt.length >= 200 ? '...' : '') : '',
        image,
      };
    });
  } catch (e) {
    console.warn('Could not fetch Substack feed:', (e as Error).message);
    return [];
  }
}
