import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/slices/uiSlice.ts';
import { Download, Calendar, Filter, Database, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

export const Export: React.FC = () => {
  const dispatch = useDispatch();

  const [dateRange, setDateRange] = useState('This Month');
  const [exportTarget, setExportTarget] = useState('All Expenses');
  const [exportFormat, setExportFormat] = useState('CSV');
  const [isExporting, setIsExporting] = useState(false);

  const targets = ['All Expenses', 'Fuel Records Only', 'Toll Logs Only', 'Maintenance Ledger Only', 'Active Trips Records'];
  const ranges = ['Today', 'This Week', 'This Month', 'This Quarter', 'Custom Range (FY 25-26)'];

  const handleExport = () => {
    setIsExporting(true);

    // Simulate exporting delay
    setTimeout(() => {
      setIsExporting(false);
      dispatch(addToast({
        type: 'success',
        title: 'Export Generated',
        message: `Successfully formatted and downloaded ${exportTarget} in .${exportFormat.toLowerCase()} structure.`
      }));
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-fade-in font-sans text-gray-800 dark:text-zinc-200">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">
          Financial Ledger Data Export
        </h1>
        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
          Query, filter, and extract pristine financial reports including detailed fuel costs, toll fees, maintenance budgets, and trip revenues.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Export Form */}
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-zinc-100 border-b border-gray-100 dark:border-zinc-800 pb-2">
            Configure Ledger Query Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Target Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
                1. Select Data Sub-ledger
              </label>
              <select
                value={exportTarget}
                onChange={e => setExportTarget(e.target.value)}
                className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-semibold"
              >
                {targets.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Date Range Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
                2. Select Date Period
              </label>
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-semibold"
              >
                {ranges.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Format Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">
                3. File Format
              </label>
              <div className="flex gap-2">
                {['CSV', 'XLSX', 'PDF'].map(fmt => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setExportFormat(fmt)}
                    className={`flex-1 py-2 text-xs font-bold rounded border cursor-pointer transition-all ${
                      exportFormat === fmt
                        ? 'bg-[#714B67] text-white border-[#714B67] shadow-xs'
                        : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    .{fmt.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Database className="h-4 w-4 text-[#714B67]" />
              Includes real-time webhook sync entries
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-2.5 bg-[#714B67] text-white font-bold rounded text-xs hover:bg-[#5e3b56] transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating Ledger...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export to .{exportFormat.toLowerCase()}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="md:col-span-1 bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-extrabold text-[#714B67] dark:text-purple-300 uppercase tracking-wider">
            Enterprise Compliance Notice
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-relaxed font-semibold">
            By downloading these financial ledgers, you certify that you have the appropriate clearance to view confidential company expenditure data. All export transactions are logged with your user identifier for auditing compliance purposes.
          </p>

          <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 space-y-2.5 text-[11px]">
            <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400">
              <FileText className="h-4 w-4 text-gray-400" />
              <span>Includes fuel expenses logs (6 records)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400">
              <FileText className="h-4 w-4 text-gray-400" />
              <span>Includes tolls expenses (14 items)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400">
              <FileText className="h-4 w-4 text-gray-400" />
              <span>Includes active maintenance tasks</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
