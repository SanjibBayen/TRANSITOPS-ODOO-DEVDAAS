import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Search, Bell, Grid, Menu, LogOut, User, Edit2, X, Check, Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, setSearchQuery } from '../../store/slices/uiSlice';
import { RootState } from '../../store/index';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'sonner';
import api from '../../lib/axios';

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { user, handleUpdateProfile } = useAuth();
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const searchQuery = useSelector((state: RootState) => state.ui.searchQuery);
  const alerts = useSelector((state: RootState) => state.ui.alerts);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Fetch unread notification count
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/users/' + user?.id + '/notifications');
        const unread = response.data.data?.filter((n: any) => !n.is_read).length || 0;
        setNotificationCount(unread);
      } catch {
        // Silently fail
      }
    };
    if (user?.id) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); // Every minute
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const openEditModal = () => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditPhone('');
      setIsEditModalOpen(true);
      setIsDropdownOpen(false);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateProfile({ name: editName, email: editEmail });
    toast.success('Profile updated');
    setIsEditModalOpen(false);
  };

  const roleLabel = {
    FLEET_MANAGER: 'Fleet Manager',
    DRIVER: 'Driver',
    SAFETY_OFFICER: 'Safety Officer',
    FINANCIAL_ANALYST: 'Financial Analyst',
  }[user?.role || ''] || user?.role || 'User';

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="flex h-9 w-9 items-center justify-center rounded text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-[#714B67] dark:text-zinc-100">TransitOps</span>
            <span className="flex items-center gap-1.5 rounded bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
              LIVE
            </span>
          </div>
        </div>

        <div className="hidden md:flex relative max-w-md w-full mx-4">
          <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search records, drivers, trips..."
            className="block w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-1.5 pl-9 pr-12 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-[#714B67] focus:ring-1 focus:ring-[#714B67] focus:outline-none transition-all"
          />
          <kbd className="absolute right-3 top-2 rounded border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-1.5 font-mono text-[10px] text-gray-400 dark:text-zinc-500">⌘K</kbd>
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <Grid className="h-4 w-4" />
          </button>

          <button className="relative flex h-9 w-9 items-center justify-center rounded text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white dark:border-zinc-900">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          <div className="h-5 w-px bg-gray-200 dark:bg-zinc-800 mx-1" />

          {user && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 group"
              >
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-bold text-gray-900 dark:text-zinc-100">{user.name}</span>
                  <span className="text-[9px] text-gray-500 dark:text-zinc-400">{roleLabel}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#714B67] to-[#5a3b52] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
              )}

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1 shadow-lg z-40">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-zinc-800">
                    <p className="font-bold text-gray-900 dark:text-zinc-100 text-xs">{user.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{user.email}</p>
                  </div>
                  
                  <button onClick={openEditModal} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded transition-colors">
                    <User className="h-4 w-4 text-gray-500 dark:text-zinc-400" /> Edit Profile
                  </button>

                  <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded transition-colors">
                    {theme === 'light' ? <Moon className="h-4 w-4 text-gray-500" /> : <Sun className="h-4 w-4 text-gray-500" />}
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </button>

                  <div className="h-px bg-gray-100 dark:bg-zinc-800 my-1" />

                  <button onClick={onLogout} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#714B67] text-white">
              <h3 className="text-sm font-bold flex items-center gap-2"><Edit2 className="h-4 w-4" /> Update Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white/80 hover:text-white p-1 rounded"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={saveProfile} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Full Name</label>
                <input type="text" required value={editName} onChange={e => setEditName(e.target.value)} className="w-full rounded border border-gray-300 dark:border-zinc-700 px-3 py-1.5 text-xs focus:border-[#714B67] focus:outline-none transition-all font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Email Address</label>
                <input type="email" required value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full rounded border border-gray-300 dark:border-zinc-700 px-3 py-1.5 text-xs focus:border-[#714B67] focus:outline-none transition-all font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Phone</label>
                <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full rounded border border-gray-300 dark:border-zinc-700 px-3 py-1.5 text-xs focus:border-[#714B67] focus:outline-none transition-all font-medium" placeholder="+91-XXXXXXXXXX" />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-3 py-1.5 border border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 rounded text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-[#714B67] text-white rounded text-xs font-bold hover:bg-[#5e3b56] transition-colors flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};