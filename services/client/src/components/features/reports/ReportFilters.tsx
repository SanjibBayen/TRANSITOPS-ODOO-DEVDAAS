import React from 'react';

interface ReportFiltersProps {
  filters: { period: string; type: string };
  onChange: (filters: { period: string; type: string }) => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, onChange }) => (
  <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
    <select value={filters.period} onChange={e => onChange({...filters, period: e.target.value})} className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs font-bold">
      <option value="today">Today</option>
      <option value="this-week">This Week</option>
      <option value="this-month">This Month</option>
      <option value="this-quarter">This Quarter</option>
      <option value="all-time">All Time</option>
    </select>
    <select value={filters.type} onChange={e => onChange({...filters, type: e.target.value})} className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs font-bold">
      <option value="all">All Types</option>
      <option value="vehicles">Vehicles</option>
      <option value="trips">Trips</option>
      <option value="expenses">Expenses</option>
    </select>
  </div>
);