import React from 'react';

export const MaintenanceCalendar: React.FC = () => (
  <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4">
    <h3 className="text-sm font-bold mb-3">Maintenance Schedule</h3>
    <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
      {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d} className="font-bold text-gray-500 py-1">{d}</div>)}
      {Array.from({length: 31}, (_, i) => (
        <div key={i} className={`py-1.5 rounded ${i === 14 ? 'bg-[#714B67] text-white font-bold' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'}`}>{i+1}</div>
      ))}
    </div>
  </div>
);