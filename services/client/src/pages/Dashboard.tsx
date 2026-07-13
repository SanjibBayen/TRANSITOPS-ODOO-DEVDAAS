import React, { useState, useEffect, useCallback } from "react";
import api from "../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setActiveTab } from "../store/slices/uiSlice";
import { toast } from "sonner";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip,
} from "recharts";
import {
  Navigation, Search, Check, Trash2, Compass,
  ArrowUpRight, ArrowDownRight, RefreshCw, AlertTriangle,
  MapPin, Truck, User
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tableSearch, setTableSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "DISPATCHED" | "COMPLETED">("All");

  const role = user?.role || 'FLEET_MANAGER';
  const isDriver = role === 'DRIVER';

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashRes, tripRes] = await Promise.all([
        api.get("/analytics/dashboard"),
        api.get("/trips", { params: { limit: 20 } }),
      ]);
      setDashboardData(dashRes.data.data);
      setTrips(tripRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#714B67]" />
        <p className="text-sm font-medium text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  // ============ DRIVER VIEW ============
  if (isDriver) {
    const myTrips = trips.filter((t: any) => 
      t.driver?.name === user?.name || t.driver_id === user?.id
    );
    const activeTrip = myTrips.find((t: any) => t.status === 'DISPATCHED' || t.status === 'IN_PROGRESS');
    const completedCount = myTrips.filter((t: any) => t.status === 'COMPLETED').length;

    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100">My Dashboard</h1>
          <p className="text-xs text-gray-500">Welcome back, {user?.name}!</p>
        </div>

        {/* Driver KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border shadow-sm">
            <span className="text-[10px] font-bold text-gray-500 uppercase">My Trips</span>
            <span className="text-2xl font-black block mt-1">{myTrips.length}</span>
          </div>
          <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border shadow-sm">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Completed</span>
            <span className="text-2xl font-black text-green-600 block mt-1">{completedCount}</span>
          </div>
          <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border shadow-sm">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Status</span>
            <span className="text-2xl font-black text-blue-600 block mt-1">{activeTrip ? 'ON TRIP' : 'AVAILABLE'}</span>
          </div>
        </div>

        {/* Active Trip Card */}
        {activeTrip && (
          <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-bold mb-3">Current Trip</h2>
            <div className="flex items-center gap-2 text-xs mb-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">{activeTrip.status}</span>
              <span className="font-mono font-bold text-[#714B67]">{activeTrip.trip_number}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold mb-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              {activeTrip.source} → {activeTrip.destination}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1"><Truck className="h-3 w-3" />{activeTrip.vehicle?.registration_number || 'N/A'}</span>
              <span>Cargo: {activeTrip.cargo_weight}kg</span>
              <span>Distance: {activeTrip.planned_distance}km</span>
            </div>
            {activeTrip.status === 'DISPATCHED' && (
              <button onClick={async () => {
                try { await api.patch(`/trips/${activeTrip.id}/status`, { status: 'IN_PROGRESS' }); toast.success('Trip started!'); loadData(); }
                catch { toast.error('Failed'); }
              }} className="mt-3 px-4 py-2 rounded-xl bg-[#714B67] text-white text-xs font-bold">Start Trip</button>
            )}
            {activeTrip.status === 'IN_PROGRESS' && (
              <button onClick={async () => {
                try { await api.patch(`/trips/${activeTrip.id}/complete`, {}); toast.success('Trip completed!'); loadData(); }
                catch { toast.error('Failed'); }
              }} className="mt-3 px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-bold">Complete Trip</button>
            )}
          </div>
        )}

        {/* My Trips List */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 border shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-sm font-bold">My Trips ({myTrips.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-800 text-[10px] font-bold uppercase">
                  <th className="py-3 px-4">Trip ID</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Cargo</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {myTrips.map((trip: any) => (
                  <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                    <td className="py-3 px-4 font-mono font-bold text-[#714B67]">{trip.trip_number}</td>
                    <td className="py-3 px-4">{trip.source} → {trip.destination}</td>
                    <td className="py-3 px-4">{trip.vehicle?.registration_number || 'N/A'}</td>
                    <td className="py-3 px-4">{trip.cargo_weight}kg</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        trip.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
                        trip.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>{trip.status}</span>
                    </td>
                  </tr>
                ))}
                {myTrips.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-500">No trips assigned yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============ FLEET MANAGER / OTHER ROLES VIEW ============
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <p className="text-sm font-medium text-red-600">{error}</p>
        <button onClick={loadData} className="rounded-lg bg-[#714B67] px-4 py-2 text-xs font-bold text-white hover:bg-[#5e3b56]">Retry</button>
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
  const t = { active: dashboardData?.trips?.active || 0, pending: dashboardData?.trips?.pending || 0 };

  const filteredTrips = trips.filter((trip: any) => {
    const match = trip.trip_number?.toLowerCase().includes(tableSearch.toLowerCase()) ||
      trip.source?.toLowerCase().includes(tableSearch.toLowerCase());
    return statusFilter === "All" ? match : match && trip.status === statusFilter;
  });

  const spark = (val: number) => [{ v: val-3 }, { v: val-2 }, { v: val-1 }, { v: val }, { v: val+1 }, { v: val }];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100">Operational Overview</h1>
          <p className="text-xs text-gray-500">Real-time fleet metrics and active trip monitoring.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={loadData} className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md hover:bg-gray-200">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button onClick={() => dispatch(setActiveTab("dispatch"))} className="rounded-xl bg-[#714B67] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#5e3b56]">
            <Compass className="h-4 w-4" /> Dispatch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Fleet Utilization", value: `${v.utilization}%`, color: "#714B67", data: spark(v.utilization) },
          { label: "Active Vehicles", value: v.onTrip, color: "#006a68", data: spark(v.onTrip) },
          { label: "Available", value: v.available, color: "#34451e", data: spark(v.available) },
          { label: "In Shop", value: v.inShop, color: "#ef4444", data: spark(v.inShop) },
          { label: "Drivers On Duty", value: d.onDuty, color: "#374151", data: spark(d.onDuty) },
        ].map((card, i) => (
          <div key={i} className="rounded-xl bg-white dark:bg-zinc-900 p-4 border shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="block text-[10px] font-bold text-gray-500 uppercase">{card.label}</span>
                <span className="text-3xl font-black mt-1">{card.value}</span>
              </div>
            </div>
            <div className="h-10 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={card.data}>
                  <defs>
                    <linearGradient id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={card.color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={card.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={card.color} strokeWidth={1.5} fill={`url(#g${i})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="rounded-xl bg-white dark:bg-zinc-900 border p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold">Vehicle Status</h2>
            {[
              { label: "Available", value: v.available, pct: Math.round((v.available/v.total)*100), color: "bg-[#829c62]" },
              { label: "On Route", value: v.onTrip, pct: Math.round((v.onTrip/v.total)*100), color: "bg-[#008f8c]" },
              { label: "In Shop", value: v.inShop, pct: Math.round((v.inShop/v.total)*100), color: "bg-red-500" },
            ].map(item => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold"><span>{item.label}</span><span>{item.value} ({item.pct}%)</span></div>
                <div className="h-2.5 w-full bg-gray-100 dark:bg-zinc-800 rounded-full">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border"><span className="text-[10px] font-bold text-gray-500 uppercase">Active Trips</span><span className="text-xl font-extrabold block mt-1">{t.active}</span></div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border"><span className="text-[10px] font-bold text-gray-500 uppercase">Pending</span><span className="text-xl font-extrabold block mt-1">{t.pending}</span></div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-zinc-900 border shadow-sm overflow-hidden">
          <div className="p-5 border-b space-y-4">
            <div className="flex justify-between">
              <h2 className="text-sm font-bold">Recent Trips</h2>
              <div className="flex gap-2">
                {["All","DISPATCHED","COMPLETED"].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s as any)} className={`px-3 py-1 text-xs font-semibold rounded-md ${statusFilter===s?"bg-[#714B67] text-white":"text-gray-500"}`}>{s==="All"?"All":s==="DISPATCHED"?"Active":"Done"}</button>
                ))}
              </div>
            </div>
            <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><input type="text" value={tableSearch} onChange={e=>setTableSearch(e.target.value)} placeholder="Search trips..." className="w-full rounded-lg border bg-gray-50 dark:bg-zinc-950 py-2 pl-9 pr-4 text-xs" /></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead><tr className="bg-gray-50 dark:bg-zinc-800 text-[10px] font-bold uppercase"><th className="py-3 px-4">Trip ID</th><th className="py-3 px-4">Route</th><th className="py-3 px-4">Vehicle</th><th className="py-3 px-4">Driver</th><th className="py-3 px-4">Cargo</th><th className="py-3 px-4">Status</th></tr></thead>
              <tbody className="divide-y">
                {filteredTrips.length===0 ? <tr><td colSpan={6} className="py-8 text-center text-gray-500">No trips found</td></tr> :
                  filteredTrips.map((trip:any) => (
                    <tr key={trip.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-bold text-[#714B67]">{trip.trip_number}</td>
                      <td className="py-3 px-4">{trip.source} → {trip.destination}<br/><span className="text-[10px] text-gray-500">{trip.planned_distance} km</span></td>
                      <td className="py-3 px-4">{trip.vehicle?.registration_number||'N/A'}</td>
                      <td className="py-3 px-4">{trip.driver?.name||'N/A'}</td>
                      <td className="py-3 px-4">{trip.cargo_weight} kg</td>
                      <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${trip.status==='COMPLETED'?'bg-green-50 text-green-700':trip.status==='CANCELLED'?'bg-red-50 text-red-700':'bg-blue-50 text-blue-700'}`}>{trip.status}</span></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 border-t text-xs text-gray-500 flex justify-between"><span>Showing {filteredTrips.length} trips</span><span className="text-[#714B67] font-bold">Total: {trips.length}</span></div>
        </div>
      </div>
    </div>
  );
};