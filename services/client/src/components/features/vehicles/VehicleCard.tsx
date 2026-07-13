import React from 'react';
import { Truck } from 'lucide-react';

interface VehicleCardProps {
  vehicle: {
    registration_number: string;
    model: string;
    type: string;
    status: string;
    max_load_capacity: number;
  };
  onClick?: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onClick }) => (
  <div onClick={onClick} className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:shadow-md transition-all">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center text-[#714B67]">
        <Truck className="h-5 w-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold">{vehicle.registration_number}</h4>
        <p className="text-xs text-gray-500">{vehicle.model}</p>
      </div>
    </div>
    <div className="flex items-center justify-between text-xs text-gray-500">
      <span>{vehicle.type}</span>
      <span>{vehicle.max_load_capacity}kg</span>
    </div>
  </div>
);