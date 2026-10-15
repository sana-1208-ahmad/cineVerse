import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Film } from 'lucide-react';
import { Movie } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HeroBanner } from '../components/home/HeroBanner';
import { MovieRow } from '../components/movies/MovieRow';

export const HomePage: React.FC = () => {
  const { currentProfile } = useAuth();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [sciFi, setSciFi] = useState<Movie[]>([]);
  const [action, setAction] = useState<Movie[]>([]);
  const [animation, setAnimation] = useState<Movie[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCatalogue() {
      try {
        setLoading(true);
        const [trendRes, popRes, topRes, sciFiRes, actRes, animRes] = await Promise.all([
          api.getTrending(),
          api.getPopular(),
          api.getTopRated(),
          api.getMoviesByGenre(878), // Sci-Fi
          api.getMoviesByGenre(28),  // Action
          api.getMoviesByGenre(16)   // Animation
        ]);

        setTrending(trendRes.results || []);
        setPopular(popRes.results || []);
        setTopRated(topRes.results || []);
        setSciFi(sciFiRes.results || []);
        setAction(actRes.results || []);
        setAnimation(animRes.results || []);

        if (currentProfile && currentProfile.watchlist.length > 0) {
          const batch = await api.getMoviesBatch(currentProfile.watchlist.slice(0, 10));
          setWatchlistMovies(batch.results || []);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalogue();
  }, [currentProfile]);

  const heroMovie = trending.length > 0 ? trending[0] : null;

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] pb-12">
      {/* Cinematic Hero */}
      <HeroBanner movie={heroMovie || undefined} />

      {/* Floating AI Navigator Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20 mb-8">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#e50914]/20 via-[#201f1f] to-[#1c1b1b] border border-[#e50914]/30 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#e50914] text-white flex items-center justify-center shadow-lg shadow-[#e50914]/30 flex-shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
                CineVerse AI Navigator
                <span className="text-[10px] bg-white/10 text-white/90 px-1.5 py-0.5 rounded font-mono">Gemini 2.5</span>
              </h3>
              <p className="text-xs text-[#c6c6c7]">
                Not sure what fits your vibe tonight? Select a mood and let AI recommend the perfect match.
              </p>
            </div>
          </div>
          <Link
            to="/ai-assistant"
            className="flex items-center space-x-2 bg-[#e50914] hover:bg-[#f40612] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-[#e50914]/20 transition-all hover:scale-105 flex-shrink-0 w-full sm:w-auto justify-center"
          >
            <span>Launch AI Discovery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Rows of Content */}
      <div className="space-y-4">
        {/* User Watchlist Row if populated */}
        {watchlistMovies.length > 0 && (
          <MovieRow title="My List" movies={watchlistMovies} />
        )}

        {/* Trending Now */}
        <MovieRow title="Trending Now" movies={trending} />

        {/* Top 10 Today */}
        <MovieRow
          title="Top 10 Movies Today on CineVerse"
          movies={trending.slice(0, 10)}
          isTop10={true}
        />

        {/* Sci-Fi & Cyberpunk */}
        <MovieRow title="Mind-Bending Sci-Fi & Cyberpunk" movies={sciFi} />

        {/* Action & Adventure */}
        <MovieRow title="High-Octane Action & Adventure" movies={action} />

        {/* Critically Acclaimed Masterpieces */}
        <MovieRow title="Critically Acclaimed Masterpieces" movies={topRated} />

        {/* Family & Animation */}
        <MovieRow title="Animation & Imaginative Worlds" movies={animation} />
      </div>
    </div>
  );
};
