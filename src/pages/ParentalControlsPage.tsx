import React, { useState } from 'react';
import { Shield, Lock, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const MATURITY_LEVELS: { level: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17'; label: string; desc: string }[] = [
  { level: 'G', label: 'G — All Ages', desc: 'Suitable for general audiences and young children.' },
  { level: 'PG', label: 'PG — Parental Guidance', desc: 'Some material may not be suitable for young children.' },
  { level: 'PG-13', label: 'PG-13 — Teens & Above', desc: 'Parents strongly cautioned; appropriate for age 13+.' },
  { level: 'R', label: 'R — Mature Audiences', desc: 'Requires accompanying adult for under 17 in cinemas.' },
  { level: 'NC-17', label: 'NC-17 — Adults Only', desc: 'No content restrictions; all cinematic titles displayed.' }
];

export const ParentalControlsPage: React.FC = () => {
  const { currentProfile, updateCurrentProfile } = useAuth();

  const [selectedMaturity, setSelectedMaturity] = useState<'G' | 'PG' | 'PG-13' | 'R' | 'NC-17'>(
    currentProfile?.maturityLimit || 'NC-17'
  );
  const [pin, setPin] = useState(currentProfile?.pin || '');
  const [isKid, setIsKid] = useState(currentProfile?.isKid || false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProfile) return;
    setSaving(true);
    setSavedMsg(false);

    try {
      await updateCurrentProfile({
        maturityLimit: selectedMaturity,
        pin: pin.trim() ? pin.trim() : null,
        isKid
      });
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      console.error('Failed to update parental controls:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <Shield className="w-8 h-8 text-[#e50914]" /> Parental Controls & Restrictions
        </h1>
        <p className="text-xs sm:text-sm text-[#c6c6c7] mt-1">
          Control maximum maturity ratings, lock profiles with a 4-digit PIN, and protect family members from mature themes.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Parental controls updated successfully for profile "{currentProfile?.name}".</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card Summary */}
        <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-white/5 flex items-center space-x-4">
          <img
            src={currentProfile?.avatar}
            alt={currentProfile?.name}
            className="w-14 h-14 rounded-xl object-cover ring-2 ring-white/10"
          />
          <div>
            <h3 className="font-bold text-white text-base">{currentProfile?.name}</h3>
            <p className="text-xs text-[#c6c6c7]">
              Current status: <span className="text-[#55e074] font-semibold">{currentProfile?.isKid ? 'Kids Safe Zone' : 'Standard Profile'}</span>
            </p>
          </div>
        </div>

        {/* Kids Mode Toggle */}
        <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Enable Kids Experience Mode</h3>
            <p className="text-xs text-[#c6c6c7] max-w-lg">
              Locks content to animations, family adventures, and titles rated PG and below. Automatically hides gritty themes.
            </p>
          </div>
          <input
            type="checkbox"
            checked={isKid}
            onChange={e => {
              setIsKid(e.target.checked);
              if (e.target.checked) setSelectedMaturity('PG');
            }}
            className="w-6 h-6 accent-[#e50914] cursor-pointer"
          />
        </div>

        {/* Maturity Rating Picker */}
        <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-white/5 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Maximum Allowed Content Rating
          </h2>
          <p className="text-xs text-[#c6c6c7]">
            Titles with ratings above the selected threshold will be hidden from search results and recommendations.
          </p>

          <div className="space-y-2 pt-2">
            {MATURITY_LEVELS.map(m => {
              const isSelected = selectedMaturity === m.level;
              return (
                <div
                  key={m.level}
                  onClick={() => !isKid && setSelectedMaturity(m.level)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#e50914] bg-[#e50914]/15 shadow-md'
                      : 'border-white/5 bg-[#131313] hover:border-white/20'
                  } ${isKid ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-12 text-center py-1 rounded bg-black/60 font-black text-xs text-white border border-white/10">
                      {m.level}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{m.label}</p>
                      <p className="text-[11px] text-[#c6c6c7]">{m.desc}</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-[#e50914] bg-[#e50914]' : 'border-white/30'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profile Lock PIN */}
        <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-white/5 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#e50914]" /> Profile Lock PIN (4 Digits)
          </h2>
          <p className="text-xs text-[#c6c6c7]">
            Require a 4-digit PIN to open or switch into this profile. Leave empty to allow unlocked access.
          </p>

          <div className="max-w-xs space-y-2">
            <input
              type="password"
              maxLength={4}
              placeholder="e.g. 1234"
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-2.5 text-center text-lg font-bold text-white tracking-widest focus:outline-none focus:border-[#e50914]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-[#e50914] hover:bg-[#f40612] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#e50914]/20 transition-all hover:scale-105 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Restrictions'}
          </button>
        </div>
      </form>
    </div>
  );
};
