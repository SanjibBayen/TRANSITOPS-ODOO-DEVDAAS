import React, { useState, useEffect, useCallback } from 'react';
import { useVehicles, Vehicle } from '../hooks/useVehicles';
import { 
  Bus, CheckCircle2, Wrench, ShieldAlert, Search, SlidersHorizontal, 
  Download, Upload, Plus, X, Trash2, Edit3, FileText, Loader2, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export const Vehicles: React.FC = () => {
  const { 
    vehicles, isLoading, metrics, 
    loadVehicles, createVehicle, updateVehicle, updateVehicleStatus 
  } = useVehicles();

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    registration_number: '',
    model: '',
    type: 'Truck',
    max_load_capacity: 2500,
    current_odometer: 0,
    acquisition_cost: 0,
    status: 'AVAILABLE' as Vehicle['status'],
    brand: '',
    year: new Date().getFullYear(),
    region: '',
    fuel_type: 'Diesel',
  });

  const resetForm = () => {
    setForm({
      registration_number: '',
      model: '',
      type: 'Truck',
      max_load_capacity: 2500,
      current_odometer: 0,
      acquisition_cost: 0,
      status: 'AVAILABLE',
      brand: '',
      year: new Date().getFullYear(),
      region: '',
      fuel_type: 'Diesel',
    });
  };

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    resetForm();
    setForm(prev => ({
      ...prev,
      registration_number: `MH-${String(Math.floor(Math.random() * 90) + 10)}-TEST-${String(Math.floor(1000 + Math.random() * 9000))}`,
    }));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setForm({
      registration_number: v.registration_number,
      model: v.model,
      type: v.type,
      max_load_capacity: v.max_load_capacity,
      current_odometer: v.current_odometer,
      acquisition_cost: v.acquisition_cost,
      status: v.status,
      brand: v.brand || '',
      year: v.year || new Date().getFullYear(),
      region: v.region || '',
      fuel_type: v.fuel_type || 'Diesel',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const vehicleData = {
        registration_number: form.registration_number,
        model: form.model,
        type: form.type,
        max_load_capacity: Number(form.max_load_capacity),
        acquisition_cost: Number(form.acquisition_cost),
        current_odometer: Number(form.current_odometer),
        brand: form.brand,
        year: Number(form.year),
        region: form.region,
        fuel_type: form.fuel_type,
        status: form.status,
      };

      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehicleData);
      } else {
        await createVehicle(vehicleData);
      }
      
      setIsModalOpen(false);
      loadVehicles();
    } catch (err: any) {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: Vehicle['status']) => {
    await updateVehicleStatus(id, status);
    loadVehicles();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to retire this vehicle?')) {
      await updateVehicleStatus(id, 'RETIRED');
      loadVehicles();
    }
  };

  const handleExport = () => {
    window.open('http://localhost:5000/api/v1/analytics/export/vehicles/pdf', '_blank');
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.registration_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? v.status === statusFilter : true;
    const matchesType = typeFilter ? v.type === typeFilter : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  const statusBadge = (status: string) => {
    const configs: Record<string, { color: string; bg: string; label: string }> = {
      AVAILABLE: { color: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', label: 'Available' },
      ON_TRIP: { color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', label: 'On Trip' },
      IN_SHOP: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', label: 'In Shop' },
      RETIRED: { color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700', label: 'Retired' },
    };
    const cfg = configs[status] || configs.AVAILABLE;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full ${cfg.bg} px-2.5 py-0.5 text-[10px] font-bold ${cfg.color} border`}>
        {cfg.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">Fleet Asset Registry</h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Manage all registered vehicles in the fleet.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleExport} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-[#4d4847] dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-all">
            <Download className="h-4 w-4 text-gray-500" /> Export PDF
          </button>
          <button onClick={loadVehicles} className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-[#4d4847] dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-all">
            <RefreshCw className="h-4 w-4 text-gray-500" /> Refresh
          </button>
          <button onClick={handleOpenAdd} className="px-4 py-2 rounded-xl bg-[#714B67] text-xs font-extrabold text-white hover:bg-[#5e3b56] shadow-md flex items-center gap-1.5 transition-all">
            <Plus className="h-4 w-4" /> Add Vehicle
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: `${metrics.total} Vehicles`, icon: Bus, color: 'text-[#714B67]', bg: 'bg-purple-50' },
          { label: 'Available', value: `${metrics.available} Units`, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'In Service', value: `${metrics.inShop} Units`, icon: Wrench, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'On Route', value: `${metrics.onTrip} Trips`, icon: ShieldAlert, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((card, i) => (
          <div key={i} className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">{card.label}</span>
              <span className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 block mt-1">{card.value}</span>
            </div>
            <div className={`h-11 w-11 rounded-xl ${card.bg} flex items-center justify-center ${card.color} shrink-0`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by registration, model, or brand..."
              className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 pl-9 pr-4 text-xs focus:border-[#714B67] focus:outline-none focus:ring-1 focus:ring-[#714B67] transition-all font-medium"
            />
          </div>
          <select value={statusFilter || ''} onChange={(e) => setStatusFilter(e.target.value || null)} className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold">
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="IN_SHOP">In Shop</option>
            <option value="RETIRED">Retired</option>
          </select>
          <select value={typeFilter || ''} onChange={(e) => setTypeFilter(e.target.value || null)} className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold">
            <option value="">All Types</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Mini Truck">Mini Truck</option>
            <option value="Heavy Truck">Heavy Truck</option>
            <option value="Mini Pickup">Mini Pickup</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f5f3f3] dark:bg-zinc-800 text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Reg No</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Odometer</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae8e7] dark:divide-zinc-800">
              {isLoading ? (
                <tr><td colSpan={8} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" /></td></tr>
              ) : filteredVehicles.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-xs font-bold text-gray-500">No vehicles found.</td></tr>
              ) : (
                filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs font-medium text-[#4d4847] dark:text-zinc-300 transition-all group">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#714B67]">{v.registration_number}</td>
                    <td className="py-3.5 px-4 font-bold text-[#1b1c1c] dark:text-zinc-100">{v.brand && `${v.brand} `}{v.model}</td>
                    <td className="py-3.5 px-4">{v.type}</td>
                    <td className="py-3.5 px-4">{v.max_load_capacity} kg</td>
                    <td className="py-3.5 px-4">{v.current_odometer?.toLocaleString()} km</td>
                    <td className="py-3.5 px-4">₹{v.acquisition_cost?.toLocaleString()}</td>
                    <td className="py-3.5 px-4">{statusBadge(v.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEdit(v)} className="p-1.5 rounded bg-purple-50 text-[#714B67] hover:bg-[#714B67] hover:text-white transition-all" title="Edit"><Edit3 className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDelete(v.id)} className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all" title="Retire"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
              <h3 className="text-sm font-black">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Reg Number *</label>
                  <input required disabled={!!editingVehicle} value={form.registration_number} onChange={e => setForm({...form, registration_number: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Model *</label>
                  <input required value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1">
                    <option>Truck</option><option>Van</option><option>Mini Truck</option><option>Heavy Truck</option><option>Mini Pickup</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Brand</label>
                  <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" placeholder="Tata, Ashok Leyland..." />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Capacity (kg)</label>
                  <input type="number" required value={form.max_load_capacity} onChange={e => setForm({...form, max_load_capacity: Number(e.target.value)})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Odometer</label>
                  <input type="number" value={form.current_odometer} onChange={e => setForm({...form, current_odometer: Number(e.target.value)})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Cost (₹)</label>
                  <input type="number" value={form.acquisition_cost} onChange={e => setForm({...form, acquisition_cost: Number(e.target.value)})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value as Vehicle['status']})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1">
                    <option value="AVAILABLE">Available</option><option value="ON_TRIP">On Trip</option><option value="IN_SHOP">In Shop</option><option value="RETIRED">Retired</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Fuel Type</label>
                  <select value={form.fuel_type} onChange={e => setForm({...form, fuel_type: e.target.value})} className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs mt-1">
                    <option>Diesel</option><option>Petrol</option><option>CNG</option><option>Electric</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border text-xs font-bold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-[#714B67] text-white text-xs font-bold disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingVehicle ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};