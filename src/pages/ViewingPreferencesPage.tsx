import React, { useState } from 'react';
import { Sliders, Check, Globe, Tv, Volume2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const AVAILABLE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }
];

const PLATFORMS = ['Netflix', 'Max', 'Apple TV+', 'Disney+', 'Criterion Channel', 'Prime Video', 'MUBI'];
const LANGUAGES = [
  { code: 'en', name: 'English (Original Audio)' },
  { code: 'ja', name: 'Japanese (Nihongo)' },
  { code: 'ko', name: 'Korean (Hangul)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'de', name: 'German (Deutsch)' }
];

export const ViewingPreferencesPage: React.FC = () => {
  const { currentProfile, updateCurrentProfile } = useAuth();

  const [genres, setGenres] = useState<number[]>(currentProfile?.preferences?.preferredGenres || [878, 18, 53]);
  const [languages, setLanguages] = useState<string[]>(currentProfile?.preferences?.preferredLanguages || ['en']);
  const [platforms, setPlatforms] = useState<string[]>(currentProfile?.preferences?.streamingPlatforms || ['Netflix', 'Max']);
  const [autoplayTrailers, setAutoplayTrailers] = useState(currentProfile?.preferences?.autoplayTrailers ?? true);
  const [autoplayNext, setAutoplayNext] = useState(currentProfile?.preferences?.autoplayNext ?? true);
  
  const [savedMsg, setSavedMsg] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleGenre = (id: number) => {
    if (genres.includes(id)) {
      setGenres(genres.filter(g => g !== id));
    } else {
      setGenres([...genres, id]);
    }
  };

  const togglePlatform = (p: string) => {
    if (platforms.includes(p)) {
      setPlatforms(platforms.filter(item => item !== p));
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const toggleLanguage = (code: string) => {
    if (languages.includes(code)) {
      if (languages.length > 1) {
        setLanguages(languages.filter(l => l !== code));
      }
    } else {
      setLanguages([...languages, code]);
    }
  };

  const handleSave = async () => {
    if (!currentProfile) return;
    setSaving(true);
    setSavedMsg(false);

    try {
      await api.updatePreferences(currentProfile.id, {
        preferredGenres: genres,
        preferredLanguages: languages,
        streamingPlatforms: platforms,
        autoplayTrailers,
        autoplayNext
      });
      await updateCurrentProfile({
        preferences: {
          preferredGenres: genres,
          preferredLanguages: languages,
          streamingPlatforms: platforms,
          autoplayTrailers,
          autoplayNext
        }
      });
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Viewing Preferences</h1>
          <p className="text-xs sm:text-sm text-[#c6c6c7] mt-1">
            Personalize your recommendation algorithm, language defaults, and streaming catalogs for <span className="text-white font-bold">"{currentProfile?.name}"</span>.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#e50914] hover:bg-[#f40612] text-white text-xs font-bold shadow-lg transition-all disabled:opacity-50 w-fit"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Preferences saved successfully! AI Navigator has updated its profile weights.</span>
        </div>
      )}

      {/* Preferred Genres */}
      <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-white/5 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#e50914]" /> Affinity Genres (Algorithmic Weighting)
        </h2>
        <p className="text-xs text-[#c6c6c7]">
          Select the genres you gravitate toward most often. CineVerse AI uses these to calculate your home row priority.
        </p>
        <div className="flex flex-wrap gap-2.5 pt-2">
          {AVAILABLE_GENRES.map(genre => {
            const isSelected = genres.includes(genre.id);
            return (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'border-[#e50914] bg-[#e50914] text-white shadow-md shadow-[#e50914]/20'
                    : 'border-white/10 bg-[#131313] text-[#c6c6c7] hover:border-white/30'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{genre.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Streaming Platform Services */}
      <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-white/5 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Tv className="w-4 h-4 text-[#e50914]" /> Streaming Availability Subscriptions
        </h2>
        <p className="text-xs text-[#c6c6c7]">
          Filter and emphasize titles available through the streaming catalogs you subscribe to.
        </p>
        <div className="flex flex-wrap gap-2.5 pt-2">
          {PLATFORMS.map(platform => {
            const isSelected = platforms.includes(platform);
            return (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'border-[#55e074] bg-[#55e074]/20 text-[#55e074]'
                    : 'border-white/10 bg-[#131313] text-[#c6c6c7] hover:border-white/30'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{platform}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Preferences */}
      <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-white/5 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#e50914]" /> Audio & Subtitle Languages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {LANGUAGES.map(lang => {
            const isSelected = languages.includes(lang.code);
            return (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#e50914] bg-[#e50914]/10 text-white'
                    : 'border-white/10 bg-[#131313] text-[#c6c6c7]'
                }`}
              >
                <span className="text-xs font-semibold">{lang.name}</span>
                {isSelected && <Check className="w-4 h-4 text-[#e50914]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-white/5 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-[#e50914]" /> Playback Behavior
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div>
              <p className="text-xs font-semibold text-white">Autoplay Previews & Trailers</p>
              <p className="text-[11px] text-[#c6c6c7]">Automatically play cinematic trailers while browsing</p>
            </div>
            <input
              type="checkbox"
              checked={autoplayTrailers}
              onChange={e => setAutoplayTrailers(e.target.checked)}
              className="w-5 h-5 accent-[#e50914] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div>
              <p className="text-xs font-semibold text-white">Autoplay Next Recommendation</p>
              <p className="text-[11px] text-[#c6c6c7]">Continuously advance to related titles automatically</p>
            </div>
            <input
              type="checkbox"
              checked={autoplayNext}
              onChange={e => setAutoplayNext(e.target.checked)}
              className="w-5 h-5 accent-[#e50914] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
