import React from 'react';
import { Truck, User } from 'lucide-react';
import { VehiclePool } from './VehiclePool';
import { DriverPool } from './DriverPool';

export const DispatchBoard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <VehiclePool />
      <DriverPool />
    </div>
  );
};