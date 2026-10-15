import React, { useState } from 'react';
import { Lock, X, AlertCircle } from 'lucide-react';

interface PinPromptModalProps {
  title?: string;
  description?: string;
  onSubmit: (pin: string) => Promise<boolean>;
  onClose: () => void;
}

export const PinPromptModal: React.FC<PinPromptModalProps> = ({
  title = 'Profile Locked',
  description = 'Enter the 4-digit security PIN to access this profile.',
  onSubmit,
  onClose
}) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newPin = [...pin];
    newPin[index] = val.slice(-1);
    setPin(newPin);
    setError(null);

    // Auto focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = pin.join('');
    if (fullPin.length !== 4) {
      setError('Please enter all 4 digits');
      return;
    }

    setLoading(true);
    try {
      const ok = await onSubmit(fullPin);
      if (!ok) {
        setError('Incorrect PIN code. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Incorrect PIN code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#1c1b1b] rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-6 space-y-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-full bg-[#e50914]/15 border border-[#e50914]/30 text-[#e50914] flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-xs text-[#c6c6c7] mt-1">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                id={`pin-${idx}`}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                autoFocus={idx === 0}
                className="w-12 h-14 text-center text-2xl font-bold text-white bg-[#131313] border-2 border-white/20 focus:border-[#e50914] rounded-xl outline-none transition-all"
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-[#c6c6c7] hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#e50914] hover:bg-[#f40612] text-white text-xs font-bold transition-all shadow-md shadow-[#e50914]/20 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Unlock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
