// Static data loader for JSON-based builds (Cloudflare Pages)
import siteData from '../data/site-data.json';

interface Thought {
  id: number;
  content: string;
  visibility: string;
  tags: string | null;
  created_at: string;
  updated_at: string | null;
}

interface Media {
  id: number;
  file_url: string;
  caption: string;
  alt_text: string;
  type: string;
  metadata: string | null;
  collection_id: number;
  created_at: string;
}

interface Collection {
  id: number;
  title: string;
  description: string;
  slug: string;
  cover_image_url: string;
  created_at: string;
}

interface Story {
  id: number;
  title: string;
  slug: string;
  cover_image_url: string;
  published_at: string | null;
}

interface StoryPage {
  id: number;
  story_id: number;
  page_number: number;
  content: string;
  layout: string;
}

const thoughts = siteData.thoughts as Thought[];
const media = siteData.media as Media[];
const collections = siteData.collections as Collection[];
const stories = siteData.stories as Story[];
const storyPages = siteData.storyPages as StoryPage[];

// Profile queries
export const getProfile = () => {
  return siteData.profile;
};

// Thoughts queries
export const getThoughts = (limit = 50, visibility = 'public') => {
  return thoughts
    .filter(t => t.visibility === visibility)
    .slice(0, limit);
};

export const getThoughtById = (id: number) => {
  return thoughts.find(t => t.id === id);
};

// Media queries
export const getMediaByCollection = (collectionId: number) => {
  return media.filter(m => m.collection_id === collectionId);
};

export const getAllMedia = (limit = 100) => {
  return media.slice(0, limit);
};

// Collections queries
export const getCollections = () => {
  return collections;
};

export const getCollectionBySlug = (slug: string) => {
  return collections.find(c => c.slug === slug);
};

// Stories queries
export const getStories = () => {
  return stories;
};

export const getStoryBySlug = (slug: string) => {
  return stories.find(s => s.slug === slug);
};

export const getStoryPages = (storyId: number) => {
  return storyPages.filter(p => p.story_id === storyId);
};

// Write stubs (not available in static builds)
const staticWriteError = () => { throw new Error('Write operations are not available in static builds'); };

export const updateProfile = staticWriteError as (...args: unknown[]) => never;
export const addThought = staticWriteError as (...args: unknown[]) => never;
export const updateThought = staticWriteError as (...args: unknown[]) => never;
export const deleteThought = staticWriteError as (...args: unknown[]) => never;
export const addMedia = staticWriteError as (...args: unknown[]) => never;
export const createCollection = staticWriteError as (...args: unknown[]) => never;
export const addConnection = staticWriteError as (...args: unknown[]) => never;
export const updateConnectionStatus = staticWriteError as (...args: unknown[]) => never;
export const getConnections = staticWriteError as (...args: unknown[]) => never;
export const getMessages = staticWriteError as (...args: unknown[]) => never;
export const getUnreadMessages = staticWriteError as (...args: unknown[]) => never;
export const addMessage = staticWriteError as (...args: unknown[]) => never;
export const markMessageRead = staticWriteError as (...args: unknown[]) => never;
export const createStory = staticWriteError as (...args: unknown[]) => never;
export const publishStory = staticWriteError as (...args: unknown[]) => never;

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
  updateProfile,
  addThought,
  updateThought,
  deleteThought,
  addMedia,
  createCollection,
  addConnection,
  updateConnectionStatus,
  getConnections,
  getMessages,
  getUnreadMessages,
  addMessage,
  markMessageRead,
  createStory,
  publishStory,
};
