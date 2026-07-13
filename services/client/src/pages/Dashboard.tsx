import React, { useState, useEffect, useCallback } from "react";
import api from "../lib/axios";
import { useDispatch } from "react-redux";
import { setActiveTab } from "../store/slices/uiSlice";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Navigation,
  CalendarCheck,
  Search,
  Check,
  Trash2,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
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
  trips: { total: number; active: number; pending: number; completed: number };
  alerts: { expiringLicenses: number };
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
  vehicle: { registration_number: string; model: string };
  driver: { name: string };
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

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashRes, tripRes] = await Promise.all([
        api.get("/analytics/dashboard"),
        api.get("/trips", { params: { limit: 10 } }),
      ]);
      setDashboardData(dashRes.data.data);
      setTrips(tripRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (tripId: string, newStatus: string) => {
    try {
      await api.patch(`/trips/${tripId}/status`, { status: newStatus });
      toast.success(`Trip ${newStatus.toLowerCase()}`);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update trip");
    }
  };

  const handleCancelTrip = async (tripId: string) => {
    try {
      await api.patch(`/trips/${tripId}/status`, { status: "CANCELLED" });
      toast.success("Trip cancelled");
      loadData();
    } catch (err: any) {
      toast.error("Failed to cancel trip");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#714B67]" />
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
          Loading dashboard...
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
          onClick={loadData}
          className="rounded-lg bg-[#714B67] px-4 py-2 text-xs font-bold text-white hover:bg-[#5e3b56]"
        >
          Retry
        </button>
      </div>
    );
  }

  const v = {
    onTrip: dashboardData?.vehicles?.onTrip || 0,
    available: dashboardData?.vehicles?.available || 0,
    inShop: dashboardData?.vehicles?.inShop || 0,
    total: dashboardData?.vehicles?.total || 1,
    utilization: dashboardData?.vehicles?.utilization || 0,
  };
  const d = { onDuty: dashboardData?.drivers?.onTrip || 0 };
  const t = {
    active: dashboardData?.trips?.active || 0,
    pending: dashboardData?.trips?.pending || 0,
  };

  const filteredTrips = trips.filter((trip) => {
    const match =
      trip.trip_number?.toLowerCase().includes(tableSearch.toLowerCase()) ||
      trip.source?.toLowerCase().includes(tableSearch.toLowerCase()) ||
      trip.destination?.toLowerCase().includes(tableSearch.toLowerCase());
    return statusFilter === "All"
      ? match
      : match && trip.status === statusFilter;
  });

  const spark = (val: number) => [
    { v: val - 3 },
    { v: val - 2 },
    { v: val - 1 },
    { v: val },
    { v: val + 1 },
    { v: val },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">
            Operational Overview
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Real-time fleet metrics and active trip monitoring.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-zinc-400 bg-[#eae8e7] dark:bg-zinc-800 px-2.5 py-1 rounded-md border hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button
            onClick={() => dispatch(setActiveTab("dispatch"))}
            className="rounded-xl bg-[#714B67] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#5e3b56] shadow-sm flex items-center gap-1.5"
          >
            <Compass className="h-4 w-4" /> Dispatch
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Fleet Utilization",
            value: `${v.utilization}%`,
            color: "#714B67",
            icon: ArrowUpRight,
            data: spark(v.utilization),
          },
          {
            label: "Active Vehicles",
            value: v.onTrip,
            color: "#006a68",
            icon: ArrowUpRight,
            data: spark(v.onTrip),
          },
          {
            label: "Available",
            value: v.available,
            color: "#34451e",
            icon: ArrowUpRight,
            data: spark(v.available),
          },
          {
            label: "In Shop",
            value: v.inShop,
            color: "#ef4444",
            icon: ArrowDownRight,
            data: spark(v.inShop),
          },
          {
            label: "Drivers On Duty",
            value: d.onDuty,
            color: "#374151",
            icon: ArrowUpRight,
            data: spark(d.onDuty),
          },
        ].map((card, i) => (
          <div
            key={i}
            className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                  {card.label}
                </span>
                <span className="text-3xl font-extrabold text-[#1b1c1c] dark:text-zinc-100 tracking-tight block mt-1">
                  {card.value}
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-[#10b981] bg-[#e6fcf5] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <card.icon className="h-3 w-3" /> Live
              </span>
            </div>
            <div className="h-10 mt-3.5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={card.data}>
                  <defs>
                    <linearGradient id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={card.color}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={card.color}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={card.color}
                    strokeWidth={1.5}
                    fill={`url(#grad${i})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar stats */}
        <div className="space-y-6">
          <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold">Vehicle Status Distribution</h2>
            {[
              {
                label: "Available",
                value: v.available,
                pct: Math.round((v.available / v.total) * 100),
                color: "bg-[#829c62]",
              },
              {
                label: "On Route",
                value: v.onTrip,
                pct: Math.round((v.onTrip / v.total) * 100),
                color: "bg-[#008f8c]",
              },
              {
                label: "In Shop",
                value: v.inShop,
                pct: Math.round((v.inShop / v.total) * 100),
                color: "bg-red-500",
              },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span>{item.label}</span>
                  <span>
                    {item.value} ({item.pct}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 dark:bg-zinc-800 rounded-full">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border shadow-sm">
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                Active Trips
              </span>
              <span className="text-xl font-extrabold block mt-1">
                {t.active} Routes
              </span>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border shadow-sm">
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                Pending
              </span>
              <span className="text-xl font-extrabold block mt-1">
                {t.pending} Drafts
              </span>
            </div>
          </div>

          {(dashboardData?.alerts?.expiringLicenses ?? 0) > 0 && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 p-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
              <span className="text-xs font-bold text-red-700">
                {dashboardData?.alerts?.expiringLicenses ?? 0} license(s)
                expiring soon
              </span>
            </div>
          )}
        </div>

        {/* Trips Table */}
        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold">Recent Trips</h2>
              <div className="flex gap-2">
                {["All", "DISPATCHED", "COMPLETED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s as any)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md ${statusFilter === s ? "bg-[#714B67] text-white" : "text-gray-500"}`}
                  >
                    {s === "All"
                      ? "All"
                      : s === "DISPATCHED"
                        ? "Active"
                        : "Done"}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search trips..."
                className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 pl-9 pr-4 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f3f3] dark:bg-zinc-800 text-[10px] font-bold text-gray-500 uppercase">
                  <th className="py-3 px-4">Trip ID</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Driver</th>
                  <th className="py-3 px-4">Cargo</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs font-medium">
                {filteredTrips.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No trips found
                    </td>
                  </tr>
                ) : (
                  filteredTrips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-800 group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#714B67]">
                        {trip.trip_number}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold">
                          {trip.source} → {trip.destination}
                        </span>
                        <br />
                        <span className="text-[10px] text-gray-500">
                          {trip.planned_distance} km
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {trip.vehicle?.registration_number || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {trip.driver?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">{trip.cargo_weight} kg</td>
                      <td className="py-3 px-4">
                        {trip.status === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700 border border-green-200">
                            <Check className="h-3 w-3" /> DONE
                          </span>
                        ) : trip.status === "CANCELLED" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">
                            CANCELLED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />{" "}
                            {trip.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {trip.status === "DISPATCHED" && (
                            <button
                              onClick={() =>
                                handleStatusChange(trip.id, "IN_PROGRESS")
                              }
                              className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                              title="Start"
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
                              className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                              title="Complete"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleCancelTrip(trip.id)}
                            className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                            title="Cancel"
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
          <div className="p-4 bg-gray-50 dark:bg-zinc-950 border-t text-xs text-gray-500 flex justify-between">
            <span>Showing {filteredTrips.length} trips</span>
            <span className="text-[#714B67] font-bold">
              Total: {trips.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
