import { Router, Request, Response } from 'express';
import { tmdbService } from '../tmdb.js';

export const moviesRouter = Router();

// Trending
moviesRouter.get('/trending', async (req: Request, res: Response) => {
  try {
    const movies = await tmdbService.getTrending();
    return res.json({ results: movies, hasTmdbKey: tmdbService.hasApiKey() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Popular
moviesRouter.get('/popular', async (req: Request, res: Response) => {
  try {
    const movies = await tmdbService.getPopular();
    return res.json({ results: movies });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Top Rated
moviesRouter.get('/top-rated', async (req: Request, res: Response) => {
  try {
    const movies = await tmdbService.getTopRated();
    return res.json({ results: movies });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Upcoming
moviesRouter.get('/upcoming', async (req: Request, res: Response) => {
  try {
    const movies = await tmdbService.getUpcoming();
    return res.json({ results: movies });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Genres
moviesRouter.get('/genres', (req: Request, res: Response) => {
  return res.json({ genres: tmdbService.getGenres() });
});

// Genre-specific
moviesRouter.get('/genre/:id', async (req: Request, res: Response) => {
  try {
    const genreId = parseInt(req.params.id);
    const movies = await tmdbService.getByGenre(genreId);
    return res.json({ results: movies });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Search and filter
moviesRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';
    const genreId = req.query.genre ? parseInt(req.query.genre as string) : undefined;
    const year = req.query.year as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;

    const movies = await tmdbService.searchMovies(query, genreId, year, sortBy);
    return res.json({ results: movies, total: movies.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Batch fetch movies by comma-separated IDs (for watchlists, continue watching)
moviesRouter.get('/batch', async (req: Request, res: Response) => {
  try {
    const idsStr = req.query.ids as string;
    if (!idsStr) {
      return res.json({ results: [] });
    }

    const ids = idsStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    const results = [];
    for (const id of ids) {
      const movie = await tmdbService.getMovieDetails(id);
      if (movie) results.push(movie);
    }
    return res.json({ results });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Movie Details with trailer, cast, and genres
moviesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }

    const movie = await tmdbService.getMovieDetails(id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    return res.json({ movie });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
