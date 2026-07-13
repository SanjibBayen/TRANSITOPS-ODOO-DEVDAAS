import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../../lib/axios';
import { Modal } from '../../shared/Modal';

interface TripFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const TripForm: React.FC<TripFormProps> = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ source: '', destination: '', cargo_weight: 0, planned_distance: 0, cargo_type: '', vehicle_id: '', driver_id: '' });
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/vehicles/available').then(r => setVehicles(r.data.data || []));
    api.get('/drivers/available').then(r => setDrivers(r.data.data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/trips', { ...form, cargo_weight: Number(form.cargo_weight), planned_distance: Number(form.planned_distance) });
      toast.success('Trip created');
      onSuccess();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <Modal isOpen onClose={onClose} title="Create Trip" size="md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input required value={form.source} onChange={e => setForm({...form, source: e.target.value})} placeholder="Source *" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
          <input required value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} placeholder="Destination *" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" required value={form.cargo_weight || ''} onChange={e => setForm({...form, cargo_weight: Number(e.target.value)})} placeholder="Cargo Weight (kg) *" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
          <input type="number" required value={form.planned_distance || ''} onChange={e => setForm({...form, planned_distance: Number(e.target.value)})} placeholder="Distance (km) *" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
        </div>
        <input value={form.cargo_type} onChange={e => setForm({...form, cargo_type: e.target.value})} placeholder="Cargo Type" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
        <select required value={form.vehicle_id} onChange={e => setForm({...form, vehicle_id: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs font-bold">
          <option value="">Select Vehicle *</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} ({v.max_load_capacity}kg)</option>)}
        </select>
        <select required value={form.driver_id} onChange={e => setForm({...form, driver_id: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs font-bold">
          <option value="">Select Driver *</option>
          {drivers.map(d => <option key={d.id} value={d.id}>{d.name} (★{d.safety_score})</option>)}
        </select>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-xs font-bold">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[#714B67] text-white text-xs font-bold">{loading ? 'Creating...' : 'Create Trip'}</button>
        </div>
      </form>
    </Modal>
  );
};