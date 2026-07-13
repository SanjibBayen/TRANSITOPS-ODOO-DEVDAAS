import React from 'react';
import { MapPin, Truck, User } from 'lucide-react';

interface TripCardProps {
  trip: any;
  onDispatch?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onDispatch }) => (
  <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 p-3 shadow-sm">
    <div className="text-xs font-bold text-[#714B67] mb-1">{trip.trip_number || trip.id}</div>
    <div className="text-xs flex items-center gap-1 text-gray-600 dark:text-zinc-400 mb-1">
      <MapPin className="h-3 w-3" />{trip.source} → {trip.destination}
    </div>
    <div className="text-[10px] text-gray-500">Cargo: {trip.cargo_weight}kg | {trip.planned_distance}km</div>
    <div className="flex items-center gap-2 mt-2 text-[10px]">
      <span className="flex items-center gap-1"><Truck className="h-3 w-3" />{trip.vehicle?.registration_number || 'N/A'}</span>
      <span className="flex items-center gap-1"><User className="h-3 w-3" />{trip.driver?.name || 'N/A'}</span>
    </div>
    {onDispatch && (
      <button onClick={onDispatch} className="mt-2 w-full py-1.5 bg-[#714B67] text-white text-[10px] font-bold rounded-lg hover:bg-[#5e3b56]">
        Dispatch
      </button>
    )}
  </div>
);