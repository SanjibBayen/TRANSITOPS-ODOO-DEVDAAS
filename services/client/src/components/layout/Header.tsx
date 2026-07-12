import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.ts';
import { Search, Bell, Grid, Menu, LogOut, User, Edit2, X, Check, Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, setSearchQuery } from '../../store/slices/uiSlice.ts';
import { RootState } from '../../store/index.ts';
import { useTheme } from '../../contexts/ThemeContext.tsx';

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { user, handleUpdateProfile } = useAuth();
  const dispatch = useDispatch();
  const sidebarCollapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);
  const searchQuery = useSelector((state: RootState) => state.ui.searchQuery);

  // Profile click dropdown & edit modal states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit fields state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'Admin' | 'Dispatcher' | 'Manager' | 'Driver' | 'Safety Officer' | 'Financial Analyst'>('Manager');
  const [editAvatar, setEditAvatar] = useState('');

  // Theme Switcher Logic (TASK 6)
  const { theme, setTheme } = useTheme();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const openEditModal = () => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditRole(user.role);
      setEditAvatar(user.avatar);
      setIsEditModalOpen(true);
      setIsDropdownOpen(false);
    }
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateProfile({
      name: editName,
      email: editEmail,
      role: editRole,
      avatar: editAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYBkw3LHcTwmizgJ3i8YKR18fYqElE3Mg9j2KIiAk20JcN3_h5fi77C0J2BvviOW_QR2oyHcQ1XeYxnzmkweobMewYAuRyAzEJWCwz1f8yi2isPQCNymxtX7N0ODA2q72p8krMwTYMqNCrLU0kY2W6SZhU8o4L_fBJxZlYDMT_ZRzWlderTFed7dQY7vdEiknxiWpdbu7Khs7Et6zBYfdMI_lfWSWZaqHVYJvvx84zfuptWyJN5g9-'
    });
    setIsEditModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 shadow-sm font-sans">
        {/* Left side: Brand + Collapse toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="flex h-9 w-9 items-center justify-center rounded text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
            id="sidebar-toggle-btn"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-[#714B67] dark:text-zinc-100">
              TransitOps
            </span>
            <span className="flex items-center gap-1.5 rounded bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
              LIVE
            </span>
          </div>
        </div>

        {/* Middle: Professional Search box with cmd shortcut */}
        <div className="hidden md:flex relative max-w-md w-full mx-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search records, drivers, trips..."
            className="block w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-1.5 pl-9 pr-12 text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:border-[#714B67] dark:focus:border-zinc-600 focus:ring-1 focus:ring-[#714B67] dark:focus:ring-zinc-600 focus:outline-none transition-all shadow-sm"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <kbd className="inline-flex items-center rounded border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-gray-400 dark:text-zinc-500">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right side: Actions, Notifications and Profile */}
        <div className="flex items-center gap-2">
          {/* Dashboard Grid Icons */}
          <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
            <Grid className="h-4.5 w-4.5" />
          </button>

          {/* Notifications Icon with static count */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-zinc-900"></span>
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-200 dark:bg-zinc-800 mx-1" />

          {/* Profile Card & Log out click dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 pl-1 group outline-none focus:outline-none"
              >
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-bold leading-none text-gray-900 dark:text-zinc-100">{user.name}</span>
                  <span className="text-[9px] text-gray-500 dark:text-zinc-400 mt-0.5 capitalize font-medium">{user.role}</span>
                </div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border border-gray-200 dark:border-zinc-700 object-cover group-hover:border-gray-300 dark:group-hover:border-zinc-500 transition-all shadow-sm"
                />
              </button>

              {/* Click outside Overlay */}
              {isDropdownOpen && (
                <div 
                  className="fixed inset-0 z-30 cursor-default" 
                  onClick={() => setIsDropdownOpen(false)}
                />
              )}

              {/* Real Click Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 origin-top-right rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1 text-gray-800 dark:text-zinc-200 shadow-lg z-40 animate-fade-in font-sans text-sm">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-zinc-800">
                    <p className="font-bold text-gray-900 dark:text-zinc-100 text-xs leading-none">{user.name}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={openEditModal}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded transition-colors"
                  >
                    <User className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                    My Profile
                  </button>

                  <button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded transition-colors"
                  >
                    {theme === 'light' ? (
                      <Moon className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                    ) : (
                      <Sun className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                    )}
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </button>

                  <div className="h-px bg-gray-100 dark:bg-zinc-800 my-1" />

                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Edit Profile Modal Dialog */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#714B67] text-white">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Edit2 className="h-4 w-4" />
                Update Profile Info
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white dark:bg-zinc-900/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={saveProfile} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full rounded border border-gray-300 dark:border-zinc-700 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:border-[#714B67] focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full rounded border border-gray-300 dark:border-zinc-700 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:border-[#714B67] focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                  Enterprise Role
                </label>
                <select
                  value={editRole}
                  onChange={e => setEditRole(e.target.value as any)}
                  className="w-full rounded border border-gray-300 dark:border-zinc-700 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 focus:border-[#714B67] focus:outline-none transition-all font-medium"
                >
                  <option value="Manager">Manager</option>
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Admin">Admin</option>
                  <option value="Driver">Driver</option>
                  <option value="Safety Officer">Safety Officer</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={e => setEditAvatar(e.target.value)}
                  className="w-full rounded border border-gray-300 dark:border-zinc-700 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:border-[#714B67] focus:outline-none transition-all font-mono"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 rounded text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#714B67] text-white rounded text-xs font-bold hover:bg-[#5e3b56] transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
