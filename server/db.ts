import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface UserProfile {
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

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
  membershipPlan: 'Premium 4K Ultra HD' | 'Standard Full HD';
  profiles: UserProfile[];
  resetToken?: string | null;
  resetExpires?: number | null;
}

interface DatabaseSchema {
  users: UserAccount[];
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'cineverse-db.json');

export const AVATAR_PRESETS = [
  { id: 'av-1', name: 'Cyber Neon', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', category: 'Futuristic' },
  { id: 'av-2', name: 'Action Hero', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', category: 'Action' },
  { id: 'av-3', name: 'Sci-Fi Explorer', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80', category: 'Sci-Fi' },
  { id: 'av-4', name: 'Vintage Noir', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', category: 'Classic' },
  { id: 'av-5', name: 'Anime Fox', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80', category: 'Kids' },
  { id: 'av-6', name: 'Space Cadet', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80', category: 'Sci-Fi' },
  { id: 'av-7', name: 'Golden Era', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', category: 'Classic' },
  { id: 'av-8', name: 'Director Chair', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80', category: 'Filmmaker' },
  { id: 'av-9', name: 'Cute Panda', url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef6?auto=format&fit=crop&w=300&q=80', category: 'Kids' },
  { id: 'av-10', name: 'Cyberpunk Rebel', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80', category: 'Futuristic' },
  { id: 'av-11', name: 'Popcorn Lover', url: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=300&q=80', category: 'Cinema' },
  { id: 'av-12', name: 'Shadow Detective', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80', category: 'Mystery' }
];

class Database {
  private data: DatabaseSchema = { users: [] };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse database file, re-initializing seeds:', err);
        this.seedDefaults();
      }
    } else {
      this.seedDefaults();
    }
  }

  private seedDefaults() {
    const defaultPasswordHash = bcrypt.hashSync('password123', 10);
    const demoUser: UserAccount = {
      id: 'usr-demo-01',
      email: 'sana@cineverse.io',
      name: 'Sana Ahmad',
      passwordHash: defaultPasswordHash,
      createdAt: new Date().toISOString(),
      membershipPlan: 'Premium 4K Ultra HD',
      profiles: [
        {
          id: 'prof-sana',
          name: 'Sana',
          avatar: AVATAR_PRESETS[0].url,
          isKid: false,
          pin: null,
          maturityLimit: 'NC-17',
          watchlist: [693134, 157336, 27205, 335984], // Dune 2, Interstellar, Inception, Blade Runner 2049
          likes: [693134, 157336, 872585],
          dislikes: [],
          history: [
            { movieId: 693134, progress: 85, watchedAt: new Date(Date.now() - 3600000).toISOString() },
            { movieId: 157336, progress: 100, watchedAt: new Date(Date.now() - 86400000).toISOString() }
          ],
          preferences: {
            preferredGenres: [878, 18, 53], // Sci-Fi, Drama, Thriller
            preferredLanguages: ['en', 'ja'],
            streamingPlatforms: ['Netflix', 'Max', 'Apple TV+'],
            autoplayTrailers: true,
            autoplayNext: true
          }
        },
        {
          id: 'prof-alex',
          name: 'Alex',
          avatar: AVATAR_PRESETS[1].url,
          isKid: false,
          pin: null,
          maturityLimit: 'R',
          watchlist: [155, 603, 299536],
          likes: [155, 603],
          dislikes: [],
          history: [
            { movieId: 155, progress: 45, watchedAt: new Date(Date.now() - 7200000).toISOString() }
          ],
          preferences: {
            preferredGenres: [28, 80, 53],
            preferredLanguages: ['en'],
            streamingPlatforms: ['Netflix', 'Disney+'],
            autoplayTrailers: true,
            autoplayNext: true
          }
        },
        {
          id: 'prof-kids',
          name: 'Kids Zone',
          avatar: AVATAR_PRESETS[4].url,
          isKid: true,
          pin: '1234',
          maturityLimit: 'PG',
          watchlist: [569094, 129, 508947, 671],
          likes: [569094, 129],
          dislikes: [],
          history: [
            { movieId: 569094, progress: 90, watchedAt: new Date(Date.now() - 14400000).toISOString() }
          ],
          preferences: {
            preferredGenres: [16, 10751, 14],
            preferredLanguages: ['en'],
            streamingPlatforms: ['Disney+'],
            autoplayTrailers: false,
            autoplayNext: true
          }
        },
        {
          id: 'prof-cinephile',
          name: 'Film Buff',
          avatar: AVATAR_PRESETS[3].url,
          isKid: false,
          pin: null,
          maturityLimit: 'NC-17',
          watchlist: [496243, 680, 278, 238],
          likes: [496243, 278],
          dislikes: [],
          history: [],
          preferences: {
            preferredGenres: [18, 80, 36, 9648],
            preferredLanguages: ['en', 'ko', 'fr'],
            streamingPlatforms: ['Criterion', 'MUBI', 'Max'],
            autoplayTrailers: true,
            autoplayNext: false
          }
        }
      ]
    };

    this.data.users = [demoUser];
    this.persist();
  }

  private persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  // Users API
  public findUserByEmail(email: string): UserAccount | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): UserAccount | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(user: { email: string; passwordHash: string; name: string }): UserAccount {
    const newUser: UserAccount = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: user.email.toLowerCase(),
      name: user.name,
      passwordHash: user.passwordHash,
      createdAt: new Date().toISOString(),
      membershipPlan: 'Premium 4K Ultra HD',
      profiles: [
        {
          id: `prof-${Date.now()}`,
          name: user.name.split(' ')[0] || 'User',
          avatar: AVATAR_PRESETS[0].url,
          isKid: false,
          pin: null,
          maturityLimit: 'NC-17',
          watchlist: [693134, 157336],
          likes: [693134],
          dislikes: [],
          history: [],
          preferences: {
            preferredGenres: [28, 878, 18],
            preferredLanguages: ['en'],
            streamingPlatforms: ['Netflix'],
            autoplayTrailers: true,
            autoplayNext: true
          }
        }
      ]
    };
    this.data.users.push(newUser);
    this.persist();
    return newUser;
  }

  public updateUser(userId: string, updates: Partial<UserAccount>): UserAccount | null {
    const user = this.findUserById(userId);
    if (!user) return null;
    Object.assign(user, updates);
    this.persist();
    return user;
  }

  // Profiles API
  public getProfiles(userId: string): UserProfile[] {
    const user = this.findUserById(userId);
    return user ? user.profiles : [];
  }

  public getProfileById(userId: string, profileId: string): UserProfile | null {
    const user = this.findUserById(userId);
    if (!user) return null;
    return user.profiles.find(p => p.id === profileId) || null;
  }

  public createProfile(userId: string, profileData: { name: string; avatar?: string; isKid?: boolean; pin?: string | null; maturityLimit?: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' }): UserProfile | null {
    const user = this.findUserById(userId);
    if (!user) return null;
    if (user.profiles.length >= 5) {
      throw new Error('Maximum of 5 profiles per account reached');
    }

    const newProfile: UserProfile = {
      id: `prof-${Date.now()}`,
      name: profileData.name,
      avatar: profileData.avatar || AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)].url,
      isKid: Boolean(profileData.isKid),
      pin: profileData.pin || null,
      maturityLimit: profileData.maturityLimit || (profileData.isKid ? 'PG' : 'NC-17'),
      watchlist: [],
      likes: [],
      dislikes: [],
      history: [],
      preferences: {
        preferredGenres: profileData.isKid ? [16, 10751] : [28, 878, 18],
        preferredLanguages: ['en'],
        streamingPlatforms: ['Netflix'],
        autoplayTrailers: true,
        autoplayNext: true
      }
    };

    user.profiles.push(newProfile);
    this.persist();
    return newProfile;
  }

  public updateProfile(userId: string, profileId: string, updates: Partial<UserProfile>): UserProfile | null {
    const user = this.findUserById(userId);
    if (!user) return null;
    const profile = user.profiles.find(p => p.id === profileId);
    if (!profile) return null;

    Object.assign(profile, updates);
    this.persist();
    return profile;
  }

  public deleteProfile(userId: string, profileId: string): boolean {
    const user = this.findUserById(userId);
    if (!user) return false;
    if (user.profiles.length <= 1) {
      throw new Error('Cannot delete the primary profile');
    }
    const idx = user.profiles.findIndex(p => p.id === profileId);
    if (idx === -1) return false;
    user.profiles.splice(idx, 1);
    this.persist();
    return true;
  }

  public toggleWatchlist(userId: string, profileId: string, movieId: number): { inWatchlist: boolean; watchlist: number[] } | null {
    const profile = this.getProfileById(userId, profileId);
    if (!profile) return null;

    const exists = profile.watchlist.includes(movieId);
    if (exists) {
      profile.watchlist = profile.watchlist.filter(id => id !== movieId);
    } else {
      profile.watchlist.push(movieId);
    }
    this.persist();
    return { inWatchlist: !exists, watchlist: profile.watchlist };
  }

  public setRating(userId: string, profileId: string, movieId: number, rating: 'like' | 'dislike' | 'none'): UserProfile | null {
    const profile = this.getProfileById(userId, profileId);
    if (!profile) return null;

    profile.likes = profile.likes.filter(id => id !== movieId);
    profile.dislikes = profile.dislikes.filter(id => id !== movieId);

    if (rating === 'like') {
      profile.likes.push(movieId);
    } else if (rating === 'dislike') {
      profile.dislikes.push(movieId);
    }

    this.persist();
    return profile;
  }

  public recordWatchProgress(userId: string, profileId: string, movieId: number, progress: number): UserProfile | null {
    const profile = this.getProfileById(userId, profileId);
    if (!profile) return null;

    const existing = profile.history.find(h => h.movieId === movieId);
    if (existing) {
      existing.progress = progress;
      existing.watchedAt = new Date().toISOString();
    } else {
      profile.history.unshift({
        movieId,
        progress,
        watchedAt: new Date().toISOString()
      });
      if (profile.history.length > 30) {
        profile.history = profile.history.slice(0, 30);
      }
    }

    this.persist();
    return profile;
  }
}

export const db = new Database();
