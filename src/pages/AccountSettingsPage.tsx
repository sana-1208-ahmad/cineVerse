import React, { useState } from 'react';
import { User, Shield, Key, Laptop, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const AccountSettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setSaving(true);
    try {
      const res = await api.updateAccount({
        name,
        email,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      });
      await refreshUser();
      setStatusMsg({ type: 'success', text: res.message || 'Account settings updated successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update account' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Account & Security</h1>
        <p className="text-xs sm:text-sm text-[#c6c6c7] mt-1">
          Manage your CineVerse membership credentials, security credentials, and active devices.
        </p>
      </div>

      {/* Membership Plan Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1c1b1b] via-[#201f1f] to-[#1c1b1b] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#e50914] text-white uppercase tracking-wider">
              Active Plan
            </span>
            <span className="text-sm font-bold text-white">{user?.membershipPlan || 'Premium 4K Ultra HD'}</span>
          </div>
          <p className="text-xs text-[#c6c6c7]">
            Enjoy 4K UHD streaming on 4 simultaneous screens, Spatial Audio, and Gemini AI Navigator recommendations.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-emerald-400">Next billing date: 1st of next month</span>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl flex items-center space-x-2.5 text-xs font-semibold ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Account Info Form */}
      <form onSubmit={handleUpdate} className="p-6 rounded-2xl bg-[#1c1b1b] border border-white/5 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-[#e50914]" /> Profile & Contact Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#c6c6c7]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e50914]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#c6c6c7]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e50914]"
              required
            />
          </div>
        </div>

        {/* Password Section */}
        <div className="pt-4 border-t border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-[#e50914]" /> Change Password
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#c6c6c7]">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password to authorize changes"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e50914]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#c6c6c7]">New Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e50914]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#c6c6c7]">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e50914]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#e50914] hover:bg-[#f40612] text-white text-xs font-bold shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Active Sessions */}
      <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-white/5 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Laptop className="w-4 h-4 text-[#e50914]" /> Active Devices & Sessions
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center space-x-3">
              <Laptop className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-white">Current Chrome Browser (This Device)</p>
                <p className="text-[11px] text-[#c6c6c7]">Active now • Web Streaming 4K</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              CURRENT
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center space-x-3">
              <Laptop className="w-5 h-5 text-[#c6c6c7]" />
              <div>
                <p className="text-xs font-semibold text-white">Apple TV 4K (Living Room)</p>
                <p className="text-[11px] text-[#c6c6c7]">Last active 2 hours ago</p>
              </div>
            </div>
            <span className="text-[10px] text-[#c6c6c7]">Authorized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
