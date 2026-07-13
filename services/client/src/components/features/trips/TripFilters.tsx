import React from 'react';

interface TripFiltersProps {
  value: string;
  onChange: (value: string) => void;
}

export const TripFilters: React.FC<TripFiltersProps> = ({ value, onChange }) => (
  <select value={value} onChange={e => onChange(e.target.value)} className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold">
    <option value="">All Status</option>
    <option value="DRAFT">Draft</option>
    <option value="DISPATCHED">Dispatched</option>
    <option value="IN_PROGRESS">In Progress</option>
    <option value="COMPLETED">Completed</option>
    <option value="CANCELLED">Cancelled</option>
  </select>
);