import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { AvatarPreset } from '../../types';
import { api } from '../../services/api';

interface AvatarPickerModalProps {
  currentAvatar: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({ currentAvatar, onSelect, onClose }) => {
  const [avatars, setAvatars] = useState<AvatarPreset[]>([]);
  const [selected, setSelected] = useState(currentAvatar);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    api.getAvatars().then(res => setAvatars(res.avatars)).catch(() => {});
  }, []);

  const categories = ['All', ...Array.from(new Set(avatars.map(a => a.category)))];

  const filtered = activeCategory === 'All' ? avatars : avatars.filter(a => a.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#1c1b1b] rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Choose Your Profile Avatar</h3>
            <p className="text-xs text-[#c6c6c7] mt-0.5">Select a character icon that defines your cinematic personality.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                activeCategory === cat
                  ? 'bg-[#e50914] text-white font-semibold'
                  : 'bg-white/5 text-[#c6c6c7] hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Avatars Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-80 overflow-y-auto no-scrollbar py-2">
          {filtered.map(avatar => {
            const isChosen = selected === avatar.url;
            return (
              <button
                key={avatar.id}
                onClick={() => setSelected(avatar.url)}
                className={`relative group rounded-xl overflow-hidden aspect-square border-2 transition-all p-1 ${
                  isChosen
                    ? 'border-[#e50914] scale-105 shadow-lg shadow-[#e50914]/20'
                    : 'border-transparent hover:border-white/40'
                }`}
              >
                <img
                  src={avatar.url}
                  alt={avatar.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <span className="absolute bottom-1 inset-x-1 text-[10px] text-center font-medium bg-black/60 backdrop-blur-xs text-white rounded py-0.5 truncate">
                  {avatar.name}
                </span>
                {isChosen && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#c6c6c7] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSelect(selected);
              onClose();
            }}
            className="px-6 py-2 rounded-lg bg-[#e50914] hover:bg-[#f40612] text-white text-xs font-bold shadow-md shadow-[#e50914]/20 transition-all hover:scale-105"
          >
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
};
