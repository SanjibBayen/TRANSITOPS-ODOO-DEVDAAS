import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { KpiCard } from './KpiCard';
import { KpiGrid } from './KpiGrid';
import { Award, MapPin, Clock } from 'lucide-react';

export const DriverDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100">My Dashboard</h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400">Welcome back, {user?.name}</p>
      </div>

      <KpiGrid>
        <KpiCard title="Safety Score" value="95/100" icon={<Award className="h-5 w-5" />} color="#714B67" />
        <KpiCard title="Active Trips" value="1" icon={<MapPin className="h-5 w-5" />} color="#3B82F6" />
        <KpiCard title="Hours Today" value="6.5h" icon={<Clock className="h-5 w-5" />} color="#10B981" />
        <KpiCard title="Completed" value="124" icon={<Award className="h-5 w-5" />} color="#F59E0B" />
      </KpiGrid>
    </div>
  );
};