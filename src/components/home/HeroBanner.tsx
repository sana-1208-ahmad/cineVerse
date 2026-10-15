import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Info, Sparkles, Calendar, Clock } from 'lucide-react';
import { Movie } from '../../types';
import { tmdbService } from '../../services/tmdbService';
import { useMovies } from '../../context/MovieContext';
import { MovieBackdrop } from '../common/MovieBackdrop';

interface HeroBannerProps {
  movie?: Movie;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ movie: initialMovie }) => {
  const { openTrailer, openMovieDetails, toggleWatchlist, isInWatchlist } = useMovies();

  const [movie, setMovie] = useState<Movie | null>(initialMovie || null);
  const [loading, setLoading] = useState<boolean>(!initialMovie);
  const [error, setError] = useState<string | null>(null);

  // Fetch popular movie from TMDB via useEffect if not provided via props
  useEffect(() => {
    if (initialMovie) {
      setMovie(initialMovie);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function fetchPopularMovie() {
      try {
        setLoading(true);
        const popularMovies = await tmdbService.getPopularMovies();
        if (isMounted) {
          if (popularMovies && popularMovies.length > 0) {
            setMovie(popularMovies[0]);
          } else {
            // Fallback to trending if popular is empty
            const trendingData = await tmdbService.getTrendingMovies();
            if (trendingData.results && trendingData.results.length > 0) {
              setMovie(trendingData.results[0]);
            }
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error fetching popular movie from TMDB:', err);
          setError(err.message || 'Failed to load featured movie');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPopularMovie();

    return () => {
      isMounted = false;
    };
  }, [initialMovie]);

  // Loading skeleton state
  if (loading) {
    return (
      <div className="relative w-full h-[70vh] sm:h-[80vh] min-h-[520px] max-h-[800px] bg-[#131313] flex items-end p-6 sm:p-12 md:p-16">
        <div className="max-w-2xl w-full space-y-4 animate-pulse">
          <div className="h-6 w-36 bg-white/10 rounded-md" />
          <div className="h-12 sm:h-16 w-3/4 bg-white/10 rounded-xl" />
          <div className="h-4 w-40 bg-white/10 rounded-md" />
          <div className="h-4 w-full bg-white/5 rounded-md" />
          <div className="h-4 w-4/5 bg-white/5 rounded-md" />
          <div className="h-12 w-64 bg-white/10 rounded-xl pt-2" />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return null;
  }

  const inList = isInWatchlist(movie.id);
  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : '2024';
  const matchScore = movie.ai_match_score || Math.min(99, Math.max(88, Math.round(movie.vote_average * 10 + 10)));
  const maturity = movie.maturity_rating || 'PG-13';

  const formatRuntime = (mins?: number) => {
    if (!mins) return '2h 15m';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] min-h-[520px] max-h-[800px] overflow-hidden select-none bg-[#131313]">
      {/* Full-width dynamic TMDB Backdrop Image */}
      <div className="absolute inset-0 z-0">
        <MovieBackdrop
          backdropPath={movie.backdrop_path}
          title={movie.title}
          size="w1280"
          className="w-full h-full"
        />

        {/* Subtle dark gradient overlays ensuring high text contrast per Stitch visual specifications */}
        {/* Left-to-right contrast veil ensuring text readability against bright scenes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/70 to-transparent w-full md:w-3/5 lg:w-1/2 z-1" />

        {/* Top vignette to seamlessly transition with the navigation bar */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#131313] via-[#131313]/60 to-transparent z-1" />

        {/* Bottom deep gradient transitioning smoothly into the movie carousel rows */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#131313] via-[#131313]/80 to-transparent z-1" />
      </div>

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-14 sm:pb-20 z-10">
        <div className="max-w-2xl lg:max-w-3xl space-y-4">
          
          {/* Metadata badges strip */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="flex items-center gap-1.5 text-xs font-black bg-[#e50914] text-white px-3 py-1 rounded-md shadow-lg shadow-[#e50914]/30 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              #1 in Movies Today
            </span>

            <span className="text-xs font-bold text-[#55e074] bg-[#55e074]/15 px-2.5 py-1 rounded-md border border-[#55e074]/30">
              {matchScore}% Match
            </span>

            <span className="text-xs font-bold px-2 py-0.5 border border-white/20 rounded bg-black/40 text-white">
              {maturity}
            </span>

            <span className="text-xs font-medium text-white/90 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-white/70" /> {releaseYear}
            </span>

            <span className="text-xs font-medium text-white/90 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-white/70" /> {formatRuntime(movie.runtime)}
            </span>

            <span className="text-[11px] font-bold px-2 py-0.5 bg-white/10 text-white rounded border border-white/10">
              4K Ultra HD
            </span>
          </div>

          {/* Title (h1) with responsive typography utilities matching Stitch specifications */}
          <h1 className="text-display-hero-mobile md:text-display-hero text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
            {movie.title}
          </h1>

          {/* Tagline if available */}
          {movie.tagline && (
            <p className="text-sm sm:text-base font-semibold italic text-[#ffb4aa] drop-shadow">
              “{movie.tagline}”
            </p>
          )}

          {/* Short Synopsis */}
          <p className="text-sm sm:text-base text-white/90 line-clamp-3 sm:line-clamp-4 leading-relaxed max-w-xl font-normal drop-shadow-md">
            {movie.overview}
          </p>

          {/* Genres & Director */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs font-semibold text-[#c6c6c7]">
              {movie.genres.slice(0, 3).map((g, idx) => (
                <span key={g.id} className="flex items-center gap-2">
                  <span className="text-white/80 hover:text-white transition-colors">{g.name}</span>
                  {idx < Math.min(movie.genres.length, 3) - 1 && <span className="text-white/30">•</span>}
                </span>
              ))}
              {movie.director && (
                <>
                  <span className="text-white/30">•</span>
                  <span className="text-white/80">Directed by {movie.director}</span>
                </>
              )}
            </div>
          )}

          {/* Container for 'Play', 'More Info', and 'My List' Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Play Button */}
            <button
              onClick={() => openTrailer(movie.trailer_key, movie.title, movie)}
              className="flex items-center space-x-2.5 bg-white hover:bg-neutral-200 text-black font-extrabold px-6 sm:px-8 py-3 rounded-xl shadow-2xl hover:scale-105 transition-all text-sm sm:text-base cursor-pointer"
            >
              <Play className="w-5 h-5 fill-black translate-x-0.5" />
              <span>Play</span>
            </button>

            {/* More Info Button */}
            <button
              onClick={() => openMovieDetails(movie)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl backdrop-blur-md border border-white/20 transition-all text-sm sm:text-base cursor-pointer hover:scale-105"
              title="View full synopsis, cast, and AI match insights"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>

            {/* Watchlist Toggle */}
            <button
              onClick={() => toggleWatchlist(movie)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl backdrop-blur-md font-bold text-sm sm:text-base transition-all border cursor-pointer ${
                inList
                  ? 'bg-[#e50914] text-white border-[#e50914] shadow-lg shadow-[#e50914]/30 hover:bg-[#f40612]'
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
              }`}
              title={inList ? 'Remove from My List' : 'Add to My List'}
            >
              {inList ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
              <span>{inList ? 'In Watchlist' : 'My List'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Edge Fixed Maturity Tag */}
      <div className="absolute right-0 bottom-24 z-20 hidden md:flex items-center space-x-3 pr-6">
        <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md border-l-2 border-[#e50914] px-3.5 py-1.5 text-xs font-bold text-white shadow-lg">
          <span className="text-[#e50914]">•</span>
          <span>{maturity}</span>
          <span className="text-white/40">|</span>
          <span className="text-[#55e074]">{matchScore}% Match</span>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
