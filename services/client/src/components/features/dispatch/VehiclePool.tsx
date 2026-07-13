import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { Truck } from 'lucide-react';

export const VehiclePool: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    api.get('/vehicles/available').then(res => setVehicles(res.data.data || [])).catch(() => {});
  }, []);

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4">
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Truck className="h-4 w-4 text-[#714B67]" /> Available Vehicles ({vehicles.length})</h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {vehicles.map(v => (
          <div key={v.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-zinc-800 text-xs">
            <span className="font-bold">{v.registration_number}</span>
            <span className="text-gray-500">{v.max_load_capacity}kg</span>
          </div>
        ))}
      </div>
    </div>
  );
};