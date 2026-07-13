import React, { useState } from 'react';
import { toast } from 'sonner';
import api from '../../../lib/axios';
import { Modal } from '../../shared/Modal';

interface FuelLogFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const FuelLogForm: React.FC<FuelLogFormProps> = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ vehicle_id: '', liters: 0, cost: 0, station: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/fuel', { ...form, liters: Number(form.liters), cost: Number(form.cost) });
      toast.success('Fuel log created');
      onSuccess();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <Modal isOpen onClose={onClose} title="Log Fuel" size="sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required value={form.vehicle_id} onChange={e => setForm({...form, vehicle_id: e.target.value})} placeholder="Vehicle ID" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
        <input type="number" required value={form.liters || ''} onChange={e => setForm({...form, liters: Number(e.target.value)})} placeholder="Liters" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
        <input type="number" required value={form.cost || ''} onChange={e => setForm({...form, cost: Number(e.target.value)})} placeholder="Cost (₹)" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
        <input value={form.station} onChange={e => setForm({...form, station: e.target.value})} placeholder="Fuel Station" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-xs font-bold">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[#714B67] text-white text-xs font-bold">{loading ? 'Saving...' : 'Add'}</button>
        </div>
      </form>
    </Modal>
  );
};