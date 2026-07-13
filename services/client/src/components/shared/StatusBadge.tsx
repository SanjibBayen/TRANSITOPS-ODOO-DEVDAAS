import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  AVAILABLE: { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', label: 'Available' },
  ON_TRIP: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', label: 'On Trip' },
  IN_SHOP: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', label: 'In Shop' },
  RETIRED: { color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700', label: 'Retired' },
  DRAFT: { color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-zinc-800 border-gray-200', label: 'Draft' },
  DISPATCHED: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200', label: 'Dispatched' },
  IN_PROGRESS: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200', label: 'In Progress' },
  COMPLETED: { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200', label: 'Completed' },
  CANCELLED: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200', label: 'Cancelled' },
  OFF_DUTY: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200', label: 'Off Duty' },
  SUSPENDED: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200', label: 'Suspended' },
  ACTIVE: { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200', label: 'Active' },
  VERIFIED: { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200', label: 'Verified' },
  PENDING_VERIFICATION: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200', label: 'Pending' },
  EXPIRED: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200', label: 'Expired' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = statusConfig[status] || { color: 'text-gray-500', bg: 'bg-gray-100', label: status };
  
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${config.bg} ${sizeClasses[size]} font-bold ${config.color} border`}>
      {config.label}
    </span>
  );
};