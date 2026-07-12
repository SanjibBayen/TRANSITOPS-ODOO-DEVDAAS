import React, { useState, useEffect, useCallback } from "react";
import api from "../lib/axios";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../store/slices/uiSlice";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import {
  Navigation,
  CalendarCheck,
  Search,
  SlidersHorizontal,
  Check,
  Eye,
  Trash2,
  TrendingUp,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface DashboardData {
  vehicles: {
    total: number;
    active: number;
    available: number;
    onTrip: number;
    inShop: number;
    utilization: number;
  };
  drivers: {
    total: number;
    available: number;
    onTrip: number;
    offDuty: number;
    suspended: number;
  };
  trips: {
    total: number;
    active: number;
    pending: number;
    completed: number;
  };
  alerts: {
    expiringLicenses: number;
  };
}

interface Trip {
  id: string;
  trip_number: string;
  source: string;
  destination: string;
  cargo_weight: number;
  planned_distance: number;
  status: string;
  revenue: number;
  created_at: string;
  vehicle: {
    registration_number: string;
    model: string;
  };
  driver: {
    name: string;
  };
}

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableSearch, setTableSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "DISPATCHED" | "COMPLETED"
  >("All");

  const loadDashboardData = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get("/analytics/dashboard");
      setDashboardData(response.data.data);
    } catch (err: any) {
      console.error("Failed to load dashboard:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    }
  }, []);

  const loadTrips = useCallback(async () => {
    try {
      const response = await api.get("/trips", { params: { limit: 10 } });
      setTrips(response.data.data || []);
    } catch (err: any) {
      console.error("Failed to load trips:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    loadTrips();
  }, [loadDashboardData, loadTrips]);

  const handleRefresh = () => {
    setIsLoading(true);
    loadDashboardData();
    loadTrips();
  };

  const handleStatusChange = async (tripId: string, newStatus: string) => {
    try {
      await api.patch(`/trips/${tripId}/status`, { status: newStatus });
      loadTrips();
      loadDashboardData();
    } catch (err: any) {
      console.error("Failed to update trip status:", err);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    try {
      await api.patch(`/trips/${tripId}/status`, { status: "CANCELLED" });
      loadTrips();
      loadDashboardData();
    } catch (err: any) {
      console.error("Failed to cancel trip:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#714B67]"></div>
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
        <button
          onClick={handleRefresh}
          className="rounded-lg bg-[#714B67] px-4 py-2 text-xs font-bold text-white hover:bg-[#5e3b56] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  const vMetrics = {
    activeCount: dashboardData?.vehicles?.onTrip || 0,
    availableCount: dashboardData?.vehicles?.available || 0,
    inShopCount: dashboardData?.vehicles?.inShop || 0,
    retiredCount: 0,
    total: dashboardData?.vehicles?.total || 0,
  };

  const dMetrics = {
    onDutyCount: dashboardData?.drivers?.onTrip || 0,
    total: dashboardData?.drivers?.total || 0,
  };

  const tMetrics = {
    activeTripsCount: dashboardData?.trips?.active || 0,
    draftTripsCount: dashboardData?.trips?.pending || 0,
  };

  const expiringLicenses = dashboardData?.alerts?.expiringLicenses ?? 0;
  const fleetUtilization = dashboardData?.vehicles?.utilization || 0;
  const vTotal = vMetrics.total || 1;
  const pctAvailable = Math.round((vMetrics.availableCount / vTotal) * 100);
  const pctOnTrip = Math.round((vMetrics.activeCount / vTotal) * 100);
  const pctInShop = Math.round((vMetrics.inShopCount / vTotal) * 100);
  const pctRetired = Math.round((vMetrics.retiredCount / vTotal) * 100);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.trip_number?.toLowerCase().includes(tableSearch.toLowerCase()) ||
      trip.source?.toLowerCase().includes(tableSearch.toLowerCase()) ||
      trip.destination?.toLowerCase().includes(tableSearch.toLowerCase()) ||
      trip.vehicle?.registration_number
        ?.toLowerCase()
        .includes(tableSearch.toLowerCase()) ||
      trip.driver?.name?.toLowerCase().includes(tableSearch.toLowerCase());

    if (statusFilter === "All") return matchesSearch;
    return matchesSearch && trip.status === statusFilter;
  });

  const sparkData1 = [
    { val: 78 },
    { val: 79 },
    { val: 82 },
    { val: 80 },
    { val: 81 },
    { val: fleetUtilization },
    { val: 81 },
  ];
  const sparkData2 = [
    { val: 45 },
    { val: 48 },
    { val: 52 },
    { val: 50 },
    { val: 53 },
    { val: vMetrics.activeCount },
    { val: 53 },
  ];
  const sparkData3 = [
    { val: 44 },
    { val: 43 },
    { val: 40 },
    { val: 41 },
    { val: 43 },
    { val: vMetrics.availableCount },
    { val: 42 },
  ];
  const sparkData4 = [
    { val: 6 },
    { val: 7 },
    { val: 5 },
    { val: 5 },
    { val: 6 },
    { val: vMetrics.inShopCount },
    { val: 5 },
  ];
  const sparkData5 = [
    { val: 24 },
    { val: 25 },
    { val: 26 },
    { val: 26 },
    { val: 25 },
    { val: dMetrics.onDutyCount },
    { val: 26 },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">
            Operational Overview
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Real-time fleet telematics, dispatch assignments, and operational
            health metrics.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-zinc-400 bg-[#eae8e7] dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-[#d1c3ca] dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button
            onClick={() => dispatch(setActiveTab("trips"))}
            className="rounded-xl bg-[#714B67] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#5e3b56] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="h-4 w-4" />
            Dispatch Board
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                Fleet Utilization
              </span>
              <span className="text-3xl font-extrabold text-[#1b1c1c] dark:text-zinc-100 tracking-tight block mt-1">
                {fleetUtilization}%
              </span>
            </div>
            <span className="text-[10px] font-extrabold text-[#10b981] bg-[#e6fcf5] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight className="h-3 w-3" />
              Live
            </span>
          </div>
          <div className="h-10 mt-3.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData1}>
                <defs>
                  <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#714B67" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#714B67" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#714B67"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorUtil)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

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
              On Route
            </span>
          </div>
          <div className="h-10 mt-3.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData2}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006a68" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#006a68" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#006a68"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorActive)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

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
              Ready
            </span>
          </div>
          <div className="h-10 mt-3.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData3}>
                <defs>
                  <linearGradient id="colorAvail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34451e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#34451e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#34451e"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorAvail)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                In Shop (Service)
              </span>
              <span className="text-3xl font-extrabold text-red-600 tracking-tight block mt-1">
                {vMetrics.inShopCount < 10
                  ? `0${vMetrics.inShopCount}`
                  : vMetrics.inShopCount}
              </span>
            </div>
            <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowDownRight className="h-3 w-3" />
              Service
            </span>
          </div>
          <div className="h-10 mt-3.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData4}>
                <defs>
                  <linearGradient id="colorShop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorShop)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

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
              Active
            </span>
          </div>
          <div className="h-10 mt-3.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData5}>
                <defs>
                  <linearGradient id="colorDrivers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#374151" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#374151" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#374151"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorDrivers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[#1b1c1c] dark:text-zinc-100 tracking-wide">
                Vehicle Status Distribution
              </h2>
              <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 font-semibold">
                Live asset allocation across fleet operations.
              </p>
            </div>

            <div className="space-y-4.5 pt-2">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-[#eef2f6] flex items-center justify-center text-blue-600 shrink-0">
                <Navigation className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">
                  Active Trips
                </span>
                <span className="text-xl font-extrabold text-[#1b1c1c] dark:text-zinc-100">
                  {tMetrics.activeTripsCount} Routes
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-[#fbf6ef] flex items-center justify-center text-[#b45309] shrink-0">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">
                  Pending
                </span>
                <span className="text-xl font-extrabold text-[#1b1c1c] dark:text-zinc-100">
                  {tMetrics.draftTripsCount} Drafts
                </span>
              </div>
            </div>
          </div>

          {dashboardData?.alerts &&
            dashboardData.alerts.expiringLicenses &&
            dashboardData.alerts.expiringLicenses > 0 && (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-red-700 dark:text-red-400">
                    {dashboardData.alerts.expiringLicenses} license(s) expiring
                    soon
                  </span>
                </div>
              </div>
            )}
        </div>

        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#1b1c1c] dark:text-zinc-100 tracking-wide">
                  Recent Routes & Active Trips
                </h2>
                <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 font-semibold">
                  Real-time trip status and vehicle location tracking.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStatusFilter("All")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${statusFilter === "All" ? "bg-[#714B67] text-white shadow-sm" : "text-gray-500 dark:text-zinc-400"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("DISPATCHED")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${statusFilter === "DISPATCHED" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 dark:text-zinc-400"}`}
                >
                  On Route
                </button>
                <button
                  onClick={() => setStatusFilter("COMPLETED")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${statusFilter === "COMPLETED" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 dark:text-zinc-400"}`}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-zinc-400" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Search by trip ID, route, vehicle, or driver..."
                  className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 pl-9 pr-4 text-xs text-[#1b1c1c] dark:text-zinc-100 placeholder-[#80747a] dark:placeholder-zinc-500 focus:border-[#714B67] focus:bg-white dark:focus:bg-zinc-900 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#714B67] transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f3f3] dark:bg-zinc-800 text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800">
                  <th className="py-3 px-4">Trip ID</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Driver</th>
                  <th className="py-3 px-4">Cargo</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eae8e7] dark:divide-zinc-800">
                {filteredTrips.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-xs font-bold text-gray-500 dark:text-zinc-400"
                    >
                      No trips found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs font-medium text-[#4d4847] dark:text-zinc-300 transition-all group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#714B67]">
                        {trip.trip_number}
                      </td>
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-[#1b1c1c] dark:text-zinc-100 block">
                            {trip.source} → {trip.destination}
                          </span>
                          <span className="text-[10px] text-gray-500 dark:text-zinc-400">
                            {trip.planned_distance} km
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold">
                          {trip.vehicle?.registration_number || "N/A"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#1b1c1c] dark:text-zinc-100">
                        {trip.driver?.name || "N/A"}
                      </td>
                      <td className="py-3.5 px-4">{trip.cargo_weight} kg</td>
                      <td className="py-3.5 px-4">
                        {trip.status === "DISPATCHED" ||
                        trip.status === "IN_PROGRESS" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase border border-blue-200 dark:border-blue-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                            {trip.status}
                          </span>
                        ) : trip.status === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-900/30 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-green-600 dark:text-green-400 uppercase border border-green-200 dark:border-green-800">
                            <Check className="h-3.5 w-3.5" />
                            COMPLETED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-gray-600 dark:text-zinc-400 uppercase">
                            {trip.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {trip.status === "DISPATCHED" && (
                            <button
                              onClick={() =>
                                handleStatusChange(trip.id, "IN_PROGRESS")
                              }
                              className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                              title="Start Trip"
                            >
                              <Navigation className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {(trip.status === "DISPATCHED" ||
                            trip.status === "IN_PROGRESS") && (
                            <button
                              onClick={() =>
                                handleStatusChange(trip.id, "COMPLETED")
                              }
                              className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                              title="Complete Trip"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteTrip(trip.id)}
                            className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                            title="Cancel Trip"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400 font-semibold">
            <span>Showing {filteredTrips.length} trips</span>
            <span className="text-[#714B67] font-bold">
              Total: {trips.length} trips in system
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};