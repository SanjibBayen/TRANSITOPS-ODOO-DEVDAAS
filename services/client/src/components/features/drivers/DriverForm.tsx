import React, { useState } from 'react';
import { toast } from 'sonner';
import api from '../../../lib/axios';

interface DriverFormProps {
  driver?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const DriverForm: React.FC<DriverFormProps> = ({ driver, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    name: driver?.name || '',
    phone: driver?.phone || '',
    email: driver?.email || '',
    license_number: driver?.license_number || '',
    license_category: driver?.license_category || 'HMV',
    license_expiry: driver?.license_expiry?.split('T')[0] || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (driver) {
        await api.put(`/drivers/${driver.id}`, form);
      } else {
        await api.post('/drivers', form);
      }
      toast.success(driver ? 'Driver updated' : 'Driver created');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500">Name *</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500">Phone *</label>
          <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase text-gray-500">Email</label>
        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500">License Number *</label>
          <input required value={form.license_number} onChange={e => setForm({...form, license_number: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500">Category</label>
          <select value={form.license_category} onChange={e => setForm({...form, license_category: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1">
            <option>HMV</option><option>LMV</option><option>HGMV</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase text-gray-500">License Expiry *</label>
        <input type="date" required value={form.license_expiry} onChange={e => setForm({...form, license_expiry: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border text-xs font-bold">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[#714B67] text-white text-xs font-bold">{loading ? 'Saving...' : driver ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
};