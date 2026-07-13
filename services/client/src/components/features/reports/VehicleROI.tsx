import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const VehicleROI: React.FC = () => {
  const [roiData, setRoiData] = useState<any[]>([]);

  useEffect(() => {
    api.get('/analytics/vehicle-roi').then(r => setRoiData(r.data.data || [])).catch(() => {});
  }, []);

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4">
      <h3 className="text-sm font-bold mb-3">Vehicle ROI Ranking</h3>
      <div className="space-y-2 max-h-[250px] overflow-y-auto">
        {roiData.slice(0, 5).map((v: any, i: number) => (
          <div key={v.id || i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg text-xs">
            <div>
              <span className="font-bold">{v.registration_number}</span>
              <span className="text-gray-500 ml-2">{v.model}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${v.roi_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {v.roi_percentage}%
              </span>
              {v.roi_percentage >= 0 ? <TrendingUp className="h-3 w-3 text-green-600" /> : <TrendingDown className="h-3 w-3 text-red-600" />}
            </div>
          </div>
        ))}
        {roiData.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No ROI data available</p>}
      </div>
    </div>
  );
};