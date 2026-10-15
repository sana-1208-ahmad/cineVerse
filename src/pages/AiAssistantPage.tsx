import React, { useState } from 'react';
import { Sparkles, MessageSquare, Compass, Send, RefreshCw, Play, Plus, Check, Flame, Brain, Coffee, Skull, Smile, Film, User, Users, Heart } from 'lucide-react';
import { Movie } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';

const MOODS = [
  { id: 'mind-bending', label: 'Mind-Bending Sci-Fi', icon: Brain, description: 'Reality-bending concepts & deep cosmic mysteries' },
  { id: 'adrenaline', label: 'Adrenaline Rush', icon: Flame, description: 'High-octane action & thrilling chases' },
  { id: 'cozy', label: 'Cozy & Chill', icon: Coffee, description: 'Warm visuals, comforting narratives, and gentle pacing' },
  { id: 'dark-thriller', label: 'Dark Crime & Noir', icon: Skull, description: 'Gritty investigations, moral ambiguity & suspense' },
  { id: 'feel-good', label: 'Heartwarming', icon: Smile, description: 'Uplifting journeys, triumph, and emotional resonance' },
  { id: 'date-night', label: 'Date Night Cinema', icon: Heart, description: 'Engaging, witty, and emotionally captivating' }
];

const COMPANIONS = ['Solo Night', 'Date Night', 'With Friends', 'Family & Kids'];
const ERAS = ['Any Era', 'Modern (2020-Present)', '2010s Golden Wave', '90s & 2000s Classics', 'Vintage Masterpieces'];
const PACING = ['Any Pacing', 'Relentless & Fast', 'Balanced Momentum', 'Slow Burn & Atmospheric'];

