import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { setActiveTab } from '../store/slices/uiSlice';
import { loginUser } from '../store/slices/authSlice';
import api from '../lib/axios';
import { toast } from 'sonner';
import { 
  LogIn, Lock, Mail, Users, Truck, ShieldCheck, Landmark, 
  UserPlus, Eye, EyeOff, ArrowRight, MapPin, Activity, Loader2
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
  'Manager': { icon: Truck, label: 'Fleet Manager', bg: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-800 dark:text-indigo-300' },
  'Driver': { icon: Users, label: 'Driver', bg: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300' },
  'Safety Officer': { icon: ShieldCheck, label: 'Safety Officer', bg: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300' },
  'Financial Analyst': { icon: Landmark, label: 'Financial Analyst', bg: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300' },
};

const HIGHLIGHTS = [
  { icon: MapPin, title: 'Live fleet tracking', desc: 'Real-time GPS across every route' },
  { icon: ShieldCheck, title: 'Compliance built-in', desc: 'License, medical and audit trails' },
  { icon: Activity, title: 'Operational analytics', desc: 'Performance metrics at a glance' },
];

export const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

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
        // ============ LOGIN ============
        const result = await dispatch(loginUser({ email: email.trim(), password })).unwrap();
        toast.success(`Welcome back, ${result.name || email}!`);
        dispatch(setActiveTab('dashboard'));
        
      } else {
        // ============ SIGNUP ============
        const response = await api.post('/auth/signup', {
          email: email.trim(),
          password,
          name: name.trim(),
          role: BACKEND_ROLES[selectedRole],
        });

        // Check if signup returned session directly
        const session = response.data?.data?.session;
        
        if (session?.access_token) {
          // Signup returned session - auto login
          localStorage.setItem('access_token', session.access_token);
          if (session.refresh_token) localStorage.setItem('refresh_token', session.refresh_token);
          toast.success('Account created! Welcome aboard.');
          dispatch(setActiveTab('dashboard'));
        } else {
          // Signup successful but no session - switch to login mode
          toast.success('Account created! Please sign in with your credentials.');
          setIsLoginMode(true);
          setPassword('');
        }
      }
      
    } catch (error: any) {
      console.error('Auth error:', error);
      const message = typeof error === 'string' 
        ? error 
        : error?.response?.data?.message || error?.message || 'Authentication failed.';
      setFormError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const config = roleConfigs[selectedRole];
  const IconComponent = config.icon;

  return (
    <div className="h-screen w-full overflow-hidden flex items-center justify-center bg-[#f6f4f5] dark:bg-zinc-950 p-4">
      <div className="w-full h-full max-w-6xl max-h-[820px] rounded-3xl overflow-hidden shadow-2xl shadow-[#714B67]/10 border border-[#714B67]/10 flex bg-white dark:bg-zinc-900">

        {/* LEFT — Brand Panel */}
        <div className="hidden lg:flex lg:w-[42%] relative flex-col justify-between bg-gradient-to-br from-[#3d2a38] via-[#4a2e44] to-[#714B67] p-10 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#714B67]/40 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg font-black text-white tracking-tight">T</span>
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight block leading-none">TransitOps</span>
                <span className="text-[9px] font-semibold text-white/50 tracking-wider uppercase">Enterprise Fleet Suite</span>
              </div>
            </div>
            <h2 className="text-2xl xl:text-[28px] font-black text-white leading-tight tracking-tight mb-3">
              Run your entire fleet<br />from one command center.
            </h2>
            <p className="text-xs text-white/60 font-medium leading-relaxed max-w-xs">
              Manage drivers, routes, compliance and finances — without the spreadsheets.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            {HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-white/80" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{item.title}</span>
                    <span className="text-[11px] text-white/50 font-medium">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Login Form */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 py-8 overflow-y-auto">
          <div className="w-full max-w-[380px] mx-auto">

            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#714B67] to-[#5a3b52] text-white shadow-md shadow-[#714B67]/25 mb-3">
                <span className="text-xl font-black tracking-tight">T</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">TransitOps</h1>
            </div>

            {/* Title */}
            <div className="mb-5">
              <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                {isLoginMode ? 'Sign in to your workspace' : 'Create your account'}
              </h2>
              <p className="text-[11px] font-medium text-gray-500 dark:text-zinc-400 mt-1">
                {isLoginMode ? 'Enter your credentials to access the fleet console.' : 'Set up access for your role in a few seconds.'}
              </p>
            </div>

            {/* Role Selector */}
            <div className="mb-4">
              <label className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Select portal</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(Object.keys(roleConfigs) as UserRole[]).map((role) => {
                  const cfg = roleConfigs[role];
                  const Icon = cfg.icon;
                  const isActive = selectedRole === role;
                  return (
                    <button key={role} type="button" onClick={() => selectRole(role)}
                      className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        isActive ? 'border-[#714B67] bg-[#fdfafc] dark:bg-purple-950/20' : 'border-transparent hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'
                      }`}>
                      <Icon className={`h-4 w-4 ${isActive ? 'text-[#714B67]' : 'text-gray-400 dark:text-zinc-500'}`} />
                      <span className={`text-[9px] font-bold leading-tight text-center ${isActive ? 'text-[#714B67]' : 'text-gray-500 dark:text-zinc-400'}`}>{role}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Banner */}
            <div className={`mb-4 p-2.5 rounded-xl border text-[11px] font-semibold ${config.bg}`}>
              <div className="flex items-center gap-2">
                <IconComponent className="h-3.5 w-3.5 shrink-0" />
                <span>Accessing as <strong>{config.label}</strong></span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {formError && (
                <div className="flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 p-3 border border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-300 text-[11px] font-medium">
                  <div className="h-4 w-4 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-red-600 dark:text-red-400 text-[9px] font-bold">!</span>
                  </div>
                  <span>{formError}</span>
                </div>
              )}

              {!isLoginMode && (
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Full name</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-white focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/20 focus:outline-none transition-all font-medium"
                      placeholder="John Doe" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-white focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/20 focus:outline-none transition-all font-medium"
                    placeholder="email@transitops.com" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400 dark:text-zinc-500" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 pl-9 pr-9 text-xs text-gray-900 dark:text-white focus:border-[#714B67] focus:ring-2 focus:ring-[#714B67]/20 focus:outline-none transition-all font-medium"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 dark:text-zinc-400 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 dark:border-zinc-600 text-[#714B67] focus:ring-[#714B67] h-3.5 w-3.5" />
                  Remember me
                </label>
                <button type="button" onClick={() => { setIsLoginMode(!isLoginMode); setFormError(null); setPassword(''); }}
                  className="text-[11px] font-bold text-[#714B67] hover:text-[#5e3b56] transition-colors cursor-pointer">
                  {isLoginMode ? 'Create account' : 'Sign in'}
                </button>
              </div>

              <button type="submit" disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#714B67] to-[#5e3b56] py-2.5 text-xs font-bold text-white hover:from-[#5e3b56] hover:to-[#4a2e44] transition-all shadow-md shadow-[#714B67]/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {isLoginMode ? <LogIn className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                    {isLoginMode ? `Enter ${config.label} portal` : 'Create account'}
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-[9px] text-gray-400 dark:text-zinc-500 font-medium mt-4">
              By continuing you agree to TransitOps Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};