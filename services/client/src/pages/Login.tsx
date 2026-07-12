import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../store/slices/uiSlice.ts';
import { loginSuccess } from '../store/slices/authSlice.ts';
import api from '../lib/axios.ts';
import { toast } from 'sonner';
import { ShieldAlert, LogIn, Lock, Mail, Users, Truck, ShieldCheck, Landmark, UserPlus, Upload } from 'lucide-react';

type UserRole = 'Manager' | 'Driver' | 'Safety Officer' | 'Financial Analyst';

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Manager');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@transitops.in');
  const [password, setPassword] = useState('••••••••••••');
  
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const roleConfigs = {
    'Manager': {
      email: 'admin@transitops.in',
      name: 'Raven K. (Fleet Manager)',
      scope: 'fleet-manager' as const,
      icon: Truck,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-800 dark:text-indigo-300'
    },
    'Driver': {
      email: 'driver@transitops.in',
      name: 'Suresh Kumar (Driver)',
      scope: 'dispatcher' as const,
      icon: Users,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300'
    },
    'Safety Officer': {
      email: 'safety@transitops.in',
      name: 'Vikram Singh (Safety Officer)',
      scope: 'fleet-manager' as const,
      icon: ShieldCheck,
      color: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300'
    },
    'Financial Analyst': {
      email: 'finance@transitops.in',
      name: 'Anjali Sharma (Financial Analyst)',
      scope: 'fleet-manager' as const,
      icon: Landmark,
      color: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300'
    }
  };

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(isLoginMode ? roleConfigs[role].email : '');
    setPassword(isLoginMode ? '••••••••••••' : '');
    setFormError(null);
  };

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormError(null);
    if (!isLoginMode) {
      // Switching to login
      setEmail(roleConfigs[selectedRole].email);
      setPassword('••••••••••••');
    } else {
      // Switching to signup
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  const handleAuth = async () => {
    try {
      setIsLoading(true);
      let response;
      if (isLoginMode) {
        response = await api.post('/auth/login', { email, password });
      } else {
        response = await api.post('/auth/signup', { email, password, name, role: selectedRole });
      }

      const { access_token, refresh_token } = response.data.data.session;
      const { user } = response.data.data;
      
      localStorage.setItem('access_token', access_token);
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }
      
      const config = roleConfigs[selectedRole];
      dispatch(loginSuccess({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || selectedRole,
          avatar: user.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYBkw3LHcTwmizgJ3i8YKR18fYqElE3Mg9j2KIiAk20JcN3_h5fi77C0J2BvviOW_QR2oyHcQ1XeYxnzmkweobMewYAuRyAzEJWCwz1f8yi2isPQCNymxtX7N0ODA2q72p8krMwTYMqNCrLU0kY2W6SZhU8o4L_fBJxZlYDMT_ZRzWlderTFed7dQY7vdEiknxiWpdbu7Khs7Et6zBYfdMI_lfWSWZaqHVYJvvx84zfuptWyJN5g9-'
        },
        scope: config.scope
      }));
      
      toast.success(isLoginMode ? 'Logged in successfully' : 'Account created successfully');
      
      // Redirect driver directly to dashboard/my trips
      dispatch(setActiveTab('dashboard'));
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || (isLoginMode ? 'Login failed' : 'Registration failed');
      setFormError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLoginMode && !name)) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setFormError(null);
    handleAuth();
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f8f9fa] dark:bg-zinc-950 font-sans text-gray-800 dark:text-zinc-200 transition-colors duration-300 p-4">
      <div className="w-full max-w-[480px] bg-white dark:bg-zinc-900 p-6 sm:p-8 border border-gray-200 dark:border-zinc-800 rounded shadow-sm">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded bg-[#714B67] text-white font-extrabold text-2xl shadow-sm mb-3">
            T
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
            TransitOps
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Enterprise Fleet Command Suite
          </p>
        </div>

        {/* Role Segmented Selection */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2 text-center">
            Select Your Role-Based Portal
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(roleConfigs) as UserRole[]).map((role) => {
              const config = roleConfigs[role];
              const IconComponent = config.icon;
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => selectRole(role)}
                  className={`flex flex-col items-center justify-center p-3 rounded border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#714B67] bg-purple-50/50 dark:bg-purple-950/20 text-[#714B67] ring-1 ring-[#714B67]'
                      : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400'
                  }`}
                >
                  <IconComponent className={`h-5 w-5 mb-1 ${isSelected ? 'text-[#714B67]' : 'text-gray-400'}`} />
                  <span className="text-[11px] font-bold">{role}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Role Banner */}
        <div className={`mb-5 p-3 rounded border text-xs font-semibold ${roleConfigs[selectedRole].color}`}>
          Log-in Mode: <span className="font-bold">{selectedRole}</span> — Access with custom permissions enabled.
        </div>

        {/* Error notification banner */}
        {(formError) && (
          <div className="mb-5 flex items-start gap-2.5 rounded bg-red-50 dark:bg-red-950/20 p-3.5 border border-red-100 dark:border-red-900 text-red-800 dark:text-red-300 text-xs font-medium">
            <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Access Denied</span>
              {formError}
            </div>
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {!isLoginMode && (
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Users className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                </span>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-2.5 pl-9 pr-3 text-xs text-gray-800 dark:text-zinc-200 focus:border-[#714B67] focus:ring-1 focus:ring-[#714B67] focus:outline-none transition-all font-semibold"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-2.5 pl-9 pr-3 text-xs text-gray-800 dark:text-zinc-200 focus:border-[#714B67] focus:ring-1 focus:ring-[#714B67] focus:outline-none transition-all font-semibold"
                placeholder="email@transitops.in"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="key" className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              {isLoginMode && (
                <a href="#" className="text-[10px] font-bold text-[#714B67] hover:underline">
                  Reset Password?
                </a>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
              </span>
              <input
                id="key"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-2.5 pl-9 pr-3 text-xs text-gray-800 dark:text-zinc-200 focus:border-[#714B67] focus:ring-1 focus:ring-[#714B67] focus:outline-none transition-all font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 dark:border-zinc-700 text-[#714B67] focus:ring-[#714B67] h-4 w-4"
              />
              Keep me logged in
            </label>
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-xs font-bold text-[#714B67] hover:underline"
            >
              {isLoginMode ? 'Create new account' : 'Already have an account?'}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded bg-[#714B67] py-2.5 text-xs font-bold text-white hover:bg-[#5e3b56] transition-colors shadow-sm cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoginMode ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {isLoading ? 'Connecting...' : (isLoginMode ? `Enter ${selectedRole} Portal` : 'Sign Up')}
          </button>
        </form>

        {/* Footer info in Odoo style */}
        <div className="mt-6 text-center border-t border-gray-100 dark:border-zinc-800 pt-4">
          <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
            TransitOps Enterprise Edition v4.2
          </p>
        </div>

      </div>
    </div>
  );
};
