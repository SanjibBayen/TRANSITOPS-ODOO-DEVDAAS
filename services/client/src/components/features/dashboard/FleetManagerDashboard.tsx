import React, { useEffect } from 'react';
import { useDashboard } from '../../../hooks/useDashboard';
import { KpiCard } from './KpiCard';
import { KpiGrid } from './KpiGrid';
import { FleetStatusChart } from './FleetStatusChart';
import { ActiveTripsWidget } from './ActiveTripsWidget';
import { ComplianceAlerts } from './ComplianceAlerts';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { Truck, CheckCircle2, Wrench, Navigation, AlertTriangle } from 'lucide-react';

export const FleetManagerDashboard: React.FC = () => {
  const { data, isLoading, refresh } = useDashboard();

  if (isLoading) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100">Fleet Command Center</h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Real-time fleet operations overview</p>
        </div>
      </div>

      <KpiGrid>
        <KpiCard title="Active Vehicles" value={data?.vehicles?.onTrip || 0} icon={<Truck className="h-5 w-5" />} color="#714B67" />
        <KpiCard title="Available" value={data?.vehicles?.available || 0} icon={<CheckCircle2 className="h-5 w-5" />} color="#10B981" />
        <KpiCard title="In Shop" value={data?.vehicles?.inShop || 0} icon={<Wrench className="h-5 w-5" />} color="#EF4444" />
        <KpiCard title="Fleet Utilization" value={`${data?.vehicles?.utilization || 0}%`} icon={<Navigation className="h-5 w-5" />} color="#3B82F6" />
      </KpiGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FleetStatusChart data={[
          { name: 'Available', value: data?.vehicles?.available || 0, color: '#10B981' },
          { name: 'On Trip', value: data?.vehicles?.onTrip || 0, color: '#3B82F6' },
          { name: 'In Shop', value: data?.vehicles?.inShop || 0, color: '#EF4444' },
        ]} />
        <ComplianceAlerts alerts={data?.alerts?.expiringLicenses ? [{ id: '1', type: 'LICENSE', message: `${data.alerts.expiringLicenses} licenses expiring soon`, daysLeft: 7 }] : []} />
      </div>
    </div>
  );
};