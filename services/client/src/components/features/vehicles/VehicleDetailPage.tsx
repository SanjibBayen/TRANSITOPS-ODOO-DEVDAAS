import React from 'react';
import { Truck, MapPin, Gauge, IndianRupee, Calendar } from 'lucide-react';
import { VehicleStatusBadge } from './VehicleStatusBadge';
import { DocumentList } from '../documents/DocumentList';

interface VehicleDetailPageProps {
  vehicle: any;
  onBack: () => void;
}

export const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({ vehicle, onBack }) => (
  <div className="space-y-4">
    <button onClick={onBack} className="text-xs text-[#714B67] font-bold hover:underline">← Back</button>
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-[#714B67]"><Truck className="h-6 w-6" /></div>
          <div>
            <h2 className="text-lg font-bold">{vehicle?.registration_number}</h2>
            <p className="text-xs text-gray-500">{vehicle?.brand} {vehicle?.model}</p>
          </div>
        </div>
        <VehicleStatusBadge status={vehicle?.status} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-6">
        <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-gray-400" />{vehicle?.region || 'N/A'}</div>
        <div className="flex items-center gap-2"><Gauge className="h-3 w-3 text-gray-400" />{vehicle?.current_odometer?.toLocaleString()} km</div>
        <div className="flex items-center gap-2"><IndianRupee className="h-3 w-3 text-gray-400" />₹{vehicle?.acquisition_cost?.toLocaleString()}</div>
        <div className="flex items-center gap-2"><Calendar className="h-3 w-3 text-gray-400" />{vehicle?.year || 'N/A'}</div>
      </div>
      <DocumentList vehicleId={vehicle?.id} />
    </div>
  </div>
);