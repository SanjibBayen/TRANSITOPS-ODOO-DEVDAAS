import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/index";
import {
  User, Shield, Phone, Mail, Award, Loader2, AlertTriangle
} from "lucide-react";
import api from "../lib/axios";

export const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Load driver profile for DRIVER role
      if (user.role === "DRIVER") {
        const response = await api.get("/drivers");
        const drivers = response.data.data || [];
        const driverProfile = drivers.find(
          (d: any) => d.email === user?.email || d.user_id === user?.id
        );
        setProfile(driverProfile || null);
      } else {
        // For non-driver roles, just use user data
        setProfile({
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || "N/A",
        });
      }
    } catch {
      // Use user data as fallback
      setProfile({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleLabel: Record<string, string> = {
    FLEET_MANAGER: "Fleet Manager",
    DRIVER: "Driver",
    SAFETY_OFFICER: "Safety Officer",
    FINANCIAL_ANALYST: "Financial Analyst",
  };

  const stats = {
    safetyScore: profile?.safety_score ?? 100,
    completedTrips: profile?.total_trips ?? 0,
    totalDistanceKm: profile?.total_distance ?? 0,
    licenseNumber: profile?.license_number ?? "N/A",
    licenseExpiry: profile?.license_expiry ?? "N/A",
    licenseCategory: profile?.license_category ?? "N/A",
    status: profile?.status ?? user?.role ?? "ACTIVE",
  };

  const daysUntilExpiry = profile?.license_expiry
    ? Math.ceil(
        (new Date(profile.license_expiry).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">
          My Profile
        </h1>
        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
          Your fleet credentials, assignments, and performance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 flex flex-col items-center text-center shadow-sm">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#714B67] to-[#5a3b52] flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-zinc-100">
            {user?.name || "User"}
          </h2>
          <span className="mt-1 px-3 py-0.5 bg-purple-50 dark:bg-purple-950/30 text-[#714B67] dark:text-purple-300 rounded-full text-[10px] font-black uppercase tracking-wider">
            {roleLabel[user?.role || ""] || user?.role || "User"}
          </span>

          <div className="w-full border-t border-gray-100 dark:border-zinc-800 my-5 pt-4 space-y-3 text-left text-xs">
            <div className="flex items-center gap-2.5 text-gray-600 dark:text-zinc-400">
              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="font-semibold truncate">
                {user?.email || "N/A"}
              </span>
            </div>
            {(profile?.phone || user?.phone) && (
              <div className="flex items-center gap-2.5 text-gray-600 dark:text-zinc-400">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="font-semibold">{profile?.phone || user?.phone || "N/A"}</span>
              </div>
            )}
            {profile?.license_number && (
              <div className="flex items-center gap-2.5 text-gray-600 dark:text-zinc-400">
                <Shield className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <span className="font-bold block text-gray-900 dark:text-zinc-100">License</span>
                  <span className="font-mono text-[11px] font-bold text-gray-500 dark:text-zinc-400">
                    {stats.licenseNumber}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats - Show for all roles */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Safety Score</span>
              <span className="text-2xl font-black text-[#714B67] block mt-1">{stats.safetyScore}%</span>
              <span className="text-[9px] font-bold text-emerald-600 mt-1">Excellent</span>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Trips Done</span>
              <span className="text-2xl font-black text-gray-900 dark:text-zinc-100 block mt-1">{stats.completedTrips}</span>
              <span className="text-[9px] font-bold text-gray-500 mt-1">Completed</span>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Distance</span>
              <span className="text-xl font-black text-gray-900 dark:text-zinc-100 block mt-1">{stats.totalDistanceKm.toLocaleString()} km</span>
              <span className="text-[9px] font-bold text-gray-500 mt-1">Total driven</span>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
              <span className={`text-lg font-black block mt-1 ${
                stats.status === "AVAILABLE" ? "text-green-600" : 
                stats.status === "ON_TRIP" ? "text-blue-600" : "text-gray-600"
              }`}>
                {stats.status}
              </span>
              <span className="text-[9px] font-bold text-gray-500 mt-1">{stats.licenseCategory}</span>
            </div>
          </div>

          {/* License Info - Only for drivers */}
          {user?.role === "DRIVER" && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100">License & Compliance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">License Number</span>
                  <p className="font-extrabold text-gray-900 dark:text-zinc-100 mt-1 font-mono">{stats.licenseNumber}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Expiry Date</span>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-extrabold text-gray-900 dark:text-zinc-100">{stats.licenseExpiry}</p>
                    {daysUntilExpiry !== null && daysUntilExpiry <= 30 && (
                      <span title={`${daysUntilExpiry} days left`}>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </span>
                    )}
                  </div>
                  {daysUntilExpiry !== null && (
                    <span className={`text-[10px] font-bold ${
                      daysUntilExpiry <= 7 ? "text-red-600" : 
                      daysUntilExpiry <= 30 ? "text-amber-600" : "text-emerald-600"
                    }`}>
                      {daysUntilExpiry} days remaining
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Role Info - For non-drivers */}
          {user?.role !== "DRIVER" && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100">Account Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-3">
                <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Role</span>
                  <p className="font-extrabold text-gray-900 dark:text-zinc-100 mt-1">{roleLabel[user?.role || ""]}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Email</span>
                  <p className="font-extrabold text-gray-900 dark:text-zinc-100 mt-1">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};