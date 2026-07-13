import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { User } from 'lucide-react';

export const DriverPool: React.FC = () => {
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    api.get('/drivers/available').then(res => setDrivers(res.data.data || [])).catch(() => {});
  }, []);

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4">
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><User className="h-4 w-4 text-[#714B67]" /> Available Drivers ({drivers.length})</h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {drivers.map(d => (
          <div key={d.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-zinc-800 text-xs">
            <span className="font-bold">{d.name}</span>
            <span className="text-gray-500">★ {d.safety_score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};