import React from 'react';

export const DriverStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, string> = {
    AVAILABLE: 'bg-green-50 text-green-700 border-green-200',
    ON_TRIP: 'bg-blue-50 text-blue-700 border-blue-200',
    OFF_DUTY: 'bg-amber-50 text-amber-700 border-amber-200',
    SUSPENDED: 'bg-red-50 text-red-700 border-red-200',
  };
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border ${config[status] || 'bg-gray-50 text-gray-500'}`}>{status}</span>;
};