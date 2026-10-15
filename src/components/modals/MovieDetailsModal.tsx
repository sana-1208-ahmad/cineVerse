import React, { useState, useEffect } from 'react';
import { X, Play, Plus, Check, ThumbsUp, ThumbsDown, Sparkles, Clock, Calendar, Star, Users } from 'lucide-react';
import { Movie } from '../../types';
import { useMovies } from '../../context/MovieContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const MovieDetailsModal: React.FC = () => {
  const { activeMovieDetail, closeMovieDetails, openTrailer, toggleWatchlist, isInWatchlist, setRating, getRating } = useMovies();
  const { currentProfile } = useAuth();
  
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [detailedMovie, setDetailedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!activeMovieDetail) {
      setDetailedMovie(null);
      setAiInsight(null);
      return;
    }

    setDetailedMovie(activeMovieDetail);

    // Fetch full credits if cast is empty
    if (!activeMovieDetail.cast || activeMovieDetail.cast.length === 0) {
      api.getMovieDetails(activeMovieDetail.id)
        .then(res => {
          if (res.movie) setDetailedMovie(res.movie);
        })
        .catch(err => console.warn('Could not fetch extra details:', err));
    }

    // Auto-fetch AI match explanation
    setLoadingAi(true);
    api.getAiExplanation({
      movieId: activeMovieDetail.id,
      movieTitle: activeMovieDetail.title,
      profileName: currentProfile?.name || 'Viewer',
      profileGenres: currentProfile?.preferences?.preferredGenres?.map(g => g.toString())
    })
      .then(res => setAiInsight(res.explanation))
      .catch(() => setAiInsight(null))
      .finally(() => setLoadingAi(false));

  }, [activeMovieDetail, currentProfile]);

  if (!activeMovieDetail || !detailedMovie) return null;

  const inList = isInWatchlist(detailedMovie.id);
  const rating = getRating(detailedMovie.id);

  const hours = Math.floor(detailedMovie.runtime / 60);
  const minutes = detailedMovie.runtime % 60;
  const runtimeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#1c1b1b] rounded-2xl overflow-hidden shadow-2xl border border-white/10 my-8">
        {/* Close Button */}
        <button
          onClick={closeMovieDetails}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-colors border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop Banner */}
        <div className="relative h-64 sm:h-96 w-full">
          <MovieBackdrop
            key={detailedMovie.id}
            backdropPath={detailedMovie.backdrop_path}
            title={detailedMovie.title}
            size="w1280"
            className="w-full h-full object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-[#1c1b1b]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1b1b] via-transparent to-transparent sm:w-1/2" />

          {/* Quick Overlay Action Bar */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => openTrailer(detailedMovie.trailer_key, detailedMovie.title, detailedMovie)}
              className="flex items-center space-x-2 bg-white hover:bg-neutral-200 text-black font-bold px-6 py-2.5 rounded-lg shadow-xl hover:scale-105 transition-all text-sm"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Play Trailer</span>
            </button>

            <button
              onClick={() => toggleWatchlist(detailedMovie)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg backdrop-blur-md font-semibold text-sm transition-all border ${
                inList
                  ? 'bg-[#e50914] text-white border-[#e50914]'
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
              }`}
            >
              {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{inList ? 'In Watchlist' : 'Add to Watchlist'}</span>
            </button>

            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={() => setRating(detailedMovie.id, rating === 'like' ? 'none' : 'like')}
                className={`p-2.5 rounded-full border transition-colors ${
                  rating === 'like'
                    ? 'border-[#55e074] bg-[#55e074]/20 text-[#55e074]'
                    : 'border-white/20 bg-black/40 text-white hover:border-white'
                }`}
                title="Like"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>

              <button
                onClick={() => setRating(detailedMovie.id, rating === 'dislike' ? 'none' : 'dislike')}
                className={`p-2.5 rounded-full border transition-colors ${
                  rating === 'dislike'
                    ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                    : 'border-white/20 bg-black/40 text-white hover:border-white'
                }`}
                title="Dislike"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Title & Metadata Strip */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {detailedMovie.title}
            </h2>
            {detailedMovie.tagline && (
              <p className="text-sm sm:text-base italic text-[#c6c6c7]">
                “{detailedMovie.tagline}”
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#c6c6c7] pt-2">
              <span className="text-[#55e074] font-bold">98% Match for you</span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-amber-400" /> {detailedMovie.vote_average.toFixed(1)} / 10
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {detailedMovie.release_date?.slice(0, 4)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {runtimeDisplay}
              </span>
              <span className="px-2 py-0.5 border border-white/20 rounded font-semibold text-white/90">
                {detailedMovie.maturity_rating || 'PG-13'}
              </span>
              <span className="px-2 py-0.5 bg-[#e50914]/20 text-[#e50914] rounded font-semibold">
                4K UHD
              </span>
            </div>
          </div>

          {/* AI Curator Insight Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#e50914]/10 via-[#2a1b1b] to-[#1c1b1b] border border-[#e50914]/30 shadow-lg">
            <div className="flex items-center space-x-2 text-[#e50914] font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>CineVerse AI Match Insight</span>
            </div>
            {loadingAi ? (
              <p className="text-xs text-[#c6c6c7] animate-pulse">Analyzing tone, pacing, and your profile affinity...</p>
            ) : (
              <p className="text-xs sm:text-sm text-[#e5e2e1] leading-relaxed">
                {aiInsight || `"${detailedMovie.title}" is tailored for fans of atmospheric storytelling with rich visual depth and powerful thematic weight.`}
              </p>
            )}
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#c6c6c7]">Synopsis</h3>
            <p className="text-sm sm:text-base text-[#e5e2e1]/90 leading-relaxed font-normal">
              {detailedMovie.overview}
            </p>
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#c6c6c7]">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {detailedMovie.genres?.map(g => (
                <span
                  key={g.id}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/90"
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          {/* Cast & Director */}
          {detailedMovie.cast && detailedMovie.cast.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#c6c6c7] flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> Cast & Crew
                </h3>
                {detailedMovie.director && (
                  <span className="text-xs text-[#c6c6c7]">
                    Directed by <span className="text-white font-semibold">{detailedMovie.director}</span>
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {detailedMovie.cast.slice(0, 4).map(actor => (
                  <div key={actor.id} className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 border border-white/5">
                    {actor.profile_path ? (
                      <img
                        src={actor.profile_path}
                        alt={actor.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-xs font-bold text-white">
                        {actor.name[0]}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-white truncate">{actor.name}</p>
                      <p className="text-[11px] text-[#c6c6c7] truncate">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
