import React from 'react';
import { X } from 'lucide-react';

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface FilterBarProps {
  filters: FilterOption[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, values, onChange, onClear }) => {
  const hasActiveFilters = Object.values(values).some(v => v);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <select
          key={filter.key}
          value={values[filter.key] || ''}
          onChange={(e) => onChange(filter.key, e.target.value)}
          className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold focus:border-[#714B67] focus:outline-none"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}
      {hasActiveFilters && (
        <button onClick={onClear} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-bold">
          <X className="h-3 w-3" /> Clear
        </button>
      )}
    </div>
  );
};