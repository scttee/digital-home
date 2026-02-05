// Static data loader for JSON-based builds (Cloudflare Pages)
import siteData from '../data/site-data.json';

// Profile queries
export const getProfile = () => {
  return siteData.profile;
};

// Thoughts queries
export const getThoughts = (limit = 50, visibility = 'public') => {
  return siteData.thoughts
    .filter(t => t.visibility === visibility)
    .slice(0, limit);
};

export const getThoughtById = (id) => {
  return siteData.thoughts.find(t => t.id === id);
};

// Media queries
export const getMediaByCollection = (collectionId) => {
  return siteData.media.filter(m => m.collection_id === collectionId);
};

export const getAllMedia = (limit = 100) => {
  return siteData.media.slice(0, limit);
};

// Collections queries
export const getCollections = () => {
  return siteData.collections;
};

export const getCollectionBySlug = (slug) => {
  return siteData.collections.find(c => c.slug === slug);
};

// Stories queries
export const getStories = () => {
  return siteData.stories;
};

export const getStoryBySlug = (slug) => {
  return siteData.stories.find(s => s.slug === slug);
};

export const getStoryPages = (storyId) => {
  return siteData.storyPages.filter(p => p.story_id === storyId);
};

// Export all for compatibility
export default {
  getProfile,
  getThoughts,
  getThoughtById,
  getMediaByCollection,
  getAllMedia,
  getCollections,
  getCollectionBySlug,
  getStories,
  getStoryBySlug,
  getStoryPages,
};
