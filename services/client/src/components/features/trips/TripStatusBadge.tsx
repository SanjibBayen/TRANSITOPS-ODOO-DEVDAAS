import React from 'react';

export const TripStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, string> = {
    DRAFT: 'bg-gray-50 text-gray-600 border-gray-200',
    DISPATCHED: 'bg-blue-50 text-blue-700 border-blue-200',
    IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200',
    COMPLETED: 'bg-green-50 text-green-700 border-green-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${config[status] || 'bg-gray-50'}`}>{status}</span>;
};