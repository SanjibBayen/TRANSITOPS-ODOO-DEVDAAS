import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../store/slices/uiSlice';
import { loginUser } from '../store/slices/authSlice';
import api from '../lib/axios';
import { toast } from 'sonner';
import { 
  LogIn, Lock, Mail, Users, Truck, ShieldCheck, Landmark, 
  UserPlus, Eye, EyeOff, ArrowRight
} from 'lucide-react';

type UserRole = 'Manager' | 'Driver' | 'Safety Officer' | 'Financial Analyst';

const BACKEND_ROLES: Record<UserRole, string> = {
  'Manager': 'FLEET_MANAGER',
  'Driver': 'DRIVER',
  'Safety Officer': 'SAFETY_OFFICER',
  'Financial Analyst': 'FINANCIAL_ANALYST',
};

const DEMO_USERS: Record<UserRole, { email: string; password: string }> = {
  'Manager': { email: 'john.fleet@transitops.com', password: 'Test@123' },
  'Driver': { email: 'alex.driver@transitops.com', password: 'Test@123' },
  'Safety Officer': { email: 'mike.safety@transitops.com', password: 'Test@123' },
  'Financial Analyst': { email: 'emma.finance@transitops.com', password: 'Test@123' },
};

const roleConfigs = {
  'Manager': { icon: Truck, label: 'Fleet Manager', color: 'from-indigo-500 to-purple-600', bg: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-800 dark:text-indigo-300' },
  'Driver': { icon: Users, label: 'Driver', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300' },
  'Safety Officer': { icon: ShieldCheck, label: 'Safety Officer', color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300' },
  'Financial Analyst': { icon: Landmark, label: 'Financial Analyst', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300' },
};

export const Login: React.FC = () => {
  const dispatch = useDispatch<any>();

  const [selectedRole, setSelectedRole] = useState<UserRole>('Manager');
  const [email, setEmail] = useState(DEMO_USERS['Manager'].email);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_USERS[role].email);
    setPassword('');
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }
    if (!isLoginMode && !name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    setFormError(null);
    setIsLoading(true);

    try {
      if (isLoginMode) {
        await dispatch(loginUser({ email: email.trim(), password })).unwrap();
        toast.success('Welcome back!');
      } else {
        const response = await api.post('/auth/signup', {
          email: email.trim(),
          password,
          name: name.trim(),
          role: BACKEND_ROLES[selectedRole],
        });

        const { user, session } = response.data.data;
        
        if (rememberMe) {
          localStorage.setItem('access_token', session.access_token);
          if (session.refresh_token) localStorage.setItem('refresh_token', session.refresh_token);
        } else {
          sessionStorage.setItem('access_token', session.access_token);
        }
        toast.success('Account created successfully!');
      }

      dispatch(setActiveTab('dashboard'));
    } catch (error: any) {
      const message = typeof error === 'string' 
        ? error 
        : error?.response?.data?.message || error?.message || 'Authentication failed. Please try again.';
      setFormError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const config = roleConfigs[selectedRole];
  const IconComponent = config.icon;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-950 dark:to-zinc-900 p-4 sm:p-6">
      <div className="w-full max-w-[440px]">
        
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#714B67] to-[#5a3b52] text-white shadow-lg shadow-[#714B67]/25 mb-4">
            <span className="text-2xl font-black tracking-tight">T</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">TransitOps</h1>
          <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 mt-1">Enterprise Fleet Command Suite</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-black/20 overflow-hidden">
          
          <div className="p-5 pb-0">
            <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-3 text-center">
              Select Portal
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(roleConfigs) as UserRole[]).map((role) => {
                const cfg = roleConfigs[role];
                const Icon = cfg.icon;
                const isActive = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => selectRole(role)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                      isActive
                        ? 'border-[#714B67] bg-purple-50/50 dark:bg-purple-950/20 shadow-sm'
                        : 'border-transparent hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-[#714B67]' : 'text-gray-400 dark:text-zinc-500'}`} />
                    <span className={`text-[10px] font-bold leading-tight ${isActive ? 'text-[#714B67]' : 'text-gray-500 dark:text-zinc-400'}`}>
                      {role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`mx-5 mt-4 p-3 rounded-xl border text-xs font-semibold ${config.bg}`}>
            <div className="flex items-center gap-2">
              <IconComponent className="h-4 w-4 shrink-0" />
              <span>Accessing as <strong>{config.label}</strong></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 pt-4 space-y-4">
            
            {formError && (
              <div className="flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-950/30 p-3.5 border border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs font-medium">
                <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-600 dark:text-red-400 text-[10px] font-bold">!</span>
                </div>
                <span>{formError}</span>
              </div>
            )}

            {!isLoginMode && (
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/20 focus:outline-none transition-all font-medium"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Email Address</label>
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
              <label className="block text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Password</label>
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
              <button
                type="button"
                onClick={() => { setIsLoginMode(!isLoginMode); setFormError(null); setPassword(''); }}
                className="text-xs font-bold text-[#714B67] hover:text-[#5e3b56] transition-colors"
              >
                {isLoginMode ? 'Create account' : 'Sign in'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#714B67] to-[#5e3b56] py-3 text-sm font-bold text-white hover:from-[#5e3b56] hover:to-[#4a2e44] transition-all shadow-lg shadow-[#714B67]/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLoginMode ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {isLoginMode ? `Enter ${config.label} Portal` : 'Create Account'}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-gray-100 dark:border-zinc-800 px-5 py-4 text-center">
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
              TransitOps Enterprise Edition v4.2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};