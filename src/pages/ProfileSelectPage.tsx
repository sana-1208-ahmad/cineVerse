import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Check, Lock, Shield, Trash2, X } from 'lucide-react';
import { Profile } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AvatarPickerModal } from '../components/modals/AvatarPickerModal';
import { PinPromptModal } from '../components/modals/PinPromptModal';

export const ProfileSelectPage: React.FC = () => {
  const { user, currentProfile, selectProfile, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [isManaging, setIsManaging] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [pinPromptProfile, setPinPromptProfile] = useState<Profile | null>(null);

  // Form states for add/edit profile
  const [formName, setFormName] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formIsKid, setFormIsKid] = useState(false);
  const [formPin, setFormPin] = useState('');
  const [formMaturity, setFormMaturity] = useState<'G' | 'PG' | 'PG-13' | 'R' | 'NC-17'>('PG-13');
  const [error, setError] = useState<string | null>(null);

  const handleProfileClick = (profile: Profile) => {
    if (isManaging) {
      setEditingProfile(profile);
      setFormName(profile.name);
      setFormAvatar(profile.avatar);
      setFormIsKid(profile.isKid);
      setFormPin(profile.pin || '');
      setFormMaturity(profile.maturityLimit || 'NC-17');
    } else {
      if (profile.pin) {
        setPinPromptProfile(profile);
      } else {
        selectProfile(profile);
        navigate('/');
      }
    }
  };

  const handleOpenAddModal = () => {
    setFormName('');
    setFormAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
    setFormIsKid(false);
    setFormPin('');
    setFormMaturity('PG-13');
    setError(null);
    setShowAddModal(true);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setError('Please provide a profile name');
      return;
    }
    try {
      await api.createProfile({
        name: formName.trim(),
        avatar: formAvatar,
        isKid: formIsKid,
        pin: formPin.trim() || null,
        maturityLimit: formIsKid ? 'PG' : formMaturity
      });
      await refreshUser();
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile || !formName.trim()) return;
    try {
      await api.updateProfile(editingProfile.id, {
        name: formName.trim(),
        avatar: formAvatar,
        isKid: formIsKid,
        pin: formPin.trim() || null,
        maturityLimit: formIsKid ? 'PG' : formMaturity
      });
      await refreshUser();
      setEditingProfile(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleDeleteProfile = async (id: string) => {
    if (confirm('Are you sure you want to delete this profile? Viewing history and watchlist will be lost.')) {
      try {
        await api.deleteProfile(id);
        await refreshUser();
        setEditingProfile(null);
      } catch (err: any) {
        alert(err.message || 'Failed to delete profile');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] flex flex-col justify-center items-center py-16 px-4 sm:px-6">
      <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in duration-300">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {isManaging ? 'Manage Profiles' : "Who's watching?"}
          </h1>
          <p className="text-xs sm:text-sm text-[#c6c6c7] mt-2">
            {isManaging
              ? 'Select a profile to customize avatars, set maturity restrictions, or configure security PINs.'
              : 'Choose your profile to resume watching and personalized AI recommendations.'}
          </p>
        </div>

        {/* Profile Avatars Grid */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 pt-4">
          {user?.profiles.map(profile => {
            const isSelected = currentProfile?.id === profile.id;
            return (
              <div
                key={profile.id}
                onClick={() => handleProfileClick(profile)}
                className="group flex flex-col items-center cursor-pointer select-none space-y-2.5"
              >
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-2 ring-transparent group-hover:ring-4 group-hover:ring-white transition-all duration-200 shadow-xl group-hover:scale-105">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Lock Indicator */}
                  {profile.pin && !isManaging && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 backdrop-blur-xs flex items-center justify-center text-white shadow">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Manage Edit Overlay */}
                  {isManaging && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white backdrop-blur-xs group-hover:bg-black/40 transition-colors">
                      <Edit2 className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <span className="text-sm sm:text-base font-semibold text-[#c6c6c7] group-hover:text-white transition-colors">
                    {profile.name}
                  </span>
                  {profile.isKid && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                      KIDS
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Profile Card */}
          {user && user.profiles.length < 5 && (
            <div
              onClick={handleOpenAddModal}
              className="group flex flex-col items-center cursor-pointer select-none space-y-2.5"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-white/20 group-hover:border-white flex items-center justify-center transition-all duration-200 group-hover:scale-105 bg-white/5">
                <Plus className="w-10 h-10 text-white/50 group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm sm:text-base font-semibold text-[#c6c6c7] group-hover:text-white transition-colors">
                Add Profile
              </span>
            </div>
          )}
        </div>

        {/* Action Toggle Button */}
        <div className="pt-8">
          <button
            onClick={() => setIsManaging(!isManaging)}
            className={`px-8 py-2.5 rounded-lg text-xs sm:text-sm font-bold tracking-wider uppercase transition-all ${
              isManaging
                ? 'bg-white text-black hover:bg-neutral-200 shadow-xl'
                : 'border border-white/30 text-[#c6c6c7] hover:border-white hover:text-white'
            }`}
          >
            {isManaging ? 'Done' : 'Manage Profiles'}
          </button>
        </div>
      </div>

      {/* PIN Prompt Modal for Locked Profiles */}
      {pinPromptProfile && (
        <PinPromptModal
          title={`Unlock ${pinPromptProfile.name}'s Profile`}
          description="Enter the 4-digit PIN configured for this profile."
          onSubmit={async (pin) => {
            const success = await selectProfile(pinPromptProfile, pin);
            if (success) {
              setPinPromptProfile(null);
              navigate('/');
              return true;
            }
            return false;
          }}
          onClose={() => setPinPromptProfile(null)}
        />
      )}

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#1c1b1b] rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">Edit Profile</h3>
              <button
                onClick={() => setEditingProfile(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Avatar & Name */}
              <div className="flex items-center space-x-4">
                <div
                  onClick={() => setShowAvatarPicker(true)}
                  className="relative w-20 h-20 rounded-xl overflow-hidden cursor-pointer group flex-shrink-0 ring-2 ring-white/20 group-hover:ring-[#e50914]"
                >
                  <img src={formAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                    Change
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <label className="text-xs text-[#c6c6c7] font-semibold">Profile Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full bg-[#131313] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e50914]"
                    required
                  />
                </div>
              </div>

              {/* Kid toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-sm font-semibold text-white">Kid Profile</p>
                  <p className="text-xs text-[#c6c6c7]">Only show titles suitable for age 12 and under</p>
                </div>
                <input
                  type="checkbox"
                  checked={formIsKid}
                  onChange={e => setFormIsKid(e.target.checked)}
                  className="w-5 h-5 accent-[#e50914] cursor-pointer"
                />
              </div>

              {/* Maturity Rating */}
              {!formIsKid && (
                <div className="space-y-1">
                  <label className="text-xs text-[#c6c6c7] font-semibold">Maturity Rating Limit</label>
                  <select
                    value={formMaturity}
                    onChange={e => setFormMaturity(e.target.value as any)}
                    className="w-full bg-[#131313] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e50914]"
                  >
                    <option value="G">G — General Audiences</option>
                    <option value="PG">PG — Parental Guidance Suggested</option>
                    <option value="PG-13">PG-13 — Parents Strongly Cautioned</option>
                    <option value="R">R — Restricted</option>
                    <option value="NC-17">NC-17 — Adults Only</option>
                  </select>
                </div>
              )}

              {/* Security PIN */}
              <div className="space-y-1">
                <label className="text-xs text-[#c6c6c7] font-semibold">Profile PIN (Optional 4 digits)</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="Leave empty for no PIN"
                  value={formPin}
                  onChange={e => setFormPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#131313] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e50914]"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                {user && user.profiles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteProfile(editingProfile.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Profile</span>
                  </button>
                )}
                <div className="flex items-center space-x-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#c6c6c7]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#e50914] text-white text-xs font-bold shadow hover:bg-[#f40612]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#1c1b1b] rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">Create New Profile</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div className="flex items-center space-x-4">
                <div
                  onClick={() => setShowAvatarPicker(true)}
                  className="relative w-20 h-20 rounded-xl overflow-hidden cursor-pointer group flex-shrink-0 ring-2 ring-white/20 group-hover:ring-[#e50914]"
                >
                  <img src={formAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                    Change
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <label className="text-xs text-[#c6c6c7] font-semibold">Profile Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Maya, Cinema Fan"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full bg-[#131313] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e50914]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-sm font-semibold text-white">Kid Profile</p>
                  <p className="text-xs text-[#c6c6c7]">Only display titles rated for age 12 and under</p>
                </div>
                <input
                  type="checkbox"
                  checked={formIsKid}
                  onChange={e => setFormIsKid(e.target.checked)}
                  className="w-5 h-5 accent-[#e50914] cursor-pointer"
                />
              </div>

              {!formIsKid && (
                <div className="space-y-1">
                  <label className="text-xs text-[#c6c6c7] font-semibold">Maturity Rating Limit</label>
                  <select
                    value={formMaturity}
                    onChange={e => setFormMaturity(e.target.value as any)}
                    className="w-full bg-[#131313] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e50914]"
                  >
                    <option value="G">G — General Audiences</option>
                    <option value="PG">PG — Parental Guidance Suggested</option>
                    <option value="PG-13">PG-13 — Parents Strongly Cautioned</option>
                    <option value="R">R — Restricted</option>
                    <option value="NC-17">NC-17 — Adults Only</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-[#c6c6c7] font-semibold">Profile PIN (Optional 4 digits)</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="4-digit PIN"
                  value={formPin}
                  onChange={e => setFormPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#131313] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e50914]"
                />
              </div>

              {error && <p className="text-xs text-rose-400">{error}</p>}

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#c6c6c7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#e50914] text-white text-xs font-bold shadow hover:bg-[#f40612]"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar Preset Picker Modal */}
      {showAvatarPicker && (
        <AvatarPickerModal
          currentAvatar={formAvatar}
          onSelect={(url) => setFormAvatar(url)}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}
    </div>
  );
};
