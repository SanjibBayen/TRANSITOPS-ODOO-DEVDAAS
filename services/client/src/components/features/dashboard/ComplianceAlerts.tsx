import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Alert {
  id: string;
  type: string;
  message: string;
  driver?: string;
  daysLeft?: number;
}

interface ComplianceAlertsProps {
  alerts: Alert[];
}

export const ComplianceAlerts: React.FC<ComplianceAlertsProps> = ({ alerts }) => (
  <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800">
    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
      <AlertTriangle className="h-4 w-4 text-amber-500" /> Compliance Alerts
    </h3>
    <div className="space-y-2">
      {alerts.map(alert => (
        <div key={alert.id} className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-xs">
          <p className="font-bold text-amber-800 dark:text-amber-400">{alert.message}</p>
          {alert.daysLeft && <p className="text-amber-600 dark:text-amber-500 mt-0.5">{alert.daysLeft} days remaining</p>}
        </div>
      ))}
      {alerts.length === 0 && <p className="text-xs text-gray-400 text-center py-4">All compliant</p>}
    </div>
  </div>
);