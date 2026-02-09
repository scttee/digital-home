// Static data loader for photography (Cloudflare Pages)
import siteData from '../data/site-data.json';

interface Trip {
  id: number;
  slug: string;
  title: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  cover_image_url: string;
  featured: number;
  narrative?: string[];
  colorScheme?: {
    accent: string;
    accentSoft: string;
    text: string;
    textSoft: string;
    bg: string;
    gradientFrom: string;
    gradientTo: string;
  };
}

interface TripPhoto {
  trip_id: number;
  media_id: number;
  caption_override: string | null;
  position: number;
  camera: string | null;
  [key: string]: string | number | null | undefined;
}

const trips = siteData.trips as Trip[];
const tripPhotos = siteData.tripPhotos as TripPhoto[];

// Trips
export const getTrips = (featuredOnly = false) => {
  if (featuredOnly) {
    return trips.filter(t => t.featured === 1);
  }
  return trips;
};

export const getTripBySlug = (slug: string) => {
  return trips.find(t => t.slug === slug);
};

// Trip Photos
export const getTripPhotos = (tripId: number) => {
  return tripPhotos.filter(tp => tp.trip_id === tripId);
};

// Trip Stats
export const getTripStats = (tripId: number) => {
  const photos = getTripPhotos(tripId);

  const cameras: Record<string, number> = {};
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

// Write stubs (not available in static builds)
const staticWriteError = () => { throw new Error('Write operations are not available in static builds'); };

export const createTrip = staticWriteError as (...args: unknown[]) => never;
export const updateTrip = staticWriteError as (...args: unknown[]) => never;
export const deleteTrip = staticWriteError as (...args: unknown[]) => never;
export const addPhotoToTrip = staticWriteError as (...args: unknown[]) => never;
export const removePhotoFromTrip = staticWriteError as (...args: unknown[]) => never;
export const reorderTripPhotos = staticWriteError as (...args: unknown[]) => never;
export const getPhotoMetadata = staticWriteError as (...args: unknown[]) => never;
export const addPhotoMetadata = staticWriteError as (...args: unknown[]) => never;
export const updatePhotoMetadata = staticWriteError as (...args: unknown[]) => never;

export default {
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
};
