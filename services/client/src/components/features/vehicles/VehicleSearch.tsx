import React from 'react';
import { Search } from 'lucide-react';

interface VehicleSearchProps {
  value: string;
  onChange: (v: string) => void;
}

export const VehicleSearch: React.FC<VehicleSearchProps> = ({ value, onChange }) => (
  <div className="relative flex-1 max-w-xs">
    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Search vehicles..." className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 pl-9 pr-4 text-xs" />
  </div>
);