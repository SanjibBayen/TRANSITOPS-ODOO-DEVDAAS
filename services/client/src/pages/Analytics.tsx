import React, { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { 
  Download, ArrowUpRight, ArrowDownRight, TrendingUp, 
  Loader2, RefreshCw, AlertTriangle
} from 'lucide-react';

interface DashboardData {
  vehicles: { total: number; active: number; available: number; onTrip: number; inShop: number; utilization: number };
  drivers: { total: number; available: number; onTrip: number; offDuty: number; suspended: number };
  trips: { total: number; active: number; pending: number; completed: number };
  alerts: { expiringLicenses: number };
}

interface VehicleROI {
  id: string;
  registration_number: string;
  model: string;
  acquisition_cost: number;
  total_maintenance_cost: number;
  total_fuel_cost: number;
  other_expenses: number;
  total_revenue: number;
  roi_percentage: number;
}

interface VehicleCost {
  id: string;
  registration_number: string;
  model: string;
  acquisition_cost: number;
  total_maintenance_cost: number;
  total_fuel_cost: number;
  other_expenses: number;
  total_revenue: number;
  roi_percentage: number;
}

export const Analytics: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [roiData, setRoiData] = useState<VehicleROI[]>([]);
  const [costData, setCostData] = useState<VehicleCost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashboardRes, roiRes, costRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/vehicle-roi'),
        api.get('/analytics/vehicle-costs'),
      ]);

      setDashboardData(dashboardRes.data.data);
      setRoiData(roiRes.data.data || []);
      setCostData(costRes.data.data || []);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load analytics data';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExport = async (format: 'pdf' | 'csv') => {
    setIsExporting(format);
    try {
      const endpoint = format === 'pdf' 
        ? '/analytics/export/vehicles/pdf' 
        : '/analytics/export/vehicles/csv';
      
      const response = await api.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vehicle-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${format.toUpperCase()} exported successfully`);
    } catch (err: any) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
    } finally {
      setIsExporting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#714B67]" />
        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
        <button onClick={loadData} className="px-4 py-2 rounded-xl bg-[#714B67] text-white text-xs font-bold">
          Retry
        </button>
      </div>
    );
  }

  const totalRevenue = roiData.reduce((sum, r) => sum + (r.total_revenue || 0), 0);
  const totalFuel = costData.reduce((sum, c) => sum + (c.total_fuel_cost || 0), 0);
  const totalMaintenance = costData.reduce((sum, c) => sum + (c.total_maintenance_cost || 0), 0);
  const totalOther = costData.reduce((sum, c) => sum + (c.other_expenses || 0), 0);
  const totalExpenses = totalFuel + totalMaintenance + totalOther;
  const netProfit = totalRevenue - totalExpenses;
  const avgROI = roiData.length > 0 
    ? (roiData.reduce((sum, r) => sum + (r.roi_percentage || 0), 0) / roiData.length).toFixed(1) 
    : '0';

  const monthlyChartData = roiData.map((v) => ({
    name: v.registration_number,
    revenue: v.total_revenue || 0,
    expenses: (v.total_fuel_cost || 0) + (v.total_maintenance_cost || 0) + (v.other_expenses || 0),
    profit: (v.total_revenue || 0) - ((v.total_fuel_cost || 0) + (v.total_maintenance_cost || 0) + (v.other_expenses || 0)),
  }));

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">
            Analytics & Intelligence Reports
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Fleet ROI, utilization rates, and operational cost analysis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={loadData} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-all">
            <RefreshCw className="h-4 w-4 text-gray-400" />
            Refresh
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting === 'pdf'}
            className="px-3.5 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-gray-400" />
            {isExporting === 'pdf' ? 'Exporting...' : 'Export PDF'}
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting === 'csv'}
            className="px-4 py-2 rounded-xl bg-[#714B67] text-xs font-bold text-white hover:bg-[#5e3b56] shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {isExporting === 'csv' ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Fleet Revenue</span>
          <span className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 mt-1 block">₹{totalRevenue.toLocaleString()}</span>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
            <ArrowUpRight className="h-3 w-3" /> Total Revenue
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Total Expenses</span>
          <span className="text-2xl font-black text-red-600 mt-1 block">₹{totalExpenses.toLocaleString()}</span>
          <span className="text-[10px] font-semibold text-gray-500 dark:text-zinc-400 mt-1 block">Fuel + Maintenance + Other</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Net Profit</span>
          <span className={`text-2xl font-black mt-1 block ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ₹{netProfit.toLocaleString()}
          </span>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> Revenue - Expenses
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Average ROI</span>
          <span className="text-2xl font-black text-[#714B67] mt-1 block">{avgROI}%</span>
          <span className="text-[10px] font-semibold text-gray-500 dark:text-zinc-400 mt-1 block">Return on Investment</span>
        </div>
      </div>

      {/* Vehicle ROI Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
          <h2 className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-wider">
            Vehicle ROI Leaderboard
          </h2>
          <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5">
            ROI = (Revenue - Expenses) / Acquisition Cost × 100
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Fuel Cost</th>
                <th className="py-3 px-4">Maint. Cost</th>
                <th className="py-3 px-4">Other</th>
                <th className="py-3 px-4 text-right">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 font-medium text-gray-700 dark:text-zinc-300">
              {roiData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-gray-500">No data available. Complete some trips to see ROI.</td>
                </tr>
              ) : (
                roiData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#714B67]">{row.registration_number}</span>
                      <span className="block text-[10px] text-gray-400">{row.model}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">₹{(row.total_revenue || 0).toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-500">₹{(row.total_fuel_cost || 0).toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-500">₹{(row.total_maintenance_cost || 0).toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-500">₹{(row.other_expenses || 0).toLocaleString()}</td>
                    <td className={`py-3.5 px-4 text-right font-black font-mono text-sm ${
                      (row.roi_percentage || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {(row.roi_percentage || 0) >= 0 ? (
                        <span className="flex items-center justify-end gap-1">
                          <ArrowUpRight className="h-4 w-4" />
                          {row.roi_percentage}%
                        </span>
                      ) : (
                        <span className="flex items-center justify-end gap-1">
                          <ArrowDownRight className="h-4 w-4" />
                          {row.roi_percentage}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 mb-4">Revenue vs Expenses per Vehicle</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200 dark:stroke-zinc-800" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#714B67" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 mb-4">Net Profit per Vehicle</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-200 dark:stroke-zinc-800" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString()}`} />
                <Bar dataKey="profit" name="Net Profit" fill="#829c62" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};