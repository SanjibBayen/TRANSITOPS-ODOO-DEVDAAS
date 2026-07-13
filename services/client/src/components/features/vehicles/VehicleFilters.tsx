import React from 'react';

interface VehicleFiltersProps {
  status: string;
  type: string;
  onStatusChange: (v: string) => void;
  onTypeChange: (v: string) => void;
}

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({ status, type, onStatusChange, onTypeChange }) => (
  <div className="flex items-center gap-2">
    <select value={status} onChange={e => onStatusChange(e.target.value)} className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold">
      <option value="">All Status</option>
      <option value="AVAILABLE">Available</option>
      <option value="ON_TRIP">On Trip</option>
      <option value="IN_SHOP">In Shop</option>
      <option value="RETIRED">Retired</option>
    </select>
    <select value={type} onChange={e => onTypeChange(e.target.value)} className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold">
      <option value="">All Types</option>
      <option value="Truck">Truck</option>
      <option value="Van">Van</option>
      <option value="Mini Truck">Mini Truck</option>
      <option value="Heavy Truck">Heavy Truck</option>
    </select>
  </div>
);