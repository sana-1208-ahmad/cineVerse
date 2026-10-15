import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import { getTmdbPosterUrl, PosterSize } from '../../utils/tmdbImages';

interface MoviePosterProps {
  posterPath?: string | null;
  title: string;
  size?: PosterSize;
  className?: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
}

export const MoviePoster: React.FC<MoviePosterProps> = ({
  posterPath,
  title,
  size = 'w500',
  className = '',
  alt,
  loading = 'lazy'
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset error state if posterPath changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [posterPath]);

  const resolvedUrl = getTmdbPosterUrl(posterPath, size);

  if (!resolvedUrl || hasError) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-b from-[#201f1f] to-[#0e0e0e] border border-white/5 flex flex-col items-center justify-center p-3 text-center select-none ${className}`}
      >
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mb-2">
          <Film className="w-5 h-5" />
        </div>
        <p className="text-xs font-bold text-white/90 line-clamp-3 leading-snug px-1">
          {title}
        </p>
        <span className="text-[9px] uppercase tracking-wider text-white/40 mt-1 font-semibold">
          Artwork Unavailable
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-[#1c1b1b] overflow-hidden ${className}`}>
      {/* Skeleton placeholder before image finishes loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
      <img
        src={resolvedUrl}
        alt={alt || `${title} Poster`}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default MoviePoster;
