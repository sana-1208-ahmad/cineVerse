import React, { createContext, useContext, useState, useCallback } from 'react';
import { Movie } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface MovieContextType {
  watchlist: number[];
  likes: number[];
  dislikes: number[];
  activeTrailer: { key: string; title: string; movie?: Movie } | null;
  activeMovieDetail: Movie | null;
  openTrailer: (key: string, title: string, movie?: Movie) => void;
  closeTrailer: () => void;
  openMovieDetails: (movie: Movie) => void;
  closeMovieDetails: () => void;
  toggleWatchlist: (movie: Movie) => Promise<boolean>;
  setRating: (movieId: number, rating: 'like' | 'dislike' | 'none') => Promise<void>;
  isInWatchlist: (movieId: number) => boolean;
  getRating: (movieId: number) => 'like' | 'dislike' | 'none';
  recordWatch: (movieId: number, progress?: number) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentProfile, updateCurrentProfile } = useAuth();
  const [activeTrailer, setActiveTrailer] = useState<{ key: string; title: string; movie?: Movie } | null>(null);
  const [activeMovieDetail, setActiveMovieDetail] = useState<Movie | null>(null);

  const watchlist = currentProfile?.watchlist || [];
  const likes = currentProfile?.likes || [];
  const dislikes = currentProfile?.dislikes || [];

  const isInWatchlist = useCallback(
    (movieId: number) => watchlist.includes(movieId),
    [watchlist]
  );

  const getRating = useCallback(
    (movieId: number): 'like' | 'dislike' | 'none' => {
      if (likes.includes(movieId)) return 'like';
      if (dislikes.includes(movieId)) return 'dislike';
      return 'none';
    },
    [likes, dislikes]
  );

  const openTrailer = useCallback((key: string, title: string, movie?: Movie) => {
    setActiveTrailer({ key, title, movie });
    if (movie && currentProfile) {
      // Record in watch progress
      api.recordHistory(currentProfile.id, movie.id, 10).catch(() => {});
    }
  }, [currentProfile]);

  const closeTrailer = useCallback(() => {
    setActiveTrailer(null);
  }, []);

  const openMovieDetails = useCallback((movie: Movie) => {
    setActiveMovieDetail(movie);
  }, []);

  const closeMovieDetails = useCallback(() => {
    setActiveMovieDetail(null);
  }, []);

  const toggleWatchlist = async (movie: Movie): Promise<boolean> => {
    if (!currentProfile) return false;
    try {
      const res = await api.toggleWatchlist(currentProfile.id, movie.id);
      await updateCurrentProfile({ watchlist: res.watchlist });
      return res.inWatchlist;
    } catch (err) {
      console.error('Failed to toggle watchlist:', err);
      return false;
    }
  };

  const setRating = async (movieId: number, rating: 'like' | 'dislike' | 'none') => {
    if (!currentProfile) return;
    try {
      const res = await api.setRating(currentProfile.id, movieId, rating);
      await updateCurrentProfile({ likes: res.likes, dislikes: res.dislikes });
    } catch (err) {
      console.error('Failed to set rating:', err);
    }
  };

  const recordWatch = (movieId: number, progress: number = 100) => {
    if (!currentProfile) return;
    api.recordHistory(currentProfile.id, movieId, progress)
      .then(res => {
        updateCurrentProfile({ history: res.history });
      })
      .catch(() => {});
  };

  return (
    <MovieContext.Provider
      value={{
        watchlist,
        likes,
        dislikes,
        activeTrailer,
        activeMovieDetail,
        openTrailer,
        closeTrailer,
        openMovieDetails,
        closeMovieDetails,
        toggleWatchlist,
        setRating,
        isInWatchlist,
        getRating,
        recordWatch
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};
