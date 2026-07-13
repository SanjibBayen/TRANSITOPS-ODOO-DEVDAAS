import React, { useState } from 'react';
import { toast } from 'sonner';
import api from '../../../lib/axios';
import { Modal } from '../../shared/Modal';

interface MaintenanceFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ vehicle_id: '', type: 'Oil Change', description: '', cost: 0, service_center: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/maintenance', { ...form, cost: Number(form.cost) });
      toast.success('Maintenance record created');
      onSuccess();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <Modal isOpen onClose={onClose} title="Add Maintenance" size="sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required value={form.vehicle_id} onChange={e => setForm({...form, vehicle_id: e.target.value})} placeholder="Vehicle ID" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs">
          <option>Oil Change</option><option>Brake Service</option><option>Engine Repair</option><option>Tire Change</option><option>Regular Service</option><option>Other</option>
        </select>
        <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
        <input type="number" value={form.cost || ''} onChange={e => setForm({...form, cost: Number(e.target.value)})} placeholder="Cost (₹)" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
        <input value={form.service_center} onChange={e => setForm({...form, service_center: e.target.value})} placeholder="Service Center" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-xs font-bold">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[#714B67] text-white text-xs font-bold">{loading ? 'Saving...' : 'Add'}</button>
        </div>
      </form>
    </Modal>
  );
};