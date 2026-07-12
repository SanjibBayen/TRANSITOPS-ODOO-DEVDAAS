import React, { useState, useEffect } from 'react';
import { useVehicles } from '../hooks/useVehicles.ts';
import { useDrivers } from '../hooks/useDrivers.ts';
import { useTrips } from '../hooks/useTrips.ts';
import { 
  AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  LineChart, Line 
} from 'recharts';
import { 
  Navigation, CalendarCheck, Search, SlidersHorizontal, Check, Eye, Trash2,
  TrendingUp, Compass, ArrowUpRight, ArrowDownRight, MapPin
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../store/slices/uiSlice.ts';

// Sparkline Mock Data - subtle operational fluctuations
const sparkData1 = [
  { val: 78 }, { val: 79 }, { val: 82 }, { val: 80 }, { val: 81 }, { val: 83 }, { val: 81 }
];
const sparkData2 = [
  { val: 45 }, { val: 48 }, { val: 52 }, { val: 50 }, { val: 53 }, { val: 51 }, { val: 53 }
];
const sparkData3 = [
  { val: 44 }, { val: 43 }, { val: 40 }, { val: 41 }, { val: 43 }, { val: 42 }, { val: 42 }
];
const sparkData4 = [
  { val: 6 }, { val: 7 }, { val: 5 }, { val: 5 }, { val: 6 }, { val: 4 }, { val: 5 }
];
const sparkData5 = [
  { val: 24 }, { val: 25 }, { val: 26 }, { val: 26 }, { val: 25 }, { val: 26 }, { val: 26 }
];

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { vehicles, loadVehicles, metrics: vMetrics } = useVehicles();
  const { drivers, loadDrivers, metrics: dMetrics } = useDrivers();
  const { trips, loadTrips, changeTripStatus, removeTrip, metrics: tMetrics } = useTrips();

  useEffect(() => {
    loadVehicles();
    loadDrivers();
    loadTrips();
  }, []);

  // Local Search state for the trips table
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'On Trip' | 'Completed'>('All');

  // Compute live Vehicle distribution percentages
  const vTotal = vehicles.length || 1; // avoid divide by zero
  const pctAvailable = Math.round((vMetrics.availableCount / vTotal) * 100);
  const pctOnTrip = Math.round((vMetrics.activeCount / vTotal) * 100);
  const pctInShop = Math.round((vMetrics.inShopCount / vTotal) * 100);
  const pctRetired = Math.round((vMetrics.retiredCount / vTotal) * 100);

  // Filter trips based on tableSearch and statusFilter
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
      trip.vehicleName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      trip.driverName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      trip.destination.toLowerCase().includes(tableSearch.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && trip.status === statusFilter;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      
      {/* Upper Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">
            Operational Overview
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Systemic telematics, dispatcher assignments, and real-time fleet health triggers.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 bg-[#eae8e7] dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-[#d1c3ca] dark:border-zinc-700">
            Period: Today (12h)
          </span>
          <button 
            onClick={() => dispatch(setActiveTab('trips'))}
            className="rounded-xl bg-[#714B67] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#5e3b56] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="h-4 w-4" />
            Open Map Desk
          </button>
        </div>
      </div>

      {/* KPI Grid Section (Exact replica of Mockup 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Fleet Utilization */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                Fleet Utilization
              </span>
              <span className="text-3xl font-extrabold text-[#1b1c1c] dark:text-zinc-100 tracking-tight block mt-1">
                81%
              </span>
            </div>
            <span className="text-[10px] font-extrabold text-[#10b981] bg-[#e6fcf5] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" />
              +3.2%
            </span>
          </div>
          {/* Sparkline chart */}
          <div className="h-10 mt-3.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData1}>
                <defs>
                  <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#714B67" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#714B67" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#714B67" strokeWidth={1.5} fillOpacity={1} fill="url(#colorUtil)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI 2: Active Vehicles */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                Active Vehicles
              </span>
              <span className="text-3xl font-extrabold text-[#006a68] tracking-tight block mt-1">
                {vMetrics.activeCount}
              </span>
            </div>
            <span className="text-[10px] font-extrabold text-[#10b981] bg-[#e6fcf5] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" />
              +8.7%
            </span>
          </div>
          {/* Sparkline */}
          <div className="h-10 mt-3.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData2}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006a68" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#006a68" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#006a68" strokeWidth={1.5} fillOpacity={1} fill="url(#colorActive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI 3: Available Vehicles */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                Available Vehicles
              </span>
              <span className="text-3xl font-extrabold text-[#34451e] tracking-tight block mt-1">
                {vMetrics.availableCount}
              </span>
            </div>
            <span className="text-[10px] font-extrabold text-[#10b981] bg-[#e6fcf5] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" />
              +12.1%
            </span>
          </div>
          {/* Sparkline */}
          <div className="h-10 mt-3.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData3}>
                <defs>
                  <linearGradient id="colorAvail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34451e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#34451e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#34451e" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAvail)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI 4: Vehicles In Shop */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                In Shop (Service)
              </span>
              <span className="text-3xl font-extrabold text-red-600 tracking-tight block mt-1">
                {vMetrics.inShopCount < 10 ? `0${vMetrics.inShopCount}` : vMetrics.inShopCount}
              </span>
            </div>
            <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowDownRight className="h-3 w-3" />
              -2.5%
            </span>
          </div>
          {/* Sparkline */}
          <div className="h-10 mt-3.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData4}>
                <defs>
                  <linearGradient id="colorShop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#ef4444" strokeWidth={1.5} fillOpacity={1} fill="url(#colorShop)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI 5: Drivers On Duty */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                Drivers On Duty
              </span>
              <span className="text-3xl font-extrabold text-gray-700 dark:text-zinc-300 tracking-tight block mt-1">
                {dMetrics.onDutyCount}
              </span>
            </div>
            <span className="text-[10px] font-extrabold text-[#10b981] bg-[#e6fcf5] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" />
              +5.4%
            </span>
          </div>
          {/* Sparkline */}
          <div className="h-10 mt-3.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData5}>
                <defs>
                  <linearGradient id="colorDrivers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#374151" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#374151" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#374151" strokeWidth={1.5} fillOpacity={1} fill="url(#colorDrivers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Main Content Dashboard layout: Split 1/3 (distribution / shortcuts) and 2/3 (recent active trips) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Distribution & Stats (1/3 size) */}
        <div className="space-y-6">
          
          {/* Vehicle Status Distribution Card (from Mockup 1) */}
          <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[#1b1c1c] dark:text-zinc-100 tracking-wide">
                Vehicle Status Distribution
              </h2>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 font-semibold">
                Live monitoring of assets currently indexed.
              </p>
            </div>

            <div className="space-y-4.5 pt-2">
              {/* Progress 1: Available */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#34451e] flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#829c62]" />
                    Available (Ready)
                  </span>
                  <span className="font-extrabold text-[#4d4847] dark:text-zinc-300">
                    {vMetrics.availableCount} Units ({pctAvailable}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[#f5f3f3] dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#829c62] rounded-full transition-all duration-500" 
                    style={{ width: `${pctAvailable}%` }}
                  />
                </div>
              </div>

              {/* Progress 2: On Trip */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#006a68] flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#008f8c]" />
                    On Active Route
                  </span>
                  <span className="font-extrabold text-[#4d4847] dark:text-zinc-300">
                    {vMetrics.activeCount} Units ({pctOnTrip}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[#f5f3f3] dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#008f8c] rounded-full transition-all duration-500" 
                    style={{ width: `${pctOnTrip}%` }}
                  />
                </div>
              </div>

              {/* Progress 3: In Shop */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-red-600 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    In Service Shop
                  </span>
                  <span className="font-extrabold text-[#4d4847] dark:text-zinc-300">
                    {vMetrics.inShopCount} Units ({pctInShop}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[#f5f3f3] dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full transition-all duration-500" 
                    style={{ width: `${pctInShop}%` }}
                  />
                </div>
              </div>

              {/* Progress 4: Retired */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    Decommissioned
                  </span>
                  <span className="font-extrabold text-[#4d4847] dark:text-zinc-300">
                    {vMetrics.retiredCount} Units ({pctRetired}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[#f5f3f3] dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-400 rounded-full transition-all duration-500" 
                    style={{ width: `${pctRetired}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Quick Active/Pending Trip mini row blocks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-[#eef2f6] flex items-center justify-center text-blue-600 shrink-0">
                <Navigation className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Active Trips</span>
                <span className="text-xl font-extrabold text-[#1b1c1c] dark:text-zinc-100">{tMetrics.activeTripsCount} Routes</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-[#fbf6ef] flex items-center justify-center text-[#b45309] shrink-0">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Pending Logs</span>
                <span className="text-xl font-extrabold text-[#1b1c1c] dark:text-zinc-100">{tMetrics.draftTripsCount} Drafts</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Recent Trips Table (2/3 size - Exact layout of Mockup 1) */}
        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between overflow-hidden">
          
          {/* Header block with search filters */}
          <div className="p-5 border-b border-gray-200 dark:border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#1b1c1c] dark:text-zinc-100 tracking-wide">
                  Recent Routes & Active Trips
                </h2>
                <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 font-semibold">
                  Live vehicle locations and status coordinates.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setStatusFilter('All')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    statusFilter === 'All' ? 'bg-[#714B67] text-white shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-[#1b1c1c] dark:hover:text-white dark:text-zinc-100'
                  }`}
                >
                  All Logs
                </button>
                <button 
                  onClick={() => setStatusFilter('On Trip')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    statusFilter === 'On Trip' ? 'bg-[#714B67] text-white shadow-sm' : 'text-gray-500 dark:text-zinc-400 hover:text-[#1b1c1c] dark:hover:text-white dark:text-zinc-100'
                  }`}
                >
                  On Route
                </button>
              </div>
            </div>

            {/* Inner Table Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-zinc-400" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter trips by Pilot, ID, Vehicle, or Depot..."
                  className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 pl-9 pr-4 text-xs text-[#1b1c1c] dark:text-zinc-100 placeholder-[#80747a] dark:placeholder-zinc-500 focus:border-[#714B67] focus:bg-white dark:focus:bg-zinc-900 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#714B67] transition-all font-medium"
                />
              </div>
              <button className="px-3.5 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 text-xs font-bold text-[#4d4847] dark:text-zinc-300 hover:bg-[#f5f3f3] dark:hover:bg-zinc-800 transition-all flex items-center gap-1.5 shrink-0">
                <SlidersHorizontal className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                More Filters
              </button>
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f3f3] dark:bg-zinc-800 text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800">
                  <th className="py-3 px-4 w-10">
                    <input type="checkbox" className="rounded border-gray-300 dark:border-zinc-700 text-[#714B67] focus:ring-[#714B67]" />
                  </th>
                  <th className="py-3 px-4">Trip ID</th>
                  <th className="py-3 px-4">Allocated Asset</th>
                  <th className="py-3 px-4">Pilot Pilot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">ETA Remaining</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eae8e7] dark:divide-zinc-800">
                {filteredTrips.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs font-bold text-gray-500 dark:text-zinc-400">
                      No active trips match the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs font-medium text-[#4d4847] dark:text-zinc-300 transition-all group">
                      <td className="py-3.5 px-4">
                        <input type="checkbox" className="rounded border-gray-300 dark:border-zinc-700 text-[#714B67] focus:ring-[#714B67]" />
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#714B67] bg-[#fdfafc] dark:bg-[#714B67]/20 rounded-md px-1 py-0.5">
                        {trip.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-[#1b1c1c] dark:text-zinc-100 block">{trip.vehicleName}</span>
                          <span className="text-[10px] text-gray-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0 text-[#829c62]" />
                            Loc: {trip.currentLocation}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#1b1c1c] dark:text-zinc-100">
                        {trip.driverName}
                      </td>
                      <td className="py-3.5 px-4">
                        {trip.status === 'On Trip' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1c3830] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#34d399] uppercase border border-[#0d503c]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] pulse-dot-teal" />
                            ON TRIP
                          </span>
                        ) : trip.status === 'Completed' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#34451e]/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#34451e] uppercase border border-[#34451e]/20">
                            <Check className="h-3.5 w-3.5" />
                            COMPLETED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-red-600 uppercase border border-red-200">
                            {trip.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold block text-[#1b1c1c] dark:text-zinc-100">
                          {trip.eta}
                        </span>
                        {trip.etaMinutes > 0 && (
                          <span className="text-[10px] font-semibold text-gray-500 dark:text-zinc-400 mt-0.5 block">
                            ({trip.etaMinutes}m out)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {trip.status === 'On Trip' && (
                            <button
                              onClick={() => changeTripStatus(trip.id, 'Completed')}
                              className="p-1 rounded bg-[#e6fcf5] text-[#006a68] hover:bg-[#006a68] hover:text-white transition-all cursor-pointer"
                              title="Mark as Completed"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => dispatch(setActiveTab('trips'))}
                            className="p-1 rounded bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 dark:bg-zinc-700 transition-all cursor-pointer"
                            title="Live Map Track"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeTrip(trip.id)}
                            className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Pagination */}
          <div className="p-4 bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-zinc-400 font-semibold">
            <span>
              Showing 1-{filteredTrips.length} of {filteredTrips.length} active routes
            </span>
            <div className="flex items-center gap-1.5">
              <button className="px-3 py-1.5 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-[#f5f3f3] dark:hover:bg-zinc-800 transition-all disabled:opacity-40" disabled>
                Previous
              </button>
              <button className="px-3 py-1.5 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-[#f5f3f3] dark:hover:bg-zinc-800 transition-all disabled:opacity-40" disabled>
                Next
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
