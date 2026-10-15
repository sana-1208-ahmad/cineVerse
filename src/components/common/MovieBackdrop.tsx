import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import { getTmdbBackdropUrl, BackdropSize } from '../../utils/tmdbImages';

interface MovieBackdropProps {
  backdropPath?: string | null;
  title: string;
  size?: BackdropSize;
  className?: string;
  children?: React.ReactNode;
  alt?: string;
}

export const MovieBackdrop: React.FC<MovieBackdropProps> = ({
  backdropPath,
  title,
  size = 'w1280',
  className = '',
  children,
  alt
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [backdropPath]);

  const resolvedUrl = getTmdbBackdropUrl(backdropPath, size);

  return (
    <div className={`relative w-full h-full bg-[#131313] overflow-hidden ${className}`}>
      {resolvedUrl && !hasError ? (
        <img
          src={resolvedUrl}
          alt={alt || `${title} Backdrop`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover object-center filter brightness-[0.82] transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#1c1b1b] via-[#201f1f] to-[#0e0e0e] flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2 opacity-30 select-none">
            <Film className="w-12 h-12 text-white" />
            <span className="text-xs uppercase font-bold tracking-widest text-white">{title}</span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default MovieBackdrop;
