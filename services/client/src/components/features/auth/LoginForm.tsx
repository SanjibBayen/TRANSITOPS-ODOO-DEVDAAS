import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { loginUser } from '../../../store/slices/authSlice';
import { setActiveTab } from '../../../store/slices/uiSlice';
import { toast } from 'sonner';
import { Loader2, LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  selectedRole: string;
  roleEmail: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ selectedRole, roleEmail }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState(roleEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(loginUser({ email: email.trim(), password })).unwrap();

      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      }

      toast.success('Welcome back!');
      dispatch(setActiveTab('dashboard'));
    } catch (err: any) {
      const message = typeof err === 'string' ? err : 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 pt-4 space-y-4">
      <div>
        <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400 dark:text-zinc-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/20 focus:outline-none transition-all font-medium"
            placeholder="email@transitops.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400 dark:text-zinc-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2.5 pl-10 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/20 focus:outline-none transition-all font-medium"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-2.5 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-zinc-400 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded-md border-gray-300 dark:border-zinc-600 text-[#714B67] focus:ring-[#714B67] h-4 w-4"
          />
          Remember me
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#714B67] to-[#5e3b56] py-3 text-sm font-bold text-white hover:from-[#5e3b56] hover:to-[#4a2e44] transition-all shadow-lg shadow-[#714B67]/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Sign In
          </>
        )}
      </button>
    </form>
  );
};