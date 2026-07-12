import React, { useState } from 'react';
import { Wrench, CheckCircle2, ShieldAlert, DollarSign, Calendar, SlidersHorizontal, Settings2, Plus, Info } from 'lucide-react';

interface MaintenanceLog {
  id: string;
  vehicle: string;
  type: string;
  cost: number;
  date: string;
  workshop: string;
  partsReplaced: string;
  status: 'Upcoming' | 'Completed' | 'Overdue';
}

export const Maintenance: React.FC = () => {
  const [logs, setLogs] = useState<MaintenanceLog[]>([
    { id: 'MNT001', vehicle: 'VAN-08 Transit Prime (MH12BC3322)', type: 'Engine head gasket replacement', cost: 18500, date: '2026-07-01', workshop: 'Prime Auto Zone Depot', partsReplaced: 'Head Gasket Kit, Coolant Valve', status: 'Upcoming' },
    { id: 'MNT002', vehicle: 'VAN-05 Transit Prime (GJ01AB4521)', type: 'Regular Odometer Check & Filter clean', cost: 4500, date: '2026-06-20', workshop: 'Depot 1 Workshop', partsReplaced: 'Air Filter, Cabin Filter, Engine Oil', status: 'Completed' },
    { id: 'MNT003', vehicle: 'REF-04 ChillZone 200 (KA03MN4545)', type: 'Refrigerant topping & cooling coil system recalibrated', cost: 12000, date: '2026-06-25', workshop: 'ThermoKing Specialist Hub', partsReplaced: 'R134a Gas, Oil Seal Ring', status: 'Completed' },
    { id: 'MNT004', vehicle: 'TRK-12 MegaLoader Pro (GJ01XY9876)', type: 'Brake booster fluid flush', cost: 8500, date: '2026-07-15', workshop: 'GigaPower Heavy Workshop', partsReplaced: 'Brake Linings, Fluid DOT4', status: 'Upcoming' }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [vehicle, setVehicle] = useState('VAN-08');
  const [type, setType] = useState('Brake linings replacement');
  const [cost, setCost] = useState(6000);
  const [workshop, setWorkshop] = useState('Depot 1 Workshop');
  const [parts, setParts] = useState('Heavy Brake Pads');
  const [status, setStatus] = useState<'Upcoming' | 'Completed'>('Upcoming');

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: MaintenanceLog = {
      id: 'MNT00' + (logs.length + 1),
      vehicle,
      type,
      cost: Number(cost),
      date: new Date().toISOString().split('T')[0],
      workshop,
      partsReplaced: parts,
      status
    };
    setLogs([newLog, ...logs]);
    setIsFormOpen(false);
  };

  const totalCost = logs.reduce((sum, log) => sum + log.cost, 0);
  const pendingCount = logs.filter(log => log.status === 'Upcoming').length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">
            Maintenance &amp; Workshop Log
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Track workshop cost analysis, parts replaced, scheduled oil syncs, and compliance standards.
          </p>
        </div>

        <button 
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#714B67] text-xs font-extrabold text-white hover:bg-[#5e3b56] shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Schedule Maintenance
        </button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4.5 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Total Cost Analyzed</span>
            <span className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 mt-1 block">₹{totalCost.toLocaleString()}</span>
          </div>
          <div className="h-10 w-10 bg-purple-50 text-[#714B67] rounded-xl flex items-center justify-center">
            <DollarSign className="h-5.5 w-5.5" />
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4.5 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Pending Inspections</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">{pendingCount} Vehicles</span>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <ShieldAlert className="h-5.5 w-5.5" />
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4.5 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Workshop Health Index</span>
            <span className="text-2xl font-black text-[#829c62] mt-1 block">98.4% Compliant</span>
          </div>
          <div className="h-10 w-10 bg-[#e6fcf5] text-[#006a68] rounded-xl flex items-center justify-center">
            <CheckCircle2 className="h-5.5 w-5.5" />
          </div>
        </div>
      </div>

      {/* Maintenance list table */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center text-xs font-semibold text-gray-500 dark:text-zinc-400">
          <span>Service Schedule Logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f5f3f3] dark:bg-zinc-800 text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase border-b border-gray-200 dark:border-zinc-800">
                <th className="py-3 px-4">Service ID</th>
                <th className="py-3 px-4">Vehicle Identity</th>
                <th className="py-3 px-4">Service Job Type</th>
                <th className="py-3 px-4">Workshop Hub</th>
                <th className="py-3 px-4">Replaced Parts</th>
                <th className="py-3 px-4">Repair Cost</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae8e7] dark:divide-zinc-800 text-xs font-medium text-[#4d4847] dark:text-zinc-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
                  <td className="py-4 px-4 font-mono font-bold text-[#714B67]">{log.id}</td>
                  <td className="py-4 px-4 text-[#1b1c1c] dark:text-zinc-100 font-extrabold">{log.vehicle}</td>
                  <td className="py-4 px-4 text-gray-700 dark:text-zinc-300 font-bold">{log.type}</td>
                  <td className="py-4 px-4 text-gray-500 dark:text-zinc-400 font-semibold">{log.workshop}</td>
                  <td className="py-4 px-4 font-semibold text-gray-600 dark:text-zinc-400 italic">{log.partsReplaced}</td>
                  <td className="py-4 px-4 font-bold text-[#1b1c1c] dark:text-zinc-100">₹{log.cost.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    {log.status === 'Completed' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f7f4] px-2.5 py-0.5 text-[10px] font-bold text-[#34451e] border border-[#d3dfd3]">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                        Upcoming (Pending)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule maintenance modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-scale-up">
            <div className="flex items-center justify-between p-4.5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
              <h3 className="text-sm font-black text-[#1b1c1c] dark:text-zinc-100">Schedule Fleet Maintenance</h3>
              <button onClick={() => setIsFormOpen(false)} className="h-8 w-8 hover:bg-[#eae8e7] dark:hover:bg-zinc-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-zinc-400">✕</button>
            </div>

            <form onSubmit={handleAddLog} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Vehicle Identity</label>
                <input type="text" value={vehicle} onChange={(e) => setVehicle(e.target.value)} required className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-3.5 py-2 text-xs font-bold" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Service Job Type</label>
                <input type="text" value={type} onChange={(e) => setType(e.target.value)} required className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-3.5 py-2 text-xs font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Repair Cost (₹)</label>
                  <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} required className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-3.5 py-2 text-xs font-bold" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Workshop Hub</label>
                  <input type="text" value={workshop} onChange={(e) => setWorkshop(e.target.value)} required className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-3.5 py-2 text-xs font-bold" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Replaced Parts</label>
                <input type="text" value={parts} onChange={(e) => setParts(e.target.value)} required className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-3.5 py-2 text-xs font-bold" placeholder="e.g. Filter, Oil" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 px-3.5 py-2 text-xs font-extrabold">
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-end gap-2 -mx-5 -mb-5 pt-4">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-xs font-bold">Cancel</button>
                <button type="submit" className="px-4.5 py-2 bg-[#714B67] text-white rounded-lg text-xs font-extrabold">Dispatch Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
