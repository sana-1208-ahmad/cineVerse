import { MovieData, REAL_MOVIES, GENRES_LIST } from './data/moviesData.js';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export class TMDBService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
  }

  public hasApiKey(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5 && !this.apiKey.includes('your_tmdb_api_key'));
  }

  private async fetchFromTMDB(endpoint: string, params: Record<string, string> = {}): Promise<any> {
    if (!this.hasApiKey()) return null;
    try {
      const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
      url.searchParams.set('api_key', this.apiKey!);
      for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
      }
      const response = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) {
        console.warn(`TMDB request failed (${response.status}): ${endpoint}`);
        return null;
      }
      return await response.json();
    } catch (err) {
      console.error(`Error querying TMDB API for ${endpoint}:`, err);
      return null;
    }
  }

  private formatTMDBMovie(item: any): MovieData {
    return {
      id: item.id,
      title: item.title || item.name || 'Untitled',
      original_title: item.original_title || item.original_name,
      overview: item.overview || 'No synopsis available.',
      poster_path: item.poster_path 
        ? (item.poster_path.startsWith('http') ? item.poster_path : `${TMDB_IMAGE_BASE}/w500${item.poster_path.startsWith('/') ? item.poster_path : '/' + item.poster_path}`)
        : '',
      backdrop_path: item.backdrop_path 
        ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : `${TMDB_IMAGE_BASE}/w1280${item.backdrop_path.startsWith('/') ? item.backdrop_path : '/' + item.backdrop_path}`)
        : '',
      release_date: item.release_date || item.first_air_date || '2024-01-01',
      vote_average: Number((item.vote_average || 7.5).toFixed(1)),
      vote_count: item.vote_count || 100,
      popularity: item.popularity || 100,
      genres: item.genres || (item.genre_ids ? item.genre_ids.map((gid: number) => {
        const found = GENRES_LIST.find(g => g.id === gid);
        return found ? found : { id: gid, name: 'Cinema' };
      }) : [{ id: 28, name: 'Action' }]),
      genre_ids: item.genre_ids || (item.genres ? item.genres.map((g: any) => g.id) : [28]),
      runtime: item.runtime || 120,
      maturity_rating: item.adult ? 'NC-17' : (item.vote_average > 8 ? 'R' : 'PG-13'),
      trailer_key: 'YoHD9XEInc0', // default fallback trailer
      tagline: item.tagline || '',
      director: 'Acclaimed Director',
      cast: []
    };
  }

  public async getTrending(): Promise<MovieData[]> {
    if (this.hasApiKey()) {
      const data = await this.fetchFromTMDB('/trending/movie/week');
      if (data && data.results && data.results.length > 0) {
        return data.results.map((m: any, idx: number) => ({
          ...this.formatTMDBMovie(m),
          is_trending: true,
          is_top_10: idx < 10,
          top_10_rank: idx < 10 ? idx + 1 : undefined
        }));
      }
    }
    return REAL_MOVIES.filter(m => m.is_trending || (m.top_10_rank && m.top_10_rank <= 10));
  }

  public async getTopRated(): Promise<MovieData[]> {
    if (this.hasApiKey()) {
      const data = await this.fetchFromTMDB('/movie/top_rated');
      if (data && data.results && data.results.length > 0) {
        return data.results.map((m: any) => this.formatTMDBMovie(m));
      }
    }
    return [...REAL_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
  }

  public async getPopular(): Promise<MovieData[]> {
    if (this.hasApiKey()) {
      const data = await this.fetchFromTMDB('/movie/popular');
      if (data && data.results && data.results.length > 0) {
        return data.results.map((m: any) => this.formatTMDBMovie(m));
      }
    }
    return [...REAL_MOVIES].sort((a, b) => b.popularity - a.popularity);
  }

  public async getUpcoming(): Promise<MovieData[]> {
    if (this.hasApiKey()) {
      const data = await this.fetchFromTMDB('/movie/upcoming');
      if (data && data.results && data.results.length > 0) {
        return data.results.map((m: any) => this.formatTMDBMovie(m));
      }
    }
    return REAL_MOVIES.filter(m => parseInt(m.release_date.slice(0, 4)) >= 2023);
  }

  public async getByGenre(genreId: number): Promise<MovieData[]> {
    if (this.hasApiKey()) {
      const data = await this.fetchFromTMDB('/discover/movie', {
        with_genres: genreId.toString(),
        sort_by: 'popularity.desc'
      });
      if (data && data.results && data.results.length > 0) {
        return data.results.map((m: any) => this.formatTMDBMovie(m));
      }
    }
    return REAL_MOVIES.filter(m => m.genre_ids.includes(genreId));
  }

  public async searchMovies(query: string, genreId?: number, year?: string, sortBy?: string): Promise<MovieData[]> {
    let results: MovieData[] = [];
    if (this.hasApiKey() && query.trim()) {
      const data = await this.fetchFromTMDB('/search/movie', { query });
      if (data && data.results) {
        results = data.results.map((m: any) => this.formatTMDBMovie(m));
      }
    }

    if (results.length === 0) {
      const q = query.toLowerCase().trim();
      results = REAL_MOVIES.filter(m => {
        const matchesQuery = !q || m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q) || m.director.toLowerCase().includes(q) || m.cast.some(c => c.name.toLowerCase().includes(q));
        return matchesQuery;
      });
    }

    if (genreId && genreId > 0) {
      results = results.filter(m => m.genre_ids.includes(genreId));
    }

    if (year && year !== 'all') {
      results = results.filter(m => m.release_date.startsWith(year));
    }

    if (sortBy === 'rating') {
      results.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === 'newest') {
      results.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
    } else {
      results.sort((a, b) => b.popularity - a.popularity);
    }

    return results;
  }

  public async getMovieDetails(id: number): Promise<MovieData | null> {
    const local = REAL_MOVIES.find(m => m.id === id);

    if (this.hasApiKey()) {
      const details = await this.fetchFromTMDB(`/movie/${id}`, {
        append_to_response: 'videos,credits,similar'
      });
      if (details) {
        const formatted = this.formatTMDBMovie(details);
        
        // Find trailer key
        let trailerKey = local?.trailer_key || 'YoHD9XEInc0';
        if (details.videos && details.videos.results && details.videos.results.length > 0) {
          const official = details.videos.results.find((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
          if (official) {
            trailerKey = official.key;
          } else {
            trailerKey = details.videos.results[0].key;
          }
        }
        formatted.trailer_key = trailerKey;

        // Extract director & cast
        if (details.credits) {
          const dir = details.credits.crew?.find((c: any) => c.job === 'Director');
          if (dir) formatted.director = dir.name;
          if (details.credits.cast) {
            formatted.cast = details.credits.cast.slice(0, 10).map((c: any) => ({
              id: c.id,
              name: c.name,
              character: c.character,
              profile_path: c.profile_path ? `${TMDB_IMAGE_BASE}/w185${c.profile_path}` : null
            }));
          }
        }

        return formatted;
      }
    }

    return local || null;
  }

  public getGenres() {
    return GENRES_LIST;
  }
}

export const tmdbService = new TMDBService();
