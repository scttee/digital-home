// Static data loader for photography (Cloudflare Pages)
import siteData from '../data/site-data.json';

// Trips
export const getTrips = (featuredOnly = false) => {
  if (featuredOnly) {
    return siteData.trips.filter(t => t.featured === 1);
  }
  return siteData.trips;
};

export const getTripBySlug = (slug) => {
  return siteData.trips.find(t => t.slug === slug);
};

// Trip Photos
export const getTripPhotos = (tripId) => {
  return siteData.tripPhotos.filter(tp => tp.trip_id === tripId);
};

// Trip Stats
export const getTripStats = (tripId) => {
  const photos = getTripPhotos(tripId);
  
  const cameras = {};
  photos.forEach(photo => {
    if (photo.camera) {
      cameras[photo.camera] = (cameras[photo.camera] || 0) + 1;
    }
  });
  
  const cameraList = Object.entries(cameras).map(([camera, count]) => ({
    camera,
    count
  }));
  
  return {
    photoCount: photos.length,
    cameras: cameraList
  };
};

export default {
  getTrips,
  getTripBySlug,
  getTripPhotos,
  getTripStats,
};
