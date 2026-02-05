// Smart data loader - uses SQLite in dev, JSON in production builds
const isDev = import.meta.env.DEV;
const isStaticBuild = import.meta.env.PROD;

let dbModule;
let photoModule;

if (isStaticBuild) {
  // Production: use JSON data
  dbModule = await import('./db-static.ts');
  photoModule = await import('./photography-static.ts');
} else {
  // Development: use SQLite
  dbModule = await import('./db.ts');
  photoModule = await import('./photography.ts');
}

// Re-export all database functions
export const {
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
} = dbModule;

// Re-export photography functions
export const {
  getTrips,
  getTripBySlug,
  getTripPhotos,
  getTripStats,
  createTrip,
  updateTrip,
  deleteTrip,
  addPhotoToTrip,
  removePhotoFromTrip,
  reorderTripPhotos,
  getPhotoMetadata,
  addPhotoMetadata,
  updatePhotoMetadata,
} = photoModule;
