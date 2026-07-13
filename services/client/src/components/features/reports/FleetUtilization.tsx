import React from 'react';
import { Gauge } from 'lucide-react';

export const FleetUtilization: React.FC = () => {
  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4">
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Gauge className="h-4 w-4 text-[#714B67]" /> Fleet Utilization</h3>
      <div className="grid grid-cols-4 gap-4 text-center">
        {[
          { label: 'Total', value: '12', color: 'text-gray-700' },
          { label: 'Active', value: '8', color: 'text-blue-600' },
          { label: 'Available', value: '3', color: 'text-green-600' },
          { label: 'In Shop', value: '1', color: 'text-red-600' },
        ].map(item => (
          <div key={item.label} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
            <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
            <p className="text-[10px] text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};