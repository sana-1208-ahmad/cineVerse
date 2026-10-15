export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: { id: number; name: string }[];
  genre_ids: number[];
  runtime: number;
  maturity_rating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  trailer_key: string;
  tagline?: string;
  director?: string;
  cast?: { id: number; name: string; character: string; profile_path: string | null }[];
  match_score?: number;
  is_trending?: boolean;
  is_top_10?: boolean;
  top_10_rank?: number;
  ai_match_score?: number;
  vibe_tags?: string[];
  why_you_will_love_it?: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  isKid: boolean;
  pin?: string | null;
  maturityLimit: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  watchlist: number[];
  likes: number[];
  dislikes: number[];
  history: { movieId: number; progress: number; watchedAt: string }[];
  preferences: {
    preferredGenres: number[];
    preferredLanguages: string[];
    streamingPlatforms: string[];
    autoplayTrailers: boolean;
    autoplayNext: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  membershipPlan: 'Premium 4K Ultra HD' | 'Standard Full HD';
  createdAt?: string;
  profiles: Profile[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface AvatarPreset {
  id: string;
  name: string;
  url: string;
  category: string;
}
