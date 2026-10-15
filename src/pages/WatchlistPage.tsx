import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Sparkles, Plus, Play } from 'lucide-react';
import { Movie } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MovieCard } from '../components/movies/MovieCard';

export const WatchlistPage: React.FC = () => {
  const { currentProfile } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  useEffect(() => {
    async function loadWatchlist() {
      if (!currentProfile || currentProfile.watchlist.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await api.getMoviesBatch(currentProfile.watchlist);
        setMovies(res.results || []);
      } catch (err) {
        console.error('Failed to load watchlist:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWatchlist();
  }, [currentProfile]);

  const genres = ['All', ...Array.from(new Set(movies.flatMap(m => m.genres?.map(g => g.name) || [])))];

  const filteredMovies = selectedGenre === 'All'
    ? movies
    : movies.filter(m => m.genres?.some(g => g.name === selectedGenre));

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#e50914] text-xs font-bold uppercase tracking-wider mb-1">
              <Bookmark className="w-4 h-4 fill-[#e50914]" />
              <span>Personal Collection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              My Watchlist
            </h1>
            <p className="text-xs sm:text-sm text-[#c6c6c7] mt-1">
              {movies.length} title{movies.length === 1 ? '' : 's'} saved for {currentProfile?.name || 'you'}.
            </p>
          </div>

          <Link
            to="/ai-assistant"
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/10 transition-all w-fit"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e50914]" />
            <span>Ask AI to Recommend More</span>
          </Link>
        </div>

        {/* Genre Filter Tabs */}
        {genres.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-colors ${
                  selectedGenre === genre
                    ? 'bg-[#e50914] text-white font-semibold'
                    : 'bg-white/5 text-[#c6c6c7] hover:bg-white/10'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-24 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-[#c6c6c7]">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Your Watchlist is empty</h3>
          <p className="text-xs text-[#c6c6c7] leading-relaxed">
            Click the <Plus className="w-3.5 h-3.5 inline mx-1" /> button on any movie card or use the AI Navigator to bookmark titles you want to stream later.
          </p>
          <div className="pt-2">
            <Link
              to="/browse"
              className="inline-flex items-center space-x-2 bg-[#e50914] hover:bg-[#f40612] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              <span>Explore Titles</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
