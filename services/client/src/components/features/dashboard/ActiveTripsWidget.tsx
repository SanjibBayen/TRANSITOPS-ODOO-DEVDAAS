import React from 'react';
import { Navigation, MapPin } from 'lucide-react';

interface Trip {
  id: string;
  trip_number?: string;
  source: string;
  destination: string;
  status: string;
  vehicle?: { registration_number: string };
  driver?: { name: string };
}

interface ActiveTripsWidgetProps {
  trips: Trip[];
  onTripClick?: (trip: Trip) => void;
}

export const ActiveTripsWidget: React.FC<ActiveTripsWidgetProps> = ({ trips, onTripClick }) => (
  <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800">
    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
      <Navigation className="h-4 w-4 text-[#714B67]" /> Active Trips
    </h3>
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {trips.slice(0, 5).map(trip => (
        <div
          key={trip.id}
          onClick={() => onTripClick?.(trip)}
          className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-zinc-800 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span className="font-bold">{trip.source} → {trip.destination}</span>
          </div>
          <span className="text-[10px] text-gray-500">{trip.status}</span>
        </div>
      ))}
      {trips.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No active trips</p>}
    </div>
  </div>
);