import React from 'react';

interface RoleBadgeProps {
  role: string;
  size?: 'sm' | 'md';
}

const roleConfig: Record<string, { color: string; bg: string; label: string }> = {
  FLEET_MANAGER: { color: 'text-indigo-700 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30', label: 'Fleet Manager' },
  DRIVER: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', label: 'Driver' },
  SAFETY_OFFICER: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30', label: 'Safety Officer' },
  FINANCIAL_ANALYST: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', label: 'Financial Analyst' },
};

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'sm' }) => {
  const config = roleConfig[role] || { color: 'text-gray-500', bg: 'bg-gray-100', label: role };
  
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span className={`inline-flex items-center rounded-full ${config.bg} ${sizeClasses[size]} font-bold ${config.color} border border-current/20`}>
      {config.label}
    </span>
  );
};