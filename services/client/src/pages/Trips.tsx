import React, { useState } from 'react';
import { useTrips } from '../hooks/useTrips.ts';
import { Trip } from '../store/slices/tripSlice.ts';
import { 
  Navigation, CalendarCheck, ShieldCheck, MapPin, Eye, Trash2, Check, 
  TrendingUp, Compass, Calendar, DollarSign, Fuel, Map 
} from 'lucide-react';

export const Trips: React.FC = () => {
  const { trips, changeTripStatus, removeTrip, metrics } = useTrips();
  const [selectedTripId, setSelectedTripId] = useState<string | null>(trips[0]?.id || null);

  const activeSelectedTrip = trips.find(t => t.id === selectedTripId);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100 tracking-tight">
            Missions &amp; Transit Log
          </h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            Review all active route dispatches, completed delivery records, and cargo telematics.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 bg-[#eae8e7] dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-[#d1c3ca] dark:border-zinc-700">
            Dispatched Routes: {metrics.activeTripsCount} Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: All Trips List (5 cols) */}
        <div className="lg:col-span-5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800">
            <span className="text-xs font-bold text-[#1b1c1c] dark:text-zinc-100 uppercase tracking-wider block">
              Trip Registry Log
            </span>
          </div>

          <div className="divide-y divide-[#eae8e7] dark:divide-zinc-800 overflow-y-auto max-h-[60vh]">
            {trips.length === 0 ? (
              <div className="p-6 text-center text-xs font-bold text-gray-500 dark:text-zinc-400">
                No dispatched missions in registry.
              </div>
            ) : (
              trips.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => setSelectedTripId(trip.id)}
                  className={`w-full text-left p-4.5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all flex justify-between items-start border-l-4 ${
                    selectedTripId === trip.id 
                      ? 'bg-purple-50/40 border-[#714B67]' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-[#714B67]">
                        {trip.id}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-semibold">
                        {trip.startTime}
                      </span>
                    </div>
                    <span className="block text-xs font-extrabold text-[#1b1c1c] dark:text-zinc-100">
                      {trip.vehicleName}
                    </span>
                    <span className="block text-[10px] text-gray-500 dark:text-zinc-400 font-bold">
                      {trip.source} → {trip.destination}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-2 text-right">
                    {trip.status === 'On Trip' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#1c3830] px-2 py-0.5 text-[9px] font-bold text-[#34d399] uppercase border border-[#0d503c]">
                        ON TRIP
                      </span>
                    ) : trip.status === 'Completed' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#34451e]/10 px-2 py-0.5 text-[9px] font-bold text-[#34451e] uppercase border border-[#34451e]/20">
                        COMPLETED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-600 uppercase border border-red-200">
                        {trip.status}
                      </span>
                    )}
                    <span className="text-[10px] font-extrabold text-[#1b1c1c] dark:text-zinc-100">
                      {trip.distanceKm} km
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Selected Trip Details & Timeline Visual (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeSelectedTrip ? (
            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 shadow-sm space-y-5">
              
              {/* Card Header */}
              <div className="flex justify-between items-start border-b border-gray-200 dark:border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-[#1b1c1c] dark:text-zinc-100">
                      Mission: {activeSelectedTrip.id}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-bold bg-[#eae8e7] dark:bg-zinc-800 px-2 py-0.5 rounded">
                      Cargo: {activeSelectedTrip.cargoWeightKg} kg
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 mt-0.5">
                    Assigned Pilot: <span className="text-[#1b1c1c] dark:text-zinc-100">{activeSelectedTrip.driverName}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {activeSelectedTrip.status === 'On Trip' && (
                    <button
                      onClick={() => changeTripStatus(activeSelectedTrip.id, 'Completed')}
                      className="px-3 py-1.5 rounded-lg bg-[#e6fcf5] border border-emerald-200 text-[#006a68] text-xs font-bold hover:bg-[#006a68] hover:text-white transition-all cursor-pointer"
                    >
                      Complete Trip
                    </button>
                  )}
                  <button
                    onClick={() => removeTrip(activeSelectedTrip.id)}
                    className="p-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 flex items-center gap-3">
                  <Map className="h-5 w-5 text-[#714B67]" />
                  <div>
                    <span className="block text-[9px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Distance</span>
                    <span className="text-sm font-extrabold text-[#1b1c1c] dark:text-zinc-100">{activeSelectedTrip.distanceKm} km</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 flex items-center gap-3">
                  <Fuel className="h-5 w-5 text-[#006a68]" />
                  <div>
                    <span className="block text-[9px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Fuel Used</span>
                    <span className="text-sm font-extrabold text-[#1b1c1c] dark:text-zinc-100">{activeSelectedTrip.fuelUsedLiters || '--'} Liters</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-[#829c62]" />
                  <div>
                    <span className="block text-[9px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Est Expense</span>
                    <span className="text-sm font-extrabold text-[#1b1c1c] dark:text-zinc-100">₹{(activeSelectedTrip.expenseCost || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Beautiful Dispatch Route Timeline (reproducing Trip Timeline) */}
              <div className="space-y-4 pt-2">
                <span className="text-[10px] font-extrabold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">
                  Route Stage Status
                </span>

                <div className="relative pl-6 space-y-6 border-l border-gray-200 dark:border-zinc-800">
                  
                  {/* Stage 1: Dispatched / Source Hub */}
                  <div className="relative">
                    <span className="absolute -left-[29px] top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#829c62] text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-[#1b1c1c] dark:text-zinc-100">Mission Outbound (Source Hub)</span>
                      <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-400">Depot: {activeSelectedTrip.source}</p>
                    </div>
                  </div>

                  {/* Stage 2: En Route (Current Spot) */}
                  <div className="relative">
                    <span className={`absolute -left-[29px] top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full text-white ${
                      activeSelectedTrip.status === 'On Trip' ? 'bg-[#714B67] pulse-dot-teal' : 'bg-[#829c62]'
                    }`}>
                      {activeSelectedTrip.status === 'Completed' ? <Check className="h-3 w-3" /> : <Navigation className="h-2.5 w-2.5" />}
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-[#1b1c1c] dark:text-zinc-100">Transit Tracker Location</span>
                      <p className="text-[10px] font-bold text-[#006a68] flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        Current: {activeSelectedTrip.currentLocation}
                      </p>
                    </div>
                  </div>

                  {/* Stage 3: Arrived / Destination Hub */}
                  <div className="relative">
                    <span className={`absolute -left-[29px] top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full text-white ${
                      activeSelectedTrip.status === 'Completed' ? 'bg-[#829c62]' : 'bg-gray-200 dark:bg-zinc-700'
                    }`}>
                      {activeSelectedTrip.status === 'Completed' ? <Check className="h-3 w-3" /> : <Calendar className="h-2.5 w-2.5 text-gray-500 dark:text-zinc-400" />}
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-[#1b1c1c] dark:text-zinc-100">Arrival Clearances (Destination Hub)</span>
                      <p className="text-[10px] font-bold text-gray-500 dark:text-zinc-400">Depot: {activeSelectedTrip.destination}</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 text-center text-xs font-bold text-gray-500 dark:text-zinc-400">
              Select a mission from the registry to view detailed route and fuel parameters.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
