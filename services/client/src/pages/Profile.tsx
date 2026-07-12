import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index.ts';
import { User, Shield, Phone, Mail, Award, Clock, MapPin, Truck } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Hardcoded profile stats for Suresh Kumar
  const driverStats = {
    licenseNo: 'DL-14202609876',
    expiryDate: '2028-11-20',
    safetyScore: 94,
    completedTrips: 18,
    totalDistanceKm: 12450,
    activeVehicle: 'VAN-05 (GJ01AB4521)',
    hoursLogged: 168,
    bloodGroup: 'O+ve'
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-fade-in font-sans text-gray-800 dark:text-zinc-200">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">
          My Driver Profile
        </h1>
        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
          Access your professional fleet credentials, active vehicle assignments, and driving safety scorecard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 p-6 flex flex-col items-center text-center shadow-xs">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
            alt={user?.name}
            className="h-24 w-24 rounded-full border-4 border-[#714B67]/20 object-cover shadow-sm mb-4"
          />
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-zinc-100">{user?.name}</h2>
          <span className="mt-1 px-3 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-wider">
            Active Driver
          </span>

          <div className="w-full border-t border-gray-100 dark:border-zinc-800 my-5 pt-4 space-y-3.5 text-left text-xs">
            <div className="flex items-center gap-2.5 text-gray-600 dark:text-zinc-400">
              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="font-semibold truncate">{user?.email || 'driver@transitops.in'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-600 dark:text-zinc-400">
              <Phone className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="font-semibold">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-600 dark:text-zinc-400">
              <Shield className="h-4 w-4 text-gray-400 shrink-0" />
              <div>
                <span className="font-bold block text-gray-900 dark:text-zinc-100">DL Number</span>
                <span className="font-mono text-[11px] font-bold text-gray-500 dark:text-zinc-400">{driverStats.licenseNo}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Driving Record & Scorecard */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Safety Score</span>
                <Award className="h-4 w-4 text-[#714B67]" />
              </div>
              <span className="text-2xl font-black text-[#714B67] dark:text-purple-300">
                {driverStats.safetyScore}%
              </span>
              <span className="block text-[9px] font-bold text-emerald-600 mt-1">Excellent (Tier-1)</span>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Completed Trips</span>
                <Truck className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-2xl font-black text-gray-900 dark:text-zinc-100">
                {driverStats.completedTrips}
              </span>
              <span className="block text-[9px] font-bold text-gray-500 dark:text-zinc-400 mt-1">All on-time</span>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Distance Driven</span>
                <MapPin className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="text-xl font-black text-gray-900 dark:text-zinc-100">
                {(driverStats.totalDistanceKm).toLocaleString()} km
              </span>
              <span className="block text-[9px] font-bold text-gray-500 dark:text-zinc-400 mt-1">Lifetime fleet miles</span>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Driving Hours</span>
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-2xl font-black text-gray-900 dark:text-zinc-100">
                {driverStats.hoursLogged}h
              </span>
              <span className="block text-[9px] font-bold text-gray-500 dark:text-zinc-400 mt-1">Fatigue logs compliant</span>
            </div>

          </div>

          {/* Additional info section */}
          <div className="bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 border-b border-gray-100 dark:border-zinc-800 pb-2">
              Assigned Vehicle &amp; Compliance Checkpoints
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded border border-gray-100 dark:border-zinc-800/60">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">
                  Active Vehicle Assignment
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-7 w-7 rounded bg-[#714B67]/10 flex items-center justify-center text-[#714B67] shrink-0 font-bold text-xs">
                    V5
                  </div>
                  <div>
                    <span className="font-extrabold block text-gray-900 dark:text-zinc-100">{driverStats.activeVehicle}</span>
                    <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-semibold">Standard dispatch routes only</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-zinc-900/50 rounded border border-gray-100 dark:border-zinc-800/60">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">
                  License Expiration
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-7 w-7 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 font-bold text-xs">
                    OK
                  </div>
                  <div>
                    <span className="font-extrabold block text-gray-900 dark:text-zinc-100">{driverStats.expiryDate}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Valid (850+ days left)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/40 rounded text-xs">
              <span className="font-bold text-[#714B67] dark:text-purple-300 block mb-1">
                🏆 Outstanding Driver Bonus Eligible
              </span>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400">
                Congratulations! Your monthly safety score has remained above 90% for three consecutive billing cycles. You are eligible for the Q2 TransitOps safety dividend disbursement.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
