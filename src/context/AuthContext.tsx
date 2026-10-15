import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Profile } from '../types';
import { api, setStoredToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  currentProfile: Profile | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => Promise<void>;
  selectProfile: (profile: Profile, pin?: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  updateCurrentProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    async function initAuth() {
      try {
        const data = await api.me();
        if (data.user) {
          setUser(data.user);
          // Check if there was an active profile saved in localStorage
          const savedProfileId = localStorage.getItem('cineverse_active_profile');
          const found = data.user.profiles.find(p => p.id === savedProfileId);
          if (found) {
            setCurrentProfile(found);
          } else if (data.user.profiles.length > 0) {
            setCurrentProfile(data.user.profiles[0]);
          }
        }
      } catch (err) {
        // Not logged in or invalid token
        setUser(null);
        setCurrentProfile(null);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    setStoredToken(res.token);
    setUser(res.user);
    if (res.user.profiles.length > 0) {
      setCurrentProfile(res.user.profiles[0]);
      localStorage.setItem('cineverse_active_profile', res.user.profiles[0].id);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    const res = await api.register({ name, email, password: pass });
    setStoredToken(res.token);
    setUser(res.user);
    if (res.user.profiles.length > 0) {
      setCurrentProfile(res.user.profiles[0]);
      localStorage.setItem('cineverse_active_profile', res.user.profiles[0].id);
    }
  };

  const demoLogin = async () => {
    const res = await api.demoLogin();
    setStoredToken(res.token);
    setUser(res.user);
    if (res.user.profiles.length > 0) {
      setCurrentProfile(res.user.profiles[0]);
      localStorage.setItem('cineverse_active_profile', res.user.profiles[0].id);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore
    }
    setStoredToken(null);
    localStorage.removeItem('cineverse_active_profile');
    setUser(null);
    setCurrentProfile(null);
  };

  const selectProfile = async (profile: Profile, pin?: string): Promise<boolean> => {
    if (profile.pin) {
      if (!pin) return false;
      const verified = await api.verifyPin(profile.id, pin);
      if (!verified.verified) {
        throw new Error('Incorrect profile PIN');
      }
    }
    setCurrentProfile(profile);
    localStorage.setItem('cineverse_active_profile', profile.id);
    return true;
  };

  const refreshUser = async () => {
    try {
      const data = await api.me();
      if (data.user) {
        setUser(data.user);
        if (currentProfile) {
          const fresh = data.user.profiles.find(p => p.id === currentProfile.id);
          if (fresh) setCurrentProfile(fresh);
        }
      }
    } catch (e) {
      console.error('Error refreshing user:', e);
    }
  };

  const updateCurrentProfile = async (updates: Partial<Profile>) => {
    if (!currentProfile) return;
    const res = await api.updateProfile(currentProfile.id, updates);
    setCurrentProfile(res.profile);
    await refreshUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentProfile,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        selectProfile,
        refreshUser,
        updateCurrentProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
