import React, { useState } from 'react';
import { Play, Plus, Check, ThumbsUp, Info } from 'lucide-react';
import { Movie } from '../../types';
import { useMovies } from '../../context/MovieContext';
import { MoviePoster } from '../common/MoviePoster';

interface MovieCardProps {
  movie: Movie;
  rank?: number;
  isLarge?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, rank, isLarge = false }) => {
  const { openTrailer, openMovieDetails, toggleWatchlist, isInWatchlist, setRating, getRating } = useMovies();
  const [isHovered, setIsHovered] = useState(false);
  const inList = isInWatchlist(movie.id);
  const currentRating = getRating(movie.id);

  // Match score calculation
  const matchScore = movie.ai_match_score || Math.min(99, Math.max(85, Math.round(movie.vote_average * 10 + 12)));

  return (
    <div
      className={`relative group flex-shrink-0 transition-transform duration-300 select-none ${
        isLarge ? 'w-48 sm:w-60 md:w-72' : 'w-36 sm:w-44 md:w-52'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top 10 Rank Number if supplied */}
      {rank && (
        <div className="absolute -left-4 -bottom-3 z-20 pointer-events-none select-none font-black text-6xl sm:text-7xl md:text-8xl text-stroke text-[#131313] drop-shadow-[-3px_0px_0px_#5e3f3b]">
          {rank}
        </div>
      )}

      {/* Main Card */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#201f1f] shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 border border-white/5 group-hover:border-white/20">
        <MoviePoster
          posterPath={movie.poster_path}
          title={movie.title}
          size="w500"
          className="group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover Quick Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/80 to-transparent p-3 flex flex-col justify-end transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openTrailer(movie.trailer_key, movie.title, movie);
              }}
              title="Play Trailer"
              className="w-8 h-8 rounded-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
            >
              <Play className="w-4 h-4 fill-black translate-x-0.5" />
            </button>

            <button
              onClick={async (e) => {
                e.stopPropagation();
                await toggleWatchlist(movie);
              }}
              title={inList ? 'Remove from My List' : 'Add to My List'}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                inList
                  ? 'border-[#e50914] bg-[#e50914] text-white'
                  : 'border-white/40 bg-black/40 text-white hover:border-white'
              }`}
            >
              {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setRating(movie.id, currentRating === 'like' ? 'none' : 'like');
              }}
              title={currentRating === 'like' ? 'Liked' : 'Like this title'}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                currentRating === 'like'
                  ? 'border-[#55e074] bg-[#55e074]/20 text-[#55e074]'
                  : 'border-white/40 bg-black/40 text-white hover:border-white'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openMovieDetails(movie);
              }}
              title="More Info"
              className="w-8 h-8 rounded-full border border-white/40 bg-black/40 text-white hover:border-white ml-auto flex items-center justify-center"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Metadata */}
          <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1 mb-1">
            {movie.title}
          </h3>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/90">
            <span className="text-[#55e074]">{matchScore}% Match</span>
            <span className="px-1 border border-white/30 text-[10px] rounded leading-none py-0.5">
              {movie.maturity_rating || 'PG-13'}
            </span>
            <span className="text-white/60">{movie.release_date?.slice(0, 4)}</span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-[#c6c6c7]">
            {movie.genres?.slice(0, 2).map((g) => (
              <span key={g.id}>• {g.name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