export const AiAssistantPage: React.FC = () => {
  const { currentProfile } = useAuth();
  const { openTrailer, openMovieDetails, toggleWatchlist, isInWatchlist } = useMovies();

  // State
  const [selectedMood, setSelectedMood] = useState('mind-bending');
  const [selectedCompanion, setSelectedCompanion] = useState('Solo Night');
  const [selectedEra, setSelectedEra] = useState('Any Era');
  const [selectedPace, setSelectedPace] = useState('Balanced Momentum');
  const [customPrompt, setCustomPrompt] = useState('');
  
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [poweredBy, setPoweredBy] = useState('Gemini 2.5 Flash');

  // Conversational Chat tab state
  const [activeTab, setActiveTab] = useState<'matrix' | 'chat'>('matrix');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: `Hello ${currentProfile?.name || 'film lover'}! I'm CineBot, your personal film scholar powered by Gemini. Tell me what vibe or storyline you're craving tonight!`,
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  // Trigger AI recommendation
  const handleGetRecommendations = async (overridePrompt?: string) => {
    setLoadingRecs(true);
    try {
      const moodObj = MOODS.find(m => m.id === selectedMood);
      const res = await api.getAiRecommendations({
        mood: moodObj ? moodObj.label : selectedMood,
        companion: selectedCompanion,
        era: selectedEra,
        pace: selectedPace,
        customQuery: overridePrompt || customPrompt,
        profilePreferences: currentProfile?.preferences,
        maturityLimit: currentProfile?.maturityLimit
      });

      setRecommendations(res.recommendations || []);
      setPoweredBy(res.poweredBy || 'Gemini 2.5 Flash');
    } catch (err) {
      console.error('Error generating AI recommendations:', err);
    } finally {
      setLoadingRecs(false);
    }
  };

  // Conversational Chat submit
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || sendingChat) return;

    const userText = chatInput.trim();
    setChatInput('');
    const newHistory = [
      ...messages,
      { sender: 'user' as const, text: userText, time: 'Just now' }
    ];
    setMessages(newHistory);
    setSendingChat(true);

    try {
      const res = await api.chatWithAi({
        message: userText,
        history: newHistory.slice(-6).map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }))
      });

      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: res.reply, time: 'Just now' }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: "I'm having a brief connection hitch, but I'd still recommend checking out Dune: Part Two or Interstellar for unmatched scope!", time: 'Just now' }
      ]);
    } finally {
      setSendingChat(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#e50914]/20 via-[#201f1f] to-[#131313] border border-[#e50914]/30 p-6 sm:p-10 mb-8 shadow-2xl">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e50914] text-white font-bold text-xs shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              {poweredBy}
            </span>
            <span className="text-xs text-[#c6c6c7]">Semantic Discovery Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            CineVerse AI Navigator
          </h1>
          <p className="text-sm sm:text-base text-[#c6c6c7] leading-relaxed">
            Move beyond conventional algorithms. Describe your mood, who you're watching with, or a specific cinematic tone, and let Gemini generate tailored recommendations with verified TMDB data.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center space-x-3 pt-3">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'matrix'
                  ? 'bg-white text-black shadow-lg scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Mood & Criteria Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-black shadow-lg scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask CineBot (Chat)</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'matrix' ? (
        <div className="space-y-10">
          {/* Step 1: Mood Matrix */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>1. Select Your Current Mood</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {MOODS.map(m => {
                const Icon = m.icon;
                const isSelected = selectedMood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.id)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between h-32 ${
                      isSelected
                        ? 'border-[#e50914] bg-[#e50914]/15 shadow-xl shadow-[#e50914]/20 scale-[1.02]'
                        : 'border-white/5 bg-[#1c1b1b] hover:border-white/20 hover:bg-[#201f1f]'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-[#e50914]' : 'text-[#c6c6c7]'}`} />
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-white leading-snug">{m.label}</p>
                      <p className="text-[10px] text-[#c6c6c7] line-clamp-2 mt-0.5">{m.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Preference Filters */}
          <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-white/5 space-y-6">
            <h2 className="text-lg font-bold text-white">2. Fine-Tune Viewing Parameters</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Companion */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#c6c6c7] uppercase tracking-wider">
                  Watching With
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMPANIONS.map(comp => (
                    <button
                      key={comp}
                      onClick={() => setSelectedCompanion(comp)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        selectedCompanion === comp
                          ? 'border-[#e50914] bg-[#e50914] text-white font-semibold'
                          : 'border-white/10 bg-[#131313] text-[#c6c6c7] hover:text-white'
                      }`}
                    >
                      {comp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Era */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#c6c6c7] uppercase tracking-wider">
                  Preferred Era
                </label>
                <select
                  value={selectedEra}
                  onChange={e => setSelectedEra(e.target.value)}
                  className="w-full bg-[#131313] border border-white/10 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#e50914]"
                >
                  {ERAS.map(era => (
                    <option key={era} value={era}>{era}</option>
                  ))}
                </select>
              </div>

              {/* Pace */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#c6c6c7] uppercase tracking-wider">
                  Narrative Pace
                </label>
                <select
                  value={selectedPace}
                  onChange={e => setSelectedPace(e.target.value)}
                  className="w-full bg-[#131313] border border-white/10 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#e50914]"
                >
                  {PACING.map(pace => (
                    <option key={pace} value={pace}>{pace}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Natural Language Input */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="text-xs font-semibold text-[#c6c6c7] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e50914]" />
                Any Specific Desires or Similar Titles? (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 'Like Blade Runner 2049 with intense soundtrack and rain', 'Twisty mystery with unexpected ending'..."
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e50914] transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#c6c6c7]">
                Tailored for profile <span className="text-white font-semibold">"{currentProfile?.name}"</span>
              </span>
              <button
                onClick={() => handleGetRecommendations()}
                disabled={loadingRecs}
                className="flex items-center space-x-2 bg-[#e50914] hover:bg-[#f40612] text-white text-sm font-bold px-8 py-3 rounded-xl shadow-lg shadow-[#e50914]/30 hover:scale-105 transition-all disabled:opacity-50"
              >
                {loadingRecs ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Curating with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Discover Movies</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 3: Recommendation Results */}
          {recommendations.length > 0 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>CineVerse AI Curated Recommendations</span>
                  </h2>
                  <p className="text-xs text-[#c6c6c7] mt-0.5">
                    Matches verified with real TMDB metadata and runtime availability.
                  </p>
                </div>

                {/* Refinement Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-[#c6c6c7]">Refine:</span>
                  {[
                    'Make it more action-packed',
                    'Darker & grittier tone',
                    'Shorter under 100 mins',
                    'High critical acclaim'
                  ].map(refineText => (
                    <button
                      key={refineText}
                      onClick={() => handleGetRecommendations(refineText)}
                      className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/30 transition-colors"
                    >
                      {refineText}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((movie, idx) => {
                  const inList = isInWatchlist(movie.id);
                  return (
                    <div
                      key={`${movie.id}-${idx}`}
                      className="group bg-[#1c1b1b] rounded-2xl overflow-hidden border border-white/10 hover:border-[#e50914]/50 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
                    >
                      {/* Top Backdrop with Poster Badge */}
                      <div className="relative aspect-video w-full overflow-hidden bg-black">
                        <img
                          src={movie.backdrop_path}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-transparent" />

                        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#55e074] text-slate-950 font-black text-xs shadow">
                            {movie.ai_match_score || 96}% Match
                          </span>
                          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold border border-white/10">
                            {movie.maturity_rating || 'PG-13'}
                          </span>
                        </div>

                        <button
                          onClick={() => openTrailer(movie.trailer_key, movie.title, movie)}
                          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        >
                          <Play className="w-5 h-5 fill-black translate-x-0.5" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-[#e50914] transition-colors line-clamp-1">
                              {movie.title}
                            </h3>
                            <span className="text-xs text-[#c6c6c7] font-medium flex-shrink-0">
                              {movie.release_date?.slice(0, 4)}
                            </span>
                          </div>

                          {/* Vibe Tags */}
                          {movie.vibe_tags && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {movie.vibe_tags.map(tag => (
                                <span
                                  key={tag}
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/80"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Why You Will Love It (AI explanation card) */}
                          <div className="mt-3 p-3 rounded-xl bg-[#131313] border border-white/5 space-y-1">
                            <p className="text-[11px] font-bold text-[#e50914] flex items-center gap-1 uppercase tracking-wider">
                              <Sparkles className="w-3 h-3" /> Why this matches you
                            </p>
                            <p className="text-xs text-[#e5e2e1]/90 leading-relaxed italic">
                              “{movie.why_you_will_love_it || movie.overview.slice(0, 110) + '...'}”
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-2 pt-3 border-t border-white/5">
                          <button
                            onClick={() => openTrailer(movie.trailer_key, movie.title, movie)}
                            className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Trailer</span>
                          </button>

                          <button
                            onClick={() => toggleWatchlist(movie)}
                            className={`p-2 rounded-lg border transition-colors ${
                              inList
                                ? 'bg-[#e50914] border-[#e50914] text-white'
                                : 'bg-transparent border-white/20 text-white hover:border-white'
                            }`}
                            title={inList ? 'Remove from My List' : 'Add to My List'}
                          >
                            {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => openMovieDetails(movie)}
                            className="px-3 py-2 rounded-lg border border-white/10 text-xs text-[#c6c6c7] hover:text-white transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Conversational CineBot Chat Tab */
        <div className="max-w-3xl mx-auto bg-[#1c1b1b] rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="px-6 py-4 bg-[#131313] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">CineBot Film Scholar</h3>
                <p className="text-[11px] text-[#55e074] flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#55e074] animate-pulse" /> Live & Ready
                </p>
              </div>
            </div>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, idx) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={idx}
                  className={`flex ${isAi ? 'justify-start' : 'justify-end'} animate-in fade-in duration-200`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isAi
                        ? 'bg-[#201f1f] text-[#e5e2e1] border border-white/5'
                        : 'bg-[#e50914] text-white shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    <span className="block text-[10px] opacity-60 text-right mt-1.5">{m.time}</span>
                  </div>
                </div>
              );
            })}
            {sendingChat && (
              <div className="flex justify-start">
                <div className="bg-[#201f1f] text-[#c6c6c7] text-xs px-4 py-2.5 rounded-2xl animate-pulse">
                  CineBot is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendChat} className="p-4 bg-[#131313] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask CineBot anything... (e.g. 'What is a great Christopher Nolan double feature?')"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              className="flex-1 bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e50914]"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || sendingChat}
              className="w-12 h-12 rounded-xl bg-[#e50914] hover:bg-[#f40612] text-white flex items-center justify-center transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
