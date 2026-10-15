import React from 'react';
import { X, Plus, Check } from 'lucide-react';
import { useMovies } from '../../context/MovieContext';

export const TrailerModal: React.FC = () => {
  const { activeTrailer, closeTrailer, toggleWatchlist, isInWatchlist } = useMovies();

  if (!activeTrailer) return null;

  const inList = activeTrailer.movie ? isInWatchlist(activeTrailer.movie.id) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#1c1b1b] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#131313]">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e50914] animate-ping" />
            <h3 className="font-bold text-white text-base sm:text-lg truncate max-w-md">
              {activeTrailer.title} — Official Trailer
            </h3>
          </div>
          <button
            onClick={closeTrailer}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeTrailer.key}?autoplay=1&rel=0&modestbranding=1`}
            title={`${activeTrailer.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Action footer */}
        {activeTrailer.movie && (
          <div className="px-6 py-4 bg-[#131313] flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs sm:text-sm text-[#c6c6c7]">
              <span>{activeTrailer.movie.release_date?.slice(0, 4)}</span>
              <span>•</span>
              <span>{activeTrailer.movie.maturity_rating || 'PG-13'}</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">
                {activeTrailer.movie.vote_average.toFixed(1)} / 10 TMDB
              </span>
            </div>
            <button
              onClick={() => toggleWatchlist(activeTrailer.movie!)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all border ${
                inList
                  ? 'bg-[#e50914] text-white border-[#e50914]'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{inList ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
