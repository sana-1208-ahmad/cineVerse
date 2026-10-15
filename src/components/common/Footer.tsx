import React from 'react';
import { Film, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0e0e0e] border-t border-white/5 py-12 mt-20 text-[#c6c6c7] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#e50914] flex items-center justify-center shadow-lg shadow-[#e50914]/30">
                <span className="text-white font-black text-lg">C</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-lg font-black tracking-tight text-white">CINE</span>
                <span className="text-lg font-black tracking-tight text-[#e50914]">VERSE</span>
              </div>
            </div>
            <p className="text-xs text-[#c6c6c7]/80 leading-relaxed">
              Full-Stack AI-Powered Movie Discovery Platform. Experience next-generation cinematic streaming recommendations driven by Gemini 2.5 Flash and verified TMDB metadata.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/" className="hover:text-white transition-colors">Home & Featured</a></li>
              <li><a href="/browse?sortBy=popularity" className="hover:text-white transition-colors">Trending Now</a></li>
              <li><a href="/browse?sortBy=rating" className="hover:text-white transition-colors">Top Rated Masterpieces</a></li>
              <li><a href="/watchlist" className="hover:text-white transition-colors">My Watchlist</a></li>
              <li><a href="/ai-assistant" className="hover:text-[#e50914] flex items-center gap-1 transition-colors"><Sparkles className="w-3 h-3 text-[#e50914]" /> AI Movie Navigator</a></li>
            </ul>
          </div>

          {/* Settings & Account */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Preferences</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/profiles" className="hover:text-white transition-colors">Manage Profiles</a></li>
              <li><a href="/settings/preferences" className="hover:text-white transition-colors">Viewing Preferences</a></li>
              <li><a href="/settings/parental" className="hover:text-white transition-colors">Parental Controls & PIN</a></li>
              <li><a href="/settings/account" className="hover:text-white transition-colors">Account & Membership</a></li>
            </ul>
          </div>

          {/* TMDB Official Attribution & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Data & API Partners</h4>
            <div className="p-3 bg-[#181818] rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="px-2 py-0.5 bg-[#01b4e4] rounded text-[10px] font-black text-slate-900 tracking-wider">
                  TMDB
                </div>
                <span className="text-xs text-white font-semibold">The Movie Database</span>
              </div>
              <p className="text-[11px] text-[#c6c6c7]/80 leading-normal">
                “This product uses the TMDB API but is not endorsed or certified by TMDB.”
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#c6c6c7]/60">
          <p>© {new Date().getFullYear()} CineVerse Inc. All rights reserved. Cinematic theme inspired by Google Stitch designs.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
