/**
 * TMDB Image URL Construction & Normalization Utilities
 * Based on official TMDB documentation: https://developer.themoviedb.org/docs/image-basics
 */

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';

/**
 * Builds a validated, correctly sized TMDB poster URL.
 * Handles both relative paths (e.g. "/abc.jpg") and existing absolute URLs without duplicate prefixes.
 */
export function getTmdbPosterUrl(path?: string | null, size: PosterSize = 'w500'): string | null {
  if (!path || typeof path !== 'string' || !path.trim()) {
    return null;
  }

  const cleanPath = path.trim();

  // If already an absolute URL
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    // If it's a TMDB URL, normalize size to requested size
    if (cleanPath.includes('image.tmdb.org/t/p/')) {
      return cleanPath.replace(/\/t\/p\/(w\d+|original)\//, `/t/p/${size}/`);
    }
    // Filter out previous legacy Unsplash stock fallbacks so they don't appear as real posters
    if (cleanPath.includes('images.unsplash.com')) {
      return null;
    }
    return cleanPath;
  }

  // Prepend TMDB base URL and size once
  const leadingSlash = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return `${TMDB_IMAGE_BASE}/${size}${leadingSlash}`;
}

/**
 * Builds a validated, correctly sized TMDB backdrop URL.
 */
export function getTmdbBackdropUrl(path?: string | null, size: BackdropSize = 'w1280'): string | null {
  if (!path || typeof path !== 'string' || !path.trim()) {
    return null;
  }

  const cleanPath = path.trim();

  // If already an absolute URL
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    if (cleanPath.includes('image.tmdb.org/t/p/')) {
      return cleanPath.replace(/\/t\/p\/(w\d+|original)\//, `/t/p/${size}/`);
    }
    if (cleanPath.includes('images.unsplash.com')) {
      return null;
    }
    return cleanPath;
  }

  const leadingSlash = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  return `${TMDB_IMAGE_BASE}/${size}${leadingSlash}`;
}
