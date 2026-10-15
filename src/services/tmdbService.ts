import { Movie, Genre } from '../types';

// TMDB API Constants
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const PROXY_BASE_URL = '/api/movies';

/**
 * Helper to retrieve TMDB API key safely from environment variables across environments
 */
function getTmdbApiKey(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TMDB_API_KEY) {
    return import.meta.env.VITE_TMDB_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env?.TMDB_API_KEY) {
    return process.env.TMDB_API_KEY;
  }
  return '';
}

export interface SearchOptions {
  genre?: number;
  year?: string;
  sortBy?: 'popularity' | 'rating' | 'newest' | string;
}

/**
 * Normalizes raw TMDB items into standardized CineVerse Movie entities
 */
function formatMovie(item: any): Movie {
  return {
    id: item.id,
    title: item.title || item.name || 'Untitled',
    original_title: item.original_title || item.original_name,
    overview: item.overview || 'No synopsis available.',
    poster_path: item.poster_path
      ? (item.poster_path.startsWith('http')
          ? (item.poster_path.includes('images.unsplash.com') ? '' : item.poster_path.replace(/\/t\/p\/(w\d+|original)\//, '/t/p/w500/'))
          : `${TMDB_IMAGE_BASE_URL}/w500${item.poster_path.startsWith('/') ? item.poster_path : '/' + item.poster_path}`)
      : '',
    backdrop_path: item.backdrop_path
      ? (item.backdrop_path.startsWith('http')
          ? (item.backdrop_path.includes('images.unsplash.com') ? '' : item.backdrop_path.replace(/\/t\/p\/(w\d+|original)\//, '/t/p/w1280/'))
          : `${TMDB_IMAGE_BASE_URL}/w1280${item.backdrop_path.startsWith('/') ? item.backdrop_path : '/' + item.backdrop_path}`)
      : '',
    release_date: item.release_date || item.first_air_date || '2024-01-01',
    vote_average: Number((item.vote_average || 7.5).toFixed(1)),
    vote_count: item.vote_count || 100,
    popularity: item.popularity || 100,
    genres: item.genres || (item.genre_ids ? item.genre_ids.map((id: number) => ({ id, name: 'Cinema' })) : [{ id: 28, name: 'Action' }]),
    genre_ids: item.genre_ids || (item.genres ? item.genres.map((g: any) => g.id) : [28]),
    runtime: item.runtime || 120,
    maturity_rating: item.adult ? 'NC-17' : (item.vote_average > 8 ? 'R' : 'PG-13'),
    trailer_key: item.trailer_key || 'YoHD9XEInc0',
    tagline: item.tagline || '',
    director: item.director || 'Acclaimed Filmmaker',
    cast: item.cast || []
  };
}

/**
 * Fetches popular movies from TMDB API.
 * Securely accesses TMDB_API_KEY from environment variables or through the backend proxy.
 * Includes graceful error handling to safeguard UI components from crashing.
 */
export async function getPopularMovies(): Promise<Movie[]> {
  const apiKey = getTmdbApiKey();

  try {
    // 1. Direct call if environment variable is configured in the client
    if (apiKey && apiKey.length > 5 && !apiKey.includes('your_tmdb_api_key')) {
      const url = `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.results)) {
          return data.results.map(formatMovie);
        }
      } else {
        console.warn(`Direct TMDB Popular request returned HTTP ${response.status}. Falling back to server proxy.`);
      }
    }

    // 2. Query secure backend proxy (which uses server-side TMDB_API_KEY from process.env)
    const proxyResponse = await fetch(`${PROXY_BASE_URL}/popular`, {
      headers: { 'Accept': 'application/json' }
    });

    if (proxyResponse.ok) {
      const json = await proxyResponse.json();
      return json.results || [];
    }

    throw new Error(`Server proxy error: HTTP ${proxyResponse.status}`);
  } catch (error) {
    console.error('Failed to fetch popular movies from TMDB:', error);
    // Graceful error recovery: return empty array rather than propagating fatal error
    return [];
  }
}

/**
 * Fetches comprehensive movie details by ID, including credits and trailer keys.
 * Includes graceful error handling for missing IDs or network failures.
 */
export async function getMovieDetails(id: number | string): Promise<Movie | null> {
  if (!id) return null;
  const apiKey = getTmdbApiKey();

  try {
    // 1. Direct call if environment variable is configured
    if (apiKey && apiKey.length > 5 && !apiKey.includes('your_tmdb_api_key')) {
      const url = `${TMDB_BASE_URL}/movie/${id}?api_key=${apiKey}&append_to_response=videos,credits`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const movie = formatMovie(data);

        // Extract trailer key
        if (data.videos?.results?.length > 0) {
          const trailer = data.videos.results.find(
            (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
          );
          if (trailer) movie.trailer_key = trailer.key;
        }

        // Extract cast & director
        if (data.credits) {
          const director = data.credits.crew?.find((c: any) => c.job === 'Director');
          if (director) movie.director = director.name;
          if (Array.isArray(data.credits.cast)) {
            movie.cast = data.credits.cast.slice(0, 8).map((c: any) => ({
              id: c.id,
              name: c.name,
              character: c.character,
              profile_path: c.profile_path ? `${TMDB_IMAGE_BASE_URL}/w185${c.profile_path}` : null
            }));
          }
        }

        return movie;
      }
    }

    // 2. Query secure backend proxy
    const proxyResponse = await fetch(`${PROXY_BASE_URL}/${id}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (proxyResponse.ok) {
      const json = await proxyResponse.json();
      return json.movie || null;
    }

    throw new Error(`Server proxy error: HTTP ${proxyResponse.status}`);
  } catch (error) {
    console.error(`Failed to fetch movie details for ID ${id}:`, error);
    return null;
  }
}

/**
 * Searches TMDB for movies matching the query string and optional filters.
 * Includes input sanitation and error handling.
 */
export async function searchMovies(query: string, options?: SearchOptions): Promise<Movie[]> {
  const sanitizedQuery = (query || '').trim();
  const apiKey = getTmdbApiKey();

  try {
    // 1. Direct call if environment variable is configured and query is non-empty
    if (sanitizedQuery && apiKey && apiKey.length > 5 && !apiKey.includes('your_tmdb_api_key')) {
      const url = new URL(`${TMDB_BASE_URL}/search/movie`);
      url.searchParams.set('api_key', apiKey);
      url.searchParams.set('query', sanitizedQuery);
      if (options?.year && options.year !== 'all') {
        url.searchParams.set('primary_release_year', options.year);
      }

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.results)) {
          let results = data.results.map(formatMovie);
          if (options?.genre) {
            results = results.filter((m: Movie) => m.genre_ids?.includes(options.genre!));
          }
          return results;
        }
      }
    }

    // 2. Query secure backend proxy
    const params = new URLSearchParams();
    if (sanitizedQuery) params.set('q', sanitizedQuery);
    if (options?.genre) params.set('genre', options.genre.toString());
    if (options?.year && options.year !== 'all') params.set('year', options.year);
    if (options?.sortBy) params.set('sortBy', options.sortBy);

    const proxyResponse = await fetch(`${PROXY_BASE_URL}/search?${params.toString()}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (proxyResponse.ok) {
      const json = await proxyResponse.json();
      return json.results || [];
    }

    throw new Error(`Server proxy error: HTTP ${proxyResponse.status}`);
  } catch (error) {
    console.error('Failed to search movies from TMDB:', error);
    return [];
  }
}

/**
 * Additional utility functions
 */
export async function getTrendingMovies(): Promise<{ results: Movie[]; hasTmdbKey: boolean }> {
  try {
    const res = await fetch(`${PROXY_BASE_URL}/trending`);
    if (res.ok) return await res.json();
    return { results: [], hasTmdbKey: false };
  } catch (error) {
    console.error('Failed to get trending movies:', error);
    return { results: [], hasTmdbKey: false };
  }
}

export async function getGenres(): Promise<Genre[]> {
  try {
    const res = await fetch(`${PROXY_BASE_URL}/genres`);
    if (res.ok) {
      const data = await res.json();
      return data.genres || [];
    }
    return [];
  } catch (error) {
    console.error('Failed to get genres:', error);
    return [];
  }
}

export const tmdbService = {
  getPopularMovies,
  getMovieDetails,
  searchMovies,
  getTrendingMovies,
  getGenres
};

export default tmdbService;
