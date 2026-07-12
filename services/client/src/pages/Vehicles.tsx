import React, { useState, useEffect } from 'react';
import { useVehicles } from '../hooks/useVehicles.ts';
import { Vehicle, addVehicle, updateVehicle, deleteVehicle } from '../store/slices/vehicleSlice.ts';
import { useDispatch } from 'react-redux';
import { 
  Bus, CheckCircle2, Wrench, ShieldAlert, Search, SlidersHorizontal, 
  Download, Upload, Settings2, Plus, X, Trash2, Edit3, Eye, FileText 
} from 'lucide-react';

export const Vehicles: React.FC = () => {
  const dispatch = useDispatch();
  const { vehicles, isLoading, loadVehicles, createNewVehicle, editVehicle, removeVehicle, metrics } = useVehicles();

  useEffect(() => {
    loadVehicles();
  }, []);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>('Available'); // Default Available filter from Mockup 2
  const [typeFilter, setTypeFilter] = useState<string | null>('Van'); // Default Van filter

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form Fields
  const [regNo, setRegNo] = useState('');
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState<'Van' | 'Truck (Heavy)' | 'Refrigerated' | 'Flatbed' | 'MUV'>('Van');
  const [capacity, setCapacity] = useState(600);
  const [odometer, setOdometer] = useState(50000);
  const [cost, setCost] = useState(800000);
  const [status, setStatus] = useState<Vehicle['status']>('Available');
  const [notes, setNotes] = useState('');

  // Open modal to add
  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setRegNo('GJ01BC' + Math.floor(1000 + Math.random() * 9000));
    setName('VAN-0' + (vehicles.length + 1));
    setModel('Transit Max');
    setType('Van');
    setCapacity(800);
    setOdometer(12000);
    setCost(850000);
    setStatus('Available');
    setNotes('Excellent fleet standard diagnostics checked.');
    setIsModalOpen(true);
  };

  // Open modal to edit
  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setRegNo(v.regNo);
    setName(v.name);
    setModel(v.model);
    setType(v.type);
    setCapacity(v.capacityKg);
    setOdometer(v.odometer);
    setCost(v.acqCost);
    setStatus(v.status);
    setNotes(v.notes || '');
    setIsModalOpen(true);
  };

  // Submit form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: Vehicle = {
      regNo,
      name,
      model,
      type,
      capacityKg: Number(capacity),
      odometer: Number(odometer),
      acqCost: Number(cost),
      status,
      notes,
      lastServiceDate: editingVehicle?.lastServiceDate || '2026-07-01',
      insuranceExpiry: editingVehicle?.insuranceExpiry || '2027-07-11',
      fitnessCertificateExpiry: editingVehicle?.fitnessCertificateExpiry || '2027-07-11'
    };

    if (editingVehicle) {
      editVehicle(newVehicle);
    } else {
      createNewVehicle(newVehicle);
    }
    setIsModalOpen(false);
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? v.status === statusFilter : true;
    const matchesType = typeFilter ? v.type === typeFilter : true;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      
      {/* Title & Actions Bar (from Mockup 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">
            Fleet Asset Registry
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Registry logs of heavy containers, refrigerated vehicles, and light cargo vans.
          </p>
        </div>
        
        {/* Actions Button Row */}
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-[#4d4847] dark:text-zinc-300 hover:bg-[#f5f3f3] dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-all cursor-pointer">
            <Settings2 className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
            Columns
          </button>
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-[#4d4847] dark:text-zinc-300 hover:bg-[#f5f3f3] dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-all cursor-pointer">
            <Download className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
            Export
          </button>
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-[#4d4847] dark:text-zinc-300 hover:bg-[#f5f3f3] dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-all cursor-pointer">
            <Upload className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
            Bulk Upload
          </button>
          <button 
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#714B67] text-xs font-extrabold text-white hover:bg-[#5e3b56] shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* KPI Cards top grid (recreating mockup 2 top layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Assets */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4.5 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 tracking-wider uppercase">
              Total Assets
            </span>
            <span className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight block mt-1">
              {metrics.totalAssets} Vehicles
            </span>
            <span className="text-[10px] text-[#829c62] font-semibold mt-1 block">
              +3.4% Acquisition rate
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-purple-50 flex items-center justify-center text-[#714B67] shrink-0">
            <Bus className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Card 2: Available */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4.5 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 tracking-wider uppercase">
              Available Units
            </span>
            <span className="text-2xl font-black text-[#829c62] tracking-tight block mt-1">
              {metrics.availableCount} Units
            </span>
            <span className="text-[10px] text-[#829c62] font-semibold mt-1 block">
              92% Readiness rate
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-[#e6fcf5] flex items-center justify-center text-[#006a68] shrink-0">
            <CheckCircle2 className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Card 3: In Shop */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4.5 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 tracking-wider uppercase">
              In Service Shop
            </span>
            <span className="text-2xl font-black text-red-600 tracking-tight block mt-1">
              {metrics.inShopCount} Units
            </span>
            <span className="text-[10px] text-red-500 font-semibold mt-1 block">
              Down -2.5% this month
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
            <Wrench className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Card 4: Active Route */}
        <div className="rounded-xl bg-white dark:bg-zinc-900 p-4.5 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 tracking-wider uppercase">
              Active Routes
            </span>
            <span className="text-2xl font-black text-[#006a68] tracking-tight block mt-1">
              {metrics.activeCount} Trips
            </span>
            <span className="text-[10px] text-[#006a68] font-semibold mt-1 block">
              88% Route density
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-[#fdfafc] dark:bg-[#714B67]/20 flex items-center justify-center text-[#714B67] shrink-0">
            <ShieldAlert className="h-5.5 w-5.5" />
          </div>
        </div>

      </div>

      {/* Search & Complex Filter Bar (recreating Mockup 2 layout) */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4.5 shadow-sm space-y-3">
        
        {/* Click-removable Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-gray-500 dark:text-zinc-400 tracking-wider mr-1">
            Active Query:
          </span>
          {statusFilter && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#eae8e7] dark:bg-zinc-800 px-2.5 py-1 text-xs font-bold text-[#1b1c1c] dark:text-zinc-100">
              Status: {statusFilter}
              <button 
                onClick={() => setStatusFilter(null)}
                className="hover:bg-gray-300 rounded-full h-4 w-4 flex items-center justify-center text-[9px] cursor-pointer"
              >
                ✕
              </button>
            </span>
          )}
          {typeFilter && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#eae8e7] dark:bg-zinc-800 px-2.5 py-1 text-xs font-bold text-[#1b1c1c] dark:text-zinc-100">
              Type: {typeFilter}
              <button 
                onClick={() => setTypeFilter(null)}
                className="hover:bg-gray-300 rounded-full h-4 w-4 flex items-center justify-center text-[9px] cursor-pointer"
              >
                ✕
              </button>
            </span>
          )}
          {!statusFilter && !typeFilter && (
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 italic">
              All vehicles displayed. Use filters below to narrow search.
            </span>
          )}
        </div>

        {/* Input & Quick Filter toggles */}
        <div className="flex flex-col lg:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to filter or build complex query..."
              className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 pl-9 pr-4 text-xs text-[#1b1c1c] dark:text-zinc-100 placeholder-[#80747a] dark:placeholder-zinc-500 focus:border-[#714B67] focus:bg-white dark:focus:bg-zinc-900 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-[#714B67] transition-all font-medium"
            />
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Filter dropdown triggers */}
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold text-[#4d4847] dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#714B67]"
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="In Shop">In Shop</option>
              <option value="Retired">Retired</option>
            </select>

            <select
              value={typeFilter || ''}
              onChange={(e) => setTypeFilter(e.target.value || null)}
              className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold text-[#4d4847] dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-[#714B67]"
            >
              <option value="">All Types</option>
              <option value="Van">Van</option>
              <option value="Truck (Heavy)">Truck (Heavy)</option>
              <option value="Refrigerated">Refrigerated</option>
              <option value="Flatbed">Flatbed</option>
              <option value="MUV">MUV</option>
            </select>

            <button className="px-3.5 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 text-xs font-bold text-[#4d4847] dark:text-zinc-300 hover:bg-[#f5f3f3] dark:hover:bg-zinc-800 transition-all flex items-center gap-1.5 cursor-pointer">
              <SlidersHorizontal className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
              Save View
            </button>
          </div>
        </div>

      </div>

      {/* Vehicle Data Table (from Mockup 2) */}
      <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col justify-between">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f5f3f3] dark:bg-zinc-800 text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800">
                <th className="py-3 px-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300 dark:border-zinc-700 text-[#714B67] focus:ring-[#714B67]" />
                </th>
                <th className="py-3 px-4">Reg No</th>
                <th className="py-3 px-4">Name / Model</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Odometer</th>
                <th className="py-3 px-4">Acq Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae8e7] dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs font-bold text-gray-500 dark:text-zinc-400">
                    Loading vehicles...
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs font-bold text-gray-500 dark:text-zinc-400">
                    No vehicles found matching current query filters.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.regNo} className="hover:bg-gray-50 dark:hover:bg-zinc-800 text-xs font-medium text-[#4d4847] dark:text-zinc-300 transition-all group">
                    <td className="py-3.5 px-4">
                      <input type="checkbox" className="rounded border-gray-300 dark:border-zinc-700 text-[#714B67] focus:ring-[#714B67]" />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#714B67] bg-[#fdfafc] dark:bg-[#714B67]/20 rounded-md">
                      {vehicle.regNo}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-extrabold text-[#1b1c1c] dark:text-zinc-100 block">
                          {vehicle.name} {vehicle.model}
                        </span>
                        {vehicle.notes && (
                          <span className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 block truncate max-w-xs font-semibold">
                            {vehicle.notes}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1b1c1c] dark:text-zinc-100">
                      {vehicle.type}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#4d4847] dark:text-zinc-300">
                      {vehicle.capacityKg} kg
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#4d4847] dark:text-zinc-300">
                      {vehicle.odometer.toLocaleString()} km
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1b1c1c] dark:text-zinc-100">
                      ₹{vehicle.acqCost.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      {vehicle.status === 'Available' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#f4f7f4] px-2.5 py-0.5 text-[10px] font-bold text-[#34451e] border border-[#d3dfd3]">
                          Available
                        </span>
                      ) : vehicle.status === 'On Trip' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#e6fcf5] px-2.5 py-0.5 text-[10px] font-bold text-[#006a68] border border-[#006a68]/20">
                          On Trip
                        </span>
                      ) : vehicle.status === 'In Shop' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-600 border border-red-200">
                          In Shop
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 dark:bg-zinc-900/50 px-2.5 py-0.5 text-[10px] font-bold text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800">
                          Retired
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(vehicle)}
                          className="p-1 rounded bg-[#fdfafc] dark:bg-[#714B67]/20 text-[#714B67] border border-gray-200 dark:border-zinc-800 hover:border-[#714B67] transition-all cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeVehicle(vehicle.regNo)}
                          className="p-1 rounded bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footnote Rule (from Mockup 2 bottom text) */}
        <div className="p-4 bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5 text-[10px]">
            <FileText className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
            Fleet Regulation Rule: Vehicle Registration numbers must be unique, and odometers must undergo service sync every 10,000 km.
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span>Showing 1-{filteredVehicles.length} of {filteredVehicles.length} vehicles</span>
          </div>
        </div>

      </div>

      {/* Add / Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-2xl max-w-lg w-full overflow-hidden transform transition-all animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4.5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
              <h3 className="text-sm font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">
                {editingVehicle ? 'Update Asset Records' : 'Add New Fleet Asset'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-[#eae8e7] dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-all cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit}>
              <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Registration Number */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!!editingVehicle}
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      placeholder="e.g. GJ01AB1234"
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 placeholder-[#80747a] dark:placeholder-zinc-500 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>

                  {/* Asset Name Code */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Asset Identifier (Code)
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. VAN-05"
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 placeholder-[#80747a] dark:placeholder-zinc-500 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Model */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Model / Make
                    </label>
                    <input
                      type="text"
                      required
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g. Transit Prime"
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 placeholder-[#80747a] dark:placeholder-zinc-500 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>

                  {/* Vehicle Type */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Category Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 focus:border-[#714B67] focus:outline-none transition-all font-bold"
                    >
                      <option value="Van">Van</option>
                      <option value="Truck (Heavy)">Truck (Heavy)</option>
                      <option value="Refrigerated">Refrigerated</option>
                      <option value="Flatbed">Flatbed</option>
                      <option value="MUV">MUV</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Capacity */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Capacity (kg)
                    </label>
                    <input
                      type="number"
                      required
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>

                  {/* Odometer */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Odometer (km)
                    </label>
                    <input
                      type="number"
                      required
                      value={odometer}
                      onChange={(e) => setOdometer(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>

                  {/* Acquisition cost */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Cost (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={cost}
                      onChange={(e) => setCost(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Status Selection */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Asset Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 focus:border-[#714B67] focus:outline-none transition-all font-bold"
                    >
                      <option value="Available">Available</option>
                      <option value="On Trip">On Trip</option>
                      <option value="In Shop">In Shop</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>

                  {/* Notes / Remarks */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-wider text-gray-500 dark:text-zinc-400 uppercase">
                      Remarks / Notes
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Telematics sync passed"
                      className="w-full rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 py-2 px-3 text-xs text-[#1b1c1c] dark:text-zinc-100 placeholder-[#80747a] dark:placeholder-zinc-500 focus:border-[#714B67] focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="p-4 bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-[#4d4847] dark:text-zinc-300 hover:bg-[#f5f3f3] dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 rounded-xl bg-[#714B67] text-xs font-extrabold text-white hover:bg-[#5e3b56] shadow-md transition-all cursor-pointer"
                >
                  {editingVehicle ? 'Save Asset Changes' : 'Acquire New Asset'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
