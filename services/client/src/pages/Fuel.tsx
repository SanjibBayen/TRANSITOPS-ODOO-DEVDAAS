import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/index.ts';
import { 
  createFuelLog, 
  createExpense, 
  fetchExpenses,
  fetchFuelLogs,
  FuelLog,
  TollExpense,
  MaintenanceExpense
} from '../store/slices/expenseSlice.ts';
import { addToast } from '../store/slices/uiSlice.ts';
import { toast } from 'sonner';
import { 
  Droplet, 
  DollarSign, 
  ArrowUpRight, 
  Plus, 
  X, 
  CreditCard, 
  Wrench, 
  Coins, 
  Scale, 
  Calendar,
  Layers,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

type TabType = 'fuel' | 'tolls' | 'maintenance' | 'costs';

export const Fuel: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { fuelLogs, tollExpenses, maintenanceExpenses } = useSelector((state: RootState) => state.expenses);

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchFuelLogs());
  }, [dispatch]);

  // States
  const [activeTab, setActiveTab] = useState<TabType>('fuel');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Expense wizard states
  const [expenseType, setExpenseType] = useState<'fuel' | 'toll' | 'maintenance'>('fuel');
  
  // Fuel fields
  const [fuelVehicle, setFuelVehicle] = useState('VAN-05');
  const [fuelType, setFuelType] = useState<'Diesel' | 'Petrol' | 'EV Charge' | 'CNG'>('Diesel');
  const [fuelLiters, setFuelLiters] = useState(20);
  const [fuelCost, setFuelCost] = useState(1900);
  const [fuelVendor, setFuelVendor] = useState('Bharat Petroleum');

  // Toll fields
  const [tollTripId, setTollTripId] = useState('TRIP-104');
  const [tollVehicle, setTollVehicle] = useState('VAN-05');
  const [tollAmount, setTollAmount] = useState(250);
  const [tollBooth, setTollBooth] = useState('Charoti Toll Plaza');
  const [tollNotes, setTollNotes] = useState('NH48 Fastag Auto-deduct');

  // Maintenance fields
  const [maintJobId, setMaintJobId] = useState('JOB-204');
  const [maintVehicle, setMaintVehicle] = useState('VAN-08');
  const [maintVendor, setMaintVendor] = useState('Bosch Car Care');
  const [maintCategory, setMaintCategory] = useState('Scheduled Maintenance');
  const [maintAmount, setMaintAmount] = useState(4800);
  const [maintNotes, setMaintNotes] = useState('Periodic 10k km general checkup');

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split('T')[0];

    try {
      if (expenseType === 'fuel') {
        const payload = {
          vehicle_id: fuelVehicle.toUpperCase(),
          liters: Number(fuelLiters),
          cost: Number(fuelCost),
          station: fuelVendor,
        };
        await dispatch(createFuelLog(payload)).unwrap();
        toast.success(`Successfully logged ₹${fuelCost.toLocaleString()} fuel payment for ${fuelVehicle}.`);
      } else if (expenseType === 'toll') {
        const payload = {
          type: 'TOLL',
          trip_id: tollTripId.toUpperCase(),
          vehicle_id: tollVehicle.toUpperCase(),
          amount: Number(tollAmount),
          description: tollNotes
        };
        await dispatch(createExpense(payload)).unwrap();
        toast.success(`Fastag auto-deduction of ₹${tollAmount.toLocaleString()} recorded.`);
      } else {
        const payload = {
          type: 'MAINTENANCE',
          vehicle_id: maintVehicle.toUpperCase(),
          trip_id: maintJobId.toUpperCase(),
          amount: Number(maintAmount),
          description: maintNotes
        };
        await dispatch(createExpense(payload)).unwrap();
        toast.success(`Recorded workshop bill of ₹${maintAmount.toLocaleString()} under ${maintCategory}.`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit expense');
    }
  };

  // Automated Operational Cost Calculations (TASK 3)
  const totalFuelCost = fuelLogs.reduce((sum, l) => sum + l.cost, 0);
  const totalTollCost = tollExpenses.reduce((sum, t) => sum + t.amount, 0);
  const totalMaintCost = maintenanceExpenses.reduce((sum, m) => sum + m.amount, 0);
  const grandTotalCost = totalFuelCost + totalTollCost + totalMaintCost;

  // Group by Vehicle for Cost Analysis
  const getVehicleCostAnalysis = () => {
    const analysis: Record<string, { fuel: number; toll: number; maint: number; total: number }> = {};
    
    fuelLogs.forEach(l => {
      const id = l.vehicleId || 'VAN-05';
      if (!analysis[id]) analysis[id] = { fuel: 0, toll: 0, maint: 0, total: 0 };
      analysis[id].fuel += l.cost;
      analysis[id].total += l.cost;
    });

    tollExpenses.forEach(t => {
      const id = t.vehicleId || 'VAN-05';
      if (!analysis[id]) analysis[id] = { fuel: 0, toll: 0, maint: 0, total: 0 };
      analysis[id].toll += t.amount;
      analysis[id].total += t.amount;
    });

    maintenanceExpenses.forEach(m => {
      const id = m.vehicleId || 'VAN-05';
      if (!analysis[id]) analysis[id] = { fuel: 0, toll: 0, maint: 0, total: 0 };
      analysis[id].maint += m.amount;
      analysis[id].total += m.amount;
    });

    return Object.entries(analysis).map(([id, data]) => ({
      vehicleId: id,
      ...data
    }));
  };

  const vehicleCostData = getVehicleCostAnalysis();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in font-sans text-gray-800 dark:text-zinc-200">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">
            Enterprise Expenses &amp; Ledger
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Log, track, and aggregate fuel logs, automated Fastag highway tolls, workshop service charges, and total operational costs (TCO).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded bg-[#714B67] text-xs font-bold text-white hover:bg-[#5e3b56] shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4.5 w-4.5" />
          Log Operational Expense
        </button>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 rounded shadow-xs gap-1">
        <button
          onClick={() => setActiveTab('fuel')}
          className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'fuel'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800'
          }`}
        >
          <Droplet className="h-4 w-4" />
          Fuel Receipts ({fuelLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('tolls')}
          className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'tolls'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Highway Tolls ({tollExpenses.length})
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'maintenance'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800'
          }`}
        >
          <Wrench className="h-4 w-4" />
          Maintenance Workshop ({maintenanceExpenses.length})
        </button>
        <button
          onClick={() => setActiveTab('costs')}
          className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'costs'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800'
          }`}
        >
          <Coins className="h-4 w-4" />
          Operational Cost Analysis
        </button>
      </div>

      {/* TABS INTERFACES */}

      {/* 1. Fuel tab */}
      {activeTab === 'fuel' && (
        <div className="space-y-6">
          {/* Fuel stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Volume Filled</span>
                <span className="text-2xl font-black text-gray-900 dark:text-zinc-100 mt-1 block">
                  {fuelLogs.reduce((sum, l) => sum + l.liters, 0)} L / units
                </span>
              </div>
              <div className="h-10 w-10 bg-purple-50 dark:bg-purple-950/20 text-[#714B67] dark:text-purple-300 rounded flex items-center justify-center">
                <Droplet className="h-5.5 w-5.5" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Fuel Spending</span>
                <span className="text-2xl font-black text-[#006a68] dark:text-[#34d399] mt-1 block">
                  ₹{totalFuelCost.toLocaleString()}
                </span>
              </div>
              <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 rounded flex items-center justify-center">
                <DollarSign className="h-5.5 w-5.5" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Average Transaction</span>
                <span className="text-2xl font-black text-gray-900 dark:text-zinc-100 mt-1 block">
                  ₹{fuelLogs.length > 0 ? Math.round(totalFuelCost / fuelLogs.length).toLocaleString() : 0}
                </span>
              </div>
              <div className="h-10 w-10 bg-gray-50 dark:bg-zinc-900/50 text-gray-500 dark:text-zinc-400 rounded flex items-center justify-center">
                <ArrowUpRight className="h-5.5 w-5.5" />
              </div>
            </div>
          </div>

          {/* Fuel Table */}
          <div className="bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50/70 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider text-[9px]">
                    <th className="py-3 px-4">Receipt ID</th>
                    <th className="py-3 px-4">Vehicle ID</th>
                    <th className="py-3 px-4">Vehicle Name</th>
                    <th className="py-3 px-4">Fuel Type</th>
                    <th className="py-3 px-4">Volume</th>
                    <th className="py-3 px-4">Fuel Vendor</th>
                    <th className="py-3 px-4">Transaction Date</th>
                    <th className="py-3 px-4 text-right">Cost Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 font-medium">
                  {fuelLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#714B67] dark:text-purple-300">{log.id}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-zinc-100">{log.vehicleId}</td>
                      <td className="py-3.5 px-4">{log.vehicleName}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.fuelType === 'EV Charge' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300' 
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300'
                        }`}>
                          {log.fuelType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold">{log.liters} L/kWh</td>
                      <td className="py-3.5 px-4 text-gray-500 dark:text-zinc-400">{log.vendor}</td>
                      <td className="py-3.5 px-4 text-gray-500 dark:text-zinc-400 font-mono">{log.date}</td>
                      <td className="py-3.5 px-4 font-black text-[#1b1c1c] dark:text-zinc-100 text-right">₹{log.cost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Toll tab (TASK 2) */}
      {activeTab === 'tolls' && (
        <div className="space-y-6">
          {/* Toll stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Toll Crossings</span>
                <span className="text-2xl font-black text-gray-900 dark:text-zinc-100 mt-1 block">
                  {tollExpenses.length} Crossings
                </span>
              </div>
              <div className="h-10 w-10 bg-purple-50 dark:bg-purple-950/20 text-[#714B67] dark:text-purple-300 rounded flex items-center justify-center">
                <CreditCard className="h-5.5 w-5.5" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Toll Payments</span>
                <span className="text-2xl font-black text-[#006a68] dark:text-[#34d399] mt-1 block">
                  ₹{totalTollCost.toLocaleString()}
                </span>
              </div>
              <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 rounded flex items-center justify-center">
                <DollarSign className="h-5.5 w-5.5" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Average Toll Charge</span>
                <span className="text-2xl font-black text-gray-900 dark:text-zinc-100 mt-1 block">
                  ₹{tollExpenses.length > 0 ? Math.round(totalTollCost / tollExpenses.length) : 0}
                </span>
              </div>
              <div className="h-10 w-10 bg-gray-50 dark:bg-zinc-900/50 text-gray-500 dark:text-zinc-400 rounded flex items-center justify-center">
                <ArrowUpRight className="h-5.5 w-5.5" />
              </div>
            </div>
          </div>

          {/* Toll Table */}
          <div className="bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50/70 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider text-[9px]">
                    <th className="py-3 px-4">Fastag ID</th>
                    <th className="py-3 px-4">Trip Code</th>
                    <th className="py-3 px-4">Vehicle ID</th>
                    <th className="py-3 px-4">Toll Booth / Plaza</th>
                    <th className="py-3 px-4">Transaction Date</th>
                    <th className="py-3 px-4">Remarks</th>
                    <th className="py-3 px-4 text-right">Amount Deducted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 font-medium">
                  {tollExpenses.map((toll) => (
                    <tr key={toll.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#714B67] dark:text-purple-300">{toll.id}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-500 dark:text-zinc-400">{toll.tripId}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-zinc-100">{toll.vehicleId}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-700 dark:text-zinc-300">{toll.tollBooth}</td>
                      <td className="py-3.5 px-4 font-mono text-gray-500 dark:text-zinc-400">{toll.date}</td>
                      <td className="py-3.5 px-4 text-gray-400 font-semibold">{toll.notes}</td>
                      <td className="py-3.5 px-4 font-black text-right text-gray-900 dark:text-zinc-100">₹{toll.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Maintenance tab (TASK 2) */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          {/* Maintenance stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Work Orders Logged</span>
                <span className="text-2xl font-black text-gray-900 dark:text-zinc-100 mt-1 block">
                  {maintenanceExpenses.length} Records
                </span>
              </div>
              <div className="h-10 w-10 bg-purple-50 dark:bg-purple-950/20 text-[#714B67] dark:text-purple-300 rounded flex items-center justify-center">
                <Wrench className="h-5.5 w-5.5" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Service Bills</span>
                <span className="text-2xl font-black text-[#006a68] dark:text-[#34d399] mt-1 block">
                  ₹{totalMaintCost.toLocaleString()}
                </span>
              </div>
              <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 rounded flex items-center justify-center">
                <DollarSign className="h-5.5 w-5.5" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded border border-gray-200 dark:border-zinc-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Average Service Bill</span>
                <span className="text-2xl font-black text-gray-900 dark:text-zinc-100 mt-1 block">
                  ₹{maintenanceExpenses.length > 0 ? Math.round(totalMaintCost / maintenanceExpenses.length).toLocaleString() : 0}
                </span>
              </div>
              <div className="h-10 w-10 bg-gray-50 dark:bg-zinc-900/50 text-gray-500 dark:text-zinc-400 rounded flex items-center justify-center">
                <ArrowUpRight className="h-5.5 w-5.5" />
              </div>
            </div>
          </div>

          {/* Maintenance Table */}
          <div className="bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50/70 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider text-[9px]">
                    <th className="py-3 px-4">Billing Code</th>
                    <th className="py-3 px-4">Work Order</th>
                    <th className="py-3 px-4">Vehicle ID</th>
                    <th className="py-3 px-4">Service Category</th>
                    <th className="py-3 px-4">Service Vendor</th>
                    <th className="py-3 px-4">Log Date</th>
                    <th className="py-3 px-4">Task Notes</th>
                    <th className="py-3 px-4 text-right">Invoice Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 font-medium">
                  {maintenanceExpenses.map((maint) => (
                    <tr key={maint.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#714B67] dark:text-purple-300">{maint.id}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-400">{maint.maintenanceId}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-zinc-100">{maint.vehicleId}</td>
                      <td className="py-3.5 px-4 font-bold">{maint.category}</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-700 dark:text-zinc-300">{maint.vendor}</td>
                      <td className="py-3.5 px-4 font-mono text-gray-500 dark:text-zinc-400">{maint.date}</td>
                      <td className="py-3.5 px-4 text-gray-400">{maint.notes}</td>
                      <td className="py-3.5 px-4 font-black text-right text-gray-900 dark:text-zinc-100">₹{maint.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Costs Analysis tab (TASK 3) */}
      {activeTab === 'costs' && (
        <div className="space-y-6">
          {/* Cost Analysis overview metric */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded border border-gray-200 dark:border-zinc-800 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#714B67] dark:text-purple-300 mb-4">
              Integrated TCO (Total Cost of Ownership) Breakdown
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              
              <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 rounded border border-gray-100 dark:border-zinc-800/60 text-center">
                <span className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wide mb-1">Fuel Component</span>
                <span className="text-xl font-black text-gray-900 dark:text-zinc-100">₹{totalFuelCost.toLocaleString()}</span>
                <span className="block text-[9px] font-extrabold text-gray-400 mt-1">
                  ({Math.round((totalFuelCost / grandTotalCost) * 100) || 0}%)
                </span>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 rounded border border-gray-100 dark:border-zinc-800/60 text-center">
                <span className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wide mb-1">Highway Tolls</span>
                <span className="text-xl font-black text-gray-900 dark:text-zinc-100">₹{totalTollCost.toLocaleString()}</span>
                <span className="block text-[9px] font-extrabold text-gray-400 mt-1">
                  ({Math.round((totalTollCost / grandTotalCost) * 100) || 0}%)
                </span>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 rounded border border-gray-100 dark:border-zinc-800/60 text-center">
                <span className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wide mb-1">Workshop Maintenance</span>
                <span className="text-xl font-black text-gray-900 dark:text-zinc-100">₹{totalMaintCost.toLocaleString()}</span>
                <span className="block text-[9px] font-extrabold text-gray-400 mt-1">
                  ({Math.round((totalMaintCost / grandTotalCost) * 100) || 0}%)
                </span>
              </div>

              <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded border border-purple-100 dark:border-purple-900/30 text-center">
                <span className="block text-[10px] font-bold text-[#714B67] dark:text-purple-300 uppercase tracking-wide mb-1">Grand Operational Total</span>
                <span className="text-2xl font-black text-[#714B67] dark:text-purple-300">₹{grandTotalCost.toLocaleString()}</span>
                <span className="block text-[9px] font-extrabold text-gray-400 mt-1">Combined fleet logistics TCO</span>
              </div>

            </div>
          </div>

          {/* Vehicle Cost Aggregates Table */}
          <div className="bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50/50 dark:bg-zinc-900 flex items-center justify-between">
              <span className="text-xs font-extrabold text-gray-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                <Scale className="h-4 w-4 text-[#714B67]" />
                Fleet Operational Costs Per Vehicle
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Aggregating Fuel + Tolls + Maintenance</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50/70 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider text-[9px]">
                    <th className="py-3 px-4">Vehicle Identity</th>
                    <th className="py-3 px-4">Fuel Logged (₹)</th>
                    <th className="py-3 px-4">Tolls Deducted (₹)</th>
                    <th className="py-3 px-4">Maintenance Billed (₹)</th>
                    <th className="py-3 px-4 text-right">Combined Operational Cost (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 font-medium">
                  {vehicleCostData.map((row) => (
                    <tr key={row.vehicleId} className="hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800">
                      <td className="py-3.5 px-4 font-black text-gray-900 dark:text-zinc-100">{row.vehicleId}</td>
                      <td className="py-3.5 px-4 font-mono">₹{row.fuel.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono">₹{row.toll.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono">₹{row.maint.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-black text-right text-[#006a68] dark:text-[#34d399] font-mono text-sm">
                        ₹{row.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* EXPENSE CREATOR MODAL WIZARD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in font-sans">
          <div className="bg-white dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 shadow-xl max-w-lg w-full overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4.5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50/50 dark:bg-zinc-900">
              <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#714B67]" />
                Log Operations Expense
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg flex items-center justify-center text-gray-400 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Wizard expense category select */}
            <div className="px-5 pt-5 border-b border-gray-100 dark:border-zinc-800 pb-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                1. Select Expense Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setExpenseType('fuel')}
                  className={`py-2 px-3 rounded border text-center transition-all cursor-pointer font-bold text-xs flex items-center justify-center gap-1.5 ${
                    expenseType === 'fuel'
                      ? 'border-[#714B67] bg-purple-50/50 dark:bg-purple-950/20 text-[#714B67] ring-1 ring-[#714B67]'
                      : 'border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50'
                  }`}
                >
                  <Droplet className="h-3.5 w-3.5" />
                  Fuel
                </button>
                <button
                  type="button"
                  onClick={() => setExpenseType('toll')}
                  className={`py-2 px-3 rounded border text-center transition-all cursor-pointer font-bold text-xs flex items-center justify-center gap-1.5 ${
                    expenseType === 'toll'
                      ? 'border-[#714B67] bg-purple-50/50 dark:bg-purple-950/20 text-[#714B67] ring-1 ring-[#714B67]'
                      : 'border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50'
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Highway Toll
                </button>
                <button
                  type="button"
                  onClick={() => setExpenseType('maintenance')}
                  className={`py-2 px-3 rounded border text-center transition-all cursor-pointer font-bold text-xs flex items-center justify-center gap-1.5 ${
                    expenseType === 'maintenance'
                      ? 'border-[#714B67] bg-purple-50/50 dark:bg-purple-950/20 text-[#714B67] ring-1 ring-[#714B67]'
                      : 'border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:bg-zinc-900/50'
                  }`}
                >
                  <Wrench className="h-3.5 w-3.5" />
                  Maintenance
                </button>
              </div>
            </div>

            {/* Dynamic Form Content */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              
              {expenseType === 'fuel' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Vehicle ID</label>
                      <input 
                        type="text" 
                        value={fuelVehicle} 
                        onChange={(e) => setFuelVehicle(e.target.value)} 
                        required 
                        placeholder="e.g. VAN-05"
                        className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Fuel Type</label>
                      <select 
                        value={fuelType} 
                        onChange={(e) => setFuelType(e.target.value as any)} 
                        className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold"
                      >
                        <option value="Diesel">Diesel</option>
                        <option value="Petrol">Petrol</option>
                        <option value="EV Charge">EV Charge</option>
                        <option value="CNG">CNG</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Volume Filled (L/kWh)</label>
                      <input 
                        type="number" 
                        value={fuelLiters} 
                        onChange={(e) => setFuelLiters(Number(e.target.value))} 
                        required 
                        className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Transaction Cost (₹)</label>
                      <input 
                        type="number" 
                        value={fuelCost} 
                        onChange={(e) => setFuelCost(Number(e.target.value))} 
                        required 
                        className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Vendor Station</label>
                    <input 
                      type="text" 
                      value={fuelVendor} 
                      onChange={(e) => setFuelVendor(e.target.value)} 
                      required 
                      className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                    />
                  </div>
                </>
              )}

              {expenseType === 'toll' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Trip Code</label>
                      <input 
                        type="text" 
                        value={tollTripId} 
                        onChange={(e) => setTollTripId(e.target.value)} 
                        required 
                        placeholder="e.g. TRIP-104"
                        className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Vehicle ID</label>
                      <input 
                        type="text" 
                        value={tollVehicle} 
                        onChange={(e) => setTollVehicle(e.target.value)} 
                        required 
                        className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Toll Plaza Booth</label>
                      <input 
                        type="text" 
                        value={tollBooth} 
                        onChange={(e) => setTollBooth(e.target.value)} 
                        required 
                        className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Amount Paid (₹)</label>
                      <input 
                        type="number" 
                        value={tollAmount} 
                        onChange={(e) => setTollAmount(Number(e.target.value))} 
                        required 
                        className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Transaction Remarks</label>
                    <input 
                      type="text" 
                      value={tollNotes} 
                      onChange={(e) => setTollNotes(e.target.value)} 
                      className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                    />
                  </div>
                </>
              )}

              {expenseType === 'maintenance' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Work Order ID</label>
                      <input 
                        type="text" 
                        value={maintJobId} 
                        onChange={(e) => setMaintJobId(e.target.value)} 
                        required 
                        placeholder="e.g. JOB-204"
                        className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Vehicle ID</label>
                      <input 
                        type="text" 
                        value={maintVehicle} 
                        onChange={(e) => setMaintVehicle(e.target.value)} 
                        required 
                        className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Service Category</label>
                      <input 
                        type="text" 
                        value={maintCategory} 
                        onChange={(e) => setMaintCategory(e.target.value)} 
                        required 
                        className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Service Vendor</label>
                      <input 
                        type="text" 
                        value={maintVendor} 
                        onChange={(e) => setMaintVendor(e.target.value)} 
                        required 
                        className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Invoice Amount (₹)</label>
                      <input 
                        type="number" 
                        value={maintAmount} 
                        onChange={(e) => setMaintAmount(Number(e.target.value))} 
                        required 
                        className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Notes / Details</label>
                      <input 
                        type="text" 
                        value={maintNotes} 
                        onChange={(e) => setMaintNotes(e.target.value)} 
                        className="w-full rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-[#714B67] transition-all font-bold" 
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 dark:bg-zinc-900/50/50 dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-2 -mx-5 -mb-5 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-xs font-bold text-gray-600 dark:text-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4.5 py-2 bg-[#714B67] text-white rounded text-xs font-bold cursor-pointer"
                >
                  Log Expense Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
