import React from 'react';
import { MapPin, Truck, User, Calendar, Clock } from 'lucide-react';
import { TripStatusBadge } from './TripStatusBadge';
import { TripTimeline } from './TripTimeline';

interface TripDetailPageProps {
  trip: any;
  onBack: () => void;
}

export const TripDetailPage: React.FC<TripDetailPageProps> = ({ trip, onBack }) => (
  <div className="space-y-4">
    <button onClick={onBack} className="text-xs text-[#714B67] font-bold hover:underline">← Back to trips</button>
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{trip?.trip_number}</h2>
        <TripStatusBadge status={trip?.status} />
      </div>
      <div className="grid grid-cols-2 gap-4 text-xs mb-6">
        <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-gray-400" />{trip?.source} → {trip?.destination}</div>
        <div className="flex items-center gap-2"><Truck className="h-3 w-3 text-gray-400" />{trip?.vehicle?.registration_number}</div>
        <div className="flex items-center gap-2"><User className="h-3 w-3 text-gray-400" />{trip?.driver?.name}</div>
        <div className="flex items-center gap-2"><Calendar className="h-3 w-3 text-gray-400" />{trip?.created_at ? new Date(trip.created_at).toLocaleDateString() : '-'}</div>
      </div>
      <TripTimeline status={trip?.status} />
    </div>
  </div>
);