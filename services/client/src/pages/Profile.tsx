import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { updateProfile, fetchCurrentUser } from '../store/slices/authSlice';
import { User, Shield, Phone, Mail, Award, Clock, MapPin, Truck, Camera, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/axios';

interface DriverStats {
  license_number: string;
  license_expiry: string;
  safety_score: number;
  total_trips: number;
  total_distance: number;
}

export const Profile: React.FC = () => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [driverStats, setDriverStats] = useState<DriverStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const loadDriverStats = useCallback(async () => {
    if (user?.role !== 'DRIVER' && user?.role !== 'FLEET_MANAGER') return;
    
    setStatsLoading(true);
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.data;
      
      if (userData) {
        setDriverStats({
          license_number: userData.license_number || 'N/A',
          license_expiry: userData.license_expiry || 'N/A',
          safety_score: userData.safety_score || 0,
          total_trips: userData.total_trips || 0,
          total_distance: userData.total_distance || 0,
        });
      }
    } catch (error) {
      console.error('Failed to load driver stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchCurrentUser());
    loadDriverStats();
  }, [dispatch, loadDriverStats]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const avatarUrl = response.data.data?.url || response.data.url;
      dispatch(updateProfile({ avatar: avatarUrl } as any));
      toast.success('Profile picture updated');
    } catch (error: any) {
      toast.error('Failed to upload image. Try again later.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'N/A') return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (dateStr: string) => {
    if (!dateStr || dateStr === 'N/A') return 0;
    const expiry = new Date(dateStr);
    const now = new Date();
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getRoleBadge = (role: string) => {
    const configs: Record<string, string> = {
      FLEET_MANAGER: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300',
      DRIVER: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300',
      SAFETY_OFFICER: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300',
      FINANCIAL_ANALYST: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300',
    };
    return configs[role] || 'bg-gray-50 text-gray-700';
  };

  const formatRole = (role: string) => {
    return role?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'User';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-fade-in">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">My Profile</h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Manage your account settings and view your fleet credentials.
          </p>
        </div>
        <button onClick={loadDriverStats} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-all">
          <RefreshCw className="h-4 w-4 text-gray-400" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 flex flex-col items-center text-center shadow-sm">
          <div className="relative mb-4 group cursor-pointer" onClick={handleAvatarClick}>
            <div className={`h-24 w-24 rounded-full border-4 border-[#714B67]/20 overflow-hidden shadow-sm relative ${isUploading ? 'opacity-50' : ''}`}>
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=714B67&color=fff&size=256`}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white h-6 w-6" />
              </div>
            </div>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-[#714B67] animate-spin" />
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
          
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-zinc-100">{user?.name || 'User'}</h2>
          <span className={`mt-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getRoleBadge(user?.role || '')}`}>
            {formatRole(user?.role || '')}
          </span>

          <div className="w-full border-t border-gray-100 dark:border-zinc-800 my-5 pt-4 space-y-3.5 text-left text-xs">
            <div className="flex items-center gap-2.5 text-gray-600 dark:text-zinc-400">
              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="font-semibold truncate">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-600 dark:text-zinc-400">
              <Phone className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="font-semibold">{user?.phone || '+91 XXXXXXXXXX'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-600 dark:text-zinc-400">
              <Shield className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="font-semibold">ID: {user?.id?.substring(0, 8) || 'N/A'}...</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="md:col-span-2 space-y-6">
          
          {statsLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : driverStats ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Safety Score</span>
                    <Award className="h-4 w-4 text-[#714B67]" />
                  </div>
                  <span className="text-2xl font-black text-[#714B67]">{driverStats.safety_score}%</span>
                  <span className="block text-[9px] font-bold text-gray-500 mt-1">
                    {driverStats.safety_score >= 90 ? 'Excellent' : driverStats.safety_score >= 70 ? 'Good' : 'Needs Review'}
                  </span>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Trips</span>
                    <Truck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <span className="text-2xl font-black text-gray-900 dark:text-zinc-100">{driverStats.total_trips}</span>
                  <span className="block text-[9px] font-bold text-gray-500 mt-1">Completed</span>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Distance</span>
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-xl font-black text-gray-900 dark:text-zinc-100">{driverStats.total_distance.toLocaleString()} km</span>
                  <span className="block text-[9px] font-bold text-gray-500 mt-1">Lifetime</span>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">License</span>
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-lg font-black text-gray-900 dark:text-zinc-100">
                    {getDaysUntilExpiry(driverStats.license_expiry)} days
                  </span>
                  <span className="block text-[9px] font-bold text-gray-500 mt-1">Until expiry</span>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 border-b border-gray-100 dark:border-zinc-800 pb-2">
                  License & Compliance
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">License Number</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-zinc-100">{driverStats.license_number}</span>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Expiry Date</span>
                    <span className="font-bold text-gray-900 dark:text-zinc-100">{formatDate(driverStats.license_expiry)}</span>
                    {getDaysUntilExpiry(driverStats.license_expiry) < 30 && (
                      <span className="text-[10px] text-red-600 font-bold block mt-1">Expiring soon!</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-8 text-center">
              <User className="h-10 w-10 text-gray-300 dark:text-zinc-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">No driver statistics available.</p>
              <p className="text-xs text-gray-400 mt-1">Stats appear for users with Driver roles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};