import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import { 
  Download, ArrowUpRight, ArrowDownRight, Percent, TrendingUp, 
  FileSpreadsheet, Loader2, RefreshCw
} from 'lucide-react';
import api from '../lib/axios';
import { toast } from 'sonner';

export const Analytics: React.FC = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [roiData, setRoiData] = useState<any[]>([]);
  const [utilization, setUtilization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashboardRes, roiRes, utilizationRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/vehicle-roi'),
        api.get('/analytics/fleet-utilization'),
      ]);
      setDashboard(dashboardRes.data.data);
      setRoiData(roiRes.data.data || []);
      setUtilization(utilizationRes.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load analytics');
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = () => {
    window.open(`${api.defaults.baseURL}/analytics/export/vehicles/pdf`, '_blank');
    toast.success('PDF report downloading');
  };

  const handleExportCSV = () => {
    window.open(`${api.defaults.baseURL}/analytics/export/vehicles/csv`, '_blank');
    toast.success('CSV report downloading');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
        <button onClick={loadAllData} className="px-4 py-2 rounded-xl bg-[#714B67] text-white text-xs font-bold flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  const totalRevenue = roiData.reduce((sum: number, v: any) => sum + (Number(v.total_revenue) || 0), 0);
  const totalMaintenance = roiData.reduce((sum: number, v: any) => sum + (Number(v.total_maintenance_cost) || 0), 0);
  const totalFuel = roiData.reduce((sum: number, v: any) => sum + (Number(v.total_fuel_cost) || 0), 0);
  const totalOther = roiData.reduce((sum: number, v: any) => sum + (Number(v.other_expenses) || 0), 0);
  const totalExpenses = totalMaintenance + totalFuel + totalOther;
  const netProfit = totalRevenue - totalExpenses;
  const averageRoi = roiData.length > 0
    ? (roiData.reduce((sum: number, v: any) => sum + (Number(v.roi_percentage) || 0), 0) / roiData.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">
            Analytics & Intelligence
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Fleet performance metrics, ROI analysis, and operational insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={loadAllData} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-all">
            <RefreshCw className="h-4 w-4 text-gray-500" /> Refresh
          </button>
          <button onClick={handleExportCSV} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-all">
            <FileSpreadsheet className="h-4 w-4 text-gray-500" /> CSV
          </button>
          <button onClick={handleExportPDF} className="px-4 py-2 rounded-xl bg-[#714B67] text-xs font-bold text-white hover:bg-[#5e3b56] shadow-sm flex items-center gap-1.5 transition-all">
            <Download className="h-4 w-4" /> PDF Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Revenue</span>
          <span className="text-2xl font-black text-gray-900 dark:text-zinc-100 mt-1 block">₹{totalRevenue.toLocaleString()}</span>
          <span className="block text-[9px] font-bold text-emerald-600 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="h-3 w-3" /> Revenue from completed trips
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Expenses</span>
          <span className="text-2xl font-black text-red-600 dark:text-red-400 mt-1 block">₹{totalExpenses.toLocaleString()}</span>
          <span className="block text-[9px] font-semibold text-gray-500 mt-1">Fuel + Maintenance + Other</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Net Profit</span>
          <span className={`text-2xl font-black mt-1 block ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ₹{netProfit.toLocaleString()}
          </span>
          <span className="block text-[9px] font-bold text-emerald-600 mt-1 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> Revenue minus all costs
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Average ROI</span>
          <span className="text-2xl font-black text-[#714B67] dark:text-purple-300 mt-1 block">{averageRoi}%</span>
          <span className="block text-[9px] font-semibold text-gray-500 mt-1">Return on investment</span>
        </div>
      </div>

      {/* Fleet Utilization */}
      {utilization && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
            <Percent className="h-4 w-4 text-[#714B67]" /> Fleet Utilization
          </h2>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <p className="text-2xl font-black text-gray-900 dark:text-zinc-100">{utilization.total_active}</p>
              <p className="text-[10px] text-gray-500 mt-1">Total Active</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-black text-green-600">{utilization.available}</p>
              <p className="text-[10px] text-gray-500 mt-1">Available</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-black text-blue-600">{utilization.on_trip}</p>
              <p className="text-[10px] text-gray-500 mt-1">On Trip</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-2xl font-black text-red-600">{utilization.in_shop}</p>
              <p className="text-[10px] text-gray-500 mt-1">In Shop</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold">Utilization Rate</span>
              <span className="font-bold text-[#714B67]">{utilization.utilization_percentage}%</span>
            </div>
            <div className="h-2.5 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-[#714B67] rounded-full transition-all" style={{ width: `${utilization.utilization_percentage}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Vehicle ROI Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
          <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
            <Percent className="h-4 w-4 text-[#714B67]" /> Vehicle ROI Analysis
          </h2>
          <p className="text-[10px] text-gray-500 mt-0.5">ROI = (Revenue - Maintenance - Fuel - Other) / Acquisition Cost × 100</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-800 text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Maintenance</th>
                <th className="py-3 px-4">Fuel</th>
                <th className="py-3 px-4">Other</th>
                <th className="py-3 px-4 text-right">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs font-semibold">
              {roiData.map((row: any) => {
                const roi = Number(row.roi_percentage) || 0;
                return (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                    <td className="py-3 px-4 font-mono font-bold text-[#714B67]">{row.registration_number}</td>
                    <td className="py-3 px-4">{row.model}</td>
                    <td className="py-3 px-4">₹{Number(row.total_revenue || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-red-600">₹{Number(row.total_maintenance_cost || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-amber-600">₹{Number(row.total_fuel_cost || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-500">₹{Number(row.other_expenses || 0).toLocaleString()}</td>
                    <td className={`py-3 px-4 text-right font-black ${roi >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {roi >= 0 ? <ArrowUpRight className="h-3 w-3 inline mr-1" /> : <ArrowDownRight className="h-3 w-3 inline mr-1" />}
                      {roi}%
                    </td>
                  </tr>
                );
              })}
              {roiData.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-500">No ROI data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
          <h2 className="text-sm font-bold mb-3">Vehicle Revenue Comparison</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="registration_number" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString()}`} />
                <Bar dataKey="total_revenue" name="Revenue" fill="#714B67" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
          <h2 className="text-sm font-bold mb-3">Cost Breakdown by Vehicle</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="registration_number" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `₹${val/1000}k`} />
               <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="total_maintenance_cost" name="Maintenance" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total_fuel_cost" name="Fuel" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};