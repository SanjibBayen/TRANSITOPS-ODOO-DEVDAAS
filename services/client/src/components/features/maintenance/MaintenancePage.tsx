import React, { useState } from 'react';
import { MaintenanceTable } from './MaintenanceTable';
import { MaintenanceForm } from './MaintenanceForm';
import { MaintenanceLog } from './MaintenanceLog';
import { Plus } from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100">Maintenance</h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Track vehicle maintenance records</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-xl bg-[#714B67] text-white text-xs font-bold flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Add Record
        </button>
      </div>
      <MaintenanceLog />
      <MaintenanceTable refreshKey={refreshKey} />
      {showForm && <MaintenanceForm onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); setRefreshKey(k => k + 1); }} />}
    </div>
  );
};