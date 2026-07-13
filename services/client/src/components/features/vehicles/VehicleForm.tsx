import React, { useState } from 'react';
import { toast } from 'sonner';
import api from '../../../lib/axios';
import { Modal } from '../../shared/Modal';

interface VehicleFormProps {
  vehicle?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    registration_number: vehicle?.registration_number || '',
    model: vehicle?.model || '',
    type: vehicle?.type || 'Truck',
    max_load_capacity: vehicle?.max_load_capacity || 2500,
    acquisition_cost: vehicle?.acquisition_cost || 0,
    brand: vehicle?.brand || '',
    year: vehicle?.year || new Date().getFullYear(),
    region: vehicle?.region || '',
    fuel_type: vehicle?.fuel_type || 'Diesel',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (vehicle) {
        await api.put(`/vehicles/${vehicle.id}`, { ...form, max_load_capacity: Number(form.max_load_capacity), acquisition_cost: Number(form.acquisition_cost), year: Number(form.year) });
      } else {
        await api.post('/vehicles', { ...form, max_load_capacity: Number(form.max_load_capacity), acquisition_cost: Number(form.acquisition_cost), year: Number(form.year) });
      }
      toast.success(vehicle ? 'Vehicle updated' : 'Vehicle created');
      onSuccess();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <Modal isOpen onClose={onClose} title={vehicle ? 'Edit Vehicle' : 'Add Vehicle'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500">Reg Number *</label>
            <input required disabled={!!vehicle} value={form.registration_number} onChange={e => setForm({...form, registration_number: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500">Model *</label>
            <input required value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500">Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1">
              <option>Truck</option><option>Van</option><option>Mini Truck</option><option>Heavy Truck</option><option>Mini Pickup</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500">Brand</label>
            <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" placeholder="Tata, Ashok Leyland..." />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500">Capacity (kg)</label>
            <input type="number" required value={form.max_load_capacity} onChange={e => setForm({...form, max_load_capacity: Number(e.target.value)})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500">Cost (₹)</label>
            <input type="number" value={form.acquisition_cost} onChange={e => setForm({...form, acquisition_cost: Number(e.target.value)})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500">Fuel</label>
            <select value={form.fuel_type} onChange={e => setForm({...form, fuel_type: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1">
              <option>Diesel</option><option>Petrol</option><option>CNG</option><option>Electric</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-xs font-bold">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[#714B67] text-white text-xs font-bold">{loading ? 'Saving...' : vehicle ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </Modal>
  );
};