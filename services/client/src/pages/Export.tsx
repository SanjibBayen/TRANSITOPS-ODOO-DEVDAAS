import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { RootState } from '../store/index';
import { Download, Calendar, Database, FileText, RefreshCw, FileSpreadsheet, FileDown, AlertCircle } from 'lucide-react';
import api from '../lib/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Export: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [dateRange, setDateRange] = useState('this-month');
  const [exportType, setExportType] = useState('vehicles');
  const [exportFormat, setExportFormat] = useState<'CSV' | 'PDF'>('CSV');
  const [isExporting, setIsExporting] = useState(false);
  const [stats, setStats] = useState({ vehicles: 0, trips: 0, expenses: 0, drivers: 0 });

  const exportOptions = [
    { id: 'vehicles', label: 'Vehicles Registry', icon: '🚛' },
    { id: 'drivers', label: 'Drivers Registry', icon: '👨‍✈️' },
    { id: 'trips', label: 'Trips Report', icon: '🗺️' },
    { id: 'expenses', label: 'Expenses Ledger', icon: '💰' },
  ];

  const dateOptions = [
    { id: 'today', label: 'Today' },
    { id: 'this-week', label: 'This Week' },
    { id: 'this-month', label: 'This Month' },
    { id: 'this-quarter', label: 'This Quarter' },
    { id: 'all-time', label: 'All Time' },
  ];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [vehiclesRes, driversRes, tripsRes, expensesRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/drivers'),
        api.get('/trips'),
        api.get('/expenses'),
      ]);
      setStats({
        vehicles: vehiclesRes.data.data?.length || 0,
        drivers: driversRes.data.data?.length || 0,
        trips: tripsRes.data.data?.length || 0,
        expenses: expensesRes.data.data?.length || 0,
      });
    } catch {
      // Stats are optional
    }
  };

  const exportCSV = async () => {
    try {
      let endpoint = '';
      switch (exportType) {
        case 'vehicles': endpoint = '/analytics/export/vehicles/csv'; break;
        case 'trips': endpoint = '/analytics/export/trips/csv'; break;
        default: endpoint = `/${exportType}`;
      }

      if (endpoint.includes('analytics/export')) {
        window.open(`${api.defaults.baseURL}${endpoint}?range=${dateRange}`, '_blank');
      } else {
        const response = await api.get(endpoint, { params: { range: dateRange } });
        const data = response.data.data || response.data;
        downloadCSV(data, `${exportType}-${dateRange}.csv`);
      }
      
      toast.success(`${exportOptions.find(o => o.id === exportType)?.label} exported successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Export failed');
    }
  };

  const exportPDF = async () => {
    try {
      if (exportType === 'vehicles') {
        window.open(`${api.defaults.baseURL}/analytics/export/vehicles/pdf`, '_blank');
      } else if (exportType === 'trips') {
        window.open(`${api.defaults.baseURL}/analytics/export/trips/pdf`, '_blank');
      } else {
        // Generate client-side PDF for other types
        const response = await api.get(`/${exportType}`, { params: { range: dateRange } });
        const data = response.data.data || [];
        generateClientPDF(data, exportType);
      }
      toast.success('PDF report generated');
    } catch (err: any) {
      toast.error('PDF generation failed');
    }
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row: any) => headers.map(h => `"${row[h] || ''}"`).join(',')),
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateClientPDF = (data: any[], type: string) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`TransitOps - ${type.charAt(0).toUpperCase() + type.slice(1)} Report`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()} | Period: ${dateRange}`, 14, 28);

    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      const rows = data.map((row: any) => headers.map(h => String(row[h] || '')));
      autoTable(doc, { startY: 35, head: [headers], body: rows });
    }

    doc.save(`${type}-${dateRange}.pdf`);
    toast.success('PDF downloaded');
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (exportFormat === 'CSV') await exportCSV();
      else await exportPDF();
    } finally {
      setIsExporting(false);
    }
  };

  const statMap: Record<string, number> = {
    vehicles: stats.vehicles,
    drivers: stats.drivers,
    trips: stats.trips,
    expenses: stats.expenses,
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">Data Export</h1>
        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Export fleet data in CSV or PDF format for reporting and compliance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 space-y-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 border-b border-gray-100 dark:border-zinc-800 pb-2">Export Configuration</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase">Data Type</label>
              <select value={exportType} onChange={e => setExportType(e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold focus:border-[#714B67] focus:outline-none">
                {exportOptions.map(o => <option key={o.id} value={o.id}>{o.icon} {o.label} ({statMap[o.id] || 0} records)</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase">Date Range</label>
              <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold focus:border-[#714B67] focus:outline-none">
                {dateOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase">Format</label>
              <div className="flex gap-2">
                {(['CSV', 'PDF'] as const).map(fmt => (
                  <button key={fmt} onClick={() => setExportFormat(fmt)} className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                    exportFormat === fmt ? 'bg-[#714B67] text-white border-[#714B67]' : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                  }`}>
                    {fmt === 'CSV' ? <FileSpreadsheet className="h-4 w-4 inline mr-1" /> : <FileDown className="h-4 w-4 inline mr-1" />}
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
              <Database className="h-4 w-4 text-[#714B67]" />
              Connected to live database
            </div>
            <button onClick={handleExport} disabled={isExporting} className="px-5 py-2.5 bg-[#714B67] text-white font-bold rounded-xl text-xs hover:bg-[#5e3b56] transition-all flex items-center gap-2 disabled:opacity-50">
              {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {isExporting ? 'Generating...' : `Export ${exportFormat}`}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 space-y-4">
          <h3 className="text-xs font-extrabold text-[#714B67] dark:text-purple-300 uppercase tracking-wider">Database Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Vehicles', count: stats.vehicles, icon: '🚛' },
              { label: 'Drivers', count: stats.drivers, icon: '👨‍✈️' },
              { label: 'Trips', count: stats.trips, icon: '🗺️' },
              { label: 'Expenses', count: stats.expenses, icon: '💰' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-zinc-400">{item.icon} {item.label}</span>
                <span className="font-bold text-gray-900 dark:text-zinc-100">{item.count} records</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 dark:border-zinc-800 pt-4">
            <div className="flex items-start gap-2 text-[11px] text-gray-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>All exports are logged for audit compliance. Downloaded files contain current database state.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};