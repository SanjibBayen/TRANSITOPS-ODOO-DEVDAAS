import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { ShieldCheck, Search, Filter, Calendar, CheckCircle2, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Driver {
  id: string;
  name: string;
  license_number: string;
  license_expiry: string;
  safety_score: number;
  status: string;
  total_trips: number;
}

export const Compliance: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [expiringLicenses, setExpiringLicenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [driversRes, expiringRes] = await Promise.all([
        api.get('/drivers'),
        api.get('/drivers/expiring-licenses'),
      ]);
      setDrivers(driversRes.data.data || []);
      setExpiringLicenses(expiringRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load compliance data');
      toast.error('Failed to load compliance data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.license_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getLicenseStatus = (expiry: string) => {
    if (!expiry) return { label: 'Unknown', color: 'gray', icon: AlertTriangle };
    const daysLeft = Math.ceil((new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 0) return { label: 'Expired', color: 'red', icon: AlertTriangle };
    if (daysLeft <= 30) return { label: `Expires in ${daysLeft}d`, color: 'amber', icon: Calendar };
    return { label: 'Valid', color: 'emerald', icon: CheckCircle2 };
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { color: string; bg: string; label: string }> = {
      AVAILABLE: { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200', label: 'Available' },
      ON_TRIP: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200', label: 'On Trip' },
      OFF_DUTY: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200', label: 'Off Duty' },
      SUSPENDED: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200', label: 'Suspended' },
    };
    const cfg = configs[status] || { color: 'text-gray-500', bg: 'bg-gray-100', label: status };
    return (
      <span className={`inline-flex items-center gap-1 rounded-full ${cfg.bg} px-2.5 py-0.5 text-[10px] font-bold ${cfg.color} border`}>
        {cfg.label}
      </span>
    );
  };

  const compliantCount = drivers.filter(d => d.status === 'AVAILABLE' || d.status === 'ON_TRIP').length;
  const suspendedCount = drivers.filter(d => d.status === 'SUSPENDED').length;
  const expiringCount = expiringLicenses.length;
  const complianceRate = drivers.length > 0 ? Math.round((compliantCount / drivers.length) * 100) : 0;

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
        <button onClick={loadData} className="px-4 py-2 rounded-xl bg-[#714B67] text-white text-xs font-bold flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">
            Safety & Compliance
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Monitor driver certifications, license status, and safety compliance.
          </p>
        </div>
        <button onClick={loadData} className="px-4 py-2 rounded-xl bg-[#714B67] text-white text-xs font-bold flex items-center gap-1.5">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Compliance Rate</span>
            <ShieldCheck className="h-5 w-5 text-[#714B67]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-zinc-100">{complianceRate}%</span>
            <span className="text-xs font-bold text-emerald-600">{compliantCount} of {drivers.length} compliant</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full mt-4">
            <div className="bg-[#714B67] h-1.5 rounded-full transition-all" style={{ width: `${complianceRate}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">License Renewals</span>
            <Calendar className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900 dark:text-zinc-100">{expiringCount}</span>
            <span className="text-xs font-semibold text-gray-500">expiring within 30 days</span>
          </div>
          {expiringLicenses.length > 0 && (
            <p className="text-[10px] text-amber-600 mt-4 font-bold">
              Next: {expiringLicenses[0]?.name} - {expiringLicenses[0]?.license_expiry}
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Suspended Drivers</span>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-600">{suspendedCount}</span>
            <span className="text-xs font-bold text-red-500">drivers suspended</span>
          </div>
        </div>
      </div>

      {/* Expiring Licenses Alert */}
      {expiringLicenses.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Licenses Expiring Soon
          </h3>
          <div className="mt-2 space-y-2">
            {expiringLicenses.map((d: any) => {
              const daysLeft = Math.ceil((new Date(d.license_expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <div key={d.id} className="flex items-center justify-between p-2 bg-white dark:bg-zinc-800 rounded-lg text-xs">
                  <span className="font-bold">{d.name}</span>
                  <span className="text-amber-600 font-bold">{daysLeft} days remaining</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Driver Compliance Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50 dark:bg-zinc-950">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-2 pl-9 pr-3 text-xs focus:border-[#714B67] focus:outline-none"
            />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold">
            <option value="All">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="OFF_DUTY">Off Duty</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-800 text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">License Number</th>
                <th className="py-3 px-4">License Status</th>
                <th className="py-3 px-4">Safety Score</th>
                <th className="py-3 px-4">Total Trips</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs font-semibold">
              {filteredDrivers.map((d) => {
                const licenseStatus = getLicenseStatus(d.license_expiry);
                const StatusIcon = licenseStatus.icon;
                return (
                  <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-zinc-100">{d.name}</td>
                    <td className="py-3 px-4 font-mono text-[#714B67]">{d.license_number}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold text-${licenseStatus.color}-600`}>
                        <StatusIcon className="h-3 w-3" /> {licenseStatus.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${d.safety_score >= 80 ? 'text-green-600' : d.safety_score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        ★ {d.safety_score}/100
                      </span>
                    </td>
                    <td className="py-3 px-4">{d.total_trips}</td>
                    <td className="py-3 px-4">{getStatusBadge(d.status)}</td>
                  </tr>
                );
              })}
              {filteredDrivers.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500">No drivers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};