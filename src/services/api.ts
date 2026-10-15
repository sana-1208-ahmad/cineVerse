import { Movie, Profile, User, Genre, AvatarPreset } from '../types';

const API_BASE = '/api';

function getStoredToken(): string | null {
  return localStorage.getItem('cineverse_token');
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem('cineverse_token', token);
  } else {
    localStorage.removeItem('cineverse_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'An unknown server error occurred' }));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  
  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  
  demoLogin: () =>
    request<{ token: string; user: User }>('/auth/demo-login', { method: 'POST' }),
  
  logout: () =>
    request<{ message: string }>('/auth/logout', { method: 'POST' }),
  
  me: () =>
    request<{ user: User }>('/auth/me'),
  
  forgotPassword: (email: string) =>
    request<{ message: string; devOtp?: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  
  resetPassword: (data: { email: string; code: string; newPassword: string }) =>
    request<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  
  updateAccount: (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) =>
    request<{ user: User; message: string }>('/auth/account', { method: 'PUT', body: JSON.stringify(data) }),
  
  getAvatars: () =>
    request<{ avatars: AvatarPreset[] }>('/auth/avatars'),

  // Profiles
  getProfiles: () =>
    request<{ profiles: Profile[] }>('/profiles'),
  
  createProfile: (data: { name: string; avatar?: string; isKid?: boolean; pin?: string | null; maturityLimit?: string }) =>
    request<{ profile: Profile }>('/profiles', { method: 'POST', body: JSON.stringify(data) }),
  
  updateProfile: (id: string, data: Partial<Profile>) =>
    request<{ profile: Profile }>(`/profiles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  
  deleteProfile: (id: string) =>
    request<{ message: string }>(`/profiles/${id}`, { method: 'DELETE' }),
  
  verifyPin: (id: string, pin: string) =>
    request<{ verified: boolean }>(`/profiles/${id}/verify-pin`, { method: 'POST', body: JSON.stringify({ pin }) }),
  
  toggleWatchlist: (profileId: string, movieId: number) =>
    request<{ inWatchlist: boolean; watchlist: number[] }>(`/profiles/${profileId}/watchlist`, {
      method: 'POST',
      body: JSON.stringify({ movieId })
    }),
  
  setRating: (profileId: string, movieId: number, rating: 'like' | 'dislike' | 'none') =>
    request<{ likes: number[]; dislikes: number[] }>(`/profiles/${profileId}/rating`, {
      method: 'POST',
      body: JSON.stringify({ movieId, rating })
    }),
  
  recordHistory: (profileId: string, movieId: number, progress: number) =>
    request<{ history: any[] }>(`/profiles/${profileId}/history`, {
      method: 'POST',
      body: JSON.stringify({ movieId, progress })
    }),
  
  updatePreferences: (profileId: string, preferences: Partial<Profile['preferences']>) =>
    request<{ preferences: Profile['preferences'] }>(`/profiles/${profileId}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences)
    }),

  // Movies
  getTrending: () =>
    request<{ results: Movie[]; hasTmdbKey: boolean }>('/movies/trending'),
  
  getPopular: () =>
    request<{ results: Movie[] }>('/movies/popular'),
  
  getTopRated: () =>
    request<{ results: Movie[] }>('/movies/top-rated'),
  
  getUpcoming: () =>
    request<{ results: Movie[] }>('/movies/upcoming'),
  
  getGenres: () =>
    request<{ genres: Genre[] }>('/movies/genres'),
  
  getMoviesByGenre: (genreId: number) =>
    request<{ results: Movie[] }>(`/movies/genre/${genreId}`),
  
  searchMovies: (params: { q?: string; genre?: number; year?: string; sortBy?: string }) => {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.genre) query.set('genre', params.genre.toString());
    if (params.year) query.set('year', params.year);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    return request<{ results: Movie[]; total: number }>(`/movies/search?${query.toString()}`);
  },
  
  getMovieDetails: (id: number) =>
    request<{ movie: Movie }>(`/movies/${id}`),
  
  getMoviesBatch: (ids: number[]) =>
    request<{ results: Movie[] }>(`/movies/batch?ids=${ids.join(',')}`),

  // AI
  getAiRecommendations: (params: {
    mood?: string;
    companion?: string;
    era?: string;
    pace?: string;
    customQuery?: string;
    profilePreferences?: any;
    maturityLimit?: string;
  }) =>
    request<{ recommendations: Movie[]; poweredBy: string }>('/ai/recommend', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  getAiExplanation: (data: { movieId: number; movieTitle: string; profileName: string; profileGenres?: string[] }) =>
    request<{ explanation: string }>('/ai/explain', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  chatWithAi: (data: { message: string; history?: any[] }) =>
    request<{ reply: string; source: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};
