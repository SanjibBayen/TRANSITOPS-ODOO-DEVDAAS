import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { Wrench, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const MaintenanceLog: React.FC = () => {
  const [active, setActive] = useState<any[]>([]);

  useEffect(() => {
    api.get('/maintenance/active').then(r => setActive(r.data.data || [])).catch(() => {});
  }, []);

  const handleComplete = async (id: string) => {
    try {
      await api.patch(`/maintenance/${id}/complete`);
      toast.success('Maintenance completed');
      setActive(prev => prev.filter(m => m.id !== id));
    } catch { toast.error('Failed'); }
  };

  if (!active.length) return null;

  return (
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4">
      <h3 className="text-sm font-bold flex items-center gap-2 text-amber-800 dark:text-amber-400"><Wrench className="h-4 w-4" /> Active Maintenance ({active.length})</h3>
      <div className="space-y-2 mt-2">
        {active.map(m => (
          <div key={m.id} className="flex items-center justify-between p-2 bg-white dark:bg-zinc-800 rounded-lg text-xs">
            <div>
              <p className="font-bold">{m.type}</p>
              <p className="text-gray-500">{m.description}</p>
            </div>
            <button onClick={() => handleComplete(m.id)} className="flex items-center gap-1 text-green-600 hover:underline font-bold">
              <CheckCircle2 className="h-3 w-3" /> Complete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};