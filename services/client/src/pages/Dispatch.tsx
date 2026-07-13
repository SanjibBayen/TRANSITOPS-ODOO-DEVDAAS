import React, { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';
import { 
  Navigation, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck, 
  MapPin, Send, Trash2, RefreshCw, Truck, User, Loader2
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const COLUMNS: Record<string, { title: string; color: string }> = {
  DRAFT: { title: 'Draft', color: 'bg-gray-50 dark:bg-zinc-800' },
  DISPATCHED: { title: 'Dispatched', color: 'bg-blue-50 dark:bg-blue-900/20' },
  IN_PROGRESS: { title: 'In Progress', color: 'bg-amber-50 dark:bg-amber-900/20' },
  COMPLETED: { title: 'Completed', color: 'bg-green-50 dark:bg-green-900/20' },
};

export const Dispatch: React.FC = () => {
  const [resources, setResources] = useState<any>({ vehicles: [], drivers: [], pendingTrips: [] });
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [validation, setValidation] = useState<any>(null);

  // Form state
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [cargoWeight, setCargoWeight] = useState(0);
  const [cargoType, setCargoType] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [plannedDistance, setPlannedDistance] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [resRes, tripRes] = await Promise.all([
        api.get('/dispatch/available-resources'),
        api.get('/trips'),
      ]);
      setResources(resRes.data.data);
      setTrips(tripRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load dispatch data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreateAndDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId || !selectedDriverId) {
      toast.error('Select vehicle and driver');
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Create trip
      const tripRes = await api.post('/trips', {
        source,
        destination,
        cargo_weight: Number(cargoWeight),
        planned_distance: Number(plannedDistance),
        cargo_type: cargoType,
        vehicle_id: selectedVehicleId,
        driver_id: selectedDriverId,
      });

      const tripId = tripRes.data.data.id;

      // Step 2: Validate dispatch
      const validateRes = await api.post('/dispatch/validate', {
        trip_id: tripId,
        vehicle_id: selectedVehicleId,
        driver_id: selectedDriverId,
      });

      if (!validateRes.data.data.valid) {
        setValidation({ tripId, ...validateRes.data.data });
        toast.warning('Validation warnings. Trip saved as draft.');
        loadData();
        return;
      }

      // Step 3: Dispatch
      await api.post(`/dispatch/dispatch/${tripId}`);
      toast.success('Trip dispatched successfully!');
      setValidation(null);
      resetForm();
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Dispatch failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDispatch = async (tripId: string) => {
    try {
      const validateRes = await api.post('/dispatch/validate', {
        trip_id: tripId,
        vehicle_id: trips.find(t => t.id === tripId)?.vehicle_id,
        driver_id: trips.find(t => t.id === tripId)?.driver_id,
      });

      if (!validateRes.data.data.valid) {
        setValidation({ tripId, ...validateRes.data.data });
        return;
      }

      await api.post(`/dispatch/dispatch/${tripId}`);
      toast.success('Trip dispatched!');
      setValidation(null);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Dispatch failed');
    }
  };

  const handleStatusChange = async (tripId: string, status: string) => {
    try {
      await api.patch(`/trips/${tripId}/status`, { status });
      toast.success('Status updated');
      loadData();
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setSource('');
    setDestination('');
    setCargoWeight(0);
    setCargoType('');
    setSelectedVehicleId('');
    setSelectedDriverId('');
    setPlannedDistance(0);
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const tripId = result.draggableId;
    const newStatus = result.destination.droppableId;
    
    if (newStatus === 'DISPATCHED') {
      await handleQuickDispatch(tripId);
    } else {
      await handleStatusChange(tripId, newStatus);
    }
  };

  const tripsByStatus = (status: string) => trips.filter((t: any) => t.status === status);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100">Dispatch Board</h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Create trips, validate, and dispatch in real-time.</p>
        </div>
        <button onClick={loadData} className="px-4 py-2 rounded-xl bg-[#714B67] text-white text-xs font-bold flex items-center gap-1.5">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Validation Errors */}
      {validation && !validation.valid && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm">
            <AlertCircle className="h-4 w-4" /> Validation Failed
          </div>
          {validation.errors?.map((e: string, i: number) => (
            <div key={i} className="text-xs text-red-600 dark:text-red-400">• {e}</div>
          ))}
          <button onClick={() => setValidation(null)} className="text-xs text-red-500 underline mt-2">Dismiss</button>
        </div>
      )}

      {/* Create Trip Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 space-y-4">
        <h2 className="text-sm font-bold">New Dispatch Mission</h2>
        <form onSubmit={handleCreateAndDispatch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <input required value={source} onChange={e => setSource(e.target.value)} placeholder="Source *" className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
          <input required value={destination} onChange={e => setDestination(e.target.value)} placeholder="Destination *" className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
          <input type="number" required value={cargoWeight || ''} onChange={e => setCargoWeight(Number(e.target.value))} placeholder="Cargo Weight (kg) *" className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
          <input type="number" required value={plannedDistance || ''} onChange={e => setPlannedDistance(Number(e.target.value))} placeholder="Distance (km) *" className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
          <input value={cargoType} onChange={e => setCargoType(e.target.value)} placeholder="Cargo Type" className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs" />
          <select value={selectedVehicleId} onChange={e => setSelectedVehicleId(e.target.value)} className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs font-bold">
            <option value="">Select Vehicle *</option>
            {resources.vehicles?.map((v: any) => (
              <option key={v.id} value={v.id}>{v.registration_number} ({v.max_load_capacity}kg)</option>
            ))}
          </select>
          <select value={selectedDriverId} onChange={e => setSelectedDriverId(e.target.value)} className="rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 px-3 text-xs font-bold">
            <option value="">Select Driver *</option>
            {resources.drivers?.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name} (Score: {d.safety_score})</option>
            ))}
          </select>
          <button type="submit" disabled={isSubmitting} className="rounded-xl bg-[#714B67] text-white text-xs font-bold hover:bg-[#5e3b56] disabled:opacity-50 flex items-center justify-center gap-1.5">
            <Send className="h-4 w-4" /> {isSubmitting ? 'Dispatching...' : 'Create & Dispatch'}
          </button>
        </form>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(COLUMNS).map(([status, config]) => (
            <div key={status} className={`rounded-xl ${config.color} border border-gray-200 dark:border-zinc-700 p-4 min-h-[300px]`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">{config.title}</h3>
                <span className="text-[10px] font-bold bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full">{tripsByStatus(status).length}</span>
              </div>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2 min-h-[200px]">
                    {tripsByStatus(status).map((trip: any, index: number) => (
                      <Draggable key={trip.id} draggableId={trip.id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 p-3 shadow-sm">
                            <div className="text-xs font-bold text-[#714B67] mb-1">{trip.trip_number}</div>
                            <div className="text-xs flex items-center gap-1 text-gray-600 dark:text-zinc-400 mb-1"><MapPin className="h-3 w-3" />{trip.source} → {trip.destination}</div>
                            <div className="text-[10px] text-gray-500">Cargo: {trip.cargo_weight}kg | {trip.planned_distance}km</div>
                            <div className="flex items-center gap-2 mt-2 text-[10px]">
                              <span className="flex items-center gap-1"><Truck className="h-3 w-3" />{trip.vehicle?.registration_number || 'N/A'}</span>
                              <span className="flex items-center gap-1"><User className="h-3 w-3" />{trip.driver?.name || 'N/A'}</span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Available Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
          <h3 className="text-sm font-bold mb-3">Available Vehicles ({resources.vehicles?.length || 0})</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {resources.vehicles?.map((v: any) => (
              <div key={v.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50 dark:bg-zinc-800">
                <span className="font-bold">{v.registration_number}</span>
                <span className="text-gray-500">{v.model} | {v.max_load_capacity}kg</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
          <h3 className="text-sm font-bold mb-3">Available Drivers ({resources.drivers?.length || 0})</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {resources.drivers?.map((d: any) => (
              <div key={d.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50 dark:bg-zinc-800">
                <span className="font-bold">{d.name}</span>
                <span className="text-gray-500">★ {d.safety_score} | {d.license_category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};