import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/slices/uiSlice.ts';
import { Calendar, Search, AlertCircle, ShieldAlert, Send, CheckCircle2, RefreshCw } from 'lucide-react';

interface LicenseRecord {
  driverId: string;
  name: string;
  licenseNo: string;
  stateOfIssue: string;
  expiryDate: string;
  daysRemaining: number;
}

export const LicenseExpiry: React.FC = () => {
  const dispatch = useDispatch();

  const [records, setRecords] = useState<LicenseRecord[]>([
    { driverId: 'DR001', name: 'Suresh Kumar', licenseNo: 'DL-14202609876', stateOfIssue: 'Gujarat', expiryDate: '2028-11-20', daysRemaining: 861 },
    { driverId: 'DR002', name: 'Jagdish Singh', licenseNo: 'DL-16202501234', stateOfIssue: 'Maharashtra', expiryDate: '2026-07-28', daysRemaining: 16 },
    { driverId: 'DR003', name: 'Amit Verma', licenseNo: 'DL-19202605555', stateOfIssue: 'Delhi', expiryDate: '2026-09-14', daysRemaining: 64 },
    { driverId: 'DR004', name: 'Rajesh Khanna', licenseNo: 'DL-20202509999', stateOfIssue: 'Karnataka', expiryDate: '2026-04-12', daysRemaining: -90 },
    { driverId: 'DR005', name: 'Mohammad Ali', licenseNo: 'DL-12202708811', stateOfIssue: 'Uttar Pradesh', expiryDate: '2027-08-30', daysRemaining: 414 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(rec => 
    rec.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    rec.licenseNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusLabelAndColor = (days: number) => {
    if (days < 0) {
      return {
        label: 'Expired',
        badge: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border-red-100 dark:border-red-900',
        dot: 'bg-red-500'
      };
    } else if (days <= 30) {
      return {
        label: 'Critical Danger (<=30 days)',
        badge: 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-900',
        dot: 'bg-rose-500 animate-pulse'
      };
    } else if (days <= 90) {
      return {
        label: 'Warning (30-90 days)',
        badge: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900',
        dot: 'bg-amber-500'
      };
    } else {
      return {
        label: 'Fully Valid',
        badge: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900',
        dot: 'bg-emerald-500'
      };
    }
  };

  const notifyDriver = async (driverName: string, expiryDate: string) => {
    try {
      // Simulate real API call
      const response = await fetch('/api/trigger-expiry-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverName: driverName,
          expiryDate: expiryDate
        })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      dispatch(addToast({
        type: 'success',
        title: 'Email Alert Dispatched',
        message: data.message || `Official renewal alert dispatched securely via SES to driver ${driverName}.`
      }));
    } catch (error: any) {
      dispatch(addToast({
        type: 'error',
        title: 'Email Dispatch Failed',
        message: 'Could not connect to external mail server.'
      }));
    }
  };

  const flagAudit = (driverName: string) => {
    dispatch(addToast({
      type: 'warning',
      title: 'Driver Flagged',
      message: `Driver ${driverName} is now suspended from current dispatch slots until a fresh license record is logged.`
    }));
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in font-sans text-gray-800 dark:text-zinc-200">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">
          DL Expiration &amp; Credentials Tracker
        </h1>
        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
          Enforce complete fleet safety compliance by monitoring national driving licenses, tracking countdown alerts, and flagging expired operators.
        </p>
      </div>

      {/* Critical Status Summary Card */}
      <div className="bg-red-50 dark:bg-red-950/10 rounded border border-red-100 dark:border-red-900/40 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-black text-red-900 dark:text-red-300 uppercase tracking-wider">
              CRITICAL ACTIONS REQUIRED (1 OVERDUE LICENSE)
            </h3>
            <p className="text-[11px] text-red-700 dark:text-red-400 font-semibold mt-0.5">
              Rajesh Khanna has been driving with an expired license for 90 days. Please flag for immediate dispatch suspension.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => flagAudit('Rajesh Khanna')}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[11px] cursor-pointer transition-colors shadow-sm"
          >
            Suspend Driver Immediately
          </button>
        </div>
      </div>

      {/* Interactive Table Section */}
      <div className="bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        
        {/* Table Filters */}
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50 dark:bg-zinc-900/50/50 dark:bg-zinc-900">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search driver or DL number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-1.5 pl-9 pr-3 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-medium"
            />
          </div>
          
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <RefreshCw className="h-3 w-3 animate-spin text-[#714B67]" />
            National database synced 2m ago
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50/70 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider text-[9px]">
                <th className="py-3 px-4">Driver Code</th>
                <th className="py-3 px-4">Driver Name</th>
                <th className="py-3 px-4">License Number</th>
                <th className="py-3 px-4">State of Issue</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4">Days Remaining</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {filteredRecords.map((rec) => {
                const status = getStatusLabelAndColor(rec.daysRemaining);
                return (
                  <tr key={rec.driverId} className="hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 font-medium">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-400">{rec.driverId}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-zinc-100">{rec.name}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-600 dark:text-zinc-300">{rec.licenseNo}</td>
                    <td className="py-3.5 px-4">{rec.stateOfIssue}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-500 dark:text-zinc-400">{rec.expiryDate}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-black uppercase tracking-wider ${status.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {rec.daysRemaining < 0 ? (
                        <span className="text-red-600 font-bold">-{Math.abs(rec.daysRemaining)} days ago</span>
                      ) : (
                        <span className={`font-bold ${rec.daysRemaining <= 30 ? 'text-rose-600' : 'text-gray-900 dark:text-zinc-100'}`}>
                          {rec.daysRemaining} days
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => notifyDriver(rec.name, rec.expiryDate)}
                          className="p-1.5 rounded text-[#714B67] hover:bg-[#714B67]/5 dark:text-purple-300 dark:hover:bg-purple-900/10 cursor-pointer"
                          title="Send Email Notification"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 font-bold">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
