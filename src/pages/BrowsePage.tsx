import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Movie, Genre } from '../types';
import { api } from '../services/api';
import { MovieCard } from '../components/movies/MovieCard';

export const BrowsePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const sortByParam = searchParams.get('sortBy') || 'popularity';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>(sortByParam);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state if URL changes
  useEffect(() => {
    if (queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  useEffect(() => {
    api.getGenres().then(res => setGenres(res.genres)).catch(() => {});
  }, []);

  // Fetch movies based on filters
  useEffect(() => {
    async function loadFilteredMovies() {
      setLoading(true);
      try {
        const res = await api.searchMovies({
          q: searchQuery,
          genre: selectedGenre,
          year: selectedYear !== 'all' ? selectedYear : undefined,
          sortBy
        });
        setMovies(res.results || []);
      } catch (err) {
        console.error('Failed to search movies:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadFilteredMovies();
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre, selectedYear, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre(undefined);
    setSelectedYear('all');
    setSortBy('popularity');
    setSearchParams({});
  };

  const years = ['all', '2024', '2023', '2022', '2021', '2019', '2018', '2017', '2014', '2010', '2008', '2001', '1999', '1994', '1977', '1972'];

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Title & Search Header */}
      <div className="space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Explore & Search
            </h1>
            <p className="text-xs sm:text-sm text-[#c6c6c7] mt-1">
              Browse cinematic masterworks, filter by genre and year, or search by title and director.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search title, cast, director..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-[#e50914] transition-all"
            />
            <Search className="w-4 h-4 text-[#c6c6c7] absolute left-3.5 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[#c6c6c7] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="p-4 rounded-xl bg-[#1c1b1b] border border-white/5 space-y-4">
          {/* Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Year Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-[#c6c6c7] font-medium">Year:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-[#131313] border border-white/10 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#e50914]"
                >
                  <option value="all">All Years</option>
                  {years.filter(y => y !== 'all').map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-[#c6c6c7] font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#131313] border border-white/10 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#e50914]"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Release Date (Newest)</option>
                </select>
              </div>
            </div>

            {(searchQuery || selectedGenre || selectedYear !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Genre Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedGenre(undefined)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors flex-shrink-0 ${
                selectedGenre === undefined
                  ? 'bg-[#e50914] text-white font-semibold'
                  : 'bg-white/5 text-[#c6c6c7] hover:bg-white/10'
              }`}
            >
              All Genres
            </button>
            {genres.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(selectedGenre === g.id ? undefined : g.id)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors flex-shrink-0 ${
                  selectedGenre === g.id
                    ? 'bg-[#e50914] text-white font-semibold'
                    : 'bg-white/5 text-[#c6c6c7] hover:bg-white/10'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs sm:text-sm text-[#c6c6c7]">
          Showing <span className="text-white font-bold">{movies.length}</span> titles
        </p>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-[#c6c6c7]">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No movies matched your criteria</h3>
          <p className="text-xs text-[#c6c6c7]">
            Try adjusting your search query, selecting "All Genres", or clearing the release year filter.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            {['Sci-Fi', 'Christopher Nolan', 'Action', 'Animation'].map(hint => (
              <button
                key={hint}
                onClick={() => setSearchQuery(hint)}
                className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-white/80"
              >
                Try "{hint}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
