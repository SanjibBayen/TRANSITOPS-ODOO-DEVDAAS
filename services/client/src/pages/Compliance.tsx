import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Calendar, CheckCircle2, AlertTriangle, UserCheck } from 'lucide-react';

interface ComplianceLog {
  id: string;
  driverName: string;
  category: 'Drug Screen' | 'Background Check' | 'Physical Fitness' | 'Defensive Driving';
  status: 'Compliant' | 'Pending Renewal' | 'Non-Compliant';
  verifiedDate: string;
  expiryDate: string;
  auditor: string;
}

export const Compliance: React.FC = () => {
  const [logs] = useState<ComplianceLog[]>([
    { id: 'CMP001', driverName: 'Suresh Kumar', category: 'Background Check', status: 'Compliant', verifiedDate: '2026-01-15', expiryDate: '2027-01-15', auditor: 'Safety Insp. Rajan' },
    { id: 'CMP002', driverName: 'Suresh Kumar', category: 'Physical Fitness', status: 'Compliant', verifiedDate: '2026-05-10', expiryDate: '2027-05-10', auditor: 'MedLabs Depot' },
    { id: 'CMP003', driverName: 'Jagdish Singh', category: 'Defensive Driving', status: 'Compliant', verifiedDate: '2025-08-20', expiryDate: '2026-08-20', auditor: 'Transit Training Acad' },
    { id: 'CMP004', driverName: 'Amit Verma', category: 'Drug Screen', status: 'Pending Renewal', verifiedDate: '2025-10-05', expiryDate: '2026-07-25', auditor: 'MedLabs Depot' },
    { id: 'CMP005', driverName: 'Rajesh Khanna', category: 'Physical Fitness', status: 'Non-Compliant', verifiedDate: '2025-04-12', expiryDate: '2026-04-12', auditor: 'MedLabs Depot' },
    { id: 'CMP006', driverName: 'Mohammad Ali', category: 'Background Check', status: 'Compliant', verifiedDate: '2026-03-01', expiryDate: '2027-03-01', auditor: 'Safety Insp. Rajan' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.driverName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.auditor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || log.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: ComplianceLog['status']) => {
    switch (status) {
      case 'Compliant':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
            <CheckCircle2 className="h-3 w-3 shrink-0" />
            Compliant
          </span>
        );
      case 'Pending Renewal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider">
            <Calendar className="h-3 w-3 shrink-0" />
            Due Soon
          </span>
        );
      case 'Non-Compliant':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 text-[10px] font-black uppercase tracking-wider">
            <AlertTriangle className="h-3 w-3 shrink-0" />
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  const categories = ['All', 'Drug Screen', 'Background Check', 'Physical Fitness', 'Defensive Driving'];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in font-sans text-gray-800 dark:text-zinc-200">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">
            Safety &amp; Compliance Audit
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Monitor and record essential driver certifications, medical checks, background screenings, and training statuses.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white dark:bg-zinc-900 p-5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Overall Compliance Rate</span>
            <ShieldCheck className="h-5 w-5 text-[#714B67]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-zinc-100">83.3%</span>
            <span className="text-xs font-bold text-emerald-600">(5 of 6 active)</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full mt-4">
            <div className="bg-[#714B67] h-1.5 rounded-full" style={{ width: '83.3%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Upcoming Renewals</span>
            <Calendar className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-zinc-100">1</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Requires review in 15 days</span>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-4 font-medium">Next: Amit Verma - Drug Screen (2026-07-25)</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Compliance Violations</span>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-600">1</span>
            <span className="text-xs font-bold text-red-500">Critical action required</span>
          </div>
          <p className="text-[10px] text-red-600 dark:text-red-400 mt-4 font-bold">Active dispatch warning: Rajesh Khanna</p>
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
              placeholder="Search driver or auditor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-1.5 pl-9 pr-3 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Filter className="h-4 w-4 text-gray-400 hidden sm:block" />
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border cursor-pointer transition-colors ${
                    filterCategory === cat
                      ? 'bg-[#714B67] text-white border-[#714B67]'
                      : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50/70 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider text-[9px]">
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Driver Name</th>
                <th className="py-3 px-4">Audit Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Verified Date</th>
                <th className="py-3 px-4">Expiration Date</th>
                <th className="py-3 px-4">Auditing Vendor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 font-medium">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#714B67] dark:text-purple-300">{log.id}</td>
                  <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-zinc-100">{log.driverName}</td>
                  <td className="py-3.5 px-4 font-bold">{log.category}</td>
                  <td className="py-3.5 px-4">{getStatusBadge(log.status)}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-500 dark:text-zinc-400">{log.verifiedDate}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-500 dark:text-zinc-400 font-bold">{log.expiryDate}</td>
                  <td className="py-3.5 px-4 text-gray-500 dark:text-zinc-400">{log.auditor}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 font-bold">
                    No matching compliance logs found.
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
