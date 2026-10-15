import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Mail, User, AlertCircle, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const AuthPage: React.FC = () => {
  const { login, register, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot password flow modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'code' | 'done'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/profiles');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin();
      navigate('/profiles');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotError(null);

    try {
      const res = await api.forgotPassword(forgotEmail);
      if (res.devOtp) setDevOtpHint(res.devOtp);
      setForgotStep('code');
    } catch (err: any) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || !newPassword) return;
    setForgotLoading(true);
    setForgotError(null);

    try {
      await api.resetPassword({
        email: forgotEmail,
        code: otpCode,
        newPassword
      });
      setForgotStep('done');
    } catch (err: any) {
      setForgotError(err.message || 'Invalid verification code');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#131313] flex items-center justify-center py-16 px-4 sm:px-6 select-none overflow-hidden">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80"
          alt="Cinema Atmosphere"
          className="w-full h-full object-cover filter brightness-[0.25] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/80 to-[#131313]/90" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#1c1b1b]/95 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-[#e50914] flex items-center justify-center shadow-lg shadow-[#e50914]/40">
              <span className="text-white font-black text-2xl tracking-tighter">C</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-black tracking-tight text-white">CINE</span>
              <span className="text-2xl font-black tracking-tight text-[#e50914]">VERSE</span>
            </div>
          </div>
          <p className="text-xs text-[#c6c6c7]">
            Full-Stack AI-Powered Movie Discovery Platform
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#e50914]/20 via-[#201f1f] to-[#1c1b1b] border border-[#e50914]/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#e50914]" /> Quick Evaluation
            </span>
            <span className="text-[10px] text-[#55e074] font-semibold">Ready to Test</span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#e50914] hover:bg-[#f40612] text-white text-xs font-bold shadow-md shadow-[#e50914]/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>One-Click Sign In as Sana (Demo)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Sign In / Sign Up Tabs */}
        <div className="flex rounded-xl bg-[#131313] p-1 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signin' ? 'bg-[#201f1f] text-white shadow' : 'text-[#c6c6c7] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup' ? 'bg-[#201f1f] text-white shadow' : 'text-[#c6c6c7] hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#c6c6c7]">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Sana Ahmad"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-[#e50914]"
                  required
                />
                <User className="w-4 h-4 text-[#c6c6c7] absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#c6c6c7]">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@cineverse.io"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-[#e50914]"
                required
              />
              <Mail className="w-4 h-4 text-[#c6c6c7] absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#c6c6c7]">Password</label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(true);
                    setForgotStep('email');
                    setForgotEmail(email);
                  }}
                  className="text-[11px] text-[#e50914] hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#131313] border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-[#e50914]"
                required
              />
              <Lock className="w-4 h-4 text-[#c6c6c7] absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-sm shadow-xl transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-[11px] text-center text-[#c6c6c7]/70">
          By signing up, you agree to CineVerse terms. Streaming powered by TMDB data.
        </p>
      </div>

      {/* Forgot Password Flow Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-[#1c1b1b] rounded-2xl border border-white/10 p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#e50914]/20 text-[#e50914] flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">Reset CineVerse Password</h3>

            {forgotError && (
              <p className="text-xs text-rose-400">{forgotError}</p>
            )}

            {forgotStep === 'email' && (
              <form onSubmit={handleSendResetEmail} className="space-y-4">
                <p className="text-xs text-[#c6c6c7]">
                  Enter your email address to receive a 6-digit verification code.
                </p>
                <input
                  type="email"
                  placeholder="name@cineverse.io"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full bg-[#131313] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e50914]"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 text-xs font-semibold text-[#c6c6c7]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2 rounded-xl bg-[#e50914] text-white text-xs font-bold"
                  >
                    Send Code
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 'code' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-xs text-[#c6c6c7]">
                  Enter the 6-digit code sent to your email and your new password.
                </p>
                {devOtpHint && (
                  <div className="p-2 rounded bg-emerald-500/10 text-emerald-300 text-xs font-mono">
                    Simulation Verification OTP: <strong>{devOtpHint}</strong>
                  </div>
                )}
                <input
                  type="text"
                  placeholder="6-digit code"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  className="w-full bg-[#131313] border border-white/10 rounded-xl px-3 py-2 text-center text-lg font-mono text-white focus:outline-none focus:border-[#e50914]"
                  required
                />
                <input
                  type="password"
                  placeholder="New password (min 6 chars)"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-[#131313] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#e50914]"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 text-xs font-semibold text-[#c6c6c7]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2 rounded-xl bg-[#e50914] text-white text-xs font-bold"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 'done' && (
              <div className="space-y-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-xs text-white">Your password has been reset successfully.</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setMode('signin');
                  }}
                  className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
