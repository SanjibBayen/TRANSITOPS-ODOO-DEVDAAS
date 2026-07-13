import React, { useState } from 'react';
import { toast } from 'sonner';
import api from '../../../lib/axios';
import { Modal } from '../../shared/Modal';

interface ExpenseFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ vehicle_id: '', type: 'TOLL', amount: 0, description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/expenses', { ...form, amount: Number(form.amount) });
      toast.success('Expense created');
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <Modal isOpen onClose={onClose} title="Add Expense" size="sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required value={form.vehicle_id} onChange={e => setForm({...form, vehicle_id: e.target.value})} placeholder="Vehicle ID" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs">
          <option value="TOLL">Toll</option><option value="FUEL">Fuel</option><option value="MAINTENANCE">Maintenance</option><option value="PERMIT">Permit</option><option value="INSURANCE">Insurance</option><option value="OTHER">Other</option>
        </select>
        <input type="number" required value={form.amount || ''} onChange={e => setForm({...form, amount: Number(e.target.value)})} placeholder="Amount (₹)" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
        <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-xs font-bold">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[#714B67] text-white text-xs font-bold">{loading ? 'Saving...' : 'Add'}</button>
        </div>
      </form>
    </Modal>
  );
};