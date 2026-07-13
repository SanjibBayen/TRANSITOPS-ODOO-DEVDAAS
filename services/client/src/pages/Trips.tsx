import React, { useEffect, useState, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';
import { 
  Navigation, MapPin, Check, Trash2, Calendar, DollarSign, 
  Truck, User, Loader2, RefreshCw, Search
} from 'lucide-react';

export const Trips: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadTrips = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/trips');
      setTrips(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load trips');
      toast.error('Failed to load trips');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadTrips(); }, [loadTrips]);

  const handleStatusChange = async (tripId: string, status: string) => {
    try {
      await api.patch(`/trips/${tripId}/status`, { status });
      toast.success(`Trip ${status.toLowerCase()}`);
      loadTrips();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update trip');
    }
  };

  const handleCompleteTrip = async (tripId: string) => {
    try {
      await api.patch(`/trips/${tripId}/complete`, {});
      toast.success('Trip completed');
      loadTrips();
    } catch (err: any) {
      toast.error('Failed to complete trip');
    }
  };

  const filteredTrips = trips.filter(t => {
    const matchesSearch = t.trip_number?.toLowerCase().includes(search.toLowerCase()) ||
      t.source?.toLowerCase().includes(search.toLowerCase()) ||
      t.destination?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? t.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const activeTrip = trips.find(t => t.id === selectedTripId);

  const metrics = {
    total: trips.length,
    active: trips.filter(t => t.status === 'DISPATCHED' || t.status === 'IN_PROGRESS').length,
    completed: trips.filter(t => t.status === 'COMPLETED').length,
    draft: trips.filter(t => t.status === 'DRAFT').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#714B67]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
        <button onClick={loadTrips} className="px-4 py-2 rounded-xl bg-[#714B67] text-white text-xs font-bold flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">Trips & Missions</h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            {metrics.active} active | {metrics.completed} completed | {metrics.draft} drafts
          </p>
        </div>
        <button onClick={loadTrips} className="px-4 py-2 rounded-xl bg-[#714B67] text-white text-xs font-bold flex items-center gap-1.5">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trip List */}
        <div className="lg:col-span-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-zinc-800 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search trips..." className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 py-2 pl-9 pr-4 text-xs" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-bold">
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="divide-y divide-[#eae8e7] dark:divide-zinc-800 max-h-[60vh] overflow-y-auto">
            {filteredTrips.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500">No trips found.</div>
            ) : (
              filteredTrips.map(trip => (
                <button
                  key={trip.id}
                  onClick={() => setSelectedTripId(trip.id)}
                  className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all border-l-4 ${
                    selectedTripId === trip.id ? 'border-[#714B67] bg-purple-50/40' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-black text-[#714B67]">{trip.trip_number}</span>
                      <p className="text-xs font-bold mt-0.5">{trip.source} → {trip.destination}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1"><Truck className="h-3 w-3" />{trip.vehicle?.registration_number || 'N/A'}</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{trip.driver?.name || 'N/A'}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      trip.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
                      trip.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700' :
                      trip.status === 'DISPATCHED' ? 'bg-blue-50 text-blue-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>{trip.status}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Trip Detail */}
        <div className="lg:col-span-7">
          {activeTrip ? (
            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 shadow-sm space-y-5">
              
              <div className="flex justify-between items-start border-b border-gray-200 dark:border-zinc-800 pb-4">
                <div>
                  <h2 className="text-lg font-black">{activeTrip.trip_number}</h2>
                  <p className="text-xs text-gray-500 mt-1">{activeTrip.source} → {activeTrip.destination}</p>
                </div>
                <div className="flex items-center gap-2">
                  {(activeTrip.status === 'DISPATCHED' || activeTrip.status === 'IN_PROGRESS') && (
                    <button onClick={() => handleCompleteTrip(activeTrip.id)} className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-bold hover:bg-green-600 hover:text-white">
                      Complete
                    </button>
                  )}
                  {activeTrip.status === 'DRAFT' && (
                    <button onClick={() => handleStatusChange(activeTrip.id, 'DISPATCHED')} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-600 hover:text-white">
                      Dispatch
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg text-center">
                  <span className="block text-[9px] text-gray-500 uppercase">Cargo</span>
                  <span className="text-sm font-extrabold">{activeTrip.cargo_weight}kg</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg text-center">
                  <span className="block text-[9px] text-gray-500 uppercase">Distance</span>
                  <span className="text-sm font-extrabold">{activeTrip.planned_distance}km</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg text-center">
                  <span className="block text-[9px] text-gray-500 uppercase">Revenue</span>
                  <span className="text-sm font-extrabold">₹{Number(activeTrip.revenue || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative pl-6 space-y-6 border-l border-gray-200 dark:border-zinc-800">
                {['DRAFT', 'DISPATCHED', 'IN_PROGRESS', 'COMPLETED'].map((stage, i) => {
                  const isComplete = ['DRAFT', 'DISPATCHED', 'IN_PROGRESS', 'COMPLETED'].indexOf(activeTrip.status) >= i;
                  return (
                    <div key={stage} className="relative">
                      <span className={`absolute -left-[29px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-white ${isComplete ? 'bg-green-500' : 'bg-gray-200'}`}>
                        {isComplete ? <Check className="h-2.5 w-2.5" /> : null}
                      </span>
                      <span className={`text-xs font-bold ${isComplete ? 'text-gray-900 dark:text-zinc-100' : 'text-gray-400'}`}>
                        {stage.replace('_', ' ')}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 text-center text-xs text-gray-500">
              Select a trip to view details
            </div>
          )}
        </div>

      </div>
    </div>
  );
};