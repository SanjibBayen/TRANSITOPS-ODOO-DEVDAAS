import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index.ts';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line, Cell
} from 'recharts';
import { 
  BarChart3, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  Percent, 
  Coins, 
  TrendingUp, 
  Award,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

// Monthly operational trend data
const monthlyTrends = [
  { month: 'Jan', revenue: 420000, utilization: 75, fuelCost: 85000, maintenance: 45000 },
  { month: 'Feb', revenue: 480000, utilization: 78, fuelCost: 92000, maintenance: 38000 },
  { month: 'Mar', revenue: 510000, utilization: 82, fuelCost: 98000, maintenance: 52000 },
  { month: 'Apr', revenue: 490000, utilization: 80, fuelCost: 95000, maintenance: 41000 },
  { month: 'May', revenue: 540000, utilization: 84, fuelCost: 104000, maintenance: 35000 },
  { month: 'Jun', revenue: 620000, utilization: 87, fuelCost: 115000, maintenance: 48000 },
  { month: 'Jul', revenue: 680000, utilization: 89, fuelCost: 120000, maintenance: 54000 }
];

// Driver performance data
const driverPerfData = [
  { name: 'Suresh K.', score: 96, trips: 154 },
  { name: 'Jagdish S.', score: 98, trips: 218 },
  { name: 'Amit V.', score: 92, trips: 98 },
  { name: 'Rajesh K.', score: 84, trips: 112 },
  { name: 'Mohammad A.', score: 95, trips: 45 }
];

export const Analytics: React.FC = () => {
  const { fuelLogs, tollExpenses, maintenanceExpenses } = useSelector((state: RootState) => state.expenses);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  // Calculate live values from Redux (TASK 11)
  const totalFuelCost = fuelLogs.reduce((sum, l) => sum + l.cost, 0);
  const totalTollCost = tollExpenses.reduce((sum, t) => sum + t.amount, 0);
  const totalMaintCost = maintenanceExpenses.reduce((sum, m) => sum + m.amount, 0);
  const liveExpenses = totalFuelCost + totalTollCost + totalMaintCost;

  // Let's use standard benchmark vehicle revenues to compute ROI (TASK 4)
  // ROI formula: ((Revenue - Expenses) / Expenses) * 100
  const vehicleRevBenchmarks = {
    'GJ01AB4521': 45000, // VAN-05
    'MH12BC3322': 58000, // VAN-08
    'KA03MN4545': 64000, // REF-04
    'DL04CK1212': 32000, // VAN-02
    'GJ01XY9876': 42000, // Generic
  };

  const getVehicleRoiAnalysis = () => {
    const analysis: Record<string, { name: string; fuel: number; toll: number; maint: number; expenses: number; revenue: number }> = {
      'GJ01AB4521': { name: 'VAN-05 Transit Prime', fuel: 0, toll: 0, maint: 0, expenses: 0, revenue: vehicleRevBenchmarks['GJ01AB4521'] },
      'MH12BC3322': { name: 'VAN-08 Swift Delivery', fuel: 0, toll: 0, maint: 0, expenses: 0, revenue: vehicleRevBenchmarks['MH12BC3322'] },
      'KA03MN4545': { name: 'REF-04 ChillZone 200', fuel: 0, toll: 0, maint: 0, expenses: 0, revenue: vehicleRevBenchmarks['KA03MN4545'] },
      'DL04CK1212': { name: 'VAN-02 EcoExpress', fuel: 0, toll: 0, maint: 0, expenses: 0, revenue: vehicleRevBenchmarks['DL04CK1212'] },
    };

    fuelLogs.forEach(l => {
      const id = l.vehicleId;
      if (analysis[id]) {
        analysis[id].fuel += l.cost;
        analysis[id].expenses += l.cost;
      }
    });

    tollExpenses.forEach(t => {
      const id = t.vehicleId;
      if (analysis[id]) {
        analysis[id].toll += t.amount;
        analysis[id].expenses += t.amount;
      }
    });

    maintenanceExpenses.forEach(m => {
      const id = m.vehicleId;
      if (analysis[id]) {
        analysis[id].maint += m.amount;
        analysis[id].expenses += m.amount;
      }
    });

    return Object.entries(analysis).map(([id, data]) => {
      const profit = data.revenue - data.expenses;
      const roi = data.expenses > 0 ? Number(((profit / data.expenses) * 100).toFixed(1)) : 0;
      return {
        vehicleId: id,
        ...data,
        profit,
        roi
      };
    });
  };

  const roiData = getVehicleRoiAnalysis();

  const handleDownload = (format: 'PDF' | 'Excel') => {
    setDownloadingFormat(format);
    setTimeout(() => {
      setDownloadingFormat(null);
    }, 1500);
  };

  // Grand totals for KPIs
  const totalRevenueBenchmark = Object.values(vehicleRevBenchmarks).reduce((a, b) => a + b, 0);
  const averageRoiPercent = roiData.length > 0 
    ? (roiData.reduce((sum, r) => sum + r.roi, 0) / roiData.length).toFixed(1) 
    : '0.0';

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in font-sans text-gray-800 dark:text-zinc-200">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">
            Analytics &amp; Intelligence Reports
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Audit comprehensive logistics ROIs, active fleet utilization rates, and driver risk scores.
          </p>
        </div>

        {/* Downloads */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleDownload('PDF')}
            disabled={!!downloadingFormat}
            className="px-3.5 py-1.5 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-gray-400" />
            {downloadingFormat === 'PDF' ? 'Compiling PDF...' : 'Download PDF'}
          </button>
          <button
            onClick={() => handleDownload('Excel')}
            disabled={!!downloadingFormat}
            className="px-4 py-2 rounded bg-[#714B67] text-xs font-bold text-white hover:bg-[#5e3b56] shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {downloadingFormat === 'Excel' ? 'Exporting XLS...' : 'Download Excel'}
          </button>
        </div>
      </div>

      {/* KPI Cards Row (TASK 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4.5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Gross Fleet Revenue</span>
          <span className="text-2xl font-black text-gray-900 dark:text-zinc-100 mt-1 block">₹{totalRevenueBenchmark.toLocaleString()}</span>
          <span className="block text-[9px] font-bold text-emerald-600 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="h-3 w-3" />
            +14.2% MoM Growth
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4.5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Combined Expenditures</span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">₹{liveExpenses.toLocaleString()}</span>
          <span className="block text-[9px] font-semibold text-gray-500 dark:text-zinc-400 mt-1">Fuel + Tolls + Maintenance</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4.5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Net Profit Margin</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">₹{(totalRevenueBenchmark - liveExpenses).toLocaleString()}</span>
          <span className="block text-[9px] font-bold text-emerald-600 mt-1 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            High margin target met
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4.5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Average Vehicle ROI</span>
          <span className="text-2xl font-black text-[#714B67] dark:text-purple-300 mt-1 block">{averageRoiPercent}%</span>
          <span className="block text-[9px] font-semibold text-gray-500 dark:text-zinc-400 mt-1">Return on TCO investments</span>
        </div>
      </div>

      {/* Vehicle ROI Leaderboard Table (TASK 4) */}
      <div className="bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50/50 dark:bg-zinc-900">
          <h2 className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
            <Percent className="h-4 w-4 text-[#714B67]" />
            Vehicle Return On Investment (ROI) Leaderboard
          </h2>
          <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 font-medium">
            Calculated as: <span className="font-mono">((Revenue - Operational Expenses) / Operational Expenses) * 100</span>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50/70 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider text-[9px]">
                <th className="py-3 px-4">Vehicle ID</th>
                <th className="py-3 px-4">Vehicle Name</th>
                <th className="py-3 px-4">Gross Revenue (₹)</th>
                <th className="py-3 px-4">TCO Expenses (₹)</th>
                <th className="py-3 px-4">Net Profit (₹)</th>
                <th className="py-3 px-4 text-right">ROI (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 font-semibold text-gray-700 dark:text-zinc-300">
              {roiData.map((row) => (
                <tr key={row.vehicleId} className="hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#714B67] dark:text-purple-300">{row.vehicleId}</td>
                  <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-zinc-100">{row.name}</td>
                  <td className="py-3.5 px-4 font-mono">₹{row.revenue.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-500 dark:text-zinc-400">₹{row.expenses.toLocaleString()}</td>
                  <td className={`py-3.5 px-4 font-mono font-bold ${row.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ₹{row.profit.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black font-mono text-sm">
                    {row.roi >= 100 ? (
                      <span className="text-emerald-600 flex items-center justify-end gap-1 font-extrabold">
                        <ArrowUpRight className="h-4 w-4" />
                        {row.roi}%
                      </span>
                    ) : row.roi >= 0 ? (
                      <span className="text-gray-900 dark:text-zinc-100 flex items-center justify-end gap-1 font-bold">
                        <ArrowUpRight className="h-3.5 w-3.5 text-gray-400" />
                        {row.roi}%
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center justify-end gap-1 font-bold">
                        <ArrowDownRight className="h-3.5 w-3.5" />
                        {row.roi}%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Charts Grid (TASK 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Revenue vs. Expenses */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wide uppercase">
              Operational Expenditures vs Revenue Trend
            </h2>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 font-semibold">
              Monthly overview of net logistics revenues against total operational cost of ownership.
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-zinc-800" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 600, fill: 'currentColor', className: 'text-gray-500 dark:text-zinc-400' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontWeight: 600, fill: 'currentColor', className: 'text-gray-500 dark:text-zinc-400' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                <Bar dataKey="revenue" name="Total Revenue" fill="#714B67" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fuelCost" name="Operational Cost" fill="#006a68" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Vehicle ROI Trends */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 tracking-wide uppercase">
              Vehicle Net Profit Comparison (₹)
            </h2>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 font-semibold">
              Performance analysis visual representing profit margins across main vehicle fleet items.
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-zinc-800" />
                <XAxis dataKey="vehicleId" tick={{ fontSize: 10, fontWeight: 600, fill: 'currentColor', className: 'text-gray-500 dark:text-zinc-400' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontWeight: 600, fill: 'currentColor', className: 'text-gray-500 dark:text-zinc-400' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Bar dataKey="profit" name="Net Profit" fill="#829c62" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
