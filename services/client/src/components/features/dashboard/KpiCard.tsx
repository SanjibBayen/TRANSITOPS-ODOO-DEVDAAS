import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  color?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, trend, color = '#714B67' }) => (
  <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
    <div>
      <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">{title}</span>
      <span className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 block mt-1">{value}</span>
      {trend && <span className="text-[10px] text-gray-500 mt-1 block">{trend}</span>}
    </div>
    {icon && <div className="h-11 w-11 rounded-xl bg-purple-50 flex items-center justify-center" style={{ color }}>{icon}</div>}
  </div>
);