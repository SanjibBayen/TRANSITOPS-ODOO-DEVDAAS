import React, { useState, useEffect } from 'react';
import { useDrivers, Driver } from '../hooks/useDrivers';
import { 
  Users, CheckCircle2, AlertTriangle, Search, Plus, 
  Trash2, Edit3, X, Award, Phone, Loader2, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export const Drivers: React.FC = () => {
  const { drivers, isLoading, loadDrivers, createDriver, updateDriver, updateDriverStatus, metrics } = useDrivers();

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    license_number: '',
    license_category: 'HMV',
    license_expiry: '',
    status: 'AVAILABLE' as Driver['status'],
  });

  const resetForm = () => {
    setForm({
      name: '',
      phone: '',
      email: '',
      license_number: '',
      license_category: 'HMV',
      license_expiry: '',
      status: 'AVAILABLE',
    });
  };

  const handleOpenAdd = () => {
    setEditingDriver(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: Driver) => {
    setEditingDriver(d);
    setForm({
      name: d.name,
      phone: d.phone,
      email: d.email || '',
      license_number: d.license_number,
      license_category: d.license_category,
      license_expiry: d.license_expiry?.split('T')[0] || '',
      status: d.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const driverData = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        license_number: form.license_number,
        license_category: form.license_category,
        license_expiry: form.license_expiry,
        status: form.status,
      };

      if (editingDriver) {
        await updateDriver(editingDriver.id, driverData);
      } else {
        await createDriver(driverData);
      }

      setIsModalOpen(false);
      loadDrivers();
    } catch (err: any) {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to suspend this driver?')) {
      await updateDriverStatus(id, 'SUSPENDED');
      loadDrivers();
      toast.success('Driver suspended');
    }
  };

  const handleStatusChange = async (id: string, status: Driver['status']) => {
    await updateDriverStatus(id, status);
    loadDrivers();
  };

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = 
      d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.license_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone?.includes(searchQuery);
    
    const matchesStatus = statusFilter ? d.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const statusBadge = (status: string) => {
    const configs: Record<string, { color: string; bg: string; label: string }> = {
      AVAILABLE: { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200', label: 'Available' },
      ON_TRIP: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200', label: 'On Trip' },
      OFF_DUTY: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200', label: 'Off Duty' },
      SUSPENDED: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200', label: 'Suspended' },
    };
    const cfg = configs[status] || configs.AVAILABLE;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full ${cfg.bg} px-2.5 py-0.5 text-[10px] font-bold ${cfg.color} border`}>
        {cfg.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">Drivers Registry</h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Manage driver profiles, licenses, and compliance status.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadDrivers} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-all">
            <RefreshCw className="h-4 w-4 text-gray-400" /> Refresh
          </button>
          <button onClick={handleOpenAdd} className="px-4 py-2 rounded-xl bg-[#714B67] text-xs font-extrabold text-white hover:bg-[#5e3b56] shadow-md flex items-center gap-1.5 transition-all">
            <Plus className="h-4 w-4" /> Add Driver
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Drivers', value: `${metrics.total} Drivers`, icon: Users, color: 'text-[#714B67]', bg: 'bg-purple-50' },
          { label: 'Available', value: `${metrics.available} Ready`, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'On Duty', value: `${metrics.onTrip} Active`, icon: Award, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((card, i) => (
          <div key={i} className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">{card.label}</span>
              <span className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 block mt-1">{card.value}</span>
            </div>
            <div className={`h-11 w-11 rounded-xl ${card.bg} flex items-center justify-center ${card.color} shrink-0`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, license number, or phone..."
            className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 pl-9 pr-4 text-xs focus:border-[#714B67] focus:outline-none focus:ring-1 focus:ring-[#714B67] transition-all font-medium"
          />
        </div>
        <select value={statusFilter || ''} onChange={(e) => setStatusFilter(e.target.value || null)} className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold">
          <option value="">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="OFF_DUTY">Off Duty</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f5f3f3] dark:bg-zinc-800 text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">License No</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Expiry</th>
                <th className="py-3 px-4">Safety Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae8e7] dark:divide-zinc-800">
              {isLoading ? (
                <tr><td colSpan={8} className="py-16 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" /></td></tr>
              ) : filteredDrivers.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center text-xs font-bold text-gray-500">No drivers found.</td></tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs font-medium transition-all group">
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-[#1b1c1c] dark:text-zinc-100 block">{driver.name}</span>
                      {driver.email && <span className="text-[10px] text-gray-500">{driver.email}</span>}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-600 dark:text-zinc-400">{driver.phone}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#714B67]">{driver.license_number}</td>
                    <td className="py-3.5 px-4">{driver.license_category}</td>
                    <td className="py-3.5 px-4">{new Date(driver.license_expiry).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 font-bold">{driver.safety_score?.toFixed(1) || 'N/A'}</td>
                    <td className="py-3.5 px-4">{statusBadge(driver.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEdit(driver)} className="p-1.5 rounded bg-purple-50 text-[#714B67] hover:bg-[#714B67] hover:text-white transition-all" title="Edit"><Edit3 className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDelete(driver.id)} className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all" title="Suspend"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-zinc-950 border-t flex items-center justify-between text-xs text-gray-500 font-semibold">
          <span>Showing {filteredDrivers.length} of {drivers.length} drivers</span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="text-sm font-black">{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Phone *</label>
                  <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">License Number *</label>
                  <input required disabled={!!editingDriver} value={form.license_number} onChange={e => setForm({...form, license_number: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Category</label>
                  <select value={form.license_category} onChange={e => setForm({...form, license_category: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1">
                    <option>HMV</option><option>LMV</option><option>HGMV</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">License Expiry *</label>
                  <input type="date" required value={form.license_expiry} onChange={e => setForm({...form, license_expiry: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value as Driver['status']})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1">
                    <option value="AVAILABLE">Available</option><option value="ON_TRIP">On Trip</option><option value="OFF_DUTY">Off Duty</option><option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border text-xs font-bold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-[#714B67] text-white text-xs font-bold disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingDriver ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};