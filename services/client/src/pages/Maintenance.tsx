import React, { useEffect, useState, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';
import { Wrench, CheckCircle2, ShieldAlert, DollarSign, Plus, Loader2, RefreshCw, X } from 'lucide-react';

interface MaintenanceRecord {
  id: string;
  vehicle_id: string;
  type: string;
  description?: string;
  service_center?: string;
  cost: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  started_at: string;
  completed_at?: string;
  vehicle?: { registration_number: string; model: string };
}

export const Maintenance: React.FC = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [activeRecords, setActiveRecords] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    vehicle_id: '',
    type: '',
    description: '',
    service_center: '',
    cost: 0,
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [allRes, activeRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/maintenance/active'),
      ]);
      setRecords(allRes.data.data || []);
      setActiveRecords(activeRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load maintenance data');
      toast.error('Failed to load maintenance data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicle_id || !form.type) {
      toast.error('Vehicle ID and Type are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/maintenance', {
        ...form,
        cost: Number(form.cost),
      });
      toast.success('Maintenance record created');
      setIsFormOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create maintenance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await api.patch(`/maintenance/${id}/complete`);
      toast.success('Maintenance completed');
      loadData();
    } catch (err: any) {
      toast.error('Failed to complete maintenance');
    }
  };

  const resetForm = () => {
    setForm({ vehicle_id: '', type: '', description: '', service_center: '', cost: 0 });
  };

  const totalCost = records.reduce((sum, r) => sum + (Number(r.cost) || 0), 0);
  const activeCount = activeRecords.length;
  const completedCount = records.filter(r => r.status === 'COMPLETED').length;

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
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">Maintenance</h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Track vehicle maintenance, service history, and workshop costs.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadData} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button onClick={() => setIsFormOpen(true)} className="px-4 py-2 rounded-xl bg-[#714B67] text-xs font-extrabold text-white hover:bg-[#5e3b56] shadow-md flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Schedule Maintenance
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Total Cost</span>
            <span className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 mt-1 block">₹{totalCost.toLocaleString()}</span>
          </div>
          <div className="h-10 w-10 bg-purple-50 text-[#714B67] rounded-xl flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Active Maintenance</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">{activeCount} Vehicles</span>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Completed</span>
            <span className="text-2xl font-black text-green-600 mt-1 block">{completedCount} Services</span>
          </div>
          <div className="h-10 w-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Active Maintenance Alerts */}
      {activeRecords.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
            <Wrench className="h-4 w-4" /> Active Maintenance
          </h3>
          <div className="mt-2 space-y-2">
            {activeRecords.map(r => (
              <div key={r.id} className="flex items-center justify-between p-2 bg-white dark:bg-zinc-800 rounded-lg text-xs">
                <div>
                  <span className="font-bold">{r.vehicle?.registration_number || r.vehicle_id}</span>
                  <span className="text-gray-500 ml-2">{r.type}</span>
                </div>
                <button onClick={() => handleComplete(r.id)} className="text-green-600 hover:underline font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Complete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance Table */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f5f3f3] dark:bg-zinc-800 text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Service Center</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4">Started</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae8e7] dark:divide-zinc-800 text-xs font-medium">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                  <td className="py-3 px-4 font-bold">{r.vehicle?.registration_number || r.vehicle_id}</td>
                  <td className="py-3 px-4">{r.type}</td>
                  <td className="py-3 px-4 text-gray-500">{r.service_center || '-'}</td>
                  <td className="py-3 px-4 font-bold">₹{Number(r.cost).toLocaleString()}</td>
                  <td className="py-3 px-4">{r.started_at ? new Date(r.started_at).toLocaleDateString('en-IN') : '-'}</td>
                  <td className="py-3 px-4">
                    {r.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">Active</span>
                    ) : r.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-bold text-green-700 border border-green-200">Completed</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-500">{r.status}</span>
                    )}
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500">No maintenance records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="text-sm font-black">Schedule Maintenance</h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">Vehicle ID *</label>
                <input required value={form.vehicle_id} onChange={e => setForm({...form, vehicle_id: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">Service Type *</label>
                <input required value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" placeholder="Oil Change, Brake Service..." />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500">Description</label>
                <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500">Cost (₹)</label>
                  <input type="number" value={form.cost || ''} onChange={e => setForm({...form, cost: Number(e.target.value)})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500">Service Center</label>
                  <input value={form.service_center} onChange={e => setForm({...form, service_center: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-lg border text-xs font-bold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-[#714B67] text-white text-xs font-bold disabled:opacity-50">
                  {isSubmitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};