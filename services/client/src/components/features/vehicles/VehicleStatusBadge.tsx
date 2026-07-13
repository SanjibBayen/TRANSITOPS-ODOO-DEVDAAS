import React from 'react';

interface VehicleStatusBadgeProps {
  status: string;
}

export const VehicleStatusBadge: React.FC<VehicleStatusBadgeProps> = ({ status }) => {
  const config: Record<string, { color: string; label: string }> = {
    AVAILABLE: { color: 'text-green-700 bg-green-50 border-green-200', label: 'Available' },
    ON_TRIP: { color: 'text-blue-700 bg-blue-50 border-blue-200', label: 'On Trip' },
    IN_SHOP: { color: 'text-red-700 bg-red-50 border-red-200', label: 'In Shop' },
    RETIRED: { color: 'text-gray-500 bg-gray-100 border-gray-200', label: 'Retired' },
  };
  const cfg = config[status] || { color: 'text-gray-500 bg-gray-100', label: status };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};