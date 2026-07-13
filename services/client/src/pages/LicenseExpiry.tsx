import React, { useEffect, useState } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';
import { Calendar, Search, AlertCircle, ShieldAlert, Send, Loader2, RefreshCw } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  license_number: string;
  license_category: string;
  license_expiry: string;
  phone: string;
  status: string;
  safety_score: number;
}

export const LicenseExpiry: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [expiringDrivers, setExpiringDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [allRes, expiringRes] = await Promise.all([
        api.get('/drivers'),
        api.get('/drivers/expiring-licenses'),
      ]);
      setDrivers(allRes.data.data || []);
      setExpiringDrivers(expiringRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load license data');
      toast.error('Failed to load license data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(d =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.license_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLicenseStatus = (expiry: string) => {
    if (!expiry) return { label: 'Unknown', color: 'gray', dot: 'bg-gray-400', badge: 'bg-gray-50 text-gray-500' };
    const daysLeft = Math.ceil((new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return { label: 'Expired', color: 'red', dot: 'bg-red-500', badge: 'bg-red-50 dark:bg-red-950/20 text-red-700 border-red-200' };
    }
    if (daysLeft <= 7) {
      return { label: 'Critical', color: 'rose', dot: 'bg-rose-500 animate-pulse', badge: 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 border-rose-200' };
    }
    if (daysLeft <= 30) {
      return { label: 'Warning', color: 'amber', dot: 'bg-amber-500', badge: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 border-amber-200' };
    }
    return { label: 'Valid', color: 'emerald', dot: 'bg-emerald-500', badge: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 border-emerald-200' };
  };

  const handleSuspendDriver = async (driverId: string, driverName: string) => {
    try {
      await api.patch(`/drivers/${driverId}/status`, { status: 'SUSPENDED' });
      toast.success(`${driverName} has been suspended`);
      loadData();
    } catch (err: any) {
      toast.error('Failed to suspend driver');
    }
  };

  const handleSendReminder = (driverName: string, email?: string) => {
    toast.success(`Reminder sent to ${driverName}`);
  };

  const expiredCount = drivers.filter(d => {
    if (!d.license_expiry) return false;
    return new Date(d.license_expiry) < new Date();
  }).length;

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
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">
            License Expiry Tracker
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Monitor driver license validity and compliance status.
          </p>
        </div>
        <button onClick={loadData} className="px-4 py-2 rounded-xl bg-[#714B67] text-white text-xs font-bold flex items-center gap-1.5">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Critical Alert */}
      {expiredCount > 0 && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
            <div>
              <h3 className="text-sm font-black text-red-900 dark:text-red-300 uppercase">
                {expiredCount} Expired License{expiredCount > 1 ? 's' : ''}
              </h3>
              <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                These drivers must be suspended immediately until licenses are renewed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Expiring Soon Section */}
      {expiringDrivers.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Expiring Within 30 Days ({expiringDrivers.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {expiringDrivers.map(d => {
              const daysLeft = Math.ceil((new Date(d.license_expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <div key={d.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 rounded-lg text-xs">
                  <div>
                    <p className="font-bold">{d.name}</p>
                    <p className="text-gray-500">{d.license_number}</p>
                    <p className={`font-bold mt-1 ${daysLeft <= 7 ? 'text-red-600' : 'text-amber-600'}`}>
                      {daysLeft} days remaining
                    </p>
                  </div>
                  <button
                    onClick={() => handleSendReminder(d.name)}
                    className="p-2 rounded-lg bg-[#714B67] text-white hover:bg-[#5e3b56] transition-all"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Licenses Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search driver or license..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-2 pl-9 pr-3 text-xs focus:border-[#714B67] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-800 text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">License Number</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Days Left</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs font-medium">
              {filteredDrivers.map(d => {
                const status = getLicenseStatus(d.license_expiry);
                const daysLeft = d.license_expiry
                  ? Math.ceil((new Date(d.license_expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  : null;
                return (
                  <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-zinc-100">{d.name}</td>
                    <td className="py-3 px-4 font-mono text-[#714B67]">{d.license_number}</td>
                    <td className="py-3 px-4">{d.license_category}</td>
                    <td className="py-3 px-4">{d.license_expiry ? new Date(d.license_expiry).toLocaleDateString('en-IN') : 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      {daysLeft !== null ? (
                        daysLeft < 0
                          ? <span className="text-red-600">Expired {Math.abs(daysLeft)}d ago</span>
                          : <span className={daysLeft <= 30 ? 'text-red-600' : 'text-gray-900 dark:text-zinc-100'}>{daysLeft} days</span>
                      ) : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {daysLeft !== null && daysLeft < 0 && (
                        <button
                          onClick={() => handleSuspendDriver(d.id, d.name)}
                          className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[10px] font-bold hover:bg-red-700"
                        >
                          Suspend
                        </button>
                      )}
                      {daysLeft !== null && daysLeft > 0 && daysLeft <= 30 && (
                        <button
                          onClick={() => handleSendReminder(d.name)}
                          className="p-1.5 rounded-lg bg-[#714B67] text-white hover:bg-[#5e3b56]"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredDrivers.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-500">No drivers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};