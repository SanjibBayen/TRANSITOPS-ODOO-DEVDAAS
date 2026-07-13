import React, { useState } from 'react';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';

interface ForgotPasswordProps {
  onBack: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setSent(true);
      setIsLoading(false);
      toast.success('Password reset link sent to your email');
    }, 1500);
  };

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#714B67] to-[#5a3b52] text-white shadow-lg mb-4">
          <Mail className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Check Your Email</h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
          We sent a password reset link to <strong>{email}</strong>
        </p>
        <button onClick={onBack} className="mt-6 text-xs font-bold text-[#714B67] hover:underline">
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-[#714B67] hover:underline">
        <ArrowLeft className="h-3 w-3" /> Back to login
      </button>

      <div className="text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#714B67] to-[#5a3b52] text-white shadow-lg mb-4">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100">Forgot Password?</h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
          Enter your email address and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@transitops.com"
            className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2.5 px-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/20 focus:outline-none transition-all font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#714B67] to-[#5e3b56] py-3 text-sm font-bold text-white hover:from-[#5e3b56] hover:to-[#4a2e44] transition-all shadow-lg shadow-[#714B67]/25 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Mail className="h-4 w-4" />
              Send Reset Link
            </>
          )}
        </button>
      </form>
    </div>
  );
};