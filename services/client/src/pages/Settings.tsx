import React from 'react';
import { Settings as SettingsIcon, Shield, Sliders, Database, KeyRound, Bell, Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">Settings</h1>
        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Configure application preferences and system parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sidebar */}
        <div className="md:col-span-1 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 shadow-sm space-y-1">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold bg-[#fdfafc] dark:bg-[#714B67]/20 text-[#714B67] border-l-4 border-[#714B67]">
            <Sliders className="h-4 w-4" /> General
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800">
            <Bell className="h-4 w-4" /> Notifications
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800">
            <Globe className="h-4 w-4" /> Regional
          </button>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 shadow-sm space-y-6">
          
          {/* Appearance */}
          <div className="space-y-4">
            <h2 className="text-xs font-black tracking-wider text-gray-500 dark:text-zinc-400 uppercase pb-2 border-b border-gray-200 dark:border-zinc-800">Appearance</h2>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="block text-xs font-bold text-[#1b1c1c] dark:text-zinc-100">Dark Mode</span>
                <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-semibold">Toggle between light and dark theme.</span>
              </div>
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-[#714B67]' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <h2 className="text-xs font-black tracking-wider text-gray-500 dark:text-zinc-400 uppercase pb-2">Account Information</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Name</label>
                <input type="text" readOnly value={user?.name || ''} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-300 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Email</label>
                <input type="text" readOnly value={user?.email || ''} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-300 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Role</label>
                <input type="text" readOnly value={user?.role || ''} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-300 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <h2 className="text-xs font-black tracking-wider text-gray-500 dark:text-zinc-400 uppercase pb-2">System Information</h2>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Version</span>
                <p className="font-bold text-[#1b1c1c] dark:text-zinc-100 mt-1">v4.2 Enterprise</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Environment</span>
                <p className="font-bold text-[#1b1c1c] dark:text-zinc-100 mt-1">Production</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Backend API</span>
                <p className="font-bold text-[#1b1c1c] dark:text-zinc-100 mt-1">Connected</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Database</span>
                <p className="font-bold text-emerald-600 mt-1">Supabase Live</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};