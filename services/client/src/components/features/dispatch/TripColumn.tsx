import React from 'react';
import { TripCard } from './TripCard';

interface TripColumnProps {
  title: string;
  trips: any[];
  color?: string;
  onAction?: (tripId: string, action: string) => void;
}

export const TripColumn: React.FC<TripColumnProps> = ({ title, trips, color = 'bg-gray-50 dark:bg-zinc-800', onAction }) => (
  <div className={`rounded-xl ${color} border border-gray-200 dark:border-zinc-700 p-4 min-h-[250px]`}>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold">{title}</h3>
      <span className="text-[10px] font-bold bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full">{trips.length}</span>
    </div>
    <div className="space-y-2">
      {trips.map(trip => (
        <TripCard key={trip.id} trip={trip} onDispatch={onAction ? () => onAction(trip.id, 'DISPATCHED') : undefined} />
      ))}
    </div>
  </div>
);