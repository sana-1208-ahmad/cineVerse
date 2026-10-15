import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, Sparkles, ChevronDown, Plus, Settings, Sliders, Shield, LogOut, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, currentProfile, selectProfile, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Trending', path: '/browse?sortBy=popularity' },
    { name: 'Top Rated', path: '/browse?sortBy=rating' },
    { name: 'My List', path: '/watchlist' },
    {
      name: 'AI Navigator',
      path: '/ai-assistant',
      isAi: true
    }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#131313]/95 backdrop-blur-md shadow-2xl py-3 border-b border-white/5'
          : 'bg-gradient-to-b from-[#131313]/90 via-[#131313]/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand & Links */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-lg bg-[#e50914] flex items-center justify-center shadow-lg shadow-[#e50914]/30 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl tracking-tighter">C</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-black tracking-tight text-white">CINE</span>
              <span className="text-xl font-black tracking-tight text-[#e50914]">VERSE</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path || (link.path.includes('?') && location.search === link.path.split('?')[1]);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-[#c6c6c7] hover:text-white'
                  }`}
                >
                  {link.isAi && <Sparkles className="w-3.5 h-3.5 text-[#e50914] animate-pulse" />}
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Notifications, Profile Menu */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Titles, people, genres..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-[#201f1f] text-white text-sm px-3 py-1.5 pl-8 rounded-full border border-white/20 focus:border-[#e50914] focus:outline-none w-48 sm:w-64 transition-all"
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false);
                  }}
                />
                <Search className="w-4 h-4 text-[#c6c6c7] absolute left-2.5 pointer-events-none" />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-[#c6c6c7] hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-colors"
                title="Search movies"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* AI Navigator quick chip on mobile */}
          <Link
            to="/ai-assistant"
            className="md:hidden flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#e50914]/15 border border-[#e50914]/30 text-white font-medium"
          >
            <Sparkles className="w-3 h-3 text-[#e50914]" />
            AI
          </Link>

          {/* Profile Dropdown */}
          {user && currentProfile ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 group focus:outline-none"
              >
                <img
                  src={currentProfile.avatar}
                  alt={currentProfile.name}
                  className="w-8 h-8 rounded-md object-cover ring-2 ring-transparent group-hover:ring-[#e50914] transition-all"
                />
                <span className="hidden sm:inline text-xs font-medium text-white max-w-[80px] truncate">
                  {currentProfile.name}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#c6c6c7] transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#1c1b1b] border border-white/10 rounded-xl shadow-2xl py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-150">
                  {/* Profiles Switcher Header */}
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-xs font-semibold text-[#c6c6c7] uppercase tracking-wider mb-2">
                      Switch Profile
                    </p>
                    <div className="space-y-1">
                      {user.profiles.map(p => {
                        const isSelected = p.id === currentProfile.id;
                        return (
                          <button
                            key={p.id}
                            onClick={async () => {
                              try {
                                await selectProfile(p);
                                setDropdownOpen(false);
                              } catch (err: any) {
                                navigate('/profiles');
                              }
                            }}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors ${
                              isSelected
                                ? 'bg-[#e50914]/15 text-white'
                                : 'hover:bg-white/5 text-[#e5e2e1]'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={p.avatar}
                                alt={p.name}
                                className="w-6 h-6 rounded object-cover"
                              />
                              <span className="text-xs font-medium truncate max-w-[120px]">
                                {p.name}
                              </span>
                              {p.isKid && (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-bold">
                                  KIDS
                                </span>
                              )}
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#e50914]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Settings & Links */}
                  <div className="py-1">
                    <Link
                      to="/profiles"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-[#c6c6c7] hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Manage Profiles</span>
                    </Link>
                    <Link
                      to="/settings/preferences"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-[#c6c6c7] hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Sliders className="w-4 h-4" />
                      <span>Viewing Preferences</span>
                    </Link>
                    <Link
                      to="/settings/parental"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-[#c6c6c7] hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Parental Controls</span>
                    </Link>
                    <Link
                      to="/settings/account"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-[#c6c6c7] hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Account Settings</span>
                    </Link>
                  </div>

                  {/* Sign Out */}
                  <div className="border-t border-white/10 pt-1">
                    <button
                      onClick={async () => {
                        setDropdownOpen(false);
                        await logout();
                        navigate('/auth');
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out of CineVerse</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-[#e50914] hover:bg-[#f40612] text-white text-xs font-semibold px-4 py-2 rounded-md shadow-md shadow-[#e50914]/20 transition-all hover:scale-105"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
