import React from 'react';
import { KpiCard } from './KpiCard';
import { KpiGrid } from './KpiGrid';
import { ComplianceAlerts } from './ComplianceAlerts';
import { ShieldCheck, AlertTriangle, Users, CheckCircle2 } from 'lucide-react';

export const SafetyOfficerDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100">Compliance Center</h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400">Safety and compliance monitoring</p>
      </div>

      <KpiGrid>
        <KpiCard title="Active Drivers" value="15" icon={<Users className="h-5 w-5" />} color="#714B67" />
        <KpiCard title="Valid Licenses" value="13" icon={<CheckCircle2 className="h-5 w-5" />} color="#10B981" />
        <KpiCard title="Expiring Soon" value="2" icon={<AlertTriangle className="h-5 w-5" />} color="#F59E0B" />
        <KpiCard title="Compliance Rate" value="87%" icon={<ShieldCheck className="h-5 w-5" />} color="#3B82F6" />
      </KpiGrid>

      <ComplianceAlerts alerts={[
        { id: '1', type: 'LICENSE', message: 'Rajesh Kumar license expiring in 2 days', daysLeft: 2 },
        { id: '2', type: 'SCORE', message: 'Alex safety score dropped to 72', daysLeft: 0 },
      ]} />
    </div>
  );
};